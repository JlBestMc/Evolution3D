import { supabase } from "@/lib/supabaseClient";
import { ERA_UUIDS, isUuid } from "@/data/eraIds";

export async function getEraColor(eraIdOrSlug: string): Promise<string | null> {
  if (!eraIdOrSlug) return null;
  const id = isUuid(eraIdOrSlug)
    ? eraIdOrSlug
    : ERA_UUIDS[eraIdOrSlug] ?? eraIdOrSlug;
  const { data, error } = await supabase
    .from("eras")
    .select("color")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as { color?: string } | null)?.color ?? null;
}
