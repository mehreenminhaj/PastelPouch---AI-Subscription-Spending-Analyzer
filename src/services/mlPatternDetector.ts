import { Transaction, Subscription, PriceHikeAlert, OptimizationSuggestion } from '../types';

interface GroupedMerchant {
  normalizedName: string;
  category: Subscription['category'];
  transactions: Transaction[];
  cancellationDifficulty: 'easy' | 'moderate' | 'difficult';
  cancellationUrl?: string;
  iconName?: string;
}

// Known subscription patterns and taxonomy
const KNOWN_MERCHANT_PATTERNS: Array<{
  pattern: RegExp;
  cleanName: string;
  category: Subscription['category'];
  cancellationDifficulty: 'easy' | 'moderate' | 'difficult';
  cancellationUrl?: string;
  iconName?: string;
}> = [
  { pattern: /netflix/i, cleanName: 'Netflix', category: 'Entertainment', cancellationDifficulty: 'easy', cancellationUrl: 'https://netflix.com/youraccount', iconName: 'Film' },
  { pattern: /spotify/i, cleanName: 'Spotify', category: 'Music & Audio', cancellationDifficulty: 'easy', cancellationUrl: 'https://spotify.com/account', iconName: 'Music' },
  { pattern: /apple(\.com|\s*one|\s*music|\s*cloud|\s*tv|\s*services)/i, cleanName: 'Apple Services', category: 'Cloud & Storage', cancellationDifficulty: 'easy', cancellationUrl: 'https://support.apple.com/en-us/HT202039', iconName: 'Apple' },
  { pattern: /amazon(\s*prime|\.com\*prime|prime\s*video)/i, cleanName: 'Amazon Prime', category: 'Entertainment', cancellationDifficulty: 'moderate', cancellationUrl: 'https://amazon.com/mc', iconName: 'ShoppingBag' },
  { pattern: /chatgpt|openai/i, cleanName: 'ChatGPT Plus', category: 'AI Tools', cancellationDifficulty: 'easy', cancellationUrl: 'https://chat.openai.com/#settings', iconName: 'Sparkles' },
  { pattern: /adobe/i, cleanName: 'Adobe Creative Cloud', category: 'Productivity', cancellationDifficulty: 'difficult', cancellationUrl: 'https://account.adobe.com/plans', iconName: 'Layers' },
  { pattern: /hulu/i, cleanName: 'Hulu', category: 'Entertainment', cancellationDifficulty: 'easy', cancellationUrl: 'https://hulu.com/account', iconName: 'Tv' },
  { pattern: /disney(\+|plus)/i, cleanName: 'Disney+', category: 'Entertainment', cancellationDifficulty: 'easy', cancellationUrl: 'https://disneyplus.com/account', iconName: 'Tv' },
  { pattern: /youtube(\s*premium|\s*member)/i, cleanName: 'YouTube Premium', category: 'Entertainment', cancellationDifficulty: 'easy', cancellationUrl: 'https://youtube.com/paid_memberships', iconName: 'Video' },
  { pattern: /gym|planet\s*fitness|equinox|anytime\s*fitness|la\s*fitness/i, cleanName: 'Fitness Club Membership', category: 'Fitness', cancellationDifficulty: 'difficult', cancellationUrl: 'https://planetfitness.com/cancel', iconName: 'Dumbbell' },
  { pattern: /duolingo/i, cleanName: 'Duolingo Super', category: 'Productivity', cancellationDifficulty: 'easy', cancellationUrl: 'https://duolingo.com/settings/super', iconName: 'BookOpen' },
  { pattern: /nytimes|new\s*york\s*times/i, cleanName: 'The New York Times', category: 'Productivity', cancellationDifficulty: 'moderate', cancellationUrl: 'https://nytimes.com/subscription/cancel', iconName: 'Newspaper' },
  { pattern: /github/i, cleanName: 'GitHub Copilot / Pro', category: 'Productivity', cancellationDifficulty: 'easy', cancellationUrl: 'https://github.com/settings/billing', iconName: 'Code' },
  { pattern: /dropbox/i, cleanName: 'Dropbox', category: 'Cloud & Storage', cancellationDifficulty: 'easy', cancellationUrl: 'https://dropbox.com/account/plan', iconName: 'Cloud' },
  { pattern: /notion/i, cleanName: 'Notion Plus', category: 'Productivity', cancellationDifficulty: 'easy', cancellationUrl: 'https://notion.so/settings', iconName: 'CheckSquare' },
  { pattern: /google(\s*one|\s*storage|\s*workspace)/i, cleanName: 'Google One / Workspace', category: 'Cloud & Storage', cancellationDifficulty: 'easy', cancellationUrl: 'https://one.google.com/settings', iconName: 'Cloud' },
  { pattern: /hbo|max\.com|warnermedia/i, cleanName: 'Max (HBO)', category: 'Entertainment', cancellationDifficulty: 'easy', cancellationUrl: 'https://max.com/account', iconName: 'Film' },
  { pattern: /claude|anthropic/i, cleanName: 'Claude Pro', category: 'AI Tools', cancellationDifficulty: 'easy', cancellationUrl: 'https://claude.ai/settings', iconName: 'Sparkles' },
  { pattern: /hellofresh|blue\s*apron|factor/i, cleanName: 'Meal Kit Delivery', category: 'Food & Lifestyle', cancellationDifficulty: 'moderate', cancellationUrl: 'https://hellofresh.com/account-settings', iconName: 'Coffee' },
  { pattern: /calm|headspace/i, cleanName: 'Calm & Mindfulness', category: 'Fitness', cancellationDifficulty: 'easy', cancellationUrl: 'https://calm.com/settings', iconName: 'Heart' },
];

