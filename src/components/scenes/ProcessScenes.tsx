import { Block, Marker, palette, Path } from "./primitives";

export type ProcessStage = "oxidation" | "gate" | "contact" | "poly" | "doping" | "oxide" | "metal";

const stageOrder: Record<ProcessStage, number> = {
  oxidation: 0,
  gate: 1,
  contact: 2,
  poly: 3,
  doping: 4,
  oxide: 5,
  metal: 6,
};

export interface ProcessFeatures {
  fieldOxide: boolean;
  gateOxide: boolean;
  buriedContactWindow: boolean;
  polysilicon: boolean;
  sourceDrain: boolean;
  protectionOxide: boolean;
  contactHoles: boolean;
  aluminum: boolean;
}

export function getProcessFeatures(stage: ProcessStage): ProcessFeatures {
  const order = stageOrder[stage];
  return {
    fieldOxide: true,
    gateOxide: order >= stageOrder.gate,
    buriedContactWindow: order >= stageOrder.contact,
    polysilicon: order >= stageOrder.poly,
    sourceDrain: order >= stageOrder.doping,
    protectionOxide: order >= stageOrder.oxide,
    contactHoles: order >= stageOrder.metal,
    aluminum: order >= stageOrder.metal,
  };
}

function FieldOxide() {
  return (
    <>
      <Block position={[-2.45, 0.14, 0]} size={[1.5, 0.28, 2.7]} color={palette.oxide} />
      <Block position={[2.45, 0.14, 0]} size={[1.5, 0.28, 2.7]} color={palette.oxide} />
    </>
  );
}

function GateOxide({ window }: { window: boolean }) {
  if (!window) {
    return <Block position={[0, 0.045, 0]} size={[3.4, 0.09, 2.7]} color="#eef5ee" />;
  }

  return (
    <>
      <Block position={[-1.61, 0.045, 0]} size={[0.18, 0.09, 2.7]} color="#eef5ee" />
      <Block position={[0.18, 0.045, 0]} size={[3.0, 0.09, 2.7]} color="#eef5ee" />
    </>
  );
}

function PatternedPolysilicon() {
  return (
    <>
      <Block position={[0, 0.2, 0]} size={[0.38, 0.22, 2.15]} color={palette.poly} />
      <Block position={[-0.73, 0.18, 0.83]} size={[1.46, 0.18, 0.3]} color={palette.poly} />
      <Block position={[-1.5, 0.13, 0.83]} size={[0.34, 0.26, 0.48]} color={palette.poly} />
    </>
  );
}

function FinalGateStack() {
  return (
    <>
      <Block position={[0, 0.045, 0]} size={[0.56, 0.09, 2.3]} color="#eef5ee" />
      <PatternedPolysilicon />
    </>
  );
}

function SourceDrain() {
  return (
    <>
      <Block position={[-0.84, -0.13, 0]} size={[1.32, 0.26, 2.18]} color={palette.diffusion} />
      <Block position={[0.84, -0.13, 0]} size={[1.32, 0.26, 2.18]} color={palette.diffusion} />
      <Block position={[-1.5, -0.13, 0.83]} size={[0.36, 0.26, 0.48]} color={palette.diffusion} />
    </>
  );
}

function DopingFront() {
  const particles = [-1.32, -1.04, -0.76, -0.48, 0.48, 0.76, 1.04, 1.32];
  return (
    <>
      {particles.map((x, index) => (
        <group key={x}>
          <Marker position={[x, 0.86 + (index % 2) * 0.18, index % 3 === 0 ? 0.55 : -0.35]} color={palette.accent} size={0.065} />
          <Path points={[[x, 0.75, index % 3 === 0 ? 0.55 : -0.35], [x, 0.12, index % 3 === 0 ? 0.55 : -0.35]]} color={palette.accent} width={0.8} opacity={0.72} />
        </group>
      ))}
    </>
  );
}

function ProtectionOxide() {
  return (
    <>
      <Block position={[0, 0.3, 0]} size={[3.42, 0.6, 2.72]} color={palette.oxide} opacity={0.43} />
      <Block position={[0, 0.3, -1.02]} size={[3.42, 0.6, 0.68]} color={palette.oxide} opacity={0.74} />
      <Block position={[0, 0.63, 0]} size={[3.52, 0.1, 2.82]} color="#f2f7f2" opacity={0.82} />
    </>
  );
}

function AluminumInterconnect() {
  const contacts = [
    { x: -0.84, z: -0.42 },
    { x: 0.84, z: 0.42 },
  ];
  return (
    <>
      {contacts.map(({ x, z }) => (
        <group key={`${x}-${z}`}>
          <Block position={[x, 0.32, z]} size={[0.28, 0.64, 0.28]} color={palette.metal} metalness={0.9} />
          <Block position={[x, 0.72, z > 0 ? 0.48 : -0.48]} size={[0.34, 0.12, 1.65]} color={palette.metal} metalness={0.9} />
        </group>
      ))}
      <Block position={[0, 0.45, 0.78]} size={[0.2, 0.48, 0.2]} color={palette.metal} metalness={0.9} />
      <Block position={[0, 0.72, 1.02]} size={[0.28, 0.12, 0.68]} color={palette.metal} metalness={0.9} />
    </>
  );
}

export function ProcessScene({ stage }: { stage: ProcessStage }) {
  const features = getProcessFeatures(stage);

  return (
    <group rotation={[0.08, -0.18, 0]} position={[0, -0.28, 0]}>
      <Block position={[0, -0.75, 0]} size={[6.4, 1.5, 2.7]} color={palette.siliconDark} />
      <FieldOxide />

      {features.gateOxide && !features.sourceDrain && <GateOxide window={features.buriedContactWindow} />}
      {features.polysilicon && !features.sourceDrain && <PatternedPolysilicon />}

      {features.sourceDrain && (
        <>
          <SourceDrain />
          <FinalGateStack />
        </>
      )}
      {stage === "doping" && <DopingFront />}
      {features.protectionOxide && <ProtectionOxide />}
      {features.aluminum && <AluminumInterconnect />}

      {stage === "contact" && (
        <>
          <Block position={[-1.5, 0.06, 0.83]} size={[0.38, 0.12, 0.5]} color={palette.siliconDark} />
          <Path points={[[ -1.5, 0.78, 0.83], [-1.5, 0.12, 0.83]]} color={palette.accent} width={1.8} />
        </>
      )}
      {stage === "gate" && (
        <Path points={[[-1.7, 0.2, 1.46], [1.7, 0.2, 1.46]]} color={palette.accent} width={1.2} opacity={0.76} />
      )}
    </group>
  );
}
