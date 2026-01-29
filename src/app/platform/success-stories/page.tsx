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
import { Quote, Star, Sparkles, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { Footer } from '@/components/ui/footer';

export default function SuccessStoriesPage() {
    const [active, setActive] = useState<string | null>(null);

    const stories = [
        {
            name: "Sarah Chen",
            uni: "Stanford University",
            major: "Computer Science",
            img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200",
            quote: "The AI detected a gap in my research profile that I hadn't noticed. It suggested a specific hackathon that eventually led to my Stanford acceptance.",
            gradient: "from-red-500/20"
        },
        {
            name: "Arjun Mehta",
            uni: "Oxford University",
            major: "Philosophy & Economics",
            img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200",
            quote: "Finding a scholarship for PPE at Oxford seemed impossible. The Scholarship Finder mapped 12 different private funds that matched my lineage and academic goals.",
            gradient: "from-blue-500/20"
        },
        {
            name: "Lena Schmidt",
            uni: "MIT",
            major: "Aerospace Engineering",
            img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200",
            quote: "Strategic matching saved me months of research. I applied to 4 universities and got into 3, all perfectly aligned with my budget and career vision.",
            gradient: "from-purple-500/20"
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
                        <Award className="h-4 w-4" />
                        <span className="text-xs font-bold tracking-wider uppercase">Proven Results</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight leading-[1]">
                        Success <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Stories</span>
                    </h1>

                    <p className="text-xl text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed">
                        Real results for real students. Our platform has empowered over <span className="text-white font-semibold">5,000+ applicants</span> to find their home in world-class institutions.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-1 gap-12 max-w-5xl mx-auto">
                    {stories.map((story, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-8 md:p-12 rounded-2xl md:rounded-3xl bg-gradient-to-br ${story.gradient} to-transparent border border-white/10 flex flex-col md:flex-row gap-8 md:gap-12 items-center hover:border-white/20 transition-all hover:scale-[1.02]`}
                        >
                            <div className="relative group shrink-0">
                                <div className="h-32 w-32 rounded-3xl overflow-hidden border-2 border-white/10 group-hover:scale-105 transition-transform duration-500">
                                    <img src={story.img} alt={story.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-4 -right-4 h-12 w-12 rounded-2xl bg-white flex items-center justify-center border-2 border-black shadow-xl">
                                    <Star className="h-5 w-5 text-black fill-black" />
                                </div>
                            </div>

                            <div className="space-y-6 flex-1">
                                <Quote className="h-8 w-8 md:h-10 md:w-10 text-white/10" />
                                <p className="text-xl md:text-2xl text-white font-light leading-relaxed">"{story.quote}"</p>
                                <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <h4 className="text-white font-display font-bold text-xl tracking-tight mb-1">{story.name}</h4>
                                        <p className="text-neutral-400 text-sm">{story.major} @ {story.uni}</p>
                                    </div>
                                    <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10">
                                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Verified</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-32 p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />

                    <div className="relative z-10 space-y-6">
                        <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight">
                            Your Name is <span className="text-blue-400">Next</span>
                        </h2>
                        <p className="text-neutral-400 font-light text-lg max-w-2xl mx-auto">
                            Join the next cohort of global scholars using AI to navigate the world's best education systems.
                        </p>
                        <Link href="/signup">
                            <button className="inline-flex items-center gap-3 px-10 h-14 rounded-full bg-white text-black font-bold hover:scale-105 transition-all text-sm uppercase tracking-wider shadow-xl shadow-white/10">
                                Start Your Story
                                <Sparkles className="h-4 w-4" />
                            </button>
                        </Link>
                    </div>
                </motion.div>

                <Footer />
            </div>
        </div>
    );
}
