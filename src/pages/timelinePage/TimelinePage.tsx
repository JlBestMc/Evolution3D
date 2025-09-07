import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, OrbitControls, useProgress } from "@react-three/drei"
import { useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { TextureLoader } from "three"
import { eras } from "../../data/eras"
import TimelineUI from "../../components/timeline/TimelineUI"
import Navbar from "../../components/navbar/Navbar"
import logo from "../../../public/images/logo3D.png"

export default function MainScene() {
  // Usar siempre un id existente como inicial para evitar undefined
  const [currentEra, setCurrentEra] = useState<string>(eras[0]?.id || "")
  const [freeView, setFreeView] = useState(false)
  const [bootReady, setBootReady] = useState(false)

  // Fallback seguro: si no encuentra coincidencia retorna la primera era
  const eraData = useMemo(() => {
    return eras.find(e => e.id === currentEra) || eras[0]
  }, [currentEra])

  const background = eraData?.background
  // Pre-cargar todos los fondos PNG/JPG al inicio para que el primer cambio no tenga salto.
  useEffect(() => {
    let mounted = true
    const loader = new TextureLoader()
    const bgPaths = Array.from(new Set(eras.map(e => e.background).filter(Boolean))) as string[]
    const nonHDR = bgPaths.filter(p => !p.endsWith('.hdr') && !p.endsWith('.exr'))
    let count = 0
    if (nonHDR.length === 0) { setBootReady(true); return }
    nonHDR.forEach(p => {
      loader.load(p, () => {
        if (!mounted) return
        count++
        if (count === nonHDR.length) setBootReady(true)
      }, undefined, () => {
        // Error también cuenta para no bloquear
        if (!mounted) return
        count++
        if (count === nonHDR.length) setBootReady(true)
      })
    })
    return () => { mounted = false }
  }, [])

  // Si por algún motivo aún no hay background, no intentamos cargar nada
  const isHDR = !!background && (background.endsWith('.hdr') || background.endsWith('.exr'))
  // El componente de crossfade se encargará de cargar texturas cuando NO sean HDR.

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Navbar consistente con WelcomePage */}
      <div className="absolute top-0 left-0 w-full z-30 pointer-events-auto">
        <Navbar
          aStyles="cursor-pointer bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent"
          variantButton="secondary"
          logo={logo}
          borderColor="border-white/30"
        />
      </div>

  {/* Gradiente superior para legibilidad */}
  <div className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/80 via-black/30 to-transparent z-20" />
  {/* Gradiente inferior suave */}
  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />

  <Canvas camera={{ position: [0, 0, 3], fov: 100, near: 0.1, far: 2000 }}>
        {/* Luz mínima para no oscurecer el HDRI */}
        <ambientLight intensity={0.2} />

  {/* Órbita lenta automática de cámara cuando no está en vista libre */}
  <IdleCameraOrbit active={!freeView} radius={3} period={120} />

        {/* Fondo dinámico (HDR/EXR) o Skydome PNG */}
        {background && (
          isHDR ? (
            <Environment key={background} files={background} background />
          ) : (
            <BackgroundCrossfade path={background} />
          )
        )}

        {/* Si estamos en modo libre → activar OrbitControls */}
        {freeView && (
          <OrbitControls enableZoom enablePan={false} minDistance={0.5} maxDistance={50} />
        )}
      </Canvas>

      {/* Interfaz visible solo si NO estamos en freeView */}
  <LoaderOverlay />
      {!freeView && bootReady && (
        <WithProgressUI currentEra={currentEra} setCurrentEra={setCurrentEra} />
      )}

      {!bootReady && (
        <div className="absolute inset-0 flex items-center justify-center text-white pointer-events-none select-none">
          <div className="flex flex-col items-center gap-3 bg-black/40 px-6 py-4 rounded-xl backdrop-blur-sm">
            <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="text-sm tracking-wide">Preparando recursos iniciales…</span>
          </div>
        </div>
      )}

      {/* Botón para alternar modos */}
      <button
        onClick={() => setFreeView(!freeView)}
        className="absolute top-28 right-8 z-30 bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur-md text-white px-5 py-2.5 rounded-full text-xs tracking-wide uppercase transition-colors"
      >
        {freeView ? "Close free view" : "Explore era"}
      </button>

    </div>
  )
}

// Wrapper para inyectar estado de carga al UI
function WithProgressUI({ currentEra, setCurrentEra }: { currentEra: string; setCurrentEra: (id: string) => void }) {
  const { active } = useProgress()
  return <TimelineUI currentEra={currentEra} setCurrentEra={setCurrentEra} loading={active} />
}

// Overlay global de carga basado en useProgress (cubre mientras se descargan texturas nuevas)
function LoaderOverlay() {
  const { active, progress } = useProgress()
  if (!active) return null
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-20">
      <div className="flex flex-col items-center gap-3 text-white">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        <span className="text-sm tracking-wide">Cargando {progress.toFixed(0)}%</span>
      </div>
    </div>
  )
}

