import { QuadraticBezierLine } from "@react-three/drei";
import { WaferBody } from "./FrontScenes";
import { Block, Marker, palette, Path, type Vec3 } from "./primitives";

export function ProbeScene() {
  return (
    <group rotation={[0.82, 0, -0.09]} scale={0.88} position={[0, -0.35, 0]}>
      <WaferBody tested selected />
      <mesh position={[0, 2.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.12, 0.16, 18, 64]} />
        <meshPhysicalMaterial color={palette.siliconDark} metalness={0.52} roughness={0.24} clearcoat={0.38} />
      </mesh>
      {PROBE_POINTS.map(([x, , z]) => (
        <group key={`${x}-${z}`}>
          <mesh position={[x, 0.66, z]}>
            <cylinderGeometry args={[0.025, 0.045, 1.0, 16]} />
            <meshStandardMaterial color={palette.gold} metalness={0.9} roughness={0.18} />
          </mesh>
          <mesh position={[x, 0.145, z]}>
            <coneGeometry args={[0.045, 0.16, 16]} />
            <meshStandardMaterial color={palette.gold} metalness={0.9} roughness={0.18} />
          </mesh>
          <Path points={[[x, 1.15, z], [x * 5, 2.0, z * 5]]} color={palette.gold} width={1.2} />
        </group>
      ))}
      <Marker position={[0, 0.14, 0]} color={palette.accent} size={0.07} />
    </group>
  );
}

export function DicingScene() {
  return (
    <group rotation={[0.82, 0, -0.09]} scale={0.9} position={[0, -0.28, 0]}>
      <WaferBody />
      {DICING_X_LANES.map((x) => (
        <Path key={`x-${x}`} points={[[x, 0.145, -2.25], [x, 0.145, 2.25]]} color={x === 0.295 ? palette.accent : "#dbe8df"} width={x === 0.295 ? 1.7 : 0.65} opacity={0.86} />
      ))}
      {DICING_Z_LANES.map((z) => (
        <Path key={`z-${z}`} points={[[-2.45, 0.15, z], [2.45, 0.15, z]]} color="#dbe8df" width={0.65} opacity={0.7} />
      ))}
      <mesh position={[0.295, 0.7, 0.48]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.58, 0.58, 0.09, 48]} />
        <meshPhysicalMaterial color={palette.metal} metalness={0.86} roughness={0.17} clearcoat={0.42} />
      </mesh>
      <mesh position={[0.295, 0.7, 0.48]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.42, 0.035, 10, 48]} />
        <meshBasicMaterial color={palette.accent} />
      </mesh>
    </group>
  );
}

export const PROBE_POINTS: Vec3[] = [
  [-0.12, 0.13, -0.08],
  [0.12, 0.13, -0.08],
  [-0.12, 0.13, 0.08],
  [0.12, 0.13, 0.08],
];

export const DICING_X_LANES = [-1.475, -0.885, -0.295, 0.295, 0.885, 1.475];
export const DICING_Z_LANES = [-1.175, -0.705, -0.235, 0.235, 0.705, 1.175];
export const PACKAGE_PIN_ROWS = [-1.42, -1.02, -0.62, -0.22, 0.22, 0.62, 1.02, 1.42];

export function PackageScene() {
  return (
    <group rotation={[0.42, -0.2, -0.05]} position={[0, -0.25, 0]} scale={0.88}>
      <Block position={[0, -0.16, 0]} size={[6.2, 0.38, 3.55]} color={palette.ceramic} />
      <Block position={[0, 0.13, 0]} size={[5.5, 0.2, 3.05]} color="#b7aa91" />
      <Block position={[0, 0.34, 0]} size={[2.25, 0.24, 2.35]} color={palette.siliconDark} />
      <Block position={[0, 0.49, 0]} size={[1.92, 0.08, 2.02]} color={palette.metal} metalness={0.66} />

      {PACKAGE_PIN_ROWS.map((z) => (
        <group key={z}>
          {([-1, 1] as const).map((side) => {
            const dieX = side * 0.9;
            const fingerX = side * 2.34;
            return (
              <group key={side}>
                <Block position={[dieX, 0.59, z * 0.6]} size={[0.16, 0.08, 0.15]} color={palette.gold} metalness={0.94} />
                <Block position={[fingerX, 0.28, z]} size={[1.16, 0.08, 0.12]} color={palette.gold} metalness={0.94} />
                <QuadraticBezierLine
                  start={[dieX, 0.64, z * 0.6]}
                  mid={[side * 1.52, 1.04, z * 0.8]}
                  end={[side * 1.78, 0.34, z]}
                  color={palette.gold}
                  lineWidth={1.35}
                />
                <Block position={[side * 3.62, -0.24, z]} size={[1.18, 0.11, 0.13]} color={palette.metal} metalness={0.9} />
                <Block position={[side * 4.18, -0.72, z]} size={[0.11, 1.02, 0.13]} color={palette.metal} metalness={0.9} />
              </group>
            );
          })}
        </group>
      ))}

      <Block position={[0, 2.0, 0]} size={[5.75, 0.46, 3.28]} color={palette.ceramic} />
      <Block position={[0, 1.73, 0]} size={[5.25, 0.1, 2.78]} color="#8f816a" />
    </group>
  );
}

