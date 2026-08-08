import { describe, expect, it } from "vitest";
import { getRelevantLegalDocuments, type LegalCatalogDocument } from "./legal";

describe("managed legal catalog", () => {
  it("shows only published documents with a user-facing route", () => {
    const documents: LegalCatalogDocument[] = [
      { type: "privacy_policy", title: "隐私政策", route_hint: "/privacy", summary: "", version: "v1", effective_at: "2026-08-07", publication_status: "published" },
      { type: "ai_entertainment_disclaimer", title: "AI 声明", route_hint: null, summary: "", version: "v1", effective_at: "2026-08-07", publication_status: "published" },
      { type: "terms_of_service", title: "服务条款", route_hint: "/terms", summary: "", version: "v2", effective_at: "2026-08-08", publication_status: "draft" },
    ];
    const relevant = getRelevantLegalDocuments(documents);
    expect(relevant.map((document) => document.type)).toEqual(["privacy_policy"]);
    expect(relevant[0].summary).toBe("了解访问本站时涉及的数据处理、用途与联系渠道。");
  });
});
