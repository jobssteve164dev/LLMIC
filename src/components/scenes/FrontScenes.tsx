import { useMemo } from "react";
import { Block, Disc, Marker, palette, Path, type Vec3 } from "./primitives";

export function RequirementsScene() {
  const legacy = useMemo(() => Array.from({ length: 12 }, (_, index) => ({
    x: -2.65 + (index % 3) * 0.62,
    y: 1.42 - Math.floor(index / 3) * 0.92,
  })), []);
  const mcsY = [1.38, 0.46, -0.46, -1.38];

  return (
    <group rotation={[-0.08, -0.16, 0]}>
      {legacy.map(({ x, y }, index) => (
        <Block key={index} position={[x, y, 0]} size={[0.46, 0.58, 0.22]} color={index % 3 === 0 ? "#51403b" : palette.siliconDark} />
      ))}
      <Path points={[[-0.72, 0, 0.08], [0.05, 0, 0.08]]} color={palette.accent} width={2.2} />
      {mcsY.map((y, index) => (
        <group key={y}>
          <Path points={[[0.05, 0, 0.08], [0.62, y, 0.08]]} color={palette.accent} width={1.1} opacity={0.68} />
          <Block
            position={[1.35, y, 0]}
            size={[1.05, 0.66, 0.3]}
            color={[palette.metal, palette.diffusion, palette.contact, palette.poly][index]}
            emissive={index === 3 ? palette.poly : undefined}
          />
        </group>
      ))}
    </group>
  );
}

export function LogicScene() {
  const lanes = [-1.05, -0.35, 0.35, 1.05];
  return (
    <group rotation={[0.66, -0.08, -0.06]}>
      <Block position={[0, -0.16, 0]} size={[6.2, 0.22, 3.4]} color={palette.siliconDark} />
      <Block position={[-2.25, 0.04, 0]} size={[1.05, 0.28, 2.55]} color={palette.contact} opacity={0.8} />
      <Block position={[2.25, 0.04, 0]} size={[1.05, 0.28, 2.55]} color={palette.metal} opacity={0.8} />
      {lanes.map((z, index) => (
        <group key={z}>
          <Block position={[0, 0.08, z]} size={[1.42, 0.34, 0.44]} color={palette.poly} emissive={index === 2 ? palette.poly : undefined} />
          <Path points={[[-1.72, 0.28, z], [-0.72, 0.28, z], [0.72, 0.28, z], [1.72, 0.28, z]]} color={palette.accent} width={1.5} />
        </group>
      ))}
      <Path points={[[-2.25, 0.3, -1.35], [-2.25, 0.3, 1.35]]} color={palette.contact} width={2.2} />
      <Path points={[[2.25, 0.3, -1.35], [2.25, 0.3, 1.35]]} color={palette.metal} width={2.2} />
    </group>
  );
}

const maskLayers = [
  { color: palette.diffusion, traces: [[-1.45, -0.65], [0.1, 0.2], [1.45, 0.75]] },
  { color: palette.contact, traces: [[-1.25, 0.62], [-0.45, -0.55], [1.42, -0.15]] },
  { color: palette.poly, traces: [[-1.35, 0.1], [0.15, -0.72], [1.2, 0.55]] },
  { color: "#efe5ff", traces: [[-1.55, -0.62], [0.45, 0.55], [1.48, -0.45]] },
  { color: palette.metal, traces: [[-1.2, 0.72], [0, 0], [1.35, -0.65]] },
  { color: palette.gold, traces: [[-1.55, 0.8], [0, -0.7], [1.52, 0.78]] },
] as const;

export function MaskScene() {
  return (
    <group rotation={[0.62, -0.22, -0.06]} position={[0, -0.12, 0]}>
      {maskLayers.map((layer, index) => {
        const y = index * 0.48 - 1.18;
        return (
          <group key={layer.color} position={[0, y, 0]}>
            <Block position={[0, 0, 0]} size={[5.5, 0.055, 3.35]} color={layer.color} opacity={0.12 + index * 0.035} />
            {layer.traces.map(([x, z], trace) => (
              <Block key={`${x}-${z}`} position={[x, 0.055, z]} size={[trace === 1 ? 1.15 : 0.52, 0.065, trace === 1 ? 0.2 : 0.72]} color={layer.color} opacity={0.92} />
            ))}
            {[[-2.35, -1.3], [2.35, -1.3], [-2.35, 1.3], [2.35, 1.3]].map(([x, z]) => (
              <Marker key={`${x}-${z}`} position={[x, 0.1, z]} color={palette.accent} size={0.055} />
            ))}
          </group>
        );
      })}
      {[[-2.35, -1.3], [2.35, -1.3], [-2.35, 1.3], [2.35, 1.3]].map(([x, z]) => (
        <Path key={`${x}-${z}`} points={[[x, -1.35, z], [x, 1.45, z]]} color={palette.accent} width={0.8} opacity={0.54} />
      ))}
    </group>
  );
}

