// Central mapping from era slug (used in routes/UI) to UUID stored in DB
export const ERA_UUIDS: Record<string, string> = {
  precambrian: "fa623e10-ea07-4ad0-a4da-6b469ea2016b",
  paleozoic: "1a148d60-41df-4477-aa02-1d5d36ddc5a5",
  mesozoic: "7809661c-0b73-48f6-9c52-7e05b2e80cba",
  cenozoic: "854cf820-50b8-4a21-a87d-1f6a7738f5c0",
};

export function isUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    v
  );
}
