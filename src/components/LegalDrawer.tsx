import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, FileCheck2, RefreshCw, X } from "lucide-react";
import {
  fetchLegalCatalog,
  fetchLegalDocument,
  fetchProductSupplement,
  type LegalCatalog,
  type ManagedLegalContent,
} from "../data/legal";

export type LegalEntry = "catalog" | "supplement";

type LegalScreen =
  | { kind: "catalog" }
  | { kind: "supplement" }
  | { kind: "document"; type: string };

export function LegalDrawer({ entry, onClose }: { entry: LegalEntry; onClose: () => void }) {
  const [screen, setScreen] = useState<LegalScreen>({ kind: entry });
  const [catalog, setCatalog] = useState<LegalCatalog | null>(null);
  const [content, setContent] = useState<ManagedLegalContent | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setContent(null);

    const load = async () => {
      try {
        if (screen.kind === "catalog") {
          setCatalog(await fetchLegalCatalog(controller.signal));
        } else if (screen.kind === "supplement") {
          setContent(await fetchProductSupplement(controller.signal));
        } else {
          setContent(await fetchLegalDocument(screen.type, controller.signal));
        }
      } catch (nextError) {
        if (controller.signal.aborted) return;
        setError(nextError instanceof Error ? nextError.message : "法律文件暂时无法读取");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void load();
    return () => controller.abort();
  }, [reloadKey, screen]);

  const sections = useMemo(
    () => content?.composition.flatMap((part) => part.sections) ?? [],
    [content],
  );

  const heading = screen.kind === "catalog" ? "法律与合规" : content?.title || "产品补充说明";

  return (
    <div className="overlay" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && onClose()}>
      <section className="drawer legal-drawer" role="dialog" aria-modal="true" aria-labelledby="legal-title">
        <div className="drawer-head">
          <div>
            <p className="eyebrow"><span>SZLKlaws</span><span>当前有效版本</span></p>
            <h2 id="legal-title">{heading}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="关闭法律文件">
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {screen.kind === "document" && (
          <button type="button" className="legal-back" onClick={() => setScreen({ kind: "catalog" })}>
            <ArrowLeft size={16} aria-hidden="true" />
            返回文件目录
          </button>
        )}

        {loading && <div className="legal-loading" role="status"><span />正在读取已发布版本…</div>}

        {!loading && error && (
          <div className="legal-error" role="alert">
            <strong>暂时无法读取</strong>
            <p>{error}</p>
            <button type="button" onClick={() => setReloadKey((key) => key + 1)}>
              <RefreshCw size={16} aria-hidden="true" />
              重新读取
            </button>
          </div>
        )}

        {!loading && !error && screen.kind === "catalog" && catalog && (
          <>
            <p className="drawer-intro">这些法律文件由 SZLK LTD 提供；LLMIC 的具体数据使用、内容边界与许可差异另见产品补充说明。</p>
            <div className="legal-file-list">
              {catalog.documents.map((document) => (
                <button key={document.type} type="button" onClick={() => setScreen({ kind: "document", type: document.type })}>
                  <FileCheck2 size={19} aria-hidden="true" />
                  <span><strong>{document.title}</strong><small>{document.summary}</small></span>
                  <ArrowRight size={18} aria-hidden="true" />
                </button>
              ))}
            </div>
            <button type="button" className="legal-supplement-link" onClick={() => setScreen({ kind: "supplement" })}>
              查看 LLMIC 产品补充说明
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </>
        )}

        {!loading && !error && content && (
          <article className="legal-content">
            <div className="legal-meta">
              <span>版本 {content.version}</span>
              <span>生效日期 {content.effective_at}</span>
              <span>{content.publication_status === "published" ? "已正式发布" : content.publication_status}</span>
            </div>
            {sections.map((section) => (
              <section key={section.id}>
                <h3>{section.title}</h3>
                <p>{section.body_markdown}</p>
              </section>
            ))}
            <p className="legal-owner">由 SZLK LTD 通过 SZLKlaws 统一维护</p>
          </article>
        )}
      </section>
    </div>
  );
}
