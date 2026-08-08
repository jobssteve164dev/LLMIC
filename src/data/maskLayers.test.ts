import { describe, expect, it } from "vitest";
import { allMaskLayerIds, maskLayers } from "./maskLayers";

describe("4004 archive mask layer manifest", () => {
  it("keeps all six teaching layers in physical bottom-to-top order", () => {
    expect(allMaskLayerIds).toEqual([
      "diffusion",
      "buried-contact",
      "polysilicon",
      "contact-vias",
      "metal",
      "passivation",
    ]);
    expect(new Set(allMaskLayerIds).size).toBe(6);
  });

  it("does not present the reconstructed passivation layer as archive artwork", () => {
    expect(maskLayers.slice(0, 5).every((layer) => layer.provenance === "archive-corrected")).toBe(true);
    expect(maskLayers.at(-1)).toMatchObject({
      id: "passivation",
      provenance: "teaching-reconstruction",
      sourceFile: null,
    });
  });

  it("keeps every declared texture inside the separately licensed public asset boundary", () => {
    for (const layer of maskLayers) {
      expect(layer.textureUrl).toMatch(/^\/historical\/4004\/layers\/[a-z-]+\.png$/);
    }
  });
});
