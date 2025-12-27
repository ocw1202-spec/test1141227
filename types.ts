
// Shared types and enums for the observation dashboard
export enum TeachingMode {
  LECTURE = '講述式',
  DISCUSSION = '小組討論',
  PRACTICE = '實作練習',
  INDIVIDUAL = '自主學習'
}

export enum TeachingAction {
  EXPLAIN = '講解',
  ASK = '提問',
  RESPONSE = '回應',
  GUIDE = '指導',
  MANAGE = '管教'
}

export type EngagementLevel = 'LOW' | 'MID' | 'HIGH';

export interface LogEntry {
  id: string;
  timestamp: Date;
  type: 'MODE_CHANGE' | 'ACTION' | 'ACTION_TIMER' | 'ENGAGEMENT' | 'NOTE';
  label: string;
  value?: string;
}

export interface SessionState {
  isActive: boolean;
  startTime: Date | null;
  endTime: Date | null;
  currentMode: TeachingMode;
  currentAction: TeachingAction | null;
  modeDurations: Record<TeachingMode, number>;
  actionCounts: Record<TeachingAction, number>;
  actionDurations: Record<TeachingAction, number>;
  engagement: EngagementLevel;
  logs: LogEntry[];
}
