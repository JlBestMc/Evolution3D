import { useMemo, type CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, CircleDot, Orbit, Scan, Sparkles } from "lucide-react";
import { eras } from "@/data/eras";
import { ERA_UUIDS, isUuid } from "@/data/eraIds";
import Background from "@/components/ui/background/Background";
import logo from "/images/favicon.ico";
import { Card3D } from "@/features/animals/components/cards/Card3D";
import Navbar3 from "@/components/navbar/Navbar3";
import { getAnimalByName } from "@/services/animals";
import AnimalHeader from "@/features/animals/components/detail/AnimalHeader";
import AnimalSpecs from "@/features/animals/components/detail/AnimalSpecs";
import EvolutionCarousel from "@/features/animals/components/detail/EvolutionCarousel";
import { getEraColor } from "@/services/eras";

export default function AnimalPage() {
  const params = useParams<{ name?: string }>();
  const raw = useMemo(() => {
    if (!params.name) return "";
    try {
      return decodeURIComponent(params.name);
    } catch {
      return params.name;
    }
  }, [params.name]);
  const { data: animal, isLoading, error } = useQuery({
    queryKey: ["animal", raw],
    enabled: !!raw,
    queryFn: () => getAnimalByName(raw),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const eraSlug = useMemo(() => {
    const animalEraId = animal?.eraId;
    if (!animalEraId || !isUuid(animalEraId)) return animalEraId;
    return Object.entries(ERA_UUIDS).find(([, uuid]) => uuid === animalEraId)?.[0];
  }, [animal?.eraId]);
  const era = useMemo(() => eras.find((e) => e.id === eraSlug), [eraSlug]);
  const { data: eraColorFromDb } = useQuery({
    queryKey: ["era-color", animal?.eraId ?? "none"],
    enabled: !!animal?.eraId,
    queryFn: () => getEraColor(animal!.eraId!),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const eraColor = eraColorFromDb ?? era?.color ?? "#6b8cff";
  const eraPath = era ? `/era/${era.id}` : "/era";

  if (isLoading) {
    return (
      <main className="relative min-h-screen w-full overflow-hidden bg-[#06080F] text-white">
        <Background accentColor={eraColor} />
        <div className="relative z-20">
          <Navbar3 logo={logo} />
        </div>
        <section className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid min-h-[50vh] items-center gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="h-4 w-28 animate-pulse rounded-full bg-white/10" />
              <div className="h-14 w-4/5 animate-pulse rounded-2xl bg-white/10" />
              <div className="h-24 w-full animate-pulse rounded-2xl bg-white/[0.06]" />
            </div>
            <div className="h-[420px] animate-pulse rounded-[28px] border border-white/10 bg-white/[0.06]" />
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
        <section className="relative z-10 mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-md text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.06] text-white/50">
              <Sparkles className="h-6 w-6" aria-hidden />
            </div>
            <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">
              Archive lookup
            </p>
            <div className="max-w-md">
              <h1 className="mt-2 text-3xl font-semibold tracking-tight">Animal not found</h1>
              <p className="mt-3 text-white/60">
                {error instanceof Error
                  ? error.message
                  : "We couldn't find the requested animal."}
              </p>
              <Link
                to="/era"
                className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden />
                Back to eras
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="observatory-page relative min-h-screen overflow-hidden bg-[#05090d] text-white" style={{ "--era-color": eraColor } as CSSProperties}>
      <Background accentColor={eraColor} />
      <div className="relative z-30">
        <Navbar3 logo={logo} />
      </div>

      <section className="relative z-10 mx-auto max-w-[1440px] px-4 pb-16 pt-4 sm:px-6 lg:px-10">
        <div className="observatory-meta flex items-center justify-between border-b border-white/10 pb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/45">
          <Link to={eraPath} className="inline-flex items-center gap-2 transition-colors hover:text-white">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            {era?.name ?? "Era archive"}
          </Link>
          <span className="hidden sm:block">Specimen observatory / {animal.name}</span>
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: eraColor, boxShadow: `0 0 12px ${eraColor}` }} />
            Observation active
          </span>
        </div>

        <section className="relative mt-2 min-h-0 overflow-hidden lg:min-h-[min(790px,calc(100dvh-145px))]" aria-labelledby="specimen-heading">
          {era?.image && (
            <img
              src={era.image}
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-screen [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_75%)]"
            />
          )}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[66%] w-[66%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ background: `radial-gradient(circle, ${eraColor}48, transparent 66%)` }} />

          <div className="relative z-20 flex flex-col py-8 lg:min-h-[min(790px,calc(100dvh-145px))] lg:justify-between lg:py-12">
            <div className="relative z-30 order-1 max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/35">Observation {animal.startMa != null ? `${animal.startMa} Ma` : "undated"} / living record</p>
              <AnimalHeader
                name={animal.name}
                eraColor={eraColor}
                startMa={animal.startMa}
                subtitle={animal.subtitle}
                eraName={era?.name}
              />
            </div>

            <div className="pointer-events-none relative z-10 order-2 -mx-4 mt-4 h-[430px] sm:h-[560px] lg:absolute lg:inset-x-0 lg:top-1/2 lg:mx-0 lg:mt-0 lg:h-auto lg:-translate-y-1/2">
             
              <Card3D
                animal={animal}
                enableZoom
                minDistance={1.5}
                maxDistance={7}
                widthClass="w-full"
                heightClass="h-[430px] sm:h-[560px] lg:h-[650px]"
                modelScale={2.3}
                surface="stage"
                showMeta={false}
                className="pointer-events-auto"
              />
            </div>

            <div className="relative z-30 order-3 mt-6 grid gap-6 lg:mt-0 lg:grid-cols-[1fr_auto] lg:items-end">
              <div className="max-w-xl border-l border-white/25 pl-4 sm:pl-5">
                <p className="observatory-meta text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: eraColor }}>Field note</p>
                <p className="mt-3 text-sm leading-7 text-white/65 sm:text-base">{animal.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-x-7 gap-y-3 border-t border-white/15 pt-4 text-xs text-white/55 sm:grid-cols-4 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                <div>
                  <span className="block text-[9px] uppercase tracking-[0.18em] text-white/30">Era</span>
                  <span className="mt-1 block font-medium text-white/80">{era?.name?.replace(" Era", "") ?? "Unknown"}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-[0.18em] text-white/30">Class</span>
                  <span className="mt-1 block font-medium text-white/80">{animal.className ?? "Unrecorded"}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-[0.18em] text-white/30">Diet</span>
                  <span className="mt-1 block font-medium capitalize text-white/80">{animal.diet ?? "Unrecorded"}</span>
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-[0.18em] text-white/30">Mode</span>
                  <span className="mt-1 block font-medium text-white/80">3D model</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute right-2 top-1/2 z-30 hidden -translate-y-1/2 items-center gap-3 text-[10px] font-medium uppercase tracking-[0.18em] text-white/35 lg:flex [writing-mode:vertical-rl]">
            <span>Rotate / inspect / compare</span>
            <span className="h-16 w-px bg-white/20" />
            <Orbit className="h-4 w-4" style={{ color: eraColor }} aria-hidden />
          </div>
          <div className="pointer-events-none absolute bottom-7 right-3 z-30 hidden items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/35 sm:flex">
            <Scan className="h-4 w-4" style={{ color: eraColor }} aria-hidden />
            Interactive specimen
          </div>
        </section>

        <section className="grid gap-12 border-t border-white/10 py-16 lg:grid-cols-[0.68fr_1.32fr] lg:gap-20" aria-labelledby="record-heading">
          <div>
            <p className="observatory-meta text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">Archive record</p>
            <h2 id="record-heading" className="observatory-display mt-3 max-w-sm text-3xl leading-tight tracking-[-0.04em] text-white sm:text-4xl">Evidence in the record.</h2>
            <p className="mt-5 max-w-sm text-sm leading-7 text-white/55">A closer look at the traits, scale and evidence that place this animal in the history of life.</p>
            {era?.description && <p className="mt-8 max-w-sm border-l border-white/15 pl-4 text-xs leading-6 text-white/40">{era.description}</p>}
          </div>
          <AnimalSpecs animal={animal} eraColor={eraColor} />
        </section>

        <section className="border-t border-white/10 pt-14" aria-labelledby="lineage-heading">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="observatory-meta text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">Across the lineage</p>
              <h2 id="lineage-heading" className="observatory-display mt-3 text-3xl tracking-[-0.04em] text-white sm:text-4xl">The line behind it.</h2>
            </div>
            <CircleDot className="hidden h-5 w-5 sm:block" style={{ color: eraColor }} aria-hidden />
          </div>
          <EvolutionCarousel currentName={animal.name} eraColor={eraColor} />
        </section>
      </section>
    </main>
  );
}
