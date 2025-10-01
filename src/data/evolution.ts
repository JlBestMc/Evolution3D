export const EVOLUTION_CHAINS: Record<string, string[]> = {
  Archaeopteryx: ["Cyanobacteria", "Tiktaalik", "Archaeopteryx", "Chicken"],
  Chicken: ["Cyanobacteria", "Tiktaalik", "Archaeopteryx", "Chicken"],
};

export function getEvolutionChainFor(name: string): string[] | null {
  return EVOLUTION_CHAINS[name] ?? null;
}
