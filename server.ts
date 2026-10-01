import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// AI Subscription & Spending Analyzer endpoint
app.post('/api/ai/analyze-subscriptions', async (req, res) => {
  try {
    const { transactions, currentSubscriptions, monthlyBudget, currency = 'USD' } = req.body;

    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({ error: 'Valid transactions array is required.' });
    }

    const prompt = `You are a cheerful, meticulous financial AI mascot for "PastelPouch".
Analyze this list of user transactions and existing identified subscriptions.
Transactions summary:
${JSON.stringify(transactions.slice(0, 70), null, 2)}

Current identified subscriptions context:
${JSON.stringify(currentSubscriptions || [], null, 2)}

Monthly Budget Limit: ${monthlyBudget ? `${currency} ${monthlyBudget}` : 'Not set'}

Your task:
1. Identify all recurring subscription patterns (weekly, monthly, quarterly, annual).
2. Detect any price hikes or billing creeping (charges that increased compared to previous months).
3. Flag "zombie" or low-value subscriptions (services often forgotten, duplicate categories like 2 music streaming apps, 3 video apps, unbundled iCloud, expensive fitness apps).
4. Provide concrete, actionable budget optimization tips with estimated monthly & yearly dollar savings.
5. Create a cute, supportive message from the pastel mascot cheering the user on.

Return STRICT JSON matching the schema.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are PastelPouch AI, a kind, pastel-themed financial optimization companion. You speak encouragingly and provide realistic, hyper-accurate subscription calculations.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedSubscriptions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  category: { type: Type.STRING },
                  amount: { type: Type.NUMBER },
                  frequency: { type: Type.STRING, description: 'monthly, yearly, weekly, quarterly' },
                  confidenceScore: { type: Type.NUMBER, description: 'between 0.0 and 1.0' },
                  hasPriceHike: { type: Type.BOOLEAN },
                  previousAmount: { type: Type.NUMBER },
                  hikePercentage: { type: Type.NUMBER },
                  lastChargedDate: { type: Type.STRING },
                  nextEstimatedRenewal: { type: Type.STRING },
                  isZombieOrUnused: { type: Type.BOOLEAN },
                  reasonForZombie: { type: Type.STRING },
                },
                required: ['name', 'category', 'amount', 'frequency', 'confidenceScore'],
              },
            },
            priceHikes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  serviceName: { type: Type.STRING },
                  oldPrice: { type: Type.NUMBER },
                  newPrice: { type: Type.NUMBER },
                  difference: { type: Type.NUMBER },
                  annualImpact: { type: Type.NUMBER },
                  detectedDate: { type: Type.STRING },
                  advice: { type: Type.STRING },
                },
                required: ['serviceName', 'oldPrice', 'newPrice', 'difference', 'annualImpact'],
              },
            },
            optimizations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { type: Type.STRING },
                  potentialMonthlySavings: { type: Type.NUMBER },
                  potentialAnnualSavings: { type: Type.NUMBER },
                  actionType: { type: Type.STRING, description: 'cancel, downgrade, bundle, switch_annual, pause' },
                  difficulty: { type: Type.STRING, description: 'easy, medium, moderate' },
                },
                required: ['title', 'description', 'potentialMonthlySavings', 'actionType'],
              },
            },
            mascotMessage: {
              type: Type.OBJECT,
              properties: {
                mood: { type: Type.STRING, description: 'happy, excited, caring, shocked_at_hikes' },
                headline: { type: Type.STRING },
                adviceNote: { type: Type.STRING },
                savingsCheer: { type: Type.STRING },
              },
              required: ['mood', 'headline', 'adviceNote'],
            },
            totalMonthlySpend: { type: Type.NUMBER },
            potentialTotalAnnualSavings: { type: Type.NUMBER },
            budgetStatus: {
              type: Type.OBJECT,
              properties: {
                isOverBudget: { type: Type.BOOLEAN },
                currentBurnPercent: { type: Type.NUMBER },
                recommendation: { type: Type.STRING },
              },
              required: ['isOverBudget', 'currentBurnPercent'],
            },
          },
          required: ['detectedSubscriptions', 'priceHikes', 'optimizations', 'mascotMessage', 'totalMonthlySpend'],
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error('Empty response from AI model');
    }
    const parsed = JSON.parse(jsonText);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing subscriptions:', error);
    return res.status(500).json({
      error: 'Failed to analyze subscriptions',
      details: error?.message || 'Unknown error',
    });
  }
});

// Automated Cancellation Script & Email Generator
app.post('/api/ai/cancellation-letter', async (req, res) => {
  try {
    const { serviceName, accountEmail, subscriptionAmount, frequency, reason, difficultyLevel = 'standard' } = req.body;

    if (!serviceName) {
      return res.status(400).json({ error: 'Service name is required' });
    }

    const prompt = `Write an assertive, polite, and effective subscription cancellation request and live chat script for:
Service: ${serviceName}
Account Email: ${accountEmail || 'user@example.com'}
Current Cost: ${subscriptionAmount ? `$${subscriptionAmount}/${frequency || 'month'}` : 'Current Plan'}
Reason: ${reason || 'Budget optimization & no longer utilizing the service actively'}
Difficulty: ${difficultyLevel}

Requirements:
1. Provide an official Cancellation Email ready to send (with subject line, body, account info placeholders, and request for written confirmation & cessation of auto-renewals).
2. Provide a Live Chat Script with objection handling (in case the service tries retention offers or hidden barriers like Adobe or gym memberships).
3. Provide step-by-step instructions on where to go on iOS (App Store subscriptions), Android (Google Play subscriptions), or their Web dashboard.
4. Give a cute tip from Penny the Piggy bank on avoiding renewal charges.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You generate legally sound, polite, ironclad subscription cancellation correspondence and scripts.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            emailBody: { type: Type.STRING },
            chatScript: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  speaker: { type: Type.STRING },
                  message: { type: Type.STRING },
                },
                required: ['speaker', 'message'],
              },
            },
            cancellationSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            mascotTip: { type: Type.STRING },
            refundEligibleHint: { type: Type.STRING },
          },
          required: ['subject', 'emailBody', 'chatScript', 'cancellationSteps', 'mascotTip'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating cancellation letter:', error);
    return res.status(500).json({
      error: 'Failed to generate cancellation letter',
      details: error?.message || 'Unknown error',
    });
  }
});

