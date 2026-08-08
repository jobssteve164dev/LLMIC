import { describe, expect, it } from "vitest";
import { Euler, Vector3 } from "three";
import {
  DICING_BLADE_EDGE_ROTATION,
  DICING_BLADE_ROTATION,
  DICING_X_LANES,
  DICING_Z_LANES,
  PACKAGE_PIN_ROWS,
  PROBE_POINTS,
} from "./BackendScenes";
import { getWaferFeatures } from "./FrontScenes";

describe("3D assembly spatial invariants", () => {
  it("lands every probe tip inside the same central die", () => {
    expect(PROBE_POINTS).toHaveLength(4);
    for (const [x, y, z] of PROBE_POINTS) {
      expect(Math.abs(x)).toBeLessThan(0.49 / 2);
      expect(Math.abs(z)).toBeLessThan(0.37 / 2);
      expect(y).toBeGreaterThanOrEqual(0.13);
    }
  });

  it("places cutting lanes halfway between die centers", () => {
    const expectedX = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((value) => value * 0.59);
    const expectedZ = [-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((value) => value * 0.47);
    DICING_X_LANES.forEach((lane, index) => expect(lane).toBeCloseTo(expectedX[index], 6));
    DICING_Z_LANES.forEach((lane, index) => expect(lane).toBeCloseTo(expectedZ[index], 6));
  });

  it("starts with a blank wafer and adds dies only after patterning", () => {
    expect(getWaferFeatures("blank")).toEqual({ showDies: false, showTestResults: false });
    expect(getWaferFeatures("patterned")).toEqual({ showDies: true, showTestResults: false });
    expect(getWaferFeatures("tested")).toEqual({ showDies: true, showTestResults: true });
  });

  it("aligns the yellow blade edge with the cutting blade plane", () => {
    const bladeAxis = new Vector3(0, 1, 0).applyEuler(new Euler(...DICING_BLADE_ROTATION));
    const edgeNormal = new Vector3(0, 0, 1).applyEuler(new Euler(...DICING_BLADE_EDGE_ROTATION));
    expect(Math.abs(bladeAxis.dot(edgeNormal))).toBeCloseTo(1, 6);
    expect(Math.abs(bladeAxis.dot(new Vector3(0, 0, 1)))).toBeCloseTo(0, 6);
  });

  it("keeps all 16 package connections", () => {
    expect(PACKAGE_PIN_ROWS.length * 2).toBe(16);
  });
});
