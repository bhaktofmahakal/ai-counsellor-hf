"use client";
import * as React from "react";
import { cn } from "../../lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: React.ReactNode;
  status?: "online" | "offline" | "away" | "busy" | null;
}

const DEFAULT_AVATAR = `https://api.dicebear.com/7.x/pixel-art/svg?seed=student`;


const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, status, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
          "transition-all duration-300 ease-in-out hover:scale-105 border border-white/10",
          className
        )}
        {...props}
      />
    );
  }
);

Avatar.displayName = "Avatar";

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> { }

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className, src, alt, onError, onLoad, ...props }, ref) => {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [imgError, setImgError] = React.useState(false);

    // Using a more reliable generator if src is missing or errors
    const finalSrc = src && !imgError ? src : `https://api.dicebear.com/7.x/avataaars/svg?seed=${alt || 'user'}`;

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setImgError(true);
      if (onError) onError(e);
    };

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setIsLoaded(true);
      if (onLoad) onLoad(e);
    };

    return (
      <img
        ref={ref}
        src={finalSrc}
        alt={alt || "Avatar"}
        className={cn(
          "aspect-square h-full w-full object-cover absolute inset-0",
          "transition-opacity duration-300 ease-in-out",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    );
  }
);
AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> { }

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-slate-800 text-slate-300 font-bold",
        "animate-in fade-in-0 zoom-in-0 duration-300",
        className
      )}
      {...props}
    />
  )
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };
