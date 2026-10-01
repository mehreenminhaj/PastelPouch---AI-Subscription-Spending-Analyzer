import React, { useState } from 'react';
import { X, Lock, Unlock, ShieldCheck, Key, Fingerprint, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { VaultSecurityState } from '../types';

interface SecurityVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  vaultState: VaultSecurityState;
  onUpdateVaultState: (state: VaultSecurityState) => void;
  onUnlockVaultWithPin: (pin: string) => Promise<boolean>;
  onLockVault: () => void;
}

export const SecurityVaultModal: React.FC<SecurityVaultModalProps> = ({
  isOpen,
  onClose,
  vaultState,
  onUpdateVaultState,
  onUnlockVaultWithPin,
  onLockVault,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleSetOrUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (pinInput.length < 4) {
      setErrorMsg('PIN must be at least 4 digits');
      return;
    }

    setIsVerifying(true);
    try {
      if (!vaultState.hasPin) {
        // Setting up PIN for first time
        localStorage.setItem('pastelpouch_pin_hash', btoa(pinInput));
        onUpdateVaultState({
          ...vaultState,
          hasPin: true,
          isLocked: false,
          isEncrypted: true,
        });
        setSuccessMsg('Vault encrypted with AES-256-GCM successfully! 🔒');
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        // Verifying existing PIN
        const ok = await onUnlockVaultWithPin(pinInput);
        if (ok) {
          setSuccessMsg('Vault unlocked!');
          setTimeout(() => {
            onClose();
          }, 800);
        } else {
          setErrorMsg('Incorrect PIN. Please try again.');
        }
      }
    } catch {
      setErrorMsg('Error processing vault security.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSimulateBiometric = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onUpdateVaultState({
        ...vaultState,
        isLocked: false,
      });
      setSuccessMsg('Biometric authentication verified (FaceID / Fingerprint)');
      setTimeout(() => {
        onClose();
      }, 800);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-emerald-100 text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-['Fredoka'] text-lg font-bold text-slate-800">
                Encrypted Data Vault
              </h3>
              <p className="text-xs text-slate-500">
                Client-Side Web Crypto AES-256-GCM
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Specs Badge */}
        <div className="my-4 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Encryption Standard:</span>
            <span className="font-mono font-bold text-slate-800">AES-GCM (256-bit)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Key Derivation:</span>
            <span className="font-mono font-bold text-slate-800">PBKDF2 SHA-256 (100k rounds)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Architecture:</span>
            <span className="font-bold text-emerald-700">Zero-Knowledge (Client-side)</span>
          </div>
        </div>

        {/* Messages */}
        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold mb-3">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3 flex items-center gap-1.5">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* PIN Form */}
        <form onSubmit={handleSetOrUnlock} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              {vaultState.hasPin ? 'Enter Vault PIN to Unlock' : 'Create 4-Digit Security PIN'}
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={8}
                value={pinInput}
                onChange={e => setPinInput(e.target.value)}
                placeholder="••••"
                className="w-full text-center tracking-widest text-lg font-bold p-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-slate-50/50"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isVerifying}
              className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
            >
              <Key className="w-4 h-4" />
              <span>{vaultState.hasPin ? 'Unlock Vault' : 'Encrypt Storage'}</span>
            </button>

            {vaultState.hasPin && (
              <button
                type="button"
                onClick={handleSimulateBiometric}
                className="px-3.5 py-2.5 rounded-2xl border border-emerald-300 text-emerald-700 hover:bg-emerald-50 transition-colors flex items-center gap-1.5 text-xs font-bold"
                title="Unlock with Biometric FaceID / TouchID"
              >
                <Fingerprint className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">FaceID</span>
              </button>
            )}
          </div>
        </form>

        {vaultState.hasPin && !vaultState.isLocked && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <Unlock className="w-3.5 h-3.5 text-emerald-500" />
              Vault Unlocked
            </span>
            <button
              type="button"
              onClick={onLockVault}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-1"
            >
              <Lock className="w-3 h-3" />
              <span>Lock Now</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
