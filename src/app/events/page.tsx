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
import { Calendar, PlayCircle, Sparkles, Users, Video, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Footer } from '@/components/ui/footer';

export default function EventsPage() {
    const [active, setActive] = useState<string | null>(null);

    const events = [
        {
            title: "Ivy League Strategy Masterclass",
            date: "Feb 15, 2025",
            time: "10:00 AM EST",
            type: "Virtual Workshop",
            status: "Registration Open",
            attendees: "450+",
            gradient: "from-blue-500/20",
            img: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80"
        },
        {
            title: "CS Admissions: Beyond the GRE",
            date: "Feb 22, 2025",
            time: "2:00 PM GMT",
            type: "Live Q&A",
            status: "Filling Fast",
            attendees: "320+",
            gradient: "from-purple-500/20",
            img: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80"
        },
        {
            title: "Global Scholarship Summit",
            date: "Mar 05, 2025",
            time: "4:00 PM IST",
            type: "Symposium",
            status: "Coming Soon",
            attendees: "600+",
            gradient: "from-emerald-500/20",
            img: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&q=80"
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
                    className="text-left space-y-6 mb-24"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 backdrop-blur-md">
                        <Video className="h-4 w-4" />
                        <span className="text-xs font-bold tracking-wider uppercase">Live Sessions</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight leading-[1.1]">
                        Expert <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">Briefings</span>
                    </h1>

                    <p className="text-xl text-neutral-400 font-light max-w-2xl leading-relaxed">
                        Live sessions with ex-admissions officers and AI strategists. Get your questions answered in real-time.
                    </p>
                </motion.div>

                <div className="space-y-8">
                    {events.map((event, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group relative overflow-hidden rounded-2xl md:rounded-3xl border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02]"
                        >
                            <div className="grid md:grid-cols-[300px_1fr] gap-0">
                                <div className="relative aspect-[16/9] md:aspect-auto">
                                    <img
                                        src={event.img}
                                        alt={event.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-br ${event.gradient}`} />
                                    <div className="absolute inset-0 bg-black/40" />

                                    <div className="absolute top-6 left-6 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                                        <span className="text-xs font-bold text-white uppercase tracking-wider">{event.type}</span>
                                    </div>
                                </div>

                                <div className="p-8 md:p-10 bg-black/60 backdrop-blur-xl flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                                {event.status}
                                            </span>
                                            <span className="flex items-center gap-2 text-neutral-400 text-sm">
                                                <Users className="h-4 w-4" />
                                                {event.attendees} Registered
                                            </span>
                                        </div>

                                        <h3 className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight group-hover:text-pink-400 transition-colors">
                                            {event.title}
                                        </h3>

                                        <div className="flex items-center gap-6 text-neutral-400 font-semibold">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4" />
                                                {event.date}
                                            </div>
                                            <div className="h-1 w-1 rounded-full bg-neutral-700" />
                                            <div>{event.time}</div>
                                        </div>
                                    </div>

                                    <button className="mt-6 inline-flex items-center gap-3 px-8 h-12 rounded-full border-2 border-white/10 hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider text-sm group/btn">
                                        <PlayCircle className="h-5 w-5 group-hover/btn:scale-110 transition-transform" />
                                        Secure My Seat
                                    </button>
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
