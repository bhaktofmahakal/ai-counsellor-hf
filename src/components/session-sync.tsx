"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useAppStore } from "@/lib/store";

export const SessionSync = () => {
  const { data: session } = useSession();
  const { updateUser, fetchUserData } = useAppStore();

  useEffect(() => {
    if (session?.user?.email) {
      // Set basic user info from session
      updateUser({
        name: session.user.name || "",
        email: session.user.email,
        avatar: session.user.image || "",
      });

      // Fetch full profile data from our API
      fetchUserData(session.user.email);
    }
  }, [session, updateUser, fetchUserData]);

  return null;
};

export default SessionSync;
