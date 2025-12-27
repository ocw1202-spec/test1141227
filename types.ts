
export enum TeachingMode {
  LECTURE = '講述教學',
  DISCUSSION = '小組討論',
  PRACTICE = '實作/演算',
  DIGITAL = '數位運用'
}

export enum TeachingAction {
  ENCOURAGEMENT = '正向鼓勵',
  CORRECTION = '糾正規範',
  OPEN_Q = '開放提問',
  CLOSED_Q = '封閉提問',
  PATROL = '巡視走動'
}

export interface ObservationLog {
  id: string;
  timestamp: Date;
  type: 'MODE_CHANGE' | 'ACTION' | 'ENGAGEMENT' | 'NOTE' | 'ACTION_TIMER';
  label: string;
  value?: string | number;
  duration?: number;
}

export type EngagementLevel = 'HIGH' | 'MID' | 'LOW';

export interface SessionState {
  isActive: boolean;
  startTime: Date | null;
  endTime: Date | null;
  currentMode: TeachingMode | null;
  currentAction: TeachingAction | null; // Currently timing this action
  modeDurations: Record<TeachingMode, number>;
  actionCounts: Record<TeachingAction, number>;
  actionDurations: Record<TeachingAction, number>; // New: track duration for actions
  logs: ObservationLog[];
  engagement: EngagementLevel;
  lastActivity: number;
}
