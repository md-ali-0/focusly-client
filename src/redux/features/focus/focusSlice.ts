import { FocusSession } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: FocusSession = {
    isRunning: false,
    isBreak: false,
    isPaused: false,
    remainingTime: 25 * 60,
    totalSessions: 0,
    totalFocusTime: 0,
};

const focusSlice = createSlice({
    name: "focus",
    initialState,
    reducers: {
        startTimer(state, action: PayloadAction<number>) {
            state.isRunning = true;
    
            if (!state.isPaused) {
                state.remainingTime = action.payload;
            }
        
            state.isPaused = false;
        },

        pauseTimer(state) {
            state.isRunning = false;
            state.isPaused = true;
        },
        resetTimer(state) {
            state.isRunning = false;
            state.isPaused = false;
            state.remainingTime = state.isBreak ? 5 * 60 : 25 * 60;
        },
        toggleBreak(state, action: PayloadAction<boolean>) {
            state.isBreak = action.payload;
            state.remainingTime = action.payload ? 5 * 60 : 25 * 60;
        },
        updateTotalMetrics(
            state,
            action: PayloadAction<{
                totalSessions: number;
                totalFocusTime: number;
            }>
        ) {
            state.totalSessions = action.payload.totalSessions;
            state.totalFocusTime = action.payload.totalFocusTime;
        },
    },
});

export const {
    startTimer,
    pauseTimer,
    resetTimer,
    toggleBreak,
    updateTotalMetrics,
} = focusSlice.actions;

export default focusSlice.reducer;
