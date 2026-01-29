'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Scale } from 'lucide-react';
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
import { Footer } from '@/components/ui/footer';

export default function TermsPage() {
    const [active, setActive] = useState<string | null>(null);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white/10 relative overflow-hidden">
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

            <div className="max-w-3xl mx-auto px-6 py-16 md:py-24 relative z-10">
                <div className="space-y-4 mb-12 md:mb-16">
                    <div className="h-12 w-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Scale className="h-6 w-6 text-neutral-400" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight">Terms of Use</h1>
                    <p className="text-neutral-500 font-medium">Last Updated: January 28, 2025</p>
                </div>

                <div className="prose prose-invert max-w-none space-y-12">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">1. Protocol Engagement</h2>
                        <p className="text-neutral-400 leading-relaxed font-light italic">
                            By accessing AI Counsellor, you agree to engage with our intelligence models for ethical educational purposes. Any attempt to reverse-engineer our matching logic or automate data extraction is a violation of our architecture.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">2. Intelligence Disclosure</h2>
                        <p className="text-neutral-400 leading-relaxed font-light italic">
                            AI recommendations are probabilistic based on historical data. While we maintain a 96% accuracy rate, final admission decisions rest solely with the respective universities.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tight">3. User Responsibility</h2>
                        <p className="text-neutral-400 leading-relaxed font-light italic">
                            Users are responsible for the authenticity of the academic records provided. Submitting fraudulent data terminates your access to the AI Counsellor ecosystem immediately.
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </div>
    );
}
