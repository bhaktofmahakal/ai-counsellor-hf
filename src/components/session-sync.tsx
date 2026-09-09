'use client';

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

export function SessionSync() {
  const { data: session, status } = useSession();
  const { login, logout, updateUser, isAuthenticated, user, setStage, setShortlistedIds, lockUniversity, setUniversities } = useAppStore();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      if (!isAuthenticated) {
        login();
      }

      // Sync identity and fetch latest profile from DB to ensure store matches backend
      const sessionEmail = session.user.email || '';
      if (sessionEmail) {
        // Fetch full profile including stage and shortlists
        fetch(`/api/user?email=${sessionEmail}`)
          .then(res => res.ok ? res.json() : null)
          .then(dbUser => {
            if (dbUser) {
              updateUser({
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                onboardingCompleted: dbUser.onboardingCompleted,
                education: dbUser.education,
                degree: dbUser.degree,
                gpa: dbUser.gpa,
                studyGoal: dbUser.studyGoal,
                targetField: dbUser.targetField,
                preferredCountries: dbUser.preferredCountries,
                budgetMin: dbUser.budgetMin,
                budgetMax: dbUser.budgetMax,
                examStatus: dbUser.examStatus,
                examScores: dbUser.examScores,
                fundingPlan: dbUser.fundingPlan,
                sopStatus: dbUser.sopStatus,
                targetIntake: dbUser.targetIntake,
                avatar: dbUser.avatar
              });
              
              if (dbUser.currentStage) setStage(dbUser.currentStage as any);
              if (dbUser.lockedUniversityId) lockUniversity(dbUser.lockedUniversityId);
              if (dbUser.shortlists) {
                setShortlistedIds(dbUser.shortlists.map((s: any) => s.universityId));
              }

              // GLOBAL DATA FETCH: Ensure universities are in store for AI context
              fetch('/api/universities?rag=true')
                .then(res => res.ok ? res.json() : [])
                .then(unis => {
                  if (unis.length > 0) setUniversities(unis);
                });
            }
          })
          .catch(err => console.error('Failed to sync profile:', err));
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
