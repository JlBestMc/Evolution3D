import { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import animalsData from "../../data/animals";
import { eras } from "../../data/eras";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Background from "../../components/ui/backgrounds/Background";
import logo from "/images/logo3D.png";
import { Card3D } from "../../components/ui/card/Card3D";

const DRACO_CDN = "https://www.gstatic.com/draco/v1/decoders/";
useGLTF.setDecoderPath(DRACO_CDN);
// Optional: preload all declared models once
animalsData.forEach((a) => {
  if (a.model) useGLTF.preload(a.model, true);
});

export default function EraPage() {
  // Leer eraId desde la URL: /era/:eraId
  const params = useParams<{ eraId?: string }>();
  const [eraId] = useState<string>(params.eraId ?? "");
  const eraObj = useMemo(() => eras.find((e) => e.id === eraId), [eraId]);
  const eraColor = eraObj?.color ?? "#6b8cff";

  const animals = useMemo(() => {
    const filtered = animalsData.filter((a) => !eraId || a.eraId === eraId);
    // Preload solo de la era activa (y con Draco)
    filtered.forEach((a) => a.model && useGLTF.preload(a.model, true));
    // Ordenar de más antiguo (mayor startMa) a más reciente (menor startMa)
    return filtered.sort((a, b) => (b.startMa ?? 0) - (a.startMa ?? 0));
  }, [eraId]);
  const navigate = useNavigate();

  // Mejor UX: convertir rueda vertical a scroll horizontal en el carrusel
  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.shiftKey) return;
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        el.scrollLeft += e.deltaY;
        e.preventDefault();
      }
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel as EventListener);
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#06080F] text-white">
      <Background accentColor={eraColor} />

      <div className="relative z-20">
        <Navbar
          aStyles="cursor-pointer"
          variantButton="secondary"
          logo={logo}
          borderColor="border-white/30"
        />
      </div>

      <section className="relative z-10 container mx-auto px-6 py-10">
        <header className="mb-6">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1
                className="text-3xl md:text-4xl font-semibold tracking-tight"
                style={{
                  background: `linear-gradient(90deg, ${eraColor}, #ffffff)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {eraObj?.name ?? "All Eras"}
              </h1>
              {eraObj?.period && (
                <p className="mt-1 text-white/70 text-sm">{eraObj.period}</p>
              )}
            </div>
          </div>
          <div
            className="mt-3 h-[3px] w-24 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${eraColor}, transparent)`,
            }}
          />
          <p className="mt-3 text-white/70 text-sm">
            3D animals — ordered by time
          </p>
        </header>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="carousel-scroll flex gap-6 overflow-x-auto pb-6 select-none scroll-smooth"
          aria-label="3D animals carousel"
        >
          {animals.map((a) => (
            <div
              key={a.name}
              className="snap-center px-4 pt-5 md:snap-start shrink-0 snap-stop cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30 rounded-lg"
              onClick={() => navigate(`/animal/${encodeURIComponent(a.name)}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate(`/animal/${encodeURIComponent(a.name)}`);
                }
              }}
            >
              <Card3D animal={a} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

useGLTF.preload("/models/Archaeopteryx3D_draco.glb", true);
useGLTF.preload("/models/Whale3D.glb", true);
useGLTF.preload("/models/Pakicetus3D.glb", true);
useGLTF.preload("/models/trex.glb", true);
