import { supabase } from "@/lib/supabaseClient";
import type { Animal } from "@/data/animals";
import { ERA_UUIDS, isUuid } from "@/data/eraIds";

export type DbAnimalRow = {
  id: string;
  name: string;
  description: string;
  model: string;
  subtitle?: string | null;
  start_ma?: number | null;
  era_id?: string | null;
  isIconic?: boolean | null;
  country?: string | null;
  className?: string | null;
  order?: string | null;
  family?: string | null;
  diet?: string | null;
  lengthM?: number | null;
  heightM?: number | null;
  widthM?: number | null;
  wingspanM?: number | null;
  weightKg?: number | null;
  discoveryLocation?: string | null;
};

export type AnimalRecord = Animal & { id: string };

function rowToAnimal(row: DbAnimalRow): AnimalRecord {
  const { id, start_ma, era_id, ...rest } = row;
  const base: Animal = {
    ...(rest as unknown as Animal),
    startMa: start_ma ?? undefined,
    eraId: era_id ?? undefined,
  };
  return { ...base, id } as AnimalRecord;
}

const animalColumns = [
  "id",
  "name",
  "description",
  "model",
  "subtitle",
  "start_ma",
  "era_id",
  "isIconic",
  "country",
  "className",
  "order",
  "family",
  "diet",
  "lengthM",
  "heightM",
  "widthM",
  "wingspanM",
  "weightKg",
  "discoveryLocation",
].join(",");

export async function getAnimals(): Promise<AnimalRecord[]> {
  const { data, error } = await supabase
    .from("animals")
    .select(animalColumns)
    .order("name", { ascending: true });
  if (error) throw error;
  return (data as unknown as DbAnimalRow[]).map(rowToAnimal);
}

export async function getAnimalById(id: string): Promise<AnimalRecord | null> {
  const { data, error } = await supabase
    .from("animals")
    .select(animalColumns)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToAnimal(data as unknown as DbAnimalRow) : null;
}

export async function getAnimalsByEra(
  eraIdOrSlug: string
): Promise<AnimalRecord[]> {
  const eraId = isUuid(eraIdOrSlug)
    ? eraIdOrSlug
    : ERA_UUIDS[eraIdOrSlug] ?? eraIdOrSlug;
  const { data, error } = await supabase
    .from("animals")
    .select(animalColumns)
    .eq("era_id", eraId)
    .order("start_ma", { ascending: true, nullsFirst: true });
  if (error) throw error;
  return (data as unknown as DbAnimalRow[]).map(rowToAnimal);
}

export async function getAnimalByName(
  name: string
): Promise<AnimalRecord | null> {
  const { data, error } = await supabase
    .from("animals")
    .select(animalColumns)
    .eq("name", name)
    .maybeSingle();
  if (error) throw error;
  if (data) return rowToAnimal(data as unknown as DbAnimalRow);

  const { data: list, error: e2 } = await supabase
    .from("animals")
    .select(animalColumns)
    .ilike("name", name)
    .limit(10);
  if (e2) throw e2;
  const rows = (list as unknown as DbAnimalRow[]) || [];
  const lower = name.toLowerCase();
  const exact = rows.find((r) => r.name.toLowerCase() === lower);
  return exact ? rowToAnimal(exact) : rows[0] ? rowToAnimal(rows[0]) : null;
}

export async function getAnimalsByNames(
  names: string[]
): Promise<AnimalRecord[]> {
  if (!names.length) return [];
  const { data, error } = await supabase
    .from("animals")
    .select(animalColumns)
    .in("name", names);
  if (error) throw error;
  const rows = (data as unknown as DbAnimalRow[]) || [];
  const byName = new Map(rows.map((r) => [r.name, rowToAnimal(r)]));
  return names.map((n) => byName.get(n)).filter(Boolean) as AnimalRecord[];
}

export async function searchAnimals(term: string): Promise<AnimalRecord[]> {
  const s = term.trim();
  let query = supabase
    .from("animals")
    .select(animalColumns)
    .order("name", { ascending: true });
  if (s) {
    query = query.or(
      `name.ilike.%${s}%,description.ilike.%${s}%,family.ilike.%${s}%`
    );
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as DbAnimalRow[]).map(rowToAnimal);
}

export async function getAnimalsPaginated(page: number, pageSize: number) {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const { data, error, count } = await supabase
    .from("animals")
    .select(animalColumns, { count: "exact" })
    .order("name", { ascending: true })
    .range(from, to);
  if (error) throw error;
  return {
    items: (data as unknown as DbAnimalRow[]).map(rowToAnimal),
    count: count ?? 0,
  };
}
