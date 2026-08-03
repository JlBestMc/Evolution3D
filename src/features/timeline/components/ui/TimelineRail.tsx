import { eras } from "@/data/eras";
import type { CSSProperties } from "react";

type Props = {
  index: number;
  loading: boolean;
  onSelect: (id: string) => void;
};

export default function TimelineRail({ index, loading, onSelect }: Props) {
  return (
    <div
      role="region"
      className="carousel-scroll mt-1 w-[calc(100vw-1.5rem)] max-w-[1024px] select-none overflow-x-auto px-3 sm:mt-2 sm:w-[92vw] sm:px-0"
      aria-label="Timeline eras"
    >
      <div className="relative h-36 min-w-[560px] sm:h-40 sm:min-w-0">
        <div className="absolute left-7 right-7 top-[53%] h-px bg-gradient-to-r from-purple-300/20 via-white/70 to-cyan-300/20 sm:left-10 sm:right-10" />
        <div className="absolute left-7 right-7 top-[53%] h-6 -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.24),transparent_68%)] blur-md sm:left-10 sm:right-10" />

        <div className="relative flex h-full items-center justify-between px-7 py-3 sm:px-10">
          {eras.map((e, i) => (
            <button
              key={e.id}
              type="button"
              onClick={() => !loading && onSelect(e.id)}
              disabled={loading}
              aria-pressed={i === index}
              aria-label={`${e.name}: ${e.transition}`}
              className="group relative flex h-full min-w-0 flex-col items-center appearance-none border-0 bg-transparent p-0 text-inherit disabled:cursor-not-allowed"
            >
              <span
                className={`relative mb-7 block h-10 w-16 overflow-hidden rounded-lg border bg-[#071216]/80 transition-[transform,border-color,opacity] duration-300 sm:mb-8 sm:h-11 sm:w-[72px] ${
                  i === index
                    ? "scale-105 border-white opacity-100 shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
                    : "border-white/20 opacity-60 group-hover:scale-105 group-hover:border-violet-200/65 group-hover:opacity-100"
                }`}
                style={
                  i === index
                    ? ({
                        borderColor: "transparent",
                        backgroundImage:
                          "linear-gradient(#050509, #050509), linear-gradient(135deg, #a855f7, #3b82f6, #22d3ee)",
                        backgroundOrigin: "border-box",
                        backgroundClip: "padding-box, border-box",
                      } as CSSProperties)
                    : undefined
                }
              >
                <img
                  src={e.image}
                  alt={e.name}
                  className="h-full w-full object-cover"
                  draggable={false}
                  loading={i === index ? "eager" : "lazy"}
                  decoding="async"
                />
              </span>

              <span
                aria-hidden="true"
                className={`absolute left-1/2 top-[53%] z-10 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ${
                  i === index
                    ? "scale-125 border-white shadow-[0_0_0_4px_rgba(255,255,255,0.12),0_0_20px_var(--era-glow)]"
                    : "border-white/45 bg-white/15 hover:scale-110 hover:bg-white/50"
                }`}
                style={
                  i === index
                    ? ({
                        backgroundColor: e.color,
                        "--era-glow": `${e.color}AA`,
                      } as React.CSSProperties)
                    : undefined
                }
                />

              <div className="mt-1 text-center">
                <div
                  className={`inline-flex items-center rounded-full border px-2.5 py-1 mt-2 text-[11px] font-semibold tracking-wide transition-colors sm:text-xs ${
                    i === index
                      ? "border-transparent bg-black/80 text-white shadow-[0_0_18px_rgba(168,85,247,0.22)]"
                      : "border-white/12 bg-black/10 text-white/65 group-hover:border-violet-200/45 group-hover:text-white"
                  } whitespace-nowrap`}
                  title={e.name}
                  style={
                    i === index
                      ? ({
                          backgroundImage:
                            "linear-gradient(#050509, #050509), linear-gradient(90deg, #a855f7, #3b82f6, #22d3ee)",
                          backgroundOrigin: "border-box",
                          backgroundClip: "padding-box, border-box",
                        } as CSSProperties)
                      : undefined
                  }
                >
                  {e.name}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
