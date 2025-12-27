
import React, { useState } from 'react';
import { EngagementLevel } from '../types';

interface FooterProps {
  engagement: EngagementLevel;
  setEngagement: (level: EngagementLevel) => void;
  addNote: (note: string) => void;
  isIdle: boolean;
  isActive: boolean;
}

const Footer: React.FC<FooterProps> = ({ engagement, setEngagement, addNote, isIdle, isActive }) => {
  const [note, setNote] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (note.trim()) {
      addNote(note.trim());
      setNote('');
    }
  };

  return (
    <footer className={`glass-panel h-20 md:h-16 px-6 flex flex-col md:flex-row items-center justify-between z-10 sticky bottom-0 border-t border-amber-500/20 transition-all gap-4 py-2 md:py-0
      ${isIdle ? 'idle-alert bg-amber-500/5' : ''}
    `}>
      <div className="flex items-center gap-6 w-full md:w-auto">
        <span className="text-[10px] font-bold text-amber-500/60 uppercase tracking-widest hidden lg:block">學生專注度:</span>
        <div className="flex p-1 bg-slate-900/50 rounded-lg border border-white/5 flex-1 md:flex-initial">
          {(['LOW', 'MID', 'HIGH'] as EngagementLevel[]).map(level => (
            <button
              key={level}
              onClick={() => setEngagement(level)}
              disabled={!isActive}
              className={`px-4 py-1 rounded-md text-xs font-bold transition-all flex-1 md:flex-none
                ${engagement === level 
                  ? (level === 'HIGH' ? 'bg-green-600' : level === 'MID' ? 'bg-yellow-600' : 'bg-red-600') + ' text-white shadow-lg shadow-black/40' 
                  : 'text-slate-500 hover:text-slate-300'}
                ${!isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {level === 'HIGH' ? '高' : level === 'MID' ? '中' : '低'}
            </button>
          ))}
        </div>
        {isIdle && <span className="text-[10px] text-amber-400 animate-pulse font-bold hidden sm:block">請記錄專注度!</span>}
      </div>

      <form onSubmit={handleSubmit} className="flex-1 max-w-2xl flex items-center gap-2 w-full">
        <input 
          type="text" 
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={!isActive}
          placeholder="質性紀錄輸入 (e.g., 學生進行互評...)"
          className="flex-1 bg-slate-900/50 border border-amber-500/20 rounded-lg px-4 py-1.5 text-sm outline-none focus:border-amber-500 transition-colors disabled:opacity-50"
        />
        <button 
          type="submit"
          disabled={!isActive || !note.trim()}
          className="px-4 py-1.5 klimt-gradient rounded-lg text-sm font-bold shadow-md shadow-amber-900/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
        >
          紀錄
        </button>
      </form>
    </footer>
  );
};

export default Footer;
