import { useTexture } from "@react-three/drei";
import { useMemo } from "react";
import { ClampToEdgeWrapping, DoubleSide, SRGBColorSpace, type Texture } from "three";
import {
  maskArtworkAspect,
  maskCompositeTextureUrl,
  maskLayers,
  type MaskLayerId,
  type MaskViewMode,
} from "../../data/maskLayers";
import { Block, palette, Path } from "./primitives";

const ARTWORK_HEIGHT = 5.08;
const ARTWORK_WIDTH = ARTWORK_HEIGHT * maskArtworkAspect;

function prepareTexture(texture: Texture) {
  texture.colorSpace = SRGBColorSpace;
  texture.wrapS = ClampToEdgeWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.anisotropy = 8;
}

export interface ArchiveMaskSceneProps {
  mode: MaskViewMode;
  visibleLayers: MaskLayerId[];
}

export function ArchiveMaskScene({ mode, visibleLayers }: ArchiveMaskSceneProps) {
  const textures = useTexture(maskLayers.map((layer) => layer.textureUrl));
  const visible = useMemo(() => new Set(visibleLayers), [visibleLayers]);
  textures.forEach(prepareTexture);

  return (
    <group rotation={[-0.13, -0.3, -0.025]} position={[0, -0.08, 0]}>
      <Block
        position={[0, 0, -0.16]}
        size={[ARTWORK_WIDTH + 0.22, ARTWORK_HEIGHT + 0.22, 0.2]}
        color={palette.siliconDark}
      />

      {maskLayers.map((layer, index) => {
        if (!visible.has(layer.id)) return null;
        const z = mode === "exploded" ? -0.5 + index * 0.26 : -0.045 + index * 0.013;
        return (
          <group key={layer.id} position={[0, 0, z]}>
            <mesh position={[0, 0, -0.002]}>
              <planeGeometry args={[ARTWORK_WIDTH, ARTWORK_HEIGHT]} />
              <meshBasicMaterial color={layer.color} transparent opacity={0.035} depthWrite={false} side={DoubleSide} />
            </mesh>
            <mesh renderOrder={index + 1}>
              <planeGeometry args={[ARTWORK_WIDTH, ARTWORK_HEIGHT]} />
              <meshBasicMaterial
                map={textures[index]}
                transparent
                alphaTest={0.012}
                depthWrite={false}
                side={DoubleSide}
                toneMapped={false}
              />
            </mesh>
          </group>
        );
      })}

      {mode === "exploded" && [
        [-ARTWORK_WIDTH / 2, -ARTWORK_HEIGHT / 2],
        [ARTWORK_WIDTH / 2, -ARTWORK_HEIGHT / 2],
        [-ARTWORK_WIDTH / 2, ARTWORK_HEIGHT / 2],
        [ARTWORK_WIDTH / 2, ARTWORK_HEIGHT / 2],
      ].map(([x, y]) => (
        <Path
          key={`${x}-${y}`}
          points={[[x, y, -0.62], [x, y, 0.94]]}
          color={palette.accent}
          width={0.7}
          opacity={0.46}
        />
      ))}
    </group>
  );
}

export function ArchiveMaskDieTexture({
  position,
  size = [0.46, 0.335],
}: {
  position: [number, number, number];
  size?: [number, number];
}) {
  const texture = useTexture(maskCompositeTextureUrl);
  prepareTexture(texture);
  texture.center.set(0.5, 0.5);
  texture.rotation = -Math.PI / 2;

  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={size} />
      <meshBasicMaterial
        map={texture}
        transparent
        alphaTest={0.02}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
