import { memo, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Dna } from "lucide-react";
import { getAnimalsByNames } from "@/services/animals";
import { DragSafeCard } from "@/features/animals/components/cards/DragSafeCard";
import { Card3D } from "@/features/animals/components/cards/Card3D";
import { getEvolutionChainFor } from "@/data/evolution";

export const EvolutionCarousel = memo(function EvolutionCarousel({
  currentName,
  eraColor,
}: {
  currentName: string;
  eraColor: string;
}) {
  const navigate = useNavigate();
  const chain = useMemo(() => getEvolutionChainFor(currentName), [currentName]);
  const { data: animalsChain } = useQuery({
    queryKey: ["evolution", chain?.join("->") ?? "none"],
    enabled: !!chain && chain.length > 0,
    queryFn: () => getAnimalsByNames(chain!, { summary: true }),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  if (!chain || !animalsChain || animalsChain.length <= 1) return null;

  return (
    <section aria-labelledby="evolution-heading">
      <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <p className="observatory-meta inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
            <Dna className="h-3.5 w-3.5" style={{ color: eraColor }} aria-hidden />
            Lineage archive
          </p>
          <h2 id="evolution-heading" className="observatory-display mt-2 text-2xl tracking-tight text-white sm:text-3xl">
            Evolutionary thread
          </h2>
        </div>
        <span className="hidden text-xs text-white/40 sm:block">
          {animalsChain.length} linked specimens
        </span>
      </div>
      <div className="carousel-scroll relative -mx-4 flex items-start gap-0 overflow-x-auto px-4 pb-4 pt-7 sm:-mx-6 sm:px-6">
        <div className="pointer-events-none absolute left-0 right-0 top-[150px] h-px bg-white/15" aria-hidden />
        {animalsChain.map((a) => (
          <div key={a.id ?? a.name} className="relative flex w-[220px] shrink-0 flex-col items-center">
            <DragSafeCard
              onActivate={() =>
                navigate(`/animal/${encodeURIComponent(a.name)}`)
              }
            >
              <Card3D
                animal={a}
                widthClass="w-[210px]"
                heightClass="h-[250px]"
                modelScale={1.7}
                surface="stage"
                showMeta={false}
                autoRotate={false}
                rootMargin="120px"
                className={a.name === currentName ? "opacity-100" : "opacity-60 transition-opacity hover:opacity-90"}
              />
            </DragSafeCard>
            <span className={`relative z-10 mt-1 grid h-3 w-3 place-items-center rounded-full border-2 border-[#05090d] ${a.name === currentName ? "scale-125" : ""}`} style={{ backgroundColor: a.name === currentName ? eraColor : "rgba(255,255,255,0.5)", boxShadow: a.name === currentName ? `0 0 14px ${eraColor}` : "none" }} aria-hidden />
            <span className={`mt-3 max-w-[190px] text-center text-sm font-medium ${a.name === currentName ? "text-white" : "text-white/45"}`}>{a.name}</span>
            {a.startMa != null && <span className="observatory-meta mt-1 text-[10px] uppercase tracking-[0.14em] text-white/30">{a.startMa} Ma</span>}
          </div>
        ))}
      </div>
    </section>
  );
});

export default EvolutionCarousel;
