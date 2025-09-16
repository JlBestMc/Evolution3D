import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";
import { useFrame } from "@react-three/fiber";

export default function BackgroundCrossfade({ path }: { path: string }) {
  const currentTexRef = useRef<THREE.Texture | null>(null);
  const prevTexRef = useRef<THREE.Texture | null>(null);
  const progressRef = useRef(1);
  const animatingRef = useRef(false);
  const lastPathRef = useRef<string | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const [revision, setRevision] = useState(0);

  const loadTexture = (url: string) =>
    new Promise<THREE.Texture>((resolve, reject) => {
      const loader = new TextureLoader();
      loader.load(
        url + "?v=" + Date.now(),
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.mapping = THREE.UVMapping;
          tex.needsUpdate = true;
          resolve(tex);
        },
        undefined,
        reject
      );
    });

  useEffect(() => {
    if (!path) return;
    if (lastPathRef.current === path && currentTexRef.current) return;
    let mounted = true;
    const previous = currentTexRef.current;
    if (previous) prevTexRef.current = previous;
    progressRef.current = previous ? 0 : 1;
    animatingRef.current = !!previous;
    loadTexture(path).then((tex) => {
      if (!mounted) return;
      currentTexRef.current = tex;
      if (!previous) {
        setRevision((r) => r + 1);
        return;
      }
      animatingRef.current = true;
    });
    lastPathRef.current = path;
    return () => {
      mounted = false;
    };
  }, [path]);

  useFrame((_, delta) => {
    if (!materialRef.current) return;
    const mat = materialRef.current;
    if (animatingRef.current) {
      const speed = 1 / 1.6;
      progressRef.current = Math.min(1, progressRef.current + delta * speed);
      if (progressRef.current >= 1) animatingRef.current = false;
    }
    const k = progressRef.current;
    const ease = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    const blur = Math.sin(ease * Math.PI) * 0.006;
    mat.uniforms.uTexCurrent.value = currentTexRef.current;
    mat.uniforms.uTexPrev.value = prevTexRef.current;
    mat.uniforms.uProgress.value = ease;
    mat.uniforms.uHasPrev.value = prevTexRef.current ? 1 : 0;
    mat.uniforms.uBlur.value = blur;
  });

  const shader = useMemo(
    () => ({
      uniforms: {
        uTexCurrent: { value: null },
        uTexPrev: { value: null },
        uProgress: { value: 1 },
        uHasPrev: { value: 0 },
        uBlur: { value: 0 },
      },
      vertexShader:
        "varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }",
      fragmentShader: `
      varying vec2 vUv; 
      uniform sampler2D uTexCurrent; 
      uniform sampler2D uTexPrev; 
      uniform float uProgress; 
      uniform float uHasPrev; 
      uniform float uBlur; 

      const float uExposure = 1.9;
      const float uGamma = 1.3; 

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
        vec3 linear = srgbToLinear(raw.rgb);
        linear *= uExposure;
        vec3 srgb = linearToSRGB(linear);
        gl_FragColor = vec4(srgb, 1.0);
      }
    `,
    }),
    []
  );

  if (!currentTexRef.current && !prevTexRef.current) {
    return (
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[800, 64, 64]} />
        <meshBasicMaterial side={THREE.BackSide} color="#000" />
      </mesh>
    );
  }

  return (
    <mesh key={revision} scale={[-1, 1, 1]}>
      <sphereGeometry args={[800, 64, 64]} />
      <shaderMaterial
        ref={(m: THREE.ShaderMaterial | null) => {
          materialRef.current = m;
        }}
        attach="material"
        args={[shader]}
        side={THREE.BackSide}
      />
    </mesh>
  );
}
