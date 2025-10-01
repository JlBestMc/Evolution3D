import type { Animal } from "@/data/animals";

export type DbAnimal = Animal & { id?: string };

export default function AnimalsList({ items, loading, error, onEdit }: {
  items: DbAnimal[];
  loading: boolean;
  error: string | null;
  onEdit: (a: DbAnimal) => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <div className="grid grid-cols-12 bg-white/[0.04] text-xs uppercase text-white/60 tracking-wide">
        <div className="col-span-3 p-3">Name</div>
        <div className="col-span-2 p-3">Era</div>
        <div className="col-span-2 p-3">Start (Ma)</div>
        <div className="col-span-3 p-3">Model URL</div>
        <div className="col-span-2 p-3 text-right">Actions</div>
      </div>
      {loading ? (
        <div className="p-6 text-white/60 text-sm">Loading…</div>
      ) : error ? (
        <div className="p-6 text-red-400 text-sm">{error}</div>
      ) : items.length === 0 ? (
        <div className="p-6 text-white/60 text-sm">No animals found</div>
      ) : (
        <div className="divide-y divide-white/5">
          {items.map((a) => (
            <div key={a.id ?? a.name} className="grid grid-cols-12 items-center">
              <div className="col-span-3 p-3">
                <div className="font-medium">{a.name}</div>
                {a.subtitle && <div className="text-xs text-white/60">{a.subtitle}</div>}
              </div>
              <div className="col-span-2 p-3">
                <span className="inline-flex items-center rounded-full bg-white/[0.06] border border-white/10 px-2 py-0.5 text-xs">
                  {mapEraIdToName(a.eraId) ?? "-"}
                </span>
              </div>
              <div className="col-span-2 p-3">
                <div className="text-white/80 text-xs">
                  {a.startMa != null ? a.startMa : "-"}
                </div>
              </div>
              <div className="col-span-3 p-3">
                <div className="truncate text-white/80 text-xs">{a.model ?? "-"}</div>
              </div>
              <div className="col-span-2 p-3 text-right">
                <button
                  className="rounded-md bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 px-2 py-1 text-xs"
                  onClick={() => onEdit(a)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function mapEraIdToName(eraId?: string) {
  const map: Record<string, string> = {
    "fa623e10-ea07-4ad0-a4da-6b469ea2016b": "Precambrian",
    "1a148d60-41df-4477-aa02-1d5d36ddc5a5": "Paleozoic",
    "7809661c-0b73-48f6-9c52-7e05b2e80cba": "Mesozoic",
    "854cf820-50b8-4a21-a87d-1f6a7738f5c0": "Cenozoic",
  };
  return eraId ? map[eraId] ?? eraId : undefined;
}
