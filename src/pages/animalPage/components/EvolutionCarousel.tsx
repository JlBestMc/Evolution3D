import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getAnimalsByNames } from "@/services/animals";
import { DragSafeCard } from "@/components/card/DragSafeCard";
import { Card3D } from "@/components/card/Card3D";
import { getEvolutionChainFor } from "@/data/evolution";

export function EvolutionCarousel({
  currentName,
  eraColor,
}: {
  currentName: string;
  eraColor: string;
}) {
  const navigate = useNavigate();
  const chain = getEvolutionChainFor(currentName);
  const { data: animalsChain } = useQuery({
    queryKey: ["evolution", chain?.join("->") ?? "none"],
    enabled: !!chain && chain.length > 0,
    queryFn: () => getAnimalsByNames(chain!),
  });

  if (!chain || !animalsChain || animalsChain.length <= 1) return null;

  return (
    <div className="mt-8">
      <h2
        className="text-2xl md:text-2xl font-semibold tracking-tight"
        style={{
          backgroundImage: `linear-gradient(90deg, ${eraColor}, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff, #ffffff)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        Evolution
      </h2>
      <div
        className="mt-2 mb-3 h-[3px] w-24 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${eraColor}, transparent)`,
        }}
      />
      <div className="flex items-center gap-2 overflow-x-auto pb-3">
        {animalsChain.map((a, idx) => (
          <div key={a.id ?? a.name} className="flex items-center gap-1">
            <DragSafeCard
              onActivate={() =>
                navigate(`/animal/${encodeURIComponent(a.name)}`)
              }
            >
              <Card3D
                animal={a}
                widthClass="w-64"
                heightClass="h-[360px]"
                modelScale={1.9}
              />
            </DragSafeCard>
            {idx < animalsChain.length - 1 && (
              <span className="text-white/50">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default EvolutionCarousel;
