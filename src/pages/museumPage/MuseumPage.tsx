import { useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Background from "../../components/ui/background/Background";
import logo from "/images/logo3D.png";
import { eras } from "../../data/eras";
const MODEL_UID = "27eed96c03ad480bb29331ee1b955d15"; // Gunma Museum of Natural History

export default function MuseumPage() {
  // Pick a neutral background accent from current eras (fallback)
  const accent = useMemo(() => eras[0]?.color ?? "#6b8cff", []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#06080F] text-white">
      <Background accentColor={accent} />

      <div className="relative z-20">
        <Navbar
          aStyles="cursor-pointer"
          variantButton="secondary"
          logo={logo}
          borderColor="border-white/30"
        />
      </div>

      <section className="relative z-10 container mx-auto px-6 py-10">
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
            Museum
          </h1>
          <div
            className="mt-3 h-[3px] w-24 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${accent}, transparent)`,
            }}
          />
          <p className="mt-3 text-white/70 text-sm">
            Explore the 3D Gunma Museum of Natural History. The annotations
            allow you to interact with the exhibits.
          </p>
        </header>

        <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/30">
          <iframe
            title="Gunma Museum of Natural History"
            frameBorder="0"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
            loading="lazy"
            src={`https://sketchfab.com/models/${MODEL_UID}/embed?autostart=1&annotations_visible=1&dnt=1`}
            className="w-full h-full"
          />
        </div>
        <div className="mt-4 text-sm text-white/60">
          <p className="mt-2">
            Volver a{" "}
            <Link className="text-blue-400 hover:underline" to="/">
              inicio
            </Link>{" "}
            o a{" "}
            <Link className="text-blue-400 hover:underline" to="/era">
              eras
            </Link>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
