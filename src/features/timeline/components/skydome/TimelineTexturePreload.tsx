import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { prefetchTimelineTexture } from "./timelineTextureCache";

type Props = {
  path?: string;
};

export default function TimelineTexturePreload({ path }: Props) {
  const { gl } = useThree();

  useEffect(() => {
    if (!path) return;
    void prefetchTimelineTexture(path, gl, "max").catch(() => undefined);
  }, [gl, path]);

  return null;
}