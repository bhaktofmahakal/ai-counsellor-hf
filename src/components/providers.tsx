"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { SessionSync } from "./session-sync";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <SessionSync />
            {children}
        </SessionProvider>
    );
}
