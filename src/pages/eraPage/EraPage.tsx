import { useEffect, useMemo, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import animalsData from "../../data/animals";
import { eras } from "../../data/eras";
import { useNavigate, useParams } from "react-router-dom";
import Background from "../../components/ui/background/Background";
import logo from "/images/favicon.ico";
import { Card3D } from "../../components/ui/card/Card3D";
import { DragSafeCard } from "../../components/ui/card/DragSafeCard";
import Navbar3 from "../../components/navbar/Navbar3";

const DRACO_CDN = "https://www.gstatic.com/draco/v1/decoders/";
useGLTF.setDecoderPath(DRACO_CDN);

export default function EraPage() {
  // Leer eraId desde la URL: /era/:eraId
  const params = useParams<{ eraId?: string }>();
  const [eraId] = useState<string>(params.eraId ?? "");
  const eraObj = useMemo(() => eras.find((e) => e.id === eraId), [eraId]);
  const eraColor = eraObj?.color ?? "#6b8cff";

  const animals = useMemo(() => {
    const filtered = animalsData.filter((a) => !eraId || a.eraId === eraId);
    // Ordenar de más antiguo (mayor startMa) a más reciente (menor startMa)
    return filtered.sort((a, b) => (b.startMa ?? 0) - (a.startMa ?? 0));
  }, [eraId]);

  // Preload solo algunos modelos visibles (primeros 6) y limpiar cache al cambiar de era
  useEffect(() => {
    const toPreload = animals
      .map((a) => a.model)
      .filter(Boolean)
      .slice(0, 8);
    toPreload.forEach((m) => useGLTF.preload(m, true));
    return () => {
      toPreload.forEach((m) => {
        try {
          useGLTF.clear(m);
        } catch {
          // ignore clear errors
        }
      });
    };
  }, [animals]);

  // Al salir de EraPage, limpia la caché de TODOS los modelos conocidos para liberar memoria
  useEffect(() => {
    return () => {
      const allModels = Array.from(
        new Set(animalsData.map((a) => a.model).filter(Boolean))
      );
      allModels.forEach((m) => {
        try {
          useGLTF.clear(m);
        } catch {
          // ignore
        }
      });
    };
  }, []);
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
        <Navbar3 logo={logo} />
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
            <DragSafeCard
              key={a.name}
              onActivate={() =>
                navigate(`/animal/${encodeURIComponent(a.name)}`)
              }
            >
              <Card3D
                animal={a}
                heightClass="h-[440px] md:h-[460px] lg:h-[460px] xl:h-[500px]"
                widthClass="w-72 md:w-72 lg:w-100 xl:w-100"
              />
            </DragSafeCard>
          ))}
        </div>
      </section>
    </main>
  );
}
