import focusReducer from "@/redux/features/focus/focusSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
    reducer: {
        focus: focusReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
