"use client";
import { cn } from "@/lib/utils";
import { Menu as MenuIcon, X } from "lucide-react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValueEvent,
} from "framer-motion";

import React, { useRef, useState } from "react";


interface NavbarProps {
    children: React.ReactNode;
    className?: string;
}

interface NavBodyProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface NavItemsProps {
    items: {
        name: string;
        link: string;
    }[];
    className?: string;
    onItemClick?: () => void;
}

interface MobileNavProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface MobileNavHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface MobileNavMenuProps {
    children: React.ReactNode;
    className?: string;
    isOpen: boolean;
    onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const [visible, setVisible] = useState<boolean>(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 50) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    });

    return (
        <motion.div
            ref={ref}
            className={cn("fixed inset-x-0 top-0 z-[100] w-full", className)}
        >
            {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? React.cloneElement(
                        child as React.ReactElement<{ visible?: boolean }>,
                        { visible },
                    )
                    : child,
            )}
        </motion.div>
    );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
    return (
        <motion.div
            animate={{
                backdropFilter: visible ? "blur(12px)" : "none",
                boxShadow: visible
                    ? "0 0 24px rgba(0, 0, 0, 0.5), 0 1px 1px rgba(255, 255, 255, 0.05), 0 0 0 1px rgba(255, 255, 255, 0.05)"
                    : "none",
                width: visible ? "96%" : "100%",
                y: visible ? 20 : 0,
                backgroundColor: visible ? "rgba(0, 0, 0, 0.8)" : "rgba(0, 0, 0, 0)",
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 30,
            }}
            className={cn(
                "relative z-[60] mx-auto hidden w-full max-w-[1500px] flex-row items-center justify-between self-start rounded-full px-8 py-4 lg:flex border border-transparent",
                visible && "border-white/10",
                className,
            )}
        >
            {children}
        </motion.div>
    );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <div
            onMouseLeave={() => setHovered(null)}
            className={cn(
                "flex flex-row items-center justify-center space-x-2 text-sm font-medium",
                className,
            )}
        >
            {items.map((item, idx) => (
                <a
                    onMouseEnter={() => setHovered(idx)}
                    onClick={onItemClick}
                    className="relative px-4 py-2 text-slate-400 hover:text-white transition-colors"
                    key={`link-${idx}`}
                    href={item.link}
                >
                    {hovered === idx && (
                        <motion.div
                            layoutId="hovered"
                            className="absolute inset-0 h-full w-full rounded-full bg-white/5"
                        />
                    )}
                    <span className="relative z-20">{item.name}</span>
                </a>
            ))}
        </div>
    );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
    return (
        <motion.div
            animate={{
                backdropFilter: visible ? "blur(12px)" : "none",
                width: visible ? "95%" : "100%",
                borderRadius: visible ? "1.5rem" : "0",
                y: visible ? 10 : 0,
                backgroundColor: visible ? "rgba(0, 0, 0, 0.9)" : "rgba(0, 0, 0, 0)",
            }}
            className={cn(
                "relative z-50 mx-auto flex w-full flex-col items-center justify-between px-6 py-4 lg:hidden border-b border-white/5",
                visible && "border border-white/10 shadow-2xl",
                className,
            )}
        >
            {children}
        </motion.div>
    );
};

export const MobileNavHeader = ({
    children,
    className,
}: MobileNavHeaderProps) => {
    return (
        <div
            className={cn(
                "flex w-full flex-row items-center justify-between",
                className,
            )}
        >
            {children}
        </div>
    );
};

export const MobileNavMenu = ({
    children,
    className,
    isOpen,
    onClose,
}: MobileNavMenuProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn(
                        "absolute inset-x-0 top-full mt-2 z-50 flex w-full flex-col items-start justify-start gap-6 rounded-3xl bg-slate-900/95 backdrop-blur-xl px-6 py-8 border border-white/10 shadow-2xl",
                        className,
                    )}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const MobileNavToggle = ({
    isOpen,
    onClick,
}: {
    isOpen: boolean;
    onClick: () => void;
}) => {
    return (
        <button onClick={onClick} className="p-2 text-white hover:bg-white/5 rounded-lg transition-colors" suppressHydrationWarning>
            {isOpen ? <X className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
    );
};

export const NavbarLogo = ({ children }: { children?: React.ReactNode }) => {
    return (
        <div className="relative z-20 flex items-center gap-2">
            {children}
        </div>
    );
};

export const NavbarButton = ({
    href,
    as: Tag = "button",
    children,
    className,
    variant = "primary",
    ...props
}: {
    href?: string;
    as?: any;
    children: React.ReactNode;
    className?: string;
    variant?: "primary" | "secondary" | "dark" | "gradient";
} & any) => {
    const baseStyles = "px-5 py-2 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95";

    const variants = {
        primary: "bg-white text-black shadow-lg shadow-white/10 hover:bg-neutral-200",
        secondary: "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10 hover:text-white",
        dark: "bg-black text-white border border-white/10",
        gradient: "bg-gradient-to-r from-white to-[#d1d1d1] text-black hover:opacity-90"
    };

    return (
        <Tag
            className={cn(baseStyles, variants[variant], className)}
            suppressHydrationWarning
            {...props}
        >
            {children}
        </Tag>
    );
};
