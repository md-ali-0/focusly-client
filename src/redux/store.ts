import focusReducer from "@/redux/features/focus/focusSlice";
import { configureStore } from "@reduxjs/toolkit";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

// Create a noop storage for server-side rendering (SSR)
const createNoopStorage = () => {
    return {
        getItem() {
            return Promise.resolve(null);
        },
        setItem(_key: string, value: string) {
            return Promise.resolve(value);
        },
        removeItem() {
            return Promise.resolve();
        },
    };
};

const storage =
    typeof window !== "undefined"
        ? createWebStorage("local")
        : createNoopStorage();

// Persist configuration for the "focus" slice
const focusPersistConfig = {
    key: "focus",
    storage,
};

const persistedFocusReducer = persistReducer(focusPersistConfig, focusReducer);

export const store = configureStore({
    reducer: {
        focus: persistedFocusReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
