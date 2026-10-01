import React from 'react';
import { motion } from 'motion/react';
import { MascotId } from '../types';

interface MascotCharacterProps {
  mascotId: MascotId;
  mood?: 'happy' | 'excited' | 'alert' | 'thinking' | 'sleeping';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeech?: boolean;
  speechText?: string;
  className?: string;
  onClick?: () => void;
}

export const MascotCharacter: React.FC<MascotCharacterProps> = ({
  mascotId,
  mood = 'happy',
  size = 'md',
  showSpeech = false,
  speechText,
  className = '',
  onClick,
}) => {
  const sizeMap = {
    sm: { container: 'w-14 h-14', svg: 56 },
    md: { container: 'w-24 h-24', svg: 96 },
    lg: { container: 'w-36 h-36', svg: 144 },
    xl: { container: 'w-48 h-48', svg: 192 },
  };

  const currentSize = sizeMap[size];

  // Mascot SVG representations
  const renderMascotSvg = () => {
    switch (mascotId) {
      case 'penny':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm select-none">
            {/* Soft shadow */}
            <ellipse cx="50" cy="88" rx="28" ry="6" fill="#fbcfe8" opacity="0.6" />
            
            {/* Piggy body */}
            <motion.g
              animate={
                mood === 'excited'
                  ? { y: [0, -6, 0], rotate: [0, -3, 3, 0] }
                  : mood === 'alert'
                  ? { x: [-1, 1, -1, 1, 0] }
                  : { y: [0, -2, 0] }
              }
              transition={{ repeat: Infinity, duration: mood === 'excited' ? 1.2 : 3, ease: 'easeInOut' }}
            >
              {/* Ears */}
              <motion.path
                d="M 28 28 C 22 14, 38 12, 40 24 Z"
                fill="#f472b6"
                stroke="#ec4899"
                strokeWidth="2.5"
                animate={mood === 'excited' ? { rotate: [-5, 8, -5] } : { rotate: [0, 3, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <motion.path
                d="M 72 28 C 78 14, 62 12, 60 24 Z"
                fill="#f472b6"
                stroke="#ec4899"
                strokeWidth="2.5"
                animate={mood === 'excited' ? { rotate: [5, -8, 5] } : { rotate: [0, -3, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />

              {/* Main Body */}
              <ellipse cx="50" cy="52" rx="36" ry="32" fill="#fbcfe8" stroke="#f472b6" strokeWidth="3" />

              {/* Coin Slot on Head */}
              <rect x="42" y="24" width="16" height="3.5" rx="1.75" fill="#db2777" />
              {/* Floating gold coin if excited or happy */}
              {(mood === 'happy' || mood === 'excited') && (
                <motion.circle
                  cx="50"
                  cy="17"
                  r="6"
                  fill="#fbbf24"
                  stroke="#d97706"
                  strokeWidth="1.5"
                  animate={{ y: [0, -4, 0], scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                />
              )}

              {/* Rosy Cheeks */}
              <circle cx="28" cy="56" r="6" fill="#f43f5e" opacity="0.35" />
              <circle cx="72" cy="56" r="6" fill="#f43f5e" opacity="0.35" />

              {/* Snout */}
              <ellipse cx="50" cy="56" rx="15" ry="11" fill="#f472b6" stroke="#db2777" strokeWidth="2.5" />
              <circle cx="45" cy="56" r="2.5" fill="#be185d" />
              <circle cx="55" cy="56" r="2.5" fill="#be185d" />

              {/* Eyes */}
              {mood === 'alert' ? (
                <>
                  <circle cx="36" cy="42" r="4.5" fill="#1e293b" />
                  <circle cx="64" cy="42" r="4.5" fill="#1e293b" />
                  <circle cx="37" cy="40.5" r="1.5" fill="#ffffff" />
                  <circle cx="65" cy="40.5" r="1.5" fill="#ffffff" />
                </>
              ) : mood === 'sleeping' ? (
                <>
                  <path d="M 32 43 Q 36 47 40 43" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 60 43 Q 64 47 68 43" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <ellipse cx="36" cy="42" rx="3.5" ry="4" fill="#1e293b" />
                  <ellipse cx="64" cy="42" rx="3.5" ry="4" fill="#1e293b" />
                  <circle cx="37.5" cy="40.5" r="1.5" fill="#ffffff" />
                  <circle cx="65.5" cy="40.5" r="1.5" fill="#ffffff" />
                </>
              )}

              {/* Little trotters / feet */}
              <ellipse cx="34" cy="80" rx="7" ry="5" fill="#f472b6" stroke="#ec4899" strokeWidth="2" />
              <ellipse cx="66" cy="80" rx="7" ry="5" fill="#f472b6" stroke="#ec4899" strokeWidth="2" />
            </motion.g>
          </svg>
        );

      case 'mochi':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm select-none">
            <ellipse cx="50" cy="88" rx="26" ry="5" fill="#a7f3d0" opacity="0.6" />
            <motion.g
              animate={
                mood === 'excited'
                  ? { y: [0, -5, 0], rotate: [-2, 2, -2] }
                  : { y: [0, -2, 0] }
              }
              transition={{ repeat: Infinity, duration: 2.8, ease: 'easeInOut' }}
            >
              {/* Ears */}
              <path d="M 28 30 L 22 14 L 38 22 Z" fill="#34d399" stroke="#059669" strokeWidth="2" />
              <path d="M 72 30 L 78 14 L 62 22 Z" fill="#fdba74" stroke="#ea580c" strokeWidth="2" />

              {/* Cat Face */}
              <ellipse cx="50" cy="50" rx="32" ry="28" fill="#ffffff" stroke="#10b981" strokeWidth="3" />
              
              {/* Calico Spot */}
              <path d="M 62 26 C 75 30 78 45 70 52 C 65 42 60 30 62 26 Z" fill="#fed7aa" />

              {/* Rosy Cheeks */}
              <circle cx="28" cy="54" r="5" fill="#f43f5e" opacity="0.25" />
              <circle cx="72" cy="54" r="5" fill="#f43f5e" opacity="0.25" />

              {/* Whiskers */}
              <line x1="18" y1="50" x2="30" y2="51" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="18" y1="56" x2="29" y2="55" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="82" y1="50" x2="70" y2="51" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="82" y1="56" x2="71" y2="55" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />

              {/* Cute Eyes */}
              {mood === 'alert' ? (
                <>
                  <circle cx="38" cy="44" r="4.5" fill="#047857" />
                  <circle cx="62" cy="44" r="4.5" fill="#047857" />
                  <circle cx="39" cy="42.5" r="1.5" fill="#ffffff" />
                  <circle cx="63" cy="42.5" r="1.5" fill="#ffffff" />
                </>
              ) : (
                <>
                  <path d="M 33 44 Q 38 39 43 44" fill="none" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 57 44 Q 62 39 67 44" fill="none" stroke="#047857" strokeWidth="2.5" strokeLinecap="round" />
                </>
              )}

              {/* Nose & Mouth */}
              <polygon points="50,50 48,47 52,47" fill="#fb7185" />
              <path d="M 46 52 Q 50 56 54 52" fill="none" stroke="#047857" strokeWidth="1.8" strokeLinecap="round" />

              {/* Scissors badge */}
              <circle cx="75" cy="68" r="9" fill="#d1fae5" stroke="#059669" strokeWidth="1.5" />
              <text x="75" y="72" fontSize="10" textAnchor="middle">✂️</text>

              {/* Paws */}
              <ellipse cx="38" cy="76" rx="7" ry="5" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
              <ellipse cx="62" cy="76" rx="7" ry="5" fill="#ffffff" stroke="#10b981" strokeWidth="2" />
            </motion.g>
          </svg>
        );

      case 'boba':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm select-none">
            <ellipse cx="50" cy="88" rx="28" ry="6" fill="#fde68a" opacity="0.6" />
            <motion.g
              animate={{ y: [0, -2.5, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            >
              {/* Round Bear Ears */}
              <circle cx="26" cy="28" r="12" fill="#f59e0b" stroke="#d97706" strokeWidth="2.5" />
              <circle cx="26" cy="28" r="6" fill="#fef3c7" />
              <circle cx="74" cy="28" r="12" fill="#f59e0b" stroke="#d97706" strokeWidth="2.5" />
              <circle cx="74" cy="28" r="6" fill="#fef3c7" />

              {/* Head & Body */}
              <ellipse cx="50" cy="54" rx="34" ry="30" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />

              {/* Belly patch */}
              <ellipse cx="50" cy="62" rx="18" ry="14" fill="#fef3c7" opacity="0.9" />

              {/* Rosy Cheeks */}
              <circle cx="28" cy="54" r="5" fill="#f43f5e" opacity="0.3" />
              <circle cx="72" cy="54" r="5" fill="#f43f5e" opacity="0.3" />

              {/* Muzzle */}
              <ellipse cx="50" cy="52" rx="12" ry="9" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
              <ellipse cx="50" cy="48" rx="4" ry="2.5" fill="#78350f" />
              <path d="M 50 50.5 L 50 54 M 47 54 Q 50 57 53 54" fill="none" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />

              {/* Friendly Eyes */}
              <circle cx="36" cy="43" r="3.5" fill="#451a03" />
              <circle cx="64" cy="43" r="3.5" fill="#451a03" />
              <circle cx="37" cy="41.5" r="1.2" fill="#ffffff" />
              <circle cx="65" cy="41.5" r="1.2" fill="#ffffff" />

              {/* Honey Pot / Boba Badge */}
              <circle cx="24" cy="70" r="9" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
              <text x="24" y="74" fontSize="10" textAnchor="middle">🧋</text>
            </motion.g>
          </svg>
        );

      case 'sprout':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm select-none">
            <ellipse cx="50" cy="88" rx="24" ry="5" fill="#c7d2fe" opacity="0.6" />
            <motion.g
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            >
              {/* Long Bunny Ears */}
              <motion.path
                d="M 32 36 C 22 2 34 2 40 28 Z"
                fill="#e0e7ff"
                stroke="#6366f1"
                strokeWidth="2.5"
                animate={{ rotate: [-3, 3, -3] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <path d="M 33 28 C 28 8 35 8 38 24 Z" fill="#fbcfe8" opacity="0.7" />

              <motion.path
                d="M 68 36 C 78 2 66 2 60 28 Z"
                fill="#e0e7ff"
                stroke="#6366f1"
                strokeWidth="2.5"
                animate={{ rotate: [3, -3, 3] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <path d="M 67 28 C 72 8 65 8 62 24 Z" fill="#fbcfe8" opacity="0.7" />

              {/* Bunny Body */}
              <ellipse cx="50" cy="58" rx="30" ry="26" fill="#eef2ff" stroke="#6366f1" strokeWidth="2.5" />

              {/* Rosy Cheeks */}
              <circle cx="28" cy="58" r="5" fill="#f43f5e" opacity="0.3" />
              <circle cx="72" cy="58" r="5" fill="#f43f5e" opacity="0.3" />

              {/* Eyes */}
              <circle cx="38" cy="49" r="4" fill="#312e81" />
              <circle cx="62" cy="49" r="4" fill="#312e81" />
              <circle cx="39" cy="47.5" r="1.5" fill="#ffffff" />
              <circle cx="63" cy="47.5" r="1.5" fill="#ffffff" />

              {/* Bunny Nose & Mouth */}
              <polygon points="50,55 48,52 52,52" fill="#f472b6" />
              <path d="M 47 57 Q 50 60 53 57" fill="none" stroke="#4338ca" strokeWidth="1.5" strokeLinecap="round" />

              {/* Calendar badge */}
              <circle cx="74" cy="72" r="9" fill="#e0e7ff" stroke="#4f46e5" strokeWidth="1.5" />
              <text x="74" y="76" fontSize="10" textAnchor="middle">📅</text>
            </motion.g>
          </svg>
        );
    }
  };

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex flex-col items-center cursor-pointer transition-transform hover:scale-105 active:scale-95 ${className}`}
    >
      {/* Speech bubble */}
      {showSpeech && speechText && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-sm border-2 border-pink-200 shadow-md rounded-2xl px-3 py-1.5 min-w-[140px] max-w-[220px] text-center z-20 pointer-events-none"
        >
          <p className="text-xs font-bold text-slate-700 leading-tight">{speechText}</p>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-r-2 border-b-2 border-pink-200 rotate-45" />
        </motion.div>
      )}

      {/* Mascot Graphic */}
      <div className={`${currentSize.container} relative flex items-center justify-center`}>
        {renderMascotSvg()}
      </div>
    </div>
  );
};
