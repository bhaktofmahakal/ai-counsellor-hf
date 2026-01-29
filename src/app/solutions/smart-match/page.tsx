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
import { Brain, Target, Zap, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Footer } from '@/components/ui/footer';

export default function SmartMatchPage() {
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
                    className="text-center space-y-6 mb-24"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 backdrop-blur-md">
                        <Brain className="h-4 w-4" />
                        <span className="text-xs font-bold tracking-wider uppercase">AI-Powered Precision</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight leading-[1]">
                        Smart <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Match</span>
                    </h1>

                    <p className="text-lg md:text-xl text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed">
                        AI-driven university matching tailored to your profile. Find your perfect academic fit from <span className="text-white font-semibold">5,000+ global institutions</span>.
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-24">
                    {[
                        {
                            icon: Brain,
                            title: "Neural Analysis",
                            desc: "Our AI processes 50+ parameters from your academic history to build your unique applicant DNA.",
                            gradient: "from-blue-500/20"
                        },
                        {
                            icon: Target,
                            title: "Precision Matching",
                            desc: "Match universities based on acceptance probability, budget, location, and career outcomes.",
                            gradient: "from-purple-500/20"
                        },
                        {
                            icon: Zap,
                            title: "Instant Results",
                            desc: "Get personalized university recommendations in seconds, not weeks of manual research.",
                            gradient: "from-pink-500/20"
                        }
                    ].map((feature, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-8 md:p-10 rounded-2xl md:rounded-3xl bg-gradient-to-br ${feature.gradient} to-transparent border border-white/10 space-y-6 group hover:border-white/20 transition-all hover:scale-105`}
                        >
                            <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                <feature.icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight">{feature.title}</h3>
                            <p className="text-neutral-400 font-light text-sm md:text-base leading-relaxed">{feature.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* How It Works */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

                    <div className="relative z-10 space-y-12">
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight">
                                How It Works
                            </h2>
                            <p className="text-neutral-400 font-light text-lg max-w-2xl mx-auto">
                                Our AI-powered matching process in 3 simple steps
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { step: "01", title: "Profile Input", desc: "Share your academic scores, interests, and preferences" },
                                { step: "02", title: "AI Analysis", desc: "Our neural engine processes millions of data points" },
                                { step: "03", title: "Get Matches", desc: "Receive ranked university recommendations instantly" }
                            ].map((item, i) => (
                                <div key={i} className="text-center space-y-4">
                                    <div className="text-6xl font-display font-black text-white/10">{item.step}</div>
                                    <h4 className="text-xl font-display font-bold text-white">{item.title}</h4>
                                    <p className="text-neutral-400 font-light">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="text-center pt-8">
                            <Link href="/signup">
                                <button className="inline-flex items-center gap-3 px-10 h-14 rounded-full bg-white text-black font-bold hover:scale-105 transition-all text-sm uppercase tracking-wider shadow-xl shadow-white/10">
                                    Start Matching Now
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                <Footer />
            </div>
        </div>
    );
}
