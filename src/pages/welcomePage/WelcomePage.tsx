import Spline from "@splinetool/react-spline";
import Navbar from "../../components/navbar/Navbar";
import logo from "/images/logo3D.png";
import { useRef, useState, useEffect } from "react";

export default function WelcomePage() {
  const totalScenes = 2;
  const loadedCountRef = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [minDelayDone, setMinDelayDone] = useState(false);

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
      <div className="pointer-events-auto relative z-30">
        <Navbar
          aStyles="cursor-pointer hidden bg-gradient-to-r from-blue-400/80 to-purple-800 bg-clip-text text-transparent"
          variantButton="primary"
          variantButton2="secondary"
          logo={logo}
          borderColor="border-white/30 hidden"
        />
      </div>

      <div
        className={`w-full h-full transition-opacity duration-800 ease-out ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
        style={{ clipPath: "inset(0 0 60px 0)" }}
      >
        <Spline
          scene="https://prod.spline.design/Pud25w0I37RAD7Gq/scene.splinecode"
          onLoad={handleSceneLoaded}
        />
      </div>
      <div
        className={`absolute right-80 top-47 pointer-events-auto h-1/2 w-90 z-20 transition-opacity duration-800 ease-out ${
          showContent ? "opacity-100" : "opacity-0"
        }`}
        style={{ clipPath: "inset(20px 0 65px 0)" }}
      >
        <Spline
          scene="https://prod.spline.design/LKd9I8zeBvzQ1QK9/scene.splinecode"
          onLoad={handleSceneLoaded}
        />
      </div>

      {!showContent && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black text-white z-40">
          <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
          <p className="text-xs tracking-wide font-light uppercase">
            Loading experience
          </p>
          <div className="text-[10px] opacity-60">
            {loadedCountRef.current}/{totalScenes} scenes
          </div>
        </div>
      )}
    </main>
  );
}
