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

export default function SignupPage() {
  const router = useRouter();
  const { updateUser, login, isAuthenticated, user } = useAppStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
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

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords mismatch", {
        description: "The passwords you entered do not match. Please verify and try again."
      });
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Weak password", {
        description: "Password must be at least 6 characters long."
      });
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      // Create user in DB with password
      const res = await fetch('/api/user', {
        method: 'POST', // Changed from PATCH
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          password: formData.password
        })
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create account");
      }

      // Automatically sign in after signup
      const loginResult = await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (loginResult?.error) {
        throw new Error("Account created but sign-in failed. Please login manually.");
      }

      const userData = await res.json();

      // Update store and navigate
      updateUser(userData);
      login();

      toast.success("Account created!", {
        description: "Your study abroad journey begins here."
      });

      router.push('/dashboard/onboarding');
    } catch (e: any) {
      console.error("Signup error:", e);
      toast.error("Registration failed", {
        description: e.message || "An unexpected error occurred during signup."
      });
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="w-full">
      <div className="text-center mb-16">
        <Link href="/" className="inline-flex items-center justify-center h-20 w-20 rounded-3xl overflow-hidden bg-white/5 border border-white/10 mb-6 shadow-2xl shadow-white/5 animate-in zoom-in duration-700 hover:scale-105 hover:border-white/20 transition-all relative">
          <Image src="/logo.png" alt="AI Counsellor Logo" fill sizes="80px" className="object-cover" />
        </Link>
        <h1 className="text-4xl font-bold text-white mb-3 font-display tracking-tight">
          Create Account
        </h1>
        <p className="text-slate-400 font-medium">
          Start your journey to study abroad success
        </p>
      </div>

      <Card className="p-8 bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl rounded-[2rem]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-slate-300 mb-2 ml-1">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
              className="w-full h-14 bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-600/50 focus:ring-blue-600/20 rounded-2xl px-6"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-300 mb-2 ml-1">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => updateField('email', e.target.value)}
              required
              className="w-full h-14 bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-600/50 focus:ring-blue-600/20 rounded-2xl px-6"
            />
          </div>

          <div>
            <label htmlFor="password" title="Refining SaaS Aesthetics" className="block text-sm font-semibold text-slate-300 mb-2 ml-1">
              Password
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => updateField('password', e.target.value)}
              required
              className="w-full h-14 bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-600/50 focus:ring-blue-600/20 rounded-2xl px-6"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-300 mb-2 ml-1">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={(e) => updateField('confirmPassword', e.target.value)}
              required
              className="w-full h-14 bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-600/50 focus:ring-blue-600/20 rounded-2xl px-6"
            />
          </div>

          <div className="flex items-start text-sm py-2">
            <input type="checkbox" required className="mt-1 mr-3 h-4 w-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-600 transition-all cursor-pointer" />
            <span className="text-slate-400">
              I agree to the{' '}
              <Link href="/terms" className="text-blue-500 hover:text-blue-400 transition-colors font-medium">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-500 hover:text-blue-400 transition-colors font-medium">
                Privacy Policy
              </Link>
            </span>
          </div>

          <GradientButton
            type="submit"
            className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-blue-600/10"
            size="lg"
            disabled={loading}
            gradientColors={['#2563eb', '#8b5cf6']}
            suppressHydrationWarning
          >
            {loading ? 'Creating account...' : 'Create Account'}
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
          <span className="font-bold">Sign up with Google</span>
        </button>

        <div className="mt-10 text-center text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
          Already a member?{' '}
          <Link href="/login" className="text-white hover:underline transition-all">
            Sign in
          </Link>
        </div>
      </Card>
    </div>
  );
}
