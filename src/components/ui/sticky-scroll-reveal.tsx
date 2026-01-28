"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const StickyScroll = ({
    content,
    contentClassName,
}: {
    content: {
        title: string;
        description: string;
        content?: React.ReactNode | any;
    }[];
    contentClassName?: string;
}) => {
    const [activeCard, setActiveCard] = React.useState(0);
    const ref = useRef<any>(null);

    // Use window-based scrolling for a smoother, native feel
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"],
    });

    const cardLength = content.length;

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        const cardsBreakpoints = content.map((_, index) => index / cardLength);
        const closestBreakpointIndex = cardsBreakpoints.reduce(
            (acc, breakpoint, index) => {
                const distance = Math.abs(latest - breakpoint);
                if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
                    return index;
                }
                return acc;
            },
            0,
        );
        setActiveCard(closestBreakpointIndex);
    });

    return (
        <motion.div
            className="relative flex justify-center space-x-10 rounded-3xl p-10 bg-black max-w-[1500px] mx-auto"
            ref={ref}
        >
            <div className="div relative flex items-start px-4 w-full">
                <div className="max-w-xl w-full">
                    {content.map((item, index) => (
                        <div key={item.title + index} className="my-20 min-h-[70vh] flex flex-col justify-center">
                            <motion.h2
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: activeCard === index ? 1 : 0.3,
                                }}
                                className="text-4xl font-bold text-white font-display mb-8"
                            >
                                {item.title}
                            </motion.h2>
                            <motion.p
                                initial={{
                                    opacity: 0,
                                }}
                                animate={{
                                    opacity: activeCard === index ? 1 : 0.3,
                                }}
                                className="text-xl leading-relaxed text-neutral-400 font-light max-w-lg"
                            >
                                {item.description}
                            </motion.p>

                            {/* Mobile: Show image inline */}
                            <div className="block lg:hidden mt-8 w-full h-80 rounded-2xl overflow-hidden border border-white/10 bg-neutral-900">
                                {item.content}
                            </div>
                        </div>
                    ))}
                    {/* Bottom spacer to allow scrolling past the last item */}
                    <div className="h-40" />
                </div>
            </div>

            {/* Visuals Column: Sticky relative to window */}
            <div
                className={cn(
                    "hidden lg:block h-[500px] w-[500px] sticky top-32 overflow-hidden rounded-3xl bg-neutral-900 border border-white/10 shadow-2xl backdrop-blur-3xl transition-colors duration-500",
                    contentClassName,
                )}
            >
                {content[activeCard].content ?? null}
            </div>
        </motion.div>
    );
};
