export type EraForm = { id?: string; name?: string; period?: string | null };

export default function ErasEditModal({
  open,
  form,
  setForm,
  errors,
  saving,
  onClose,
  onSave,
  mode = "edit",
}: {
  open: boolean;
  form: Partial<EraForm>;
  setForm: (updater: (prev: Partial<EraForm>) => Partial<EraForm>) => void;
  errors: { id?: string; name?: string } | null;
  saving: boolean;
  onClose: () => void;
  onSave: () => void;
  mode?: "create" | "edit";
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-[#0B0F17] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <h3 className="text-lg font-semibold">
            {mode === "create" ? "Create Era" : "Edit Era"}
          </h3>
          <button onClick={onClose} className="text-white/70 hover:text-white px-2 py-1" aria-label="Close">✕</button>
        </div>
        <div className="p-5 space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium">ID</label>
            <input
              disabled={mode === "edit"}
              className="w-full rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
              value={form.id ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
            />
            {errors?.id && <p className="text-xs text-red-400">{errors.id}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <input
              className="w-full rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
              value={form.name ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
            {errors?.name && <p className="text-xs text-red-400">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Period</label>
            <input
              className="w-full rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
              value={form.period ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
            />
          </div>
        </div>
        <div className="px-5 py-3 border-t border-white/10 flex justify-end gap-2 bg-white/[0.02]">
          <button onClick={onClose} className="rounded-lg border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] px-4 py-2 text-sm">Cancel</button>
          <button disabled={saving} onClick={onSave} className="rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black font-medium px-4 py-2 text-sm">
            {saving ? (mode === "create" ? "Creating…" : "Saving…") : (mode === "create" ? "Create" : "Save")}
          </button>
        </div>
      </div>
    </div>
  );
}
