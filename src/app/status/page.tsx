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
import { Activity, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Footer } from '@/components/ui/footer';

export default function StatusPage() {
    const [active, setActive] = useState<string | null>(null);

    const systems = [
        { name: "Matching Engine", status: "Operational", color: "bg-emerald-500", uptime: "99.99%" },
        { name: "Document Audit AI", status: "Operational", color: "bg-emerald-500", uptime: "99.98%" },
        { name: "Global University DB", status: "Operational", color: "bg-emerald-500", uptime: "100%" },
        { name: "Success Simulation API", status: "Maintenance", color: "bg-yellow-500", uptime: "99.95%" },
        { name: "Student Dashboard", status: "Operational", color: "bg-emerald-500", uptime: "99.97%" },
        { name: "Payment Gateway", status: "Operational", color: "bg-emerald-500", uptime: "100%" },
        { name: "Email Notifications", status: "Operational", color: "bg-emerald-500", uptime: "99.99%" },
        { name: "Mobile API", status: "Operational", color: "bg-emerald-500", uptime: "99.96%" }
    ];

    const metrics = [
        { label: "Avg Response Time", value: "42ms", color: "text-blue-400" },
        { label: "Active Users", value: "12.5K", color: "text-purple-400" },
        { label: "Requests/Min", value: "8,420", color: "text-pink-400" }
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

            <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6 mb-20"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 backdrop-blur-md">
                        <Activity className="h-4 w-4 animate-pulse" />
                        <span className="text-xs font-bold tracking-wider uppercase">All Systems Operational</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight leading-[1]">
                        System <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400">Pulse</span>
                    </h1>

                    <p className="text-lg md:text-xl text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed">
                        Real-time monitoring of our core AI infrastructure and database availability.
                    </p>
                </motion.div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-12">
                    {metrics.map((metric, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center"
                        >
                            <div className={`text-3xl md:text-4xl font-display font-black ${metric.color} mb-2`}>{metric.value}</div>
                            <div className="text-[10px] md:text-xs uppercase tracking-wider text-neutral-500 font-bold">{metric.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Systems Status */}
                <div className="space-y-4">
                    {systems.map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-5 md:p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className={`h-3 w-3 rounded-full ${s.color} animate-pulse`} />
                                    <div className={`absolute inset-0 rounded-full ${s.color} animate-ping opacity-50`} />
                                </div>
                                <span className="text-base md:text-lg font-display font-bold text-white tracking-tight">{s.name}</span>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 sm:gap-12">
                                <div className="text-left sm:text-right">
                                    <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold mb-0.5 md:mb-1">Uptime</div>
                                    <div className="text-sm font-bold text-white">{s.uptime}</div>
                                </div>
                                <div className="px-3 md:px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                                    <span className="text-[10px] md:text-xs font-bold text-neutral-400 uppercase tracking-wider">{s.status}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Incident History */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-20 p-12 rounded-3xl bg-white/[0.02] border border-white/5 text-center"
                >
                    <CheckCircle2 className="h-16 w-16 text-emerald-500/40 mx-auto mb-6" />
                    <h2 className="text-3xl font-display font-black text-white mb-4 tracking-tight">No Recent Incidents</h2>
                    <p className="text-neutral-400 font-light">All systems have been running smoothly for the past 90 days.</p>
                </motion.div>

                <Footer />
            </div>
        </div>
    );
}
