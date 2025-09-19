import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useState } from "react";
import { eras } from "../../data/eras";
import logo from "/images/favicon.ico";
import { Button } from "../../components/ui/button/Button";
import IdleCameraOrbit from "../../components/timeline/IdleCameraOrbit";
import BackgroundCrossfade from "../../components/timeline/BackgroundCrossfade";
import LoaderOverlay from "../../components/timeline/LoaderOverlay";
import WithProgressUI from "../../components/timeline/WithProgressUI";
import { TextureLoader } from "three";
import Navbar3 from "../../components/navbar/Navbar3";

export default function MainScene() {
  // Usar siempre un id existente como inicial para evitar undefined
  const [currentEra, setCurrentEra] = useState<string>(eras[0]?.id || "");
  const [freeView, setFreeView] = useState(false);
  const [bootReady, setBootReady] = useState(false);

  // Fallback seguro: si no encuentra coincidencia retorna la primera era
  const eraData = useMemo(() => {
    return eras.find((e) => e.id === currentEra) || eras[0];
  }, [currentEra]);

  const background = eraData?.background;
  // Pre-cargar todos los fondos PNG/JPG al inicio para que el primer cambio no tenga salto.
  useEffect(() => {
    let mounted = true;
    const loader = new TextureLoader();
    const bgPaths = Array.from(
      new Set(eras.map((e) => e.background).filter(Boolean))
    ) as string[];
    const nonHDR = bgPaths.filter(
      (p) => !p.endsWith(".hdr") && !p.endsWith(".exr")
    );
    let count = 0;
    if (nonHDR.length === 0) {
      setBootReady(true);
      return;
    }
    nonHDR.forEach((p) => {
      loader.load(
        p,
        () => {
          if (!mounted) return;
          count++;
          if (count === nonHDR.length) setBootReady(true);
        },
        undefined,
        () => {
          if (!mounted) return;
          count++;
          if (count === nonHDR.length) setBootReady(true);
        }
      );
    });
    return () => {
      mounted = false;
    };
  }, []);

  const isHDR = !!background && (background.endsWith(".hdr") || background.endsWith(".exr"));
  // El componente de crossfade se encargará de cargar texturas cuando NO sean HDR.

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <div className="absolute top-0 left-0 w-full z-30 pointer-events-auto">
        <Navbar3
          logo={logo}
        />
      </div>

      <Canvas camera={{ position: [0, 0, 3], fov: 100, near: 0.1, far: 2000 }}>
        <ambientLight intensity={0.2} />

        <IdleCameraOrbit active={!freeView} radius={3} period={120} />
        {background &&
          (isHDR ? (
            <Environment key={background} files={background} background />
          ) : (
            <BackgroundCrossfade path={background} />
          ))}

        {freeView && (
          <OrbitControls
            enableZoom
            enablePan={false}
            minDistance={0.5}
            maxDistance={50}
          />
        )}
      </Canvas>

      <LoaderOverlay />
      {!freeView && bootReady && (
        <WithProgressUI currentEra={currentEra} setCurrentEra={setCurrentEra} />
      )}

      {!bootReady && (
        <div className="absolute inset-0 flex items-center justify-center text-white pointer-events-none select-none">
          <div className="flex flex-col items-center gap-3 bg-black/40 px-6 py-4 rounded-xl backdrop-blur-sm">
            <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-sm tracking-wide">
              Preparando recursos iniciales…
            </span>
          </div>
        </div>
      )}

      <Button
        onClick={() => setFreeView(!freeView)}
        variant="secondary"
        styles="absolute bottom-8 left-8 z-30 bg-white/10 hover:bg-white/20 border border-white/25 shadow-[0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-md text-white/90 hover:text-white px-5 py-2.5 rounded-full text-[11px] tracking-wide uppercase transition-colors select-none"
      >
        {freeView ? "Close free view" : "Free view"}
      </Button>
    </div>
  );
}
