import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { eras } from "../../data/eras";
import Background from "../../components/ui/background/Background";
import logo from "/images/favicon.ico";
import { Card3D } from "../../components/card/Card3D";
import Navbar3 from "../../components/navbar/Navbar3";
import { getAnimalByName } from "@/services/animals";
import AnimalHeader from "./components/AnimalHeader";
import AnimalSpecs from "./components/AnimalSpecs";
import EvolutionCarousel from "./components/EvolutionCarousel";
import { getEraColor } from "@/services/eras";

export default function AnimalPage() {
  const params = useParams<{ name?: string }>();
  const raw = params.name ? decodeURIComponent(params.name) : "";
  const { data: animal, isLoading } = useQuery({
    queryKey: ["animal", raw],
    enabled: !!raw,
    queryFn: () => getAnimalByName(raw),
  });

  const era = useMemo(() => eras.find((e) => e.id === animal?.eraId), [animal]);
  const { data: eraColorFromDb } = useQuery({
    queryKey: ["era-color-for-animal", animal?.eraId ?? "none"],
    enabled: !!animal?.eraId,
    queryFn: () => getEraColor(animal!.eraId!),
  });
  const eraColor = eraColorFromDb ?? era?.color ?? "#6b8cff";

  if (isLoading) {
    return (
      <main className="relative min-h-screen w-full overflow-hidden bg-[#06080F] text-white">
        <Background accentColor={eraColor} />
        <div className="relative z-20">
          <Navbar3 logo={logo} />
        </div>
        <section className="relative z-10 container mx-auto px-6 py-10">
          <div className="min-h-[40vh] flex items-center justify-center text-center text-white/70">
            Loading…
          </div>
        </section>
      </main>
    );
  }

  if (!animal) {
    return (
      <main className="relative min-h-screen w-full overflow-hidden bg-[#06080F] text-white">
        <Background accentColor={eraColor} />
        <div className="relative z-20">
          <Navbar3 logo={logo} />
        </div>
        <section className="relative z-10 container mx-auto px-6 py-10">
          <div className="min-h-[40vh] flex items-center justify-center text-center">
            <div className="max-w-md">
              <h1 className="text-2xl font-semibold mb-2">Animal not found</h1>
              <p className="text-white/70 mb-6">
                We couldn't find the requested animal.
              </p>
              <Link to="/era" className="text-blue-400 hover:underline">
                Back to eras
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#06080F] text-white">
      <Background accentColor={eraColor} />
      <div className="relative z-20">
        <Navbar3 logo={logo} />
      </div>

      <section className="relative z-10 container mx-auto px-6 py-20">
        <div className="mb-4">
          <Link
            to={animal.eraId ? `/era/${animal.eraId}` : "/era"}
            className="text-sm text-white/70 hover:text-white/90"
          >
            ← Back to {era?.name ?? "Eras"}
          </Link>
        </div>
        <div className="min-h-[70vh] flex items-start">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start w-full">
            <div>
              <AnimalHeader
                name={animal.name}
                eraColor={eraColor}
                startMa={animal.startMa}
              />

              <p className="text-white/80 leading-relaxed">
                {animal.description}
              </p>

              <AnimalSpecs animal={animal} eraColor={eraColor} />
              {era?.description && (
                <p className="mt-4 text-white/60 text-sm max-w-prose">
                  {era.description}
                </p>
              )}
            </div>

            <div className="md:justify-self-end w-full xl:max-w-xl 2xl:max-w-2xl">
              <Card3D
                animal={animal}
                enableZoom
                minDistance={1.5}
                maxDistance={7}
                widthClass="w-full"
                heightClass="h-[520px] md:h-[520px]"
                modelScale={2.3}
              />
            </div>
          </div>
        </div>

        <EvolutionCarousel currentName={animal.name} eraColor={eraColor} />
      </section>
    </main>
  );
}
