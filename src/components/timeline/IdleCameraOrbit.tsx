import { useFrame, useThree } from "@react-three/fiber";

type Props = {
  active: boolean;
  radius?: number;
  period?: number;
};

export default function IdleCameraOrbit({ active, radius = 3, period = 120 }: Props) {
  const { camera, clock } = useThree();
  useFrame(() => {
    if (!active) return;
    const t = clock.getElapsedTime();
    const angle = (t / period) * Math.PI * 2.0;
    const y = Math.sin(t * 0.15) * 0.12;
    camera.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
    camera.lookAt(0, 0, 0);
  });
  return null;
}
