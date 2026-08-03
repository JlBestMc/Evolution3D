import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useThree } from "@react-three/fiber";
import {
  acquireTimelineTexture,
  disposeUnusedTimelineTextures,
  type TextureLease,
} from "./timelineTextureCache";

type Props = {
  path: string;
  radius?: number;
  widthSegments?: number;
  heightSegments?: number;
  anisotropy?: number | "max";
  onLoadingChange?: (loading: boolean) => void;
  onReady?: () => void;
  onError?: (error: unknown) => void;
};

export default function BackgroundCrossfade({
  path,
  anisotropy = "max",
  onLoadingChange,
  onReady,
  onError,
}: Props) {
  const { gl, scene } = useThree();
  const currentLeaseRef = useRef<TextureLease | null>(null);
  const [currentTexture, setCurrentTexture] = useState<THREE.Texture | null>(
    null
  );

  useEffect(() => {
    if (!path) return;

    let active = true;
    onLoadingChange?.(true);

    acquireTimelineTexture(path, gl, anisotropy)
      .then((lease) => {
        if (!active) {
          lease.release();
          return;
        }

        const previousLease = currentLeaseRef.current;
        currentLeaseRef.current = lease;
        setCurrentTexture(lease.texture);
        previousLease?.release();
        onLoadingChange?.(false);
        onReady?.();
      })
      .catch((error: unknown) => {
        if (!active) return;
        onLoadingChange?.(false);
        onError?.(error);
      });

    return () => {
      active = false;
    };
  }, [anisotropy, gl, onError, onLoadingChange, onReady, path]);

  useEffect(() => {
    if (!currentTexture) return;

    currentTexture.mapping = THREE.EquirectangularReflectionMapping;
    currentTexture.needsUpdate = true;
    scene.background = currentTexture;

    return () => {
      if (scene.background === currentTexture) scene.background = null;
    };
  }, [currentTexture, scene]);

  useEffect(() => {
    return () => {
      currentLeaseRef.current?.release();
      currentLeaseRef.current = null;
      disposeUnusedTimelineTextures();
    };
  }, []);

  return null;
}
