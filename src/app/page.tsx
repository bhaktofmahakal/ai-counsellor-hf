'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

// Icons
import {
  ArrowRight,
  Sparkles,
  Brain,
  Target,
  Globe,
  Zap,
  ShieldCheck,
  GraduationCap,
  Play,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertCircle,
  MessageSquare,
  Lock,
  ChevronDown,
  ChevronRight,
  Star,
  Search,
  Users,
  Award,
  Minus
} from 'lucide-react';

import {
  SiOpenai,
  SiNextdotjs,
  SiPrisma,
  SiTailwindcss,
  SiVercel,
  SiUpstash,
  SiGooglecloud
} from "react-icons/si";

// Dynamic Imports for Performance
const TextGenerateEffect = dynamic(() => import("@/components/ui/text-generate-effect").then(mod => mod.TextGenerateEffect), { ssr: false });
const AuroraBackground = dynamic(() => import('@/components/lightswind/aurora-background').then(mod => mod.AuroraBackground), { ssr: false });
const BentoGrid = dynamic(() => import('@/components/lightswind/bento-grid').then(mod => mod.BentoGrid), { ssr: false });
const SlidingLogoMarquee = dynamic(() => import('@/components/lightswind/sliding-logo-marquee').then(mod => mod.SlidingLogoMarquee), { ssr: false });
const ThreeDScrollTriggerContainer = dynamic(() => import('@/components/lightswind/threed-scroll-trigger').then(mod => mod.ThreeDScrollTriggerContainer), { ssr: false });
const ThreeDScrollTriggerRow = dynamic(() => import('@/components/lightswind/threed-scroll-trigger').then(mod => mod.ThreeDScrollTriggerRow), { ssr: false });
const LightRays = dynamic(() => import('@/components/lightswind/light-rays'), { ssr: false });

// Components
import { GradientButton } from '@/components/lightswind/gradient-button';
import { CountUp } from '@/components/lightswind/count-up';
import { ShinyText } from '@/components/lightswind/shiny-text';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/lightswind/accordion';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/lightswind/avatar';
import { Footer } from '@/components/ui/footer';

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu
} from '@/components/ui/resizable-navbar';

import { HoveredLink, Menu, MenuItem, ProductItem } from "@/components/ui/navbar-menu";
import { HeroParallax } from "@/components/ui/hero-parallax";
import { FlipWords } from "@/components/ui/flip-words";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import MagicBento from "@/components/ui/MagicBento";
import LogoLoop from "@/components/ui/LogoLoop";
import LiquidChrome from "@/components/ui/LiquidChrome";
import WebcamPixelGrid from "@/components/ui/webcam-pixel-grid";


const testimonials = [
  {
    name: "Aarav Sharma",
    role: "MS in CS, Stanford",
    content: "The AI match score was spot on! I got into my dream university with a 25% scholarship support that I didn't even know existed.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aarav"
  },
  {
    name: "Sofia Chen",
    role: "MBA, INSEAD",
    content: "Building my profile strategy was so much easier. The task list kept me on track through every single document submission.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia"
  },
  {
    name: "James Wilson",
    role: "PhD in Physics, MIT",
    content: "I was confused between UK and USA. The AI counsellor compared both based on my career goals and research interests instantly.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James"
  },
  {
    name: "Priya Patel",
    role: "Masters in Design, RCA",
    content: "Best thing happened to me. Free guidance that actually works. My portfolio review suggestions were invaluable!",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
  },
  {
    name: "Luca Rossi",
    role: "Robotics, ETH Zurich",
    content: "Highly accurate and very fast. I loved the seamless UI and the 24/7 availability of my AI mentor.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Luca"
  },
  {
    name: "Elena Gomez",
    role: "Public Policy, Oxford",
    content: "Truly democratizing education. I could never afford a $5000 consultant, but this AI gave me better results for free.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena"
  }
];

// --- Internal Components ---