// Interactive Mascot Chat
app.post('/api/ai/ask-mascot', async (req, res) => {
  try {
    const { question, mascot = 'Penny the Piggy', userContext } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const prompt = `You are ${mascot}, a lovable, super-smart personal finance mascot in the PastelPouch app.
Mascot Personalities:
- "Penny the Piggy": Warm, cheerful, loves stashing coins, squeals with joy when money is saved, gives gentle nudges.
- "Mochi the Cat": Playful, sleek, snips sneaky subscription weeds with tiny safety scissors, purrs when budgets stay intact.
- "Boba the Bear": Cozy, sweet like boba pearls, encouraging mentor who loves long-term savings goals and honey jars.
- "Sprout the Bunny": Fast, bouncy, never misses a renewal date, alerts the user right before free trials expire.

User context:
${JSON.stringify(userContext || {}, null, 2)}

User asks: "${question}"

Provide a delightful response:
- Stay in character with cute mannerisms (*blushes*, *jingles coins*, *wiggles ears*, or *swishes tail*)
- Provide practical, smart, and realistic financial advice
- Include 1-2 actionable tips
- Keep it concise, friendly, and easy to read.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are ${mascot}, a whimsical pastel companion who helps users master their subscriptions and savings.`,
      },
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Error in mascot chat:', error);
    return res.status(500).json({
      error: 'Failed to get mascot response',
      details: error?.message || 'Unknown error',
    });
  }
});

// Setup Vite middleware in development or serve static in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 PastelPouch server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
