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
import { BookOpen, Calendar, Clock, User, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { Footer } from '@/components/ui/footer';

export default function BlogPage() {
    const [active, setActive] = useState<string | null>(null);

    const posts = [
        {
            title: "Decoding the 2025 Ivy League Admissions Cycle",
            desc: "A deep dive into the latest data trends and what they mean for international applicants.",
            author: "Dr. Elena Vance",
            date: "Jan 12, 2025",
            read: "8 min",
            img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
            category: "Strategy"
        },
        {
            title: "How to Build a World-Class Extracurricular Profile",
            desc: "Stop doing everything. Start doing the right things. Our guide to profile curation.",
            author: "Marcus Thorne",
            date: "Jan 08, 2025",
            read: "12 min",
            img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
            category: "Profile"
        },
        {
            title: "The Financial Aid Cheat Sheet for UK Universities",
            desc: "Navigating the complex landscape of UK scholarships and bursaries in 2025.",
            author: "Sarah Jenkins",
            date: "Dec 28, 2024",
            read: "15 min",
            img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
            category: "Finance"
        },
        {
            title: "AI vs Traditional Counseling: The Data Speaks",
            desc: "Comparing outcomes, costs, and success rates between AI-powered and human counseling.",
            author: "Dr. Raj Patel",
            date: "Dec 20, 2024",
            read: "10 min",
            img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
            category: "Technology"
        },
        {
            title: "Visa Interview Secrets: What Officers Really Look For",
            desc: "Insider insights from former visa officers on how to ace your F-1 interview.",
            author: "Amanda Lee",
            date: "Dec 15, 2024",
            read: "9 min",
            img: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80",
            category: "Visa"
        },
        {
            title: "The Statement of Purpose Formula That Works",
            desc: "Breaking down successful SOPs from Harvard, MIT, and Stanford admits.",
            author: "Prof. Michael Chen",
            date: "Dec 10, 2024",
            read: "14 min",
            img: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
            category: "Writing"
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
                    className="text-left space-y-6 mb-24"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 backdrop-blur-md">
                        <BookOpen className="h-4 w-4" />
                        <span className="text-xs font-bold tracking-wider uppercase">Knowledge Base</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight leading-[1.1]">
                        The Intelligence <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400">Feed</span>
                    </h1>

                    <p className="text-lg md:text-xl text-neutral-400 font-light max-w-2xl leading-relaxed">
                        Raw intelligence on global education, admissions strategy, and career engineering from the experts.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post, i) => (
                        <motion.article
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <div className="aspect-[16/9] md:aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden border border-white/5 mb-6 relative bg-neutral-900">
                                <img
                                    src={post.img}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10">
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">{post.category}</span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                    <div className="flex items-center gap-2 text-white">
                                        <span className="text-sm font-bold">Read Article</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-neutral-500">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="h-3 w-3" /> {post.date}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="h-3 w-3" /> {post.read}
                                    </span>
                                </div>

                                <h3 className="text-xl md:text-2xl font-display font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight">
                                    {post.title}
                                </h3>

                                <p className="text-neutral-400 font-light leading-relaxed">
                                    {post.desc}
                                </p>

                                <div className="pt-4 flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border border-white/10 flex items-center justify-center">
                                        <User className="h-5 w-5 text-white/60" />
                                    </div>
                                    <span className="text-sm font-semibold text-neutral-300">{post.author}</span>
                                </div>
                            </div>
                        </motion.article>
                    ))}
                </div>

                <div className="mt-16 md:mt-24 text-center">
                    <button className="px-10 md:px-12 h-14 rounded-full border-2 border-white/10 hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider text-sm group">
                        <span className="flex items-center gap-3">
                            Load More Articles
                            <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                        </span>
                    </button>
                </div>

                <Footer />
            </div>
        </div>
    );
}
