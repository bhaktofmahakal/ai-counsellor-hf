'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Construction } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden relative selection:bg-white/10">

            {/* Background Grids */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="relative z-10 text-center space-y-12 px-6 max-w-2xl">
                {/* Icon / Visual */}
                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-white/10 blur-3xl rounded-full" />
                    <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8 group transition-transform hover:scale-105">
                        <Search className="h-12 w-12 md:h-16 md:w-16 text-white/20 group-hover:text-white transition-colors" />
                        <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white flex items-center justify-center text-black font-black text-xs">
                            404
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                        <Construction className="h-4 w-4 text-neutral-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">System Update</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight leading-tight">
                        Lost in the <br />
                        <span className="text-neutral-500">Education Network</span>
                    </h1>

                    <p className="text-lg md:text-xl text-neutral-400 font-light leading-relaxed max-w-lg mx-auto">
                        This page could not be found. It&apos;s either a <span className="text-white font-medium italic underline decoration-white/20 underline-offset-8">typing mistake</span> or the feature is <span className="text-white font-medium italic underline decoration-white/20 underline-offset-8">coming soon</span>.
                    </p>
                </div>

                {/* Action */}
                <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link href="/">
                        <button className="flex items-center gap-3 px-10 h-16 rounded-full bg-white text-black font-black hover:scale-105 transition-all shadow-xl shadow-white/10">
                            <ArrowLeft className="h-5 w-5" />
                            Return Home
                        </button>
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="px-10 h-16 rounded-full border border-white/10 hover:bg-white/5 transition-all text-sm font-bold text-neutral-400"
                    >
                        Go Back
                    </button>
                </div>

                {/* Footer Text */}
                <p className="pt-12 text-[10px] font-black text-neutral-700 uppercase tracking-[0.4em]">
                    AI COUNSELLOR INC // NEURAL NETWORK
                </p>
            </div>

            {/* Decorative Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
        </div>
    );
}
