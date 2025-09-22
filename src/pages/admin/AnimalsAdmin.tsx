import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabaseClient";
import type { Animal } from "../../data/animals";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";

type DbAnimal = Animal & { id?: string };

async function fetchAnimals(): Promise<DbAnimal[]> {
  const { data, error } = await supabase.from("animals").select("*").order("name", { ascending: true });
  if (error) throw error;
  return data as DbAnimal[];
}

async function insertAnimal(payload: Partial<DbAnimal>) {
  const { error } = await supabase.from("animals").insert(payload);
  if (error) throw error;
}

export default function AnimalsAdmin() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({ queryKey: ["animals"], queryFn: fetchAnimals });
  const [form, setForm] = useState<Partial<DbAnimal>>({ name: "", model: "", eraId: "" });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const MODELS_BUCKET = import.meta.env.VITE_SUPABASE_MODELS_BUCKET || "models";

  function slugify(input: string) {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const nameBase = slugify(form.name || file.name.split(".")[0] || "model");
      const ext = file.name.includes(".") ? file.name.substring(file.name.lastIndexOf(".")) : "";
      const path = `${nameBase}-${Date.now()}${ext}`;
      const { error: upErr } = await supabase.storage.from(MODELS_BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type || "application/octet-stream",
      });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from(MODELS_BUCKET).getPublicUrl(path);
      const publicUrl = pub.publicUrl;
      setForm((f) => ({ ...f, model: publicUrl }));
    } catch (err: unknown) {
      setUploadError((err as Error).message || "Upload failed");
    } finally {
      setUploading(false);
      // reset input value so selecting the same file again triggers change
      e.target.value = "";
    }
  }
  const createMutation = useMutation({
    mutationFn: insertAnimal,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["animals"] });
      setForm({ name: "", model: "", eraId: "" });
    },
  });

  const columns = useMemo(
    () => [
      { key: "name", label: "Name" },
      { key: "eraId", label: "Era" },
      { key: "className", label: "Class" },
      { key: "order", label: "Order" },
      { key: "diet", label: "Diet" },
    ],
    []
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Animals</h2>
      </div>
      <div className="mb-6 rounded-xl border border-white/10 bg-white/5 p-4">
        <h3 className="font-medium mb-3">Create new animal</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input
            className="px-3 py-2 rounded-md bg-black/40 border border-white/10"
            placeholder="Name"
            value={form.name || ""}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <div className="flex flex-col gap-2">
            <input
              className="px-3 py-2 rounded-md bg-black/40 border border-white/10"
              placeholder="Model URL (auto-filled after upload)"
              value={form.model || ""}
              onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
            />
            <div className="flex items-center gap-2 text-xs text-white/80">
              <input
                type="file"
                accept=".glb,.gltf,.zip,.usdz,.obj"
                onChange={handleFileChange}
                disabled={uploading}
                className="block w-full text-xs file:mr-2 file:rounded-md file:border file:border-white/15 file:bg-white/10 file:px-2 file:py-1 file:text-white hover:file:bg-white/20"
              />
              {uploading && <span className="opacity-80">Uploading…</span>}
            </div>
            {uploadError && <span className="text-amber-400 text-xs">{uploadError}</span>}
            <span className="text-[11px] text-white/60">Bucket: {MODELS_BUCKET}</span>
          </div>
          <input
            className="px-3 py-2 rounded-md bg-black/40 border border-white/10"
            placeholder="Era ID (e.g., mesozoic)"
            value={form.eraId || ""}
            onChange={(e) => setForm((f) => ({ ...f, eraId: e.target.value }))}
          />
          <input
            className="px-3 py-2 rounded-md bg-black/40 border border-white/10"
            placeholder="Class"
            value={form.className || ""}
            onChange={(e) => setForm((f) => ({ ...f, className: e.target.value }))}
          />
          <input
            className="px-3 py-2 rounded-md bg-black/40 border border-white/10"
            placeholder="Order"
            value={form.order || ""}
            onChange={(e) => setForm((f) => ({ ...f, order: e.target.value }))}
          />
          <input
            className="px-3 py-2 rounded-md bg-black/40 border border-white/10"
            placeholder="Diet"
            value={form.diet || ""}
            onChange={(e) => setForm((f) => ({ ...f, diet: e.target.value }))}
          />
        </div>
        <div className="mt-3">
          <button
            className="px-4 py-2 rounded-md bg-white/10 border border-white/20 hover:bg-white/20"
            disabled={createMutation.isPending || !form.name || !form.model}
            onClick={() => createMutation.mutate(form)}
          >
            {createMutation.isPending ? "Creating…" : "Create"}
          </button>
          {createMutation.isError && (
            <span className="text-red-400 ml-3">Error creating animal</span>
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
              <TableRow key={row.name}>
                {columns.map((c) => {
                  const value = (row as DbAnimal)[c.key as keyof DbAnimal];
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
