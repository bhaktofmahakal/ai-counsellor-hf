"use client";
import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';

const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '255, 255, 255';
const DEFAULT_PARTICLE_COUNT = 12;

const cardData = [
    {
        gradient: 'linear-gradient(135deg, #0a0a0a 0%, #151515 100%)',
        title: 'Smart Match AI',
        description: 'Find your perfect university fit',
        label: 'AI Powered'
    },
    {
        gradient: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%)',
        title: 'Essay Architect',
        description: 'Craft compelling applications',
        label: 'Writing'
    },
    {
        gradient: 'linear-gradient(135deg, #0d0d0d 0%, #1e1e1e 100%)',
        title: 'Strategy Auditor',
        description: 'Optimize your profile',
        label: 'Planning'
    },
    {
        gradient: 'linear-gradient(135deg, #0e0e0e 0%, #202020 100%)',
        title: 'Interview Prep',
        description: 'Practice with AI simulations',
        label: 'Practice'
    },
    {
        gradient: 'linear-gradient(135deg, #0a0a0a 0%, #181818 100%)',
        title: 'Document Vault',
        description: 'Secure application storage',
        label: 'Security'
    },
    {
        gradient: 'linear-gradient(135deg, #0b0b0b 0%, #1c1c1c 100%)',
        title: 'Scholarship Finder',
        description: 'Discover funding opportunities',
        label: 'Financial Aid'
    }
];

const createParticleElement = (x: number, y: number, color = DEFAULT_GLOW_COLOR) => {
    const el = document.createElement('div');
    el.className = 'particle';
    el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
    return el;
};

const calculateSpotlightValues = (radius: number) => ({
    proximity: radius * 0.5,
    fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (
    card: HTMLElement,
    mouseX: number,
    mouseY: number,
    glow: number,
    radius: number
) => {
    const rect = card.getBoundingClientRect();
    const relativeX = ((mouseX - rect.left) / rect.width) * 100;
    const relativeY = ((mouseY - rect.top) / rect.height) * 100;

    card.style.setProperty('--glow-x', `${relativeX}%`);
    card.style.setProperty('--glow-y', `${relativeY}%`);
    card.style.setProperty('--glow-intensity', glow.toString());
    card.style.setProperty('--glow-radius', `${radius}px`);
};

// Particle Card with Stars
const ParticleCard = ({
    children,
    className = '',
    style,
    particleCount = DEFAULT_PARTICLE_COUNT,
    glowColor = DEFAULT_GLOW_COLOR,
}: {
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    particleCount?: number;
    glowColor?: string;
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const particlesRef = useRef<HTMLDivElement[]>([]);
    const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
    const isHoveredRef = useRef(false);
    const memoizedParticles = useRef<HTMLDivElement[]>([]);
    const particlesInitialized = useRef(false);

    const initializeParticles = useCallback(() => {
        if (particlesInitialized.current || !cardRef.current) return;

        const { width, height } = cardRef.current.getBoundingClientRect();
        memoizedParticles.current = Array.from({ length: particleCount }, () =>
            createParticleElement(Math.random() * width, Math.random() * height, glowColor)
        );
        particlesInitialized.current = true;
    }, [particleCount, glowColor]);

    const clearAllParticles = useCallback(() => {
        timeoutsRef.current.forEach(clearTimeout);
        timeoutsRef.current = [];

        particlesRef.current.forEach(particle => {
            gsap.to(particle, {
                scale: 0,
                opacity: 0,
                duration: 0.3,
                ease: 'back.in(1.7)',
                onComplete: () => {
                    particle.parentNode?.removeChild(particle);
                }
            });
        });
        particlesRef.current = [];
    }, []);

    const animateParticles = useCallback(() => {
        if (!cardRef.current || !isHoveredRef.current) return;

        if (!particlesInitialized.current) {
            initializeParticles();
        }

        memoizedParticles.current.forEach((particle, index) => {
            const timeoutId = setTimeout(() => {
                if (!isHoveredRef.current || !cardRef.current) return;

                const clone = particle.cloneNode(true) as HTMLDivElement;
                cardRef.current.appendChild(clone);
                particlesRef.current.push(clone);

                gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });

                gsap.to(clone, {
                    x: (Math.random() - 0.5) * 100,
                    y: (Math.random() - 0.5) * 100,
                    rotation: Math.random() * 360,
                    duration: 2 + Math.random() * 2,
                    ease: 'none',
                    repeat: -1,
                    yoyo: true
                });

                gsap.to(clone, {
                    opacity: 0.3,
                    duration: 1.5,
                    ease: 'power2.inOut',
                    repeat: -1,
                    yoyo: true
                });
            }, index * 100);

            timeoutsRef.current.push(timeoutId);
        });
    }, [initializeParticles]);

    useEffect(() => {
        if (!cardRef.current) return;

        const element = cardRef.current;

        const handleMouseEnter = () => {
            isHoveredRef.current = true;
            animateParticles();
        };

        const handleMouseLeave = () => {
            isHoveredRef.current = false;
            clearAllParticles();
        };

        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            isHoveredRef.current = false;
            element.removeEventListener('mouseenter', handleMouseEnter);
            element.removeEventListener('mouseleave', handleMouseLeave);
            clearAllParticles();
        };
    }, [animateParticles, clearAllParticles]);

    return (
        <div
            ref={cardRef}
            className={`${className} particle-container`}
            style={{ ...style, position: 'relative', overflow: 'hidden' }}
        >
            {children}
        </div>
    );
};

