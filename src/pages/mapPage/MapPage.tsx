import { useEffect, useMemo, useRef, useState } from "react";
import Navbar3 from "../../components/navbar/Navbar3";
import logo from "/images/favicon.ico";
import { supabase } from "@/lib/supabaseClient";
import { PATHS } from "@/routes/routes";
import L from "leaflet";
import type { LatLngBoundsLiteral } from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
import Background from "../../components/ui/background/Background";
import { eras } from "../../data/eras";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2xUrl,
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
});

const customMarkerIcon = L.icon({
  iconUrl: "/images/marker.png",
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type AnimalRow = { name: string; country: string | null };
interface GeoPoint {
  lat: number;
  lon: number;
}

function normalizeCountry(raw?: string | null): string | null {
  if (!raw) return null;
  const c = raw.trim();
  if (!c) return null;
  const lower = c.toLowerCase();
  const map: Record<string, string> = {
    usa: "United States",
    "u.s.a": "United States",
    "u.s.": "United States",
    "united states of america": "United States",
    uk: "United Kingdom",
    "u.k.": "United Kingdom",
    britain: "United Kingdom",
    england: "United Kingdom",
    scotland: "United Kingdom",
    wales: "United Kingdom",
    "czech republic": "Czechia",
    korea: "South Korea",
    "north korea": "North Korea",
    russia: "Russian Federation",
    "democratic republic of congo": "DR Congo",
    congo: "Republic of the Congo",
  };
  if (map[lower]) return map[lower];
  return c
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

async function geocodeCountry(country: string): Promise<GeoPoint | null> {
  const key = `geo:${country}`;
  try {
    const cached = localStorage.getItem(key);
    if (cached) return JSON.parse(cached) as GeoPoint;
  } catch {
    //
  }

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("q", country);
  url.searchParams.set("limit", "1");
  url.searchParams.set("addressdetails", "0");
  const res = await fetch(url.toString(), {
    headers: { "Accept-Language": "en" },
  });
  if (!res.ok) return null;
  const data: Array<{ lat: string; lon: string }> = await res.json();
  const first = data[0];
  if (!first) return null;
  const point = { lat: Number(first.lat), lon: Number(first.lon) };
  try {
    localStorage.setItem(key, JSON.stringify(point));
  } catch {
    //
  }
  return point;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<Map<string, AnimalRow[]>>(new Map());
  const accent = useMemo(() => eras[0]?.color ?? "#6b8cff", []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("animals")
          .select("name,country")
          .order("name", { ascending: true });
        if (error) throw error;
        const byCountry = new Map<string, AnimalRow[]>();
        (data ?? []).forEach((row) => {
          const norm = normalizeCountry(row.country);
          if (!norm) return;
          const list = byCountry.get(norm) ?? [];
          list.push({ name: row.name, country: norm });
          byCountry.set(norm, list);
        });
        if (!cancelled) setGroups(byCountry);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    const container = mapRef.current;
    const existing = (container as unknown as { _leaflet_id?: number })
      ._leaflet_id;
    if (existing) {
      container.innerHTML = "";
    }
    const map = L.map(container, {
      center: [20, 0],
      zoom: 2,
      worldCopyJump: true,
      minZoom: 2,
      maxZoom: 9,
    });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    let cancelled = false;
    (async () => {
      const bounds: LatLngBoundsLiteral = [
        [90, 180],
        [-90, -180],
      ];
      const entries = Array.from(groups.entries());
      for (let i = 0; i < entries.length; i++) {
        const [country, animals] = entries[i];
        const pt = await geocodeCountry(country);
        if (i < entries.length - 1) await sleep(250);
        if (!pt || cancelled) continue;
        const { lat, lon } = pt;
        const marker = L.marker([lat, lon], { icon: customMarkerIcon }).addTo(
          map
        );
        const html = `
          <div class="text-sm">
            <div class="font-semibold mb-1">${country}</div>
            <ul class="list-disc pl-4 space-y-0.5">
              ${animals
                .map(
                  (a) =>
                    `<li><a href="${PATHS.animal(
                      a.name
                    )}" class="text-emerald-300 hover:underline">${
                      a.name
                    }</a></li>`
                )
                .join("")}
            </ul>
          </div>`;
        marker.bindPopup(html, { closeButton: true });
        if (lat < bounds[0][0]) bounds[0][0] = lat;
        if (lon < bounds[1][1]) bounds[1][1] = lon;
      }
      try {
        map.fitWorld({ animate: false });
      } catch {
        //S
      }
    })();

    return () => {
      cancelled = true;
      map.remove();
    };
  }, [groups]);

  const totalCountries = useMemo(() => groups.size, [groups]);
  const totalAnimals = useMemo(
    () => Array.from(groups.values()).reduce((acc, arr) => acc + arr.length, 0),
    [groups]
  );

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#06080F] text-white">
      <Background accentColor={accent} />

      <div className="relative z-20">
        <Navbar3 logo={logo} />
      </div>

      <section className="relative z-10 container mx-auto px-6 pt-10">
        <header className="mb-6">
          <h1
            className="text-3xl md:text-4xl font-semibold tracking-tight"
            style={{
              background: `linear-gradient(90deg, ${accent}, #ffffff)`,
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Global Animals Map
          </h1>
          <div
            className="mt-3 h-[3px] w-24 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${accent}, transparent)`,
            }}
          />
          <p className="mt-3 text-white/70 text-sm">
            Showing {totalAnimals} animals across {totalCountries} countries.
            Hover and click markers to see details.
          </p>
        </header>
      </section>

      <section className="relative z-10 container mx-auto px-6 pb-6">
        <div
          ref={mapRef}
          className="h-[70vh] w-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
        />
      </section>

      {loading && (
        <div className="relative z-10 container mx-auto px-6 pb-6 text-sm text-white/70">
          Loading animals…
        </div>
      )}

      {error && (
        <div className="relative z-10 container mx-auto px-6 pb-6 text-sm text-red-400">
          {String(error)}
        </div>
      )}
    </main>
  );
}
