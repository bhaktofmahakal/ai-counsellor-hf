'use client';

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import { SessionSync } from "./session-sync";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <SessionSync />
      {children}
    </SessionProvider>
  );
}