const GlobalSpotlight = ({
    gridRef,
    enabled = true,
    spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
    glowColor = DEFAULT_GLOW_COLOR
}: {
    gridRef: React.RefObject<HTMLDivElement>;
    enabled?: boolean;
    spotlightRadius?: number;
    glowColor?: string;
}) => {
    const spotlightRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!gridRef?.current || !enabled) return;

        const spotlight = document.createElement('div');
        spotlight.className = 'global-spotlight';
        spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
        document.body.appendChild(spotlight);
        spotlightRef.current = spotlight;

        const handleMouseMove = (e: MouseEvent) => {
            if (!spotlightRef.current || !gridRef.current) return;

            const section = gridRef.current.closest('.bento-section');
            const rect = section?.getBoundingClientRect();
            const mouseInside =
                rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

            const cards = gridRef.current.querySelectorAll('.magic-bento-card');

            if (!mouseInside) {
                gsap.to(spotlightRef.current, {
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.out'
                });
                cards.forEach(card => {
                    (card as HTMLElement).style.setProperty('--glow-intensity', '0');
                });
                return;
            }

            const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
            let minDistance = Infinity;

            cards.forEach(card => {
                const cardElement = card as HTMLElement;
                const cardRect = cardElement.getBoundingClientRect();
                const centerX = cardRect.left + cardRect.width / 2;
                const centerY = cardRect.top + cardRect.height / 2;
                const distance =
                    Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
                const effectiveDistance = Math.max(0, distance);

                minDistance = Math.min(minDistance, effectiveDistance);

                let glowIntensity = 0;
                if (effectiveDistance <= proximity) {
                    glowIntensity = 1;
                } else if (effectiveDistance <= fadeDistance) {
                    glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
                }

                updateCardGlowProperties(cardElement, e.clientX, e.clientY, glowIntensity, spotlightRadius);
            });

            gsap.to(spotlightRef.current, {
                left: e.clientX,
                top: e.clientY,
                duration: 0.1,
                ease: 'power2.out'
            });

            const targetOpacity =
                minDistance <= proximity
                    ? 0.8
                    : minDistance <= fadeDistance
                        ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
                        : 0;

            gsap.to(spotlightRef.current, {
                opacity: targetOpacity,
                duration: targetOpacity > 0 ? 0.2 : 0.5,
                ease: 'power2.out'
            });
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
        };
    }, [gridRef, enabled, spotlightRadius, glowColor]);

    return null;
};

const BentoCardGrid = ({ children, gridRef }: { children: React.ReactNode; gridRef: React.RefObject<HTMLDivElement> }) => (
    <div className="card-grid bento-section" ref={gridRef}>
        {children}
    </div>
);

const MagicBento = ({
    enableSpotlight = true,
    enableBorderGlow = true,
    enableStars = true,
    spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
    glowColor = DEFAULT_GLOW_COLOR,
    particleCount = DEFAULT_PARTICLE_COUNT,
}: {
    enableSpotlight?: boolean;
    enableBorderGlow?: boolean;
    enableStars?: boolean;
    spotlightRadius?: number;
    glowColor?: string;
    particleCount?: number;
}) => {
    const gridRef = useRef<HTMLDivElement>(null);

    return (
        <>
            {enableSpotlight && (
                <GlobalSpotlight
                    gridRef={gridRef}
                    enabled={enableSpotlight}
                    spotlightRadius={spotlightRadius}
                    glowColor={glowColor}
                />
            )}

            <BentoCardGrid gridRef={gridRef}>
                {cardData.map((card, index) => {
                    const baseClassName = `magic-bento-card magic-bento-card--text-autohide ${enableBorderGlow ? 'magic-bento-card--border-glow' : ''}`;

                    const CardWrapper = enableStars ? ParticleCard : 'div';
                    const wrapperProps = enableStars
                        ? {
                            className: baseClassName,
                            style: {
                                background: card.gradient,
                                ['--glow-color' as string]: glowColor
                            },
                            particleCount,
                            glowColor
                        }
                        : {
                            className: baseClassName,
                            style: {
                                background: card.gradient,
                                ['--glow-color' as string]: glowColor
                            }
                        };

                    return (
                        <CardWrapper key={index} {...wrapperProps}>
                            <div className="magic-bento-card__header">
                                <div className="magic-bento-card__label">{card.label}</div>
                            </div>
                            <div className="magic-bento-card__content">
                                <h2 className="magic-bento-card__title">{card.title}</h2>
                                <p className="magic-bento-card__description">{card.description}</p>
                            </div>
                        </CardWrapper>
                    );
                })}
            </BentoCardGrid>
        </>
    );
};

export default MagicBento;
