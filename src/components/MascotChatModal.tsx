import React, { useState } from 'react';
import { X, Send, Sparkles, MessageCircle, RefreshCw } from 'lucide-react';
import { MascotInfo, MascotId } from '../types';
import { MascotCharacter } from './MascotCharacter';

interface MascotChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeMascot: MascotInfo;
  onSelectMascot: (mascotId: MascotId) => void;
  allMascots: MascotInfo[];
  totalSpend: number;
  activeCount: number;
  hikesCount: number;
}

interface ChatMessage {
  id: string;
  sender: 'mascot' | 'user';
  text: string;
  timestamp: string;
}

export const MascotChatModal: React.FC<MascotChatModalProps> = ({
  isOpen,
  onClose,
  activeMascot,
  onSelectMascot,
  allMascots,
  totalSpend,
  activeCount,
  hikesCount,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_init',
      sender: 'mascot',
      text: `${activeMascot.catchphrase} I'm analyzing your ${activeCount} active subscriptions ($${totalSpend.toFixed(2)}/mo). How can I help you save coins today?`,
      timestamp: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!isOpen) return null;

  const quickPrompts = [
    `How can I cut $50 this month?`,
    `Are there any subscriptions I forgot about?`,
    `How do I negotiate my Netflix or Spotify price hike?`,
    `Which streaming services could I bundle?`,
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: `u_${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/ask-mascot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          mascot: activeMascot.name,
          userContext: {
            monthlySpend: totalSpend,
            activeSubscriptionsCount: activeCount,
            priceHikesCount: hikesCount,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [
          ...prev,
          {
            id: `m_${Date.now()}`,
            sender: 'mascot',
            text: data.reply || 'You did great saving those coins!',
            timestamp: 'Just now',
          },
        ]);
      } else {
        throw new Error('API fallback');
      }
    } catch {
      // Whimsical local fallback
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: `m_${Date.now()}`,
            sender: 'mascot',
            text: `*wiggles ears cheerfully* Here is my tip! You have $${totalSpend.toFixed(2)} in subscriptions. Try pausing 1 video service and switching Duolingo to annual billing—you will pocket at least $25/month right away! 🌸`,
            timestamp: 'Just now',
          },
        ]);
      }, 600);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-4 sm:p-5 shadow-2xl border border-pink-100 flex flex-col h-[600px] max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-pink-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <MascotCharacter mascotId={activeMascot.id} size="sm" mood="happy" />
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-['Fredoka'] text-base font-bold text-slate-800">
                  {activeMascot.name}
                </h3>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700">
                  {activeMascot.title}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">Your AI Savings Companion</p>
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

        {/* Mascot Selector Bar */}
        <div className="py-2 flex items-center gap-1.5 border-b border-slate-100 shrink-0 overflow-x-auto custom-scrollbar">
          <span className="text-[10px] uppercase font-bold text-slate-400 px-1">Buddy:</span>
          {allMascots.map(m => (
            <button
              key={m.id}
              type="button"
              onClick={() => onSelectMascot(m.id)}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                activeMascot.id === m.id
                  ? 'bg-pink-100 text-pink-700 border border-pink-300 shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{m.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-2 space-y-3 custom-scrollbar my-2">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'mascot' && (
                <div className="shrink-0 mb-1">
                  <MascotCharacter mascotId={activeMascot.id} size="sm" mood="happy" />
                </div>
              )}
              <div
                className={`max-w-[78%] p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-pink-500 to-indigo-500 text-white rounded-br-xs'
                    : 'bg-pink-50/80 text-slate-800 border border-pink-100 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2">
              <MascotCharacter mascotId={activeMascot.id} size="sm" mood="thinking" />
              <div className="bg-pink-50 p-2.5 rounded-2xl text-xs text-slate-500 font-bold flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-3 h-3 text-pink-500" />
                <span>{activeMascot.name} is typing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="py-1.5 flex gap-1.5 overflow-x-auto custom-scrollbar shrink-0">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(q)}
              className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 hover:bg-pink-100 text-slate-700 hover:text-pink-800 whitespace-nowrap transition-colors border border-slate-200"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 shrink-0">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={`Ask ${activeMascot.name.split(' ')[0]} anything about your subscriptions...`}
            className="flex-1 text-xs p-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
          />
          <button
            type="button"
            onClick={() => handleSend()}
            disabled={!input.trim() || isTyping}
            className="p-2.5 rounded-2xl bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white transition-all shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
