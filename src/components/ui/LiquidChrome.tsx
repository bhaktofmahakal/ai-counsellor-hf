"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export const LiquidChrome = ({
    className,
    baseColor = [0.05, 0.05, 0.05],
    speed = 0.005,
    amplitude = 100,
    interactive = false
}: {
    className?: string;
    baseColor?: number[];
    speed?: number;
    amplitude?: number;
    interactive?: boolean;
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resize);
        resize();

        const render = () => {
            time += speed;
            const { width, height } = canvas;

            ctx.clearRect(0, 0, width, height);

            // Minimalist liquid chrome effect using noise-like gradients
            const gradient = ctx.createRadialGradient(
                width / 2 + Math.sin(time) * (amplitude > 1 ? amplitude : width * amplitude),
                height / 2 + Math.cos(time * 0.8) * (amplitude > 1 ? amplitude : height * amplitude),
                0,
                width / 2,
                height / 2,
                width
            );

            const r = Math.floor(baseColor[0] * 255);
            const g = Math.floor(baseColor[1] * 255);
            const b = Math.floor(baseColor[2] * 255);

            gradient.addColorStop(0, `rgba(${r + 30}, ${g + 30}, ${b + 50}, 0.2)`);
            gradient.addColorStop(0.5, `rgba(${r + 10}, ${g + 10}, ${b + 20}, 0.5)`);
            gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 1)`);

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, width, height);

            // Add some "chrome" highlights
            ctx.globalCompositeOperation = "screen";
            for (let i = 0; i < 3; i++) {
                const x = width * (0.5 + 0.3 * Math.sin(time + i * 2));
                const y = height * (0.5 + 0.3 * Math.cos(time * 0.7 + i));

                const highlight = ctx.createRadialGradient(x, y, 0, x, y, width * 0.4);
                highlight.addColorStop(0, `rgba(100, 150, 255, ${0.05 * Math.sin(time)})`);
                highlight.addColorStop(1, "transparent");

                ctx.fillStyle = highlight;
                ctx.fillRect(0, 0, width, height);
            }
            ctx.globalCompositeOperation = "source-over";

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={cn("absolute inset-0 w-full h-full pointer-events-none opacity-40", className)}
        />
    );
};

export default LiquidChrome;
