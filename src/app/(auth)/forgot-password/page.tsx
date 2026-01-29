'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GradientButton } from '@/components/lightswind/gradient-button';
import { Card } from '@/components/lightswind/card';
import { Input } from '@/components/lightswind/input';
import { ArrowRight, Mail, KeyRound, CheckCircle2, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [otp, setOtp] = useState('');
    const [email, setEmail] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP + Reset, 3: Success
    const [loading, setLoading] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleVerifyEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Request failed");
                return;
            }

            // Move to OTP step
            toast.success("OTP Sent", {
                description: "If an account exists, a 6-digit code has been sent."
            });

            // For dev convenience
            if (data.dev_otp) {
                console.log("DEV OTP:", data.dev_otp);
                toast.info(`Dev Mode: OTP is ${data.dev_otp}`);
            }

            setStep(2);
        } catch (error) {
            console.error("Verification error:", error);
            toast.error("Error", {
                description: "Something went wrong. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords mismatch", {
                description: "Please make sure both passwords are the same."
            });
            return;
        }

        if (newPassword.length < 6) {
            toast.error("Weak password", {
                description: "Password must be at least 6 characters long."
            });
            return;
        }

        if (otp.length !== 6) {
            toast.error("Invalid OTP", {
                description: "Please enter the 6-digit code sent to your email."
            });
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    otp,
                    newPassword
                })
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Reset failed");
                return;
            }

            setStep(3);
            toast.success("Password Reset Successful", {
                description: "Your password has been updated. You can now log in."
            });
        } catch (error) {
            console.error("Reset error:", error);
            toast.error("Reset failed", {
                description: "We couldn't update your password. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative bg-slate-950 flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
            <div className="absolute top-0 -right-4 w-72 h-72 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />

            <div className="w-full max-w-lg relative z-10">
                <div className="text-center mb-12">
                    <Link href="/" className="inline-flex items-center justify-center h-20 w-20 rounded-3xl overflow-hidden bg-white/5 border border-white/10 mb-6 shadow-2xl shadow-white/5 hover:scale-105 hover:border-white/20 transition-all relative">
                        <Image src="/logo.png" alt="Logo" fill sizes="80px" className="object-cover" />
                    </Link>
                    <h1 className="text-4xl font-bold text-white mb-3 font-display tracking-tight">
                        Reset Password
                    </h1>
                    <p className="text-slate-400 font-medium">
                        {step === 1 ? "Enter your email to verify your identity" : step === 2 ? "Specify a strong new password" : "All set! Your password is secure"}
                    </p>
                </div>

                <Card className="p-8 bg-white/5 backdrop-blur-2xl border-white/10 shadow-2xl rounded-[2rem] overflow-hidden">
                    {step === 1 && (
                        <form onSubmit={handleVerifyEmail} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div>
                                <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1 flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-blue-500" />
                                    Email Address
                                </label>
                                <Input
                                    type="email"
                                    placeholder="you@university.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full h-14 bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-600/50 focus:ring-blue-600/20 rounded-2xl px-6"
                                />
                            </div>
                            <GradientButton
                                type="submit"
                                className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-blue-600/10"
                                disabled={loading}
                                gradientColors={['#2563eb', '#8b5cf6']}
                            >
                                {loading ? 'Verifying...' : 'Verify Email'}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </GradientButton>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleResetPassword} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-6">
                                    <p className="text-xs text-blue-400 leading-relaxed">
                                        We've sent a 6-digit verification code to <b>{email}</b>.
                                        Please enter it below to proceed. The code expires in 10 minutes.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1 flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                        Verification Code (OTP)
                                    </label>
                                    <Input
                                        type="text"
                                        placeholder="000000"
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                        required
                                        className="w-full h-14 bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-600/50 focus:ring-blue-600/20 rounded-2xl px-6 text-center text-2xl tracking-[0.5em] font-mono"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1 flex items-center gap-2">
                                        <KeyRound className="h-4 w-4 text-violet-500" />
                                        New Password
                                    </label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        className="w-full h-14 bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-600/50 focus:ring-blue-600/20 rounded-2xl px-6"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-300 mb-2 ml-1 flex items-center gap-2">
                                        <KeyRound className="h-4 w-4 text-violet-500" />
                                        Confirm New Password
                                    </label>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        className="w-full h-14 bg-slate-950/50 border-white/10 text-white placeholder:text-slate-600 focus:border-blue-600/50 focus:ring-blue-600/20 rounded-2xl px-6"
                                    />
                                </div>
                            </div>
                            <GradientButton
                                type="submit"
                                className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl shadow-blue-600/10"
                                disabled={loading}
                                gradientColors={['#8b5cf6', '#d946ef']}
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </GradientButton>
                        </form>
                    )}

                    {step === 3 && (
                        <div className="text-center py-6 animate-in zoom-in duration-500">
                            <div className="h-20 w-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Password Updated!</h3>
                            <p className="text-slate-400 mb-8">
                                Your account is now ready to use with your new credentials.
                            </p>
                            <GradientButton
                                onClick={() => router.push('/login')}
                                className="w-full h-14 rounded-2xl text-lg font-bold"
                                gradientColors={['#10b981', '#3b82f6']}
                            >
                                Go to Login
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </GradientButton>
                        </div>
                    )}
                </Card>

                <div className="mt-8 text-center">
                    <Link href="/login" className="text-sm font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