const SectionHeader = ({ badge, title, subtitle, centered = true }: { badge?: string, title: string, subtitle?: string, centered?: boolean }) => (
  <div className={cn("space-y-6 mb-20", centered && "text-center")}>
    {badge && (
      <span className="inline-block px-4 py-2 rounded-full bg-white/5 border border-white/5 text-white/50 text-[10px] font-black uppercase tracking-[0.3em]">
        {badge}
      </span>
    )}
    <h2 className="text-4xl md:text-6xl font-display font-medium text-white tracking-tighter leading-[1.1] whitespace-pre-line">
      {title}
    </h2>
    {subtitle && <p className={cn("text-lg text-neutral-500 font-light max-w-2xl leading-relaxed", centered ? "mx-auto" : "")}>{subtitle}</p>}
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, colorClass }: { icon: any, title: string, description: string, colorClass: string }) => (
  <div className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.08] transition-all duration-300">
    <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg bg-white/10")}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
    <p className="text-slate-400 leading-relaxed font-light">{description}</p>
    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
      <ArrowRight className="h-5 w-5 text-white" />
    </div>
  </div>
);

const techLogos = [
  { node: <SiOpenai />, title: "OpenAI" },
  { node: <SiNextdotjs />, title: "Next.js" },
  { node: <SiPrisma />, title: "Prisma" },
  { node: <SiTailwindcss />, title: "Tailwind CSS" },
  { node: <SiVercel />, title: "Vercel" },
  { node: <SiUpstash />, title: "Upstash" },
  { node: <SiGooglecloud />, title: "Groq" },
];

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  const navItems = [
    { name: "Features", link: "#features" },
    { name: "How it Works", link: "#how-it-works" },
    { name: "Success Stories", link: "#testimonials" },
  ];

  const trustLogos = [
    { id: '1', content: <div className="text-2xl font-bold text-neutral-600 mx-8">HARVARD</div> },
    { id: '2', content: <div className="text-2xl font-bold text-neutral-600 mx-8">OXFORD</div> },
    { id: '3', content: <div className="text-2xl font-bold text-neutral-600 mx-8">STANFORD</div> },
    { id: '4', content: <div className="text-2xl font-bold text-neutral-600 mx-8">MIT</div> },
    { id: '5', content: <div className="text-2xl font-bold text-neutral-600 mx-8">CAMBRIDGE</div> },
    { id: '6', content: <div className="text-2xl font-bold text-neutral-600 mx-8">ETHzurich</div> },
    { id: '7', content: <div className="text-2xl font-bold text-neutral-600 mx-8">MaxPlanck</div> },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/10 overflow-x-hidden" suppressHydrationWarning>
      {/* Navigation */}
      <Navbar className="top-4">
        <NavBody>
          <NavbarLogo>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-10 w-10 rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shadow-lg shadow-white/5 group-hover:scale-110 transition-transform relative">
                <Image src="/logo.png" alt="AI Counsellor Logo" fill sizes="40px" className="object-cover" priority />
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

        <MobileNav>
          <MobileNavHeader>
            <Link href="/" className="flex items-center gap-2 group">
              <div className="h-8 w-8 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shadow-lg shadow-white/5 relative">
                <Image src="/logo.png" alt="AI Counsellor Logo" fill sizes="32px" className="object-cover" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-white">AI Counsellor</span>
            </Link>
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)}>
            {navItems.map((item, idx) => (
              <a
                key={`mobile-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-lg font-medium text-neutral-300 hover:text-white"
              >
                {item.name}
              </a>
            ))}
            <hr className="border-white/5 w-full" />
            <div className="flex flex-col gap-4 w-full">
              <Link href="/login" className="w-full">
                <NavbarButton variant="secondary" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>Sign In</NavbarButton>
              </Link>
              <Link href="/signup" className="w-full">
                <NavbarButton variant="primary" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>Get Started</NavbarButton>
              </Link>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Dark Dot Matrix Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: '#000000',
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px),
              radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)
            `,
            backgroundSize: '10px 10px',
            imageRendering: 'pixelated',
            opacity: 0.4
          }}
        />
        <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
          <LightRays
            raysOrigin="top-center"
            raysColor="#ffffff"
            raysSpeed={0.2}
            lightSpread={0.9}
            rayLength={3.5}
            followMouse={true}
            mouseInfluence={0.05}
          />
        </div>
        <AuroraBackground className="!bg-black absolute inset-0 opacity-40">
          <div className="relative z-10 max-w-[1500px] mx-auto px-4 md:px-6 lg:px-12 w-full pt-32 pb-8 md:pt-44">
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-24 items-center">
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white backdrop-blur-md">
                  <Sparkles className="h-3 w-3 text-neutral-500" />
                  <span className="text-[9px] font-bold tracking-[0.2em] uppercase">Ivy League Mastery</span>
                </div>

                <div className="space-y-3">


                  <h1 className="text-4xl md:text-5xl lg:text-[4.2rem] font-display font-black leading-[1] tracking-[-0.04em] text-white">
                    Unlock Your <br />
                    <FlipWords
                      words={["Global", "Ivy", "Strategic", "Dream"]}
                      className="text-white px-0"
                    /> Future
                  </h1>
                </div>

                <div className="max-w-xl">
                  <TextGenerateEffect
                    words="Elite AI-driven guidance for world-class education. Strategic matching and profile optimization."
                    className="text-base md:text-lg text-neutral-400 font-light leading-relaxed max-w-lg"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start pt-4">
                  <Link href="/signup" className="w-full sm:w-auto">
                    <HoverBorderGradient
                      containerClassName="rounded-full w-full"
                      as="button"
                      className="bg-white text-black flex items-center justify-center space-x-2 h-12 px-8 text-sm font-black w-full"
                    >
                      <span>Begin Strategy</span>
                      <ArrowRight className="h-4 w-4" />
                    </HoverBorderGradient>
                  </Link>
                  <button className="flex items-center justify-center gap-2 px-6 h-12 rounded-full border border-neutral-800 hover:bg-neutral-900 transition-all text-white text-[12px] font-bold group w-full sm:w-auto" suppressHydrationWarning>
                    <div className="h-6 w-6 rounded-full bg-neutral-900 flex items-center justify-center group-hover:bg-white transition-all">
                      <Play className="h-2 w-2 fill-current text-white group-hover:text-black" />
                    </div>
                    Strategy Audit
                  </button>
                </div>

                <div className="pt-4 flex items-center gap-6 border-t border-white/5">
                  {[
                    { val: "96%", label: "Accuracy" },
                    { val: "5K+", label: "Success" },
                    { val: "120+", label: "Matches" }
                  ].map((s, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                      <span className="text-xl font-black text-white tracking-tight">{s.val}</span>
                      <span className="text-[8px] uppercase tracking-[0.2em] text-neutral-600 font-bold">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative group perspective-1000 block">
                <div className="relative w-full aspect-square max-w-[320px] md:max-w-[420px] mx-auto mt-12 lg:mt-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent blur-3xl opacity-20 -z-10" />
                  <Image
                    src="/images/hero-sculpture.png"
                    alt="Strategic AI Guidance"
                    fill
                    sizes="(max-width: 768px) 320px, 420px"
                    className="object-contain filter drop-shadow-[0_0_60px_rgba(255,255,255,0.15)] group-hover:scale-105 transition-transform duration-1000 [mask-image:linear-gradient(to_right,transparent,black_15%)]"
                    priority
                  />
                  <div className="absolute -bottom-10 -left-10 p-6 glass-card rounded-3xl border border-white/10 backdrop-blur-3xl shadow-2xl max-w-[260px] hidden md:block">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Live Strategy detected</span>
                    </div>
                    <h5 className="text-white text-2xl font-black mb-1">98% Fit</h5>
                    <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-wider leading-relaxed">Matches global CS benchmarks</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AuroraBackground>
      </section>

      {/* Trust Bar */}
      <section className="py-10 border-t border-b border-white/5 bg-black">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12">
          <p className="text-center text-xs font-bold text-neutral-600 uppercase tracking-[0.2em] mb-8">Guided Students to World Class Institutions</p>
          <SlidingLogoMarquee items={trustLogos} speed={40} showControls={false} />
        </div>
      </section>




      {/* Showcase Section - Hero Parallax */}
      <section className="bg-black">
        <HeroParallax products={[
          // US - Ivy League & Top Tier
          { title: "Harvard University", link: "/signup", thumbnail: "https://images.unsplash.com/photo-1576048099943-2bd9d4513ee2?q=80&w=1200&auto=format&fit=crop" },
          { title: "Stanford University", link: "/signup", thumbnail: "https://images.unsplash.com/photo-1592066403149-ea7826372134?q=80&w=1200&auto=format&fit=crop" },
          { title: "MIT", link: "/signup", thumbnail: "https://images.unsplash.com/photo-1520626330362-ec7f12b7a9de?q=80&w=1200&auto=format&fit=crop" },
          { title: "Columbia University", link: "/signup", thumbnail: "https://images.unsplash.com/photo-1621213320261-244247547514?q=80&w=1200&auto=format&fit=crop" },
          { title: "Yale University", link: "/signup", thumbnail: "https://images.unsplash.com/photo-1560619176-793617150c9b?q=80&w=1200&auto=format&fit=crop" },

          // UK - Oxbridge & London
          { title: "University of Oxford", link: "/signup", thumbnail: "https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=1200&auto=format&fit=crop" },
          { title: "University of Cambridge", link: "/signup", thumbnail: "https://images.unsplash.com/photo-1583307511394-bba91b7d5901?q=80&w=1200&auto=format&fit=crop" },
          { title: "Imperial College London", link: "/signup", thumbnail: "https://images.unsplash.com/photo-1568225574044-7f154ea0130d?q=80&w=1200&auto=format&fit=crop" },

          // Global
          { title: "ETH Zurich", link: "/signup", thumbnail: "https://images.unsplash.com/photo-1610444583733-1ec1d5dc3770?q=80&w=1200&auto=format&fit=crop" },
          { title: "University of Toronto", link: "/signup", thumbnail: "https://images.unsplash.com/photo-1624796791986-e2a275f92265?q=80&w=1200&auto=format&fit=crop" },
          { title: "UCLA", link: "/signup", thumbnail: "https://images.unsplash.com/photo-1604315227441-df071379766d?q=80&w=1200&auto=format&fit=crop" },
          { title: "Cornell University", link: "/signup", thumbnail: "https://images.unsplash.com/photo-1533633003050-8b0105fd4028?q=80&w=1200&auto=format&fit=crop" },
          { title: "University of Chicago", link: "/signup", thumbnail: "https://images.unsplash.com/photo-1581090122319-8fab9c28e000?q=80&w=1200&auto=format&fit=crop" },
          { title: "Princeton University", link: "/signup", thumbnail: "https://images.unsplash.com/photo-1621360814652-3d5f3060699d?q=80&w=1200&auto=format&fit=crop" },
          { title: "Caltech", link: "/signup", thumbnail: "https://images.unsplash.com/photo-1595113316349-9fa4ee24f884?q=80&w=1200&auto=format&fit=crop" },
        ]} />

      </section>

      {/* Magic Bento Grid - Platform Features */}
      <section className="py-24 relative overflow-hidden bg-black">
        {/* Black Grid with White Dots Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "#000000",
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px),
              radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "16px 16px, 16px 16px, 16px 16px",
            backgroundPosition: "0 0, 0 0, 0 0",
          }}
        />
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 px-4 tracking-tight">
              Your Complete Application Suite
            </h2>
            <p className="text-neutral-400 text-base md:text-lg max-w-2xl mx-auto px-6 font-light">
              Everything you need to craft a winning application, powered by AI
            </p>
          </div>
          <MagicBento
            enableSpotlight={true}
            enableBorderGlow={true}
            enableStars={true}
            particleCount={15}
            spotlightRadius={400}
            glowColor="255, 255, 255"
          />
        </div>
      </section>

      {/* Solution Section - Modern Grid */}
      <section id="features" className="py-32 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
          <LiquidChrome
            baseColor={[0.05, 0.05, 0.05]}
            speed={0.03}
            amplitude={0.2}
            interactive={false}
          />
        </div>
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12 relative z-10">
          <SectionHeader
            badge="The Solution"
            title="Meet Your AI Counsellor"
            subtitle="Your 24/7 study abroad expert that understands you, guides you, and acts for you."
          />

          <div className="grid md:grid-cols-3 gap-6 mt-16">
            {[
              {
                icon: Target,
                title: "Smart Profile Analysis",
                desc: "Our AI analyzes your academics, extracurriculars, budget, and career goals to create a high-precision strategy tailored to YOU.",
                badge: "Analysis"
              },
              {
                icon: Brain,
                title: "Intelligent Matching",
                desc: "Instantly find Dream, Target, and Safe options with real-time acceptance odds and transparent cost projections.",
                badge: "Matching"
              },
              {
                icon: CheckCircle2,
                title: "Action-Driven Guidance",
                desc: "From personalized SOP structure to visa checklists, we generate a custom roadmap of tasks to keep you on track.",
                badge: "Action"
              }
            ].map((feature, i) => (
              <div key={i} className="group relative p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all duration-500 overflow-hidden">
                {/* Subtle Grid Overlay */}
                <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity"
                  style={{
                    backgroundImage: `linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }}
                />

                <div className="relative z-10">
                  <div className="mb-10 h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors duration-500">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>

                  <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mb-6">
                    {feature.badge}
                  </div>

                  <h3 className="text-2xl font-display font-medium text-white mb-4 tracking-tight">{feature.title}</h3>
                  <p className="text-neutral-500 text-[15px] leading-relaxed font-light">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Showcase - Moved Here */}
      <section className="py-20 border-y border-white/5 bg-black/40">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12 overflow-hidden">
          <p className="text-center text-[10px] font-black text-slate-600 uppercase tracking-[0.5em] mb-12">The Intelligence Engine</p>
          <div className="opacity-40 grayscale hover:grayscale-0 transition-opacity duration-700">
            <LogoLoop
              logos={techLogos}
              speed={30}
              gap={100}
              logoHeight={28}
              direction="left"
              fadeOut={true}
              fadeOutColor="#000000"
              pauseOnHover={true}
            />
          </div>
        </div>
      </section>

      {/* Workflow - Steps Redesigned */}
      <section id="how-it-works" className="py-32 relative overflow-hidden border-t border-white/5 bg-[#0a0a0a]">
        {/* Dark Dot Matrix Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: '#0a0a0a',
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px),
              radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)
            `,
            backgroundSize: '12px 12px',
            imageRendering: 'pixelated',
          }}
        />
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center">
            <SectionHeader
              badge="Workflow"
              title="Your Journey in 4 Simple Steps"
            />
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                step: "01",
                title: "Build Your Profile",
                desc: "Tell us about your background and dreams. It takes less than 5 minutes."
              },
              {
                step: "02",
                title: "Discover Universities",
                desc: "Our AI brain curates a list of universities where you have the highest probability of success."
              },
              {
                step: "03",
                title: "Lock Your Choices",
                desc: "Commit to your top picks to unlock specialized resources and specific application guidance."
              },
              {
                step: "04",
                title: "Apply & Succeed",
                desc: "Follow your AI-generated task list. Submit with confidence and track every milestone."
              }
            ].map((item, i) => (
              <div key={i} className="relative p-8 md:p-12 rounded-[2rem] md:rounded-[2.5rem] bg-white/[0.01] border border-white/5 hover:border-white/10 transition-all duration-500 group overflow-hidden">
                <div className="text-7xl font-display font-black text-white/[0.03] group-hover:text-white/5 transition-colors absolute bottom-4 right-6 leading-none pointer-events-none select-none">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-4 tracking-tight relative z-10">{item.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed font-light max-w-[240px] relative z-10">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats - Minimal Metric Bar */}
      <section className="py-24 relative overflow-hidden border-y border-white/5 bg-black">
        <div className="max-w-[1500px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-0">
            {[
              { label: "Success Stories", value: 5000, prefix: "", suffix: "+", sub: "Guided Globally" },
              { label: "Decision Accuracy", value: 96, prefix: "", suffix: "%", sub: "AI Models" },
              { label: "Platform Fee", value: 0, prefix: "$", suffix: "", sub: "Always Free" },
              { label: "AI Decisions", value: 120, prefix: "", suffix: "+/min", sub: "Instant Process" },
            ].map((stat, i) => (
              <div key={i} className="relative flex flex-col items-center group px-4 md:px-8 border-r border-white/5 last:border-r-0 md:even:border-r md:last:border-r-0">
                <div className="flex flex-col items-center text-center">
                  <div className="text-5xl md:text-6xl font-display font-medium text-white mb-3 tracking-tighter">
                    {stat.prefix}<CountUp value={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-1">
                    {stat.label}
                  </p>
                  <p className="text-[10px] font-medium text-neutral-600 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {stat.sub}
                  </p>
                </div>
                {/* Subtle Hover Glow */}
                <div className="absolute inset-0 bg-white/[0.01] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table - Clean Modern UI */}
      <section className="py-32 relative overflow-hidden border-y border-white/5 bg-white/[0.01]">
        <div className="absolute inset-0 z-0 pointer-events-none opacity-10">
          <LiquidChrome
            baseColor={[0.05, 0.05, 0.05]}
            speed={0.04}
            amplitude={0.3}
            interactive={true}
          />
        </div>
        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <SectionHeader
            title="Beyond Traditional Consulting"
            subtitle="Why thousands of students are switching to our AI model."
          />

          <div className="mt-20 overflow-x-auto rounded-[3rem] border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="p-6 md:p-10 text-[10px] md:text-xs font-black text-neutral-500 uppercase tracking-widest">Efficiency Feature</th>
                  <th className="p-6 md:p-10 text-[10px] md:text-xs font-black text-neutral-500 uppercase tracking-widest text-center">Traditional</th>
                  <th className="p-6 md:p-10 text-[10px] md:text-xs font-black text-white uppercase tracking-widest text-center bg-white/5">AI Counsellor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { f: "Consultation Cost", t: "$2,000+", a: "FREE" },
                  { f: "Support Hours", t: "9-5 Weekdays", a: "24/7/365" },
                  { f: "Processing Speed", t: "Days to Weeks", a: "Instant" },
                  { f: "Decision Accuracy", t: "Human Intuition", a: "Data-Driven (96%)" },
                  { f: "Personalization", t: "General Templates", a: "Extreme Custom" },
                ].map((row, i) => (
                  <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="p-6 md:p-10 text-white font-bold text-sm md:text-lg">{row.f}</td>
                    <td className="p-6 md:p-10 text-neutral-600 text-center font-medium text-xs md:text-base">{row.t}</td>
                    <td className="p-6 md:p-10 text-white text-center font-black bg-white/[0.02] text-xs md:text-base">
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                        {row.a}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-16">
          <SectionHeader
            badge="Testimonials"
            title="Voices of Success"
            subtitle="Thousands of students are already building their futures with AI Counsellor."
          />
        </div>

        <ThreeDScrollTriggerContainer className="flex flex-col gap-8">
          <ThreeDScrollTriggerRow baseVelocity={-2} direction={1}>
            {testimonials.slice(0, 3).map((t, i) => (
              <div key={i} className="mx-4 p-6 md:p-8 rounded-[2rem] md:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm w-[300px] md:w-[400px] shrink-0">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-12 w-12 ring-2 ring-blue-500/20">
                    <AvatarImage src={t.avatar} alt={t.name} />
                    <AvatarFallback>{t.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-white font-bold">{t.name}</h4>
                    <p className="text-blue-400 text-xs font-medium uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
                <p className="text-slate-400 font-light leading-relaxed">"{t.content}"</p>
                <div className="mt-6 flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />)}
                </div>
              </div>
            ))}
          </ThreeDScrollTriggerRow>

          <ThreeDScrollTriggerRow baseVelocity={2} direction={-1}>
            {testimonials.slice(3, 6).map((t, i) => (
              <div key={i} className="mx-4 p-6 md:p-8 rounded-[2rem] md:rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm w-[300px] md:w-[400px] shrink-0">
                <div className="flex items-center gap-4 mb-6">
                  <Avatar className="h-12 w-12 ring-2 ring-white/10">
                    <AvatarImage src={t.avatar} alt={t.name} />
                    <AvatarFallback>{t.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="text-white font-bold">{t.name}</h4>
                    <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
                <p className="text-slate-400 font-light leading-relaxed">"{t.content}"</p>
                <div className="mt-6 flex gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />)}
                </div>
              </div>
            ))}
          </ThreeDScrollTriggerRow>
        </ThreeDScrollTriggerContainer>
      </section>

      {/* FAQ - Clean Monochrome */}
      <section className="py-32 relative overflow-hidden">
        {/* Dark Dot Matrix Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: '#0a0a0a',
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px),
              radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)
            `,
            backgroundSize: '10px 10px',
            imageRendering: 'pixelated',
          }}
        />

        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <span className="text-white/60 text-sm font-semibold uppercase tracking-wider">FAQ</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Common Questions
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Everything you need to know about our platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Question 1 */}
            <div className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/[0.04]">
              <h3 className="text-xl font-bold text-white mb-3">
                Is the AI counsellor really free?
              </h3>
              <p className="text-neutral-400 leading-relaxed mb-4">
                Yes! Our core mission is to democratize elite education guidance. The AI counsellor is completely free to use for university discovery and application planning.
              </p>
              <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
                <div className="w-1 h-1 rounded-full bg-white/60" />
                <span>100% Free Forever</span>
              </div>
            </div>

            {/* Question 2 */}
            <div className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/[0.04]">
              <h3 className="text-xl font-bold text-white mb-3">
                How accurate are the recommendations?
              </h3>
              <p className="text-neutral-400 leading-relaxed mb-4">
                We analyze millions of historical data points, including GPA, GRE/TOEFL scores, and acceptance records. Our proprietary algorithm has a 96% accuracy rate in predicting admission outcomes.
              </p>
              <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
                <div className="w-1 h-1 rounded-full bg-white/60" />
                <span>96% Accuracy Rate</span>
              </div>
            </div>

            {/* Question 3 */}
            <div className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/[0.04]">
              <h3 className="text-xl font-bold text-white mb-3">
                Which countries do you support?
              </h3>
              <p className="text-neutral-400 leading-relaxed mb-4">
                Currently, we have complete databases for USA, UK, Canada, Germany, Australia, and Italy. We are adding 5 new countries every quarter.
              </p>
              <div className="flex flex-wrap gap-2">
                {['USA', 'UK', 'Canada', 'Germany', 'Australia', 'Italy'].map((country) => (
                  <span key={country} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-xs font-medium">
                    {country}
                  </span>
                ))}
              </div>
            </div>

            {/* Question 4 */}
            <div className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-300 hover:bg-white/[0.04]">
              <h3 className="text-xl font-bold text-white mb-3">
                How fast can I get started?
              </h3>
              <p className="text-neutral-400 leading-relaxed mb-4">
                Sign up in under 2 minutes. No credit card required. Get instant access to our AI counsellor, university database, and application tools. Start your journey today!
              </p>
              <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
                <div className="w-1 h-1 rounded-full bg-white/60" />
                <span>2 Minute Setup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Clean Monochrome */}
      <section className="py-32 relative overflow-hidden">
        {/* Dark Dot Matrix Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: '#0a0a0a',
            backgroundImage: `
              radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px),
              radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)
            `,
            backgroundSize: '10px 10px',
            imageRendering: 'pixelated',
          }}
        />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="relative">
            {/* Subtle Glow */}
            <div className="absolute -inset-1 bg-white/5 rounded-[4rem] blur-2xl" />

            {/* Main Card */}
            <div className="relative p-8 md:p-16 rounded-[2.5rem] md:rounded-[3.5rem] bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
              {/* Decorative Grid Overlay */}
              <div className="absolute inset-0 opacity-30"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                    linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
                  `,
                  backgroundSize: "40px 40px",
                }}
              />

              {/* Content */}
              <div className="relative z-10 text-center space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                  <span className="text-white/60 text-sm font-semibold uppercase tracking-wider">Join 5,000+ Students</span>
                </div>

                {/* Heading */}
                <h2 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight leading-[1.1]">
                  Start Your Global Journey
                  <br />
                  <span className="text-white/80">
                    with AI Today
                  </span>
                </h2>

                {/* Description */}
                <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                  Get instant access to our AI counsellor, university database, and application tools.
                  <span className="text-white"> It's free, fast, and 24/7.</span>
                </p>

                {/* Stats */}
                <div className="flex flex-wrap justify-center gap-8 md:gap-12 pt-4">
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">96%</div>
                    <div className="text-neutral-500 text-sm">Accuracy Rate</div>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">5K+</div>
                    <div className="text-neutral-500 text-sm">Active Students</div>
                  </div>
                  <div className="w-px bg-white/10" />
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">24/7</div>
                    <div className="text-neutral-500 text-sm">AI Support</div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/signup">
                    <button className="group relative px-12 h-16 bg-white text-black font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 overflow-hidden" suppressHydrationWarning>
                      <span className="relative z-10 flex items-center gap-2">
                        Get Started Free
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </span>
                    </button>
                  </Link>
                  <Link href="/demo">
                    <button className="px-12 h-16 bg-white/5 text-white font-bold rounded-full border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300" suppressHydrationWarning>
                      Watch Demo
                    </button>
                  </Link>
                </div>

                {/* Trust Signals */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-neutral-500">
                    <div className="w-1 h-1 rounded-full bg-white/60" />
                    <span>No credit card required</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 rounded-full bg-neutral-700" />
                  <div className="flex items-center gap-2 text-neutral-500">
                    <div className="w-1 h-1 rounded-full bg-white/60" />
                    <span>2 minute setup</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 rounded-full bg-neutral-700" />
                  <div className="flex items-center gap-2 text-neutral-500">
                    <div className="w-1 h-1 rounded-full bg-white/60" />
                    <span>Free forever</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Newsletter Section */}
      <section className="py-24 relative overflow-hidden border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="p-8 md:p-16 rounded-[2rem] md:rounded-[3rem] bg-white/[0.01] border border-white/5 backdrop-blur-3xl text-center space-y-8 group hover:border-white/10 transition-all duration-500" suppressHydrationWarning>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 mb-2">
              <span className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em]">Stay Ahead</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-black text-white tracking-tight">
              The Admissions Letter
            </h2>
            <p className="text-neutral-500 text-lg max-w-xl mx-auto font-light">
              Join 10,000+ students receiving the latest Ivy League trends, scholarship alerts, and AI hacks every week.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full sm:w-80 h-16 rounded-full bg-white/5 border border-white/10 px-8 text-white focus:outline-none focus:border-white/20 transition-all text-sm font-medium"
                suppressHydrationWarning
              />
              <button className="h-16 px-10 rounded-full bg-white text-black font-black text-sm hover:scale-105 transition-all shadow-xl shadow-white/10" suppressHydrationWarning>
                Subscribe
              </button>
            </div>
            <p className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">
              Zero noise. Just intelligence.
            </p>
          </div>
        </div>
      </section>

      <Footer />

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div >
  );
}