"use client";
export default function TimingDiagram() {
  return (
    <figure className="timing-figure">
      <svg
        viewBox="0 0 640 236"
        role="img"
        aria-label="D flip-flop: reset high clears q; after reset, q toggles on rising clock edges."
      >
        <title>Chronogram / D flip-flop</title>
        <g className="timing-guides">
          {[100, 180, 260, 340, 420, 500, 580].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 28V202`} />
              <text x={x} y="222">
                {i * 10}
              </text>
            </g>
          ))}
        </g>
        <g className="timing-labels">
          <text x="14" y="64">
            clk
          </text>
          <text x="14" y="118">
            rst
          </text>
          <text x="14" y="172">
            q
          </text>
          <text x="580" y="20">
            t / ns
          </text>
        </g>
        <g className="timing-signals">
          <path d="M100 72H140V44H180V72H220V44H260V72H300V44H340V72H380V44H420V72H460V44H500V72H540V44H580V72H610" />
          <path d="M100 98H200V126H610" />
          <path d="M100 180H220V152H300V180H380V152H460V180H540V152H610" />
        </g>
      </svg>
      <figcaption>
        FIG. 01 / clk, rst, q · D flip-flop · D = ¬q · reset đồng bộ
      </figcaption>
    </figure>
  );
}