// Crossfade para fondos PNG/JPG usando dos esferas inversas.
function BackgroundCrossfade({ path }: { path: string }) {
  const currentTexRef = useRef<THREE.Texture | null>(null)
  const prevTexRef = useRef<THREE.Texture | null>(null)
  const progressRef = useRef(1)
  const animatingRef = useRef(false)
  const lastPathRef = useRef<string | null>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)

  const loadTexture = (url: string) => new Promise<THREE.Texture>((resolve, reject) => {
    const loader = new TextureLoader()
    loader.load(url + '?v=' + Date.now(), tex => {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.mapping = THREE.UVMapping
      tex.needsUpdate = true
      resolve(tex)
    }, undefined, reject)
  })

  useEffect(() => {
    if (!path) return
    if (lastPathRef.current === path && currentTexRef.current) return
    const previous = currentTexRef.current
    if (previous) prevTexRef.current = previous
    progressRef.current = previous ? 0 : 1
    animatingRef.current = !!previous
    loadTexture(path).then(tex => {
      currentTexRef.current = tex
      if (!previous) return
      animatingRef.current = true
    })
    lastPathRef.current = path
  }, [path])

  useFrame((_, delta) => {
    if (!materialRef.current) return
    const mat = materialRef.current
    if (animatingRef.current) {
      const speed = 1 / 1.6
      progressRef.current = Math.min(1, progressRef.current + delta * speed)
      if (progressRef.current >= 1) animatingRef.current = false
    }
    const k = progressRef.current
    const ease = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2
    const blur = Math.sin(ease * Math.PI) * 0.006
    mat.uniforms.uTexCurrent.value = currentTexRef.current
    mat.uniforms.uTexPrev.value = prevTexRef.current
    mat.uniforms.uProgress.value = ease
    mat.uniforms.uHasPrev.value = prevTexRef.current ? 1 : 0
    mat.uniforms.uBlur.value = blur
  })

  const shader = useMemo(() => ({
    uniforms: {
      uTexCurrent: { value: null },
      uTexPrev: { value: null },
      uProgress: { value: 1 },
      uHasPrev: { value: 0 },
      uBlur: { value: 0 }
    },
    vertexShader: /* glsl */`varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }`,
    fragmentShader: /* glsl */`
      varying vec2 vUv; 
      uniform sampler2D uTexCurrent; 
      uniform sampler2D uTexPrev; 
      uniform float uProgress; 
      uniform float uHasPrev; 
      uniform float uBlur; 

      // Ajusta estos dos valores para experimentar:
      const float uExposure = 1.05; // >1 más brillante, <1 más oscuro
      const float uGamma = 0.2;     // 2.2 estándar; bajar = look más "plano"

      vec4 sampleBlur(sampler2D tx, vec2 uv, float b){
        if(b<=0.0001) return texture2D(tx,uv);
        vec2 o=vec2(b);
        vec4 c=texture2D(tx,uv)*0.4;
        c+=texture2D(tx,uv+vec2(o.x,0.0))*0.15;
        c+=texture2D(tx,uv-vec2(o.x,0.0))*0.15;
        c+=texture2D(tx,uv+vec2(0.0,o.x))*0.15;
        c+=texture2D(tx,uv-vec2(0.0,o.x))*0.15;
        return c; 
      }

      vec3 srgbToLinear(vec3 c){
        return pow(max(c,0.0), vec3(uGamma));
      }
      vec3 linearToSRGB(vec3 c){
        return pow(max(c,0.0), vec3(1.0 / uGamma));
      }

      void main(){
        float mixF = uProgress;
        float bP = (1.0 - mixF) * uBlur;
        float bC = mixF * uBlur;
        vec4 prev = uHasPrev > 0.5 ? sampleBlur(uTexPrev, vUv, bP) : vec4(0.0);
        vec4 curr = sampleBlur(uTexCurrent, vUv, bC);
        vec4 raw = mix(prev, curr, mixF);
        // Convertimos de sRGB (aprox) a lineal, aplicamos exposición y volvemos a sRGB
        vec3 linear = srgbToLinear(raw.rgb);
        linear *= uExposure;
        vec3 srgb = linearToSRGB(linear);
        gl_FragColor = vec4(srgb, 1.0);
      }
    `
  }), [])

  if (!currentTexRef.current && !prevTexRef.current) {
    return (
      <mesh scale={[-1,1,1]}>
        <sphereGeometry args={[800,64,64]} />
        <meshBasicMaterial side={THREE.BackSide} color="#000" />
      </mesh>
    )
  }

  return (
    <mesh scale={[-1,1,1]}>
      <sphereGeometry args={[800,64,64]} />
      <shaderMaterial
        // ref tipado sin usar any
        ref={(m: THREE.ShaderMaterial | null) => { materialRef.current = m }}
        attach="material"
        args={[shader]}
        side={THREE.BackSide}
      />
    </mesh>
  )
}

// Órbita de cámara: rota 360º continuo alrededor del centro (eje Y) muy lentamente.
function IdleCameraOrbit({ active, radius = 3, period = 120 }: { active: boolean; radius?: number; period?: number }) {
  const { camera, clock } = useThree()
  // Pequeña altura opcional dinámica para hacerlo menos estático
  useFrame(() => {
    if (!active) return
    const t = clock.getElapsedTime()
    const angle = (t / period) * Math.PI * 2.0 // ciclo completo cada "period" segundos
    const y = Math.sin(t * 0.15) * 0.12 // leve vaivén vertical
    camera.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius)
    camera.lookAt(0, 0, 0)
  })
  return null
}

