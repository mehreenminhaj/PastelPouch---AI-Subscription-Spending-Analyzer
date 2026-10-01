import React from 'react';
import { motion } from 'motion/react';
import {
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  Award,
  Layers,
  Calendar,
  PiggyBank,
  CheckCircle,
  Scissors,
  DollarSign
} from 'lucide-react';
import { Subscription, PriceHikeAlert, OptimizationSuggestion, BudgetConfig, MascotInfo, SavingsGoal } from '../types';
import { MascotCharacter } from './MascotCharacter';

interface DashboardViewProps {
  subscriptions: Subscription[];
  priceHikes: PriceHikeAlert[];
  optimizations: OptimizationSuggestion[];
  budget: BudgetConfig;
  totalSavedLifetime: number;
  activeMascot: MascotInfo;
  savingsGoal: SavingsGoal;
  onOpenSavingsGoal: () => void;
  onTriggerCelebration: () => void;
  onQuickDepositToGoal: (amount: number) => void;
  onOpenUpload: () => void;
  onOpenBudget: () => void;
  onOpenCancellation: (sub: Subscription) => void;
  onOpenMascotChat: () => void;
  onRunAiScan: () => void;
  isAiScanning: boolean;
  onSwitchTab: (tab: 'dashboard' | 'subscriptions' | 'hikes' | 'analytics') => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  subscriptions,
  priceHikes,
  optimizations,
  budget,
  totalSavedLifetime,
  activeMascot,
  savingsGoal,
  onOpenSavingsGoal,
  onTriggerCelebration,
  onQuickDepositToGoal,
  onOpenUpload,
  onOpenBudget,
  onOpenCancellation,
  onOpenMascotChat,
  onRunAiScan,
  isAiScanning,
  onSwitchTab,
}) => {
  // Calculations
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const totalMonthlySpend = activeSubs.reduce((acc, s) => {
    if (s.frequency === 'yearly') return acc + (s.amount / 12);
    if (s.frequency === 'weekly') return acc + (s.amount * 4.33);
    if (s.frequency === 'quarterly') return acc + (s.amount / 3);
    return acc + s.amount;
  }, 0);

  const annualProjectedSpend = totalMonthlySpend * 12;
  const budgetBurnPercent = Math.min(150, Math.round((totalMonthlySpend / (budget.monthlyLimit || 1)) * 100));
  const isOverBudget = totalMonthlySpend > budget.monthlyLimit;

  const zombieSubs = activeSubs.filter(s => s.isZombie);
  const hikesCount = priceHikes.filter(h => h.actionTaken === 'pending').length;

  // Category Aggregates
  const categoryTotals: Record<string, number> = {};
  activeSubs.forEach(s => {
    const monthlyAmt = s.frequency === 'yearly' ? s.amount / 12 : s.amount;
    categoryTotals[s.category] = (categoryTotals[s.category] || 0) + monthlyAmt;
  });

  const categoryColorMap: Record<string, string> = {
    Entertainment: 'bg-rose-400',
    'Music & Audio': 'bg-pink-400',
    'AI Tools': 'bg-purple-400',
    Productivity: 'bg-indigo-400',
    Fitness: 'bg-emerald-400',
    'Cloud & Storage': 'bg-sky-400',
    'Food & Lifestyle': 'bg-amber-400',
    Other: 'bg-slate-400',
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fadeIn pb-12">
      {/* Whimsical Mascot Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-100/90 via-purple-100/80 to-blue-100/70 p-4 sm:p-6 border border-pink-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <MascotCharacter
              mascotId={activeMascot.id}
              size="md"
              mood={isOverBudget ? 'alert' : 'excited'}
              onClick={onOpenMascotChat}
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/80 border border-pink-200 text-[11px] font-bold text-pink-700 mb-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>{activeMascot.name} is on duty</span>
              </div>
              <h2 className="font-['Fredoka'] text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
                {isOverBudget ? 'Budget Alert, bestie!' : 'Everything looks peachy!'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mt-0.5 leading-snug">
                {isOverBudget
                  ? `You are $${(totalMonthlySpend - budget.monthlyLimit).toFixed(2)} above your $${budget.monthlyLimit}/mo goal. Tap below to snip ${zombieSubs.length || 1} subscriptions!`
                  : `Tracking ${activeSubs.length} subscriptions. You're spending $${totalMonthlySpend.toFixed(2)}/mo ($${annualProjectedSpend.toFixed(0)}/yr).`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              type="button"
              onClick={onOpenMascotChat}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-2xl bg-white/90 hover:bg-white text-pink-700 text-xs font-bold border border-pink-200 shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <span>Ask Mascot</span>
              <span className="text-sm">💬</span>
            </button>
            <button
              type="button"
              onClick={onRunAiScan}
              disabled={isAiScanning}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-indigo-500 hover:from-pink-600 hover:to-indigo-600 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isAiScanning ? 'animate-spin' : ''}`} />
              <span>{isAiScanning ? 'ML Scanning...' : 'AI Deep Scan'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Monthly Burn */}
        <div className="bg-white/90 backdrop-blur-xs p-4 rounded-3xl border border-pink-100 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span>Monthly Burn</span>
            <span className="p-1.5 rounded-xl bg-pink-50 text-pink-600">
              <DollarSign className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-800 font-['Fredoka']">
            ${totalMonthlySpend.toFixed(2)}
            <span className="text-xs font-normal text-slate-400">/mo</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">
            ≈ ${(annualProjectedSpend).toFixed(0)}/year total
          </p>
        </div>

        {/* Budget Limit Progress */}
        <div
          onClick={onOpenBudget}
          className="bg-white/90 backdrop-blur-xs p-4 rounded-3xl border border-pink-100 shadow-xs hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold mb-2">
            <span>Budget Cap</span>
            <span className="text-[10px] font-bold text-pink-600 group-hover:underline">Edit</span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-slate-800 font-['Fredoka'] flex items-baseline gap-1">
            <span>${budget.monthlyLimit}</span>
            <span className="text-xs font-bold text-slate-400">/mo</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOverBudget ? 'bg-rose-500' : budgetBurnPercent > 80 ? 'bg-amber-400' : 'bg-emerald-400'
              }`}
              style={{ width: `${Math.min(100, budgetBurnPercent)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex justify-between">
            <span>{budgetBurnPercent}% used</span>
            <span className={isOverBudget ? 'text-rose-600 font-bold' : 'text-slate-400'}>
              {isOverBudget ? 'Over Budget' : `$${(budget.monthlyLimit - totalMonthlySpend).toFixed(0)} left`}
            </span>
          </p>
        </div>

        {/* Price Hikes Warning */}
        <div
          onClick={() => onSwitchTab('hikes')}
          className={`p-4 rounded-3xl border shadow-xs hover:shadow-md transition-all cursor-pointer ${
            hikesCount > 0
              ? 'bg-rose-50/60 border-rose-200 hover:border-rose-300'
              : 'bg-white/90 border-pink-100'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className={hikesCount > 0 ? 'text-rose-700' : 'text-slate-500'}>Price Hikes</span>
            <span className={`p-1.5 rounded-xl ${hikesCount > 0 ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-slate-50 text-slate-400'}`}>
              <AlertTriangle className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold font-['Fredoka'] text-slate-800">
            {hikesCount} {hikesCount === 1 ? 'Service' : 'Services'}
          </div>
          <p className="text-[11px] text-rose-600 mt-1 font-semibold">
            {hikesCount > 0 ? `+${priceHikes.reduce((a, b) => a + b.annualImpact, 0).toFixed(0)}/yr sneaky creep` : 'No rate hikes detected'}
          </p>
        </div>

        {/* Saved Vault Lifetime */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 p-4 rounded-3xl border border-emerald-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold mb-2">
            <span>Saved Vault</span>
            <span className="p-1.5 rounded-xl bg-emerald-100 text-emerald-700">
              <PiggyBank className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-xl sm:text-2xl font-extrabold text-emerald-800 font-['Fredoka']">
            ${totalSavedLifetime.toFixed(2)}
          </div>
          <p className="text-[11px] text-emerald-700 mt-1 font-semibold">
            🎉 Pocketed this year!
          </p>
        </div>
      </div>

      {/* Interactive Savings Goal Widget with Progress Bar & Celebration */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-50/90 via-pink-50/80 to-purple-50/90 p-4 sm:p-5 border-2 border-amber-200/80 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 text-2xl flex items-center justify-center shrink-0 shadow-xs">
              {savingsGoal.icon}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
                  Target Savings Goal
                </span>
                {savingsGoal.currentAmount >= savingsGoal.targetAmount && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 animate-bounce">
                    🎉 Reached 100%!
                  </span>
                )}
              </div>
              <h3 className="font-['Fredoka'] text-lg sm:text-xl font-bold text-slate-800 mt-0.5">
                {savingsGoal.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            {savingsGoal.currentAmount >= savingsGoal.targetAmount ? (
              <button
                type="button"
                onClick={onTriggerCelebration}
                className="px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500 to-pink-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 animate-pulse"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Celebrate Goal!</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onQuickDepositToGoal(25)}
                className="px-3 py-1.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 hover:border-emerald-300 shadow-xs transition-colors flex items-center gap-1"
                title="Deposit $25 from snipped subscriptions"
              >
                <span>+$25 Deposit</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenSavingsGoal}
              className="px-3 py-1.5 rounded-2xl bg-white/80 hover:bg-white text-slate-700 text-xs font-bold border border-slate-200 hover:border-pink-300 shadow-xs transition-colors"
            >
              Adjust Goal
            </button>
          </div>
        </div>

        {/* Progress Bar & Numerical Breakdown */}
        <div className="mt-3.5 pt-3 border-t border-amber-200/50">
          <div className="flex justify-between items-baseline mb-1.5 text-xs">
            <div className="flex items-baseline gap-1.5">
              <span className="font-extrabold text-base sm:text-lg text-slate-800 font-['Fredoka']">
                ${savingsGoal.currentAmount.toFixed(2)}
              </span>
              <span className="text-slate-500 font-medium">
                saved of <strong className="text-slate-700 font-bold">${savingsGoal.targetAmount.toFixed(2)}</strong> target
              </span>
            </div>
            <span className="font-extrabold text-xs sm:text-sm text-amber-800 bg-amber-100/90 px-2.5 py-0.5 rounded-full border border-amber-200">
              {Math.min(100, Math.round((savingsGoal.currentAmount / (savingsGoal.targetAmount || 1)) * 100))}% Reached
            </span>
          </div>

          {/* Progress track with pastel gradient */}
          <div className="w-full bg-white/80 h-3 rounded-full overflow-hidden p-0.5 border border-amber-200 shadow-inner">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-pink-400 to-emerald-400 transition-all duration-700 shadow-xs"
              style={{
                width: `${Math.min(100, Math.round((savingsGoal.currentAmount / (savingsGoal.targetAmount || 1)) * 100))}%`,
              }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-semibold mt-1 px-1">
            <span>$0</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>${savingsGoal.targetAmount} Target</span>
          </div>
        </div>
      </div>

      {/* Critical Alerts Banner (Price Hikes & Zombies) */}
      {hikesCount > 0 && (
        <div className="rounded-3xl bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 border border-rose-200 p-4 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-rose-100 text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-rose-900 font-['Fredoka']">
                  Price Hike Radar: {hikesCount} services bumped their prices!
                </h4>
                <p className="text-xs text-rose-700 mt-0.5">
                  Services like {priceHikes.slice(0, 2).map(h => h.serviceName).join(', ')} increased rates. Don&apos;t pay extra unknowingly.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onSwitchTab('hikes')}
              className="px-4 py-2 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all shrink-0"
            >
              Review Price Hikes &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Two Column Layout: Active Subscriptions Spotlight & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left 2 Cols: Active Subscriptions List with Quick Action */}
        <div className="lg:col-span-2 bg-white/90 backdrop-blur-xs rounded-3xl p-4 sm:p-5 border border-pink-100 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-pink-50 mb-3">
            <div>
              <h3 className="font-['Fredoka'] text-base sm:text-lg font-bold text-slate-800">
                Active Subscriptions ({activeSubs.length})
              </h3>
              <p className="text-xs text-slate-400">Recurring patterns detected by ML</p>
            </div>
            <button
              type="button"
              onClick={() => onSwitchTab('subscriptions')}
              className="text-xs font-bold text-pink-600 hover:text-pink-700"
            >
              View All &rarr;
            </button>
          </div>

          <div className="space-y-2.5">
            {activeSubs.slice(0, 5).map(sub => (
              <div
                key={sub.id}
                className="p-3 rounded-2xl bg-slate-50/70 hover:bg-pink-50/40 border border-slate-100 hover:border-pink-200 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold text-sm">
                    {sub.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">{sub.name}</span>
                      {sub.hasPriceHike && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                          Hiked
                        </span>
                      )}
                      {sub.isZombie && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          Zombie
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">
                      Renews {sub.nextBillingDate} • <span className="font-medium text-slate-600">{sub.category}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-800 font-['Fredoka']">
                      ${sub.amount.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 block capitalize">
                      /{sub.frequency}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpenCancellation(sub)}
                    className="p-2 rounded-xl bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 hover:border-rose-200 transition-colors"
                    title="Cancellation Assistant"
                  >
                    <Scissors className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onOpenUpload}
              className="text-xs font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1.5"
            >
              <span>+ Upload More Statements</span>
            </button>
            <span className="text-xs text-slate-400">
              {activeSubs.length > 5 ? `+${activeSubs.length - 5} more in list` : 'All subscriptions displayed'}
            </span>
          </div>
        </div>

        {/* Right Col: Category Breakdown Donut / Visualizer */}
        <div className="bg-white/90 backdrop-blur-xs rounded-3xl p-4 sm:p-5 border border-pink-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-pink-50 mb-3">
              <h3 className="font-['Fredoka'] text-base font-bold text-slate-800">
                Spending by Category
              </h3>
              <span className="text-xs text-slate-400 font-semibold">Monthly</span>
            </div>

            {/* Visual stacked pill bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 mb-4 shadow-inner">
              {Object.entries(categoryTotals).map(([cat, amt]) => {
                const pct = (amt / (totalMonthlySpend || 1)) * 100;
                return (
                  <div
                    key={cat}
                    style={{ width: `${pct}%` }}
                    className={`${categoryColorMap[cat] || 'bg-slate-400'} h-full transition-all`}
                    title={`${cat}: $${amt.toFixed(2)} (${pct.toFixed(0)}%)`}
                  />
                );
              })}
            </div>

            {/* Category breakdown table */}
            <div className="space-y-2">
              {Object.entries(categoryTotals)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, amt]) => {
                  const pct = Math.round((amt / (totalMonthlySpend || 1)) * 100);
                  return (
                    <div key={cat} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${categoryColorMap[cat] || 'bg-slate-400'}`} />
                        <span className="font-semibold text-slate-700">{cat}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-slate-800">${amt.toFixed(2)}</span>
                        <span className="text-slate-400 text-[10px] ml-1">({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Whimsical Mascot Tip */}
          <div className="mt-4 p-3 rounded-2xl bg-pink-50/80 border border-pink-200/60 text-xs text-pink-900 flex items-center gap-2.5">
            <MascotCharacter mascotId="penny" size="sm" mood="happy" />
            <p className="text-[11px] leading-snug">
              <strong>Penny tip:</strong> Entertainment &amp; AI tools take up the largest share! Rotate video streaming to save ~$18/mo.
            </p>
          </div>
        </div>
      </div>

      {/* AI Budget Optimization Insights */}
      {optimizations.length > 0 && (
        <div className="bg-white/90 backdrop-blur-xs rounded-3xl p-4 sm:p-5 border border-pink-100 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-pink-50 mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-purple-100 text-purple-700">
                <Sparkles className="w-4 h-4" />
              </span>
              <h3 className="font-['Fredoka'] text-base sm:text-lg font-bold text-slate-800">
                AI Budget Optimizations
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Potential Savings: +${optimizations.reduce((a, b) => a + b.potentialAnnualSavings, 0).toFixed(0)}/yr
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {optimizations.map(opt => (
              <div
                key={opt.id}
                className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50/60 to-pink-50/50 border border-purple-100 flex items-start justify-between gap-3 group hover:border-purple-300 transition-all"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">{opt.title}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800">
                      Save ${opt.potentialMonthlySavings.toFixed(0)}/mo
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">
                    {opt.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenMascotChat}
                  className="px-2.5 py-1.5 rounded-xl bg-white text-purple-700 text-xs font-bold border border-purple-200 hover:bg-purple-50 shrink-0 shadow-xs"
                >
                  Action &rarr;
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
