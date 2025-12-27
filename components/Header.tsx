
import React, { useState, useEffect } from 'react';
import { StartIcon, StopIcon } from './Icons';

interface HeaderProps {
  subject: string;
  setSubject: (s: string) => void;
  isActive: boolean;
  onStartStop: () => void;
}

const Header: React.FC<HeaderProps> = ({ subject, setSubject, isActive, onStartStop }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const subjects = ['國文', '英文', '數學', '社會', '自然', '體育', '藝術', '綜合'];

  return (
    <header className="glass-panel h-20 px-6 flex items-center justify-between z-10 sticky top-0 border-b border-amber-500/20">
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-widest text-amber-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            CHRONOS
          </h1>
          <p className="text-[10px] text-amber-500/60 uppercase tracking-tighter">Digital Observation Dashboard</p>
        </div>

        <div className="h-10 w-px bg-amber-500/20 mx-2 hidden md:block"></div>

        <div className="relative group">
          <select 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={isActive}
            className="bg-transparent border border-amber-500/30 rounded-lg px-4 py-1.5 outline-none text-sm cursor-pointer hover:border-amber-500 focus:border-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed appearance-none pr-8"
          >
            {subjects.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-amber-500/50">
            <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <div className="text-2xl font-mono tracking-widest text-amber-400 font-light hidden sm:block">
          {time.toLocaleTimeString('zh-TW', { hour12: false })}
        </div>

        <button 
          onClick={onStartStop}
          className="relative group transition-transform active:scale-95 outline-none"
        >
          {isActive ? (
            <div className="flex items-center gap-2 px-6 py-2 rounded-full rust-gradient shadow-lg shadow-red-900/40">
              <StopIcon className="w-6 h-6" />
              <span className="font-bold text-sm tracking-widest">結束觀課</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-6 py-2 rounded-full klimt-gradient shadow-lg shadow-amber-900/40">
              <StartIcon className="w-6 h-6" />
              <span className="font-bold text-sm tracking-widest">開始觀課</span>
            </div>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
