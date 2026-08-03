import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/routes";
import { eras } from "@/data/eras";
import TimelinePortal from "./TimelinePortal";
import TimelineControls from "./TimelineControls";
import TimelineRail from "./TimelineRail";
import VideoModal from "./VideoModal";

interface TimelineUIProps {
  currentEra: string;
  setCurrentEra: (eraId: string) => void;
  loading?: boolean;
}

export default function TimelineUI({
  currentEra,
  setCurrentEra,
  loading = false,
}: TimelineUIProps) {
  const navigate = useNavigate();
  const index = useMemo(() => {
    const i = eras.findIndex((e) => e.id === currentEra);
    return i < 0 ? 0 : i;
  }, [currentEra]);

  useEffect(() => {
    if (!eras.some((e) => e.id === currentEra)) {
      console.warn(
        "[TimelineUI] currentEra inválido, restaurando al primero:",
        currentEra
      );
      setCurrentEra(eras[0].id);
    }
  }, [currentEra, setCurrentEra]);
  const handlePrev = () => {
    if (loading) return;
    if (index > 0) {
      const target = eras[index - 1].id;
      console.log("[TimelineUI] Prev ->", target);
      setCurrentEra(target);
    }
  };
  const handleNext = () => {
    if (loading) return;
    if (index < eras.length - 1) {
      const target = eras[index + 1].id;
      console.log("[TimelineUI] Next ->", target);
      setCurrentEra(target);
    }
  };
  const handleExplore = () => {
    if (loading) return;
    const era = eras[index];
    navigate(PATHS.eraId(era.id));
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (loading) return;
      if (e.key === "ArrowLeft" && index > 0) {
        setCurrentEra(eras[index - 1].id);
      } else if (e.key === "ArrowRight" && index < eras.length - 1) {
        setCurrentEra(eras[index + 1].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, loading, setCurrentEra]);

  useEffect(() => {
    [eras[index - 1], eras[index + 1]].forEach((e) => {
      if (e?.image) {
        const img = new Image();
        img.src = e.image;
      }
    });
  }, [index]);

  const era = eras[index];
  const color = era.color || "#ffffff";
  const [videoOpen, setVideoOpen] = useState(false);
  type EraWithVideo = (typeof eras)[number] & { video?: string | string[] };
  const eraWithVideo = era as EraWithVideo;
  const videoProp = eraWithVideo.video;
  const videoSources = Array.isArray(videoProp)
    ? videoProp
    : videoProp
    ? [videoProp]
    : [];

  useEffect(() => {
    setVideoOpen(false);
  }, [currentEra]);

  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center px-3 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-8">
        <div className="pointer-events-auto relative flex w-full max-w-[1180px] flex-col items-center gap-4 select-none sm:gap-5">
          
          <div className="pointer-events-none absolute -top-12 flex items-center gap-3 text-[9px] font-medium uppercase tracking-[0.3em] text-white">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-violet-300/70" />
            <span className="text-lg">Timeline</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-cyan-300/70" />
          </div>

          <div className="flex w-full flex-col items-center gap-3">
            <TimelinePortal
              era={era}
              color={color}
              index={index}
              total={eras.length}
              loading={loading}
              videoAvailable={videoSources.length > 0}
              onExplore={handleExplore}
              onWatch={() => setVideoOpen(true)}
            />
          </div>

          <TimelineControls
            index={index}
            loading={loading}
            onPrev={handlePrev}
            onNext={handleNext}
            onSelect={setCurrentEra}
            activeColor={color}
          />

          <TimelineRail
            index={index}
            loading={loading}
            onSelect={setCurrentEra}
          />
        </div>
      </div>

      <VideoModal
        open={videoOpen}
        title={era.name}
        sources={videoSources}
        poster={era.image}
        accentColor={color}
        onClose={() => setVideoOpen(false)}
        onContinue={() => navigate(PATHS.eraId(era.id))}
      />
    </>
  );
}
