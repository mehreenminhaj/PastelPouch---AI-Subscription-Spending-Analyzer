import React, { useState, useEffect } from 'react';
import { X, Mail, MessageSquare, ExternalLink, Calendar, Check, Copy, Sparkles, ShieldAlert, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Subscription, CancellationAssistantData } from '../types';
import { MascotCharacter } from './MascotCharacter';

interface CancellationModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: Subscription | null;
  onMarkCancelled: (subId: string, savedAmount: number) => void;
  onSetReminder: (subId: string, daysBefore: number) => void;
}

export const CancellationModal: React.FC<CancellationModalProps> = ({
  isOpen,
  onClose,
  subscription,
  onMarkCancelled,
  onSetReminder,
}) => {
  const [activeTab, setActiveTab] = useState<'email' | 'chat' | 'steps' | 'reminder'>('email');
  const [copied, setCopied] = useState(false);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [aiData, setAiData] = useState<CancellationAssistantData | null>(null);
  const [reminderDays, setReminderDays] = useState(3);
  const [reminderSaved, setReminderSaved] = useState(false);

  useEffect(() => {
    if (isOpen && subscription) {
      fetchCancellationData();
    } else {
      setAiData(null);
      setReminderSaved(false);
    }
  }, [isOpen, subscription]);

  if (!isOpen || !subscription) return null;

  const fetchCancellationData = async () => {
    setIsLoadingAi(true);
    try {
      const res = await fetch('/api/ai/cancellation-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceName: subscription.name,
          accountEmail: 'user@example.com',
          subscriptionAmount: subscription.amount,
          frequency: subscription.frequency,
          reason: 'Reducing unused recurring subscriptions as part of monthly budget cleanup',
          difficultyLevel: subscription.cancellationDifficulty || 'standard',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiData(data);
      } else {
        throw new Error('Fallback to local template');
      }
    } catch {
      // Fallback local smart template
      setAiData({
        serviceName: subscription.name,
        subject: `Cancellation Request & Revocation of Billing: ${subscription.name} Account`,
        emailBody: `Dear ${subscription.name} Support Team,\n\nPlease immediately cancel my subscription for ${subscription.name} (Amount: $${subscription.amount}/${subscription.frequency}) and revoke any pre-authorized recurring payments attached to my billing information.\n\nI confirm that I do not wish to renew for the upcoming billing cycle starting on ${subscription.nextBillingDate}.\n\nPlease provide written confirmation of cancellation and confirm that no further charges will occur.\n\nThank you,\nAccount Holder`,
        chatScript: [
          { speaker: 'Customer Service Bot', message: 'Before you go, would you like a 50% discount for the next 3 months?' },
          { speaker: 'You', message: 'No thank you, I appreciate the offer but I want to proceed with full immediate cancellation.' },
          { speaker: 'Customer Service Bot', message: 'Are you sure? You will lose access to all premium features at the end of the billing period.' },
          { speaker: 'You', message: 'Yes, please confirm my cancellation effective immediately and send a confirmation email.' },
        ],
        cancellationSteps: [
          `Go to ${subscription.cancellationUrl || 'the account settings page'}`,
          'Navigate to Plans & Billing -> Manage Subscription',
          'Select "Cancel Plan" and decline any pause or bundle retention offers',
          `Verify status says "Cancelled" with expiration set for ${subscription.nextBillingDate}`,
        ],
        mascotTip: 'Mochi says: Take a screenshot of the confirmation page right after cancelling so you have proof!',
        refundEligibleHint: 'If you were charged within the last 48 hours without using the service, ask for a goodwill refund.',
      });
    } finally {
      setIsLoadingAi(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkAsCancelled = () => {
    const annualSavings = subscription.frequency === 'yearly' ? subscription.amount : subscription.amount * 12;
    onMarkCancelled(subscription.id, annualSavings);

    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#34D399', '#F472B6', '#FBBF24', '#60A5FA'],
    });

    onClose();
  };

  const handleSaveReminder = () => {
    onSetReminder(subscription.id, reminderDays);
    setReminderSaved(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // Download iCal (.ics) file for renewal alert
  const handleDownloadCalendarEvent = () => {
    const renewDate = new Date(subscription.nextBillingDate);
    const alertDate = new Date(renewDate);
    alertDate.setDate(alertDate.getDate() - reminderDays);

    const dateStr = alertDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//PastelPouch//Subscription Reminder//EN',
      'BEGIN:VEVENT',
      `UID:sub-reminder-${subscription.id}@pastelpouch.app`,
      `DTSTAMP:${dateStr}`,
      `DTSTART:${dateStr}`,
      `SUMMARY:🔔 Cancel/Review ${subscription.name} ($${subscription.amount}/${subscription.frequency})`,
      `DESCRIPTION:Your ${subscription.name} subscription renews on ${subscription.nextBillingDate}. Cancel now if not in use! Generated by PastelPouch.`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reminder_${subscription.name.toLowerCase().replace(/\s+/g, '_')}.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-pink-100 max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-100">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-2xl bg-emerald-100 text-emerald-700">
              <ShieldAlert className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Fredoka'] text-lg font-bold text-slate-800">
                  Cancel {subscription.name}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Save ${(subscription.frequency === 'yearly' ? subscription.amount : subscription.amount * 12).toFixed(0)}/yr
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Renews on {subscription.nextBillingDate} • ${subscription.amount}/{subscription.frequency}
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
        <div className="my-3.5 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/80 flex items-center gap-3">
          <MascotCharacter mascotId="mochi" size="sm" mood="excited" />
          <div className="text-xs text-emerald-950">
            <p className="font-bold text-emerald-800">Mochi's Snip Assistant</p>
            <p className="text-[11px] text-emerald-800/90">
              {aiData?.mascotTip || 'Use our pre-written email or live chat script to bypass retention traps!'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-100/80 p-1 rounded-2xl mb-4 border border-slate-200/60">
          <button
            type="button"
            onClick={() => setActiveTab('email')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'email' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'chat' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Live Chat</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('steps')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'steps' ? 'bg-white text-purple-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Direct Link</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('reminder')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'reminder' ? 'bg-white text-pink-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Reminder</span>
          </button>
        </div>

        {/* Content by Tab */}
        {isLoadingAi ? (
          <div className="py-12 text-center space-y-3">
            <MascotCharacter mascotId="mochi" size="md" mood="thinking" />
            <p className="text-xs font-bold text-slate-500 animate-pulse">
              Drafting ironclad cancellation script with Gemini AI...
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'email' && aiData && (
              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                    Subject Line
                  </label>
                  <div className="p-2.5 bg-slate-50 rounded-xl text-xs font-semibold text-slate-800 border border-slate-200">
                    {aiData.subject}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Cancellation Letter Body
                    </label>
                    <button
                      type="button"
                      onClick={() => handleCopy(`${aiData.subject}\n\n${aiData.emailBody}`)}
                      className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
                    </button>
                  </div>
                  <pre className="p-3 bg-slate-50 rounded-2xl text-xs font-mono text-slate-700 whitespace-pre-wrap border border-slate-200 max-h-48 overflow-y-auto custom-scrollbar leading-relaxed">
                    {aiData.emailBody}
                  </pre>
                </div>
              </div>
            )}

            {activeTab === 'chat' && aiData && (
              <div className="space-y-2.5 max-h-56 overflow-y-auto custom-scrollbar p-1">
                <p className="text-xs text-slate-500 font-semibold mb-2">
                  Use these quick responses when live chat agents push discount offers:
                </p>
                {aiData.chatScript.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-2xl text-xs ${
                      msg.speaker === 'You'
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 ml-6'
                        : 'bg-slate-100 text-slate-800 mr-6'
                    }`}
                  >
                    <div className="font-bold text-[10px] uppercase opacity-75 mb-0.5">
                      {msg.speaker}
                    </div>
                    <div>{msg.message}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'steps' && aiData && (
              <div className="space-y-3">
                <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                  <h4 className="text-xs font-bold text-indigo-900 mb-1 flex items-center gap-1.5">
                    <ExternalLink className="w-3.5 h-3.5" />
                    Direct Portal Link
                  </h4>
                  {subscription.cancellationUrl ? (
                    <a
                      href={subscription.cancellationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-indigo-600 underline hover:text-indigo-800 break-all"
                    >
                      {subscription.cancellationUrl}
                    </a>
                  ) : (
                    <p className="text-xs text-slate-600">
                      Open {subscription.name} app or website settings.
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-slate-700">Recommended Steps:</p>
                  {aiData.cancellationSteps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reminder' && (
              <div className="space-y-4">
                <div className="p-3 bg-pink-50 rounded-2xl border border-pink-200 text-xs text-slate-700">
                  <p className="font-bold text-pink-700">Never get caught by surprise renewals!</p>
                  <p className="text-[11px] mt-0.5">
                    Next billing date is <span className="font-bold">{subscription.nextBillingDate}</span>. We will remind you beforehand.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Send Reminder:
                  </label>
                  <div className="flex gap-2">
                    {[1, 3, 5, 7].map(days => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setReminderDays(days)}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          reminderDays === days
                            ? 'bg-pink-500 text-white border-pink-500 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-pink-300'
                        }`}
                      >
                        {days} {days === 1 ? 'day' : 'days'} before
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSaveReminder}
                    className="flex-1 py-2.5 rounded-xl bg-pink-600 text-white text-xs font-bold hover:bg-pink-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{reminderSaved ? 'Reminder Active!' : 'Set In-App Alert'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadCalendarEvent}
                    className="px-3 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                    title="Export to Apple / Google Calendar (.ics)"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Sync Calendar</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer Actions */}
        <div className="border-t border-slate-100 mt-5 pt-3.5 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800"
          >
            Keep Subscription
          </button>

          <button
            type="button"
            onClick={handleMarkAsCancelled}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
          >
            <Award className="w-4 h-4" />
            <span>Mark Cancelled &amp; Bank ${(subscription.frequency === 'yearly' ? subscription.amount : subscription.amount * 12).toFixed(0)} Savings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
