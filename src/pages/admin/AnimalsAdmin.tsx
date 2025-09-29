import { useMemo, useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Animal } from "@/data/animals";
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
  // Create modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<Partial<DbAnimal>>({});
  const [createErrors, setCreateErrors] = useState<{ name?: string; eraId?: string } | null>(null);
  const [createSaving, setCreateSaving] = useState(false);
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
      <AnimalsToolbar search={search} setSearch={setSearch} onNew={() => {
        setCreateForm({});
        setCreateErrors(null);
        setCreateOpen(true);
      }} />
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

      <AnimalsEditModal
        open={createOpen}
        originalId={null}
        form={createForm}
        setForm={(updater) => setCreateForm((prev) => updater(prev))}
        errors={createErrors}
        saving={createSaving}
        mode="create"
        onClose={() => setCreateOpen(false)}
        onSave={async () => {
          const errs: { name?: string; eraId?: string } = {};
            if (!createForm.name) errs.name = "El nombre es obligatorio";
            if (!createForm.eraId) errs.eraId = "El eraId es obligatorio";
            setCreateErrors(Object.keys(errs).length ? errs : null);
            if (Object.keys(errs).length) return;
            try {
              setCreateSaving(true);
              const { data, error } = await supabase
                .from("animals")
                .insert(createForm)
                .select()
                .single();
              if (error) throw error;
              setItems((prev) => [...prev, data as DbAnimal].sort((a, b) => a.name.localeCompare(b.name)));
              setCreateOpen(false);
              setCreateForm({});
            } catch (e) {
              console.error(e);
              alert("No se pudo crear el animal");
            } finally {
              setCreateSaving(false);
            }
        }}
      />

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
