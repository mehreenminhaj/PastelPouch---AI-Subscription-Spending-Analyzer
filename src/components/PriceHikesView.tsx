import React from 'react';
import { AlertTriangle, ArrowRight, TrendingUp, Scissors, MessageSquare, CheckCircle, ShieldAlert } from 'lucide-react';
import { PriceHikeAlert, Subscription } from '../types';
import { MascotCharacter } from './MascotCharacter';

interface PriceHikesViewProps {
  priceHikes: PriceHikeAlert[];
  subscriptions: Subscription[];
  onOpenCancellation: (sub: Subscription) => void;
  onOpenMascotChat: () => void;
  onDismissHike: (hikeId: string) => void;
}

export const PriceHikesView: React.FC<PriceHikesViewProps> = ({
  priceHikes,
  subscriptions,
  onOpenCancellation,
  onOpenMascotChat,
  onDismissHike,
}) => {
  const totalAnnualLeak = priceHikes.reduce((acc, h) => acc + h.annualImpact, 0);

  return (
    <div className="space-y-4 md:space-y-6 animate-fadeIn pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-100 via-pink-100 to-amber-100 p-4 sm:p-6 rounded-3xl border border-rose-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <MascotCharacter mascotId="mochi" size="md" mood="alert" />
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-800 text-[10px] font-bold uppercase tracking-wider mb-1">
              <AlertTriangle className="w-3 h-3" />
              <span>Subscription Creep Radar</span>
            </div>
            <h2 className="font-['Fredoka'] text-xl sm:text-2xl font-bold text-slate-800">
              Price Hike Detection
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Identified {priceHikes.length} rate hike(s) quietly draining{' '}
              <strong className="text-rose-700 font-extrabold">+${totalAnnualLeak.toFixed(0)}/year</strong>.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenMascotChat}
          className="px-4 py-2.5 rounded-2xl bg-white hover:bg-rose-50 text-rose-700 text-xs font-bold border border-rose-300 shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Ask Mascot How to Negotiate</span>
        </button>
      </div>

      {/* List of Price Hikes */}
      <div className="space-y-3 sm:space-y-4">
        {priceHikes.map(hike => {
          const matchedSub = subscriptions.find(s => s.id === hike.subscriptionId || s.name.toLowerCase() === hike.serviceName.toLowerCase());

          return (
            <div
              key={hike.id}
              className="bg-white/95 backdrop-blur-xs rounded-3xl p-4 sm:p-5 border border-rose-200 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-extrabold text-base shrink-0 shadow-xs">
                  {hike.serviceName.charAt(0)}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-['Fredoka'] text-base sm:text-lg font-bold text-slate-800">
                      {hike.serviceName}
                    </h3>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                      +{hike.hikePercentage}% Hike
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-xs">
                    <span className="text-slate-400 line-through">
                      ${hike.oldPrice.toFixed(2)}/mo
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span className="font-extrabold text-rose-600 text-sm">
                      ${hike.newPrice.toFixed(2)}/mo
                    </span>
                    <span className="text-slate-500 font-medium">
                      (+${hike.difference.toFixed(2)}/mo extra)
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    Detected on {hike.detectedDate} • Annual extra leak:{' '}
                    <strong className="text-rose-700 font-bold">+${hike.annualImpact.toFixed(0)}/yr</strong>
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
                {matchedSub && (
                  <button
                    type="button"
                    onClick={() => onOpenCancellation(matchedSub)}
                    className="flex-1 md:flex-none px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-1.5"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Snip / Cancel</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onDismissHike(hike.id)}
                  className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {priceHikes.length === 0 && (
        <div className="text-center py-12 bg-white/80 rounded-3xl border border-pink-100 p-6">
          <MascotCharacter mascotId="penny" size="md" mood="excited" />
          <h3 className="font-['Fredoka'] text-lg font-bold text-slate-700 mt-2">
            No price hikes detected!
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            All your subscriptions have maintained steady billing rates.
          </p>
        </div>
      )}
    </div>
  );
};
