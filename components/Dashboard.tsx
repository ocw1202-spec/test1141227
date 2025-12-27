
import React, { useRef } from 'react';
import { TeachingMode, TeachingAction, SessionState } from '../types';

interface DashboardProps {
  session: SessionState;
  toggleMode: (mode: TeachingMode) => void;
  recordAction: (action: TeachingAction) => void;
  toggleActionTiming: (action: TeachingAction) => void;
}

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const Dashboard: React.FC<DashboardProps> = ({ session, toggleMode, recordAction, toggleActionTiming }) => {
  const modes = Object.values(TeachingMode);
  const actions = Object.values(TeachingAction);
  
  // Ref to track long press
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isLongPress = useRef(false);

  const handleActionTouchStart = (action: TeachingAction) => {
    isLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPress.current = true;
      toggleActionTiming(action);
    }, 600); // 600ms for long press
  };

  const handleActionTouchEnd = (action: TeachingAction) => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    if (!isLongPress.current) {
      recordAction(action);
    }
  };

  return (
    <>
      {/* Left: Teaching Modes (States) */}
      <section className="md:col-span-4 flex flex-col gap-4">
        <h2 className="text-amber-500/80 text-xs font-bold tracking-widest uppercase mb-2 flex items-center gap-2">
          <div className="w-1 h-3 bg-amber-500"></div>
          教學模式 (States)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4 flex-1">
          {modes.map(mode => {
            const isActive = session.currentMode === mode;
            return (
              <button
                key={mode}
                onClick={() => toggleMode(mode)}
                disabled={!session.isActive}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between h-32 md:h-auto md:min-h-[100px] text-left relative overflow-hidden group
                  ${isActive 
                    ? 'klimt-gradient border-amber-300 shadow-xl shadow-amber-900/20' 
                    : 'bg-slate-900/50 border-amber-500/10 hover:border-amber-500/30'
                  }
                  ${!session.isActive ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="flex justify-between items-start z-10">
                  <span className={`text-lg font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>{mode}</span>
                  {isActive && <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>}
                </div>
                <div className={`text-2xl font-mono mt-4 z-10 ${isActive ? 'text-amber-100' : 'text-amber-500/40'}`}>
                  {formatDuration(session.modeDurations[mode])}
                </div>
                <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full border border-white/5 group-hover:scale-110 transition-transform ${isActive ? 'opacity-20' : 'opacity-0'}`}></div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Right: Teaching Actions & Logs */}
      <section className="md:col-span-8 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <h2 className="text-amber-500/80 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
              <div className="w-1 h-3 bg-amber-500"></div>
              教學行為 (Actions)
            </h2>
            <span className="text-[10px] text-amber-500/40 italic">長按可切換計時模式</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {actions.map(action => {
              const isTiming = session.currentAction === action;
              const hasDuration = session.actionDurations[action] > 0;
              
              return (
                <button
                  key={action}
                  onMouseDown={() => handleActionTouchStart(action)}
                  onMouseUp={() => handleActionTouchEnd(action)}
                  onMouseLeave={() => longPressTimer.current && clearTimeout(longPressTimer.current)}
                  onTouchStart={() => handleActionTouchStart(action)}
                  onTouchEnd={() => handleActionTouchEnd(action)}
                  disabled={!session.isActive}
                  className={`p-3 rounded-lg border transition-all flex flex-col items-center justify-center gap-1 group relative overflow-hidden
                    ${isTiming 
                      ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/40 animate-pulse text-white' 
                      : 'bg-slate-900/80 border-amber-500/20 hover:border-amber-500 hover:bg-amber-500/5'
                    }
                    ${!session.isActive ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                  `}
                >
                  <span className={`text-[10px] font-bold text-center leading-tight ${isTiming ? 'text-blue-100' : 'text-amber-500/80 group-hover:text-amber-500'}`}>
                    {action}
                  </span>
                  
                  <div className="flex flex-col items-center">
                    <span className={`text-xl font-mono ${isTiming ? 'text-white' : 'text-amber-200'}`}>
                      {session.actionCounts[action]}
                    </span>
                    {(hasDuration || isTiming) && (
                      <span className={`text-[10px] font-mono ${isTiming ? 'text-blue-200' : 'text-slate-500'}`}>
                        {formatDuration(session.actionDurations[action])}
                      </span>
                    )}
                  </div>

                  {isTiming && (
                    <div className="absolute top-1 right-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          <h2 className="text-amber-500/80 text-xs font-bold tracking-widest uppercase flex items-center gap-2">
            <div className="w-1 h-3 bg-amber-500"></div>
            即時紀錄流 (Log Stream)
          </h2>
          <div className="flex-1 glass-panel rounded-xl p-4 overflow-y-auto font-mono text-xs flex flex-col-reverse gap-2 border-amber-500/10">
            {session.logs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-600 italic">
                無活動紀錄
              </div>
            ) : (
              session.logs.map((log) => (
                <div key={log.id} className="flex gap-4 border-b border-white/5 pb-2 last:border-0 hover:bg-white/5 p-1 rounded transition-colors">
                  <span className="text-amber-500/60 shrink-0">
                    [{log.timestamp.toLocaleTimeString('zh-TW', { hour12: false })}]
                  </span>
                  <div className="flex gap-2">
                    <span className={`px-1.5 rounded-sm shrink-0 font-bold ${
                      log.type === 'MODE_CHANGE' ? 'bg-amber-500/20 text-amber-400' :
                      log.type === 'ACTION' ? 'bg-blue-500/20 text-blue-400' :
                      log.type === 'ACTION_TIMER' ? 'bg-blue-700/40 text-blue-200' :
                      log.type === 'ENGAGEMENT' ? 'bg-green-500/20 text-green-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {log.type === 'ACTION' ? '行為' : 
                       log.type === 'ACTION_TIMER' ? '計時' :
                       log.type === 'MODE_CHANGE' ? '模式' : 
                       log.type === 'ENGAGEMENT' ? '專注' : '備註'}
                    </span>
                    <span className="text-slate-300">{log.label}</span>
                    {log.value && <span className="text-slate-500">({log.value})</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
