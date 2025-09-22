import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import animals from "../../data/animals";
import { eras } from "../../data/eras";
import Background from "../../components/ui/background/Background";
import logo from "/images/favicon.ico";
import { Card3D } from "../../components/ui/card/Card3D";
import Navbar3 from "../../components/navbar/Navbar3";

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

      <section className="relative z-10 container mx-auto px-6 py-5 pt-15">
        {/* Moved Back link above the grid */}
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
            {/* Left: header + info */}
            <div>
              <header className="mb-4">
                <h1
                  className=" text-3xl md:text-4xl font-semibold tracking-tight"
                  style={{
                    background: `linear-gradient(90deg, ${eraColor}, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff)`,
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
                    ≈{" "}
                    {animal.startMa >= 1000
                      ? `${(animal.startMa / 1000).toFixed(
                          animal.startMa % 1000 ? 1 : 0
                        )} Ga`
                      : `${
                          animal.startMa < 1
                            ? animal.startMa.toFixed(2)
                            : Number.isInteger(animal.startMa)
                            ? animal.startMa.toFixed(0)
                            : animal.startMa.toFixed(1)
                        } Ma`}
                  </p>
                )}
              </header>

              <p className="text-white/80 leading-relaxed">
                {animal.description}
              </p>

              {/* Specs: taxonomy + metrics + discovery */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {/* Taxonomy */}
                <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4 hover:border-white/20 transition-colors">
                  <h3 className="text-white font-semibold">Taxonomy</h3>
                  <div
                    className="mt-1 mb-2 h-[3px] w-20 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${eraColor}, transparent)`,
                    }}
                  />
                  <ul className="space-y-1 text-white/80 list-disc pl-5">
                    {animal.className && (
                      <li>
                        <span className="font-semibold text-white">
                          Class:{" "}
                        </span>
                        {animal.className}
                      </li>
                    )}
                    {animal.order && (
                      <li>
                        <span className="font-semibold text-white">
                          Order:{" "}
                        </span>
                        {animal.order}
                      </li>
                    )}
                    {animal.family && (
                      <li>
                        <span className="font-semibold text-white">
                          Family:{" "}
                        </span>
                        {animal.family}
                      </li>
                    )}
                    {animal.diet && (
                      <li>
                        <span className="font-semibold text-white">Diet: </span>
                        {animal.diet}
                      </li>
                    )}
                  </ul>
                </div>

                {/* Metrics */}
                <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4 hover:border-white/20 transition-colors">
                  <h3 className="text-white font-semibold">Metrics</h3>
                  <div
                    className="mt-1 mb-2 h-[3px] w-20 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${eraColor}, transparent)`,
                    }}
                  />
                  <ul className="space-y-1 text-white/80 list-disc pl-5">
                    {typeof animal.lengthM === "number" && (
                      <li>
                        <span className="font-semibold text-white">
                          Length:{" "}
                        </span>
                        {animal.lengthM} m
                      </li>
                    )}
                    {typeof animal.heightM === "number" && (
                      <li>
                        <span className="font-semibold text-white">
                          Height:{" "}
                        </span>
                        {animal.heightM} m
                      </li>
                    )}
                    {typeof animal.widthM === "number" && (
                      <li>
                        <span className="font-semibold text-white">
                          Width:{" "}
                        </span>
                        {animal.widthM} m
                      </li>
                    )}
                    {typeof animal.wingspanM === "number" && (
                      <li>
                        <span className="font-semibold text-white">
                          Wingspan:{" "}
                        </span>
                        {animal.wingspanM} m
                      </li>
                    )}
                    {typeof animal.weightKg === "number" && (
                      <li>
                        <span className="font-semibold text-white">
                          Weight:{" "}
                        </span>
                        {animal.weightKg} kg
                      </li>
                    )}
                  </ul>
                </div>

                {/* Discovery */}
                {animal.discoveryLocation && (
                  <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4 sm:col-span-2 hover:border-white/20 transition-colors">
                    <h3 className="text-white font-semibold">Discovery</h3>
                    <div
                      className="mt-1 mb-2 h-[3px] w-20 rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${eraColor}, transparent)`,
                      }}
                    />
                    <ul className="list-disc pl-5 text-white/80">
                      <li>
                        <span className="font-semibold text-white">
                          Location:{" "}
                        </span>
                        {animal.discoveryLocation}
                      </li>
                    </ul>
                  </div>
                )}
              </div>
              {era?.description && (
                <p className="mt-4 text-white/60 text-sm max-w-prose">
                  {era.description}
                </p>
              )}
            </div>

            {/* Right: larger, zoomable card */}
            <div className="md:justify-self-end w-full max-w-2xl">
              <Card3D
                animal={animal}
                enableZoom
                minDistance={1.5}
                maxDistance={7}
                widthClass="w-full"
                heightClass="h-[520px] md:h-[560px]"
                modelScale={2.3}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
