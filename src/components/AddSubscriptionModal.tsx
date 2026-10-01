import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { Subscription } from '../types';

interface AddSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSubscription: (sub: Subscription) => void;
}

export const AddSubscriptionModal: React.FC<AddSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onAddSubscription,
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState<Subscription['frequency']>('monthly');
  const [category, setCategory] = useState<Subscription['category']>('Entertainment');
  const [nextDate, setNextDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split('T')[0];
  });
  const [isZombie, setIsZombie] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount) return;

    const parsedAmt = parseFloat(amount);
    const newSub: Subscription = {
      id: `sub_custom_${Date.now()}`,
      name,
      amount: parsedAmt,
      frequency,
      category,
      nextBillingDate: nextDate,
      lastBilledDate: new Date().toISOString().split('T')[0],
      status: 'active',
      confidenceScore: 1.0,
      billingHistory: [{ date: new Date().toISOString().split('T')[0], amount: parsedAmt }],
      isZombie,
      zombieReason: isZombie ? 'Marked by user as unused or low utility' : undefined,
      hasReminderActive: true,
      reminderDaysBefore: 3,
    };

    onAddSubscription(newSub);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex items-center justify-between pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-pink-100 text-pink-600">
              <Plus className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-['Fredoka'] text-lg font-bold text-slate-800">
                Track New Subscription
              </h3>
              <p className="text-xs text-slate-500">
                Add recurring service manually to your analyzer
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

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Service Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Paramount+, Strava Pro, iCloud"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="9.99"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Cadence
              </label>
              <select
                value={frequency}
                onChange={e => setFrequency(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
              >
                <option value="Entertainment">Entertainment</option>
                <option value="Music & Audio">Music &amp; Audio</option>
                <option value="Productivity">Productivity</option>
                <option value="AI Tools">AI Tools</option>
                <option value="Fitness">Fitness</option>
                <option value="Cloud & Storage">Cloud &amp; Storage</option>
                <option value="Food & Lifestyle">Food &amp; Lifestyle</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Next Billing Date
              </label>
              <input
                type="date"
                required
                value={nextDate}
                onChange={e => setNextDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="checkbox"
              id="zombie-check"
              checked={isZombie}
              onChange={e => setIsZombie(e.target.checked)}
              className="w-4 h-4 rounded text-pink-500 focus:ring-pink-400 border-slate-300"
            />
            <label htmlFor="zombie-check" className="text-xs text-slate-700 font-medium">
              Flag as unused &quot;Zombie&quot; subscription to remind me to cancel
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 mt-2"
          >
            <Plus className="w-4 h-4" />
            <span>Save Subscription</span>
          </button>
        </form>
      </div>
    </div>
  );
};
