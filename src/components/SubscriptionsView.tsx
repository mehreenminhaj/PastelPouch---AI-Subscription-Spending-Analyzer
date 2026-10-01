import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Scissors,
  Pause,
  Play,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  ExternalLink,
  Bell,
  Trash2
} from 'lucide-react';
import { Subscription } from '../types';
import { MascotCharacter } from './MascotCharacter';

interface SubscriptionsViewProps {
  subscriptions: Subscription[];
  onOpenCancellation: (sub: Subscription) => void;
  onToggleStatus: (subId: string) => void;
  onDeleteSubscription: (subId: string) => void;
  onOpenAddModal: () => void;
}

export const SubscriptionsView: React.FC<SubscriptionsViewProps> = ({
  subscriptions,
  onOpenCancellation,
  onToggleStatus,
  onDeleteSubscription,
  onOpenAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'hikes' | 'zombies'>('all');

  // Filter subscriptions
  const filtered = subscriptions.filter(sub => {
    const matchesSearch = sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = filterCategory === 'All' || sub.category === filterCategory;

    if (!matchesSearch || !matchesCat) return false;

    if (filterStatus === 'active') return sub.status === 'active';
    if (filterStatus === 'hikes') return sub.hasPriceHike;
    if (filterStatus === 'zombies') return sub.isZombie;
    return true;
  });

  const categories = ['All', 'Entertainment', 'Music & Audio', 'Productivity', 'AI Tools', 'Fitness', 'Cloud & Storage', 'Food & Lifestyle'];

  // Days until next renewal calculation
  const getDaysUntilRenewal = (nextDateStr: string) => {
    const target = new Date(nextDateStr).getTime();
    const today = new Date().getTime();
    const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-4 md:space-y-6 animate-fadeIn pb-12">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white/90 backdrop-blur-xs p-4 rounded-3xl border border-pink-100 shadow-xs">
        <div>
          <h2 className="font-['Fredoka'] text-xl font-bold text-slate-800">
            All Subscriptions ({subscriptions.length})
          </h2>
          <p className="text-xs text-slate-500">
            Detected recurring cycles, renewal countdowns, and difficulty ratings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenAddModal}
            className="flex-1 sm:flex-none px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Subscription</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/90 backdrop-blur-xs p-3 rounded-2xl border border-pink-100 flex flex-col md:flex-row items-center gap-2.5">
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search subscriptions..."
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-pink-300"
          />
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar w-full">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterStatus === 'all'
                ? 'bg-pink-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All ({subscriptions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('hikes')}
            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
              filterStatus === 'hikes'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Price Hikes ({subscriptions.filter(s => s.hasPriceHike).length})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('zombies')}
            className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filterStatus === 'zombies'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
          >
            <span>Zombies / Unused ({subscriptions.filter(s => s.isZombie).length})</span>
          </button>
        </div>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {filtered.map(sub => {
          const daysLeft = getDaysUntilRenewal(sub.nextBillingDate);
          const isUrgent = daysLeft >= 0 && daysLeft <= 4;

          return (
            <div
              key={sub.id}
              className={`p-4 rounded-3xl border bg-white/95 backdrop-blur-xs transition-all shadow-xs hover:shadow-md flex flex-col justify-between ${
                sub.status === 'paused'
                  ? 'opacity-60 border-slate-200'
                  : sub.hasPriceHike
                  ? 'border-rose-200'
                  : 'border-pink-100'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pink-100 to-purple-100 text-pink-700 font-extrabold flex items-center justify-center text-base shadow-xs">
                      {sub.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-['Fredoka'] font-bold text-base text-slate-800">
                          {sub.name}
                        </h3>
                        {sub.hasPriceHike && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                            +{sub.priceHikeDetails?.percentage}% Hike
                          </span>
                        )}
                        {sub.isZombie && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                            Zombie Sub
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{sub.category}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base sm:text-lg font-extrabold text-slate-800 font-['Fredoka']">
                      ${sub.amount.toFixed(2)}
                    </div>
                    <span className="text-[10px] text-slate-400 capitalize block">
                      /{sub.frequency}
                    </span>
                  </div>
                </div>

                {/* Price Hike Warning details if applicable */}
                {sub.hasPriceHike && sub.priceHikeDetails && (
                  <div className="my-2 p-2 bg-rose-50/80 rounded-xl border border-rose-200 text-xs text-rose-800">
                    <p className="font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      <span>Quietly hiked from ${sub.priceHikeDetails.previousAmount.toFixed(2)} &rarr; ${sub.priceHikeDetails.newAmount.toFixed(2)}</span>
                    </p>
                    <p className="text-[11px] text-rose-700 mt-0.5">
                      Costing you an extra +${sub.priceHikeDetails.annualExtraCost.toFixed(0)}/year!
                    </p>
                  </div>
                )}

                {/* Zombie reason */}
                {sub.isZombie && sub.zombieReason && (
                  <div className="my-2 p-2 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                    <span className="font-bold">⚠️ High waste risk:</span> {sub.zombieReason}
                  </div>
                )}

                {/* Renewal info & Confidence tag */}
                <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Next: <strong>{sub.nextBillingDate}</strong></span>
                    {isUrgent && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-pink-100 text-pink-700">
                        In {daysLeft} {daysLeft === 1 ? 'day' : 'days'}!
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Confidence: <strong>{Math.round(sub.confidenceScore * 100)}%</strong>
                  </span>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onToggleStatus(sub.id)}
                    className="p-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 transition-colors"
                    title={sub.status === 'active' ? 'Pause Subscription' : 'Resume Subscription'}
                  >
                    {sub.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteSubscription(sub.id)}
                    className="p-1.5 rounded-xl border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove from analyzer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenCancellation(sub)}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Cancel Assistance</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white/80 rounded-3xl border border-pink-100 p-6">
          <MascotCharacter mascotId="sprout" size="md" mood="sleeping" />
          <h3 className="font-['Fredoka'] text-lg font-bold text-slate-700 mt-2">
            No subscriptions matched your filter
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Try adjusting your search terms or upload more statement activity.
          </p>
        </div>
      )}
    </div>
  );
};
