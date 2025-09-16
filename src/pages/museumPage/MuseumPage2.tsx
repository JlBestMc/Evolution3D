import { useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import Background from "../../components/ui/background/Background";
import logo from "/images/logo3D.png";
import { eras } from "../../data/eras";

// Minimal types for Sketchfab Viewer API to keep TS happy without adding global d.ts
type SketchfabApiCamera = { position: [number, number, number]; target: [number, number, number] };
type SketchfabAPI = {
  start: () => void;
  addEventListener: (
    event: string,
    cb: (...args: unknown[]) => void,
    options?: Record<string, unknown>
  ) => void;
  getCameraLookAt: (cb: (err: unknown, camera: SketchfabApiCamera) => void) => void;
  getAnnotationList: (cb: (err: unknown, list: unknown[]) => void) => void;
  createAnnotationFromWorldPosition: (
    position: [number, number, number],
    eye: [number, number, number],
    target: [number, number, number],
    title: string,
    text: string,
    cb?: (err: unknown, index: number) => void
  ) => void;
};

declare global {
  interface Window {
    Sketchfab?: new (iframe: HTMLIFrameElement) => {
      init: (
        uid: string,
        opts: {
          success: (api: SketchfabAPI) => void;
          error: () => void;
          autostart?: 0 | 1;
          preload?: 0 | 1;
          ui_controls?: 0 | 1;
          ui_infos?: 0 | 1;
          ui_watermark?: 0 | 1;
          transparent?: 0 | 1;
        }
      ) => void;
    };
  }
}

const SketchfabViewer = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const indexToRouteRef = useRef<Map<number, string>>(new Map());
  const createdRef = useRef(false);
  const navigate = useNavigate();

  // Configurable annotations list: fill with your animals and world-space positions in the museum model
  const annotationsConfig = useMemo(
    () =>
      [
        // Example entries — replace worldPosition with real coordinates for each exhibit
        {
          name: "Mammoth",
          title: "Mamut lanudo",
          description: "Uno de los grandes mamíferos del Pleistoceno.",
          worldPosition: [0.12, -3.57, -0.51] as [number, number, number],
        },
        // { name: "Triceratops", title: "Triceratops", description: "Cretácico tardío.", worldPosition: [...] },
      ],
    []
  );

  useEffect(() => {
    if (!iframeRef.current) return;

    const uid = "27eed96c03ad480bb29331ee1b955d15"; // ID del museo en Sketchfab
    if (!window.Sketchfab) return;
    const client = new window.Sketchfab(iframeRef.current);

    client.init(uid, {
      success: (api: SketchfabAPI) => {
        api.start();

        api.addEventListener("viewerready", () => {
          console.log("Viewer listo");

          // 1) Leer offset de anotaciones ya existentes en el modelo
          api.getAnnotationList(() => {

            // 2) Obtener cámara actual para fijar eye/target de cada anotación
            api.getCameraLookAt((camErr, camera) => {
              if (camErr || !camera) return;
              if (createdRef.current) return; // evitar duplicados en hot reloads
              createdRef.current = true;

              const eye = camera.position;
              const target = camera.target;

              annotationsConfig.forEach((cfg) => {
                const content = `${cfg.description}\n\n[Ver ${cfg.name}](/animal/${encodeURIComponent(
                  cfg.name
                )})`;
                api.createAnnotationFromWorldPosition(
                  cfg.worldPosition,
                  eye,
                  target,
                  cfg.title,
                  content,
                  (createErr, index) => {
                    if (!createErr && typeof index === "number") {
                      const finalIdx = index; // API devuelve índice absoluto
                      indexToRouteRef.current.set(finalIdx, `/animal/${encodeURIComponent(cfg.name)}`);
                    }
                  }
                );
              });
            });
          });

          // 3) Navegar dentro de la app cuando se selecciona una anotación creada por nosotros
          api.addEventListener("annotationSelect", (arg: unknown) => {
            let index: number | undefined;
            if (typeof arg === "number") index = arg;
            else if (typeof arg === "string") {
              const n = Number(arg);
              if (Number.isFinite(n)) index = n;
            }
            const route = index !== undefined ? indexToRouteRef.current.get(index) : undefined;
            if (route) {
              // Navegación SPA (misma pestaña)
              navigate(route);
            }
          });
        });
      },
      error: () => {
        console.error("❌ No se pudo cargar el visor");
      },
    });
  }, [annotationsConfig, navigate]);

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
