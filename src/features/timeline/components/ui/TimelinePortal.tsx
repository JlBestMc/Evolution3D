import { Film } from "lucide-react";
import type { CSSProperties } from "react";
import Button2 from "@/components/ui/button/Button2";

type EraItem = {
  id: string;
  name: string;
  image: string;
  color?: string;
  period?: string;
  environment?: string;
  milestone?: string;
  transition?: string;
  description?: string;
};

type Props = {
  era: EraItem;
  color: string;
  index: number;
  total: number;
  loading?: boolean;
  videoAvailable: boolean;
  onExplore: () => void;
  onWatch: () => void;
};

export default function TimelinePortal({
  era,
  color,
  index,
  total,
  loading = false,
  videoAvailable,
  onExplore,
  onWatch,
}: Props) {
  return (
    <article
      aria-label={`${era.name} overview`}
      className="group relative isolate flex h-[clamp(14rem,28vh,18rem)] w-[min(300px,calc(100vw-1.5rem))] flex-col justify-end overflow-hidden rounded-[1.35rem] border border-white/15 bg-black/55 text-white shadow-[0_24px_80px_-34px_rgba(0,0,0,0.98)] backdrop-blur-xl transition-[transform,box-shadow,filter] duration-500 hover:brightness-110 lg:h-[16rem]"
      style={
        {
          backgroundImage:
            "linear-gradient(145deg, rgba(168,85,247,0.18), transparent 38%), linear-gradient(180deg, rgba(5,5,12,0.3), rgba(0,0,0,0.88))",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          boxShadow: `0 24px 80px -34px rgba(0,0,0,0.98), 0 0 40px -24px ${color}AA`,
          "--era-color": color,
        } as CSSProperties
      }
    >
      <img
        src={era.image}
        alt=""
        className="absolute inset-0 h-full w-full scale-105 object-cover opacity-55 transition-transform duration-700 ease-out"
        draggable={false}
        decoding="async"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06)_0%,rgba(0,0,0,0.35)_36%,rgba(0,0,0,0.96)_100%)]" />
      <div
        className="absolute inset-x-5 top-0 h-px opacity-90"
        style={{ background: `linear-gradient(90deg, transparent, #a855f7 45%, ${color} 72%, transparent)` }}
      />

      <div className="relative flex flex-col gap-3 px-5 pb-5 pt-8 sm:px-6 sm:pb-6">
        <div className="flex items-center justify-between text-[9px] font-medium uppercase tracking-[0.24em] text-white/55">
          <span>
            Era {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="text-violet-100/70">{era.period}</span>
        </div>

        <div>
          <h2 className="text-2xl font-light leading-tight tracking-[0.01em] sm:text-[28px]">
            {era.name}
          </h2>
          {era.milestone && (
            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.16em] text-violet-100/75">
              {era.milestone}
            </p>
          )}
        </div>

        {era.description && (
          <p className="line-clamp-2 max-w-[38ch] border-l border-violet-300/70 pl-3 text-xs leading-relaxed text-white/70">
            {era.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Button2
            onClick={onExplore}
            disabled={loading}
            gradientHover="from-purple-500 via-blue-500 to-cyan-400"
            bgColor="bg-black/80"
            borderColor="bg-black/70"
            rounded="rounded-full"
            size="sm"
            ariaLabel={`Explore ${era.name}`}
          >
            Explore era
          </Button2>
          {videoAvailable && (
            <button
              type="button"
              onClick={onWatch}
              disabled={loading}
              className="group/watch inline-flex items-center gap-2 rounded-full border border-violet-100/25 bg-black/35 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-white/75 transition-[background-color,border-color,color] hover:border-violet-200/70 hover:bg-violet-500/20 hover:text-white disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/80"
            >
              <Film
                aria-hidden="true"
                className="size-3.5 text-violet-200 transition-transform group-hover/watch:scale-110"
              />
              Watch story
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
