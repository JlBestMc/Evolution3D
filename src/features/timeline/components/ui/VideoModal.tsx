import { Film, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Button2 from "@/components/ui/button/Button2";

type VideoModalProps = {
  open: boolean;
  title?: string;
  sources: string[];
  poster?: string;
  accentColor?: string;
  onClose: () => void;
  onContinue?: () => void;
};

export default function VideoModal({
  open,
  title,
  sources,
  poster,
  accentColor = "#ffffff",
  onClose,
  onContinue,
}: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setShow(false);
      return;
    }

    const previousFocus = document.activeElement as HTMLElement | null;
    const showId = requestAnimationFrame(() => setShow(true));
    const focusId = requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      cancelAnimationFrame(showId);
      cancelAnimationFrame(focusId);
      previousFocus?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="timeline-video-title"
    >
      <button
        type="button"
        aria-label="Close video"
        onClick={onClose}
        className={`absolute inset-0 bg-[#02080a]/80 backdrop-blur-md transition-opacity duration-300 ${
          show ? "opacity-100" : "opacity-0"
        }`}
      />

      <section
        className={`relative w-[min(92vw,68rem)] overflow-hidden rounded-[1.5rem] border bg-[#071216]/95 p-3 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out sm:p-5 ${
          show ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-95 opacity-0"
        }`}
        style={{
          borderColor: "transparent",
          backgroundImage:
            "linear-gradient(rgba(7,18,22,0.97), rgba(7,18,22,0.97)), linear-gradient(120deg, #22d3ee, #3b82f6 48%, #a855f7)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, #22d3ee 28%, ${accentColor} 52%, #a855f7 76%, transparent)` }}
        />

        <header className="mb-4 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="grid size-9 shrink-0 place-items-center rounded-full border bg-white/[0.08]"
              style={{ borderColor: `${accentColor}88`, color: accentColor }}
            >
              <Film aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                Era film
              </p>
              <h2
                id="timeline-video-title"
                className="truncate text-base font-semibold text-white sm:text-lg"
              >
                {title || "Video"}
              </h2>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="grid size-9 shrink-0 place-items-center rounded-full border border-white/15 text-white/65 transition-colors hover:border-white/35 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            aria-label="Close video"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
        </header>

        <div className="aspect-video overflow-hidden rounded-xl border border-white/15 bg-black/50 shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
          <video
            ref={videoRef}
            controls
            autoPlay
            playsInline
            poster={poster}
            className="h-full w-full"
            preload="metadata"
          >
            {sources.map((source) => (
              <source key={source} src={source} />
            ))}
            Your browser does not support the video tag.
          </video>
        </div>

        {onContinue && (
          <footer className="mt-4 flex justify-end">
            <Button2
              onClick={onContinue}
              gradientHover="from-cyan-400 via-blue-500 to-purple-500"
              bgColor="bg-[#071216]/95"
              borderColor="bg-[#071216]/85"
              rounded="rounded-full"
              size="sm"
              ariaLabel={`Explore ${title || "era"}`}
              className="shadow-[0_12px_28px_rgba(0,0,0,0.32)]"
            >
              Explore era
            </Button2>
          </footer>
        )}
      </section>
    </div>
  );
}