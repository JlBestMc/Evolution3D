import Button2 from "@/components/ui/button/Button2";
import { useEffect, useRef, useState } from "react";

type VideoModalProps = {
  open: boolean;
  title?: string;
  sources: string[];
  onClose: () => void;
  onContinue?: () => void;
};

export default function VideoModal({ open, title, sources, onClose, onContinue }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Animate in when mounted
  useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(id);
    } else {
      setShow(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open && videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } catch {
        // ignore
      }
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <button
        aria-label="Close"
        onClick={onClose}
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${show ? "opacity-100" : "opacity-0"}`}
      />

      {/* Dialog */}
      <div
        className={`relative w-[92vw] max-w-4xl rounded-2xl border border-white/10 bg-black/70 p-3 sm:p-4 shadow-2xl transform transition-all duration-300 ease-out ${show ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-3 scale-95"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white text-sm sm:text-base font-medium opacity-90 truncate flex items-center gap-2">
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-white/10 border border-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5 text-white/80">
                <path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h7A1.5 1.5 0 0 1 13 4.5V6h2.25A1.75 1.75 0 0 1 17 7.75v4.5A1.75 1.75 0 0 1 15.25 14H13v1.5A1.5 1.5 0 0 1 11.5 17h-7A1.5 1.5 0 0 1 3 15.5v-11Z" />
              </svg>
            </span>
            {title || "Video"}
          </h3>
          <Button2
            onClick={onClose}
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 transition"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
            </svg>
          </Button2>
        </div>

        {/* Player */}
        <div className="rounded-xl overflow-hidden border border-white/10 bg-black/40 aspect-video shadow-lg">
          <video ref={videoRef} controls autoPlay playsInline className="w-full h-full"
            preload="metadata"
          >
            {sources.map((src) => (
              <source key={src} src={src} />
            ))}
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-3">
          {onContinue && (
            <Button2
              onClick={onContinue}
              rounded="rounded-full"
              gradientHover="from-purple-500 to-blue-500"
              borderColor="bg-purple-500/70"
              size="md"
            >
              Explore era
            </Button2>
          )}
        </div>
      </div>
    </div>
  );
}
