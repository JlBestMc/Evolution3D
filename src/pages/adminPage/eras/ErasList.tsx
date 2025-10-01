export type EraRow = {
  id: string;
  name: string;
  period?: string | null;
};

export default function ErasList({ items, loading, error, onEdit }: {
  items: EraRow[];
  loading: boolean;
  error: string | null;
  onEdit: (row: EraRow) => void;
}) {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <div className="grid grid-cols-12 bg-white/[0.04] text-xs uppercase text-white/60 tracking-wide">
        <div className="col-span-4 p-3">Name</div>
        <div className="col-span-4 p-3">Period</div>
        <div className="col-span-2 p-3">ID</div>
        <div className="col-span-2 p-3 text-right">Actions</div>
      </div>
      {loading ? (
        <div className="p-6 text-white/60 text-sm">Loading…</div>
      ) : error ? (
        <div className="p-6 text-red-400 text-sm">{error}</div>
      ) : items.length === 0 ? (
        <div className="p-6 text-white/60 text-sm">No eras found</div>
      ) : (
        <div className="divide-y divide-white/5">
          {items.map((row) => (
            <div key={row.id} className="grid grid-cols-12 items-center">
              <div className="col-span-4 p-3">
                <div className="font-medium">{row.name}</div>
              </div>
              <div className="col-span-4 p-3">
                <div className="text-white/80 text-xs">{row.period || "-"}</div>
              </div>
              <div className="col-span-2 p-3">
                <span className="inline-flex items-center rounded-full bg-white/[0.06] border border-white/10 px-2 py-0.5 text-xs">
                  {row.id}
                </span>
              </div>
              <div className="col-span-2 p-3 text-right">
                <button
                  className="rounded-md bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 px-2 py-1 text-xs"
                  onClick={() => onEdit(row)}
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
