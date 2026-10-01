import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Sparkles, PartyPopper, Check, Plus, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SavingsGoal, MascotInfo } from '../types';
import { MascotCharacter } from './MascotCharacter';

interface SavingsCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: SavingsGoal;
  activeMascot: MascotInfo;
  onSetNewGoal: () => void;
}

export const SavingsCelebrationModal: React.FC<SavingsCelebrationModalProps> = ({
  isOpen,
  onClose,
  goal,
  activeMascot,
  onSetNewGoal,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire double celebratory confetti canon
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#F472B6', '#34D399', '#FBBF24', '#818CF8', '#FB7185'],
      });

      const timer = setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 80,
          origin: { x: 0 },
          colors: ['#F472B6', '#FBBF24'],
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 80,
          origin: { x: 1 },
          colors: ['#34D399', '#818CF8'],
        });
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border-4 border-amber-300 text-center relative overflow-hidden"
      >
        {/* Decorative sparkles background */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-100 rounded-full blur-2xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-pink-100 rounded-full blur-2xl opacity-60 pointer-events-none" />

        {/* Mascot Center Stage */}
        <div className="flex justify-center mb-2">
          <MascotCharacter mascotId={activeMascot.id} size="lg" mood="excited" />
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-xs font-bold text-amber-900 mb-2">
          <Trophy className="w-4 h-4 text-amber-600" />
          <span>SAVINGS GOAL COMPLETED!</span>
        </div>

        <h3 className="font-['Fredoka'] text-2xl font-extrabold text-slate-800">
          Woohoo! {goal.icon} {goal.name}
        </h3>

        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          You hit your target of <strong className="text-emerald-600 font-bold">${goal.targetAmount.toFixed(2)}</strong>!
          Every penny reclaimed from snipping unnecessary subscriptions got you here!
        </p>

        {/* Confetti Pill Card */}
        <div className="my-4 p-3 rounded-2xl bg-gradient-to-r from-pink-50 via-amber-50 to-emerald-50 border border-amber-200 text-xs font-bold text-slate-800 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
          <span>Total Saved: ${goal.currentAmount.toFixed(2)}</span>
          <PartyPopper className="w-4 h-4 text-pink-500" />
        </div>

        {/* Buttons */}
        <div className="space-y-2 mt-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSetNewGoal();
            }}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-indigo-500 hover:from-amber-600 hover:to-indigo-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Set Next Savings Milestone</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
          >
            Celebrate &amp; Back to Dashboard
          </button>
        </div>
      </motion.div>
    </div>
  );
};
