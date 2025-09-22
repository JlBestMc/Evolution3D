import { useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import Background from "../../components/ui/background/Background";
import logo from "/images/favicon.ico";
import { eras } from "../../data/eras";
import Navbar3 from "../../components/navbar/Navbar3";

// Minimal types for Sketchfab Viewer API to keep TS happy without adding global d.ts
type SketchfabApiCamera = {
  position: [number, number, number];
  target: [number, number, number];
};
type SketchfabAPI = {
  start: () => void;
  addEventListener: (
    event: string,
    cb: (...args: unknown[]) => void,
    options?: Record<string, unknown>
  ) => void;
  getCameraLookAt: (
    cb: (err: unknown, camera: SketchfabApiCamera) => void
  ) => void;
  getAnnotationList: (
    cb: (err: unknown, list: Array<{ title?: string; content?: string }>) => void
  ) => void;
  updateAnnotation: (
    index: number,
    options: {
      title?: string;
      content?: string;
      eye?: [number, number, number];
      target?: [number, number, number];
    },
    cb?: (err?: unknown, information?: unknown) => void
  ) => void;
  removeAnnotation: (index: number, cb?: (err?: unknown) => void) => void;
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

  // (Removed) App-created annotations via camera-based placement

  // Runtime adjustments for existing annotations authored in Sketchfab (non-persistent).
  // Edit here to update/remove by title or index when the viewer loads.
  const existingAdjustRef = useRef({
    // Examples (leave empty by default):
    // removeByTitle: ["Museum overhead view", "博物館俯瞰"],
    removeByTitle: [
      // Remove: 生命を育てた太古の海 / The Prehistoric Seas which Nurtured Life
    ] as string[],
    // removeByIndex: [0],
    removeByIndex: [
      // UI number 3 -> zero-based index 2
    ] as number[],
    // update: [ { matchTitle: "Museum overhead view", newTitle: "Overhead view", newContent: "Updated description." } ]
    update: [
      {
        matchIndex: 0,
        newTitle: "Museum overhead view",
        newContent:
          "Overhead view of the Gunma Museum of Natural History building.",
      },
      {
        matchIndex: 1,
        newTitle: "Museum side view",
        newContent:
          "Side view of the Gunma Museum of Natural History building.",
      },
      {
        matchIndex: 2,
        newTitle: "The Prehistoric Seas which Nurtured Life",
        newContent: "Life in the ancient seas.",
        linkEraId: "precambrian",
      },
      {
        matchIndex: 3,
        newTitle: "The Age of the Dinosaurs",
        newContent: "Life in the age of the dinosaurs.",
        linkEraId: "mesozoic",
      },
      {
        matchIndex: 4,
        newTitle: "Bone bed of a Triceratops Skeleton",
        newContent: "Fossil remains of a Triceratops.",
        linkAnimalName: "Triceratops",
      },
      {
        matchIndex: 5,
        newTitle: "Triceratops Skeleton",
        newContent: "Exhibit of a Triceratops skeleton.",
        linkAnimalName: "Triceratops",
      },
      {
        matchIndex: 6,
        newTitle: "Gallimimus bullatus",
        newContent: "Exhibit of a Gallimimus bullatus.",
        linkAnimalName: "Gallimimus bullatus",
      },
      {
        matchIndex: 7,
        newTitle: "Tyrannosaurus rex",
        newContent: "Exhibit of a Tyrannosaurus rex.",
        linkAnimalName: "Tyrannosaurus rex",
      },
      {
        matchIndex: 8,
        newTitle: "Mamenchisaurus hochuanensis",
        newContent: "Exhibit of a Mamenchisaurus hochuanensis.",
        linkAnimalName: "Mamenchisaurus hochuanensis",
      },
      {
        matchIndex: 9,
        newTitle: "Brachiosaurus brancai",
        newContent: "Exhibit of a Brachiosaurus brancai.",
        linkAnimalName: "Brachiosaurus brancai",
      },
      {
        matchIndex: 10,
        newTitle: "Brachiosaurus brancai",
        newContent: "Exhibit of a Brachiosaurus brancai.",
        linkAnimalName: "Brachiosaurus brancai",
      },
      {
        matchIndex: 11,
        newTitle: "Museum side view",
        newContent:
          "Side view of the Gunma Museum of Natural History building.",
      },
      {
        matchIndex: 12,
        newTitle: "Marine Mammals",
        newContent:
          "Exhibit of marine mammals and the skeleton of a Sperm Whale on the wall.",
        linkAnimalName: "Sperm Whale",
      },
      {
        matchIndex: 13,
        newTitle: "The Age of the Man",
        newContent: "Exhibit of a Mammoth, a Moose and an Elephant.",
        linkEraId: "cenozoic",
      },
      {
        matchIndex: 14,
        newTitle: "Entire Exhibition “Age of the Earth”",
        newContent:
          'Gunma Museum of Natural History building',
      },
    ] as Array<{
      matchTitle?: string;
      matchIndex?: number;
      newTitle?: string;
      newContent?: string;
      // Optional: automatically append a Markdown link to this animal
      linkAnimalName?: string;
      // Optional: automatically append a Markdown link to an Era
      linkEraId?: string;
      eye?: [number, number, number];
      target?: [number, number, number];
    }>,
  });

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

          // 1) Leer anotaciones existentes y aplicar cambios en runtime (no persistentes)
          api.getAnnotationList((err, list) => {
            if (err || !Array.isArray(list)) {
              return;
            }

            // a) Actualizar anotaciones (primero updates para no desplazar indices)
            const adjust = existingAdjustRef.current;
            if (adjust.update.length > 0) {
              const tasks: Array<() => void> = [];
              adjust.update.forEach((rule) => {
                let idx: number | undefined = undefined;
                if (typeof rule.matchIndex === "number") {
                  idx = rule.matchIndex;
                } else if (rule.matchTitle) {
                  idx = list.findIndex((a) => a && a.title === rule.matchTitle);
                }
                if (idx != null && idx >= 0) {
                  const baseUrl = window.location.origin;
                  const extras: string[] = [];
                  if (rule.linkAnimalName) {
                    extras.push(
                      `[See ${
                        rule.linkAnimalName
                      }](${baseUrl}/animal/${encodeURIComponent(
                        rule.linkAnimalName
                      )})`
                    );
                  }
                  if (rule.linkEraId) {
                    extras.push(
                      `[See the era: ${
                        rule.linkEraId
                      }](${baseUrl}/era/${encodeURIComponent(rule.linkEraId)})`
                    );
                  }
                  const linkBlock = extras.length ? `\n\n${extras.join("\n\n")}` : "";
                  const contentToSet = (rule.newContent ?? "") + linkBlock;

                  const current = list[idx] || {};
                  const titleChanged = !!(
                    rule.newTitle && current.title !== rule.newTitle
                  );
                  const contentChanged = !!(
                    (rule.newContent || extras.length) &&
                    (current.content ?? "") !== contentToSet
                  );
                  const eyeChanged = !!rule.eye;
                  const targetChanged = !!rule.target;

                  if (!(titleChanged || contentChanged || eyeChanged || targetChanged)) {
                    return; // skip no-op update
                  }

                  const options: {
                    title?: string;
                    content?: string;
                    eye?: [number, number, number];
                    target?: [number, number, number];
                  } = {};
                  if (titleChanged) options.title = rule.newTitle;
                  if (contentChanged) options.content = contentToSet;
                  if (eyeChanged) options.eye = rule.eye;
                  if (targetChanged) options.target = rule.target;

                  tasks.push(() => api.updateAnnotation(idx!, options, () => {}));
                }
              });

              // Throttle update calls to avoid hitting remote rate limits (429)
              tasks.forEach((fn, i) => setTimeout(fn, i * 200));
            }

            // b) Eliminar anotaciones por título y por índice (descendente para evitar shift)
            const indicesToRemove: number[] = [];
            if (adjust.removeByTitle.length > 0) {
              list.forEach((a, i) => {
                if (
                  a &&
                  typeof a.title === "string" &&
                  adjust.removeByTitle.includes(a.title)
                ) {
                  indicesToRemove.push(i);
                }
              });
            }
            if (adjust.removeByIndex.length > 0) {
              adjust.removeByIndex.forEach((i) => {
                if (typeof i === "number") indicesToRemove.push(i);
              });
            }
            if (indicesToRemove.length > 0) {
              Array.from(new Set(indicesToRemove))
                .sort((a, b) => b - a)
                .forEach((i) => api.removeAnnotation(i));
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
        <Navbar3
        logo={logo}
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
            allow="autoplay; fullscreen; xr-spatial-tracking; microphone; camera; gyroscope; accelerometer"
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
