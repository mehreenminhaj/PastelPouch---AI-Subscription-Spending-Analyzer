import { Transaction, MascotInfo } from '../types';

export const SAMPLE_MASCOTS: MascotInfo[] = [
  {
    id: 'penny',
    name: 'Penny the Piggy',
    species: 'Piglet Bank',
    title: 'Chief Coin Stasher',
    catchphrase: 'Oink! Every penny tucked away builds your fairy-tale savings! 🌸',
    colorTheme: {
      primary: '#F472B6', // rose pink
      secondary: '#FBCFE8',
      accent: '#BE185D',
      bg: '#FDF2F8',
      border: '#F9A8D4',
      badge: 'bg-pink-100 text-pink-700 border-pink-200',
    },
    personality: 'Warm, cheerful, loves stashing coins, squeals with joy when money is saved.',
  },
  {
    id: 'mochi',
    name: 'Mochi the Cat',
    species: 'Calico Ninja Cat',
    title: 'Zombie Subscription Snipper',
    catchphrase: 'Purr... I have my tiny safety scissors ready to snip sneaky fees! 🐾',
    colorTheme: {
      primary: '#34D399', // mint emerald
      secondary: '#A7F3D0',
      accent: '#047857',
      bg: '#ECFDF5',
      border: '#6EE7B7',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    personality: 'Sharp-eyed, playful, snips sneaky subscription weeds, purrs when budgets stay intact.',
  },
  {
    id: 'boba',
    name: 'Boba the Bear',
    species: 'Honey Teddy',
    title: 'Budget Zen Keeper',
    catchphrase: 'Sweet like boba pearls! Let us keep our spending cozy and calm. 🍯',
    colorTheme: {
      primary: '#FBBF24', // honey warm amber
      secondary: '#FDE68A',
      accent: '#B45309',
      bg: '#FFFBEB',
      border: '#FCD34D',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    personality: 'Gentle, comforting mentor who loves long-term savings goals and honey jars.',
  },
  {
    id: 'sprout',
    name: 'Sprout the Bunny',
    species: 'Pastel Lop Bunny',
    title: 'Renewal Hop Tracker',
    catchphrase: 'Hop hop! I am tracking your upcoming renewals so zero sneak by! 🐰',
    colorTheme: {
      primary: '#818CF8', // periwinkle lilac
      secondary: '#C7D2FE',
      accent: '#4338CA',
      bg: '#EEF2FF',
      border: '#A5B4FC',
      badge: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    },
    personality: 'Energetic, vigilant, hops with joy when you cancel free trials on time.',
  },
];

// Rich 4-month realistic transaction dataset illustrating recurring charges, normalizations, and price hikes
export const INITIAL_TRANSACTIONS: Transaction[] = [
  // Netflix (Price hiked from 15.49 to 19.99)
  { id: 'tx_101', date: '2026-06-12', merchant: 'NETFLIX.COM* 800-585-7930 CA', amount: 15.49, category: 'Entertainment', rawDescription: 'NETFLIX.COM* 800-585-7930 CA' },
  { id: 'tx_102', date: '2026-07-12', merchant: 'NETFLIX.COM* 800-585-7930 CA', amount: 15.49, category: 'Entertainment', rawDescription: 'NETFLIX.COM* 800-585-7930 CA' },
  { id: 'tx_103', date: '2026-08-12', merchant: 'NETFLIX.COM* 800-585-7930 CA', amount: 15.49, category: 'Entertainment', rawDescription: 'NETFLIX.COM* 800-585-7930 CA' },
  { id: 'tx_104', date: '2026-09-12', merchant: 'NETFLIX.COM* 800-585-7930 CA', amount: 19.99, category: 'Entertainment', rawDescription: 'NETFLIX.COM* 800-585-7930 CA - PLAN UPGRADE' },

  // Spotify (Price hiked from 9.99 to 11.99)
  { id: 'tx_105', date: '2026-06-18', merchant: 'Spotify USA NYC', amount: 9.99, category: 'Music & Audio', rawDescription: 'SPOTIFY USA RECURRING' },
  { id: 'tx_106', date: '2026-07-18', merchant: 'Spotify USA NYC', amount: 9.99, category: 'Music & Audio', rawDescription: 'SPOTIFY USA RECURRING' },
  { id: 'tx_107', date: '2026-08-18', merchant: 'Spotify USA NYC', amount: 9.99, category: 'Music & Audio', rawDescription: 'SPOTIFY USA RECURRING' },
  { id: 'tx_108', date: '2026-09-18', merchant: 'Spotify USA NYC', amount: 11.99, category: 'Music & Audio', rawDescription: 'SPOTIFY USA RECURRING - RATE ADJUSTMENT' },

  // ChatGPT Plus (Stable 20.00)
  { id: 'tx_109', date: '2026-06-03', merchant: 'OpenAI *ChatGPT Subscription', amount: 20.00, category: 'AI Tools', rawDescription: 'OPENAI *CHATGPT SUBSCRIPTION SAN FRANCISCO CA' },
  { id: 'tx_110', date: '2026-07-03', merchant: 'OpenAI *ChatGPT Subscription', amount: 20.00, category: 'AI Tools', rawDescription: 'OPENAI *CHATGPT SUBSCRIPTION SAN FRANCISCO CA' },
  { id: 'tx_111', date: '2026-08-03', merchant: 'OpenAI *ChatGPT Subscription', amount: 20.00, category: 'AI Tools', rawDescription: 'OPENAI *CHATGPT SUBSCRIPTION SAN FRANCISCO CA' },
  { id: 'tx_112', date: '2026-09-03', merchant: 'OpenAI *ChatGPT Subscription', amount: 20.00, category: 'AI Tools', rawDescription: 'OPENAI *CHATGPT SUBSCRIPTION SAN FRANCISCO CA' },

  // Adobe Creative Cloud (Zombie - 54.99)
  { id: 'tx_113', date: '2026-06-25', merchant: 'ADOBE *CREATIVE CLOUD', amount: 54.99, category: 'Productivity', rawDescription: 'ADOBE *CREATIVE CLOUD 800-833-6687 CA' },
  { id: 'tx_114', date: '2026-07-25', merchant: 'ADOBE *CREATIVE CLOUD', amount: 54.99, category: 'Productivity', rawDescription: 'ADOBE *CREATIVE CLOUD 800-833-6687 CA' },
  { id: 'tx_115', date: '2026-08-25', merchant: 'ADOBE *CREATIVE CLOUD', amount: 54.99, category: 'Productivity', rawDescription: 'ADOBE *CREATIVE CLOUD 800-833-6687 CA' },
  { id: 'tx_116', date: '2026-09-25', merchant: 'ADOBE *CREATIVE CLOUD', amount: 54.99, category: 'Productivity', rawDescription: 'ADOBE *CREATIVE CLOUD 800-833-6687 CA' },

  // Apple Services (iCloud 2TB + Arcade - 12.99)
  { id: 'tx_117', date: '2026-06-08', merchant: 'APPLE.COM/BILL', amount: 12.99, category: 'Cloud & Storage', rawDescription: 'APPLE.COM/BILL ONE APPLE PARK WAY' },
  { id: 'tx_118', date: '2026-07-08', merchant: 'APPLE.COM/BILL', amount: 12.99, category: 'Cloud & Storage', rawDescription: 'APPLE.COM/BILL ONE APPLE PARK WAY' },
  { id: 'tx_119', date: '2026-08-08', merchant: 'APPLE.COM/BILL', amount: 12.99, category: 'Cloud & Storage', rawDescription: 'APPLE.COM/BILL ONE APPLE PARK WAY' },
  { id: 'tx_120', date: '2026-09-08', merchant: 'APPLE.COM/BILL', amount: 12.99, category: 'Cloud & Storage', rawDescription: 'APPLE.COM/BILL ONE APPLE PARK WAY' },

  // Fitness Club (Zombie - 45.00)
  { id: 'tx_121', date: '2026-06-15', merchant: 'Planet Fitness Club Dues', amount: 45.00, category: 'Fitness', rawDescription: 'PLANET FITNESS CLUB DUES ACH' },
  { id: 'tx_122', date: '2026-07-15', merchant: 'Planet Fitness Club Dues', amount: 45.00, category: 'Fitness', rawDescription: 'PLANET FITNESS CLUB DUES ACH' },
  { id: 'tx_123', date: '2026-08-15', merchant: 'Planet Fitness Club Dues', amount: 45.00, category: 'Fitness', rawDescription: 'PLANET FITNESS CLUB DUES ACH' },
  { id: 'tx_124', date: '2026-09-15', merchant: 'Planet Fitness Club Dues', amount: 45.00, category: 'Fitness', rawDescription: 'PLANET FITNESS CLUB DUES ACH' },

  // New York Times (Promo rate jumped from $4.00 to $25.00!)
  { id: 'tx_125', date: '2026-06-05', merchant: 'NYTimes Digital Sub', amount: 4.00, category: 'Productivity', rawDescription: 'NYTIMES DIGITAL SUB INTRO RATE' },
  { id: 'tx_126', date: '2026-07-05', merchant: 'NYTimes Digital Sub', amount: 4.00, category: 'Productivity', rawDescription: 'NYTIMES DIGITAL SUB INTRO RATE' },
  { id: 'tx_127', date: '2026-08-05', merchant: 'NYTimes Digital Sub', amount: 4.00, category: 'Productivity', rawDescription: 'NYTIMES DIGITAL SUB INTRO RATE' },
  { id: 'tx_128', date: '2026-09-05', merchant: 'NYTimes Digital Sub', amount: 25.00, category: 'Productivity', rawDescription: 'NYTIMES DIGITAL SUB STANDARD RATE HIKE' },

  // Disney+ (13.99)
  { id: 'tx_129', date: '2026-07-21', merchant: 'Disney+ Monthly', amount: 13.99, category: 'Entertainment', rawDescription: 'DISNEY PLUS STREAMING' },
  { id: 'tx_130', date: '2026-08-21', merchant: 'Disney+ Monthly', amount: 13.99, category: 'Entertainment', rawDescription: 'DISNEY PLUS STREAMING' },
  { id: 'tx_131', date: '2026-09-21', merchant: 'Disney+ Monthly', amount: 13.99, category: 'Entertainment', rawDescription: 'DISNEY PLUS STREAMING' },

  // Duolingo Super (12.99)
  { id: 'tx_132', date: '2026-07-10', merchant: 'Duolingo Super App', amount: 12.99, category: 'Productivity', rawDescription: 'DUOLINGO SUPER APP' },
  { id: 'tx_133', date: '2026-08-10', merchant: 'Duolingo Super App', amount: 12.99, category: 'Productivity', rawDescription: 'DUOLINGO SUPER APP' },
  { id: 'tx_134', date: '2026-09-10', merchant: 'Duolingo Super App', amount: 12.99, category: 'Productivity', rawDescription: 'DUOLINGO SUPER APP' },

  // Miscellaneous non-recurring transactions for realism
  { id: 'tx_135', date: '2026-09-14', merchant: 'Trader Joe\'s Grocery', amount: 68.42, category: 'Groceries', rawDescription: 'TRADER JOE\'S #542' },
  { id: 'tx_136', date: '2026-09-19', merchant: 'Blue Bottle Coffee', amount: 6.75, category: 'Coffee', rawDescription: 'BLUE BOTTLE COFFEE' },
  { id: 'tx_137', date: '2026-09-22', merchant: 'Target Store #1842', amount: 34.20, category: 'Shopping', rawDescription: 'TARGET STORE 1842' },
  { id: 'tx_138', date: '2026-09-26', merchant: 'Uber Ride', amount: 24.50, category: 'Transport', rawDescription: 'UBER *TRIP' },
];

export const PRESET_BANKS = [
  {
    id: 'chase',
    name: 'Chase Sapphire Statement',
    description: 'Realistic modern checking with 9 recurring services & 2 price hikes',
    badge: 'Popular',
    icon: '💳',
    txCount: INITIAL_TRANSACTIONS.length,
    data: INITIAL_TRANSACTIONS,
  },
  {
    id: 'apple_card',
    name: 'Apple Card Statement (CSV)',
    description: 'Tech-heavy subscriptions (ChatGPT, Apple Services, GitHub, Notion)',
    badge: 'Tech Stack',
    icon: '🍏',
    txCount: 16,
    data: [
      { id: 'ac_1', date: '2026-07-01', merchant: 'OpenAI *ChatGPT', amount: 20.00, category: 'AI Tools', rawDescription: 'APPLE CARD OPENAI' },
      { id: 'ac_2', date: '2026-08-01', merchant: 'OpenAI *ChatGPT', amount: 20.00, category: 'AI Tools', rawDescription: 'APPLE CARD OPENAI' },
      { id: 'ac_3', date: '2026-09-01', merchant: 'OpenAI *ChatGPT', amount: 20.00, category: 'AI Tools', rawDescription: 'APPLE CARD OPENAI' },
      { id: 'ac_4', date: '2026-07-04', merchant: 'GitHub Pro', amount: 10.00, category: 'Productivity', rawDescription: 'GITHUB.COM' },
      { id: 'ac_5', date: '2026-08-04', merchant: 'GitHub Pro', amount: 10.00, category: 'Productivity', rawDescription: 'GITHUB.COM' },
      { id: 'ac_6', date: '2026-09-04', merchant: 'GitHub Pro', amount: 10.00, category: 'Productivity', rawDescription: 'GITHUB.COM' },
      { id: 'ac_7', date: '2026-07-15', merchant: 'Notion Plus', amount: 10.00, category: 'Productivity', rawDescription: 'NOTION LABS INC' },
      { id: 'ac_8', date: '2026-08-15', merchant: 'Notion Plus', amount: 10.00, category: 'Productivity', rawDescription: 'NOTION LABS INC' },
      { id: 'ac_9', date: '2026-09-15', merchant: 'Notion Plus', amount: 12.00, category: 'Productivity', rawDescription: 'NOTION LABS INC - PRICE HIKE' },
      { id: 'ac_10', date: '2026-07-20', merchant: 'Claude Pro Anthropic', amount: 20.00, category: 'AI Tools', rawDescription: 'ANTHROPIC CLAUDE' },
      { id: 'ac_11', date: '2026-08-20', merchant: 'Claude Pro Anthropic', amount: 20.00, category: 'AI Tools', rawDescription: 'ANTHROPIC CLAUDE' },
      { id: 'ac_12', date: '2026-09-20', merchant: 'Claude Pro Anthropic', amount: 20.00, category: 'AI Tools', rawDescription: 'ANTHROPIC CLAUDE' },
    ],
  },
  {
    id: 'revolut_family',
    name: 'Revolut Family & Lifestyle',
    description: 'Household streaming, meal deliveries, and gym club',
    badge: 'Family',
    icon: '🏡',
    txCount: 14,
    data: [
      { id: 'rf_1', date: '2026-07-02', merchant: 'HelloFresh Meal Delivery', amount: 65.00, category: 'Food & Lifestyle', rawDescription: 'HELLOFRESH WEEKLY' },
      { id: 'rf_2', date: '2026-07-09', merchant: 'HelloFresh Meal Delivery', amount: 65.00, category: 'Food & Lifestyle', rawDescription: 'HELLOFRESH WEEKLY' },
      { id: 'rf_3', date: '2026-07-16', merchant: 'HelloFresh Meal Delivery', amount: 65.00, category: 'Food & Lifestyle', rawDescription: 'HELLOFRESH WEEKLY' },
      { id: 'rf_4', date: '2026-07-23', merchant: 'HelloFresh Meal Delivery', amount: 72.00, category: 'Food & Lifestyle', rawDescription: 'HELLOFRESH WEEKLY - INGREDIENT SURCHARGE' },
      { id: 'rf_5', date: '2026-07-05', merchant: 'Disney+ Bundle', amount: 19.99, category: 'Entertainment', rawDescription: 'DISNEY BUNDLE' },
      { id: 'rf_6', date: '2026-08-05', merchant: 'Disney+ Bundle', amount: 19.99, category: 'Entertainment', rawDescription: 'DISNEY BUNDLE' },
      { id: 'rf_7', date: '2026-09-05', merchant: 'Disney+ Bundle', amount: 24.99, category: 'Entertainment', rawDescription: 'DISNEY BUNDLE - RATE HIKE' },
      { id: 'rf_8', date: '2026-07-10', merchant: 'Amazon Prime', amount: 14.99, category: 'Entertainment', rawDescription: 'AMZN PRIME' },
      { id: 'rf_9', date: '2026-08-10', merchant: 'Amazon Prime', amount: 14.99, category: 'Entertainment', rawDescription: 'AMZN PRIME' },
      { id: 'rf_10', date: '2026-09-10', merchant: 'Amazon Prime', amount: 14.99, category: 'Entertainment', rawDescription: 'AMZN PRIME' },
    ],
  },
];
