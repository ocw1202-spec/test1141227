
import React from 'react';
// Corrected import from types.ts
import { SessionState, TeachingMode, TeachingAction } from '../types';

interface SummaryModalProps {
  session: SessionState;
  subject: string;
  onClose: () => void;
  onReset: () => void;
}

const SummaryModal: React.FC<SummaryModalProps> = ({ session, subject, onClose, onReset }) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分 ${secs}秒`;
  };

  const getFormattedReport = () => {
    const header = `【Chronos 數位觀課報告】\n科目: ${subject}\n日期: ${new Date().toLocaleDateString('zh-TW')}\n時間: ${session.startTime?.toLocaleTimeString('zh-TW', { hour12: false })} - ${session.endTime?.toLocaleTimeString('zh-TW', { hour12: false })}\n\n`;
    
    let modesReport = "== [1] 教學模式累計時間 ==\n";
    Object.entries(session.modeDurations).forEach(([mode, duration]) => {
      modesReport += `${mode}: ${formatDuration(duration as number)}\n`;
    });

    let actionsReport = "\n== [2] 教學行為細節統計 (次數 與 持續時間) ==\n";
    // Explicitly cast to TeachingAction array to ensure correct mapping types
    (Object.values(TeachingAction) as TeachingAction[]).forEach(action => {
      const count = session.actionCounts[action];
      const duration = session.actionDurations[action];
      actionsReport += `${action}: ${count} 次 | 累計時間: ${formatDuration(duration)}\n`;
    });

    let logReport = "\n== [3] 詳細紀錄流 ==\n";
    session.logs.forEach(log => {
      const timeStr = log.timestamp.toLocaleTimeString('zh-TW', { hour12: false });
      logReport += `[${timeStr}] ${log.label}${log.value ? `: ${log.value}` : ''}\n`;
    });

    return header + modesReport + actionsReport + logReport;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getFormattedReport());
    alert('報告內容已複製到剪貼簿');
  };

  const downloadTxt = () => {
    const report = getFormattedReport();
    const blob = new Blob(['\uFEFF' + report], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Chronos觀課報告_${subject}_${new Date().toISOString().slice(0,10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col z-10 border border-amber-500/30 shadow-2xl shadow-black">
        <div className="p-6 border-b border-amber-500/20 flex justify-between items-center klimt-gradient text-white">
          <h2 className="text-2xl font-bold tracking-widest uppercase">觀課總結報告</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-950">
          <div className="space-y-6">
            <section>
              <h3 className="text-amber-500 font-bold mb-4 border-b border-amber-500/20 pb-2">基本資訊</h3>
              <p className="text-slate-300">科目：{subject}</p>
              <p className="text-slate-300">起始：{session.startTime?.toLocaleTimeString('zh-TW', { hour12: false })}</p>
              <p className="text-slate-300">結束：{session.endTime?.toLocaleTimeString('zh-TW', { hour12: false })}</p>
            </section>
            
            <section>
              <h3 className="text-amber-500 font-bold mb-4 border-b border-amber-500/20 pb-2">教學模式佔比</h3>
              <div className="space-y-3">
                {/* Explicitly cast to avoid 'unknown' type inference in React map */}
                {(Object.values(TeachingMode) as TeachingMode[]).map((mode) => (
                  <div key={mode} className="flex justify-between items-center bg-slate-900 p-3 rounded-lg">
                    <span className="text-slate-400">{mode}</span>
                    <span className="text-amber-400 font-mono">{formatDuration(session.modeDurations[mode])}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section>
              <h3 className="text-amber-500 font-bold mb-4 border-b border-amber-500/20 pb-2">行為統計 (量化與時長)</h3>
              <div className="space-y-3">
                {/* Explicitly cast to avoid 'unknown' type inference in React map */}
                {(Object.values(TeachingAction) as TeachingAction[]).map((action) => (
                  <div key={action} className="bg-slate-900 p-3 rounded-lg flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500">{action}</span>
                      <span className="text-lg text-amber-400 font-mono font-bold">{session.actionCounts[action]} <small className="text-[10px] text-slate-500 uppercase font-normal">次</small></span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block uppercase">累計時間</span>
                      <span className="text-blue-400 font-mono">{formatDuration(session.actionDurations[action])}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-amber-500 font-bold mb-4 border-b border-amber-500/20 pb-2">學生平均專注度</h3>
              <div className="bg-slate-900 p-4 rounded-lg text-center">
                 <span className={`text-xl font-bold ${
                   session.engagement === 'HIGH' ? 'text-green-400' :
                   session.engagement === 'MID' ? 'text-yellow-400' : 'text-red-400'
                 }`}>
                   {session.engagement === 'HIGH' ? '極佳' : session.engagement === 'MID' ? '穩定' : '待提升'}
                 </span>
              </div>
            </section>
          </div>
        </div>

        <div className="p-6 border-t border-amber-500/20 bg-slate-900/50 flex flex-wrap gap-4 justify-center md:justify-end">
          <button 
            onClick={copyToClipboard}
            className="px-6 py-2 rounded-xl border border-amber-500/50 text-amber-500 hover:bg-amber-500/10 transition-colors flex items-center gap-2 font-bold"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
            複製紀錄
          </button>
          <button 
            onClick={downloadTxt}
            className="px-6 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors flex items-center gap-2"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            下載 TXT
          </button>
          <button 
            onClick={onReset}
            className="px-6 py-2 rounded-xl bg-red-800 text-white font-bold hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            重置並開始新場次
          </button>
        </div>
      </div>
    </div>
  );
};

export default SummaryModal;
