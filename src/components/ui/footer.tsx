import React from 'react';
import Link from 'next/link';

export const Footer = () => {
    return (
        <footer className="relative mt-40 pt-20 pb-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-20">
                    {/* Brand Section */}
                    <div className="md:col-span-5 space-y-8">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shadow-xl shadow-white/5">
                                <img src="/logo.png" alt="AI Counsellor Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-display font-black text-2xl text-white tracking-tighter uppercase">AI COUNSELLOR</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight max-w-md">
                            Building the future of <span className="text-neutral-500">global education</span> intelligence.
                        </h3>
                        <div className="flex gap-4">
                            <Link href="/signup">
                                <button
                                    type="button"
                                    className="px-6 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-all text-sm"
                                    suppressHydrationWarning
                                >
                                    Get Started Free
                                </button>
                            </Link>
                            <div className="flex items-center gap-4 px-2">
                                <Link href="#" className="text-neutral-500 hover:text-white transition-colors">
                                    <span className="text-xs font-bold uppercase tracking-widest">LinkedIn</span>
                                </Link>
                                <Link href="#" className="text-neutral-500 hover:text-white transition-colors">
                                    <span className="text-xs font-bold uppercase tracking-widest">Twitter</span>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Product</h4>
                            <ul className="space-y-4 text-sm text-neutral-500 font-medium">
                                <li><Link href="/platform/workflow" className="hover:text-white transition-colors">How it Works</Link></li>
                                <li><Link href="/platform/ai-matching" className="hover:text-white transition-colors">University Match</Link></li>
                                <li><Link href="/platform/success-stories" className="hover:text-white transition-colors">Success Stories</Link></li>
                                <li><Link href="/platform/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Resources</h4>
                            <ul className="space-y-4 text-sm text-neutral-500 font-medium">
                                <li><Link href="/guides" className="hover:text-white transition-colors">Country Guides</Link></li>
                                <li><Link href="/solutions/scholarships" className="hover:text-white transition-colors">Scholarship Finder</Link></li>
                                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                                <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-6">
                            <h4 className="text-xs font-black text-white uppercase tracking-[0.2em]">Legal</h4>
                            <ul className="space-y-4 text-sm text-neutral-500 font-medium">
                                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link></li>
                                <li><Link href="/security" className="hover:text-white transition-colors">Security</Link></li>
                                <li><Link href="/status" className="hover:text-white transition-colors">Status</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
                        <p className="text-neutral-600 text-[10px] font-bold uppercase tracking-widest">
                            © 2025 AI COUNSELLOR INC. ALL RIGHTS RESERVED.
                        </p>
                    </div>
                    <div className="flex items-center gap-8">
                        <p className="text-neutral-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            MADE IN INDIA <span className="w-1 h-1 rounded-full bg-neutral-800" /> FOR THE WORLD
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
