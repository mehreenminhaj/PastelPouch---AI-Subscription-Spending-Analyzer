import React from 'react';
import { Calendar, DollarSign, PieChart, TrendingDown, ArrowUpRight, ShieldCheck, Clock } from 'lucide-react';
import { Subscription, BudgetConfig } from '../types';
import { MascotCharacter } from './MascotCharacter';

interface SpendingAnalyticsViewProps {
  subscriptions: Subscription[];
  budget: BudgetConfig;
  onOpenCancellation: (sub: Subscription) => void;
}

export const SpendingAnalyticsView: React.FC<SpendingAnalyticsViewProps> = ({
  subscriptions,
  budget,
  onOpenCancellation,
}) => {
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const totalMonthly = activeSubs.reduce((acc, s) => {
    if (s.frequency === 'yearly') return acc + (s.amount / 12);
    if (s.frequency === 'weekly') return acc + (s.amount * 4.33);
    return acc + s.amount;
  }, 0);

  // Price Tier Histogram
  const tiers = {
    micro: { label: 'Micro (<$10)', count: 0, total: 0 },
    standard: { label: 'Mid ($10-$20)', count: 0, total: 0 },
    pro: { label: 'Pro ($20-$50)', count: 0, total: 0 },
    heavy: { label: 'Heavy ($50+)', count: 0, total: 0 },
  };

  activeSubs.forEach(s => {
    const monthlyAmt = s.frequency === 'yearly' ? s.amount / 12 : s.amount;
    if (monthlyAmt < 10) {
      tiers.micro.count++;
      tiers.micro.total += monthlyAmt;
    } else if (monthlyAmt <= 20) {
      tiers.standard.count++;
      tiers.standard.total += monthlyAmt;
    } else if (monthlyAmt <= 50) {
      tiers.pro.count++;
      tiers.pro.total += monthlyAmt;
    } else {
      tiers.heavy.count++;
      tiers.heavy.total += monthlyAmt;
    }
  });

  // Upcoming renewals sorted by nextBillingDate
  const upcomingRenewals = [...activeSubs].sort(
    (a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime()
  );

  return (
    <div className="space-y-4 md:space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-xs p-4 sm:p-6 rounded-3xl border border-pink-100 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="font-['Fredoka'] text-xl font-bold text-slate-800">
            Spending Habits &amp; Renewal Calendar
          </h2>
          <p className="text-xs text-slate-500">
            Cashflow distribution, price tiers, and renewal schedule
          </p>
        </div>
        <MascotCharacter mascotId="sprout" size="sm" mood="happy" />
      </div>

      {/* Tier Analysis & Cashflow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tier Histogram Card */}
        <div className="bg-white/90 backdrop-blur-xs p-5 rounded-3xl border border-pink-100 shadow-xs">
          <h3 className="font-['Fredoka'] text-base font-bold text-slate-800 mb-3">
            Subscription Price Tiers
          </h3>
          <div className="space-y-3">
            {Object.entries(tiers).map(([key, t]) => {
              const pct = (t.total / (totalMonthly || 1)) * 100;
              return (
                <div key={key}>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>{t.label} ({t.count} services)</span>
                    <span className="font-bold text-slate-900">${t.total.toFixed(2)}/mo ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-400 to-indigo-400 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-400 mt-4 leading-tight">
            💡 Pro tip: Heavy subscriptions ($50+) like full Adobe or Gyms deliver the fastest budget savings when optimized or paused.
          </p>
        </div>

        {/* Weekly Cashflow Projection */}
        <div className="bg-white/90 backdrop-blur-xs p-5 rounded-3xl border border-pink-100 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="font-['Fredoka'] text-base font-bold text-slate-800 mb-3">
              Monthly Cashflow Distribution
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { week: 'Week 1', days: '1st - 7th', pct: 28, est: totalMonthly * 0.28 },
                { week: 'Week 2', days: '8th - 14th', pct: 32, est: totalMonthly * 0.32 },
                { week: 'Week 3', days: '15th - 21st', pct: 24, est: totalMonthly * 0.24 },
                { week: 'Week 4', days: '22nd - 31st', pct: 16, est: totalMonthly * 0.16 },
              ].map(w => (
                <div key={w.week} className="p-2.5 rounded-2xl bg-pink-50/60 border border-pink-100">
                  <span className="text-[10px] font-bold text-pink-700 uppercase block">{w.week}</span>
                  <span className="text-xs font-extrabold text-slate-800 font-['Fredoka'] block my-1">
                    ${w.est.toFixed(0)}
                  </span>
                  <span className="text-[9px] text-slate-400 block">{w.days}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-[11px]">
              Most charges occur in Weeks 1 &amp; 2. Ensure checking account has sufficient funds by the 8th.
            </span>
          </div>
        </div>
      </div>

      {/* Upcoming Renewals Timeline */}
      <div className="bg-white/90 backdrop-blur-xs p-5 rounded-3xl border border-pink-100 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-pink-50 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-pink-600" />
            <h3 className="font-['Fredoka'] text-base font-bold text-slate-800">
              Upcoming Renewal Timeline (Next 30 Days)
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-400">Chronological</span>
        </div>

        <div className="space-y-2.5">
          {upcomingRenewals.map((sub, i) => (
            <div
              key={sub.id}
              className="p-3 rounded-2xl bg-slate-50/80 hover:bg-pink-50/40 border border-slate-100 hover:border-pink-200 transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 font-bold text-xs flex items-center justify-center">
                  #{i + 1}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-800">{sub.name}</span>
                    <span className="text-[10px] font-medium text-slate-500">({sub.category})</span>
                  </div>
                  <span className="text-[11px] font-semibold text-pink-700">
                    Auto-renews on {sub.nextBillingDate}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-extrabold text-xs sm:text-sm text-slate-800 font-['Fredoka']">
                  ${sub.amount.toFixed(2)}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenCancellation(sub)}
                  className="px-2.5 py-1 rounded-xl bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs font-semibold transition-colors"
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
