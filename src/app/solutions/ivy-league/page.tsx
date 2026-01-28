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
import { GraduationCap, Star, Trophy, Sparkles, ArrowRight, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { Footer } from '@/components/ui/footer';

export default function IvyLeaguePage() {
    const [active, setActive] = useState<string | null>(null);

    const universities = [
        { name: "Harvard", acceptance: "3.2%", color: "from-red-500/20" },
        { name: "Stanford", acceptance: "3.7%", color: "from-red-600/20" },
        { name: "MIT", acceptance: "3.9%", color: "from-red-700/20" },
        { name: "Yale", acceptance: "4.5%", color: "from-blue-500/20" },
        { name: "Princeton", acceptance: "4.4%", color: "from-orange-500/20" },
        { name: "Columbia", acceptance: "3.9%", color: "from-blue-600/20" }
    ];

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
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 backdrop-blur-md">
                        <Trophy className="h-4 w-4" />
                        <span className="text-xs font-bold tracking-wider uppercase">Elite Track</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight leading-[1]">
                        Ivy League <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-400 to-red-400">Mastery</span>
                    </h1>

                    <p className="text-lg md:text-xl text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed">
                        Specialized tracks for top-tier university admissions. Navigate the <span className="text-white font-semibold">most competitive</span> application processes with expert guidance.
                    </p>
                </motion.div>

                {/* Target Universities */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                    {universities.map((uni, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`p-6 md:p-8 rounded-2xl bg-gradient-to-br ${uni.color} to-transparent border border-white/10 group hover:border-white/20 transition-all hover:scale-105`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <Star className="h-5 w-5 md:h-6 md:w-6 text-amber-400" />
                                <span className="text-[10px] md:text-xs font-bold text-neutral-500 uppercase tracking-wider">Acceptance</span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-display font-bold text-white mb-2 tracking-tight">{uni.name}</h3>
                            <div className="text-2xl md:text-3xl font-display font-black text-amber-400">{uni.acceptance}</div>
                        </motion.div>
                    ))}
                </div>

                {/* What Makes Us Different */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10 border border-white/10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-500/20 rounded-full blur-3xl" />

                    <div className="relative z-10 space-y-12">
                        <div className="text-center space-y-4">
                            <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight">
                                The Elite Advantage
                            </h2>
                            <p className="text-neutral-400 font-light text-lg max-w-2xl mx-auto">
                                What separates Ivy League admits from the rest
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {[
                                {
                                    icon: GraduationCap,
                                    title: "Holistic Profile Building",
                                    desc: "Beyond grades - we help you craft a narrative that resonates with elite admissions committees."
                                },
                                {
                                    icon: Award,
                                    title: "Research & Publication Strategy",
                                    desc: "Guidance on securing research positions and publishing in peer-reviewed journals."
                                },
                                {
                                    icon: Star,
                                    title: "Leadership Positioning",
                                    desc: "Strategic extracurricular selection that demonstrates genuine impact and initiative."
                                },
                                {
                                    icon: Trophy,
                                    title: "Interview Mastery",
                                    desc: "Mock interviews with ex-admissions officers from Harvard, MIT, and Stanford."
                                }
                            ].map((item, i) => (
                                <div key={i} className="flex flex-col sm:flex-row gap-6 p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 group hover:bg-white/[0.05] transition-all">
                                    <div className="h-12 w-12 shrink-0 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
                                        <item.icon className="h-6 w-6 text-amber-400" />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-xl font-display font-bold text-white tracking-tight">{item.title}</h4>
                                        <p className="text-neutral-400 font-light leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="text-center pt-8">
                            <Link href="/signup">
                                <button className="inline-flex items-center gap-3 px-10 h-14 rounded-full bg-white text-black font-bold hover:scale-105 transition-all text-sm uppercase tracking-wider shadow-xl shadow-white/10">
                                    Begin Elite Track
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
