/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import MapPage from "@/pages/mapPage/MapPage";

// Router-dependent Navbar3 is used; mock it to avoid navigation context
vi.mock("@/components/navbar/Navbar3", () => ({
  default: () => <div>NavMock</div>,
}));
vi.mock("@/components/ui/background/Background", () => ({
  default: () => <div />,
}));

// Mock leaflet para evitar canvas/DOM
vi.mock(
  "leaflet",
  () =>
    ({
      __esModule: true,
      default: {
        Icon: { Default: { mergeOptions: vi.fn() } },
        icon: vi.fn(),
        marker: vi.fn(() => ({
          addTo: vi.fn().mockReturnThis(),
          bindPopup: vi.fn(),
        })),
        map: vi.fn(() => ({ remove: vi.fn(), fitWorld: vi.fn() })),
        tileLayer: vi.fn(() => ({ addTo: vi.fn() })),
      },
    } as any)
);

// Mock supabase
vi.mock("@/lib/supabaseClient", () => {
  const order = vi.fn().mockReturnThis();
  return {
    supabase: {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [
            { name: "A", country: "usa" },
            { name: "B", country: "United Kingdom" },
            { name: "C", country: null },
          ],
          error: null,
        }),
        order,
      }),
    },
  };
});

// Provide a fake fetch for geocoding
const geoPoints: Record<string, { lat: number; lon: number }> = {
  "United States": { lat: 38, lon: -97 },
  "United Kingdom": { lat: 55, lon: -3 },
};

beforeEach(() => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url: string) => {
      const parsed = new URL(url);
      const q = parsed.searchParams.get("q")!;
      const pt = geoPoints[q];
      return {
        ok: true,
        json: async () =>
          pt ? [{ lat: String(pt.lat), lon: String(pt.lon) }] : [],
      } as Response;
    }) as unknown as typeof fetch
  );
});

describe("MapPage", () => {
  it("muestra el contador de países con datos", async () => {
    render(<MapPage />);
    expect(await screen.findByText(/global animals map/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/animals across/i).textContent).toMatch(
        /2 countries/
      );
    });
  });

  it("muestra 0 países con lista vacía", async () => {
    // Override supabase mock to return empty
    const { supabase } = await import("@/lib/supabaseClient");
    (supabase.from as any).mockReturnValueOnce({
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
      order: vi.fn().mockReturnThis(),
    });
    render(<MapPage />);
    await waitFor(() => {
      // still renders header and shows 0 counts
      expect(
        screen.getByText(/animals across 0 countries/i)
      ).toBeInTheDocument();
    });
  });
});
