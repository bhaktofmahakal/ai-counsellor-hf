'use client';

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

export function SessionSync() {
  const { data: session, status } = useSession();
  const { login, logout, updateUser, isAuthenticated, user } = useAppStore();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (!isAuthenticated) {
        login();
      }

      // Only update if email has ACTUALLY changed (not just empty -> filled)
      const storeEmail = user.email || '';
      const sessionEmail = session.user.email || '';

      if (storeEmail !== sessionEmail && sessionEmail) {
        console.log('🔄 [SessionSync] Identity changed:', { from: storeEmail, to: sessionEmail });
        updateUser({
          id: (session.user as any).id,
          name: session.user.name || user.name || "Student",
          email: sessionEmail,
          onboardingCompleted: (session.user as any).onboardingCompleted ?? user.onboardingCompleted ?? false
        });
      }
    } else if (status === "unauthenticated" && isAuthenticated) {
      // If NextAuth session is gone, we must sync the store too 
      // otherwise we get 401s on all API calls.
      console.log('🔄 [SessionSync] NextAuth unauthenticated. Clearing store session.');
      logout();
    }
  }, [session, status, login, logout, updateUser, isAuthenticated, user.email]);

  return null;
}
