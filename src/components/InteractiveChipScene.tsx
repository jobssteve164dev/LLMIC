import { Canvas, useThree } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import type { SceneKind } from "../data/steps";
import type { MaskLayerId, MaskViewMode } from "../data/maskLayers";
import { CalculatorScene, DicingScene, PackageScene, ProbeScene } from "./scenes/BackendScenes";
import {
  CrystalPullingScene,
  LogicScene,
  PurificationScene,
  RequirementsScene,
  WaferScene,
} from "./scenes/FrontScenes";
import { ProcessScene } from "./scenes/ProcessScenes";
import { palette, type Vec3 } from "./scenes/primitives";
import { ArchiveMaskScene } from "./scenes/ArchiveMaskScene";

interface SceneProps {
  kind: SceneKind;
  maskMode: MaskViewMode;
  visibleMaskLayers: MaskLayerId[];
}

export type StageLayout = "intro" | "journey";

function ObjectForScene({ kind, maskMode, visibleMaskLayers }: SceneProps) {
  switch (kind) {
    case "brief": return <RequirementsScene />;
    case "logic": return <LogicScene />;
    case "mask": return <ArchiveMaskScene mode={maskMode} visibleLayers={visibleMaskLayers} />;
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
    case "passivation": return <ArchiveMaskScene mode={maskMode} visibleLayers={visibleMaskLayers} />;
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

const stageCamera = { position: [0, 0.55, 8.7] as Vec3, fov: 40 };
// Covers the package pins after nested transforms, with margin above the audited 2.75 radius.
const maximumRadiusAtBaseScale = 2.8;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value));
}

function introVisualColumn(width: number) {
  const contentLeft = clamp(width * 0.07, 32, 112);
  const contentRight = contentLeft + Math.min(620, width * 0.46);
  return { left: contentRight + 12, right: width - 12 };
}

function journeyVisualColumn(width: number) {
  const panelRight = clamp(width * 0.06, 36, 104);
  const panelWidth = width <= 1100 ? Math.min(430, width * 0.43) : Math.min(440, width * 0.35);
  const panelLeft = width - panelRight - panelWidth;
  return { left: width <= 1100 ? 88 : 270, right: panelLeft - 12 };
}

export function getStageTransform(kind: SceneKind, layout: StageLayout, width: number, height: number) {
  const config = stageConfig[kind];
  const isPhone = width <= 760;
  const aspectRatio = width / height;
  const viewportWidth = 2 * Math.tan((stageCamera.fov * Math.PI) / 360) * stageCamera.position[2] * aspectRatio;
  if (isPhone) {
    return {
      position: [0, config.position[1] + 0.45, 0] as Vec3,
      scale: config.scale * 0.8,
    };
  }

  const column = layout === "intro" ? introVisualColumn(width) : journeyVisualColumn(width);
  const center = (column.left + column.right) / 2;
  const availableHalfWidth = (column.right - column.left) / 2 - 1;
  const pixelsPerWorldUnit = width / viewportWidth;
  const fitScale = availableHalfWidth / (maximumRadiusAtBaseScale * pixelsPerWorldUnit);
  const scaleLimit = layout === "intro" ? (width >= 1100 ? 0.9 : 0.72) : 1;
  const scaleMultiplier = Math.min(scaleLimit, fitScale);
  const position: Vec3 = [
    (center - width / 2) / pixelsPerWorldUnit,
    config.position[1] + (layout === "intro" ? 0.1 : 0),
    0,
  ];
  const scale = config.scale * scaleMultiplier;

  return { position, scale };
}

function Stage({ kind, reducedMotion, maskMode, visibleMaskLayers, layout }: SceneProps & { reducedMotion: boolean; layout: StageLayout }) {
  const { width, height } = useThree((state) => state.size);
  const { position, scale } = getStageTransform(kind, layout, width, height);
  return (
    <Float
      speed={reducedMotion ? 0 : 0.55}
      rotationIntensity={reducedMotion ? 0 : 0.015}
      floatIntensity={reducedMotion ? 0 : 0.045}
    >
      <group key={kind} scale={scale} position={position}>
        <ObjectForScene kind={kind} maskMode={maskMode} visibleMaskLayers={visibleMaskLayers} />
      </group>
    </Float>
  );
}

export function InteractiveChipScene({ kind, reducedMotion, maskMode, visibleMaskLayers, layout }: SceneProps & { reducedMotion: boolean; layout: StageLayout }) {
  return (
    <div className="canvas-wrap" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        camera={stageCamera}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        fallback={<div className="canvas-fallback">3D 图解暂不可用，文字内容仍可继续浏览。</div>}
      >
        <ambientLight intensity={1.7} />
        <directionalLight position={[4, 6, 7]} intensity={3.1} color="#fff8e7" />
        <directionalLight position={[-4, 2, 3]} intensity={1.2} color={palette.metal} />
        <pointLight position={[3, -1, 2]} intensity={9} distance={10} color={palette.poly} />
        <Suspense fallback={null}>
          <Stage
            kind={kind}
            reducedMotion={reducedMotion}
            maskMode={maskMode}
            visibleMaskLayers={visibleMaskLayers}
            layout={layout}
          />
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
