import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleHelp,
  Gauge,
  Layers3,
  Rotate3D,
  X,
} from "lucide-react";
import { evidenceLabels, quickStepIndexes, sources, steps } from "./data/steps";

const ChipScene = lazy(() => import("./components/ChipScene").then((module) => ({ default: module.ChipScene })));

type JourneyMode = "full" | "quick";

function initialStepIndex() {
  const slug = window.location.hash.replace(/^#\/?/, "");
  const index = steps.findIndex((step) => step.id === slug);
  return index >= 0 ? index : 0;
}

function App() {
  const [currentIndex, setCurrentIndex] = useState(initialStepIndex);
  const [started, setStarted] = useState(() => window.location.hash.length > 1);
  const [mode, setMode] = useState<JourneyMode>("full");
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  const sequence = useMemo(() => mode === "quick" ? quickStepIndexes : steps.map((_, index) => index), [mode]);
  const sequencePosition = Math.max(0, sequence.indexOf(currentIndex));
  const step = steps[currentIndex];
  const progress = ((sequencePosition + 1) / sequence.length) * 100;
  const isFirst = sequencePosition === 0;
  const isLast = sequencePosition === sequence.length - 1;

  const goTo = useCallback((index: number) => {
    const next = Math.max(0, Math.min(steps.length - 1, index));
    setCurrentIndex(next);
    window.history.replaceState(null, "", `#${steps[next].id}`);
  }, []);

  const goNext = useCallback(() => {
    if (isLast) {
      setStarted(false);
      window.history.replaceState(null, "", window.location.pathname);
      return;
    }
    goTo(sequence[sequencePosition + 1]);
  }, [goTo, isLast, sequence, sequencePosition]);

  const goPrevious = useCallback(() => {
    if (!isFirst) goTo(sequence[sequencePosition - 1]);
  }, [goTo, isFirst, sequence, sequencePosition]);

  const startJourney = (nextMode: JourneyMode) => {
    setMode(nextMode);
    const startIndex = nextMode === "quick" ? quickStepIndexes[0] : 0;
    goTo(startIndex);
    setStarted(true);
  };

  const returnHome = () => {
    setStarted(false);
    window.history.replaceState(null, "", window.location.pathname);
  };

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReducedMotion(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!started || sourcesOpen || aboutOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "PageDown") goNext();
      if (event.key === "ArrowLeft" || event.key === "PageUp") goPrevious();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [aboutOpen, goNext, goPrevious, sourcesOpen, started]);

  useEffect(() => {
    if (!sourcesOpen && !aboutOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSourcesOpen(false);
        setAboutOpen(false);
      }
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [aboutOpen, sourcesOpen]);

  useEffect(() => {
    const onHashChange = () => {
      const index = initialStepIndex();
      setCurrentIndex(index);
      setStarted(window.location.hash.length > 1);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const stepSources = sources.filter((source) => step.sourceIds.includes(source.id));

  return (
    <div className={`app-shell ${started ? "is-started" : "is-intro"}`}>
      <header className="topbar">
        <button className="brand" type="button" onClick={returnHome} aria-label="返回 LLMIC 首页">
          <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
          <span>LLMIC</span>
        </button>
        <div className="topbar-meta" aria-hidden="true">
          <span>INTEL 4004</span>
          <span>1971 — 10 µm</span>
        </div>
        <nav className="topbar-actions" aria-label="辅助导航">
          <button type="button" className="text-button" onClick={() => setAboutOpen(true)}>
            <CircleHelp size={17} aria-hidden="true" />
            <span>关于</span>
          </button>
          <button type="button" className="text-button" onClick={() => setSourcesOpen(true)}>
            <BookOpen size={17} aria-hidden="true" />
            <span>资料</span>
          </button>
        </nav>
      </header>

      <main id="main-content" className="experience">
        <Suspense fallback={<div className="stage-loader" aria-hidden="true"><span /></div>}>
          <ChipScene kind={step.scene} reducedMotion={reducedMotion} />
        </Suspense>

        {!started ? (
          <section className="intro" aria-labelledby="intro-title">
            <p className="eyebrow"><span>一枚芯片的完整旅程</span><span>18 个制造步骤</span></p>
            <h1 id="intro-title">亲手造一颗<br /><em>Intel 4004</em></h1>
            <p className="intro-copy">从高纯硅、光刻和晶体管，到 16 个引脚中的第一代商业微处理器。</p>
            <div className="intro-actions">
              <button className="primary-button" type="button" onClick={() => startJourney("full")}>
                开始制造
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <button className="secondary-button" type="button" onClick={() => startJourney("quick")}>
                <Gauge size={18} aria-hidden="true" />
                2 分钟速览
              </button>
            </div>
            <div className="intro-facts" aria-label="Intel 4004 核心参数">
              <span><strong>2,300</strong> 晶体管</span>
              <span><strong>4 bit</strong> 数据宽度</span>
              <span><strong>750 kHz</strong> 时钟</span>
            </div>
          </section>
        ) : (
          <>
            <aside className="chapter-rail" aria-label="制造步骤">
              <div className="rail-line" aria-hidden="true"><span style={{ height: `${((currentIndex + 1) / steps.length) * 100}%` }} /></div>
              <div className="rail-steps">
                {steps.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    className={index === currentIndex ? "is-active" : index < currentIndex ? "is-complete" : ""}
                    onClick={() => {
                      if (mode === "quick") setMode("full");
                      goTo(index);
                    }}
                    aria-label={`第 ${index + 1} 步：${item.title}`}
                    aria-current={index === currentIndex ? "step" : undefined}
                  >
                    <span className="rail-dot">{index < currentIndex ? <Check size={11} /> : item.number}</span>
                    <span className="rail-label">{item.title}</span>
                  </button>
                ))}
              </div>
            </aside>

            <section className="step-panel" aria-labelledby="step-title">
              <div className="step-kicker">
                <span>{step.number} / 18</span>
                <span className={`evidence evidence-${step.evidence}`}>{evidenceLabels[step.evidence]}</span>
              </div>
              <p className="phase-label">{step.phase}</p>
              <h2 id="step-title">{step.title}</h2>
              <p className="takeaway">{step.takeaway}</p>

              <div className="interaction-hint">
                <Rotate3D size={19} aria-hidden="true" />
                <span>{step.action}</span>
              </div>

              <details className="deep-dive">
                <summary>深入一步 <ChevronRight size={16} aria-hidden="true" /></summary>
                <p>{step.detail}</p>
                <div className="source-links">
                  {stepSources.map((source) => (
                    <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
                      {source.institution}
                    </a>
                  ))}
                </div>
              </details>

              <div className="step-controls">
                <button className="icon-button" type="button" onClick={goPrevious} disabled={isFirst} aria-label="上一步">
                  <ArrowLeft size={20} aria-hidden="true" />
                </button>
                <button className="next-button" type="button" onClick={goNext}>
                  <span>{isLast ? "完成旅程" : "继续制造"}</span>
                  {isLast ? <Check size={19} aria-hidden="true" /> : <ArrowRight size={19} aria-hidden="true" />}
                </button>
              </div>
            </section>

            <div className="scale-card" aria-label={`当前尺度：${step.scale}`}>
              <span>当前尺度</span>
              <strong>{step.scale}</strong>
              <span className="scale-line" aria-hidden="true"><i /><i /><i /><i /></span>
            </div>

            <div className="mobile-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div>
            <p className="live-step" aria-live="polite">第 {currentIndex + 1} 步：{step.title}</p>
          </>
        )}
      </main>

      <footer className="footer-note">
        <span>独立科普项目 · 非 Intel 官方网站</span>
        <span>拖动旋转 · 滚轮缩放 · 方向键前进</span>
      </footer>

      {sourcesOpen && (
        <div className="overlay" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && setSourcesOpen(false)}>
          <section className="drawer" role="dialog" aria-modal="true" aria-labelledby="sources-title">
            <div className="drawer-head">
              <div>
                <p className="eyebrow">可核验的事实</p>
                <h2 id="sources-title">专业资料</h2>
              </div>
              <button type="button" className="icon-button" onClick={() => setSourcesOpen(false)} aria-label="关闭资料">
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <p className="drawer-intro">4004 专属事实来自原始数据手册、Intel 和博物馆史料；未公开的制造细节明确标为同期还原。</p>
            <div className="source-list">
              {sources.map((source, index) => (
                <a key={source.id} href={source.url} target="_blank" rel="noreferrer">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div><strong>{source.institution}</strong><p>{source.title}</p></div>
                  <ArrowRight size={18} aria-hidden="true" />
                </a>
              ))}
            </div>
          </section>
        </div>
      )}

      {aboutOpen && (
        <div className="overlay" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && setAboutOpen(false)}>
          <section className="about-card" role="dialog" aria-modal="true" aria-labelledby="about-title">
            <button type="button" className="icon-button close-card" onClick={() => setAboutOpen(false)} aria-label="关闭关于">
              <X size={20} aria-hidden="true" />
            </button>
            <Layers3 size={28} aria-hidden="true" />
            <p className="eyebrow">LLMIC / 2026</p>
            <h2 id="about-title">把制造过程<br />变成可以触摸的空间</h2>
            <p>本项目选择 Intel 4004，不只因为它经典，更因为约 2,300 个晶体管仍处在人可以看懂的尺度。所有 3D 模型均为原创教学示意，不复刻未获授权的历史图片或掩膜扫描。</p>
            <p className="about-note">“第一枚微处理器”取决于定义。本项目使用更准确的“首款商业化单芯片通用微处理器”表述。</p>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
