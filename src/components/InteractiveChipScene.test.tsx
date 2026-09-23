import { describe, expect, it } from "vitest";
import type { SceneKind } from "../data/steps";
import { getStageTransform } from "./InteractiveChipScene";

function stagePosition(width: number, height: number, layout: "intro" | "journey") {
  return getStageTransform("brief", layout, width, height).position;
}

const briefHorizontalBounds = { left: -2.88, right: 1.88 };
const baseStageScales: Record<SceneKind, number> = {
  brief: 0.78,
  logic: 0.74,
  mask: 0.72,
  quartz: 0.7,
  ingot: 0.75,
  wafer: 0.8,
  oxidation: 0.65,
  gate: 0.65,
  contact: 0.65,
  poly: 0.65,
  doping: 0.64,
  oxide: 0.65,
  metal: 0.65,
  passivation: 0.7,
  probe: 0.75,
  dicing: 0.78,
  package: 0.66,
  calculator: 0.54,
};
const allSceneKinds = Object.keys(baseStageScales) as SceneKind[];
const auditedMaximumRadiusAtBaseScale = 2.75;

function projectedBriefBounds(width: number, height: number, layout: "intro" | "journey") {
  const { position, scale } = getStageTransform("brief", layout, width, height);
  const viewportWidth = 2 * Math.tan((40 * Math.PI) / 360) * 8.7 * (width / height);
  const pixelsPerWorldUnit = width / viewportWidth;
  return {
    left: width / 2 + (position[0] + briefHorizontalBounds.left * scale) * pixelsPerWorldUnit,
    right: width / 2 + (position[0] + briefHorizontalBounds.right * scale) * pixelsPerWorldUnit,
  };
}

function introContentRight(width: number) {
  const left = Math.min(112, Math.max(32, width * 0.07));
  return left + Math.min(620, width * 0.46);
}

function stepPanelLeft(width: number) {
  const right = Math.min(104, Math.max(36, width * 0.06));
  return width - right - Math.min(430, width * 0.43);
}

function journeyContentLeft(width: number) {
  return width <= 1100 ? 88 : 270;
}

describe("3D stage responsive placement", () => {
  it("keeps the hero model in the right visual column on desktop", () => {
    expect(stagePosition(1800, 1040, "intro")[0]).toBeGreaterThan(0);
  });

  it("keeps the hero model to the right of the copy on tablet landscape", () => {
    const x = stagePosition(800, 700, "intro")[0];
    expect(x).toBeGreaterThan(0);
  });

  it("centers the hero model above the copy on phones", () => {
    expect(stagePosition(375, 812, "intro")[0]).toBe(0);
  });

  it("moves the journey model left when the tablet layout shows a side panel", () => {
    expect(stagePosition(800, 700, "journey")[0]).toBeLessThan(0);
  });

  it.each([
    [1800, 1040],
    [1100, 700],
    [1099, 700],
    [800, 700],
    [800, 1040],
  ])("keeps the projected hero inside its visual column at %ix%i", (width, height) => {
    const bounds = projectedBriefBounds(width, height, "intro");
    expect(bounds.left).toBeGreaterThanOrEqual(introContentRight(width) + 12);
    expect(bounds.right).toBeLessThanOrEqual(width - 12);
  });

  it.each([
    [800, 700],
    [800, 1040],
  ])("keeps the projected journey model inside the left column at %ix%i", (width, height) => {
    const bounds = projectedBriefBounds(width, height, "journey");
    expect(bounds.left).toBeGreaterThanOrEqual(12);
    expect(bounds.right).toBeLessThanOrEqual(stepPanelLeft(width) - 12);
  });

  it.each([
    [800, 700],
    [800, 1040],
    [899, 1040],
    [900, 1040],
    [1099, 1040],
  ])("keeps every journey scene inside the left visual column at %ix%i", (width, height) => {
    const viewportWidth = 2 * Math.tan((40 * Math.PI) / 360) * 8.7 * (width / height);
    const pixelsPerWorldUnit = width / viewportWidth;

    for (const kind of allSceneKinds) {
      const { position, scale } = getStageTransform(kind, "journey", width, height);
      const radius = auditedMaximumRadiusAtBaseScale * (scale / baseStageScales[kind]);
      const left = width / 2 + (position[0] - radius) * pixelsPerWorldUnit;
      const right = width / 2 + (position[0] + radius) * pixelsPerWorldUnit;
      expect(left, `${kind} left edge`).toBeGreaterThanOrEqual(journeyContentLeft(width));
      expect(right, `${kind} right edge`).toBeLessThanOrEqual(stepPanelLeft(width) - 12);
    }
  });
});
