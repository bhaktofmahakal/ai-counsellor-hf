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
import { MapPin, Navigation, Download, Globe, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Footer } from '@/components/ui/footer';

export default function GuidesPage() {
    const [active, setActive] = useState<string | null>(null);

    const countries = [
        {
            name: "United States",
            students: "1.1M+",
            code: "US",
            gradient: "from-blue-600/30 to-blue-900/10",
            img: "https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&q=80"
        },
        {
            name: "United Kingdom",
            students: "680K+",
            code: "UK",
            gradient: "from-red-600/30 to-red-900/10",
            img: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80"
        },
        {
            name: "Canada",
            students: "620K+",
            code: "CA",
            gradient: "from-rose-600/30 to-rose-900/10",
            img: "https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&q=80"
        },
        {
            name: "Germany",
            students: "410K+",
            code: "DE",
            gradient: "from-yellow-600/30 to-yellow-900/10",
            img: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&q=80"
        },
        {
            name: "Australia",
            students: "480K+",
            code: "AU",
            gradient: "from-emerald-600/30 to-emerald-900/10",
            img: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80"
        },
        {
            name: "Netherlands",
            students: "120K+",
            code: "NL",
            gradient: "from-orange-600/30 to-orange-900/10",
            img: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80"
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
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 backdrop-blur-md">
                        <Globe className="h-4 w-4" />
                        <span className="text-xs font-bold tracking-wider uppercase">Global Intelligence</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight leading-[1]">
                        Country <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Atlas</span>
                    </h1>

                    <p className="text-lg md:text-xl text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed">
                        Detailed breakdowns of costs, culture, visa grant rates, and job markets for the world's leading study destinations.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {countries.map((c, i) => (
                        <motion.div
                            key={c.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group cursor-pointer relative overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 hover:border-white/20 transition-all hover:scale-105"
                        >
                            <div className="aspect-[4/3] relative">
                                <img
                                    src={c.img}
                                    alt={c.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient}`} />
                                <div className="absolute inset-0 bg-black/40" />

                                <div className="absolute top-6 right-6 text-7xl font-display font-black text-white/10 group-hover:text-white/20 transition-colors">
                                    {c.code}
                                </div>
                            </div>

                            <div className="p-6 md:p-8 bg-black/60 backdrop-blur-xl border-t border-white/5 space-y-4">
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-white/40" />
                                    <h3 className="text-xl md:text-2xl font-display font-bold text-white tracking-tight">{c.name}</h3>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                                            {c.students} Students
                                        </span>
                                    </div>

                                    <Link href="/signup" className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors group/link">
                                        <span className="text-xs font-bold uppercase tracking-wider">Download</span>
                                        <Download className="h-4 w-4 group-hover/link:translate-y-0.5 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <Footer />
            </div>
        </div>
    );
}
