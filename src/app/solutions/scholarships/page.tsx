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
import { DollarSign, Search, Award, Sparkles, ArrowRight, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Footer } from '@/components/ui/footer';

export default function ScholarshipsPage() {
    const [active, setActive] = useState<string | null>(null);

    const scholarshipTypes = [
        {
            title: "Merit-Based",
            amount: "$5K - $50K",
            desc: "Academic excellence and achievement-based funding from top universities.",
            gradient: "from-emerald-500/20",
            icon: Award
        },
        {
            title: "Need-Based",
            amount: "Full Tuition",
            desc: "Financial aid packages covering 100% demonstrated need at elite institutions.",
            gradient: "from-blue-500/20",
            icon: DollarSign
        },
        {
            title: "Country-Specific",
            amount: "$10K - $40K",
            desc: "Government and private scholarships targeting students from specific regions.",
            gradient: "from-purple-500/20",
            icon: Search
        }
    ];

    return (
        <div className="min-h-screen w-full bg-black relative text-white">
            {/* Dot Matrix Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundColor: '#000000',
                    backgroundImage: `
                        radial-gradient(circle at 25% 25%, #1a1a1a 0.5px, transparent 1px),
                        radial-gradient(circle at 75% 75%, #0f0f0f 0.5px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px',
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
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 backdrop-blur-md">
                        <DollarSign className="h-4 w-4" />
                        <span className="text-xs font-bold tracking-wider uppercase">Financial Freedom</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight leading-[1]">
                        Scholarship <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400">Navigator</span>
                    </h1>

                    <p className="text-lg md:text-xl text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed">
                        Find and secure financial aid worldwide. Access <span className="text-white font-semibold">$2.5B+ in scholarships</span> matched to your profile.
                    </p>
                </motion.div>

                {/* Scholarship Types */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-24">
                    {scholarshipTypes.map((type, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-8 md:p-10 rounded-2xl md:rounded-3xl bg-gradient-to-br ${type.gradient} to-transparent border border-white/10 space-y-6 group hover:border-white/20 transition-all hover:scale-105`}
                        >
                            <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                <type.icon className="h-6 w-6 md:h-7 md:w-7 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight mb-2">{type.title}</h3>
                                <div className="text-2xl md:text-3xl font-display font-black text-emerald-400 mb-4">{type.amount}</div>
                                <p className="text-neutral-400 font-light text-sm md:text-base leading-relaxed">{type.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* How We Help */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-white/10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

                    <div className="relative z-10 space-y-12">
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight">
                                Your Funding Roadmap
                            </h2>
                            <p className="text-neutral-400 font-light text-lg max-w-2xl mx-auto">
                                From discovery to application, we guide you through every step
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {[
                                {
                                    title: "AI-Powered Discovery",
                                    desc: "Our engine scans 10,000+ scholarships daily and matches them to your academic profile, nationality, and field of study."
                                },
                                {
                                    title: "Eligibility Analysis",
                                    desc: "Instant verification of requirements - GPA, test scores, citizenship, and essay prompts."
                                },
                                {
                                    title: "Application Timeline",
                                    desc: "Automated deadline tracking with reminders for essays, recommendations, and document submissions."
                                },
                                {
                                    title: "Essay Optimization",
                                    desc: "AI feedback on scholarship essays to maximize your chances of winning competitive awards."
                                }
                            ].map((item, i) => (
                                <div key={i} className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4 group hover:bg-white/[0.05] transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                            <TrendingUp className="h-4 w-4 text-emerald-400" />
                                        </div>
                                        <h4 className="text-xl font-display font-bold text-white tracking-tight">{item.title}</h4>
                                    </div>
                                    <p className="text-neutral-400 font-light leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="text-center pt-8 space-y-8">
                            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                                <div className="text-center">
                                    <div className="text-3xl md:text-5xl font-display font-black text-white mb-2">$2.5B+</div>
                                    <div className="text-[10px] md:text-xs uppercase tracking-wider text-neutral-500 font-bold">Total Funding</div>
                                </div>
                                <div className="hidden md:block h-16 w-px bg-white/10" />
                                <div className="text-center">
                                    <div className="text-3xl md:text-5xl font-display font-black text-white mb-2">10K+</div>
                                    <div className="text-[10px] md:text-xs uppercase tracking-wider text-neutral-500 font-bold">Scholarships</div>
                                </div>
                                <div className="hidden md:block h-16 w-px bg-white/10" />
                                <div className="text-center">
                                    <div className="text-3xl md:text-5xl font-display font-black text-white mb-2">120+</div>
                                    <div className="text-[10px] md:text-xs uppercase tracking-wider text-neutral-500 font-bold">Countries</div>
                                </div>
                            </div>

                            <Link href="/signup">
                                <button className="inline-flex items-center gap-3 px-10 h-14 rounded-full bg-white text-black font-bold hover:scale-105 transition-all text-sm uppercase tracking-wider shadow-xl shadow-white/10">
                                    Find My Scholarships
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
