import React, { useState } from 'react';
import { X, Target, DollarSign, BellRing, Sparkles, Check, TrendingDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BudgetConfig } from '../types';
import { MascotCharacter } from './MascotCharacter';

interface BudgetLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBudget: BudgetConfig;
  currentTotalSpend: number;
  onSaveBudget: (newBudget: BudgetConfig) => void;
}

export const BudgetLimitModal: React.FC<BudgetLimitModalProps> = ({
  isOpen,
  onClose,
  currentBudget,
  currentTotalSpend,
  onSaveBudget,
}) => {
  const [monthlyLimit, setMonthlyLimit] = useState(currentBudget.monthlyLimit);
  const [alertThreshold, setAlertThreshold] = useState(currentBudget.alertThreshold);
  const [categoryLimits, setCategoryLimits] = useState<Record<string, number>>(currentBudget.categoryLimits || {
    Entertainment: 35,
    'AI Tools': 40,
    Productivity: 30,
    Fitness: 40,
    'Cloud & Storage': 15,
  });

  if (!isOpen) return null;

  const isOver = currentTotalSpend > monthlyLimit;
  const burnPercent = Math.round((currentTotalSpend / (monthlyLimit || 1)) * 100);

  const handleSave = () => {
    onSaveBudget({
      ...currentBudget,
      monthlyLimit,
      alertThreshold,
      categoryLimits,
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#F472B6', '#34D399', '#FBBF24', '#818CF8'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-amber-100 text-amber-700">
              <Target className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-['Fredoka'] text-lg font-bold text-slate-800">
                Monthly Spending Limit
              </h3>
              <p className="text-xs text-slate-500">
                Keep subscription creep in check with soft &amp; hard caps
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

        {/* Mascot Reaction Box */}
        <div className={`my-4 p-3.5 rounded-2xl border flex items-center gap-3.5 transition-all ${
          isOver
            ? 'bg-rose-50/80 border-rose-200 text-rose-800'
            : burnPercent > alertThreshold
            ? 'bg-amber-50/80 border-amber-200 text-amber-800'
            : 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
        }`}>
          <MascotCharacter
            mascotId="boba"
            mood={isOver ? 'alert' : burnPercent > alertThreshold ? 'alert' : 'excited'}
            size="sm"
          />
          <div className="text-xs">
            <p className="font-bold">
              {isOver
                ? `🚨 Oh honey! You're $${(currentTotalSpend - monthlyLimit).toFixed(2)} over budget!`
                : burnPercent > alertThreshold
                ? `⚠️ Cozy alert: You've used ${burnPercent}% of your monthly cap.`
                : `🎉 Yay! You are comfortably under your $${monthlyLimit}/mo limit!`}
            </p>
            <p className="text-[11px] opacity-90 mt-0.5">
              Current monthly active subs: <span className="font-bold">${currentTotalSpend.toFixed(2)}/mo</span>
            </p>
          </div>
        </div>

        {/* Monthly Limit Slider & Input */}
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700">
                Total Monthly Cap ($)
              </label>
              <div className="flex items-center gap-1 text-sm font-extrabold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-lg border border-pink-200">
                <DollarSign className="w-3.5 h-3.5" />
                <span>{monthlyLimit}</span>
              </div>
            </div>
            <input
              type="range"
              min="30"
              max="500"
              step="5"
              value={monthlyLimit}
              onChange={e => setMonthlyLimit(Number(e.target.value))}
              className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
              <span>$30 (Frugal)</span>
              <span>$150 (Balanced)</span>
              <span>$350+ (Pro)</span>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex gap-2">
            {[75, 120, 150, 200].map(val => (
              <button
                key={val}
                type="button"
                onClick={() => setMonthlyLimit(val)}
                className={`flex-1 py-1 rounded-xl text-xs font-bold border transition-all ${
                  monthlyLimit === val
                    ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                    : 'bg-white text-slate-600 border-pink-100 hover:border-pink-300'
                }`}
              >
                ${val}
              </button>
            ))}
          </div>

          {/* Alert Threshold */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <BellRing className="w-3.5 h-3.5 text-amber-500" />
                Alert Me When Spend Reaches
              </label>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                {alertThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              value={alertThreshold}
              onChange={e => setAlertThreshold(Number(e.target.value))}
              className="w-full h-2 bg-amber-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Category Caps Breakdown */}
          <div className="border-t border-slate-100 pt-3">
            <h4 className="text-xs font-bold text-slate-700 mb-2">
              Category Spending Guardrails
            </h4>
            <div className="space-y-2.5">
              {Object.entries(categoryLimits).map(([cat, limit]) => (
                <div key={cat} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">{cat}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-[11px]">$</span>
                    <input
                      type="number"
                      value={limit}
                      onChange={e => {
                        const val = Math.max(0, parseInt(e.target.value) || 0);
                        setCategoryLimits(prev => ({ ...prev, [cat]: val }));
                      }}
                      className="w-16 p-1 text-right text-xs font-bold rounded-lg border border-slate-200 focus:ring-1 focus:ring-pink-300"
                    />
                    <span className="text-slate-400 text-[10px]">/mo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleSave}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Check className="w-4 h-4" />
            <span>Lock in Monthly Budget Limits</span>
          </button>
        </div>
      </div>
    </div>
  );
};
