import { Line } from "@react-three/drei";

export type Vec3 = [number, number, number];

export const palette = {
  silicon: "#93aaa8",
  siliconDark: "#354545",
  oxide: "#dde6df",
  diffusion: "#84b88b",
  poly: "#e36d55",
  metal: "#77a7d9",
  contact: "#cabdff",
  accent: "#e6ff65",
  ceramic: "#ddd5c3",
  gold: "#e8c369",
  dark: "#111519",
  board: "#344f42",
};

export function Block({
  position,
  size,
  color,
  opacity = 1,
  emissive,
  rotation = [0, 0, 0],
  metalness,
}: {
  position: Vec3;
  size: Vec3;
  color: string;
  opacity?: number;
  emissive?: string;
  rotation?: Vec3;
  metalness?: number;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        emissive={emissive ?? "#000000"}
        emissiveIntensity={emissive ? 1.2 : 0}
        transparent={opacity < 1}
        opacity={opacity}
        depthWrite={opacity > 0.45}
        roughness={0.42}
        metalness={metalness ?? (color === palette.metal ? 0.74 : 0.08)}
      />
    </mesh>
  );
}

export function Disc({
  position,
  radius,
  height,
  color,
  opacity = 1,
  rotation = [0, 0, 0],
  openEnded = false,
}: {
  position: Vec3;
  radius: number;
  height: number;
  color: string;
  opacity?: number;
  rotation?: Vec3;
  openEnded?: boolean;
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <cylinderGeometry args={[radius, radius, height, 72, 1, openEnded]} />
      <meshPhysicalMaterial
        color={color}
        transparent={opacity < 1}
        opacity={opacity}
        depthWrite={opacity > 0.45}
        roughness={0.24}
        metalness={0.24}
        clearcoat={0.34}
        side={openEnded ? 2 : 0}
      />
    </mesh>
  );
}

export function Path({
  points,
  color = palette.accent,
  width = 1.6,
  opacity = 1,
}: {
  points: Vec3[];
  color?: string;
  width?: number;
  opacity?: number;
}) {
  return <Line points={points} color={color} lineWidth={width} transparent opacity={opacity} />;
}

export function Marker({ position, color = palette.accent, size = 0.07 }: { position: Vec3; color?: string; size?: number }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
}
