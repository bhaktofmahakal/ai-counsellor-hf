import React from "react";
import { cn } from "@/lib/utils";

export const GridBackground = ({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("min-h-screen w-full bg-[#0f0f0f] relative text-white", className)}>
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(to right, #262626 1px, transparent 1px),
            linear-gradient(to bottom, #262626 1px, transparent 1px)
          `,
                    backgroundSize: "40px 40px",
                    maskImage: "linear-gradient(to bottom, transparent, black, transparent)"
                }}
            />
            {/* Radial gradient for the container to give a faded look */}
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-[#0f0f0f] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <div className="relative z-10">{children}</div>
        </div>
    );
};

export const DotBackground = ({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("min-h-screen w-full bg-[#0a0a0a] relative text-white", className)}>
            <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                    backgroundColor: '#0a0a0a',
                    backgroundImage: `
            radial-gradient(circle at 25% 25%, #222222 0.5px, transparent 1px),
            radial-gradient(circle at 75% 75%, #111111 0.5px, transparent 1px)
          `,
                    backgroundSize: '20px 20px',
                }}
            />
            <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-[#0a0a0a] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
            <div className="relative z-10">{children}</div>
        </div>
    );
};
