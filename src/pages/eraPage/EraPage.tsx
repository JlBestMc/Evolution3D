import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Dna,
  ChevronRight,
  CircleDot,
  Cloud,
  Compass,
  Globe2,
  Heart,
  Mountain,
  Share2,
  Sparkles,
  Sprout,
  Waves,
} from "lucide-react";
import { eras } from "@/data/eras";
import { ERA_UUIDS, isUuid } from "@/data/eraIds";
import { Link, useNavigate, useParams } from "react-router-dom";
import Background from "@/components/ui/background/Background";
import { Card3D } from "@/features/animals/components/cards/Card3D";
import { DragSafeCard } from "@/features/animals/components/cards/DragSafeCard";
import { getAnimals, getAnimalsByEra } from "@/services/animals";
import { getEraColor } from "@/services/eras";

export default function EraPage() {
  const params = useParams<{ eraId?: string }>();
  const eraId = params.eraId ?? "";
  const eraSlug = useMemo(() => {
    if (!isUuid(eraId)) return eraId;
    return Object.entries(ERA_UUIDS).find(([, uuid]) => uuid === eraId)?.[0] ?? eraId;
  }, [eraId]);
  const eraObj = useMemo(() => eras.find((e) => e.id === eraSlug), [eraSlug]);
  const eraIndex = eras.findIndex((era) => era.id === eraSlug);
  const previousEra = eraIndex > 0 ? eras[eraIndex - 1] : undefined;
  const nextEra = eraIndex >= 0 ? eras[eraIndex + 1] : undefined;
  const { data: eraColorFromDb } = useQuery({
    queryKey: ["era-color", eraId],
    enabled: !!eraId,
    queryFn: () => getEraColor(eraId),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
  const eraColor = eraColorFromDb ?? eraObj?.color ?? "#6b8cff";

  const {
    data: fetchedAnimals,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["animals", eraId || "all"],
    queryFn: () =>
      eraId ? getAnimalsByEra(eraId, { summary: true }) : getAnimals({ summary: true }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const animals = useMemo(() => {
    const arr = fetchedAnimals ?? [];
    return arr.slice().sort((a, b) => (b.startMa ?? 0) - (a.startMa ?? 0));
  }, [fetchedAnimals]);

  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const heroImage = eraObj?.image ?? "/images/mesozoic.png";
  const featuredAnimals = useMemo(() => animals.slice(0, 3), [animals]);

  const handleShare = async () => {
    const shareData = {
      title: eraObj?.name ?? "Evolution3D era",
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData).catch(() => undefined);
      return;
    }

    await navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
  };

  const scrollToSection = (id: string) => {
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    document.getElementById(id)?.scrollIntoView({ behavior, block: "start" });
  };

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
    <main className="observatory-page relative min-h-screen overflow-hidden bg-[#05090d] text-white" style={{ "--era-color": eraColor } as CSSProperties}>
      <Background accentColor={eraColor} />
      <section className="relative z-10 isolate min-h-[100dvh] overflow-hidden" aria-labelledby="era-title">
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full origin-top-right object-cover object-[58%_28%] lg:object-right-top lg:scale-[1.1]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,5,6,0.98)_0%,rgba(1,5,6,0.88)_22%,rgba(1,5,6,0.45)_36%,rgba(1,5,6,0.12)_48%,transparent_62%)]" />
        <div className="absolute bottom-0 left-0 h-[48%] w-[64%] bg-[linear-gradient(180deg,transparent_0%,rgba(1,5,6,0.92)_100%)]" />

        <header className="absolute inset-x-0 top-0 z-20 mx-auto flex max-w-none items-center justify-between px-5 pt-5 sm:px-8 lg:px-8 lg:pt-6">
          <Link to="/timeline" className="observatory-meta inline-flex items-center gap-2 text-xs font-semibold text-white/85 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 lg:text-sm">
            <ArrowLeft className="size-4" aria-hidden />
            <span>Back to Timeline</span>
          </Link>

          <div className="observatory-meta absolute left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs font-semibold text-white/60 sm:flex lg:text-sm">
            <span>Timeline</span>
            <ChevronRight className="size-3.5 text-white/30" aria-hidden />
            <span>{eraObj?.name ?? "Geological era"}</span>
            <ChevronRight className="size-3.5 text-white/30" aria-hidden />
            <span style={{ color: eraColor }}>{eraObj?.transition ?? "Deep time"}</span>
          </div>

          <div className="flex items-center gap-1">
            <button type="button" aria-label={saved ? "Remove era from saved records" : "Save era"} aria-pressed={saved} onClick={() => setSaved((value) => !value)} className="grid size-9 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 lg:size-10">
              <Heart className={`size-[18px] lg:size-5 ${saved ? "fill-current" : ""}`} style={{ color: saved ? eraColor : undefined }} aria-hidden />
            </button>
            <button type="button" aria-label="Share era" onClick={handleShare} className="grid size-9 place-items-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 lg:size-10">
              <Share2 className="size-[18px] lg:size-5" aria-hidden />
            </button>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-none flex-col justify-start gap-7 px-5 pb-4 pt-24 sm:px-8 sm:pb-6 lg:gap-0 lg:px-16 lg:pb-0 lg:pt-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_19rem]">
            <article className="max-w-[44rem] self-start lg:pt-2">
              <span className="observatory-meta inline-flex rounded-full border border-white/15 bg-[#071216]/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70 backdrop-blur-md lg:px-3.5 lg:py-2 lg:text-xs">
                {eraObj?.name ?? "Geological era"}
              </span>
              <h1 id="era-title" className="observatory-display mt-4 max-w-3xl text-5xl leading-[0.92] tracking-[-0.06em] text-white sm:text-7xl lg:mt-4 lg:text-[clamp(4rem,5.2vw,5.2rem)] lg:leading-[0.96]">
                {eraObj?.name?.replace(" Era", "") ?? "All life"}
              </h1>
              <p className="observatory-meta mt-3 text-base font-semibold text-white/70 sm:text-lg lg:text-lg" style={{ color: eraColor }}>
                {eraObj?.period ?? "A record in deep time"}
              </p>
              <div className="observatory-meta mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/50 lg:text-sm">
                <span>{eraObj?.environment ?? "Changing habitats"}</span>
                <span aria-hidden className="text-white/25">/</span>
                <span>{eraObj?.duration ?? "A long interval in deep time"}</span>
              </div>
              <h2 className="observatory-display mt-5 text-2xl font-medium tracking-[-0.025em] sm:text-3xl lg:mt-5 lg:text-[2rem]" style={{ color: eraColor }}>
                {eraObj?.milestone ?? eraObj?.transition ?? "Life changes course"}
              </h2>
              <p className="mt-3 max-w-[34rem] text-base leading-6 text-white/80 sm:text-lg sm:leading-7 lg:text-[17px] lg:leading-7">
                {eraObj?.description ?? "A living index of Earth's biological history."}{eraObj?.legacy ? ` ${eraObj.legacy}` : ""}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button type="button" onClick={() => scrollToSection("specimens-heading")} className="inline-flex items-center gap-2 rounded-lg px-4 py-3 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#071013] lg:min-h-16 lg:px-7 lg:py-5 lg:text-base" style={{ backgroundColor: eraColor }}>
                  <Dna className="size-4 lg:size-[18px]" aria-hidden />
                  Begin Exploration
                </button>
                <button type="button" onClick={() => scrollToSection("world-heading")} className="inline-flex items-center gap-2 rounded-lg border border-white/30 bg-black/20 px-4 py-3 text-xs font-semibold text-white/90 backdrop-blur-sm transition-colors hover:border-white/70 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 lg:min-h-16 lg:px-7 lg:py-5 lg:text-base">
                  <Compass className="size-4 lg:size-[18px]" aria-hidden />
                  View Environment
                </button>
              </div>
            </article>

            <aside className="w-full max-w-sm self-start rounded-xl border border-white/10 bg-[#061016]/80 p-4 backdrop-blur-xl lg:mt-12 lg:max-w-[19rem] lg:justify-self-end lg:p-6" aria-labelledby="snapshot-heading">
              <p id="snapshot-heading" className="observatory-meta text-xs font-semibold uppercase tracking-[0.14em] lg:text-sm" style={{ color: eraColor }}>Era snapshot</p>
              <div className="mt-3 divide-y divide-white/10">
                {[
                  { label: "Environment", value: eraObj?.environment ?? "Changing habitats", Icon: Waves },
                  { label: "Atmosphere", value: eraObj?.climate ?? "A changing atmosphere", Icon: Cloud },
                  { label: "Dominant life", value: eraObj?.life ?? "Early life", Icon: Sprout },
                  { label: "Land", value: eraObj?.transition ?? "Life changes course", Icon: Mountain },
                ].map(({ label, value, Icon }) => (
                  <div key={label} className="grid grid-cols-[1.25rem_1fr] gap-3 py-3 first:pt-0 last:pb-0">
                    <Icon className="mt-0.5 size-4" style={{ color: eraColor }} aria-hidden />
                    <div>
                      <h3 className="text-sm font-medium text-white/85">{label}</h3>
                      <p className="mt-1 text-xs leading-5 text-white/55 lg:text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          <div className="grid min-w-0 gap-3 lg:absolute lg:inset-x-16 lg:bottom-5 lg:items-end lg:gap-5 lg:grid-cols-[minmax(0,0.93fr)_minmax(0,1fr)]">
            <div className="flex flex-col gap-3 lg:gap-7">
              <div className="grid grid-cols-2 divide-x divide-white/10 rounded-xl border border-white/10 bg-[#061016]/80 px-3 py-3 backdrop-blur-xl sm:grid-cols-4 lg:px-5 lg:py-4">
                {[
                  { value: eraObj?.duration?.replace("≈ ", "") ?? "Deep time", label: "Duration", Icon: CalendarDays },
                  { value: isLoading ? "—" : String(animals.length), label: "Featured species", Icon: Dna },
                  { value: String(eraObj?.highlights?.length ?? 0), label: "Major events", Icon: Sparkles },
                  { value: eraObj?.transition ?? "Life changes", label: "Signature shift", Icon: CircleDot },
                ].map(({ value, label, Icon }) => (
                  <div key={label} className="flex min-w-0 gap-2 px-2 first:pl-0 last:pr-0 sm:px-3">
                    <Icon className="mt-0.5 hidden size-4 shrink-0 sm:block lg:size-5" style={{ color: eraColor }} aria-hidden />
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-white lg:text-lg">{value}</p>
                      <p className="mt-0.5 truncate text-xs text-white/50 lg:text-sm">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <section className="rounded-xl border border-white/10 bg-[#061016]/80 p-3 backdrop-blur-xl sm:p-4 lg:min-h-[clamp(11rem,21.8dvh,13rem)] lg:p-5" aria-labelledby="era-path-heading">
                <p id="era-path-heading" className="observatory-meta text-xs font-semibold uppercase tracking-[0.14em] lg:text-sm" style={{ color: eraColor }}>Where we are in time</p>
                <div className="relative mt-5 grid grid-cols-4 gap-2">
                  <div className="absolute left-[8%] right-[8%] top-[3.8125rem] h-px bg-white/20" />
                  {eras.map((era, index) => {
                    const active = era.id === eraSlug;
                    return (
                      <Link key={era.id} to={`/era/${era.id}`} className="group relative z-10 min-w-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
                        <p className={`truncate text-xs font-medium lg:text-sm ${active ? "text-white" : "text-white/55"}`}>{era.name.replace(" Era", "")}</p>
                        <p className="mt-0.5 truncate text-[10px] text-white/40 lg:text-xs">{era.period}</p>
                        <span className="mx-auto mt-4 block size-3.5 rounded-full border-2 bg-[#061016] transition-transform group-hover:scale-125" style={{ borderColor: active ? eraColor : "#6b7378", boxShadow: active ? `0 0 0 4px ${eraColor}22` : "none" }} />
                        {active && <span className="mx-auto mt-1 block h-1 w-8 rounded-full" style={{ backgroundColor: eraColor }} aria-label={`Current era ${index + 1}`} />}
                      </Link>
                    );
                  })}
                </div>
              </section>
            </div>

            <section className="min-w-0 rounded-xl border border-white/10 bg-[#061016]/80 p-3 backdrop-blur-xl sm:p-4 lg:p-5" aria-labelledby="featured-heading">
              <div className="flex items-center justify-between gap-3">
                <p id="featured-heading" className="observatory-meta text-xs font-semibold uppercase tracking-[0.14em] lg:text-sm" style={{ color: eraColor }}>Featured species</p>
                <button type="button" onClick={() => scrollToSection("specimens-heading")} className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-white/65 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80">
                  View all species <ArrowRight className="size-3.5" aria-hidden />
                </button>
              </div>
              {isLoading ? (
                <div className="carousel-scroll -mx-1 mt-5 flex gap-3 overflow-x-auto px-1 pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
                  {[0, 1, 2].map((item) => <div key={item} className="h-44 min-w-[15rem] animate-pulse rounded-lg border border-white/10 bg-white/[0.04] sm:min-w-0" />)}
                </div>
              ) : featuredAnimals.length > 0 ? (
                <div className="carousel-scroll -mx-1 mt-5 flex gap-3 overflow-x-auto px-1 pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
                  {featuredAnimals.map((animal) => (
                    <Link key={animal.id ?? animal.name} to={`/animal/${encodeURIComponent(animal.name)}`} aria-label={`Open ${animal.name}`} className="group min-w-[15rem] snap-start overflow-hidden rounded-lg border border-white/10 bg-black/20 transition-colors hover:border-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 sm:min-w-0">
                      <Card3D animal={animal} widthClass="w-full" heightClass="h-32 sm:h-32 lg:h-[clamp(10rem,calc(28dvh_-_3rem),13rem)]" modelScale={2.4} showMeta={false} autoRotate rootMargin="80px" />
                      <div className="border-t border-white/10 px-3 py-2">
                        <p className="truncate text-sm font-semibold text-white">{animal.name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="mt-3 rounded-lg border border-white/10 px-3 py-5 text-center text-xs text-white/50">No featured species are indexed yet.</p>
              )}
            </section>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1440px] px-4 pb-12 sm:px-6 lg:px-10">

        <nav className="border-y border-white/10 py-3" aria-label="Navigate geological eras">
          <div className="flex items-center gap-4 overflow-x-auto pb-1">
            {eras.map((era, index) => {
              const active = era.id === eraSlug;
              return (
                <Link
                  key={era.id}
                  to={`/era/${era.id}`}
                  className={`group flex min-w-max items-center gap-3 py-2 text-xs transition-colors ${active ? "text-white" : "text-white/35 hover:text-white/75"}`}
                >
                  <span className="h-2 w-2 rounded-full border transition-transform group-hover:scale-125" style={{ borderColor: era.color, backgroundColor: active ? era.color : "transparent", boxShadow: active ? `0 0 12px ${era.color}` : "none" }} />
                  <span>{String(index + 1).padStart(2, "0")} {era.name.replace(" Era", "")}</span>
                  {active && <ChevronRight className="h-3.5 w-3.5" style={{ color: era.color }} aria-hidden />}
                </Link>
              );
            })}
          </div>
        </nav>

        {eraObj && (
          <section className="grid gap-10 border-b border-white/10 py-14 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20" aria-labelledby="world-heading">
            <div>
              <p className="observatory-meta text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">The world around it</p>
              <h2 id="world-heading" className="observatory-display mt-3 max-w-sm text-3xl leading-tight tracking-[-0.035em] text-white sm:text-4xl">
                A planet in transition.
              </h2>
              <p className="mt-5 max-w-sm text-sm leading-7 text-white/55">{eraObj.legacy}</p>
            </div>
            <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
              <div className="border-t border-white/15 pt-4">
                <Globe2 className="h-4 w-4" style={{ color: eraColor }} aria-hidden />
                <h3 className="mt-4 text-sm font-semibold text-white">Environment</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">{eraObj.climate}</p>
              </div>
              <div className="border-t border-white/15 pt-4">
                <Sprout className="h-4 w-4 text-emerald-300" aria-hidden />
                <h3 className="mt-4 text-sm font-semibold text-white">Living world</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">{eraObj.life}</p>
              </div>
              <div className="border-t border-white/15 pt-4">
                <Sparkles className="h-4 w-4 text-amber-300" aria-hidden />
                <h3 className="mt-4 text-sm font-semibold text-white">Defining event</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">{eraObj.milestone}</p>
              </div>
              <div className="border-t border-white/15 pt-4">
                <Waves className="h-4 w-4" style={{ color: eraColor }} aria-hidden />
                <h3 className="mt-4 text-sm font-semibold text-white">The shift</h3>
                <p className="mt-2 text-sm leading-6 text-white/55">{eraObj.transition}</p>
              </div>
            </div>
          </section>
        )}

        <section className="pt-14" aria-labelledby="specimens-heading">
          <div className="flex items-end justify-between gap-5">
            <div>
              <p className="observatory-meta text-[10px] font-semibold uppercase tracking-[0.18em] text-white/35">The observation trail</p>
              <h2 id="specimens-heading" className="observatory-display mt-3 text-3xl tracking-[-0.035em] text-white sm:text-4xl">The living index.</h2>
            </div>
            {eraObj && (
              <div className="flex items-center gap-2">
                <button type="button" aria-label={`Open ${previousEra?.name ?? "previous era"}`} title={previousEra?.name ?? "First era"} disabled={!previousEra} onClick={() => previousEra && navigate(`/era/${previousEra.id}`)} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/55 transition hover:border-white/30 hover:text-white disabled:pointer-events-none disabled:opacity-20">
                  <ArrowLeft className="h-4 w-4" aria-hidden />
                </button>
                <button type="button" aria-label={`Open ${nextEra?.name ?? "next era"}`} title={nextEra?.name ?? "Last era"} disabled={!nextEra} onClick={() => nextEra && navigate(`/era/${nextEra.id}`)} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-white/55 transition hover:border-white/30 hover:text-white disabled:pointer-events-none disabled:opacity-20">
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </button>
              </div>
            )}
          </div>
          {isLoading && <div className="mt-6 h-[360px] animate-pulse border-y border-white/10 bg-white/[0.03]" />}
          {error && <div className="mt-6 border-y border-red-300/20 bg-red-400/10 px-4 py-4 text-sm text-red-100">{String((error as Error)?.message || error)}</div>}
          {!isLoading && !error && animals.length === 0 && <div className="mt-6 border-y border-white/10 py-12 text-center text-sm text-white/45">No specimens are currently registered for this era.</div>}
          {!isLoading && !error && animals.length > 0 && (
            <div ref={scrollRef} className="carousel-scroll -mx-4 mt-5 flex gap-4 overflow-x-auto px-4 pb-5 pt-2 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10" aria-label="3D animals carousel">
              {animals.map((animal) => (
                <DragSafeCard key={animal.id ?? animal.name} onActivate={() => navigate(`/animal/${encodeURIComponent(animal.name)}`)}>
                  <Card3D animal={animal} heightClass="h-[400px] md:h-[440px]" widthClass="w-[min(80vw,360px)] md:w-[360px]" autoRotate rootMargin="160px" />
                </DragSafeCard>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
