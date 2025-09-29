import UploadModelField from "@/components/admin/UploadModelField";
import type { Animal } from "@/data/animals";

export type DbAnimal = Animal & { id?: string };

export default function AnimalsEditModal({
  open,
  originalId,
  form,
  setForm,
  errors,
  saving,
  onClose,
  onSave,
  mode = "edit",
}: {
  open: boolean;
  originalId?: string | null;
  form: Partial<DbAnimal>;
  setForm: (updater: (prev: Partial<DbAnimal>) => Partial<DbAnimal>) => void;
  errors: { name?: string; eraId?: string } | null;
  saving: boolean;
  onClose: () => void;
  onSave: () => void;
  mode?: "create" | "edit";
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-4xl rounded-2xl border border-white/10 bg-[#0B0F17] p-0 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold">{mode === "create" ? "Crear animal" : "Editar animal"}</h3>
            {originalId && (
              <span className="text-[11px] rounded-md bg-white/[0.06] border border-white/10 px-2 py-0.5 text-white/70 font-mono">
                id: {originalId}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white px-2 py-1" aria-label="Close">✕</button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Básico */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white/80">Básico</h4>
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre</label>
              <input
                className="rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
                value={form.name ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
              {errors?.name && <p className="text-xs text-red-400">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Era ID</label>
              <input
                className="rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
                placeholder="e.g. mesozoic"
                value={form.eraId ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, eraId: e.target.value }))}
              />
              {errors?.eraId && <p className="text-xs text-red-400">{errors.eraId}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subtítulo</label>
              <input
                className="rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
                value={form.subtitle ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
              />
            </div>
          </div>

          {/* Modelo 3D */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white/80">Modelo 3D</h4>
            <div className="space-y-2">
              <label className="text-sm font-medium">Model URL</label>
              <input
                className="rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
                placeholder="https://…"
                value={form.model ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
              />
              <p className="text-xs text-white/50">Sube un modelo 3D o pega un enlace público. Al subir, este campo se autocompleta.</p>
            </div>
            <UploadModelField value={form.model} onUploaded={(url) => setForm((f) => ({ ...f, model: url }))} />
          </div>

          {/* Taxonomía */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white/80">Taxonomía</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">Clase</label>
                <input
                  className="w-full rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
                  value={form.className ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, className: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Orden</label>
                <input
                  className="w-full rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
                  value={form.order ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Familia</label>
                <input
                  className="w-full rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
                  value={form.family ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, family: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Dieta</label>
                <input
                  className="w-full rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
                  value={form.diet ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, diet: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Métricas */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white/80">Métricas</h4>
            <div className="grid grid-cols-2 gap-3">
              <NumberField label="Longitud (m)" value={form.lengthM} onChange={(v) => setForm((f) => ({ ...f, lengthM: v }))} />
              <NumberField label="Altura (m)" value={form.heightM} onChange={(v) => setForm((f) => ({ ...f, heightM: v }))} />
              <NumberField label="Ancho (m)" value={form.widthM} onChange={(v) => setForm((f) => ({ ...f, widthM: v }))} />
              <NumberField label="Envergadura (m)" value={form.wingspanM} onChange={(v) => setForm((f) => ({ ...f, wingspanM: v }))} />
              <NumberField className="xl:col-span-2" label="Peso (kg)" step={0.1} value={form.weightKg} onChange={(v) => setForm((f) => ({ ...f, weightKg: v }))} />
            </div>
          </div>

          {/* Descubrimiento y Descripción (full width) */}
          <div className="space-y-3 md:col-span-2 xl:col-span-3">
            <h4 className="text-sm font-semibold text-white/80">Historia y observaciones</h4>
            <div className="space-y-2">
              <label className="text-sm font-medium">Lugar de descubrimiento</label>
              <input
                className="w-full rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
                value={form.discoveryLocation ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, discoveryLocation: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descripción</label>
              <textarea
                rows={5}
                className="w-full rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
                value={form.description ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-white/10 flex justify-end gap-2 bg-white/[0.02]">
          <button onClick={onClose} className="rounded-lg border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] px-4 py-2 text-sm">Cancelar</button>
          <button
            disabled={saving}
            onClick={onSave}
            className="rounded-lg bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:hover:bg-emerald-500 text-black font-medium px-4 py-2 text-sm"
          >
            {saving ? (mode === "create" ? "Creando…" : "Guardando…") : mode === "create" ? "Crear" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}

function NumberField({ label, value, onChange, className = "", step = 0.01 }: {
  label: string;
  value?: number;
  onChange: (v: number | undefined) => void;
  className?: string;
  step?: number;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium">{label}</label>
      <input
        type="number"
        step={step}
        className="w-full rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
        value={value ?? ""}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? undefined : Number.parseFloat(v));
        }}
      />
    </div>
  );
}
