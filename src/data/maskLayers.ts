export type MaskLayerId =
  | "diffusion"
  | "buried-contact"
  | "polysilicon"
  | "contact-vias"
  | "metal"
  | "passivation";

export type MaskViewMode = "stacked" | "exploded";

export interface MaskLayerDefinition {
  id: MaskLayerId;
  label: string;
  shortLabel: string;
  color: string;
  textureUrl: string;
  sourceFile: string | null;
  provenance: "archive-corrected" | "teaching-reconstruction";
}

export const maskLayers: MaskLayerDefinition[] = [
  {
    id: "diffusion",
    label: "扩散区",
    shortLabel: "扩散",
    color: "#84b88b",
    textureUrl: "/historical/4004/layers/diffusion.png",
    sourceFile: "i4004-diffusion.bmp",
    provenance: "archive-corrected",
  },
  {
    id: "buried-contact",
    label: "埋层接触",
    shortLabel: "埋接",
    color: "#e8c369",
    textureUrl: "/historical/4004/layers/buried-contact.png",
    sourceFile: "i4004-contacts.bmp",
    provenance: "archive-corrected",
  },
  {
    id: "polysilicon",
    label: "多晶硅",
    shortLabel: "多晶硅",
    color: "#e36d55",
    textureUrl: "/historical/4004/layers/polysilicon.png",
    sourceFile: "i4004-poly.bmp",
    provenance: "archive-corrected",
  },
  {
    id: "contact-vias",
    label: "接触孔",
    shortLabel: "接触孔",
    color: "#cabdff",
    textureUrl: "/historical/4004/layers/contact-vias.png",
    sourceFile: "i4004-vias.bmp",
    provenance: "archive-corrected",
  },
  {
    id: "metal",
    label: "金属互连",
    shortLabel: "金属",
    color: "#77a7d9",
    textureUrl: "/historical/4004/layers/metal.png",
    sourceFile: "i4004-metal.bmp",
    provenance: "archive-corrected",
  },
  {
    id: "passivation",
    label: "钝化开窗",
    shortLabel: "钝化",
    color: "#9ed8c0",
    textureUrl: "/historical/4004/layers/passivation-reconstruction.png",
    sourceFile: null,
    provenance: "teaching-reconstruction",
  },
];

export const allMaskLayerIds = maskLayers.map((layer) => layer.id);
export const maskCompositeTextureUrl = "/historical/4004/layers/composite.png";
export const maskArtworkAspect = 1968 / 2706;

