import React from "react";

export interface BackgroundProps {
  accentColor: string;
  className?: string; 
}

export function Background({ accentColor, className = "" }: BackgroundProps) {
  return (
    <div className={`pointer-events-none fixed inset-0 z-0 ${className}`}>
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] max-w-[1000px] h-[35vh] blur-2xl md:opacity-70 opacity-60"
        style={{
          background: `radial-gradient(60% 60% at 50% 0%, ${accentColor}26 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: [
            `radial-gradient(80% 40% at 50% -10%, rgba(255,255,255,0.10) 0%, transparent 60%)`,
            `radial-gradient(40% 30% at 20% 15%, ${accentColor}33 0%, transparent 60%)`,
            `radial-gradient(35% 28% at 85% 18%, rgba(0,212,255,0.08) 0%, transparent 65%)`,
            `radial-gradient(45% 35% at 10% 85%, rgba(255,122,217,0.05) 0%, transparent 65%)`,
            `radial-gradient(50% 40% at 92% 86%, rgba(138,43,226,0.09) 0%, transparent 70%)`,
          ].join(", "),
        }}
      />
      {/* Era color tint sweep */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(115deg, ${accentColor}22 0%, transparent 55%)`,
          mixBlendMode: "screen" as React.CSSProperties["mixBlendMode"],
        }}
      />
      {/* Diagonal light beams (subtle) */}
      <div
        className="absolute inset-0 pointer-events-none hidden md:block"
        style={{
          backgroundImage: `repeating-linear-gradient(-25deg, rgba(255,255,255,0.04) 0 2px, transparent 2px 28px)`,
          opacity: 0.06,
          mixBlendMode: "soft-light" as React.CSSProperties["mixBlendMode"],
          WebkitMaskImage:
            "radial-gradient(80% 55% at 50% 50%, #000 40%, transparent 100%)",
          maskImage:
            "radial-gradient(80% 55% at 50% 50%, #000 40%, transparent 100%)",
        }}
      />
      {/* Subtle grid overlay with masked center */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            `repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 24px)`,
            `repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0 1px, transparent 1px 24px)`,
          ].join(", "),
          WebkitMaskImage:
            "radial-gradient(90% 70% at 50% 50%, #000 40%, transparent 100%)",
          maskImage:
            "radial-gradient(90% 70% at 50% 50%, #000 40%, transparent 100%)",
          opacity: 0.05,
          mixBlendMode: "soft-light" as React.CSSProperties["mixBlendMode"],
        }}
      />
      {/* Corner glows */}
      <div
        className="absolute -top-[12%] -left-[8%] w-[40vw] max-w-[520px] h-[40vh] blur-3xl"
        style={{
          background: `radial-gradient(50% 50% at 50% 50%, ${accentColor}18 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute -bottom-[10%] -right-[6%] w-[42vw] max-w-[560px] h-[42vh] blur-3xl"
        style={{
          background: `radial-gradient(50% 50% at 50% 50%, rgba(0,212,255,0.12) 0%, transparent 70%)`,
        }}
      />
      {/* Subtle grain */}
      <div
        className="absolute inset-0 mix-blend-soft-light opacity-[0.04] md:opacity-[0.06]"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: "3px 3px",
        }}
      />
      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{ boxShadow: "inset 0 0 260px 80px rgba(0,0,0,0.75)" }}
      />
    </div>
  );
}

export default Background;
