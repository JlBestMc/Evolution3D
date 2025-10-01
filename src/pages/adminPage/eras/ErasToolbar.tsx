export default function ErasToolbar({ search, setSearch, onNew }: { search: string; setSearch: (v: string) => void; onNew: () => void }) {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between mb-4">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or period…"
        className="w-[260px] rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
      />
      <button
        onClick={onNew}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-3 py-2 text-sm transition-colors"
      >
        + New Era
      </button>
    </div>
  );
}
