"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Markdown from "react-markdown";
import {
  Cpu,
  BookOpen,
  FlaskConical,
  Library,
  ArrowUpRight,
  Play,
  Layers,
  Check,
  ChevronRight,
  Sun,
  Moon,
  Globe,
  Terminal,
  RotateCcw,
  Share2,
} from "lucide-react";
import curriculum from "@/content/curriculum.json";
import exerciseData from "@/content/exercises.json";
import exampleData from "@/content/examples.json";
import { grade, readProgress, basicLint } from "@/lib/grading";
import { parseVcd } from "@/lib/vcd";
const Editor = dynamic(() => import("./Editor"), {
  ssr: false,
  loading: () => <div className="editor-loading">Đang mở trình soạn thảo…</div>,
});
type Lang = "vi" | "en";
type Text = { vi: string; en: string };
type Exercise = {
  id: string;
  module: string;
  title: Text;
  prompt: Text;
  hints: { vi: string[]; en: string[] };
  starter: string;
  solution: string;
  testbench: string;
};
type Example = {
  id: string;
  title: Text;
  description: Text;
  design: string;
  testbench: string;
  source: string;
  license: string;
};
type Netlist = {
  modules: Record<
    string,
    {
      cells?: Record<
        string,
        { type: string; connections: Record<string, (string | number)[]> }
      >;
      ports?: Record<string, { direction: string; bits: (number | string)[] }>;
    }
  >;
};
const exercises = exerciseData as Exercise[];
const examples = exampleData as Example[];
const initial = examples[0];
const resources = [
  [
    "HDLBits",
    "Luyện Verilog từ cổng logic đến FSM.",
    "Verilog practice from gates to FSMs.",
    "https://hdlbits.01xz.net/wiki/Main_Page",
  ],
  [
    "Nand2Tetris",
    "Xây máy tính từ các thành phần cơ bản.",
    "Build a computer from fundamental components.",
    "https://www.nand2tetris.org/",
  ],
  [
    "OpenROAD",
    "Tìm hiểu place-and-route và timing.",
    "Explore place-and-route and timing.",
    "https://openroad.readthedocs.io/",
  ],
  [
    "Tiny Tapeout",
    "Tìm hiểu quy trình đưa thiết kế lên silicon.",
    "Explore the journey to manufactured silicon.",
    "https://tinytapeout.com/",
  ],
  [
    "Yosys",
    "Tài liệu tổng hợp RTL và các pass.",
    "RTL synthesis and pass documentation.",
    "https://yosyshq.readthedocs.io/projects/yosys/en/latest/",
  ],
  [
    "CircuitVerse",
    "Thực hành trực quan mạch logic số.",
    "Interactive digital logic circuits.",
    "https://circuitverse.org/",
  ],
  [
    "OpenLane",
    "Flow ASIC mã nguồn mở với PDK tương thích.",
    "Open ASIC flow with compatible PDKs.",
    "https://openlane2.readthedocs.io/",
  ],
  [
    "SKY130",
    "Tài liệu process design kit mở.",
    "Open process design kit documentation.",
    "https://skywater-pdk.readthedocs.io/",
  ],
];
export default function Lab() {
  const [lang, setLang] = useState<Lang>("vi");
  const [editorVisible, setEditorVisible] = useState(false);
  const editorContainer = useRef<HTMLDivElement>(null);
  const [dark, setDark] = useState(true);
  const [view, setView] = useState("learn");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [design, setDesign] = useState(initial.design);
  const [tb, setTb] = useState(initial.testbench);
  const [editorTab, setEditorTab] = useState("design");
  const [resultTab, setResultTab] = useState("wave");
  const [log, setLog] = useState("");
  const [vcd, setVcd] = useState("");
  const [netlist, setNetlist] = useState<Netlist | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [exerciseId, setExerciseId] = useState(exercises[0].id);
  const [hint, setHint] = useState(0);
  const [progress, setProgress] = useState<string[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [svg, setSvg] = useState("");
  const workerRef = useRef<Worker | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lesson = curriculum.lessons[lessonIndex];
  const exercise = exercises.find((e) => e.id === exerciseId)!;
  const t = (vi: string, en: string) => (lang === "vi" ? vi : en);
  useEffect(() => {
    if (editorVisible || !editorContainer.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setEditorVisible(true);
        observer.disconnect();
      }
    });
    observer.observe(editorContainer.current);
    return () => observer.disconnect();
  }, [view, editorVisible]);
  useEffect(() => {
    try {
      setProgress(readProgress(localStorage.getItem("chiplab-progress")));
      setDark(localStorage.getItem("chiplab-theme") !== "light");
      const saved = localStorage.getItem("chiplab-design");
      if (saved !== null) setDesign(saved);
      const savedTb = localStorage.getItem("chiplab-tb");
      if (savedTb !== null) setTb(savedTb);
    } catch {}
    const params = new URLSearchParams(location.hash.slice(1));
    if (params.get("code")) {
      try {
        setDesign(decodeURIComponent(escape(atob(params.get("code")!))));
        setView("lab");
      } catch {
        setError("Link chia sẻ không hợp lệ / Invalid share link.");
      }
    }
    setHydrated(true);
    return () => {
      workerRef.current?.terminate();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dataset.theme = dark ? "dark" : "light";
    if (hydrated) {
      try {
        localStorage.setItem("chiplab-theme", dark ? "dark" : "light");
      } catch {}
    }
  }, [dark, lang, hydrated]);
  useEffect(() => {
    if (hydrated) {
      try {
        localStorage.setItem("chiplab-design", design);
        localStorage.setItem("chiplab-tb", tb);
        localStorage.setItem("chiplab-progress", JSON.stringify(progress));
      } catch {
        setError("Không lưu được trên thiết bị / Device storage unavailable.");
      }
    }
  }, [design, tb, progress, hydrated]);
  const stop = () => {
    workerRef.current?.terminate();
    workerRef.current = null;
    if (timerRef.current) clearTimeout(timerRef.current);
    setBusy(false);
  };
  function loadExercise(id: string) {
    const item = exercises.find((e) => e.id === id);
    if (!item) return;
    setExerciseId(id);
    setDesign(item.starter);
    setHint(0);
    setView("exercises");
    setEditorTab("design");
    setVcd("");
    setNetlist(null);
    setError("");
    setStatus("");
  }
  async function renderSchematic(data: Netlist) {
    try {
      const w = window as unknown as {
        netlistsvg?: {
          render: (skin: string, data: Netlist) => Promise<string>;
          digitalSkin: string;
        };
      };
      for (const src of [
        "/vendor/elk.bundled.js",
        "/vendor/netlistsvg.bundle.js",
      ]) {
        if (!document.querySelector(`script[src="${src}"]`)) {
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve();
            script.onerror = () => {
              script.remove();
              reject(new Error("Schematic library unavailable"));
            };
            document.head.append(script);
          });
        }
      }
      if (w.netlistsvg)
        setSvg(
          await w.netlistsvg.render(
            w.netlistsvg.digitalSkin,
            structuredClone(data),
          ),
        );
    } catch {
      setError(
        t(
          "Đã tổng hợp, nhưng không vẽ được sơ đồ. Xem netlist và log.",
          "Synthesis completed, but schematic rendering failed. Inspect netlist and logs.",
        ),
      );
    }
  }
  function run(action: "simulate" | "synthesize" | "grade") {
    if (busy) return;
    setError("");
    setLog("");
    setStatus(t("Đang tải công cụ…", "Loading engine…"));
    setBusy(true);
    if (action === "synthesize") {
      setNetlist(null);
      setSvg("");
      setResultTab("circuit");
    } else {
      setVcd("");
      setResultTab("wave");
    }
    const worker = new Worker("/engine/worker.js", { type: "module" });
    workerRef.current = worker;
    timerRef.current = setTimeout(() => {
      stop();
      setError(
        t(
          "Đã dừng sau 60 giây. Kiểm tra vòng lặp, clock và $finish trong testbench.",
          "Stopped after 60 seconds. Check loops, clocks and $finish in the testbench.",
        ),
      );
      setStatus("");
    }, 60000);
    worker.onerror = (event) => {
      stop();
      setError(event.message || "Worker error");
      setStatus("");
    };
    worker.onmessage = (event) => {
      const data = event.data;
      if (data.type === "progress") {
        setStatus(data.message);
        return;
      }
      stop();
      setStatus("");
      if (data.type === "error") {
        setError(data.message);
        setResultTab("log");
        return;
      }
      setLog(data.log || "");
      if (data.vcd) setVcd(data.vcd);
      if (data.netlist) {
        setNetlist(data.netlist);
        void renderSchematic(data.netlist);
      }
      if (action === "grade") {
        const passed = grade(data.log || "", exercise.id);
        setStatus(
          passed
            ? t(
                "Đạt — tất cả kiểm tra đều đúng.",
                "Passed — all checks succeeded.",
              )
            : t(
                "Chưa đạt — xem log và thử lại.",
                "Not yet — inspect the log and try again.",
              ),
        );
        if (passed)
          setProgress((old) => Array.from(new Set([...old, exercise.id])));
        setResultTab("log");
      }
    };
    worker.postMessage({
      action: action === "synthesize" ? "synthesize" : "simulate",
      design,
      testbench:
        action === "grade" || view === "exercises" ? exercise.testbench : tb,
    });
  }
  async function share() {
    try {
      const code = btoa(unescape(encodeURIComponent(design)));
      const url = location.origin + "/#code=" + encodeURIComponent(code);
      await navigator.clipboard.writeText(url);
      setStatus(t("Đã sao chép link code.", "Code link copied."));
    } catch {
      setError(
        t(
          "Trình duyệt chưa cho phép sao chép.",
          "Clipboard access unavailable.",
        ),
      );
    }
  }
  const lint = basicLint(design);
  const waveform = vcd ? parseVcd(vcd) : null;
  const cells = Object.values(netlist?.modules || {}).flatMap((m) =>
    Object.values(m.cells || {}),
  );
  const cellCounts = cells.reduce<Record<string, number>>((counts, c) => {
    counts[c.type] = (counts[c.type] || 0) + 1;
    return counts;
  }, {});
  const nav = [
    ["learn", BookOpen, t("Lộ trình học", "Learning path")],
    ["lab", FlaskConical, "Playground"],
    ["exercises", Check, t("Bài tập", "Exercises")],
    ["examples", Layers, t("Mạch mẫu", "Examples")],
    ["resources", Library, t("Tài nguyên", "Resources")],
  ] as const;
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" href="/" aria-label="ChipLab home">
          <span className="brand-icon">
            <Cpu size={23} />
          </span>
          ChipLab<span className="brand-dot">.</span>
        </Link>
        <p className="sidebar-caption">DIGITAL DESIGN LAB</p>
        <nav aria-label={t("Điều hướng chính", "Main navigation")}>
          {nav.map(([id, Icon, label]) => (
            <button
              key={id}
              className={view === id ? "nav-item active" : "nav-item"}
              onClick={() =>
                id === "exercises" && view !== "exercises"
                  ? loadExercise(exerciseId)
                  : setView(id)
              }
              disabled={busy}
            >
              <Icon size={18} />
              {label}
              {view === id && <ChevronRight size={15} />}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="progress-heading">
            <span>{t("Tiến độ của bạn", "Your progress")}</span>
            <strong>
              {progress.length}/{exercises.length}
            </strong>
          </div>
          <progress
            aria-label={t("Tiến độ bài tập", "Exercise progress")}
            value={progress.length}
            max={exercises.length}
          />
          <p>
            {t(
              "Mỗi mạch nhỏ, một bước tiến.",
              "One small circuit. One step forward.",
            )}
          </p>
          <button className="text-button" onClick={() => setView("credits")}>
            {t("Nguồn & giấy phép", "Credits & licenses")}{" "}
            <ArrowUpRight size={14} />
          </button>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="breadcrumb">
            ChipLab <ChevronRight size={14} />{" "}
            <span>
              {nav.find((n) => n[0] === view)?.[2] ||
                t("Nguồn & giấy phép", "Credits & licenses")}
            </span>
          </div>
          <div className="top-actions">
            <span className="local-badge">
              <span />
              {t("Chạy trên trình duyệt", "Runs in your browser")}
            </span>
            <button
              className="icon-button"
              onClick={() => setLang(lang === "vi" ? "en" : "vi")}
              aria-label={`${lang.toUpperCase()} — Switch language`}
            >
              <Globe size={16} />
              {lang.toUpperCase()}
            </button>
            <button
              className="icon-button"
              onClick={() => setDark(!dark)}
              aria-label={t("Đổi giao diện sáng tối", "Toggle color theme")}
            >
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </header>
        <main id="main">
          {view === "learn" && (
            <>
              <section className="hero">
                <div>
                  <div className="eyebrow">
                    <span />{" "}
                    {t("TỪ LOGIC ĐẾN SILICON", "FROM LOGIC TO SILICON")}
                  </div>
                  <h1>
                    {t("Bắt đầu từ một bit.", "Start with one bit.")}
                    <br />
                    <span>
                      {t("Thiết kế cả tương lai.", "Design what comes next.")}
                    </span>
                  </h1>
                  <p>
                    {t(
                      "Học thiết kế vi mạch qua từng mạch nhỏ. Viết RTL, chạy mô phỏng và nhìn thấy ý tưởng của bạn hoạt động.",
                      "Learn digital design one circuit at a time. Write RTL, run simulations and see your ideas come alive.",
                    )}
                  </p>
                  <div className="hero-meta">
                    <span>7 {t("module", "modules")}</span>
                    <span>
                      {curriculum.lessons.length} {t("bài học", "lessons")}
                    </span>
                    <span>
                      {exercises.length} {t("bài thực hành", "exercises")}
                    </span>
                  </div>
                </div>
                <div className="chip-art" aria-hidden="true">
                  <div className="chip-grid" />
                  <div className="chip-package">
                    <Cpu size={74} strokeWidth={1} />
                    <span>RTL → GDSII</span>
                  </div>
                  <span className="chip-tag tag-one">input → logic</span>
                  <span className="chip-tag tag-two">
                    always @ (posedge clk)
                  </span>
                </div>
              </section>
              <div className="section-heading">
                <h2>{t("Lộ trình của bạn", "Your learning path")}</h2>
                <span>
                  {t(
                    "Học theo thứ tự hoặc chọn một chủ đề",
                    "Follow the path or explore a topic",
                  )}
                </span>
              </div>
              <div className="module-row">
                {curriculum.modules.map((m, i) => (
                  <button
                    key={m.id}
                    className={
                      lesson.module === m.id
                        ? "module-card selected"
                        : "module-card"
                    }
                    onClick={() => {
                      const index = curriculum.lessons.findIndex(
                        (l) => l.module === m.id,
                      );
                      if (index >= 0) setLessonIndex(index);
                    }}
                  >
                    <span className="module-number">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <strong>{m.title[lang]}</strong>
                    <span>
                      {
                        curriculum.lessons.filter((l) => l.module === m.id)
                          .length
                      }{" "}
                      {t("bài học", "lessons")}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
          {(view === "learn" || view === "lab" || view === "exercises") && (
            <>
              <div className="section-heading lab-heading">
                <h2>
                  {view === "exercises"
                    ? t("Thử sức với RTL", "Put your RTL to the test")
                    : view === "lab"
                      ? "Playground"
                      : t("Học và thực hành", "Learn by doing")}
                </h2>
                <span>
                  <span className="status-dot" /> Icarus Verilog · Yosys WASM
                </span>
              </div>
              <div className="lab-grid">
                <section className="lesson-panel panel">
                  {view === "exercises" ? (
                    <>
                      <label className="field-label" htmlFor="exercise">
                        {t("Chọn bài tập", "Choose an exercise")}
                      </label>
                      <select
                        id="exercise"
                        value={exerciseId}
                        onChange={(e) => loadExercise(e.target.value)}
                        disabled={busy}
                      >
                        {exercises.map((e) => (
                          <option key={e.id} value={e.id}>
                            {progress.includes(e.id) ? "✓ " : ""}
                            {e.title[lang]}
                          </option>
                        ))}
                      </select>
                      <h2>{exercise.title[lang]}</h2>
                      <Markdown>{exercise.prompt[lang]}</Markdown>
                      <div className="hint-box">
                        <button
                          className="text-button"
                          onClick={() =>
                            setHint(
                              Math.min(hint + 1, exercise.hints[lang].length),
                            )
                          }
                        >
                          {t("Mở gợi ý", "Reveal hint")} ({hint}/
                          {exercise.hints[lang].length})
                        </button>
                        {exercise.hints[lang].slice(0, hint).map((h) => (
                          <p key={h}>{h}</p>
                        ))}
                      </div>
                      <button
                        className="primary-button full"
                        disabled={busy}
                        onClick={() => run("grade")}
                      >
                        <Check size={16} />
                        {t("Nộp bài & kiểm tra", "Submit & check")}
                      </button>
                      <p className="fineprint">
                        {t(
                          "Testbench được ẩn khỏi trình soạn thảo. Đây là chấm bài tự học trên thiết bị, không dùng để chứng nhận.",
                          "The testbench is hidden from the editor. Local grading supports self-study, not certification.",
                        )}
                      </p>
                    </>
                  ) : view === "learn" ? (
                    <>
                      <label className="field-label" htmlFor="lesson">
                        {t("Bài học", "Lesson")}
                      </label>
                      <select
                        id="lesson"
                        value={lessonIndex}
                        onChange={(e) => setLessonIndex(Number(e.target.value))}
                      >
                        {curriculum.lessons.map((l, i) => (
                          <option key={l.id} value={i}>
                            {l.title[lang]}
                          </option>
                        ))}
                      </select>
                      <article className="lesson-content">
                        <h2>{lesson.title[lang]}</h2>
                        <Markdown>{lesson.body[lang]}</Markdown>
                      </article>
                      <button
                        className="secondary-button full"
                        disabled={busy}
                        onClick={() => {
                          const exampleExercise = exercises.find(
                            (e) => e.id === lesson.exerciseIds[0],
                          );
                          if (exampleExercise) {
                            setDesign(exampleExercise.solution);
                            setTb(exampleExercise.testbench);
                            setEditorTab("design");
                            setVcd("");
                            setNetlist(null);
                            setError("");
                          }
                        }}
                      >
                        {t("Mở ví dụ chạy được", "Load a working example")}
                      </button>
                      <button
                        className="primary-button full"
                        disabled={busy}
                        onClick={() =>
                          loadExercise(lesson.exerciseIds[0] || exercises[0].id)
                        }
                      >
                        {t("Thực hành chủ đề này", "Practice this topic")}
                        <ChevronRight size={16} />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="eyebrow">WORKBENCH</span>
                      <h2>
                        {t(
                          "Ý tưởng thành mạch.",
                          "Turn an idea into a circuit.",
                        )}
                      </h2>
                      <p>
                        {t(
                          'Sửa thiết kế và testbench, sau đó chạy mô phỏng. Dùng $dumpfile("dump.vcd") và $dumpvars để tạo waveform.',
                          'Edit the design and testbench, then simulate. Use $dumpfile("dump.vcd") and $dumpvars to capture waveforms.',
                        )}
                      </p>
                      <label className="field-label" htmlFor="example">
                        {t("Bắt đầu từ mạch mẫu", "Start from an example")}
                      </label>
                      <select
                        id="example"
                        defaultValue=""
                        disabled={busy}
                        onChange={(e) => {
                          const item = examples.find(
                            (x) => x.id === e.target.value,
                          );
                          if (item) {
                            setDesign(item.design);
                            setTb(item.testbench);
                          }
                        }}
                      >
                        <option value="" disabled>
                          {t("Chọn mạch mẫu", "Choose an example")}
                        </option>
                        {examples.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.title[lang]}
                          </option>
                        ))}
                      </select>
                      <div className="hint-box">
                        <h3>{t("Đọc kết quả", "Read the results")}</h3>
                        <p>
                          {t(
                            "Waveform biểu diễn tín hiệu theo thời gian. Synthesis chuyển RTL thành mạng cell logic. Số cell là kết quả tổng hợp tổng quát, chưa phải diện tích silicon.",
                            "Waveforms show signals over time. Synthesis transforms RTL into logic cells. Generic cell counts do not estimate silicon area.",
                          )}
                        </p>
                      </div>
                    </>
                  )}
                </section>
                <section className="workbench panel">
                  <div className="editor-toolbar">
                    <div className="tabs">
                      <button
                        className={editorTab === "design" ? "selected" : ""}
                        onClick={() => setEditorTab("design")}
                      >
                        design.sv
                      </button>
                      {view !== "exercises" && (
                        <button
                          className={editorTab === "tb" ? "selected" : ""}
                          onClick={() => setEditorTab("tb")}
                        >
                          testbench.sv
                        </button>
                      )}
                    </div>
                    <div className="editor-tools">
                      <button
                        className="icon-button"
                        onClick={share}
                        aria-label={t("Chia sẻ code", "Share code")}
                      >
                        <Share2 size={15} />
                      </button>
                      <button
                        className="icon-button"
                        disabled={busy}
                        onClick={() => {
                          setDesign(
                            view === "exercises"
                              ? exercise.starter
                              : initial.design,
                          );
                          setTb(initial.testbench);
                        }}
                        aria-label={t("Khôi phục code mẫu", "Reset code")}
                      >
                        <RotateCcw size={15} />
                      </button>
                    </div>
                  </div>
                  <div ref={editorContainer}>
                    {editorVisible ? (
                      <Editor
                        value={editorTab === "design" ? design : tb}
                        onChange={editorTab === "design" ? setDesign : setTb}
                        label={
                          editorTab === "design"
                            ? "Verilog design editor"
                            : "Verilog testbench editor"
                        }
                        dark={dark}
                      />
                    ) : (
                      <div className="editor-loading">
                        <button
                          className="secondary-button"
                          onClick={() => setEditorVisible(true)}
                        >
                          {t("Mở trình soạn thảo", "Open code editor")}
                        </button>
                      </div>
                    )}
                  </div>
                  {lint.length > 0 && (
                    <div className="lint-message">{lint.join(" ")}</div>
                  )}
                  <div className="run-toolbar">
                    <span className="language-label">SystemVerilog 2012</span>
                    <div>
                      {busy ? (
                        <button
                          className="secondary-button"
                          onClick={() => {
                            stop();
                            setStatus(t("Đã dừng", "Stopped"));
                          }}
                        >
                          {t("Dừng", "Stop")}
                        </button>
                      ) : (
                        <>
                          <button
                            className="secondary-button"
                            onClick={() => run("synthesize")}
                          >
                            <Layers size={15} />
                            Synthesize
                          </button>
                          <button
                            className="primary-button"
                            onClick={() => run("simulate")}
                          >
                            <Play size={15} />
                            Simulate
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="result-tabs tabs">
                    <button
                      className={resultTab === "wave" ? "selected" : ""}
                      onClick={() => setResultTab("wave")}
                    >
                      Waveform
                    </button>
                    <button
                      className={resultTab === "circuit" ? "selected" : ""}
                      onClick={() => setResultTab("circuit")}
                    >
                      {t("Sơ đồ mạch", "Circuit")}
                    </button>
                    <button
                      className={resultTab === "netlist" ? "selected" : ""}
                      onClick={() => setResultTab("netlist")}
                    >
                      Netlist
                    </button>
                    <button
                      className={resultTab === "log" ? "selected" : ""}
                      onClick={() => setResultTab("log")}
                    >
                      <Terminal size={13} /> Log
                    </button>
                  </div>
                  <div className="run-status" role="status" aria-live="polite">
                    {busy && <span className="spinner" />}
                    {status}
                  </div>
                  {error && (
                    <div role="alert" className="error-box">
                      {error}
                      <p>
                        {t(
                          "Kiểm tra tên module, cổng kết nối và cú pháp tại dòng báo lỗi.",
                          "Check module names, port connections and syntax at the reported line.",
                        )}
                      </p>
                    </div>
                  )}
                  <div className="result-body">
                    {resultTab === "wave" &&
                      (waveform ? (
                        <>
                          <div className="wave-meta">
                            {waveform.timescale} · {waveform.endTime} ticks{" "}
                            <button
                              className="text-button"
                              onClick={() => {
                                const link = document.createElement("a");
                                link.href = URL.createObjectURL(
                                  new Blob([vcd], { type: "text/plain" }),
                                );
                                link.download = "dump.vcd";
                                link.click();
                                setTimeout(
                                  () => URL.revokeObjectURL(link.href),
                                  1000,
                                );
                              }}
                            >
                              ↓ VCD
                            </button>
                          </div>
                          <div className="wave-scroll">
                            <svg
                              viewBox={`0 0 760 ${waveform.signals.slice(0, 24).length * 38 + 30}`}
                              role="img"
                              aria-label="Simulation waveform"
                            >
                              <g className="wave-grid">
                                {[0, 1, 2, 3, 4, 5].map((i) => (
                                  <g key={i}>
                                    <line
                                      x1={170 + i * 112}
                                      x2={170 + i * 112}
                                      y1="20"
                                      y2="100%"
                                    />
                                    <text x={170 + i * 112} y="12">
                                      {Math.round((waveform.endTime * i) / 5)}
                                    </text>
                                  </g>
                                ))}
                              </g>
                              {waveform.signals
                                .slice(0, 24)
                                .map((signal, index) => (
                                  <g
                                    key={signal.name + "-" + index}
                                    transform={`translate(0,${index * 38 + 30})`}
                                  >
                                    <text x="8" y="17" className="signal-name">
                                      {signal.name.slice(-23)}
                                    </text>
                                    {signal.changes
                                      .slice(0, 2000)
                                      .map((change, i) => {
                                        const x =
                                          170 +
                                          (change.time /
                                            Math.max(waveform.endTime, 1)) *
                                            560;
                                        const end =
                                          170 +
                                          ((signal.changes[i + 1]?.time ??
                                            waveform.endTime) /
                                            Math.max(waveform.endTime, 1)) *
                                            560;
                                        const y = change.value === "1" ? 3 : 23;
                                        return signal.width === 1 ? (
                                          <path
                                            key={i}
                                            className={
                                              /[xz]/i.test(change.value)
                                                ? "wave-unknown"
                                                : "wave-line"
                                            }
                                            d={`M${x},${i ? (signal.changes[i - 1].value === "1" ? 3 : 23) : y} V${y} H${end}`}
                                          />
                                        ) : (
                                          <g key={i}>
                                            <path
                                              className="wave-line"
                                              d={`M${x},13 l4,-10 H${Math.max(x + 4, end - 4)} l4,10 l-4,10 H${x + 4} Z`}
                                            />
                                            {end - x > 24 && (
                                              <text
                                                x={x + 7}
                                                y="17"
                                                className="bus-value"
                                              >
                                                {/[xz]/i.test(change.value)
                                                  ? change.value
                                                  : parseInt(
                                                      change.value,
                                                      2,
                                                    ).toString(16)}
                                              </text>
                                            )}
                                          </g>
                                        );
                                      })}
                                  </g>
                                ))}
                            </svg>
                          </div>
                        </>
                      ) : (
                        <div className="empty-state">
                          <span className="wave-icon">▁▁▔▔▁▁▔▔▁▁</span>
                          <h3>
                            {t(
                              "Mạch của bạn sẽ hoạt động thế nào?",
                              "How will your circuit behave?",
                            )}
                          </h3>
                          <p>
                            {t(
                              "Bấm Simulate để quan sát từng tín hiệu.",
                              "Press Simulate to inspect each signal.",
                            )}
                          </p>
                        </div>
                      ))}
                    {resultTab === "circuit" &&
                      (netlist ? (
                        <>
                          <div className="cell-stats">
                            <strong>{cells.length} cells</strong>
                            {Object.entries(cellCounts).map(([name, count]) => (
                              <span key={name}>
                                {name} × {count}
                              </span>
                            ))}
                          </div>
                          {svg ? (
                            <iframe
                              className="schematic"
                              title={t(
                                "Sơ đồ mạch tổng hợp",
                                "Synthesized circuit schematic",
                              )}
                              sandbox=""
                              srcDoc={`<!doctype html><html><body style="margin:0;padding:16px;background:white">${svg}</body></html>`}
                            />
                          ) : (
                            <p>{t("Đang vẽ sơ đồ…", "Drawing circuit…")}</p>
                          )}
                        </>
                      ) : (
                        <div className="empty-state">
                          <Layers />
                          <p>
                            {t(
                              "Bấm Synthesize để xem sơ đồ và thống kê cell.",
                              "Press Synthesize to view the circuit and cell statistics.",
                            )}
                          </p>
                        </div>
                      ))}
                    {resultTab === "netlist" && (
                      <pre>
                        {netlist
                          ? JSON.stringify(netlist, null, 2)
                          : t("Chưa có netlist.", "No netlist yet.")}
                      </pre>
                    )}
                    {resultTab === "log" && (
                      <pre>
                        {log ||
                          t(
                            "Log công cụ sẽ xuất hiện ở đây.",
                            "Engine logs will appear here.",
                          )}
                      </pre>
                    )}
                  </div>
                </section>
              </div>
            </>
          )}
          {view === "examples" && (
            <>
              <div className="page-title">
                <span className="eyebrow">CIRCUIT LIBRARY</span>
                <h1>
                  {t("Khám phá bằng thực hành.", "Explore through practice.")}
                </h1>
                <p>
                  {t(
                    "Mở một mạch, thay đổi code và quan sát kết quả.",
                    "Open a circuit, change the code and inspect the result.",
                  )}
                </p>
              </div>
              <div className="resource-grid">
                {examples.map((e) => (
                  <article className="resource-card" key={e.id}>
                    <Cpu />
                    <h2>{e.title[lang]}</h2>
                    <p>{e.description[lang]}</p>
                    <small>{e.license}</small>
                    {e.source.startsWith("https://") ? (
                      <a href={e.source} target="_blank" rel="noreferrer">
                        {t("Nguồn", "Source")} ↗
                      </a>
                    ) : (
                      <small>
                        {t("Ví dụ gốc ChipLab", "Original ChipLab example")}
                      </small>
                    )}
                    <button
                      className="primary-button"
                      onClick={() => {
                        setDesign(e.design);
                        setTb(e.testbench);
                        setView("lab");
                        setVcd("");
                        setNetlist(null);
                      }}
                    >
                      {t("Mở trong Playground", "Open in Playground")}
                      <ArrowUpRight size={15} />
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}
          {view === "resources" && (
            <>
              <div className="page-title">
                <span className="eyebrow">KEEP EXPLORING</span>
                <h1>
                  {t("Tiếp tục hành trình.", "Keep building your knowledge.")}
                </h1>
                <p>
                  {t(
                    "Tài liệu gốc, công cụ mở và cộng đồng thiết kế vi mạch.",
                    "Primary documentation, open tools and digital design communities.",
                  )}
                </p>
              </div>
              <div className="resource-grid">
                {resources.map(([name, vi, en, url]) => (
                  <a
                    className="resource-card"
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ArrowUpRight />
                    <h2>{name}</h2>
                    <p>{lang === "vi" ? vi : en}</p>
                  </a>
                ))}
              </div>
            </>
          )}
          {view === "credits" && (
            <div className="credits panel">
              <h1>{t("Nguồn & giấy phép", "Credits & licenses")}</h1>
              <p>
                {t(
                  "ChipLab được phát hành theo GPL-2.0-or-later. Nội dung bài học và bài tập được biên soạn riêng cho ứng dụng.",
                  "ChipLab is distributed under GPL-2.0-or-later. Lessons and exercises are originally authored for this application.",
                )}
              </p>
              <ul>
                <li>
                  Icarus Verilog / VeriSim — GPL-2.0-or-later, Stephen Williams
                  and contributors.
                </li>
                <li>YoWASP / Yosys — ISC.</li>
                <li>netlistsvg — MIT. ELK — EPL-2.0.</li>
                <li>Next.js, React, CodeMirror, react-markdown — MIT.</li>
                <li>Lucide — ISC.</li>
              </ul>
              <p>
                <a href="/licenses/icarus-GPL-2.0.txt">Icarus license</a> ·{" "}
                <a href="/source/">
                  {t("Nguồn tương ứng", "Corresponding source")}
                </a>
              </p>
              <p>
                <a href="/research.md">
                  {t("Nghiên cứu & nguồn tham khảo", "Research & sources")}
                </a>{" "}
                · <a href="/third-party-notices.txt">Third-party notices</a> ·{" "}
                <a href="/source.zip">
                  {t("Tải mã nguồn ứng dụng", "Download app source")}
                </a>
              </p>
              <p>
                {t(
                  "Các tài liệu HDLBits, Nand2Tetris và EDA Playground được dẫn liên kết để tham khảo.",
                  "HDLBits, Nand2Tetris and EDA Playground are linked as learning references.",
                )}
              </p>
            </div>
          )}
          <footer>
            <button className="text-button" onClick={() => setView("credits")}>
              {t("Nguồn & giấy phép", "Credits & licenses")}
            </button>
            <span>
              ChipLab · {t("Từ ý tưởng đến vi mạch", "From ideas to circuits")}
            </span>
            <span>
              {t(
                "Code chạy trên thiết bị của bạn",
                "Your code runs on your device",
              )}
            </span>
          </footer>
        </main>
      </div>
    </div>
  );
}