const digitSegments: Record<"5" | "6", string[]> = {
  "5": ["a", "f", "g", "c", "d"],
  "6": ["a", "f", "g", "e", "c", "d"],
};

const segmentPositions: Record<string, { x: number; z: number; horizontal: boolean }> = {
  a: { x: 0, z: -0.43, horizontal: true },
  b: { x: 0.24, z: -0.21, horizontal: false },
  c: { x: 0.24, z: 0.23, horizontal: false },
  d: { x: 0, z: 0.45, horizontal: true },
  e: { x: -0.24, z: 0.23, horizontal: false },
  f: { x: -0.24, z: -0.21, horizontal: false },
  g: { x: 0, z: 0.01, horizontal: true },
};

function SevenSegmentDigit({ value, x, z, y }: { value: "5" | "6"; x: number; z: number; y: number }) {
  return (
    <group position={[x, y, z]}>
      {digitSegments[value].map((segment) => {
        const position = segmentPositions[segment];
        return (
          <Block
            key={segment}
            position={[position.x, 0, position.z]}
            size={position.horizontal ? [0.38, 0.07, 0.085] : [0.085, 0.07, 0.36]}
            color={palette.accent}
            emissive={palette.accent}
          />
        );
      })}
    </group>
  );
}

export function CalculatorScene() {
  const keys = Array.from({ length: 20 }, (_, index) => ({
    x: -1.65 + (index % 5) * 0.62,
    z: -0.1 + Math.floor(index / 5) * 0.58,
  }));

  return (
    <group rotation={[0.62, -0.12, -0.04]} position={[0, -0.45, 0]} scale={0.82}>
      <group position={[-1.2, 0, 0.65]}>
        <Block position={[0, -0.44, 0]} size={[5.45, 0.42, 6.25]} color="#282c2a" />
        <Block position={[0, -0.14, 0]} size={[4.85, 0.16, 5.65]} color={palette.board} />
        <Block position={[-0.95, 0.03, -1.28]} size={[1.16, 0.3, 0.72]} color={palette.dark} />
        {[-1.37, -1.1, -0.83, -0.56].map((x) => (
          <Block key={x} position={[x, 0.03, -1.72]} size={[0.13, 0.07, 0.48]} color={palette.metal} metalness={0.9} />
        ))}
        <Block position={[0.72, 0.02, -1.12]} size={[1.24, 0.25, 0.68]} color="#4b4d49" />
        <Block position={[1.5, 0.02, 0.2]} size={[0.8, 0.24, 1.25]} color="#51423b" />
        <Path points={[[-0.95, 0.14, -1.28], [0.15, 0.14, -0.45], [1.4, 0.14, 1.7]]} color={palette.accent} width={1.5} />
        <Path points={[[0.72, 0.14, -1.12], [1.72, 0.14, -0.35], [1.45, 0.14, 1.82]]} color={palette.metal} width={1.2} />
        <Marker position={[-0.95, 0.22, -1.28]} color={palette.accent} size={0.11} />
      </group>

      <group position={[1.45, 1.35, -0.55]}>
        <Block position={[0, 0, 0]} size={[5.35, 0.28, 6.05]} color="#d8d3c3" />
        <Block position={[1.18, 0.18, -1.72]} size={[1.55, 0.12, 1.25]} color={palette.dark} />
        <SevenSegmentDigit value="5" x={0.84} y={0.27} z={-1.72} />
        <SevenSegmentDigit value="6" x={1.51} y={0.27} z={-1.72} />
        {keys.map(({ x, z }, index) => (
          <Block
            key={index}
            position={[x, 0.24, z]}
            size={[0.44, 0.16, 0.38]}
            color={index % 5 === 4 ? palette.poly : "#f1ede2"}
          />
        ))}
      </group>

      <Path points={[[-2.15, 0.22, -0.63], [-0.65, 0.86, -0.25], [0.4, 1.58, 0.6]]} color={palette.accent} width={1.8} />
    </group>
  );
}
