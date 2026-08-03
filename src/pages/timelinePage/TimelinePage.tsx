import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Compass } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { eras } from "@/data/eras";
import logo from "/images/favicon.ico";
import IdleCameraOrbit from "@/features/timeline/components/skydome/IdleCameraOrbit";
import BackgroundCrossfade from "@/features/timeline/components/skydome/BackgroundCrossfade";
import LoaderOverlay from "@/features/timeline/components/skydome/LoaderOverlay";
import WithProgressUI from "@/features/timeline/components/skydome/WithProgressUI";
import TimelineTexturePreload from "@/features/timeline/components/skydome/TimelineTexturePreload";
import Navbar3 from "@/components/navbar/Navbar3";
import Button2 from "@/components/ui/button/Button2";

export default function MainScene() {
  const [currentEra, setCurrentEra] = useState<string>(eras[0]?.id || "");
  const [freeView, setFreeView] = useState(false);
  const [initialReady, setInitialReady] = useState(false);
  const [backgroundLoading, setBackgroundLoading] = useState(true);
  const [backgroundError, setBackgroundError] = useState(false);
  const [retryToken, setRetryToken] = useState(0);

  const eraData = useMemo(() => {
    return eras.find((e) => e.id === currentEra) || eras[0];
  }, [currentEra]);

  const eraIndex = eras.findIndex((era) => era.id === currentEra);
  const background = eraData?.background;
  const preloadPath = eras[eraIndex + 1]?.background ?? eras[eraIndex - 1]?.background;

  const handleBackgroundLoading = useCallback((loading: boolean) => {
    setBackgroundLoading(loading);
  }, []);

  const handleBackgroundReady = useCallback(() => {
    setInitialReady(true);
    setBackgroundError(false);
  }, []);

  const handleBackgroundError = useCallback(() => {
    setBackgroundError(true);
  }, []);

  const handleEraChange = useCallback(
    (eraId: string) => {
      if (eraId === currentEra) return;
      setBackgroundLoading(true);
      setCurrentEra(eraId);
    },
    [currentEra]
  );

  const isHDR =
    !!background &&
    (background.endsWith(".hdr") || background.endsWith(".exr"));

  useEffect(() => {
    if (!isHDR) return;
    setInitialReady(true);
    setBackgroundLoading(false);
  }, [isHDR]);

  return (
    <div className="relative h-screen min-h-[100dvh] w-screen overflow-hidden bg-black">
      <div className="absolute top-0 left-0 w-full z-30 pointer-events-auto">
        <Navbar3 logo={logo} />
      </div>

      <Canvas
        camera={{ position: [0, 0, 3], fov: 90, near: 0.1, far: 2000 }}
        dpr={[1, 2]}
      >
        {!freeView && <IdleCameraOrbit active radius={3} period={120} />}
        {initialReady && !isHDR && <TimelineTexturePreload path={preloadPath} />}
        {background &&
          (isHDR ? (
            <Environment key={background} files={background} background />
          ) : (
            <BackgroundCrossfade
              key={`${background}-${retryToken}`}
              path={background}
              onLoadingChange={handleBackgroundLoading}
              onReady={handleBackgroundReady}
              onError={handleBackgroundError}
            />
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

      <LoaderOverlay
        active={isHDR ? undefined : backgroundLoading && initialReady}
      />
      {!freeView && initialReady && (
        <WithProgressUI
          currentEra={currentEra}
          setCurrentEra={handleEraChange}
          loading={backgroundLoading}
        />
      )}

      {!initialReady && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-[#02080a]/25 text-white backdrop-blur-[3px] select-none">
          <div className="pointer-events-auto flex w-[min(20rem,calc(100vw-2rem))] flex-col items-center gap-4 rounded-[1.5rem] border border-white/15 bg-[#071216]/80 px-6 py-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            {backgroundError ? (
              <>
                <span className="text-sm font-medium text-white/85">
                  No se pudo cargar este panorama.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setBackgroundError(false);
                    setRetryToken((token) => token + 1);
                  }}
                  className="rounded-full border border-white/20 bg-white/[0.08] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-white/40 hover:bg-white/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                >
                  Reintentar
                </button>
              </>
            ) : (
              <>
                <div className="relative grid size-12 place-items-center rounded-full border border-white/20 bg-white/[0.06]">
                  <div className="absolute inset-1 rounded-full border-2 border-white/15 border-t-white/90 animate-spin" />
                  <span className="text-sm text-white/80">01</span>
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/65">
                  Preparing timeline
                </span>
              </>
            )}
          </div>
        </div>
      )}

      <Button2
        onClick={() => setFreeView(!freeView)}
        ariaPressed={freeView}
        ariaLabel={freeView ? "Close free view" : "Open free view"}
        gradientHover="from-cyan-400 via-blue-500 to-purple-500"
        bgColor="bg-[#071216]/95"
        borderColor="bg-[#071216]/85"
        rounded="rounded-full"
        size="sm"
        styles="free-view-attention pointer-events-auto absolute right-4 top-[92px] z-40 sm:bottom-7 sm:left-auto sm:right-7 sm:top-auto"
        className="min-w-0 shadow-[0_16px_34px_rgba(0,0,0,0.35)] sm:min-w-[9.5rem]"
        title={freeView ? "Close free view" : "Open free view"}
      >
        <span className="inline-flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-full border border-white/20 bg-white/[0.08]">
            <Compass aria-hidden="true" className="size-3.5" />
          </span>
          <span className="hidden sm:inline">{freeView ? "Close free view" : "Free view 360º"}</span>
        </span>
      </Button2>
    </div>
  );
}
