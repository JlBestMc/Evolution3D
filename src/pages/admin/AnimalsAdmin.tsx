import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Animal } from "@/data/animals";
import { AnimalsToolbar, AnimalsList, AnimalsEditModal } from "./animals";

type DbAnimal = Animal & { id?: string };
type DbAnimalRow = {
  id?: string;
  name: string;
  description: string;
  model: string;
  subtitle?: string;
  start_ma?: number;
  era_id?: string | null;
  isIconic?: boolean;
  country?: string;
  className?: string;
  order?: string;
  family?: string;
  diet?: string;
  lengthM?: number;
  heightM?: number;
  widthM?: number;
  wingspanM?: number;
  weightKg?: number;
  discoveryLocation?: string;
};

function fromRow(row: DbAnimalRow): DbAnimal {
  const { era_id, start_ma, ...rest } = row;
  const base: Animal = { ...(rest as unknown as Animal), startMa: start_ma };
  return { ...base, id: row.id, eraId: era_id ?? undefined };
}

function toInsertPayload(form: Partial<DbAnimal>): Partial<DbAnimalRow> {
  const { eraId, startMa, ...rest } = form;
  const payload: Partial<DbAnimalRow> = { ...(rest as Partial<DbAnimalRow>) };
  if (eraId !== undefined) payload.era_id = eraId;
  if (startMa !== undefined) payload.start_ma = startMa;
  return payload;
}

function toUpdatePayload(form: Partial<DbAnimal>): Partial<DbAnimalRow> {
  const { eraId, startMa, ...rest } = form;
  const payload: Partial<DbAnimalRow> = { ...(rest as Partial<DbAnimalRow>) };
  if (eraId !== undefined) payload.era_id = eraId;
  if (startMa !== undefined) payload.start_ma = startMa;
  return payload;
}

async function fetchAnimals(page: number, pageSize: number, search: string): Promise<{ rows: DbAnimal[]; count: number }>{
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  let query = supabase
    .from("animals")
    .select("*", { count: "exact" })
    .order("name", { ascending: true })
    .range(from, to);
  const s = search.trim();
  if (s) {
    query = query.or(`name.ilike.%${s}%,era_id.ilike.%${s}%`);
  }
  const { data, error, count } = await query;
  if (error) throw error;
  const rows = (data ?? []) as DbAnimalRow[];
  return { rows: rows.map(fromRow), count: count ?? 0 };
}

export default function AnimalsAdmin() {
  const [items, setItems] = useState<DbAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  // Create modal state
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<Partial<DbAnimal>>({});
  const [createErrors, setCreateErrors] = useState<{
    name?: string;
    eraId?: string;
  } | null>(null);
  const [createSaving, setCreateSaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<DbAnimal>>({});
  const [editOriginal, setEditOriginal] = useState<{ id: string } | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editErrors, setEditErrors] = useState<{
    name?: string;
    eraId?: string;
  } | null>(null);

  const loadPage = useCallback(async () => {
    try {
      setLoading(true);
      const { rows, count } = await fetchAnimals(page, pageSize, search);
      setItems(rows);
      setTotal(count);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  // Reset to first page when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(total, page * pageSize);

  return (
    <div>
      <AnimalsToolbar
        search={search}
        setSearch={setSearch}
        onNew={() => {
          setCreateForm({});
          setCreateErrors(null);
          setCreateOpen(true);
        }}
      />
      <AnimalsList
        items={items}
        loading={loading}
        error={error}
        onEdit={(a) => {
          if (!a.id) {
            alert("This row has no available id. Refresh data and try again.");
            return;
          }
          setEditForm({ ...a });
          setEditOriginal({ id: a.id });
          setEditErrors(null);
          setEditOpen(true);
        }}
      />

      {/* Pagination */}
      <div className="mt-3 flex items-center justify-between text-sm text-white/70">
        <div>
          Showing {rangeStart}-{rangeEnd} of {total}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 rounded-md bg-white/10 border border-white/15 disabled:opacity-40"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            className="px-3 py-1 rounded-md bg-white/10 border border-white/15 disabled:opacity-40"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>

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
          if (!createForm.name) errs.name = "Name is required";
          if (!createForm.eraId) errs.eraId = "Era is required";
          setCreateErrors(Object.keys(errs).length ? errs : null);
          if (Object.keys(errs).length) return;
          try {
            setCreateSaving(true);
            // Map UI form to DB payload: eraId -> era_id (omit id)
            const insertPayload = toInsertPayload(createForm);
            const { error } = await supabase
              .from("animals")
              .insert(insertPayload)
              .select()
              .single();
            if (error) throw error;
            await loadPage();
            setCreateOpen(false);
            setCreateForm({});
          } catch (e) {
            console.error(e);
            alert("Could not create the animal");
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
          if (!editForm.name) errs.name = "Name is required";
          if (!editForm.eraId) errs.eraId = "Era is required";
          setEditErrors(Object.keys(errs).length ? errs : null);
          if (Object.keys(errs).length) return;
          if (!editOriginal?.id) {
            alert("Could not determine record to update (missing id)");
            return;
          }
          try {
            setEditSaving(true);
            const entries = Object.entries(editForm).filter(
              ([k, v]) => k !== "id" && v !== undefined
            );
            const withoutId = Object.fromEntries(entries) as Partial<DbAnimal>;
            const payload = toUpdatePayload(withoutId);

            const { error } = await supabase
              .from("animals")
              .update(payload)
              .eq("id", editOriginal.id)
              .select()
              .single();
            if (error) throw error;
            await loadPage();
            setEditOpen(false);
            setEditOriginal(null);
            setEditForm({});
          } catch (e) {
            console.error(e);
            alert("Could not save changes");
          } finally {
            setEditSaving(false);
          }
        }}
      />
    </div>
  );
}
