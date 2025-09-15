import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import animals from "../../data/animals";
import { eras } from "../../data/eras";
import Navbar from "../../components/navbar/Navbar";
import PremiumBackground from "../../components/ui/backgrounds/Background";
import logo from "/images/logo3D.png";
import { Card3D } from "../../components/ui/card/Card3D";

export default function AnimalPage() {
  const params = useParams<{ name?: string }>();
  const raw = params.name ? decodeURIComponent(params.name) : "";
  const animal = useMemo(() => {
    const lower = raw.toLowerCase();
    return animals.find((a) => a.name.toLowerCase() === lower);
  }, [raw]);

  const era = useMemo(() => eras.find((e) => e.id === animal?.eraId), [animal]);
  const eraColor = era?.color ?? "#6b8cff";

  if (!animal) {
    return (
      <main className="relative min-h-screen w-full overflow-hidden bg-[#06080F] text-white">
        <PremiumBackground accentColor={eraColor} />
        <div className="relative z-20">
          <Navbar
            aStyles="cursor-pointer"
            variantButton="secondary"
            logo={logo}
            borderColor="border-white/30"
          />
        </div>
        <section className="relative z-10 container mx-auto px-6 py-10">
          <div className="min-h-[40vh] flex items-center justify-center text-center">
            <div className="max-w-md">
              <h1 className="text-2xl font-semibold mb-2">Animal not found</h1>
              <p className="text-white/70 mb-6">We couldn't find the requested animal.</p>
              <Link to="/era" className="text-blue-400 hover:underline">Back to eras</Link>
            </div>
          </div>
        </section>
      </main>
    );
}

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#06080F] text-white">
      <PremiumBackground accentColor={eraColor} />
      <div className="relative z-20">
        <Navbar
          aStyles="cursor-pointer"
          variantButton="secondary"
          logo={logo}
          borderColor="border-white/30"
        />
      </div>

      <section className="relative z-10 container mx-auto px-6 py-10">
        <header className="mb-8">
          <Link
            to={animal.eraId ? `/era/${animal.eraId}` : "/era"}
            className="text-sm text-white/70 hover:text-white/90"
          >
            ← Back to {era?.name ?? "Eras"}
          </Link>
          <h1
            className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight"
            style={{
              background: `linear-gradient(90deg, ${eraColor}, #ffffff)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            {animal.name}
          </h1>
          <div
            className="mt-3 h-[3px] w-24 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${eraColor}, transparent)`,
            }}
          />
          {animal.startMa != null && (
            <p className="mt-1 text-white/70 text-sm">
              ≈ {animal.startMa >= 1000
                ? `${(animal.startMa / 1000).toFixed(animal.startMa % 1000 ? 1 : 0)} Ga`
                : `${animal.startMa < 1
                    ? animal.startMa.toFixed(2)
                    : Number.isInteger(animal.startMa)
                    ? animal.startMa.toFixed(0)
                    : animal.startMa.toFixed(1)
                  } Ma`}
            </p>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: info */}
          <div>
            <p className="text-white/80 leading-relaxed">{animal.description}</p>
            {era?.description && (
              <p className="mt-4 text-white/60 text-sm max-w-prose">{era.description}</p>
            )}
          </div>

          {/* Right: larger, zoomable card */}
          <div className="md:justify-self-end w-full max-w-2xl">
            <Card3D
              animal={animal}
              enableZoom
              minDistance={1.5}
              maxDistance={6}
              widthClass="w-full"
              heightClass="h-[520px] md:h-[620px]"
              modelScale={3.0}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
