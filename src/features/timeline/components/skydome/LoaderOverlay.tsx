import { useProgress } from "@react-three/drei";

type Props = {
  active?: boolean;
};

export default function LoaderOverlay({ active: controlledActive }: Props) {
  const { active: managerActive, progress } = useProgress();
  const active = controlledActive ?? managerActive;
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-[#02080a]/20 backdrop-blur-[2px]">
      <div className="flex flex-col items-center gap-3 text-white">
        <div className="relative grid size-12 place-items-center rounded-full border border-white/20 bg-black/15">
          <div className="absolute inset-1 rounded-full border-2 border-white/15 border-t-white/90 animate-spin" />
          <span className="text-[10px] font-semibold tabular-nums text-white/80">
            {progress.toFixed(0)}
          </span>
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">
          Loading era
        </span>
      </div>
    </div>
  );
}
