import { useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Background from "../../components/ui/background/Background";
import logo from "/images/logo3D.png";
import { eras } from "../../data/eras";

const SketchfabViewer = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const uid = "27eed96c03ad480bb29331ee1b955d15"; // cambia por el ID del modelo de Sketchfab
    if (!window.Sketchfab) return;
    const client = new window.Sketchfab(iframeRef.current);

    client.init(uid, {
      success: (api: SketchfabAPI) => {
        api.start();

        api.addEventListener("viewerready", () => {
          console.log("Viewer listo");

          // Aquí ya puedes usar la API
          // Ejemplo: crear una annotation manual
          api.createAnnotationFromScenePosition(
            [0, 5, 0], // posición XYZ dentro del modelo
            "Mamut", // título
            "Un mamut lanudo", // descripción
            (err: unknown, index: number) => {
              if (!err) {
                console.log("Annotation creada en índice:", index);
              }
            }
          );

          // Detectar click en annotation
          api.addEventListener("annotationSelect", (index: number) => {
            console.log("👉 Has seleccionado la annotation", index);
            if (index === 0) {
              window.location.href = "/animal/Mammoth"; // redirección
            }
          });
        });
      },
      error: () => {
        console.error("❌ No se pudo cargar el visor");
      },
    });
  }, []);

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
            ref={iframeRef}
            title="Gunma Museum of Natural History"
            frameBorder="0"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
            loading="lazy"
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
};

export default SketchfabViewer;
