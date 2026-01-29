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
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Footer } from '@/components/ui/footer';

export default function PricingPage() {
    const [active, setActive] = useState<string | null>(null);

    const plans = [
        {
            name: "Free",
            price: "$0",
            desc: "Perfect for exploring the platform",
            features: [
                "AI University Matching (5 matches)",
                "Basic Profile Analysis",
                "Community Access",
                "Country Guides",
                "Email Support"
            ],
            cta: "Get Started",
            gradient: "from-neutral-500/10",
            popular: false
        },
        {
            name: "Pro",
            price: "$49",
            period: "/month",
            desc: "For serious applicants",
            features: [
                "Unlimited AI Matching",
                "Advanced Profile Optimization",
                "Document Review (SOP, LOR)",
                "Scholarship Finder",
                "Priority Support",
                "Success Stories Access",
                "Interview Prep Resources"
            ],
            cta: "Start Pro Trial",
            gradient: "from-blue-500/20",
            popular: true
        },
        {
            name: "Elite",
            price: "$199",
            period: "/month",
            desc: "Ivy League & Top 50 track",
            features: [
                "Everything in Pro",
                "1-on-1 Strategy Sessions",
                "Ex-Admissions Officer Review",
                "Research Position Guidance",
                "Publication Strategy",
                "Mock Interviews",
                "Dedicated Success Manager",
                "Guaranteed Response Time"
            ],
            cta: "Go Elite",
            gradient: "from-amber-500/20",
            popular: false
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
                        <Zap className="h-4 w-4" />
                        <span className="text-xs font-bold tracking-wider uppercase">Simple Pricing</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight leading-[1]">
                        Invest in Your <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400">Future</span>
                    </h1>

                    <p className="text-xl text-neutral-400 font-light max-w-2xl mx-auto leading-relaxed">
                        Choose the plan that fits your ambition. All plans include our core AI matching engine.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative p-8 md:p-10 rounded-2xl md:rounded-3xl bg-gradient-to-br ${plan.gradient} to-transparent border ${plan.popular ? 'border-blue-500/40' : 'border-white/10'} space-y-8 group hover:scale-105 transition-all`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-blue-500 border border-blue-400">
                                    <span className="text-xs font-bold text-white uppercase tracking-wider">Most Popular</span>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    {plan.name === "Elite" && <Crown className="h-6 w-6 text-amber-400" />}
                                    <h3 className="text-2xl font-display font-bold text-white tracking-tight">{plan.name}</h3>
                                </div>
                                <p className="text-neutral-400 font-light">{plan.desc}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-display font-black text-white">{plan.price}</span>
                                    {plan.period && <span className="text-neutral-500 font-semibold">{plan.period}</span>}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {plan.features.map((feature, j) => (
                                    <div key={j} className="flex items-start gap-3">
                                        <div className="h-5 w-5 shrink-0 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mt-0.5">
                                            <Check className="h-3 w-3 text-emerald-400" />
                                        </div>
                                        <span className="text-neutral-300 font-light text-sm leading-relaxed">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href="/signup">
                                <button className={`w-full h-12 rounded-full font-bold text-sm uppercase tracking-wider transition-all ${plan.popular
                                    ? 'bg-white text-black hover:scale-105 shadow-xl shadow-white/10'
                                    : 'border-2 border-white/10 hover:bg-white hover:text-black'
                                    }`}>
                                    {plan.cta}
                                </button>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-white/10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />

                    <div className="relative z-10 text-center space-y-8">
                        <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight">
                            Still Have Questions?
                        </h2>
                        <p className="text-neutral-400 font-light text-lg max-w-2xl mx-auto">
                            All plans come with a 14-day money-back guarantee. Try risk-free and see the difference AI-powered guidance makes.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 pt-6">
                            <Link href="/signup" className="w-full sm:w-auto">
                                <button className="w-full inline-flex items-center justify-center gap-3 px-10 h-14 rounded-full bg-white text-black font-bold hover:scale-105 transition-all text-sm uppercase tracking-wider shadow-xl shadow-white/10">
                                    Start Free Trial
                                    <Sparkles className="h-4 w-4" />
                                </button>
                            </Link>
                            <Link href="/community" className="w-full sm:w-auto">
                                <button className="w-full px-10 h-14 rounded-full border-2 border-white/10 hover:bg-white hover:text-black transition-all font-bold text-sm uppercase tracking-wider">
                                    Talk to Community
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
