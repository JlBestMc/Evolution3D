import { Text } from "@react-three/drei"

interface EraProps {
  name: string
  position: [number, number, number]
}

export default function Era({ name, position }: EraProps) {
  return (
    <group position={position}>
      {/* Título de la era */}
      <Text fontSize={1} color="white" position={[0, 2, 0]}>
        {name}
      </Text>

      {/* Placeholder del modelo */}
      <mesh>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial color="orange" />
      </mesh>
    </group>
  )
}