export function normalizeMerchant(rawName: string): {
  cleanName: string;
  category: Subscription['category'];
  cancellationDifficulty: 'easy' | 'moderate' | 'difficult';
  cancellationUrl?: string;
  iconName?: string;
} {
  for (const item of KNOWN_MERCHANT_PATTERNS) {
    if (item.pattern.test(rawName)) {
      return {
        cleanName: item.cleanName,
        category: item.category,
        cancellationDifficulty: item.cancellationDifficulty,
        cancellationUrl: item.cancellationUrl,
        iconName: item.iconName,
      };
    }
  }

  // Fallback cleanup
  let clean = rawName
    .replace(/(inc|llc|ltd|co|corp|\.com|\*|#\d+|bill|recurring|sub)\b/gi, '')
    .replace(/[0-9\-_*]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  clean = clean.charAt(0).toUpperCase() + clean.slice(1);
  return {
    cleanName: clean || rawName,
    category: 'Other',
    cancellationDifficulty: 'moderate',
    iconName: 'CreditCard',
  };
}

export function detectSubscriptionCadence(dates: string[]): {
  frequency: Subscription['frequency'];
  estimatedNextDate: string;
  isPeriodic: boolean;
  varianceScore: number;
} {
  if (dates.length < 2) {
    // Default assuming monthly
    const lastDate = new Date(dates[0] || Date.now());
    const nextMonth = new Date(lastDate);
    nextMonth.setDate(nextMonth.getDate() + 30);
    return {
      frequency: 'monthly',
      estimatedNextDate: nextMonth.toISOString().split('T')[0],
      isPeriodic: false,
      varianceScore: 0.5,
    };
  }

  // Sort timestamps ascending
  const timestamps = dates.map(d => new Date(d).getTime()).sort((a, b) => a - b);
  const diffDays: number[] = [];

  for (let i = 1; i < timestamps.length; i++) {
    const diff = (timestamps[i] - timestamps[i - 1]) / (1000 * 60 * 60 * 24);
    diffDays.push(diff);
  }

  const avgDiff = diffDays.reduce((a, b) => a + b, 0) / diffDays.length;

  let frequency: Subscription['frequency'] = 'monthly';
  let targetInterval = 30;

  if (avgDiff >= 5 && avgDiff <= 10) {
    frequency = 'weekly';
    targetInterval = 7;
  } else if (avgDiff >= 24 && avgDiff <= 35) {
    frequency = 'monthly';
    targetInterval = 30;
  } else if (avgDiff >= 80 && avgDiff <= 105) {
    frequency = 'quarterly';
    targetInterval = 90;
  } else if (avgDiff >= 330 && avgDiff <= 400) {
    frequency = 'yearly';
    targetInterval = 365;
  }

  // Calculate variance from expected interval
  const variance = diffDays.reduce((acc, curr) => acc + Math.abs(curr - targetInterval), 0) / diffDays.length;
  const varianceScore = Math.max(0, 1 - variance / 15);

  const lastDate = new Date(timestamps[timestamps.length - 1]);
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + Math.round(targetInterval));

  return {
    frequency,
    estimatedNextDate: nextDate.toISOString().split('T')[0],
    isPeriodic: variance < 10,
    varianceScore,
  };
}

export function analyzeTransactionsForSubscriptions(transactions: Transaction[]): {
  subscriptions: Subscription[];
  priceHikes: PriceHikeAlert[];
  optimizations: OptimizationSuggestion[];
} {
  // Group transactions by normalized merchant
  const grouped: Record<string, GroupedMerchant> = {};

  transactions.forEach(tx => {
    const meta = normalizeMerchant(tx.merchant || tx.rawDescription);
    const key = meta.cleanName.toLowerCase();

    if (!grouped[key]) {
      grouped[key] = {
        normalizedName: meta.cleanName,
        category: meta.category,
        transactions: [],
        cancellationDifficulty: meta.cancellationDifficulty,
        cancellationUrl: meta.cancellationUrl,
        iconName: meta.iconName,
      };
    }
    grouped[key].transactions.push(tx);
  });

  const subscriptions: Subscription[] = [];
  const priceHikes: PriceHikeAlert[] = [];

  Object.values(grouped).forEach(group => {
    // Sort transactions by date ascending
    const sortedTx = [...group.transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const dates = sortedTx.map(t => t.date);
    const cadence = detectSubscriptionCadence(dates);
    const count = sortedTx.length;

    // Filter: If known subscription name or count >= 2 or explicit recurring flag
    const isKnownService = KNOWN_MERCHANT_PATTERNS.some(k => k.cleanName.toLowerCase() === group.normalizedName.toLowerCase());
    const qualifies = isKnownService || count >= 2 || sortedTx.some(t => t.isSubscriptionCandidate);

    if (!qualifies) return;

    const latestTx = sortedTx[sortedTx.length - 1];
    const latestAmount = latestTx.amount;
    const previousTx = sortedTx.length > 1 ? sortedTx[sortedTx.length - 2] : null;

    // Price Hike Detection: If latest amount is greater than previous amount by > $0.50
    let hasPriceHike = false;
    let priceHikeDetails = undefined;

    if (previousTx && latestAmount > previousTx.amount + 0.5) {
      const diff = Number((latestAmount - previousTx.amount).toFixed(2));
      const percentage = Number(((diff / previousTx.amount) * 100).toFixed(1));
      const annualImpact = Number((diff * (cadence.frequency === 'yearly' ? 1 : 12)).toFixed(2));

      hasPriceHike = true;
      priceHikeDetails = {
        previousAmount: previousTx.amount,
        newAmount: latestAmount,
        difference: diff,
        percentage,
        detectedDate: latestTx.date,
        annualExtraCost: annualImpact,
      };

      priceHikes.push({
        id: `hike_${group.normalizedName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
        subscriptionId: `sub_${group.normalizedName.toLowerCase().replace(/\s+/g, '_')}`,
        serviceName: group.normalizedName,
        oldPrice: previousTx.amount,
        newPrice: latestAmount,
        difference: diff,
        hikePercentage: percentage,
        annualImpact,
        detectedDate: latestTx.date,
        actionTaken: 'pending',
      });
    }

    // Confidence scoring
    let confidence = 0.6;
    if (isKnownService) confidence += 0.25;
    if (count >= 3) confidence += 0.15;
    if (cadence.isPeriodic) confidence += 0.1;
    confidence = Math.min(0.99, Math.max(0.65, Number(confidence.toFixed(2))));

    // Zombie subscription heuristic:
    // High cost + gym, or duplicate entertainment
    const isZombie = (group.category === 'Fitness' && count >= 3) ||
      (group.normalizedName.includes('Adobe') && count >= 4) ||
      (group.normalizedName.includes('Times') && hasPriceHike);

    const zombieReason = isZombie
      ? (group.category === 'Fitness' ? 'Gym auto-renewing without recorded check-ins' :
        group.normalizedName.includes('Times') ? 'Introductory promotional rate expired & spiked' :
        'Infrequently used high-tier creative plan')
      : undefined;

    const subId = `sub_${group.normalizedName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

    subscriptions.push({
      id: subId,
      name: group.normalizedName,
      category: group.category,
      amount: latestAmount,
      frequency: cadence.frequency,
      nextBillingDate: cadence.estimatedNextDate,
      lastBilledDate: latestTx.date,
      status: 'active',
      confidenceScore: confidence,
      billingHistory: sortedTx.map(t => ({ date: t.date, amount: t.amount })),
      hasPriceHike,
      priceHikeDetails,
      isZombie,
      zombieReason,
      cancellationDifficulty: group.cancellationDifficulty,
      cancellationUrl: group.cancellationUrl,
      iconName: group.iconName,
      reminderDaysBefore: 3,
      hasReminderActive: true,
    });
  });

  // Generate automated budget optimization suggestions
  const optimizations: OptimizationSuggestion[] = [];

  // Suggestion 1: Price hike mitigation
  if (priceHikes.length > 0) {
    const totalHikeLeak = priceHikes.reduce((acc, h) => acc + h.annualImpact, 0);
    optimizations.push({
      id: 'opt_price_hikes',
      title: `Reclaim $${totalHikeLeak.toFixed(0)}/yr from Sneaky Price Hikes`,
      description: `${priceHikes.length} subscription(s) quietly increased their rates. Tap to negotiate or downgrade back to the standard tier.`,
      category: 'Price Hikes',
      potentialMonthlySavings: Number((totalHikeLeak / 12).toFixed(2)),
      potentialAnnualSavings: totalHikeLeak,
      actionType: 'downgrade',
      difficulty: 'easy',
    });
  }

  // Suggestion 2: Zombie subscriptions
  const zombies = subscriptions.filter(s => s.isZombie);
  if (zombies.length > 0) {
    const monthlyZombieCost = zombies.reduce((acc, z) => acc + z.amount, 0);
    optimizations.push({
      id: 'opt_zombies',
      title: `Snip ${zombies.length} Unused "Zombie" Subscriptions`,
      description: `Mochi the Cat spotted unused services (${zombies.map(z => z.name).join(', ')}). Use automated 1-click cancellation letters.`,
      category: 'Waste Reduction',
      potentialMonthlySavings: monthlyZombieCost,
      potentialAnnualSavings: Number((monthlyZombieCost * 12).toFixed(2)),
      actionType: 'cancel',
      difficulty: 'medium',
    });
  }

  // Suggestion 3: Streaming bundle optimization
  const streamings = subscriptions.filter(s => s.category === 'Entertainment');
  if (streamings.length >= 3) {
    optimizations.push({
      id: 'opt_streaming_bundle',
      title: 'Consolidate 3+ Streaming Platforms',
      description: 'You have multiple active video platforms. Rotate services month-to-month or switch to an annual duo bundle to save up to 25%.',
      category: 'Entertainment',
      potentialMonthlySavings: 18.00,
      potentialAnnualSavings: 216.00,
      actionType: 'bundle',
      difficulty: 'easy',
    });
  }

  // Suggestion 4: Annual billing discount
  const monthlySubs = subscriptions.filter(s => s.frequency === 'monthly' && s.amount > 10);
  if (monthlySubs.length > 0) {
    const annualSwitchSavings = Number((monthlySubs.reduce((acc, s) => acc + s.amount, 0) * 0.16).toFixed(2));
    optimizations.push({
      id: 'opt_annual_switch',
      title: 'Switch Key Services to Annual Billing',
      description: 'Services like Duolingo, Notion, and ChatGPT offer 2 months free when billed annually.',
      category: 'Productivity',
      potentialMonthlySavings: annualSwitchSavings,
      potentialAnnualSavings: Number((annualSwitchSavings * 12).toFixed(2)),
      actionType: 'switch_annual',
      difficulty: 'easy',
    });
  }

  return { subscriptions, priceHikes, optimizations };
}
