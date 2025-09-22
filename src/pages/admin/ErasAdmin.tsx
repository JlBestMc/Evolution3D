import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabaseClient";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { eras as erasStatic } from "../../data/eras";

type Era = typeof erasStatic[number];
type DbEra = Era & { id: string; period?: string };

async function fetchEras(): Promise<DbEra[]> {
  const { data, error } = await supabase.from("eras").select("*").order("name", { ascending: true });
  if (error) throw error;
  return data as DbEra[];
}

async function insertEra(payload: Partial<DbEra>) {
  const { error } = await supabase.from("eras").insert(payload);
  if (error) throw error;
}

export default function ErasAdmin() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["eras"], queryFn: fetchEras });
  const [form, setForm] = useState<Partial<DbEra>>({ id: "", name: "" });
  const createMutation = useMutation({
    mutationFn: insertEra,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["eras"] });
      setForm({ id: "", name: "" });
    },
  });

  const columns = useMemo(
    () => [
      { key: "id", label: "ID" },
      { key: "name", label: "Name" },
      { key: "period", label: "Period" },
    ],
    []
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Eras</h2>
      </div>
      <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
        <h3 className="font-medium mb-3">Create new era</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="px-3 py-2 rounded-md bg-black/40 border border-white/10"
            placeholder="ID (e.g., mesozoic)"
            value={form.id || ""}
            onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
          />
          <input
            className="px-3 py-2 rounded-md bg-black/40 border border-white/10"
            placeholder="Name"
            value={form.name || ""}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <input
            className="px-3 py-2 rounded-md bg-black/40 border border-white/10"
            placeholder="Period (e.g., 252 – 66 Ma)"
            value={form.period || ""}
            onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
          />
        </div>
        <div className="mt-3">
          <button
            className="px-4 py-2 rounded-md bg-white/10 border border-white/20 hover:bg:white/20"
            disabled={createMutation.isPending || !form.id || !form.name}
            onClick={() => createMutation.mutate(form)}
          >
            {createMutation.isPending ? "Creating…" : "Create"}
          </button>
          {createMutation.isError && (
            <span className="text-red-400 ml-3">Error creating era</span>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c.key} className="text-left">{c.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={columns.length}>Loading…</TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-red-400">{String(error)}</TableCell>
              </TableRow>
            )}
            {data?.map((row) => (
              <TableRow key={row.id}>
                {columns.map((c) => {
                  const value = (row as DbEra)[c.key as keyof DbEra] as unknown;
                  return <TableCell key={c.key}>{String(value ?? "")}</TableCell>;
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
