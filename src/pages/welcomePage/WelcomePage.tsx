import Spline from "@splinetool/react-spline";
import Navbar from "../../components/navbar/Navbar";
import logo from "/public/images/logo3D.png";
import { useRef, useState, useEffect } from "react";

export default function WelcomePage() {
  const totalScenes = 2; // si añades más Spline, actualiza este número
  const loadedCountRef = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [minDelayDone, setMinDelayDone] = useState(false);

  // Garantiza un tiempo mínimo de transición para evitar flash (opcional)
  useEffect(() => {
    const t = setTimeout(() => setMinDelayDone(true), 400);
    return () => clearTimeout(t);
  }, []);

  const handleSceneLoaded = () => {
    loadedCountRef.current += 1;
    if (loadedCountRef.current >= totalScenes) {
      setLoaded(true);
    }
  };

  const showContent = loaded && minDelayDone;

  return (
    <main className="w-full h-screen overflow-hidden relative bg-black">
      {/* Navbar */}
      <div className="pointer-events-auto relative z-30">
        <Navbar
          aStyles="cursor-pointer hidden bg-gradient-to-r from-blue-400/80 to-purple-800 bg-clip-text text-transparent"
          variantButton="primary"
          variantButton2="secondary"
          logo={logo}
          borderColor="border-white/30 hidden"
        />
      </div>

      {/* Contenedor principal con fade-in */}
      <div
        className={`w-full h-full transition-opacity duration-800 ease-out ${showContent ? "opacity-100" : "opacity-0"}`}
        style={{ clipPath: "inset(0 0 60px 0)" }}
      >
        <Spline
          scene="https://prod.spline.design/Pud25w0I37RAD7Gq/scene.splinecode"
          onLoad={handleSceneLoaded}
        />
      </div>

      {/* Overlay con segundo Spline */}
      <div
        className={`absolute right-130 top-53 pointer-events-auto h-1/2 w-90 z-20 transition-opacity duration-800 ease-out ${showContent ? "opacity-100" : "opacity-0"}`}
        style={{ clipPath: "inset(0 0 56px 0)" }}
      >
        <Spline
          scene="https://prod.spline.design/LKd9I8zeBvzQ1QK9/scene.splinecode"
          onLoad={handleSceneLoaded}
        />
      </div>

      {/* Overlay de loading */}
      {!showContent && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black text-white z-40">
          <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
          <p className="text-xs tracking-wide font-light uppercase">Loading experience</p>
          <div className="text-[10px] opacity-60">{loadedCountRef.current}/{totalScenes} scenes</div>
        </div>
      )}
    </main>
  );
}
