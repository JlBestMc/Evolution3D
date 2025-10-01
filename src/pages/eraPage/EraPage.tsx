import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useGLTF } from "@react-three/drei";
import { eras } from "../../data/eras";
import { useNavigate, useParams } from "react-router-dom";
import Background from "../../components/ui/background/Background";
import logo from "/images/favicon.ico";
import { Card3D } from "../../components/card/Card3D";
import { DragSafeCard } from "../../components/card/DragSafeCard";
import Navbar3 from "../../components/navbar/Navbar3";
import { getAnimals, getAnimalsByEra } from "@/services/animals";
import { getEraColor } from "@/services/eras";

const DRACO_CDN = "https://www.gstatic.com/draco/v1/decoders/";
useGLTF.setDecoderPath(DRACO_CDN);

export default function EraPage() {
  const params = useParams<{ eraId?: string }>();
  const [eraId] = useState<string>(params.eraId ?? "");
  const eraObj = useMemo(() => eras.find((e) => e.id === eraId), [eraId]);
  const { data: eraColorFromDb } = useQuery({
    queryKey: ["era-color", eraId],
    enabled: !!eraId,
    queryFn: () => getEraColor(eraId),
  });
  const eraColor = eraColorFromDb ?? eraObj?.color ?? "#6b8cff";

  const {
    data: fetchedAnimals,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["animals", eraId || "all"],
    queryFn: () => (eraId ? getAnimalsByEra(eraId) : getAnimals()),
  });

  const animals = useMemo(() => {
    const arr = fetchedAnimals ?? [];
    return arr.slice().sort((a, b) => (b.startMa ?? 0) - (a.startMa ?? 0));
  }, [fetchedAnimals]);

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

  useEffect(() => {
    return () => {
      const currentModels = Array.from(
        new Set((fetchedAnimals ?? []).map((a) => a.model).filter(Boolean))
      );
      currentModels.forEach((m) => {
        try {
          useGLTF.clear(m);
        } catch {
          // ignore
        }
      });
    };
  }, [fetchedAnimals]);
  const navigate = useNavigate();

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

      <section className="relative z-10 container mx-auto px-6 py-7">
        <header className="mb-6">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1
                className="text-3xl md:text-4xl font-semibold tracking-tight"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${eraColor}, #ffffff)`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {eraObj?.name ?? "All Eras"}
              </h1>
              {eraObj?.period && (
                <p className="mt-1 text-white text-sm">{eraObj.period}</p>
              )}
            </div>
          </div>
          <div
            className="mt-3 h-[3px] w-24 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${eraColor}, transparent)`,
            }}
          />
        </header>
        {isLoading && <div className="text-white/70">Loading animals…</div>}
        {error && (
          <div className="text-red-400 text-sm">
            {String((error as Error)?.message || error)}
          </div>
        )}
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
