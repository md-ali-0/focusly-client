"use client";

import { store } from "@/redux/store";
import { QueryClient, QueryClientProvider } from "react-query";
import { Provider } from "react-redux";
import { SessionProvider } from "./session-provider";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                <Provider store={store}>{children}</Provider>
            </QueryClientProvider>
        </SessionProvider>
    );
}
