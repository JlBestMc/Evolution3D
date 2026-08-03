import { memo, type ReactNode } from "react";
import { Dna, MapPin, Ruler } from "lucide-react";
import type { Animal } from "@/data/animals";

function formatValue(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function DataRow({ label, value }: { label: string; value?: string | number }) {
  if (value == null || value === "") return null;
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.07] py-2.5 last:border-0">
      <dt className="observatory-meta text-[10px] uppercase tracking-[0.08em] text-white/45">{label}</dt>
      <dd className="text-right text-sm font-medium text-white/80">{value}</dd>
    </div>
  );
}

function SpecGroup({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Dna;
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-white/15 pt-4">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4" style={{ color: "var(--spec-accent)" }} aria-hidden />
        <h3 className="observatory-display text-sm text-white">{label}</h3>
      </div>
      <dl className="mt-3">{children}</dl>
    </section>
  );
}

export const AnimalSpecs = memo(function AnimalSpecs({
  animal,
  eraColor,
}: {
  animal: Animal;
  eraColor: string;
}) {
  const hasMetrics = [
    animal.lengthM,
    animal.heightM,
    animal.widthM,
    animal.wingspanM,
    animal.weightKg,
  ].some((value) => typeof value === "number");

  return (
    <div
      className="mt-9"
      style={{ "--spec-accent": eraColor } as React.CSSProperties}
    >
      <div className="mb-7 flex items-end justify-between gap-4 border-b border-white/10 pb-4">
        <h2 className="observatory-display text-xl tracking-tight text-white">Field data</h2>
        <span className="observatory-meta text-[10px] uppercase tracking-[0.14em] text-white/35">Recorded attributes</span>
      </div>
      <div className="grid gap-x-8 gap-y-9 sm:grid-cols-2">
        <SpecGroup icon={Dna} label="Taxonomy">
          <DataRow label="Class" value={animal.className} />
          <DataRow label="Order" value={animal.order} />
          <DataRow label="Family" value={animal.family} />
          <DataRow label="Diet" value={animal.diet ? formatValue(animal.diet) : undefined} />
        </SpecGroup>

        <SpecGroup icon={Ruler} label="Measurements">
          {hasMetrics ? (
            <>
              <DataRow label="Length" value={typeof animal.lengthM === "number" ? `${animal.lengthM} m` : undefined} />
              <DataRow label="Height" value={typeof animal.heightM === "number" ? `${animal.heightM} m` : undefined} />
              <DataRow label="Width" value={typeof animal.widthM === "number" ? `${animal.widthM} m` : undefined} />
              <DataRow label="Wingspan" value={typeof animal.wingspanM === "number" ? `${animal.wingspanM} m` : undefined} />
              <DataRow label="Weight" value={typeof animal.weightKg === "number" ? `${animal.weightKg} kg` : undefined} />
            </>
          ) : (
            <p className="py-3 text-xs text-white/40">No measurements recorded.</p>
          )}
        </SpecGroup>

        {animal.discoveryLocation && (
          <div className="sm:col-span-2">
            <SpecGroup icon={MapPin} label="Discovery record">
              <DataRow label="Location" value={animal.discoveryLocation} />
            </SpecGroup>
          </div>
        )}
      </div>
    </div>
  );
});

export default AnimalSpecs;
