"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const transition = {
    type: "spring",
    mass: 0.5,
    damping: 11.5,
    stiffness: 100,
    restDelta: 0.001,
    restSpeed: 0.001,
};

export const MenuItem = ({
    setActive,
    active,
    item,
    children,
}: {
    setActive: (item: string) => void;
    active: string | null;
    item: string;
    children?: React.ReactNode;
}) => {
    return (
        <div onMouseEnter={() => setActive(item)} className="relative ">
            <motion.p
                transition={{ duration: 0.3 }}
                className="cursor-pointer text-neutral-400 hover:text-white transition-opacity"
            >
                {item}
            </motion.p>
            {active !== null && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={transition}
                >
                    {active === item && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 pt-8">
                            <motion.div
                                transition={transition}
                                layoutId="active"
                                className="bg-black/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                            >
                                <motion.div
                                    layout
                                    className="w-max h-full p-4"
                                >
                                    {children}
                                </motion.div>
                            </motion.div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export const Menu = ({
    setActive,
    children,
    className,
}: {
    setActive: (item: string | null) => void;
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <nav
            onMouseLeave={() => setActive(null)}
            className={cn(
                "relative rounded-full border border-white/10 bg-black/40 backdrop-blur-md shadow-input flex justify-center space-x-4 px-8 py-6",
                className
            )}
        >
            {children}
        </nav>
    );
};

export const ProductItem = ({
    title,
    description,
    href,
    src,
}: {
    title: string;
    description: string;
    href: string;
    src: string;
}) => {
    return (
        <Link href={href} className="flex space-x-2 p-2 rounded-xl hover:bg-white/5 transition-colors">
            <img
                src={src}
                width={140}
                height={70}
                alt={title}
                className="shrink-0 rounded-md shadow-2xl border border-white/5"
            />
            <div>
                <h4 className="text-xl font-black mb-1 text-white">
                    {title}
                </h4>
                <p className="text-neutral-400 text-sm max-w-[10rem] font-light">
                    {description}
                </p>
            </div>
        </Link>
    );
};

export const HoveredLink = ({ children, ...rest }: any) => {
    return (
        <Link
            {...rest}
            className="text-neutral-400 hover:text-white transition-colors"
        >
            {children}
        </Link>
    );
};
