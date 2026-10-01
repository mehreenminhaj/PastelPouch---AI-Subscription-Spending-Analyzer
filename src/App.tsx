/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  LayoutDashboard,
  Layers,
  AlertTriangle,
  BarChart3,
  UploadCloud,
  ShieldCheck,
  Target,
  Sparkles,
  Lock,
  Plus,
  MessageCircle,
  BellRing
} from 'lucide-react';

import {
  Transaction,
  Subscription,
  PriceHikeAlert,
  OptimizationSuggestion,
  BudgetConfig,
  MascotId,
  MascotInfo,
  VaultSecurityState,
  SavingsGoal
} from './types';

import { INITIAL_TRANSACTIONS, SAMPLE_MASCOTS } from './services/sampleData';
import { analyzeTransactionsForSubscriptions } from './services/mlPatternDetector';
import { encryptData, decryptData } from './services/encryption';

import { DeviceFrame, DeviceMode } from './components/DeviceFrame';
import { DashboardView } from './components/DashboardView';
import { SubscriptionsView } from './components/SubscriptionsView';
import { PriceHikesView } from './components/PriceHikesView';
import { SpendingAnalyticsView } from './components/SpendingAnalyticsView';

import { UploadModal } from './components/UploadModal';
import { BudgetLimitModal } from './components/BudgetLimitModal';
import { CancellationModal } from './components/CancellationModal';
import { MascotChatModal } from './components/MascotChatModal';
import { SecurityVaultModal } from './components/SecurityVaultModal';
import { AddSubscriptionModal } from './components/AddSubscriptionModal';
import { SavingsGoalModal } from './components/SavingsGoalModal';
import { SavingsCelebrationModal } from './components/SavingsCelebrationModal';

// Audio chime for mascot interactions
function playPastelPop() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch {
    // Audio context may be blocked by browser policy until gesture
  }
}

