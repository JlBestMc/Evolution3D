import { forwardRef } from "react";

type EraItem = {
  id: string;
  name: string;
  image: string;
  color?: string;
  period?: string;
  description?: string;
};

type Props = {
  era: EraItem;
  color: string;
  onClick: () => void;
};

const TimelinePortal = forwardRef<HTMLDivElement, Props>(function TimelinePortal(
  { era, color, onClick },
  ref
) {
  return (
    <div
      onClick={onClick}
      ref={ref}
      className="relative cursor-pointer w-70 h-60 rounded-3xl overflow-hidden border border-white/10 bg-white/[0.06] backdrop-blur-md flex items-center justify-center shadow-[0_0_60px_-10px_rgba(0,0,0,0.7)]"
      style={{ boxShadow: `0 0 55px -12px ${color}AA` }}
    >
      {/* Glow ring */}
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10"
        style={{ boxShadow: `inset 0 0 0 5px ${color}33` }}
      />
      <img
        key={era.id}
        src={era.image}
        alt={era.name}
        className="absolute inset-0 w-full h-full object-fit opacity-80 scale-105 animate-fadeIn"
        draggable={false}
      />
      {/* Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-80"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      <div className="relative text-center text-white drop-shadow flex flex-col items-center px-4">
        <h2 className="text-[26px] font-semibold tracking-wide leading-tight mb-1">
          {era.name}
        </h2>
        {era.period && (
          <p className="text-xs font-medium tracking-wide text-white/80 mb-1">
            {era.period}
          </p>
        )}
        {era.description && (
          <p
            className="text-[16px] leading-snug font-light max-w-[220px] text-white/85 line-clamp-3"
            style={{
              textShadow: "0 0 6px rgba(0,0,0,0.5)",
              borderTop: `1px solid ${color}33`,
              paddingTop: 6,
            }}
          >
            {era.description}
          </p>
        )}

        {/* CTA subtle */}
        <span
          className="mt-6 inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-2 py-1 text-[14px] font-medium text-white/90 transition-all duration-400 ease-out hover:bg-purple-950/80 hover:shadow-[0_8px_20px_rgba(0,0,0,0.25)] hover:-translate-y-0.5"
          aria-hidden
        >
          Explore
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-4">
            <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h9.638L9.22 5.08a.75.75 0 1 1 1.06-1.06l5.5 5.5a.75.75 0 0 1 0 1.06l-5.5 5.5a.75.75 0 1 1-1.06-1.06l4.168-4.17H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
          </svg>
        </span>
      </div>
    </div>
  );
});

export default TimelinePortal;