export function PurificationScene() {
  const impurities: Vec3[] = [[-0.55, 0.6, 0.2], [-0.25, -0.65, 0.45], [0.2, 0.92, -0.35], [0.58, -0.18, 0.55], [0.18, -0.9, -0.42]];
  return (
    <group>
      <group position={[-2.4, 0, 0]}>
        {[[-0.35, 0.2, 0], [0.15, 0.55, -0.1], [0.38, -0.25, 0.18], [-0.2, -0.52, -0.2]].map((p, index) => (
          <mesh key={index} position={p as Vec3} scale={0.48 + index * 0.06}>
            <octahedronGeometry />
            <meshPhysicalMaterial color={palette.oxide} transmission={0.18} roughness={0.22} />
          </mesh>
        ))}
      </group>
      <Path points={[[-1.55, 0, 0], [-0.82, 0, 0]]} color={palette.accent} width={2} />
      <group position={[0, 0, 0]}>
        <Block position={[0, 0, 0]} size={[1.2, 1.65, 1.15]} color={palette.siliconDark} />
        {impurities.map((p, index) => <Marker key={index} position={p} color={palette.poly} size={0.09} />)}
        {impurities.slice(0, 3).map(([x, y, z], index) => (
          <Path key={index} points={[[x, y, z], [x * 1.8, y + 1.0, z]]} color={palette.poly} width={1.1} opacity={0.8} />
        ))}
      </group>
      <Path points={[[0.82, 0, 0], [1.55, 0, 0]]} color={palette.accent} width={2} />
      <group position={[2.35, 0, 0]}>
        {[-0.46, 0, 0.46].map((x, index) => (
          <mesh key={x} position={[x, 0, 0]} rotation={[0, 0, index === 1 ? 0.08 : -0.08]}>
            <cylinderGeometry args={[0.28, 0.28, 2.1, 28]} />
            <meshPhysicalMaterial color={palette.silicon} roughness={0.2} metalness={0.18} clearcoat={0.5} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

export function CrystalPullingScene() {
  return (
    <group position={[0, -0.25, 0]} rotation={[0.03, -0.15, -0.04]}>
      <Disc position={[0, -1.35, 0]} radius={1.72} height={1.15} color="#605c58" openEnded />
      <Disc position={[0, -1.1, 0]} radius={1.48} height={0.18} color={palette.poly} opacity={0.92} />
      <Disc position={[0, 0.45, 0]} radius={0.83} height={2.85} color={palette.silicon} />
      <mesh position={[0, -0.56, 0]}>
        <coneGeometry args={[0.82, 0.72, 48]} />
        <meshPhysicalMaterial color={palette.silicon} roughness={0.2} metalness={0.18} clearcoat={0.48} />
      </mesh>
      <Disc position={[0, 2.18, 0]} radius={0.24} height={0.72} color={palette.accent} />
      <Path points={[[0.54, 2.2, 0], [0.92, 2.48, 0], [0.58, 2.78, 0]]} color={palette.accent} width={1.3} />
      <Path points={[[-0.54, 2.2, 0], [-0.92, 2.48, 0], [-0.58, 2.78, 0]]} color={palette.accent} width={1.3} />
      {[1.9, 1.25, 0.6, -0.05].map((y) => (
        <mesh key={y} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.85, 0.012, 8, 56]} />
          <meshBasicMaterial color="#c1d2cf" transparent opacity={0.38} />
        </mesh>
      ))}
    </group>
  );
}

export interface DieCell {
  x: number;
  z: number;
  good: boolean;
}

export function buildDies(): DieCell[] {
  const dies: DieCell[] = [];
  for (let x = -3; x <= 3; x += 1) {
    for (let z = -3; z <= 3; z += 1) {
      if (x * x + z * z < 11.5) dies.push({ x, z, good: (x * 3 + z * 5 + 17) % 7 !== 0 });
    }
  }
  return dies;
}

export function WaferBody({ tested = false, selected = false }: { tested?: boolean; selected?: boolean }) {
  const dies = useMemo(buildDies, []);
  return (
    <group>
      <Disc position={[0, 0, 0]} radius={2.65} height={0.13} color={palette.silicon} />
      {dies.map((die) => {
        const isSelected = selected && die.x === 0 && die.z === 0;
        return (
          <Block
            key={`${die.x}-${die.z}`}
            position={[die.x * 0.59, 0.085, die.z * 0.47]}
            size={[0.49, 0.035, 0.37]}
            color={tested ? (die.good ? palette.diffusion : "#8d5252") : palette.siliconDark}
            emissive={isSelected ? palette.accent : tested && die.good ? "#183b26" : undefined}
          />
        );
      })}
      <Path points={[[2.25, 0.09, 1.35], [2.55, 0.09, 1.16]]} color={palette.accent} width={1.2} />
    </group>
  );
}

export function WaferScene() {
  return (
    <group rotation={[0.82, 0, -0.09]} scale={0.92}>
      <WaferBody />
    </group>
  );
}
