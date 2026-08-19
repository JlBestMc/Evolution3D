import { eras } from "@/data/eras";
import type { CSSProperties } from "react";

type Props = {
  index: number;
  loading: boolean;
  onSelect: (id: string) => void;
  selectedSuberaId: string | null;
  onSuberaSelect: (id: string) => void;
};

export default function TimelineRail({
  index,
  loading,
  onSelect,
  selectedSuberaId,
  onSuberaSelect,
}: Props) {
  const activeEra = eras[index];

  return (
    <div
      role="region"
      className="carousel-scroll mt-1 w-[calc(100vw-1.5rem)] max-w-[1024px] select-none overflow-x-auto px-3 sm:mt-2 sm:w-[92vw] sm:px-0"
      aria-label="Timeline eras"
    >
      <div className="relative min-w-[560px] pb-1 sm:min-w-0">
        <div className="relative h-32 sm:h-36">
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

        <div
          className="overflow-hidden opacity-100 transition-[max-height,opacity,transform] duration-500 ease-out motion-reduce:transition-none"
          style={{ maxHeight: activeEra.suberas.length ? "11rem" : 0 }}
          aria-label={`${activeEra.name} suberas`}
        >
          <div className="relative border-t border-white/10 px-7 pt-2 sm:px-10">
            <div className="mb-1.5 flex items-center justify-between gap-3 text-[9px] font-semibold uppercase tracking-[0.24em] text-white/45">
              <span>Stratigraphic detail</span>
              <span>{activeEra.suberas.length} chapters</span>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {activeEra.suberas.map((item) => {
                const selected = item.id === selectedSuberaId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => !loading && onSuberaSelect(item.id)}
                    disabled={loading}
                    aria-pressed={selected}
                    aria-label={`${item.name}, ${item.period}`}
                    className={`group relative min-w-0 overflow-hidden rounded-xl border px-2.5 py-2 text-left transition-[border-color,background-color,transform,box-shadow] duration-300 motion-reduce:transition-none sm:px-3 sm:py-2.5 ${
                      selected
                        ? "border-white/70 bg-black/65 shadow-[0_10px_30px_rgba(0,0,0,0.32)]"
                        : "border-white/12 bg-black/25 hover:-translate-y-0.5 hover:border-white/40 hover:bg-black/45"
                    }`}
                  >
                    <span className="absolute inset-0 opacity-40 transition-opacity duration-300 group-hover:opacity-60">
                      <img
                        src={item.image}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15" />
                    <span className="relative block truncate text-[11px] font-semibold text-white sm:text-xs">
                      {item.name}
                    </span>
                    <span className="relative mt-1 block truncate text-[9px] font-medium uppercase tracking-[0.1em] text-white/55">
                      {item.period}
                    </span>
                    <span
                      className={`relative mt-2 block h-0.5 rounded-full transition-[width,background-color] duration-300 ${
                        selected ? "w-3/4 bg-white" : "w-1/4 bg-white/35 group-hover:w-1/2"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
