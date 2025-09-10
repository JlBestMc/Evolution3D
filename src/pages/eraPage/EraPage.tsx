import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, AdaptiveDpr } from "@react-three/drei";
import animalsData, { type Animal } from "../../data/animals";
import Navbar from "../../components/navbar/Navbar";
import logo from "/images/logo3D.png";
import { Group, ReinhardToneMapping, SRGBColorSpace } from "three";

function SpinningModel({ url, paused, scale = 1 }: { url: string; paused?: boolean; scale?: number }) {
  const { scene } = useGLTF(url);
  const ref = useRef<Group>(null);
  useFrame((_, delta) => {
  if (!paused && ref.current) ref.current.rotation.y += delta * 0.3; // giro leve
  });
  return (
    <Center>
  <primitive ref={ref} object={scene} scale={[scale, scale, scale]} />
    </Center>
  );
}

function Card3D({ animal }: { animal: Animal }) {
  const [lost, setLost] = useState(false);
  const [interacting, setInteracting] = useState(false);
  return (
    <div className="relative w-72 h-96 rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-md shadow-xl">
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0.5, 3], fov: 50 }}
          gl={{ alpha: true, antialias: true }}
          dpr={[1, 1.5]}
          style={{ background: "transparent", cursor: interacting ? "grabbing" : "grab" }}
          onCreated={({ gl }) => {
            // Reducir saturación percibida: tone mapping + exposición
            gl.toneMapping = ReinhardToneMapping;
            gl.toneMappingExposure = 0.9;
            gl.outputColorSpace = SRGBColorSpace;

            const el = gl.domElement;
            const onLost = (e: Event) => {
              e.preventDefault();
              setLost(true);
            };
            const onRestore = () => setLost(false);
            el.addEventListener("webglcontextlost", onLost as EventListener, { passive: false } as AddEventListenerOptions);
            el.addEventListener("webglcontextrestored", onRestore as EventListener);
          }}
        >
          <AdaptiveDpr pixelated />
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 4, 5]} intensity={2.2} />
          <hemisphereLight intensity={0.35} />
          <Suspense fallback={null}>
            <SpinningModel url={animal.model} paused={interacting} scale={1.5} />
          </Suspense>
          <OrbitControls
            enablePan={false}
            enableZoom={false}
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
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
        <h3 className="text-lg font-semibold">{animal.name}</h3>
        <p className="text-xs opacity-80">{animal.description}</p>
      </div>
    </div>
  );
}

export default function EraPage() {
  // Mostrar todos por defecto; si el usuario selecciona una era, se filtra
  const [eraId] = useState<string>("");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        setScrollY(window.scrollY || window.pageYOffset || 0);
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const animals = useMemo(() => {
    return animalsData
      .filter(a => !eraId || a.eraId === eraId)
      .sort((a, b) => (a.startMa ?? 0) - (b.startMa ?? 0)); // del más antiguo al más reciente
  }, [eraId]);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* Parallax background */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(255,255,255,0.22),transparent_60%)] will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.05}px) scale(1.03)` }}
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_80%_120%,rgba(0,150,255,0.12),transparent_60%)] will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_10%_120%,rgba(180,100,255,0.1),transparent_60%)] will-change-transform"
          style={{ transform: `translateY(${scrollY * 0.16}px)` }}
        />
      </div>

      <div className="relative z-20">
        <Navbar
          aStyles="cursor-pointer bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent"
          variantButton="secondary"
          logo={logo}
          borderColor="border-white/30"
        />
      </div>

      <section className="relative z-10 container mx-auto px-6 py-10">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Era</h1>
          <p className="text-white/70 text-sm">3D animals — ordered by time</p>
        </header>

        {/* Carousel */}
        <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
          {animals.map((a) => (
            <div key={a.name} className="snap-center shrink-0">
              <Card3D animal={a} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

useGLTF.preload("/models/chicken/Archaeopteryx3D.glb");
useGLTF.preload("/models/whale/Whale3D.glb");
useGLTF.preload("/models/whale/Pakicetus3D.glb");

