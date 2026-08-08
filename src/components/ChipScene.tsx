import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, OrbitControls } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import type { SceneKind } from "../data/steps";

const palette = {
  silicon: "#93aaa8",
  siliconDark: "#354545",
  oxide: "#dde6df",
  diffusion: "#84b88b",
  poly: "#e36d55",
  metal: "#77a7d9",
  contact: "#cabdff",
  accent: "#e6ff65",
  ceramic: "#ddd5c3",
  dark: "#111519",
};

function SoftBox({
  position,
  scale,
  color,
  opacity = 1,
  emissive,
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  opacity?: number;
  emissive?: string;
}) {
  return (
    <mesh position={position} scale={scale}>
      <boxGeometry />
      <meshStandardMaterial
        color={color}
        emissive={emissive ?? "#000000"}
        emissiveIntensity={emissive ? 1.4 : 0}
        transparent={opacity < 1}
        opacity={opacity}
        roughness={0.46}
        metalness={color === palette.metal ? 0.72 : 0.08}
      />
    </mesh>
  );
}

function Wafer({ tested = false, diced = false }: { tested?: boolean; diced?: boolean }) {
  const dies = useMemo(() => {
    const items: Array<{ x: number; y: number; good: boolean }> = [];
    for (let x = -3; x <= 3; x += 1) {
      for (let y = -3; y <= 3; y += 1) {
        if (x * x + y * y < 12) {
          items.push({ x, y, good: (x * 3 + y * 5 + 17) % 7 !== 0 });
        }
      }
    }
    return items;
  }, []);

  if (diced) {
    return (
      <group rotation={[-0.76, 0, 0.15]}>
        {dies.map((die, index) => (
          <SoftBox
            key={`${die.x}-${die.y}`}
            position={[die.x * 0.68, die.y * 0.56, Math.sin(index) * 0.08]}
            scale={[0.55, 0.43, 0.08]}
            color={die.good ? palette.silicon : "#34383a"}
            emissive={die.good && index === 20 ? palette.accent : undefined}
          />
        ))}
      </group>
    );
  }

  return (
    <group rotation={[-Math.PI / 2.7, 0, 0.12]}>
      <mesh>
        <cylinderGeometry args={[2.65, 2.65, 0.13, 96]} />
        <meshPhysicalMaterial color={palette.silicon} roughness={0.22} metalness={0.24} clearcoat={0.45} />
      </mesh>
      <group position={[0, 0.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        {dies.map((die) => (
          <mesh key={`${die.x}-${die.y}`} position={[die.x * 0.58, die.y * 0.46, 0]}>
            <boxGeometry args={[0.49, 0.37, 0.018]} />
            <meshStandardMaterial
              color={tested ? (die.good ? palette.diffusion : "#8d5252") : palette.siliconDark}
              emissive={tested && die.good ? "#193c25" : "#000000"}
              emissiveIntensity={0.55}
              roughness={0.5}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function BriefScene() {
  return (
    <group>
      {Array.from({ length: 12 }, (_, index) => {
        const angle = (index / 12) * Math.PI * 2;
        return (
          <SoftBox
            key={index}
            position={[Math.cos(angle) * 2.65, Math.sin(angle) * 1.55, -0.7]}
            scale={[0.5, 0.36, 0.16]}
            color={index % 3 === 0 ? palette.poly : palette.siliconDark}
          />
        );
      })}
      {[-1.15, -0.38, 0.38, 1.15].map((x, index) => (
        <SoftBox
          key={x}
          position={[x, 0, 0.45]}
          scale={[0.58, 0.78, 0.24]}
          color={[palette.metal, palette.diffusion, palette.contact, palette.accent][index]}
          emissive={index === 3 ? palette.accent : undefined}
        />
      ))}
    </group>
  );
}

function LogicScene() {
  const blocks = [
    [-1.4, 0.65, palette.poly],
    [-0.3, 0.65, palette.diffusion],
    [0.9, 0.65, palette.metal],
    [-1.2, -0.55, palette.contact],
    [0.15, -0.55, palette.poly],
    [1.35, -0.55, palette.diffusion],
  ] as const;
  return (
    <group rotation={[-0.18, -0.2, 0]}>
      <SoftBox position={[0, 0, -0.25]} scale={[3.2, 2.15, 0.18]} color={palette.siliconDark} />
      {blocks.map(([x, y, color], index) => (
        <SoftBox
          key={index}
          position={[x, y, 0.02]}
          scale={[0.82, 0.56, 0.16]}
          color={color}
          emissive={index === 4 ? palette.poly : undefined}
        />
      ))}
      <Line points={[[-2.5, 0.9, 0.25], [-0.3, 0.9, 0.25], [-0.3, -0.55, 0.25], [2.4, -0.55, 0.25]]} color={palette.accent} lineWidth={2} />
    </group>
  );
}

function MaskScene() {
  const colors = [palette.diffusion, palette.poly, palette.metal, palette.contact, "#e8c369", "#edf2f4"];
  return (
    <group rotation={[-0.55, -0.25, -0.12]}>
      {colors.map((color, index) => (
        <group key={color} position={[0, index * 0.34 - 0.85, 0]}>
          <SoftBox position={[0, 0, 0]} scale={[3.15, 0.045, 2.0]} color={color} opacity={0.2 + index * 0.055} />
          {Array.from({ length: 7 }, (_, trace) => (
            <SoftBox
              key={trace}
              position={[(trace - 3) * 0.72 + (index % 2) * 0.18, 0.06, ((trace * 3 + index) % 5 - 2) * 0.34]}
              scale={[0.08 + (trace % 2) * 0.09, 0.035, 0.5]}
              color={color}
            />
          ))}
        </group>
      ))}
    </group>
  );
}

function QuartzScene() {
  const points = useMemo(() => Array.from({ length: 24 }, (_, index) => ({
    p: [Math.sin(index * 2.4) * 2.1, Math.cos(index * 1.7) * 1.45, Math.sin(index * 0.8) * 1.1] as [number, number, number],
    s: 0.18 + (index % 4) * 0.045,
    pure: index % 6 !== 0,
  })), []);
  return (
    <group>
      {points.map(({ p, s, pure }, index) => (
        <mesh key={index} position={p} scale={s}>
          <octahedronGeometry />
          <meshPhysicalMaterial
            color={pure ? palette.silicon : palette.poly}
            emissive={pure ? "#203b3b" : "#56291f"}
            emissiveIntensity={0.4}
            transmission={pure ? 0.24 : 0}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function IngotScene() {
  return (
    <group rotation={[0.08, 0, -0.25]}>
      <mesh>
        <cylinderGeometry args={[1.15, 1.15, 4.5, 72]} />
        <meshPhysicalMaterial color={palette.silicon} metalness={0.32} roughness={0.2} clearcoat={0.7} />
      </mesh>
      {Array.from({ length: 13 }, (_, index) => (
        <mesh key={index} position={[0, index * 0.31 - 1.86, 0]}>
          <torusGeometry args={[1.17, 0.014, 8, 72]} />
          <meshBasicMaterial color={index === 11 ? palette.accent : "#b8d0ce"} transparent opacity={0.45} />
        </mesh>
      ))}
    </group>
  );
}

function TransistorBase({ mode }: { mode: SceneKind }) {
  const isDoping = mode === "doping";
  const isGate = mode === "gate";
  const isPoly = mode === "poly";
  const isContact = mode === "contact";
  const isMetal = mode === "metal";
  const isPassivation = mode === "passivation";
  const isOxide = mode === "oxide";

  return (
    <group rotation={[-0.28, -0.32, 0]}>
      <SoftBox position={[0, -0.7, 0]} scale={[4.0, 1.15, 2.0]} color={palette.siliconDark} />
      <SoftBox position={[-1.18, -0.05, 0]} scale={[1.05, 0.34, 1.45]} color={palette.diffusion} opacity={isDoping ? 1 : 0.72} emissive={isDoping ? palette.diffusion : undefined} />
      <SoftBox position={[1.18, -0.05, 0]} scale={[1.05, 0.34, 1.45]} color={palette.diffusion} opacity={isDoping ? 1 : 0.72} emissive={isDoping ? palette.diffusion : undefined} />
      <SoftBox position={[0, 0.18, 0]} scale={[1.15, 0.12, 1.52]} color={palette.oxide} opacity={0.86} />
      <SoftBox position={[0, 0.43, 0]} scale={[1.12, 0.26, 1.3]} color={palette.poly} emissive={isPoly || isGate ? palette.poly : undefined} />
      {(isOxide || isMetal || isPassivation) && (
        <SoftBox position={[0, 0.73, 0]} scale={[3.88, 0.22, 1.9]} color={palette.oxide} opacity={0.34} />
      )}
      {(isMetal || isPassivation) && (
        <>
          <SoftBox position={[-1.18, 1.0, 0]} scale={[0.32, 0.48, 0.75]} color={palette.metal} emissive={isMetal ? palette.metal : undefined} />
          <SoftBox position={[1.18, 1.0, 0]} scale={[0.32, 0.48, 0.75]} color={palette.metal} emissive={isMetal ? palette.metal : undefined} />
          <SoftBox position={[0, 1.25, 0]} scale={[3.05, 0.14, 0.72]} color={palette.metal} />
        </>
      )}
      {isPassivation && <SoftBox position={[0, 1.55, 0]} scale={[3.85, 0.16, 1.88]} color={palette.contact} opacity={0.25} />}
      {isContact && (
        <>
          <SoftBox position={[-0.62, 0.52, 0.02]} scale={[0.36, 0.38, 0.55]} color={palette.contact} emissive={palette.contact} />
          <Line points={[[-0.65, 0.9, 0.5], [-0.65, 0.25, 0.5], [-1.25, 0.05, 0.5]]} color={palette.accent} lineWidth={3} />
        </>
      )}
      {isGate && Array.from({ length: 13 }, (_, index) => (
        <mesh key={index} position={[(index - 6) * 0.14, -0.06 + Math.sin(index) * 0.04, 1.03]} scale={0.055}>
          <sphereGeometry args={[1, 14, 14]} />
          <meshBasicMaterial color={palette.accent} />
        </mesh>
      ))}
    </group>
  );
}

function ProbeScene() {
  return (
    <group>
      <Wafer tested />
      {[-1.2, -0.4, 0.4, 1.2].map((x) => (
        <group key={x} position={[x, 1.35, 1.2]} rotation={[0.38, 0, 0]}>
          <mesh>
            <cylinderGeometry args={[0.045, 0.015, 2.6, 16]} />
            <meshStandardMaterial color={palette.metal} metalness={0.85} roughness={0.2} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function PackageScene() {
  const pins = useMemo(() => Array.from({ length: 8 }, (_, index) => (index - 3.5) * 0.62), []);
  return (
    <group rotation={[-0.48, 0.14, -0.1]}>
      <SoftBox position={[0, -0.2, 0]} scale={[3.2, 0.55, 2.35]} color={palette.ceramic} />
      <SoftBox position={[0, 0.44, 0]} scale={[2.82, 0.28, 1.95]} color={"#f2eee4"} />
      <SoftBox position={[0, 0.08, 0]} scale={[0.9, 0.12, 1.1]} color={palette.siliconDark} emissive={"#203b3b"} />
      {pins.map((z, index) => (
        <group key={z}>
          <SoftBox position={[-2.04, -0.3, z * 0.44]} scale={[0.85, 0.09, 0.12]} color={palette.metal} />
          <SoftBox position={[2.04, -0.3, z * 0.44]} scale={[0.85, 0.09, 0.12]} color={palette.metal} />
          {index < 4 && (
            <>
              <Line points={[[-0.75, 0.22, z * 0.42], [-1.28, 0.38, z * 0.45], [-1.7, -0.15, z * 0.45]]} color="#e8c369" lineWidth={1.2} />
              <Line points={[[0.75, 0.22, z * 0.42], [1.28, 0.38, z * 0.45], [1.7, -0.15, z * 0.45]]} color="#e8c369" lineWidth={1.2} />
            </>
          )}
        </group>
      ))}
    </group>
  );
}

function CalculatorScene() {
  const keys = useMemo(() => Array.from({ length: 16 }, (_, index) => ({
    x: (index % 4 - 1.5) * 0.72,
    y: (Math.floor(index / 4) - 1.5) * -0.62 - 0.35,
  })), []);
  return (
    <group rotation={[-0.32, 0.2, -0.04]}>
      <SoftBox position={[0, 0, -0.25]} scale={[3.3, 4.3, 0.5]} color="#c9c2ae" />
      <SoftBox position={[0, 1.25, 0.08]} scale={[2.55, 0.7, 0.12]} color="#202522" emissive="#23372b" />
      {keys.map(({ x, y }, index) => (
        <SoftBox key={index} position={[x, y, 0.1]} scale={[0.48, 0.38, 0.14]} color={index % 4 === 3 ? palette.poly : "#343b3d"} />
      ))}
      <group position={[0, 1.25, 0.28]}>
        {[[-0.28, 0], [0.28, 0]].map(([x], digit) => (
          <group key={digit} position={[x, 0, 0]}>
            {(digit === 0 ? [[-0.14, 0.18, 0], [0.14, 0.18, 0], [-0.14, 0, 0], [0.14, 0, 0], [0.14, -0.18, 0], [-0.14, -0.18, 0]] : [[-0.14, 0.18, 0], [-0.14, 0, 0], [0.14, 0, 0], [-0.14, -0.18, 0], [0.14, -0.18, 0], [0, -0.27, 0]]).map((p, i) => (
              <SoftBox key={i} position={p as [number, number, number]} scale={[0.08, 0.045, 0.02]} color={palette.accent} emissive={palette.accent} />
            ))}
          </group>
        ))}
      </group>
    </group>
  );
}

function ObjectForScene({ kind }: { kind: SceneKind }) {
  switch (kind) {
    case "brief": return <BriefScene />;
    case "logic": return <LogicScene />;
    case "mask": return <MaskScene />;
    case "quartz": return <QuartzScene />;
    case "ingot": return <IngotScene />;
    case "wafer": return <Wafer />;
    case "oxidation": return <TransistorBase mode="oxidation" />;
    case "gate": return <TransistorBase mode="gate" />;
    case "contact": return <TransistorBase mode="contact" />;
    case "poly": return <TransistorBase mode="poly" />;
    case "doping": return <TransistorBase mode="doping" />;
    case "oxide": return <TransistorBase mode="oxide" />;
    case "metal": return <TransistorBase mode="metal" />;
    case "passivation": return <TransistorBase mode="passivation" />;
    case "probe": return <ProbeScene />;
    case "dicing": return <Wafer diced />;
    case "package": return <PackageScene />;
    case "calculator": return <CalculatorScene />;
  }
}

function AnimatedStage({ kind, reducedMotion }: { kind: SceneKind; reducedMotion: boolean }) {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (!group.current || reducedMotion) return;
    group.current.rotation.y += delta * 0.075;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.65) * 0.08;
  });
  return (
    <Float speed={reducedMotion ? 0 : 1} rotationIntensity={reducedMotion ? 0 : 0.08} floatIntensity={reducedMotion ? 0 : 0.18}>
      <group ref={group} key={kind} scale={kind === "calculator" ? 0.82 : 1}>
        <ObjectForScene kind={kind} />
      </group>
    </Float>
  );
}

export function ChipScene({ kind, reducedMotion }: { kind: SceneKind; reducedMotion: boolean }) {
  return (
    <div className="canvas-wrap" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.2, 7.8], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        fallback={<div className="canvas-fallback">3D 图解暂不可用，文字内容仍可继续浏览。</div>}
      >
        <ambientLight intensity={1.8} />
        <directionalLight position={[4, 5, 6]} intensity={3.2} color="#f8f2de" />
        <pointLight position={[-4, -2, 3]} intensity={18} distance={10} color={palette.metal} />
        <pointLight position={[3, 0, -2]} intensity={12} distance={8} color={palette.poly} />
        <Suspense fallback={null}>
          <AnimatedStage kind={kind} reducedMotion={reducedMotion} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={11}
          minPolarAngle={0.5}
          maxPolarAngle={2.35}
          enableDamping={!reducedMotion}
          dampingFactor={0.08}
        />
      </Canvas>
      <div className="canvas-grid" />
    </div>
  );
}
