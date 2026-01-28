"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const LogoLoop = ({
    logos,
    items,
    direction = "left",
    speed = "fast",
    pauseOnHover = true,
    className,
    ...props
}: {
    logos?: { icon?: React.ReactNode; node?: React.ReactNode; name?: string; title?: string }[];
    items?: { icon: React.ReactNode; name: string }[];
    direction?: "left" | "right";
    speed?: "fast" | "normal" | "slow" | number;
    pauseOnHover?: boolean;
    className?: string;
    [key: string]: any;
}) => {
    const displayItems = logos
        ? logos.map(l => ({ icon: l.icon || l.node, name: l.name || l.title || "" }))
        : (items || []);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const scrollerRef = React.useRef<HTMLUListElement>(null);

    useEffect(() => {
        addAnimation();
    }, []);
    const [start, setStart] = useState(false);
    function addAnimation() {
        if (containerRef.current && scrollerRef.current) {
            const scrollerContent = Array.from(scrollerRef.current.children);

            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                if (scrollerRef.current) {
                    scrollerRef.current.appendChild(duplicatedItem);
                }
            });

            getDirection();
            getSpeed();
            setStart(true);
        }
    }
    const getDirection = () => {
        if (containerRef.current) {
            if (direction === "left") {
                containerRef.current.style.setProperty(
                    "--animation-direction",
                    "forwards"
                );
            } else {
                containerRef.current.style.setProperty(
                    "--animation-direction",
                    "reverse"
                );
            }
        }
    };
    const getSpeed = () => {
        if (containerRef.current) {
            if (typeof speed === "number") {
                containerRef.current.style.setProperty("--animation-duration", `${speed}s`);
            } else if (speed === "fast") {
                containerRef.current.style.setProperty("--animation-duration", "20s");
            } else if (speed === "normal") {
                containerRef.current.style.setProperty("--animation-duration", "40s");
            } else {
                containerRef.current.style.setProperty("--animation-duration", "80s");
            }
        }
    };
    return (
        <div
            ref={containerRef}
            className={cn(
                "scroller relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
                className
            )}
        >
            <ul
                ref={scrollerRef}
                className={cn(
                    "flex min-w-full shrink-0 gap-8 py-4 w-max flex-nowrap",
                    start && "animate-scroll ",
                    pauseOnHover && "hover:[animation-play-state:paused]"
                )}
            >
                {displayItems.map((item, idx) => (
                    <li
                        className="w-[150px] md:w-[200px] max-w-full relative rounded-2xl border border-b-0 flex-shrink-0 border-slate-800 px-8 py-6"
                        key={item.name + idx}
                    >
                        <div className="flex flex-col items-center justify-center gap-4">
                            <div className="text-4xl text-slate-500 hover:text-white transition-colors duration-300">
                                {item.icon}
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-600 text-center">
                                {item.name}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default LogoLoop;