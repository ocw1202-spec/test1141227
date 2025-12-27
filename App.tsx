
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import SummaryModal from './components/SummaryModal';
import { TeachingMode, TeachingAction, ObservationLog, SessionState, EngagementLevel } from './types';

const App: React.FC = () => {
  const [session, setSession] = useState<SessionState>({
    isActive: false,
    startTime: null,
    endTime: null,
    currentMode: null,
    currentAction: null,
    modeDurations: {
      [TeachingMode.LECTURE]: 0,
      [TeachingMode.DISCUSSION]: 0,
      [TeachingMode.PRACTICE]: 0,
      [TeachingMode.DIGITAL]: 0,
    },
    actionCounts: {
      [TeachingAction.ENCOURAGEMENT]: 0,
      [TeachingAction.CORRECTION]: 0,
      [TeachingAction.OPEN_Q]: 0,
      [TeachingAction.CLOSED_Q]: 0,
      [TeachingAction.PATROL]: 0,
    },
    actionDurations: {
      [TeachingAction.ENCOURAGEMENT]: 0,
      [TeachingAction.CORRECTION]: 0,
      [TeachingAction.OPEN_Q]: 0,
      [TeachingAction.CLOSED_Q]: 0,
      [TeachingAction.PATROL]: 0,
    },
    logs: [],
    engagement: 'MID',
    lastActivity: Date.now(),
  });

  const [subject, setSubject] = useState('國文');
  const [showSummary, setShowSummary] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const touchActivity = useCallback(() => {
    setSession(prev => ({ ...prev, lastActivity: Date.now() }));
    setIsIdle(false);
  }, []);

  useEffect(() => {
    if (session.isActive) {
      timerRef.current = setInterval(() => {
        setSession(prev => {
          const newState = { ...prev };
          
          // Increment Mode timer
          if (prev.currentMode) {
            newState.modeDurations = {
              ...prev.modeDurations,
              [prev.currentMode]: prev.modeDurations[prev.currentMode] + 1
            };
          }

          // Increment Action timer
          if (prev.currentAction) {
            newState.actionDurations = {
              ...prev.actionDurations,
              [prev.currentAction]: prev.actionDurations[prev.currentAction] + 1
            };
          }
          
          if (Date.now() - prev.lastActivity > 300000) {
            setIsIdle(true);
          } else {
            setIsIdle(false);
          }

          return newState;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session.isActive]);

  const handleStartStop = () => {
    touchActivity();
    if (!session.isActive) {
      setSession(prev => ({
        ...prev,
        isActive: true,
        startTime: new Date(),
        logs: [{
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          type: 'MODE_CHANGE',
          label: '觀課開始'
        }]
      }));
    } else {
      setSession(prev => ({
        ...prev,
        isActive: false,
        endTime: new Date(),
        currentMode: null,
        currentAction: null
      }));
      setShowSummary(true);
    }
  };

  const toggleMode = (mode: TeachingMode) => {
    if (!session.isActive) return;
    touchActivity();
    setSession(prev => {
      const isSwitching = prev.currentMode !== mode;
      const newLogs: ObservationLog[] = [
        ...prev.logs,
        {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          type: 'MODE_CHANGE',
          label: isSwitching ? `切換模式: ${mode}` : `停止模式: ${mode}`
        }
      ];
      return {
        ...prev,
        currentMode: isSwitching ? mode : null,
        logs: newLogs.slice(-50)
      };
    });
  };

  const recordAction = (action: TeachingAction) => {
    if (!session.isActive) return;
    touchActivity();
    setSession(prev => {
      const newLogs: ObservationLog[] = [
        ...prev.logs,
        {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          type: 'ACTION',
          label: `行為次數: ${action}`
        }
      ];
      return {
        ...prev,
        actionCounts: {
          ...prev.actionCounts,
          [action]: prev.actionCounts[action] + 1
        },
        logs: newLogs.slice(-50)
      };
    });
  };

  const toggleActionTiming = (action: TeachingAction) => {
    if (!session.isActive) return;
    touchActivity();
    setSession(prev => {
      const isStarting = prev.currentAction !== action;
      const newLogs: ObservationLog[] = [
        ...prev.logs,
        {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          type: 'ACTION_TIMER',
          label: isStarting ? `開始計時行為: ${action}` : `停止計時行為: ${action}`
        }
      ];
      return {
        ...prev,
        currentAction: isStarting ? action : null,
        logs: newLogs.slice(-50)
      };
    });
  };

  const setEngagement = (level: EngagementLevel) => {
    touchActivity();
    setSession(prev => ({
      ...prev,
      engagement: level,
      logs: [
        ...prev.logs,
        {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          type: 'ENGAGEMENT',
          label: `專注度: ${level}`,
          value: level
        }
      ].slice(-50)
    }));
  };

  const addNote = (note: string) => {
    if (!session.isActive) return;
    touchActivity();
    setSession(prev => ({
      ...prev,
      logs: [
        ...prev.logs,
        {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date(),
          type: 'NOTE',
          label: '質性紀錄',
          value: note
        }
      ].slice(-50)
    }));
  };

  const resetSession = () => {
    setShowSummary(false);
    setSession({
      isActive: false,
      startTime: null,
      endTime: null,
      currentMode: null,
      currentAction: null,
      modeDurations: {
        [TeachingMode.LECTURE]: 0,
        [TeachingMode.DISCUSSION]: 0,
        [TeachingMode.PRACTICE]: 0,
        [TeachingMode.DIGITAL]: 0,
      },
      actionCounts: {
        [TeachingAction.ENCOURAGEMENT]: 0,
        [TeachingAction.CORRECTION]: 0,
        [TeachingAction.OPEN_Q]: 0,
        [TeachingAction.CLOSED_Q]: 0,
        [TeachingAction.PATROL]: 0,
      },
      actionDurations: {
        [TeachingAction.ENCOURAGEMENT]: 0,
        [TeachingAction.CORRECTION]: 0,
        [TeachingAction.OPEN_Q]: 0,
        [TeachingAction.CLOSED_Q]: 0,
        [TeachingAction.PATROL]: 0,
      },
      logs: [],
      engagement: 'MID',
      lastActivity: Date.now(),
    });
  };

  return (
    <div className="flex flex-col h-screen w-full relative overflow-hidden text-slate-100 select-none">
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg width="100%" height="100%">
          <pattern id="klimt-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="50" r="20" fill="none" stroke="#f59e0b" strokeWidth="1" />
            <rect x="10" y="10" width="20" height="20" fill="#f59e0b" />
            <path d="M70 20 L90 40 L70 60 Z" fill="#b45309" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#klimt-pattern)" />
        </svg>
      </div>

      <Header 
        subject={subject} 
        setSubject={setSubject} 
        isActive={session.isActive} 
        onStartStop={handleStartStop} 
      />

      <main className="flex-1 overflow-hidden p-4 md:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        <Dashboard 
          session={session} 
          toggleMode={toggleMode} 
          recordAction={recordAction} 
          toggleActionTiming={toggleActionTiming}
        />
      </main>

      <Footer 
        engagement={session.engagement} 
        setEngagement={setEngagement} 
        addNote={addNote}
        isIdle={isIdle}
        isActive={session.isActive}
      />

      {showSummary && (
        <SummaryModal 
          session={session} 
          subject={subject} 
          onClose={() => setShowSummary(false)}
          onReset={resetSession}
        />
      )}
    </div>
  );
};

export default App;
