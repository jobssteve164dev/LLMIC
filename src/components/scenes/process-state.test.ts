import { describe, expect, it } from "vitest";
import {
  getProcessFeatures,
  SILICON_SURFACE_Y,
  SOURCE_DRAIN_TOP_Y,
  type ProcessStage,
} from "./ProcessScenes";

const stages: ProcessStage[] = ["oxidation", "gate", "contact", "poly", "doping", "oxide", "metal"];

describe("cumulative silicon-gate process state", () => {
  it("never shows a material before its manufacturing step", () => {
    expect(getProcessFeatures("oxidation")).toEqual({
      fieldOxide: true,
      gateOxide: false,
      buriedContactWindow: false,
      polysilicon: false,
      sourceDrain: false,
      protectionOxide: false,
      contactHoles: false,
      aluminum: false,
    });
    expect(getProcessFeatures("gate").gateOxide).toBe(true);
    expect(getProcessFeatures("contact").buriedContactWindow).toBe(true);
    expect(getProcessFeatures("poly").polysilicon).toBe(true);
    expect(getProcessFeatures("doping").sourceDrain).toBe(true);
    expect(getProcessFeatures("oxide").protectionOxide).toBe(true);
    expect(getProcessFeatures("metal").contactHoles).toBe(true);
    expect(getProcessFeatures("metal").aluminum).toBe(true);
  });

  it("only adds features as the journey advances", () => {
    const states = stages.map(getProcessFeatures);
    for (let index = 1; index < states.length; index += 1) {
      for (const feature of Object.keys(states[index]) as Array<keyof typeof states[number]>) {
        if (states[index - 1][feature]) expect(states[index][feature]).toBe(true);
      }
    }
  });

  it("keeps the visible doped surface clear of the silicon depth plane", () => {
    expect(SOURCE_DRAIN_TOP_Y).toBeGreaterThan(SILICON_SURFACE_Y);
    expect(SOURCE_DRAIN_TOP_Y - SILICON_SURFACE_Y).toBeCloseTo(0.01, 6);
  });
});
