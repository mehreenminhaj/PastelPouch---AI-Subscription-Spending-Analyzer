export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  merchant: string;
  amount: number;
  category: string;
  rawDescription: string;
  accountSource?: string;
  isSubscriptionCandidate?: boolean;
}

export interface BillingHistoryItem {
  date: string;
  amount: number;
}

export interface PriceHikeDetails {
  previousAmount: number;
  newAmount: number;
  difference: number;
  percentage: number;
  detectedDate: string;
  annualExtraCost: number;
}

export interface Subscription {
  id: string;
  name: string;
  category: 'Entertainment' | 'Productivity' | 'Fitness' | 'Cloud & Storage' | 'Utilities' | 'Music & Audio' | 'Food & Lifestyle' | 'AI Tools' | 'Other';
  amount: number;
  frequency: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  nextBillingDate: string; // YYYY-MM-DD
  lastBilledDate: string; // YYYY-MM-DD
  status: 'active' | 'paused' | 'cancelled' | 'trial';
  confidenceScore: number; // 0 to 1
  billingHistory: BillingHistoryItem[];
  hasPriceHike?: boolean;
  priceHikeDetails?: PriceHikeDetails;
  isZombie?: boolean;
  zombieReason?: string;
  cancellationDifficulty?: 'easy' | 'moderate' | 'difficult';
  cancellationUrl?: string;
  reminderDaysBefore?: number;
  hasReminderActive?: boolean;
  notes?: string;
  color?: string;
  iconName?: string;
}

export interface PriceHikeAlert {
  id: string;
  subscriptionId: string;
  serviceName: string;
  oldPrice: number;
  newPrice: number;
  difference: number;
  hikePercentage: number;
  annualImpact: number;
  detectedDate: string;
  actionTaken?: 'pending' | 'negotiated' | 'downgraded' | 'cancelled' | 'dismissed';
}

export interface OptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  category: string;
  potentialMonthlySavings: number;
  potentialAnnualSavings: number;
  actionType: 'cancel' | 'downgrade' | 'bundle' | 'switch_annual' | 'pause';
  difficulty: 'easy' | 'medium' | 'hard';
  implemented?: boolean;
}

export interface BudgetConfig {
  monthlyLimit: number;
  alertThreshold: number; // e.g. 80 for 80%
  categoryLimits: Record<string, number>;
  currency: string;
}

export type MascotId = 'penny' | 'mochi' | 'boba' | 'sprout';

export interface MascotInfo {
  id: MascotId;
  name: string;
  species: string;
  title: string;
  catchphrase: string;
  colorTheme: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    border: string;
    badge: string;
  };
  personality: string;
}

export interface CancellationAssistantData {
  serviceName: string;
  subject: string;
  emailBody: string;
  chatScript: Array<{ speaker: string; message: string }>;
  cancellationSteps: string[];
  mascotTip: string;
  refundEligibleHint?: string;
}

export interface VaultSecurityState {
  isLocked: boolean;
  hasPin: boolean;
  isEncrypted: boolean;
  biometricEnabled: boolean;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  icon: string;
  targetDate?: string;
  notes?: string;
}

