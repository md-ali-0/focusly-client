export interface FocusSession {
    isRunning: boolean;
    isBreak: boolean;
    isPaused: boolean;
    remainingTime: number;
    totalSessions: number;
    totalFocusTime: number;
}
