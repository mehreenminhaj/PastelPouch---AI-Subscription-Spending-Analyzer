/**
 * Client-Side Web Crypto AES-GCM 256-bit Vault Encryption
 * Ensures financial transactions and subscription notes are stored encrypted
 * with user PIN/Passphrase using PBKDF2 key derivation.
 */

const SALT_STORAGE_KEY = 'pastelpouch_vault_salt';
const ITERATIONS = 100000;

// Convert buffer to hex string
function buf2hex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map(x => x.toString(16).padStart(2, '0'))
    .join('');
}

// Convert hex string to buffer
function hex2buf(hexString: string): Uint8Array {
  const bytes = new Uint8Array(Math.ceil(hexString.length / 2));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return bytes;
}

// Get or create persistent salt
function getOrCreateSalt(): Uint8Array {
  const stored = localStorage.getItem(SALT_STORAGE_KEY);
  if (stored) {
    return hex2buf(stored);
  }
  const newSalt = window.crypto.getRandomValues(new Uint8Array(16));
  localStorage.setItem(SALT_STORAGE_KEY, buf2hex(newSalt.buffer));
  return newSalt;
}

// Derive CryptoKey from user PIN
async function deriveKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(pin),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: ITERATIONS,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function encryptData(data: any, pin: string): Promise<string> {
  try {
    const salt = getOrCreateSalt();
    const key = await deriveKey(pin, salt);
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const enc = new TextEncoder();
    const jsonString = JSON.stringify(data);

    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      enc.encode(jsonString)
    );

    // Bundle iv + ciphertext into a single hex string
    const combined = {
      iv: buf2hex(iv.buffer),
      data: buf2hex(ciphertext),
      version: 'AES-256-GCM-v1',
      timestamp: Date.now(),
    };

    return JSON.stringify(combined);
  } catch (err) {
    console.error('Encryption failed:', err);
    throw new Error('Failed to encrypt vault data');
  }
}

export async function decryptData(encryptedPayload: string, pin: string): Promise<any> {
  try {
    const salt = getOrCreateSalt();
    const parsed = JSON.parse(encryptedPayload);
    if (!parsed.iv || !parsed.data) {
      throw new Error('Invalid encrypted envelope format');
    }

    const key = await deriveKey(pin, salt);
    const iv = hex2buf(parsed.iv);
    const ciphertext = hex2buf(parsed.data);

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as unknown as BufferSource,
      },
      key,
      ciphertext as unknown as BufferSource
    );

    const dec = new TextDecoder();
    return JSON.parse(dec.decode(decrypted));
  } catch (err) {
    console.error('Decryption failed:', err);
    throw new Error('Incorrect PIN or corrupted encrypted data');
  }
}
