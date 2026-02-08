"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { useSession, signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  GraduationCap,
  MessageSquare,
  CheckSquare,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  FileText,
  Bookmark,
  FileCheck
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/lightswind/avatar';
import { Button } from '@/components/lightswind/button';
import { Card } from '@/components/lightswind/card';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const {
    user,
    isAuthenticated,
    currentStage,
    updateUser,
    setUniversities,
    setTasks,
    shortlistedIds,
    setShortlistedIds,
    setStage,
    lockUniversity,
    _hasHydrated,
    logout
  } = useAppStore();

  useEffect(() => {
    // Wait for session and store hydration
    if (status === 'loading' || !_hasHydrated) return;
    if (!isDataLoaded && isAuthenticated) return;

    // 1. Auth check: NextAuth status is the source of truth for the server
    if (status === 'unauthenticated') {
      // If we are unauthenticated in NextAuth, we must be unauthenticated in Zustand too
      if (isAuthenticated) {
        console.log('🔄 [DashboardLayout] Session lost, logging out of store');
        logout();
      }
      router.push('/login');
      return;
    }

    // 2. Onboarding check: if not onboarded and not on onboarding page, redirect
    // Use both store and session as source of truth to be resilient
    const isOnboardingCompleted = user.onboardingCompleted || (session?.user as any)?.onboardingCompleted;
    const isActuallyLoaded = isDataLoaded && (user.email === session?.user?.email);

    // FIX: Only redirect if we are SURE about the onboarding status
    if (status === 'authenticated' && isActuallyLoaded) {
      if (!isOnboardingCompleted && pathname !== '/dashboard/onboarding') {
        console.log('🚀 [DashboardLayout] Redirecting to onboarding');
        router.replace('/dashboard/onboarding');
        return;
      }
      if (isOnboardingCompleted && pathname === '/dashboard/onboarding') {
        console.log('✅ [DashboardLayout] Already onboarded, moving to dashboard');
        router.replace('/dashboard');
        return;
      }
    }
  }, [status, isAuthenticated, user.onboardingCompleted, (session?.user as any)?.onboardingCompleted, pathname, router, isDataLoaded]);

  const lastLoadedEmail = useRef<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      // Use session email as source of truth. 
      // Strictly require NextAuth session for API calls to avoid 401s.
      const activeEmail = session?.user?.email;

      if (!activeEmail || status !== 'authenticated') {
        if (status !== 'loading') setIsDataLoaded(true);
        return;
      }

      // If we already loaded (or tried) this email, don't repeat
      if (isDataLoaded && lastLoadedEmail.current === activeEmail) {
        return;
      }

      try {
        console.log('🔄 [DashboardLayout] Loading data for:', activeEmail);
        lastLoadedEmail.current = activeEmail;

        const [userRes, universitiesRes] = await Promise.all([
          fetch(`/api/user?email=${encodeURIComponent(activeEmail)}`),
          fetch(`/api/universities?userEmail=${encodeURIComponent(activeEmail)}&rag=false`),
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.email === activeEmail) {
            updateUser(userData);
            if (userData.currentStage) setStage(userData.currentStage as any);
            if (userData.lockedUniversityId) lockUniversity(userData.lockedUniversityId);

            if (userData.id) {
              const [tasksRes, shortlistRes] = await Promise.all([
                fetch(`/api/tasks?userId=${userData.id}`),
                fetch(`/api/shortlist?userId=${userData.id}`),
              ]);

              if (tasksRes.ok) setTasks(await tasksRes.json());
              if (shortlistRes.ok) {
                const shortlistData = await shortlistRes.json();
                setShortlistedIds(shortlistData.map((s: any) => s.universityId));
              }
            }
          }
        } else if (userRes.status === 404) {
          // New user or not found, proceed to onboarding naturally
          console.log('ℹ️ [DashboardLayout] User not found, initializing store with session data');
          updateUser({ email: activeEmail, name: session.user.name || 'Student' });
        } else if (userRes.status === 401) {
          console.error('❌ [DashboardLayout] User API failed: 401 Unauthorized. Session may be invalid.');
          logout();
          router.push('/login');
        } else {
          console.error('❌ [DashboardLayout] User API failed:', userRes.status);
        }

        if (universitiesRes.ok) {
          const unis = await universitiesRes.json();
          setUniversities(Array.isArray(unis) ? unis : []);
        }
      } catch (error) {
        console.error('❌ [DashboardLayout] Data loading error:', error);
      } finally {
        setIsDataLoaded(true);
      }
    };

    if (status !== 'loading') {
      loadData();
    }
  }, [session?.user?.email, status, isDataLoaded]);

  const isOnboarding = pathname === '/dashboard/onboarding';
  const isOnboardingCompleted = user.onboardingCompleted || (session?.user as any)?.onboardingCompleted;

  // Robust loading check: must be hydrated AND (data loaded for the CURRENT session user)
  const isCorrectUserLoaded = isDataLoaded && user.email === session?.user?.email;
  const isActuallyLoaded = _hasHydrated && (status === 'authenticated' ? isCorrectUserLoaded : true);

  const isRedirecting = status === 'authenticated' && isActuallyLoaded && !isOnboardingCompleted && !isOnboarding;
  const isRedirectingAway = status === 'authenticated' && isActuallyLoaded && isOnboardingCompleted && isOnboarding;

  if (status === 'loading' || !_hasHydrated || (status === 'authenticated' && !isActuallyLoaded) || isRedirecting || isRedirectingAway) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isOnboarding) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600/30">
        {children}
      </div>
    );
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', href: '/dashboard/profile', icon: User },
    { name: 'Universities', href: '/dashboard/universities', icon: GraduationCap },
    { name: 'Shortlist', href: '/dashboard/shortlist', icon: Bookmark },
    { name: 'Tasks & Guidance', href: '/dashboard/tasks', icon: CheckSquare },
    { name: 'Documents', href: '/dashboard/documents', icon: FileText },
    { name: 'AI Counsellor', href: '/dashboard/ai-counsellor', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-blue-600/30">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none" />

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 w-full z-50 px-4 py-3 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shadow-lg shadow-white/5 relative">
            <Image src="/logo.png" alt="AI Counsellor Logo" fill sizes="32px" className="object-cover" />
          </div>
          <span className="font-display font-bold text-lg">AI Counsellor</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-slate-400">
          {sidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className="flex pt-16 lg:pt-0 min-h-screen">
        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-950 border-r border-slate-800/50 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0 lg:static h-full`}
        >
          <div className="flex flex-col h-full p-6">
            <div className="hidden lg:flex items-center gap-3 mb-10 px-2">
              <div className="h-10 w-10 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shadow-lg shadow-white/5 relative">
                <Image src="/logo.png" alt="AI Counsellor Logo" fill sizes="40px" className="object-cover" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg leading-tight">AI Counsellor</h2>
                <p className="text-xs text-slate-500 font-medium tracking-wide">STUDY ABROAD</p>
              </div>
            </div>

            <nav className="flex-1 space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const showBadge = item.name === 'Shortlist' && shortlistedIds.length > 0;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group overflow-hidden ${isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-violet-600/10 border border-white/5 rounded-xl" />
                    )}
                    <item.icon className={`h-5 w-5 relative z-10 transition-colors ${isActive ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />
                    <span className="relative z-10 font-medium">{item.name}</span>
                    {showBadge && (
                      <span className="relative z-10 ml-auto px-2 py-0.5 bg-yellow-500 text-slate-900 text-xs font-bold rounded-full">
                        {shortlistedIds.length}
                      </span>
                    )}
                    {isActive && (
                      <div className="absolute right-2 h-1.5 w-1.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-8 pt-8 border-t border-slate-800/30">
              {/* Stage Progress */}
              <div className="px-2">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Journey Progress</span>
                  <span className="text-[10px] font-bold text-blue-400">Stage {currentStage}/4</span>
                </div>
                <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-violet-600 shadow-[0_0_10px_rgba(37,99,235,0.3)] transition-all duration-1000"
                    style={{ width: `${(currentStage / 4) * 100}%` }}
                  />
                </div>
                <p className="mt-2 text-[10px] text-slate-500 font-medium">
                  {currentStage === 1 && "Start your journey by building your profile"}
                  {currentStage === 2 && "Discovering the best matching universities"}
                  {currentStage === 3 && "Finalizing and shortlisting candidates"}
                  {currentStage >= 4 && "Preparing final application documents"}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800/50">
                <div className="flex items-center gap-3 px-2">
                  <Avatar className="h-9 w-9 ring-1 ring-white/10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {(user.name || 'User').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{user.name || 'John Doe'}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email || 'john@example.com'}</p>
                  </div>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="text-slate-500 hover:text-blue-400 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className={`flex-1 overflow-y-auto ${pathname === '/dashboard/ai-counsellor' ? 'p-0' : 'p-3 sm:p-4 lg:p-6'}`}>
          <div className={`${pathname === '/dashboard/ai-counsellor' ? 'max-w-full h-full' : 'max-w-6xl space-y-4'} mx-auto`}>
            {children}
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-8 bg-slate-900 border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-amber-500" />
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Logout</h3>
              <p className="text-slate-400 mb-8">
                Are you sure you want to log out of AI Counsellor? Your progress is saved.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowLogoutModal(false)}
                  variant="outline"
                  className="flex-1 border-white/10 hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    logout();
                    await signOut({ callbackUrl: '/' });
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20"
                >
                  Logout
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}