import { AuroraBackground } from "@/components/lightswind/aurora-background";
import LightRays from "@/components/lightswind/light-rays";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuroraBackground className="!bg-[#000000] !text-white">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffffff"
          raysSpeed={0.3}
          lightSpread={0.8}
          rayLength={2.0}
        />
      </div>
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 md:p-8 relative z-10 py-12">
        <div className="w-full max-w-lg">
          {children}
        </div>
      </div>
    </AuroraBackground>
  );
}
