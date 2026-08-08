import { Canvas, useThree } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import type { SceneKind } from "../data/steps";
import { CalculatorScene, DicingScene, PackageScene, ProbeScene } from "./scenes/BackendScenes";
import {
  CrystalPullingScene,
  LogicScene,
  MaskScene,
  PurificationScene,
  RequirementsScene,
  WaferScene,
} from "./scenes/FrontScenes";
import { PassivationDieScene, ProcessScene } from "./scenes/ProcessScenes";
import { palette, type Vec3 } from "./scenes/primitives";

function ObjectForScene({ kind }: { kind: SceneKind }) {
  switch (kind) {
    case "brief": return <RequirementsScene />;
    case "logic": return <LogicScene />;
    case "mask": return <MaskScene />;
    case "quartz": return <PurificationScene />;
    case "ingot": return <CrystalPullingScene />;
    case "wafer": return <WaferScene />;
    case "oxidation": return <ProcessScene stage="oxidation" />;
    case "gate": return <ProcessScene stage="gate" />;
    case "contact": return <ProcessScene stage="contact" />;
    case "poly": return <ProcessScene stage="poly" />;
    case "doping": return <ProcessScene stage="doping" />;
    case "oxide": return <ProcessScene stage="oxide" />;
    case "metal": return <ProcessScene stage="metal" />;
    case "passivation": return <PassivationDieScene />;
    case "probe": return <ProbeScene />;
    case "dicing": return <DicingScene />;
    case "package": return <PackageScene />;
    case "calculator": return <CalculatorScene />;
  }
}

const stageConfig: Record<SceneKind, { scale: number; position: Vec3 }> = {
  brief: { scale: 0.78, position: [-1.5, 0, 0] },
  logic: { scale: 0.74, position: [-1.22, 0, 0] },
  mask: { scale: 0.72, position: [-1.2, 0.05, 0] },
  quartz: { scale: 0.7, position: [-1.22, 0, 0] },
  ingot: { scale: 0.75, position: [-1.2, -0.05, 0] },
  wafer: { scale: 0.8, position: [-1.22, -0.05, 0] },
  oxidation: { scale: 0.65, position: [-1.16, 0, 0] },
  gate: { scale: 0.65, position: [-1.16, 0, 0] },
  contact: { scale: 0.65, position: [-1.16, 0, 0] },
  poly: { scale: 0.65, position: [-1.16, 0, 0] },
  doping: { scale: 0.64, position: [-1.16, -0.1, 0] },
  oxide: { scale: 0.65, position: [-1.16, 0, 0] },
  metal: { scale: 0.65, position: [-1.16, 0, 0] },
  passivation: { scale: 0.7, position: [-1.2, -0.05, 0] },
  probe: { scale: 0.75, position: [-1.26, -0.05, 0] },
  dicing: { scale: 0.78, position: [-1.28, -0.05, 0] },
  package: { scale: 0.66, position: [-1.24, -0.05, 0] },
  calculator: { scale: 0.54, position: [-1.28, -0.05, 0] },
};

function Stage({ kind, reducedMotion }: { kind: SceneKind; reducedMotion: boolean }) {
  const config = stageConfig[kind];
  const { width } = useThree((state) => state.size);
  const isDesktop = width >= 900;
  const position: Vec3 = isDesktop ? config.position : [0, config.position[1] + 0.45, 0];
  const scale = isDesktop ? config.scale : config.scale * 0.8;
  return (
    <Float
      speed={reducedMotion ? 0 : 0.55}
      rotationIntensity={reducedMotion ? 0 : 0.015}
      floatIntensity={reducedMotion ? 0 : 0.045}
    >
      <group key={kind} scale={scale} position={position}>
        <ObjectForScene kind={kind} />
      </group>
    </Float>
  );
}

export function InteractiveChipScene({ kind, reducedMotion }: { kind: SceneKind; reducedMotion: boolean }) {
  return (
    <div className="canvas-wrap" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0.55, 8.7], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        fallback={<div className="canvas-fallback">3D 图解暂不可用，文字内容仍可继续浏览。</div>}
      >
        <ambientLight intensity={1.7} />
        <directionalLight position={[4, 6, 7]} intensity={3.1} color="#fff8e7" />
        <directionalLight position={[-4, 2, 3]} intensity={1.2} color={palette.metal} />
        <pointLight position={[3, -1, 2]} intensity={9} distance={10} color={palette.poly} />
        <Suspense fallback={null}>
          <Stage kind={kind} reducedMotion={reducedMotion} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          minDistance={5.2}
          maxDistance={12}
          minPolarAngle={0.38}
          maxPolarAngle={2.45}
          enableDamping={!reducedMotion}
          dampingFactor={0.08}
        />
      </Canvas>
      <div className="canvas-grid" />
    </div>
  );
}
