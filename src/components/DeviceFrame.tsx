import React from 'react';
import { Smartphone, Monitor, ShieldCheck, Wifi, Battery, Sparkles } from 'lucide-react';

export type DeviceMode = 'ios' | 'android' | 'desktop';

interface DeviceFrameProps {
  mode: DeviceMode;
  onModeChange: (mode: DeviceMode) => void;
  children: React.ReactNode;
  vaultLocked?: boolean;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  mode,
  onModeChange,
  children,
  vaultLocked = false,
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/80 via-purple-50/50 to-blue-50/70 text-slate-800 flex flex-col items-center">
      {/* Top Device Bar & Mode Switcher */}
      <header className="w-full bg-white/70 backdrop-blur-md border-b border-pink-100/80 sticky top-0 z-40 px-4 py-2.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-300 flex items-center justify-center shadow-xs text-white font-bold text-lg">
            🌸
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base md:text-lg tracking-tight bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent font-['Fredoka']">
                PastelPouch
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                AI ML 2.5
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Whimsical AI Subscription &amp; Spending Analyzer
            </p>
          </div>
        </div>

        {/* View Switcher: iOS / Android / Desktop */}
        <div className="flex items-center bg-pink-100/80 p-1 rounded-2xl border border-pink-200 shadow-xs">
          <button
            type="button"
            onClick={() => onModeChange('ios')}
            className={`flex items-center gap-1.5 px-3 py-1.2 rounded-xl text-xs font-bold transition-all ${
              mode === 'ios'
                ? 'bg-white text-pink-600 shadow-xs scale-102'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Preview as Apple iOS App"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">iOS</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('android')}
            className={`flex items-center gap-1.5 px-3 py-1.2 rounded-xl text-xs font-bold transition-all ${
              mode === 'android'
                ? 'bg-white text-emerald-600 shadow-xs scale-102'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Preview as Android Pixel App"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Android</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.2 rounded-xl text-xs font-bold transition-all ${
              mode === 'desktop'
                ? 'bg-white text-indigo-600 shadow-xs scale-102'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Full Screen Dashboard View"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Full Web</span>
          </button>
        </div>

        {/* Security Indicator */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>AES-256 GCM Vault</span>
          </div>
        </div>
      </header>

      {/* Main Content Rendered inside Phone Frame or Full Container */}
      <main className="w-full flex-1 flex justify-center items-start p-2 sm:p-4 md:p-6 overflow-y-auto">
        {mode === 'desktop' ? (
          <div className="w-full max-w-7xl mx-auto transition-all animate-fadeIn">
            {children}
          </div>
        ) : mode === 'ios' ? (
          /* iPhone 16 Pro Frame Mockup */
          <div className="w-full max-w-[420px] transition-all my-2">
            <div className="relative mx-auto rounded-[48px] border-[10px] border-slate-800 bg-slate-900 shadow-2xl shadow-purple-900/20 ring-1 ring-slate-700 overflow-hidden">
              {/* Dynamic Island */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-3 text-white">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500/80 animate-pulse" />
                <span className="text-[9px] font-bold text-slate-300 flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                  PastelPouch
                </span>
                <span className="w-2 h-2 rounded-full bg-slate-800" />
              </div>

              {/* iOS Status Bar */}
              <div className="bg-white/95 px-7 pt-2.5 pb-1 flex justify-between items-center text-xs text-slate-900 font-semibold select-none border-b border-pink-50">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5" />
                  <Battery className="w-4 h-4" />
                </div>
              </div>

              {/* Scrollable Device Screen */}
              <div className="bg-gradient-to-b from-pink-50/50 to-white min-h-[760px] max-h-[820px] overflow-y-auto pb-8 custom-scrollbar">
                {children}
              </div>

              {/* iOS Home Indicator Bar */}
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-700/60 rounded-full pointer-events-none z-50" />
            </div>
            <p className="text-center text-[11px] text-slate-400 font-medium mt-2">
              Apple iOS 18 Mobile App View
            </p>
          </div>
        ) : (
          /* Google Pixel 9 Android Frame Mockup */
          <div className="w-full max-w-[420px] transition-all my-2">
            <div className="relative mx-auto rounded-[40px] border-[9px] border-slate-700 bg-slate-800 shadow-2xl shadow-emerald-900/20 ring-1 ring-slate-600 overflow-hidden">
              {/* Android Camera Punch Hole */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full z-50 ring-1 ring-slate-800 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
              </div>

              {/* Android Status Bar */}
              <div className="bg-white/95 px-6 pt-2 pb-1.5 flex justify-between items-center text-xs text-slate-800 font-medium select-none border-b border-emerald-50">
                <span className="text-[11px] font-bold">10:00</span>
                <div className="flex items-center gap-2">
                  <Wifi className="w-3.5 h-3.5 text-slate-700" />
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1 rounded">5G</span>
                  <Battery className="w-3.5 h-3.5 text-slate-700" />
                </div>
              </div>

              {/* Scrollable Device Screen */}
              <div className="bg-gradient-to-b from-emerald-50/30 to-white min-h-[760px] max-h-[820px] overflow-y-auto pb-10 custom-scrollbar">
                {children}
              </div>

              {/* Android Gesture Bar */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-slate-600/70 rounded-full pointer-events-none z-50" />
            </div>
            <p className="text-center text-[11px] text-slate-400 font-medium mt-2">
              Google Android 15 Material You View
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
