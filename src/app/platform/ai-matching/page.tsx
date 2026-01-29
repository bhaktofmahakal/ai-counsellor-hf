'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Navbar,
    NavBody,
    NavbarLogo,
    NavbarButton
} from "@/components/ui/resizable-navbar";
import {
    Menu,
    MenuItem,
    HoveredLink,
    ProductItem
} from "@/components/ui/navbar-menu";
import { Target, Cpu, Zap, Search, Globe, ShieldCheck, Brain, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Footer } from '@/components/ui/footer';

export default function AIMatchingPage() {
    const [active, setActive] = useState<string | null>(null);

    return (
        <div className="min-h-screen w-full bg-black relative text-white">
            {/* Grid Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
                        linear-gradient(to right, #1a1a1a 1px, transparent 1px),
                        linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)
                    `,
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Navigation */}
            <Navbar className="top-4 relative z-50">
                <NavBody>
                    <NavbarLogo>
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="h-10 w-10 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shadow-lg shadow-white/5 group-hover:scale-110 transition-transform">
                                <img src="/logo.png" alt="AI Counsellor Logo" className="w-full h-full object-cover" />
                            </div>
                            <span className="font-display font-bold text-xl tracking-tight hidden sm:block text-white">AI Counsellor</span>
                        </Link>
                    </NavbarLogo>

                    <div className="hidden lg:block">
                        <Menu setActive={setActive} className="bg-transparent border-none shadow-none p-0 backdrop-blur-none">
                            <MenuItem setActive={setActive} active={active} item="Platform">
                                <div className="flex flex-col space-y-4 text-sm p-2">
                                    <HoveredLink href="/platform/ai-matching">AI Matching</HoveredLink>
                                    <HoveredLink href="/platform/workflow">Workflow</HoveredLink>
                                    <HoveredLink href="/platform/success-stories">Success Stories</HoveredLink>
                                    <HoveredLink href="/platform/pricing">Pricing</HoveredLink>
                                </div>
                            </MenuItem>
                            <MenuItem setActive={setActive} active={active} item="Solutions">
                                <div className="text-sm grid grid-cols-2 gap-10 p-4">
                                    <ProductItem
                                        title="Smart Match"
                                        href="/solutions/smart-match"
                                        src="/images/menu/smart-match.png"
                                        description="AI-driven university matching tailored to your profile."
                                    />
                                    <ProductItem
                                        title="Strategy Audit"
                                        href="/solutions/strategy-audit"
                                        src="/images/menu/strategy-audit.png"
                                        description="Comprehensive review of your application strategy."
                                    />
                                    <ProductItem
                                        title="Ivy League"
                                        href="/solutions/ivy-league"
                                        src="/images/menu/ivy-league.png"
                                        description="Specialized tracks for top-tier university admissions."
                                    />
                                    <ProductItem
                                        title="Scholarships"
                                        href="/solutions/scholarships"
                                        src="/images/menu/scholarships.png"
                                        description="Find and secure financial aid worldwide."
                                    />
                                </div>
                            </MenuItem>
                            <MenuItem setActive={setActive} active={active} item="Resources">
                                <div className="flex flex-col space-y-4 text-sm p-2">
                                    <HoveredLink href="/blog">Blog</HoveredLink>
                                    <HoveredLink href="/guides">Country Guides</HoveredLink>
                                    <HoveredLink href="/community">Community</HoveredLink>
                                    <HoveredLink href="/events">Events</HoveredLink>
                                </div>
                            </MenuItem>
                        </Menu>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors hidden sm:block">Sign In</Link>
                        <Link href="/signup">
                            <NavbarButton variant="primary">Get Started</NavbarButton>
                        </Link>
                    </div>
                </NavBody>
            </Navbar>

            <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center space-y-6 mb-20"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 backdrop-blur-md">
                        <Brain className="h-4 w-4" />
                        <span className="text-xs font-bold tracking-wider uppercase">Neural Precision</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight leading-[1.1]">
                        AI-Powered <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">University Matching</span>
                    </h1>

                    <p className="text-xl text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed">
                        Process millions of data points across 5,000+ global institutions to find your perfect academic fit with <span className="text-white font-semibold">96% accuracy</span>.
                    </p>
                </motion.div>

                {/* Feature Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {[
                        {
                            icon: Target,
                            title: "Profile DNA",
                            description: "Extract 50+ parameters from your academic history and extracurriculars to build your unique applicant signature.",
                            gradient: "from-blue-500/20 to-transparent"
                        },
                        {
                            icon: Cpu,
                            title: "Probability Engine",
                            description: "Real-time simulation of admission decisions based on historical data and current class profiles.",
                            gradient: "from-purple-500/20 to-transparent"
                        },
                        {
                            icon: Zap,
                            title: "Instant Filters",
                            description: "Match by budget, ranking, climate, and career outcomes in milliseconds. No manual research needed.",
                            gradient: "from-pink-500/20 to-transparent"
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className={`p-8 md:p-10 rounded-2xl md:rounded-3xl bg-gradient-to-br ${feature.gradient} border border-white/10 backdrop-blur-xl group hover:border-white/20 transition-all hover:scale-105`}
                        >
                            <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10 group-hover:scale-110 transition-transform">
                                <feature.icon className="text-white h-7 w-7" />
                            </div>
                            <h3 className="text-2xl font-display font-bold text-white mb-4 tracking-tight">{feature.title}</h3>
                            <p className="text-neutral-400 font-light leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* How It Works */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-32 p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-white/[0.02] border border-white/5 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

                    <div className="relative grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                <Sparkles className="h-3 w-3 text-blue-400" />
                                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">How It Works</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-display font-black text-white leading-tight tracking-tight">
                                The Neural Match <br />
                                <span className="text-blue-400">Process</span>
                            </h2>

                            <div className="space-y-6">
                                {[
                                    { icon: Search, title: "Deep Data Crawl", desc: "Track visa grant rates, faculty research trends, and post-grad salaries." },
                                    { icon: Globe, title: "Global Benchmarking", desc: "Compare your scores against applicants from 120+ countries." },
                                    { icon: ShieldCheck, title: "Verified Results", desc: "Matches audited against actual historical admissions data." }
                                ].map((step, i) => (
                                    <div key={i} className="flex gap-6 group">
                                        <div className="h-12 w-12 shrink-0 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 group-hover:bg-blue-500/20 transition-all">
                                            <step.icon className="h-6 w-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-display font-bold text-lg mb-1">{step.title}</h4>
                                            <p className="text-neutral-400 text-sm leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/5 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                                <div className="text-center p-8 relative z-10">
                                    <div className="text-8xl font-display font-black text-white/20 mb-4 leading-none">96%</div>
                                    <div className="text-sm uppercase tracking-[0.3em] text-neutral-500 font-bold">Match Accuracy</div>
                                </div>
                            </div>
                            <div className="absolute -top-4 -right-4 h-24 w-24 bg-blue-500/30 blur-2xl rounded-full animate-pulse" />
                            <div className="absolute -bottom-10 -left-10 h-32 w-32 bg-purple-500/30 blur-2xl rounded-full animate-pulse" />
                        </div>
                    </div>
                </motion.div>

                <Footer />
            </div>
        </div>
    );
}
