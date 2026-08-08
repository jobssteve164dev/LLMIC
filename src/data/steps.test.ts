import { describe, expect, it } from "vitest";
import { quickStepIndexes, sources, steps } from "./steps";

describe("production journey content", () => {
  it("contains the complete 18-step journey", () => {
    expect(steps).toHaveLength(18);
    expect(new Set(steps.map((step) => step.id)).size).toBe(18);
    expect(steps[0].scene).toBe("brief");
    expect(steps.at(-1)?.scene).toBe("calculator");
  });

  it("keeps every evidence source resolvable", () => {
    const sourceIds = new Set(sources.map((source) => source.id));
    for (const step of steps) {
      expect(step.sourceIds.length).toBeGreaterThan(0);
      for (const sourceId of step.sourceIds) expect(sourceIds.has(sourceId)).toBe(true);
    }
  });

  it("keeps quick mode ordered and complete", () => {
    expect(quickStepIndexes[0]).toBe(0);
    expect(quickStepIndexes.at(-1)).toBe(17);
    expect(quickStepIndexes.every((index, position) => position === 0 || index > quickStepIndexes[position - 1])).toBe(true);
  });
});
