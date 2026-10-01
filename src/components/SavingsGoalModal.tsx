import React, { useState } from 'react';
import { X, Target, DollarSign, Sparkles, Check, Plus, Trophy, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SavingsGoal } from '../types';
import { MascotCharacter } from './MascotCharacter';

interface SavingsGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: SavingsGoal;
  onSaveGoal: (updatedGoal: SavingsGoal) => void;
  onDepositSavings: (amount: number) => void;
}

export const SavingsGoalModal: React.FC<SavingsGoalModalProps> = ({
  isOpen,
  onClose,
  goal,
  onSaveGoal,
  onDepositSavings,
}) => {
  const [name, setName] = useState(goal.name);
  const [targetAmount, setTargetAmount] = useState(goal.targetAmount);
  const [icon, setIcon] = useState(goal.icon || '🌸');
  const [targetDate, setTargetDate] = useState(goal.targetDate || '');
  const [customDeposit, setCustomDeposit] = useState('');

  if (!isOpen) return null;

  const currentProgressPct = Math.min(100, Math.round((goal.currentAmount / (targetAmount || 1)) * 100));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveGoal({
      ...goal,
      name,
      targetAmount: Number(targetAmount),
      icon,
      targetDate: targetDate || undefined,
    });
    onClose();
  };

  const handleQuickDeposit = (amount: number) => {
    onDepositSavings(amount);
    if (goal.currentAmount + amount >= targetAmount) {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#F472B6', '#34D399', '#FBBF24', '#818CF8'],
      });
    }
  };

  const icons = ['🌸', '✈️', '💻', '🏖️', '🏡', '🎒', '🎨', '🎁', '✨', '🐾'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-amber-100 text-amber-700">
              <Trophy className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-['Fredoka'] text-lg font-bold text-slate-800">
                Savings Goal Settings
              </h3>
              <p className="text-xs text-slate-500">
                Set a milestone for your snipped subscription savings
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

        {/* Mascot Mascot Guide */}
        <div className="my-4 p-3 bg-gradient-to-r from-amber-50 to-pink-50 rounded-2xl border border-amber-200/80 flex items-center gap-3">
          <MascotCharacter mascotId="penny" size="sm" mood={currentProgressPct >= 100 ? 'excited' : 'happy'} />
          <div className="text-xs text-slate-700">
            <p className="font-bold text-amber-900">
              {currentProgressPct >= 100 ? 'Goal Achieved! You did it!' : `${currentProgressPct}% of the way to ${name}!`}
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              ${goal.currentAmount.toFixed(2)} saved of ${targetAmount.toFixed(2)} target.
            </p>
          </div>
        </div>

        {/* Quick Deposit to Goal */}
        <div className="mb-4 p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <label className="text-xs font-bold text-slate-700 block mb-2">
            Quick Deposit into this Goal:
          </label>
          <div className="flex gap-2">
            {[10, 25, 50, 100].map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => handleQuickDeposit(amt)}
                className="flex-1 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 hover:border-emerald-300 transition-colors shadow-xs"
              >
                +${amt}
              </button>
            ))}
          </div>
        </div>

        {/* Edit Goal Details */}
        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Goal Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Summer Vacation, Emergency Vault"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Choose an Icon
            </label>
            <div className="flex gap-2 overflow-x-auto py-1 custom-scrollbar">
              {icons.map(ic => (
                <button
                  key={ic}
                  type="button"
                  onClick={() => setIcon(ic)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform shrink-0 ${
                    icon === ic ? 'bg-pink-200 scale-110 border border-pink-400' : 'bg-slate-100 hover:bg-slate-200'
                  }`}
                >
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Amount ($)
              </label>
              <input
                type="number"
                min="10"
                step="5"
                required
                value={targetAmount}
                onChange={e => setTargetAmount(Number(e.target.value))}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Date (Optional)
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={e => setTargetDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-pink-500 to-indigo-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 mt-2"
          >
            <Check className="w-4 h-4" />
            <span>Save Goal Changes</span>
          </button>
        </form>
      </div>
    </div>
  );
};
