import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";
import { useThree } from "@react-three/fiber";

type Props = {
  path: string;
  radius?: number;
  widthSegments?: number;
  heightSegments?: number;
  anisotropy?: number | "max"; // texture anisotropy; "max" uses renderer capability
};

export default function BackgroundCrossfade({
  path,
  radius = 800,
  widthSegments = 64,
  heightSegments = 64,
  anisotropy = "max",
}: Props) {
  const { gl } = useThree();
  const currentTexRef = useRef<THREE.Texture | null>(null);
  const lastPathRef = useRef<string | null>(null);
  const [revision, setRevision] = useState(0);

  const loadTexture = useCallback(
    (url: string) =>
      new Promise<THREE.Texture>((resolve, reject) => {
        const loader = new TextureLoader();
        loader.load(
          url + "?v=" + Date.now(),
          (tex) => {
            // Color space and mapping
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.mapping = THREE.UVMapping;
            // High-quality sampling
            tex.generateMipmaps = true;
            tex.minFilter = THREE.LinearMipmapLinearFilter;
            tex.magFilter = THREE.LinearFilter;
            // Anisotropy for sharper grazing angles
            const maxAniso = gl.capabilities.getMaxAnisotropy?.() ?? 1;
            const desired = anisotropy === "max" ? maxAniso : Math.min(maxAniso, anisotropy ?? 1);
            tex.anisotropy = Math.max(1, desired);
            tex.needsUpdate = true;
            resolve(tex);
          },
          undefined,
          reject
        );
      }),
    [gl, anisotropy]
  );

  useEffect(() => {
    if (!path) return;
    if (lastPathRef.current === path && currentTexRef.current) return;

    let mounted = true;
    const prev = currentTexRef.current;
    loadTexture(path).then((tex) => {
      if (!mounted) return;
      // Dispose previous to avoid memory leaks
      if (prev) prev.dispose();
      currentTexRef.current = tex;
      setRevision((r) => r + 1);
    });
    lastPathRef.current = path;
    return () => {
      mounted = false;
    };
  }, [path, loadTexture]);

  if (!currentTexRef.current) {
    return (
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[radius, widthSegments, heightSegments]} />
        <meshBasicMaterial side={THREE.BackSide} color="#000" depthWrite={false} toneMapped={false} />
      </mesh>
    );
  }

  return (
    <mesh key={revision} scale={[-1, 1, 1]}>
      <sphereGeometry args={[radius, widthSegments, heightSegments]} />
      <meshBasicMaterial
        side={THREE.BackSide}
        depthWrite={false}
        toneMapped={false}
        map={currentTexRef.current ?? undefined}
      />
    </mesh>
  );
}
