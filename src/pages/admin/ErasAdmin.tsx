import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabaseClient";
import { ErasToolbar, ErasList, ErasEditModal } from "./eras";

type EraRow = { id: string; name: string; period?: string | null };

async function fetchEras(page: number, pageSize: number, search: string): Promise<{ rows: EraRow[]; count: number }>{
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  let query = supabase
    .from("eras")
    .select("*", { count: "exact" })
    .order("name", { ascending: true })
    .range(from, to);
  const s = search.trim();
  if (s) query = query.or(`name.ilike.%${s}%,period.ilike.%${s}%,id.ilike.%${s}%`);
  const { data, error, count } = await query;
  if (error) throw error;
  return { rows: (data ?? []) as EraRow[], count: count ?? 0 };
}

export default function ErasAdmin() {
  const [items, setItems] = useState<EraRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<Partial<EraRow>>({});
  const [createErrors, setCreateErrors] = useState<{ id?: string; name?: string } | null>(null);
  const [createSaving, setCreateSaving] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<EraRow>>({});
  const [editOriginal, setEditOriginal] = useState<{ id: string } | null>(null);
  const [editErrors, setEditErrors] = useState<{ id?: string; name?: string } | null>(null);
  const [editSaving, setEditSaving] = useState(false);

  const loadPage = useCallback(async () => {
    try {
      setLoading(true);
      const { rows, count } = await fetchEras(page, pageSize, search);
      setItems(rows);
      setTotal(count);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, search]);

  useEffect(() => { loadPage(); }, [loadPage]);
  useEffect(() => { setPage(1); }, [search]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(total, page * pageSize);

  return (
    <div>
      <ErasToolbar search={search} setSearch={setSearch} onNew={() => { setCreateForm({}); setCreateErrors(null); setCreateOpen(true); }} />
      <ErasList
        items={items}
        loading={loading}
        error={error}
        onEdit={(row) => { setEditForm({ ...row }); setEditOriginal({ id: row.id }); setEditErrors(null); setEditOpen(true); }}
      />

      <div className="mt-3 flex items-center justify-between text-sm text-white/70">
        <div>Showing {rangeStart}-{rangeEnd} of {total}</div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 rounded-md bg-white/10 border border-white/15 disabled:opacity-40" disabled={page <= 1 || loading} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
          <span>Page {page} / {totalPages}</span>
          <button className="px-3 py-1 rounded-md bg-white/10 border border-white/15 disabled:opacity-40" disabled={page >= totalPages || loading} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
        </div>
      </div>

      <ErasEditModal
        open={createOpen}
        form={createForm}
        setForm={(u) => setCreateForm((prev) => u(prev))}
        errors={createErrors}
        saving={createSaving}
        mode="create"
        onClose={() => setCreateOpen(false)}
        onSave={async () => {
          const errs: { id?: string; name?: string } = {};
          if (!createForm.id) errs.id = "ID is required";
          if (!createForm.name) errs.name = "Name is required";
          setCreateErrors(Object.keys(errs).length ? errs : null);
          if (Object.keys(errs).length) return;
          try {
            setCreateSaving(true);
            const { error } = await supabase.from("eras").insert(createForm);
            if (error) throw error;
            await loadPage();
            setCreateOpen(false);
            setCreateForm({});
          } catch (e) {
            console.error(e);
            alert("Could not create era");
          } finally {
            setCreateSaving(false);
          }
        }}
      />

      <ErasEditModal
        open={editOpen}
        form={editForm}
        setForm={(u) => setEditForm((prev) => u(prev))}
        errors={editErrors}
        saving={editSaving}
        onClose={() => setEditOpen(false)}
        onSave={async () => {
          const errs: { id?: string; name?: string } = {};
          if (!editForm.id) errs.id = "ID is required";
          if (!editForm.name) errs.name = "Name is required";
          setEditErrors(Object.keys(errs).length ? errs : null);
          if (Object.keys(errs).length) return;
          if (!editOriginal?.id) { alert("Missing era id to update"); return; }
          try {
            setEditSaving(true);
            const { error } = await supabase
              .from("eras")
              .update({ name: editForm.name, period: editForm.period })
              .eq("id", editOriginal.id);
            if (error) throw error;
            await loadPage();
            setEditOpen(false);
            setEditOriginal(null);
            setEditForm({});
          } catch (e) {
            console.error(e);
            alert("Could not save era");
          } finally {
            setEditSaving(false);
          }
        }}
      />
    </div>
  );
}