export default function App() {
  // Device Frame View
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'subscriptions' | 'hikes' | 'analytics'>('dashboard');

  // Mascot state
  const [activeMascotId, setActiveMascotId] = useState<MascotId>('penny');
  const activeMascot = useMemo(
    () => SAMPLE_MASCOTS.find(m => m.id === activeMascotId) || SAMPLE_MASCOTS[0],
    [activeMascotId]
  );

  // Core Data State
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('pastelpouch_transactions');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_TRANSACTIONS;
  });

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [priceHikes, setPriceHikes] = useState<PriceHikeAlert[]>([]);
  const [optimizations, setOptimizations] = useState<OptimizationSuggestion[]>([]);

  // Budget Config
  const [budget, setBudget] = useState<BudgetConfig>(() => {
    const saved = localStorage.getItem('pastelpouch_budget');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      monthlyLimit: 140,
      alertThreshold: 80,
      categoryLimits: {
        Entertainment: 45,
        'Music & Audio': 15,
        Productivity: 35,
        'AI Tools': 40,
        Fitness: 45,
        'Cloud & Storage': 15,
      },
      currency: 'USD',
    };
  });

  // Lifetime Money Saved Vault
  const [totalSavedLifetime, setTotalSavedLifetime] = useState<number>(() => {
    const saved = localStorage.getItem('pastelpouch_saved_vault');
    return saved ? parseFloat(saved) : 185.00; // start with realistic pre-saved amount
  });

  // Savings Goal State
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoal>(() => {
    const saved = localStorage.getItem('pastelpouch_savings_goal');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      id: 'goal_1',
      name: 'Dream Japan Trip 🌸',
      targetAmount: 300.00,
      currentAmount: 185.00,
      icon: '✈️',
      targetDate: '2026-12-31',
    };
  });

  // Vault Security State
  const [vaultState, setVaultState] = useState<VaultSecurityState>(() => {
    const hasPin = Boolean(localStorage.getItem('pastelpouch_pin_hash'));
    return {
      isLocked: false,
      hasPin,
      isEncrypted: hasPin,
      biometricEnabled: true,
    };
  });

  // Modals state
  const [isSavingsGoalOpen, setIsSavingsGoalOpen] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [isMascotChatOpen, setIsMascotChatOpen] = useState(false);
  const [isSecurityVaultOpen, setIsSecurityVaultOpen] = useState(false);
  const [isAddSubOpen, setIsAddSubOpen] = useState(false);
  const [cancellationSub, setCancellationSub] = useState<Subscription | null>(null);

  // AI Deep Scan state
  const [isAiScanning, setIsAiScanning] = useState(false);

  // Trigger ML Scan locally
  const runLocalMLScan = useCallback((txList: Transaction[]) => {
    const result = analyzeTransactionsForSubscriptions(txList);
    setSubscriptions(result.subscriptions);
    setPriceHikes(result.priceHikes);
    setOptimizations(result.optimizations);
  }, []);

  // Run on mount or when transactions change
  useEffect(() => {
    runLocalMLScan(transactions);
    localStorage.setItem('pastelpouch_transactions', JSON.stringify(transactions));
  }, [transactions, runLocalMLScan]);

  // Persist budget
  useEffect(() => {
    localStorage.setItem('pastelpouch_budget', JSON.stringify(budget));
  }, [budget]);

  // Persist total saved
  useEffect(() => {
    localStorage.setItem('pastelpouch_saved_vault', totalSavedLifetime.toString());
  }, [totalSavedLifetime]);

  // Persist savings goal
  useEffect(() => {
    localStorage.setItem('pastelpouch_savings_goal', JSON.stringify(savingsGoal));
  }, [savingsGoal]);

  // Deposit savings directly to goal
  const handleDepositSavingsToGoal = (amount: number) => {
    setSavingsGoal(prev => {
      const newCurrent = prev.currentAmount + amount;
      if (newCurrent >= prev.targetAmount && prev.currentAmount < prev.targetAmount) {
        setIsCelebrationOpen(true);
      }
      return { ...prev, currentAmount: newCurrent };
    });
    setTotalSavedLifetime(prev => prev + amount);
    playPastelPop();
  };

  // Full AI Deep Scan with Gemini
  const handleRunAiScan = async () => {
    setIsAiScanning(true);
    playPastelPop();

    try {
      const res = await fetch('/api/ai/analyze-subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactions,
          currentSubscriptions: subscriptions,
          monthlyBudget: budget.monthlyLimit,
        }),
      });

      if (res.ok) {
        const aiResult = await res.json();
        if (aiResult.optimizations && aiResult.optimizations.length > 0) {
          setOptimizations(prev => {
            const combined = [...aiResult.optimizations, ...prev];
            const unique = Array.from(new Map(combined.map(o => [o.title, o])).values());
            return unique;
          });
        }

        confetti({
          particleCount: 70,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F472B6', '#34D399', '#818CF8', '#FBBF24'],
        });
      } else {
        // Fallback to local ML
        runLocalMLScan(transactions);
      }
    } catch {
      runLocalMLScan(transactions);
    } finally {
      setIsAiScanning(false);
    }
  };

  // Upload transactions handler
  const handleUploadTransactions = (newTx: Transaction[], replaceAll = false) => {
    setTransactions(prev => {
      if (replaceAll) return newTx;
      const combined = [...newTx, ...prev];
      const unique = Array.from(new Map(combined.map(t => [t.id, t])).values());
      return unique;
    });
    playPastelPop();
  };

  // Toggle Subscription Active/Paused
  const handleToggleStatus = (subId: string) => {
    setSubscriptions(prev =>
      prev.map(s => {
        if (s.id === subId) {
          const nextStatus = s.status === 'active' ? 'paused' : 'active';
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
    playPastelPop();
  };

  // Delete subscription
  const handleDeleteSubscription = (subId: string) => {
    setSubscriptions(prev => prev.filter(s => s.id !== subId));
    playPastelPop();
  };

  // Add custom subscription
  const handleAddCustomSubscription = (newSub: Subscription) => {
    setSubscriptions(prev => [newSub, ...prev]);
    playPastelPop();
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#F472B6', '#34D399'],
    });
  };

  // Dismiss Price Hike
  const handleDismissHike = (hikeId: string) => {
    setPriceHikes(prev => prev.filter(h => h.id !== hikeId));
    playPastelPop();
  };

  // Set renewal reminder
  const handleSetReminder = (subId: string, daysBefore: number) => {
    setSubscriptions(prev =>
      prev.map(s => (s.id === subId ? { ...s, reminderDaysBefore: daysBefore, hasReminderActive: true } : s))
    );
    playPastelPop();
  };

  // Mark Cancelled
  const handleMarkCancelled = (subId: string, savedAmount: number) => {
    setSubscriptions(prev => prev.filter(s => s.id !== subId));
    setTotalSavedLifetime(prev => prev + savedAmount);
    setSavingsGoal(prev => {
      const newCurrent = prev.currentAmount + savedAmount;
      if (newCurrent >= prev.targetAmount && prev.currentAmount < prev.targetAmount) {
        setIsCelebrationOpen(true);
      }
      return { ...prev, currentAmount: newCurrent };
    });
    playPastelPop();
  };

  // Unlock Vault with PIN
  const handleUnlockVaultWithPin = async (pin: string): Promise<boolean> => {
    const storedHash = localStorage.getItem('pastelpouch_pin_hash');
    if (storedHash && btoa(pin) === storedHash) {
      setVaultState(prev => ({ ...prev, isLocked: false }));
      return true;
    }
    return false;
  };

  const handleLockVault = () => {
    setVaultState(prev => ({ ...prev, isLocked: true }));
    setIsSecurityVaultOpen(false);
    playPastelPop();
  };

  // Active Monthly Spend calculation
  const totalMonthlySpend = useMemo(() => {
    return subscriptions
      .filter(s => s.status === 'active')
      .reduce((acc, s) => {
        if (s.frequency === 'yearly') return acc + s.amount / 12;
        if (s.frequency === 'weekly') return acc + s.amount * 4.33;
        if (s.frequency === 'quarterly') return acc + s.amount / 3;
        return acc + s.amount;
      }, 0);
  }, [subscriptions]);

  return (
    <DeviceFrame
      mode={deviceMode}
      onModeChange={setDeviceMode}
      vaultLocked={vaultState.isLocked}
    >
      <div className="w-full max-w-5xl mx-auto px-3 sm:px-5 py-3">
        {/* Navigation Tabs Bar */}
        <nav className="mb-4 sm:mb-6 bg-white/95 backdrop-blur-md p-1.5 rounded-3xl border border-pink-100 shadow-xs flex items-center justify-between gap-1 overflow-x-auto custom-scrollbar">
          <div className="flex items-center gap-1 sm:gap-1.5 min-w-max">
            <button
              type="button"
              onClick={() => { setActiveTab('dashboard'); playPastelPop(); }}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-pink-500 text-white shadow-xs scale-102'
                  : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('subscriptions'); playPastelPop(); }}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'subscriptions'
                  ? 'bg-pink-500 text-white shadow-xs scale-102'
                  : 'text-slate-600 hover:text-pink-600 hover:bg-pink-50/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Subscriptions</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                activeTab === 'subscriptions' ? 'bg-white/30 text-white' : 'bg-pink-100 text-pink-700'
              }`}>
                {subscriptions.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('hikes'); playPastelPop(); }}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'hikes'
                  ? 'bg-rose-500 text-white shadow-xs scale-102'
                  : 'text-slate-600 hover:text-rose-600 hover:bg-rose-50/50'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Price Hikes</span>
              {priceHikes.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              )}
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab('analytics'); playPastelPop(); }}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-indigo-500 text-white shadow-xs scale-102'
                  : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </div>

          {/* Quick Utility Actions */}
          <div className="flex items-center gap-1.5 shrink-0 pl-2">
            <button
              type="button"
              onClick={() => { setIsUploadOpen(true); playPastelPop(); }}
              className="px-2.5 sm:px-3 py-1.5 rounded-2xl bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold border border-pink-200 transition-colors flex items-center gap-1"
              title="Upload CSV / Bank Statement"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Upload</span>
            </button>

            <button
              type="button"
              onClick={() => { setIsSecurityVaultOpen(true); playPastelPop(); }}
              className={`p-2 rounded-2xl border transition-colors ${
                vaultState.isLocked
                  ? 'bg-rose-50 text-rose-600 border-rose-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              }`}
              title="AES-256 Vault Settings"
            >
              {vaultState.isLocked ? <Lock className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
            </button>
          </div>
        </nav>

        {/* Tab Views */}
        {activeTab === 'dashboard' && (
          <DashboardView
            subscriptions={subscriptions}
            priceHikes={priceHikes}
            optimizations={optimizations}
            budget={budget}
            totalSavedLifetime={totalSavedLifetime}
            activeMascot={activeMascot}
            savingsGoal={savingsGoal}
            onOpenSavingsGoal={() => setIsSavingsGoalOpen(true)}
            onTriggerCelebration={() => setIsCelebrationOpen(true)}
            onQuickDepositToGoal={handleDepositSavingsToGoal}
            onOpenUpload={() => setIsUploadOpen(true)}
            onOpenBudget={() => setIsBudgetOpen(true)}
            onOpenCancellation={sub => setCancellationSub(sub)}
            onOpenMascotChat={() => setIsMascotChatOpen(true)}
            onRunAiScan={handleRunAiScan}
            isAiScanning={isAiScanning}
            onSwitchTab={setActiveTab}
          />
        )}

        {activeTab === 'subscriptions' && (
          <SubscriptionsView
            subscriptions={subscriptions}
            onOpenCancellation={sub => setCancellationSub(sub)}
            onToggleStatus={handleToggleStatus}
            onDeleteSubscription={handleDeleteSubscription}
            onOpenAddModal={() => setIsAddSubOpen(true)}
          />
        )}

        {activeTab === 'hikes' && (
          <PriceHikesView
            priceHikes={priceHikes}
            subscriptions={subscriptions}
            onOpenCancellation={sub => setCancellationSub(sub)}
            onOpenMascotChat={() => setIsMascotChatOpen(true)}
            onDismissHike={handleDismissHike}
          />
        )}

        {activeTab === 'analytics' && (
          <SpendingAnalyticsView
            subscriptions={subscriptions}
            budget={budget}
            onOpenCancellation={sub => setCancellationSub(sub)}
          />
        )}
      </div>

      {/* Floating Action Mascot Quick Chat Button */}
      <div className="fixed bottom-4 right-4 z-30">
        <button
          type="button"
          onClick={() => { setIsMascotChatOpen(true); playPastelPop(); }}
          className="group relative flex items-center gap-2 p-2.5 sm:px-4 sm:py-2.5 rounded-full bg-white/95 backdrop-blur-md border-2 border-pink-300 shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all text-pink-700 font-bold text-xs"
        >
          <span className="text-xl group-hover:rotate-12 transition-transform">🌸</span>
          <span className="hidden sm:inline">Ask {activeMascot.name.split(' ')[0]}</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
        </button>
      </div>

      {/* Modals */}
      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadTransactions={handleUploadTransactions}
        onTriggerMLScan={() => runLocalMLScan(transactions)}
      />

      <BudgetLimitModal
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
        currentBudget={budget}
        currentTotalSpend={totalMonthlySpend}
        onSaveBudget={setBudget}
      />

      <CancellationModal
        isOpen={Boolean(cancellationSub)}
        onClose={() => setCancellationSub(null)}
        subscription={cancellationSub}
        onMarkCancelled={handleMarkCancelled}
        onSetReminder={handleSetReminder}
      />

      <MascotChatModal
        isOpen={isMascotChatOpen}
        onClose={() => setIsMascotChatOpen(false)}
        activeMascot={activeMascot}
        onSelectMascot={id => { setActiveMascotId(id); playPastelPop(); }}
        allMascots={SAMPLE_MASCOTS}
        totalSpend={totalMonthlySpend}
        activeCount={subscriptions.filter(s => s.status === 'active').length}
        hikesCount={priceHikes.length}
      />

      <SecurityVaultModal
        isOpen={isSecurityVaultOpen}
        onClose={() => setIsSecurityVaultOpen(false)}
        vaultState={vaultState}
        onUpdateVaultState={setVaultState}
        onUnlockVaultWithPin={handleUnlockVaultWithPin}
        onLockVault={handleLockVault}
      />

      <AddSubscriptionModal
        isOpen={isAddSubOpen}
        onClose={() => setIsAddSubOpen(false)}
        onAddSubscription={handleAddCustomSubscription}
      />

      <SavingsGoalModal
        isOpen={isSavingsGoalOpen}
        onClose={() => setIsSavingsGoalOpen(false)}
        goal={savingsGoal}
        onSaveGoal={setSavingsGoal}
        onDepositSavings={handleDepositSavingsToGoal}
      />

      <SavingsCelebrationModal
        isOpen={isCelebrationOpen}
        onClose={() => setIsCelebrationOpen(false)}
        goal={savingsGoal}
        activeMascot={activeMascot}
        onSetNewGoal={() => setIsSavingsGoalOpen(true)}
      />
    </DeviceFrame>
  );
}
