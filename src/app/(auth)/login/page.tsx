'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { GradientButton } from '@/components/lightswind/gradient-button';
import { Card } from '@/components/lightswind/card';
import { Input } from '@/components/lightswind/input';
import { ArrowRight, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useAppStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const { user, updateUser, login, isAuthenticated } = useAppStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      if (user.onboardingCompleted) {
        router.push('/dashboard');
      } else {
        router.push('/dashboard/onboarding');
      }
    }
  }, [isAuthenticated, user.onboardingCompleted, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error("Sign in failed", {
          description: result.error === "CredentialsSignin" ? "Invalid email or password." : result.error
        });
        setLoading(false);
        return;
      }

      toast.success("Welcome back!", {
        description: "Checking your status..."
      });

      // Fetch fresh user data to update store
      const userRes = await fetch(`/api/user?email=${encodeURIComponent(email)}`);
      if (userRes.ok) {
        const userData = await userRes.json();
        updateUser(userData);
        login();

        if (userData.onboardingCompleted) {
          router.push('/dashboard');
        } else {
          router.push('/dashboard/onboarding');
        }
      } else {
        router.push('/dashboard');
      }

    } catch (error) {
      console.error("Login Error:", error);
      toast.error("An error occurred", {
        description: "Please try again later."
      });
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-16">
        <Link href="/" className="inline-flex items-center justify-center h-20 w-20 rounded-3xl overflow-hidden bg-white/5 border border-white/10 mb-6 shadow-2xl shadow-white/5 animate-in zoom-in duration-700 hover:scale-105 hover:border-white/20 transition-all relative">
          <Image src="/logo.png" alt="AI Counsellor Logo" fill sizes="80px" className="object-cover" />
        </Link>
        <h1 className="text-4xl font-bold text-white mb-3 font-display tracking-tight">
          Welcome Back
        </h1>
        <p className="text-slate-400 font-medium">
          Continue your study abroad journey
        </p>
      </div>

      <Card className="p-8 bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl rounded-[2rem]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2 ml-1">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-14 bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-600/50 focus:ring-blue-600/20 rounded-2xl px-6"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-300 mb-2 ml-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-14 bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-600/50 focus:ring-blue-600/20 rounded-2xl px-6"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center cursor-pointer group">
              <input type="checkbox" className="mr-3 h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-600 transition-all" />
              <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-blue-500 hover:text-blue-400 transition-colors font-medium">
              Forgot password?
            </Link>
          </div>

          <GradientButton
            type="submit"
            className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-blue-600/10"
            size="lg"
            disabled={loading}
            gradientColors={['#2563eb', '#8b5cf6']}
            suppressHydrationWarning
          >
            {loading ? 'Signing in...' : 'Sign In'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </GradientButton>
        </form>

        <div className="mt-8 relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#0a0a0a] text-slate-500 rounded-full border border-white/5">Or continue with</span>
          </div>
        </div>

        <button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          className="mt-8 w-full flex items-center justify-center gap-3 px-4 h-14 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all duration-300 active:scale-[0.98]"
          suppressHydrationWarning
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1c-2.97 0-5.46.98-7.28 2.66l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span className="font-bold">Sign in with Google</span>
        </button>

        <div className="mt-10 text-center text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
          No account?{' '}
          <Link href="/signup" className="text-white hover:underline transition-all">
            Join the network
          </Link>
        </div>
      </Card>
    </div>
  );
}
