import { ArrowUpRight, Box, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import Button2 from "@/components/ui/button/Button2";
import { Card3D } from "@/features/animals/components/cards/Card3D";
import type { Animal } from "@/data/animals";

const DRACO_CDN = "https://www.gstatic.com/draco/v1/decoders/";
useGLTF.setDecoderPath(DRACO_CDN);

type Props = {
  animal: Animal;
  color: string;
  onExplore: () => void;
};

const isDesktopViewport = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(min-width: 1024px)").matches;

export default function TimelineSpecimen({ animal, color, onExplore }: Props) {
  const [open, setOpen] = useState(isDesktopViewport);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const mediaQuery = window.matchMedia("(min-width: 1024px)");
    const handleBreakpointChange = () => setOpen(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleBreakpointChange);
    return () => mediaQuery.removeEventListener("change", handleBreakpointChange);
  }, []);

  const handleExplore = () => {
    setOpen(false);
    onExplore();
  };

  if (!open) {
    return (
      <aside className="relative z-30 w-[min(20rem,calc(100vw-1.5rem))] shrink-0">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={false}
          className="group relative flex w-full items-center gap-3 overflow-hidden rounded-[1.35rem] border border-white/15 bg-black/65 p-px text-left text-white shadow-[0_20px_55px_-24px_rgba(0,0,0,0.98)] backdrop-blur-xl transition-[transform,filter] duration-300 hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/80"
          style={{
            backgroundImage:
              "linear-gradient(rgba(3,3,8,0.95), rgba(3,3,8,0.95)), linear-gradient(120deg, #a855f7, #3b82f6 52%, #22d3ee)",
            backgroundOrigin: "border-box",
            backgroundClip: "padding-box, border-box",
            boxShadow: `0 18px 45px -18px ${color}99`,
          }}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-purple-500/30 via-blue-500/25 to-cyan-400/20 text-violet-100">
            <Box aria-hidden="true" className="size-5 transition-transform duration-500 group-hover:rotate-12" />
          </span>
          <span className="min-w-0 flex-1 py-1">
            <span className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-violet-100/70">
              <Sparkles aria-hidden="true" className="size-3" />
              Featured specimen
            </span>
            <span className="mt-1 block truncate text-sm font-semibold">{animal.name}</span>
            <span className="mt-0.5 block truncate text-[10px] text-white/55">Open 3D preview</span>
          </span>
          <ArrowUpRight aria-hidden="true" className="mr-2 size-4 shrink-0 text-white/55 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </button>
      </aside>
    );
  }

  return (
    <aside className="relative z-30 w-[min(20rem,calc(100vw-1.5rem))] shrink-0 lg:h-[21rem] lg:w-[min(250px,calc(50vw-2rem))]">
      <div
        className="h-full overflow-hidden rounded-[1.35rem] border border-white/15 bg-black/70 p-px text-white shadow-[0_24px_70px_-28px_rgba(0,0,0,0.98)] backdrop-blur-xl"
        style={{
          backgroundImage:
            "linear-gradient(rgba(3,3,8,0.96), rgba(3,3,8,0.96)), linear-gradient(120deg, #a855f7, #3b82f6 52%, #22d3ee)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          boxShadow: `0 24px 60px -20px ${color}AA`,
        }}
      >
        <div className="relative flex h-full flex-col">
          <div className="flex shrink-0 items-center justify-between gap-3 px-3 pb-2 pt-3">
            <div className="min-w-0">
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-cyan-100/70">
                Featured specimen
              </p>
              <h2 className="truncate text-sm font-semibold">{animal.name}</h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close specimen preview"
              className="grid size-8 shrink-0 place-items-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300/80"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>

          <div className="min-h-0 flex-1 px-2">
            <Card3D
              key={animal.name}
              animal={animal}
              enableZoom={false}
              lazyMount3D={false}
              clearOnUnmount
              widthClass="w-full"
              heightClass="h-full"
              modelScale={1.75}
              className="!rounded-xl !border-white/10"
            />
          </div>

          <div className="flex shrink-0 items-center justify-between gap-3 px-3 pb-3 pt-2">
            <p className="min-w-0 truncate text-[10px] text-white/55">{animal.subtitle}</p>
            <Button2
              onClick={handleExplore}
              gradientHover="from-purple-500 via-blue-500 to-cyan-400"
              bgColor="bg-black/80"
              borderColor="bg-black/70"
              rounded="rounded-full"
              size="sm"
              ariaLabel={`Explore ${animal.name}`}
              className="shrink-0"
            >
              Explore
            </Button2>
          </div>
        </div>
      </div>
    </aside>
  );
}
