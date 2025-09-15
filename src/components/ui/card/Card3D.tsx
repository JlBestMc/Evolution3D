import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, AdaptiveDpr } from "@react-three/drei";
import { Group, ReinhardToneMapping, SRGBColorSpace } from "three";
import { eras } from "../../../data/eras";
import type { Card3DProps } from "./Card3D.types";

function SpinningModel({
  url,
  paused,
  scale = 1,
}: {
  url: string;
  paused?: boolean;
  scale?: number;
}) {
  const { scene } = useGLTF(url, true);
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
    if (!paused && ref.current) ref.current.rotation.y += delta * 0.3;
  });
  return (
    <Center>
      <primitive ref={ref} object={scene} scale={[scale, scale, scale]} />
    </Center>
  );
}

export function Card3D({
  animal,
  enableZoom = false,
  minDistance = 1.8,
  maxDistance = 5,
  widthClass = "w-100",
  heightClass = "h-140",
  className = "",
  modelScale = 1.8,
}: Card3DProps) {
  const [lost, setLost] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const eraColor = useMemo(
    () => eras.find((e) => e.id === animal.eraId)?.color ?? "#8ab4ff",
    [animal.eraId]
  );

  const ageLabel = useMemo(() => {
    const ma = animal.startMa;
    if (ma == null) return null;
    if (ma >= 1000) {
      const ga = ma / 1000;
      const formatted = Number.isInteger(ga) ? ga.toFixed(0) : ga.toFixed(1);
      return `${formatted} Ga`;
    }
    const formatted =
      ma < 1
        ? ma.toFixed(2)
        : Number.isInteger(ma)
        ? ma.toFixed(0)
        : ma.toFixed(1);
    return `${formatted} Ma`;
  }, [animal.startMa]);

  return (
    <div
      className={`group relative ${widthClass} ${heightClass} rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-md shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 md:duration-500 ${className}`}
      style={{ boxShadow: `0 0 40px -12px ${eraColor}55` }}
    >
      <div
        className="absolute inset-0 -z-0"
        style={{
          background: `linear-gradient(140deg, rgba(8,11,20,0.9), ${eraColor}14 45%, rgba(0,0,0,0.92))`,
        }}
      />

      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute w-3 h-3 rounded-full blur-md transition-transform duration-500 group-hover:scale-150"
          style={{ left: "15%", top: "20%", background: `${eraColor}` }}
        />
        <div
          className="absolute w-4 h-4 rounded-full blur-lg transition-transform duration-500 group-hover:scale-125"
          style={{ right: "25%", bottom: "15%", background: `${eraColor}cc` }}
        />
        <div
          className="absolute w-2 h-2 bg-yellow-400 rounded-full blur transition-transform duration-500 group-hover:scale-150"
          style={{ left: "40%", top: "10%" }}
        />
      </div>

      <div className="absolute inset-0 rounded-2xl border-2 border-transparent transition-colors duration-500 group-hover:border-white/20 pointer-events-none">
        <div
          className="absolute top-0 left-0 h-1 w-1/3 rounded-full transition-all duration-500 group-hover:w-full"
          style={{
            background: `linear-gradient(90deg, transparent, ${eraColor}, transparent)`,
          }}
        />
      </div>

      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0.5, 3], fov: 60 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 1.5]}
          style={{
            background: "transparent",
            cursor: interacting ? "grabbing" : "grab",
          }}
          onCreated={({ gl }) => {
            gl.toneMapping = ReinhardToneMapping;
            gl.toneMappingExposure = 0.9;
            gl.outputColorSpace = SRGBColorSpace;
            const el = gl.domElement;
            const onLost = (e: Event) => {
              e.preventDefault();
              setLost(true);
            };
            const onRestore = () => setLost(false);
            el.addEventListener(
              "webglcontextlost",
              onLost as EventListener,
              { passive: false } as AddEventListenerOptions
            );
            el.addEventListener(
              "webglcontextrestored",
              onRestore as EventListener
            );
          }}
        >
          <AdaptiveDpr pixelated />
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 4, 5]} intensity={2.2} />
          <hemisphereLight intensity={0.35} />
          <Suspense fallback={null}>
            <SpinningModel url={animal.model} paused={interacting} scale={modelScale} />
          </Suspense>
          <OrbitControls
            enablePan={false}
            enableZoom={enableZoom}
            minDistance={minDistance}
            maxDistance={maxDistance}
            enableRotate
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.7}
            minPolarAngle={Math.PI / 2 - 0.6}
            maxPolarAngle={Math.PI / 2 + 0.6}
            onStart={() => setInteracting(true)}
            onEnd={() => setInteracting(false)}
          />
        </Canvas>
        {lost && (
          <div className="absolute inset-0 flex items-center justify-center text-white/70 text-xs bg-black/20">
            WebGL context lost — try reducing open tabs or GPU load
          </div>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/75 via-black/10 to-transparent text-white">
        <h3 className="text-[15px] font-semibold tracking-wide drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] flex items-center gap-2">
          {animal.name}
          {ageLabel && (
            <span
              className="inline-flex items-center rounded-md border border-white/10 bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-white/80"
              title="Age (millions/billions of years ago)"
            >
              ≈ {ageLabel}
            </span>
          )}
        </h3>
        <p className="mt-0.5 text-[11px] leading-snug opacity-80">
          {animal.subtitle ?? animal.description}
        </p>
      </div>

      <div
        className="absolute top-2 right-2 z-10 rounded-full px-2 py-0.5 text-[10px] font-semibold text-white/90"
        style={{
          background: `${eraColor}33`,
          border: `1px solid ${eraColor}66`,
          backdropFilter: "blur(4px)",
        }}
      >
        3D
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/10" />
    </div>
  );
}
