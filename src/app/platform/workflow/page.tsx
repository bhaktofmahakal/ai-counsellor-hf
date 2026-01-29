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
import { CheckCircle2, ListTodo, Rocket, Search, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Footer } from '@/components/ui/footer';

export default function WorkflowPage() {
    const [active, setActive] = useState<string | null>(null);

    const steps = [
        {
            step: "01",
            icon: Search,
            title: "Profile Genesis",
            desc: "Data ingestion stage. We collect your academic benchmarks, research interests, and financial constraints to initialize the matching process.",
            color: "from-blue-500"
        },
        {
            step: "02",
            icon: ListTodo,
            title: "University Synthesis",
            desc: "Our neural engine scans 50,000+ program combinations to find high-probability matches based on class representative data.",
            color: "from-purple-500"
        },
        {
            step: "03",
            icon: CheckCircle2,
            title: "Task Orchestration",
            desc: "We generate a customized milestone map. From SOP drafts to LOR follow-ups, every action is tracked and optimized.",
            color: "from-pink-500"
        },
        {
            step: "04",
            icon: Rocket,
            title: "Launch & Submission",
            desc: "Final audit phase. We verify every document against university-specific requirements before you hit submit.",
            color: "from-emerald-500"
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
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 backdrop-blur-md">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-xs font-bold tracking-wider uppercase">Operational Excellence</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight leading-[1]">
                        Your Admission <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400">Workflow</span>
                    </h1>

                    <p className="text-xl text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed">
                        Admission strategies are complex. We've simplified them into a <span className="text-white font-semibold">data-driven path</span> that removes guesswork from your application.
                    </p>
                </motion.div>

                <div className="space-y-6">
                    {steps.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: i * 0.1 }}
                            className="group relative p-8 md:p-10 rounded-2xl md:rounded-3xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row gap-8 items-center hover:scale-[1.02]"
                        >
                            <div className={`text-6xl md:text-8xl font-display font-black bg-gradient-to-br ${item.color} to-transparent bg-clip-text text-transparent opacity-20 group-hover:opacity-30 transition-opacity leading-none`}>
                                {item.step}
                            </div>

                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <div className="h-12 w-12 mx-auto md:mx-0 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                                    <item.icon className="h-6 w-6 text-white" />
                                </div>
                                <h3 className="text-3xl font-display font-bold text-white tracking-tight">{item.title}</h3>
                                <p className="text-neutral-400 font-light text-lg leading-relaxed max-w-xl">
                                    {item.desc}
                                </p>
                            </div>

                            <div className="hidden md:flex h-16 w-16 rounded-full border-2 border-white/5 items-center justify-center group-hover:bg-white group-hover:border-white transition-all">
                                <CheckCircle2 className="h-7 w-7 text-white/20 group-hover:text-black opacity-20 group-hover:opacity-100 transition-all" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-32 p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-white/10 text-center relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

                    <div className="relative z-10 space-y-6">
                        <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-neutral-400 font-light text-lg max-w-2xl mx-auto">
                            Join thousands of students who've streamlined their admission process with our AI-powered workflow.
                        </p>
                        <Link href="/signup">
                            <button className="inline-flex items-center gap-3 px-10 h-14 rounded-full bg-white text-black font-bold hover:scale-105 transition-all text-sm uppercase tracking-wider shadow-xl shadow-white/10">
                                Begin Your Workflow
                                <ArrowRight className="h-4 w-4" />
                            </button>
                        </Link>
                    </div>
                </motion.div>

                <Footer />
            </div>
        </div>
    );
}
