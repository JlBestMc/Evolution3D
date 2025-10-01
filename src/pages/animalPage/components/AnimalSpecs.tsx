import type { Animal } from "@/data/animals";

export function AnimalSpecs({
  animal,
  eraColor,
}: {
  animal: Animal;
  eraColor: string;
}) {
  return (
    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
              <span className="font-semibold text-white">Class: </span>
              {animal.className}
            </li>
          )}
          {animal.order && (
            <li>
              <span className="font-semibold text-white">Order: </span>
              {animal.order}
            </li>
          )}
          {animal.family && (
            <li>
              <span className="font-semibold text-white">Family: </span>
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
              <span className="font-semibold text-white">Length: </span>
              {animal.lengthM} m
            </li>
          )}
          {typeof animal.heightM === "number" && (
            <li>
              <span className="font-semibold text-white">Height: </span>
              {animal.heightM} m
            </li>
          )}
          {typeof animal.widthM === "number" && (
            <li>
              <span className="font-semibold text-white">Width: </span>
              {animal.widthM} m
            </li>
          )}
          {typeof animal.wingspanM === "number" && (
            <li>
              <span className="font-semibold text-white">Wingspan: </span>
              {animal.wingspanM} m
            </li>
          )}
          {typeof animal.weightKg === "number" && (
            <li>
              <span className="font-semibold text-white">Weight: </span>
              {animal.weightKg} kg
            </li>
          )}
        </ul>
      </div>

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
              <span className="font-semibold text-white">Location: </span>
              {animal.discoveryLocation}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default AnimalSpecs;
