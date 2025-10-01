import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "../../../routes/routes";
import { eras } from "../../../data/eras";
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
  // Indice seguro (si no se encuentra el id, forzamos 0)
  const index = useMemo(() => {
    const i = eras.findIndex((e) => e.id === currentEra);
    return i < 0 ? 0 : i;
  }, [currentEra]);

  // Si el id actual no existe (por espacios, edición manual, etc.) lo normalizamos al primero
  useEffect(() => {
    if (!eras.some((e) => e.id === currentEra)) {
      console.warn(
        "[TimelineUI] currentEra inválido, restaurando al primero:",
        currentEra
      );
      setCurrentEra(eras[0].id);
    }
  }, [currentEra, setCurrentEra]);
  const portalRef = useRef<HTMLDivElement | null>(null);

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

  // Teclado ← →
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      else if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Pre-cargar imágenes siguientes / previas para crossfade más suave
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

  return (
    <>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5 select-none z-20">
        {/* Portal principal */}
        <TimelinePortal
          era={era}
          color={color}
          onClick={() => {
            if (videoSources.length > 0) setVideoOpen(true);
            else handleExplore();
          }}
          ref={portalRef}
        />

        {/* Controles */}
        <TimelineControls
          index={index}
          loading={loading}
          onPrev={handlePrev}
          onNext={handleNext}
          onSelect={(id) => setCurrentEra(id)}
        />

        {/* Miniaturas horizontales removidas para usar solo las del rail */}

        {/* Timeline rail inferior */}
        <TimelineRail
          index={index}
          loading={loading}
          onSelect={(id) => setCurrentEra(id)}
        />
      </div>

      {/* Video modal */}
      <VideoModal
        open={videoOpen}
        title={era.name}
        sources={videoSources}
        onClose={() => setVideoOpen(false)}
        onContinue={() => navigate(PATHS.eraId(era.id))}
      />
    </>
  );
}
