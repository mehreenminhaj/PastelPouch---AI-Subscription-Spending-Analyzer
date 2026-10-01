import React, { useState } from 'react';
import { X, UploadCloud, FileSpreadsheet, Plus, CheckCircle, Sparkles, AlertCircle } from 'lucide-react';
import { Transaction } from '../types';
import { PRESET_BANKS } from '../services/sampleData';
import { MascotCharacter } from './MascotCharacter';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadTransactions: (newTransactions: Transaction[], replaceAll?: boolean) => void;
  onTriggerMLScan: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadTransactions,
  onTriggerMLScan,
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'csv' | 'manual'>('presets');
  const [csvText, setCsvText] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  // Manual Form State
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('Entertainment');

  if (!isOpen) return null;

  // Handle Preset selection
  const handleLoadPreset = (preset: typeof PRESET_BANKS[0]) => {
    onUploadTransactions(preset.data, true);
    setSuccessCount(preset.data.length);
    setTimeout(() => {
      onTriggerMLScan();
      onClose();
    }, 900);
  };

  // Parse CSV format
  const handleParseCsv = () => {
    setParseError(null);
    if (!csvText.trim()) {
      setParseError('Please paste CSV content or select a bank preset.');
      return;
    }

    try {
      const lines = csvText.trim().split('\n');
      if (lines.length < 2) {
        throw new Error('CSV must contain a header line and at least one transaction row.');
      }

      const parsedTx: Transaction[] = [];
      // Look for column indices in header
      const header = lines[0].toLowerCase();
      const headers = header.split(',').map(h => h.trim().replace(/["']/g, ''));

      let dateIdx = headers.findIndex(h => h.includes('date'));
      let merchantIdx = headers.findIndex(h => h.includes('desc') || h.includes('merchant') || h.includes('name') || h.includes('payee'));
      let amountIdx = headers.findIndex(h => h.includes('amount') || h.includes('price') || h.includes('cost'));

      if (dateIdx === -1) dateIdx = 0;
      if (merchantIdx === -1) merchantIdx = 1;
      if (amountIdx === -1) amountIdx = 2;

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));

        const rawDate = cols[dateIdx] || new Date().toISOString().split('T')[0];
        const rawDesc = cols[merchantIdx] || 'Subscription Item';
        let rawAmount = parseFloat(cols[amountIdx]?.replace(/[^0-9.-]/g, '') || '0');
        rawAmount = Math.abs(rawAmount);

        if (rawAmount > 0) {
          parsedTx.push({
            id: `csv_${Date.now()}_${i}`,
            date: rawDate,
            merchant: rawDesc,
            amount: rawAmount,
            category: 'Other',
            rawDescription: rawDesc,
            accountSource: 'CSV Import',
          });
        }
      }

      if (parsedTx.length === 0) {
        throw new Error('Could not extract any valid transactions. Please check the amount column.');
      }

      onUploadTransactions(parsedTx, false);
      setSuccessCount(parsedTx.length);
      setTimeout(() => {
        onTriggerMLScan();
        onClose();
      }, 900);
    } catch (err: any) {
      setParseError(err.message || 'Failed to parse CSV');
    }
  };

  // Handle Manual Transaction add
  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant || !amount) return;

    const newTx: Transaction = {
      id: `man_${Date.now()}`,
      date,
      merchant,
      amount: parseFloat(amount),
      category,
      rawDescription: merchant,
      accountSource: 'Manual Entry',
    };

    onUploadTransactions([newTx], false);
    setMerchant('');
    setAmount('');
    setSuccessCount(1);
    setTimeout(() => {
      onTriggerMLScan();
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-pink-100 text-pink-600">
              <UploadCloud className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-['Fredoka'] text-lg font-bold text-slate-800">
                Upload &amp; Scan Transactions
              </h3>
              <p className="text-xs text-slate-500">
                Feed your bank activity into our ML recurring pattern engine
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

        {/* Mascot Mascot Guide Banner */}
        <div className="my-4 p-3 bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 rounded-2xl border border-pink-200/80 flex items-center gap-3">
          <MascotCharacter mascotId="penny" size="sm" mood="excited" />
          <div className="text-xs text-slate-600">
            <p className="font-bold text-pink-700">Penny is ready to scan!</p>
            <p>Select a 1-click realistic statement or paste your CSV to automatically group recurring fees.</p>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-pink-50 p-1 rounded-2xl mb-4 border border-pink-100">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'presets' ? 'bg-white text-pink-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Bank Presets (1-Click)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('csv')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'csv' ? 'bg-white text-purple-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Paste CSV
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'manual' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            Add Single
          </button>
        </div>

        {/* Success Alert */}
        {successCount !== null && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-xs font-bold animate-bounce">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Loaded {successCount} transactions! ML Engine running...</span>
          </div>
        )}

        {/* Error Alert */}
        {parseError && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{parseError}</span>
          </div>
        )}

        {/* Tab 1: Bank Presets */}
        {activeTab === 'presets' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-500 font-semibold">
              Select a pre-configured realistic bank statement:
            </p>
            {PRESET_BANKS.map(preset => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleLoadPreset(preset)}
                className="w-full text-left p-3.5 rounded-2xl border border-pink-100 hover:border-pink-300 bg-white hover:bg-pink-50/40 transition-all flex items-center justify-between group shadow-xs hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 rounded-2xl bg-pink-100/60 group-hover:scale-110 transition-transform">
                    {preset.icon}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 text-sm">{preset.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">
                        {preset.badge}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{preset.description}</p>
                  </div>
                </div>
                <div className="text-right pl-2">
                  <span className="text-xs font-bold text-pink-600 group-hover:translate-x-1 inline-block transition-transform">
                    Load &rarr;
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Tab 2: Paste CSV */}
        {activeTab === 'csv' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Paste CSV Statement Rows (Date, Merchant, Amount)
              </label>
              <textarea
                value={csvText}
                onChange={e => setCsvText(e.target.value)}
                placeholder={`Date,Description,Amount
2026-07-12,Netflix.com,15.49
2026-08-12,Netflix.com,15.49
2026-09-12,Netflix.com,19.99
2026-07-18,Spotify USA,9.99
2026-08-18,Spotify USA,9.99
2026-09-18,Spotify USA,11.99
2026-09-03,OpenAI ChatGPT,20.00`}
                rows={7}
                className="w-full text-xs font-mono p-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-slate-50/50"
              />
            </div>
            <button
              type="button"
              onClick={handleParseCsv}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Process &amp; Identify Subscriptions</span>
            </button>
          </div>
        )}

        {/* Tab 3: Manual Entry */}
        {activeTab === 'manual' && (
          <form onSubmit={handleAddManual} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Merchant / Service Name
              </label>
              <input
                type="text"
                required
                value={merchant}
                onChange={e => setMerchant(e.target.value)}
                placeholder="e.g. Disney+, YouTube Premium, Equinox"
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
                  placeholder="14.99"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Billing Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
              >
                <option value="Entertainment">Entertainment (Netflix, Max, Hulu)</option>
                <option value="Music & Audio">Music &amp; Audio (Spotify, Apple Music)</option>
                <option value="Productivity">Productivity (Adobe, Notion, GitHub)</option>
                <option value="AI Tools">AI Tools (ChatGPT, Claude)</option>
                <option value="Fitness">Fitness (Gym, Calm, Strava)</option>
                <option value="Cloud & Storage">Cloud &amp; Storage (iCloud, Google One)</option>
                <option value="Food & Lifestyle">Food &amp; Lifestyle (Meal kits, Coffee)</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Transaction &amp; Detect</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
