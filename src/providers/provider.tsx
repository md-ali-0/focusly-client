"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import { SessionProvider } from "./session-provider";

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </SessionProvider>
    );
}
