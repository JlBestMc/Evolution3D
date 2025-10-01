import { useProgress } from "@react-three/drei";

export default function LoaderOverlay() {
  const { active, progress } = useProgress();
  if (!active) return null;
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
      <div className="flex flex-col items-center gap-3 text-white">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        <span className="text-sm tracking-wide">Cargando {progress.toFixed(0)}%</span>
      </div>
    </div>
  );
}
