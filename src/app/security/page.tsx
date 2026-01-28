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
import { ShieldAlert, Fingerprint, Lock, ShieldCheck, Key, Eye, Database, Server } from 'lucide-react';
import { motion } from 'framer-motion';
import { Footer } from '@/components/ui/footer';

export default function SecurityPage() {
    const [active, setActive] = useState<string | null>(null);

    const features = [
        {
            icon: Lock,
            title: "End-to-End Encryption",
            desc: "All document uploads are encrypted using AES-256 before being processed by the neural engine.",
            gradient: "from-blue-500/20"
        },
        {
            icon: Fingerprint,
            title: "Biometric Auth",
            desc: "Secure your admissions dashboard with industry-standard MFA and biometric verification.",
            gradient: "from-purple-500/20"
        },
        {
            icon: ShieldAlert,
            title: "Privacy First AI",
            desc: "Our models are trained on anonymized data sets to ensure zero leakage of individual profiles.",
            gradient: "from-pink-500/20"
        },
        {
            icon: ShieldCheck,
            title: "Regulatory Compliance",
            desc: "Full GDPR and CCPA compliance across all global jurisdictions we operate in.",
            gradient: "from-emerald-500/20"
        },
        {
            icon: Key,
            title: "Zero-Knowledge Architecture",
            desc: "We can't access your data even if we wanted to. Your encryption keys stay with you.",
            gradient: "from-yellow-500/20"
        },
        {
            icon: Eye,
            title: "Audit Logs",
            desc: "Complete transparency with real-time access logs showing every interaction with your data.",
            gradient: "from-red-500/20"
        },
        {
            icon: Database,
            title: "Distributed Storage",
            desc: "Your data is sharded across multiple geographic regions with automatic failover.",
            gradient: "from-indigo-500/20"
        },
        {
            icon: Server,
            title: "SOC 2 Type II Certified",
            desc: "Independently audited security controls meeting the highest industry standards.",
            gradient: "from-cyan-500/20"
        }
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
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 backdrop-blur-md">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-xs font-bold tracking-wider uppercase">Military Grade</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight leading-[1]">
                        Data <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">Fortress</span>
                    </h1>

                    <p className="text-lg md:text-xl text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed">
                        Your future is built on sensitive data. We protect it with <span className="text-white font-semibold">military-grade encryption</span> and a strict zero-retention policy on personal identification.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`p-6 md:p-8 rounded-xl md:rounded-2xl bg-gradient-to-br ${item.gradient} to-transparent border border-white/10 space-y-4 group hover:border-white/20 transition-all hover:scale-105`}
                        >
                            <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                <item.icon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="text-lg font-display font-bold text-white tracking-tight">{item.title}</h3>
                            <p className="text-neutral-400 text-sm font-light leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-24 p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-emerald-500/10 border border-white/10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />

                    <div className="relative z-10 text-center space-y-6">
                        <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight">
                            Trust Through Transparency
                        </h2>
                        <p className="text-neutral-400 font-light text-lg max-w-2xl mx-auto">
                            We publish quarterly security audits and maintain a public bug bounty program. Your trust is our foundation.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 pt-6">
                            <div className="text-center">
                                <div className="text-3xl md:text-5xl font-display font-black text-white mb-2">99.99%</div>
                                <div className="text-[10px] md:text-xs uppercase tracking-wider text-neutral-500 font-bold">Uptime SLA</div>
                            </div>
                            <div className="hidden md:block h-16 w-px bg-white/10" />
                            <div className="text-center">
                                <div className="text-3xl md:text-5xl font-display font-black text-white mb-2">0</div>
                                <div className="text-[10px] md:text-xs uppercase tracking-wider text-neutral-500 font-bold">Data Breaches</div>
                            </div>
                            <div className="hidden md:block h-16 w-px bg-white/10" />
                            <div className="text-center">
                                <div className="text-3xl md:text-5xl font-display font-black text-white mb-2">24/7</div>
                                <div className="text-[10px] md:text-xs uppercase tracking-wider text-neutral-500 font-bold">Monitoring</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <Footer />
            </div>
        </div>
    );
}
