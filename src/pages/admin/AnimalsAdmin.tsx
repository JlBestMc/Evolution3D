import { useMemo, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Animal } from "@/data/animals";
import UploadModelField from "@/components/admin/UploadModelField";
import { AnimalsToolbar, AnimalsList, AnimalsEditModal } from "./animals";

type DbAnimal = Animal & { id?: string };

async function fetchAnimals(): Promise<DbAnimal[]> {
  const { data, error } = await supabase
    .from("animals")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return data as DbAnimal[];
}

export default function AnimalsAdmin() {
  const [items, setItems] = useState<DbAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<DbAnimal>>({});
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<DbAnimal>>({});
  const [editOriginal, setEditOriginal] = useState<{ id: string } | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editErrors, setEditErrors] = useState<{ name?: string; eraId?: string } | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchAnimals();
        if (mounted) setItems(data);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!search) return items;
    const s = search.toLowerCase();
    return items.filter((a) => a.name.toLowerCase().includes(s) || a.eraId?.toLowerCase().includes(s));
  }, [items, search]);

  return (
    <div>
      <AnimalsToolbar search={search} setSearch={setSearch} onNew={() => setOpen(true)} />
      <AnimalsList
        items={filtered}
        loading={loading}
        error={error}
        onEdit={(a) => {
          if (!a.id) {
            alert("Esta fila no tiene id disponible. Refresca los datos e inténtalo de nuevo.");
            return;
          }
          setEditForm({ ...a });
          setEditOriginal({ id: a.id });
          setEditErrors(null);
          setEditOpen(true);
        }}
      />

      {/* Create modal */}
      {open && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0B0F17] p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Create animal</h3>
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white" aria-label="Close">✕</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">Name</label>
                <input
                  className="rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
                  value={form.name ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                <label className="text-sm font-semibold">Era ID</label>
                <input
                  className="rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
                  placeholder="e.g. mesozoic"
                  value={form.eraId ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, eraId: e.target.value }))}
                />
                <label className="text-sm font-semibold">Subtitle</label>
                <input
                  className="rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
                  value={form.subtitle ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                />
                <label className="text-sm font-semibold">Description</label>
                <textarea
                  rows={4}
                  className="rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
                  value={form.description ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold">Model URL</label>
                <input
                  className="rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
                  placeholder="https://…"
                  value={form.model ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
                />
                <UploadModelField value={form.model} onUploaded={(url) => setForm((f) => ({ ...f, model: url }))} />
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-semibold">Class</label>
                    <input
                      className="w-full rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
                      value={form.className ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, className: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold">Diet</label>
                    <input
                      className="w-full rounded-lg bg-white/[0.06] border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/20"
                      value={form.diet ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, diet: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button onClick={() => setOpen(false)} className="rounded-lg border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] px-4 py-2 text-sm">Cancel</button>
              <button
                onClick={async () => {
                  if (!form.name || !form.eraId) {
                    alert("Name and eraId are required");
                    return;
                  }
                  const { data, error } = await supabase.from("animals").insert(form).select().single();
                  if (error) {
                    console.error(error);
                    alert("Create failed");
                    return;
                  }
                  setItems((prev) => [...prev, data as DbAnimal].sort((a, b) => a.name.localeCompare(b.name)));
                  setOpen(false);
                  setForm({});
                }}
                className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-medium px-4 py-2 text-sm"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <AnimalsEditModal
        open={editOpen}
        originalId={editOriginal?.id}
        form={editForm}
        setForm={(updater) => setEditForm((prev) => updater(prev))}
        errors={editErrors}
        saving={editSaving}
        onClose={() => setEditOpen(false)}
        onSave={async () => {
          const errs: { name?: string; eraId?: string } = {};
          if (!editForm.name) errs.name = "El nombre es obligatorio";
          if (!editForm.eraId) errs.eraId = "El eraId es obligatorio";
          setEditErrors(Object.keys(errs).length ? errs : null);
          if (Object.keys(errs).length) return;
          if (!editOriginal?.id) {
            alert("No se pudo determinar el registro a actualizar (id ausente)");
            return;
          }
          try {
            setEditSaving(true);
            const entries = Object.entries(editForm).filter(([k, v]) => k !== "id" && v !== undefined);
            const payload = Object.fromEntries(entries);

            const { data, error } = await supabase
              .from("animals")
              .update(payload)
              .eq("id", editOriginal.id)
              .select()
              .single();
            if (error) throw error;
            const updated = data as DbAnimal;
            setItems((prev) =>
              prev
                .map((it) => (it.id === editOriginal.id ? updated : it))
                .sort((a, b) => a.name.localeCompare(b.name))
            );
            setEditOpen(false);
            setEditOriginal(null);
            setEditForm({});
          } catch (e) {
            console.error(e);
            alert("No se pudo guardar los cambios");
          } finally {
            setEditSaving(false);
          }
        }}
      />
    </div>
  );
}
