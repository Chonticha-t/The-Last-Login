// เปลี่ยนจาก enum เป็น object เพื่อให้รันได้ในโหมด erasableSyntaxOnly
export const GameStage = {
  SPLASH: 'SPLASH',
  BRIEFING: 'BRIEFING',
  MAP: 'MAP',
  CRYPTO: 'CRYPTO',
  AUTH: 'AUTH',
  AUTHZ: 'AUTHZ',
  COMPLETE: 'COMPLETE',
} as const;

export type GameStage = (typeof GameStage)[keyof typeof GameStage];

export interface CaseStatus {
  stage: GameStage;
  timer: number;
  hintsUsed: number;
  progress: number;
  flags: {
    crypto: string | null;
    auth: string | null;
    authz: string | null;
  };
}

export interface TerminalLine {
  timestamp: string;
  type: 'INFO' | 'SYSTEM' | 'LOAD' | 'WARN' | 'EXEC' | 'SUCCESS' | 'TASK' | 'ERR';
  content: string;
  details?: string;
}