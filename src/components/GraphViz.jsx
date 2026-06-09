import { useState, useEffect, useRef, useCallback } from 'react';
import { AC, BD, BL, TX } from '../constants';

const GRN = '#27ae60';
const RED = '#c0392b';

/* ─── shared arrow SVG helper ─── */
function Arrow({ x1, y1, x2, y2, color = BD, width = 1.5, r = 20, dash = false }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const ex = x2 - r * Math.cos(a), ey = y2 - r * Math.sin(a);
  const sx = x1 + r * Math.cos(a), sy = y1 + r * Math.sin(a);
  const pts = `${ex},${ey} ${ex - 8 * Math.cos(a - 0.4)},${ey - 8 * Math.sin(a - 0.4)} ${ex - 8 * Math.cos(a + 0.4)},${ey - 8 * Math.sin(a + 0.4)}`;
  return (
    <g>
      <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={color} strokeWidth={width} strokeDasharray={dash ? '5,3' : undefined} />
      <polygon points={pts} fill={color} />
    </g>
  );
}

/* ─── shared pill badge ─── */
function Pill({ text, color = AC, bg = '#ffeaed' }) {
  return (
    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, background: bg, color, border: `1px solid ${color}`, padding: '1px 7px', marginRight: 4, display: 'inline-block' }}>
      {text}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   DIJKSTRA VIZ — with editable source + path highlight
   ═══════════════════════════════════════════════════════════ */
export function DijkstraViz() {
  const INF = 9999;
  const NODES_POS = { 1: { x: 215, y: 45 }, 2: { x: 75, y: 150 }, 3: { x: 215, y: 260 }, 4: { x: 215, y: 155 }, 5: { x: 355, y: 150 } };
  const EDGES = [
    { from: 1, to: 2, w: 10 }, { from: 1, to: 4, w: 30 }, { from: 1, to: 5, w: 100 },
    { from: 2, to: 3, w: 50 }, { from: 3, to: 5, w: 10 }, { from: 4, to: 3, w: 20 }, { from: 4, to: 5, w: 60 },
  ];

  // Build steps for source node
  function buildSteps(src) {
    const adj = {};
    for (const n of Object.keys(NODES_POS)) adj[parseInt(n)] = [];
    for (const e of EDGES) adj[e.from].push({ to: e.to, w: e.w });

    const D = {}, P = {}, S = new Set([src]);
    for (const n of Object.keys(NODES_POS)) { D[parseInt(n)] = INF; P[parseInt(n)] = null; }
    D[src] = 0;
    for (const e of EDGES) if (e.from === src) { D[e.to] = e.w; P[e.to] = src; }

    const steps = [{ S: [src], w: null, D: { ...D }, P: { ...P }, note: `Inicial: S={${src}}, D con costos directos desde ${src}` }];
    const remaining = Object.keys(NODES_POS).map(Number).filter(n => n !== src);

    while (remaining.length) {
      let w = remaining.reduce((best, v) => D[v] < D[best] ? v : best, remaining[0]);
      remaining.splice(remaining.indexOf(w), 1);
      S.add(w);
      for (const { to, w: cost } of adj[w]) {
        if (!S.has(to) && D[w] + cost < D[to]) { D[to] = D[w] + cost; P[to] = w; }
      }
      const nd = D[w] === INF ? '∞' : D[w];
      steps.push({ S: [...S], w, D: { ...D }, P: { ...P }, note: `w=${w} (D[${w}]=${nd} mínimo). Relajar vecinos.` });
    }
    return steps;
  }

  const [src, setSrc] = useState(1);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showPath, setShowPath] = useState(null); // highlight path to node
  const steps = buildSteps(src);

  useEffect(() => { setStep(0); setShowPath(null); setPlaying(false); }, [src]);
  useEffect(() => {
    if (!playing) return;
    if (step >= steps.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStep(s => s + 1), 1000);
    return () => clearTimeout(t);
  }, [playing, step, steps.length]);

  const cur = steps[step];

  // Reconstruct path to target using P at last step
  function getPath(target) {
    const last = steps[steps.length - 1];
    const path = [];
    let v = target;
    while (v !== null && v !== undefined) { path.unshift(v); if (v === src) break; v = last.P[v]; }
    return path[0] === src ? path : [];
  }

  const highlightPath = showPath ? getPath(showPath) : [];
  const pathEdges = new Set();
  for (let i = 0; i < highlightPath.length - 1; i++) pathEdges.add(`${highlightPath[i]}-${highlightPath[i + 1]}`);

  return (
    <div>
      {/* Source selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#666' }}>Origen:</span>
        {Object.keys(NODES_POS).map(n => (
          <button key={n} onClick={() => setSrc(parseInt(n))} style={{
            background: src === parseInt(n) ? AC : '#e8e8e3', color: src === parseInt(n) ? '#fff' : TX,
            border: `1.5px solid ${src === parseInt(n) ? AC : '#ccc'}`, padding: '2px 9px', cursor: 'pointer',
            fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700,
          }}>{n}</button>
        ))}
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#aaa', marginLeft: 8 }}>Ver camino a:</span>
        {Object.keys(NODES_POS).filter(n => parseInt(n) !== src).map(n => (
          <button key={n} onClick={() => setShowPath(showPath === parseInt(n) ? null : parseInt(n))} style={{
            background: showPath === parseInt(n) ? GRN : '#e8e8e3', color: showPath === parseInt(n) ? '#fff' : TX,
            border: `1.5px solid ${showPath === parseInt(n) ? GRN : '#ccc'}`, padding: '2px 9px', cursor: 'pointer',
            fontFamily: "'JetBrains Mono',monospace", fontSize: 11,
          }}>{n}</button>
        ))}
      </div>

      <svg width={430} height={305} style={{ display: 'block', background: '#f9f8f4', border: '1px solid #ddd' }}>
        {EDGES.map((e, i) => {
          const inS = cur.S.includes(e.from) && cur.S.includes(e.to);
          const isTree = cur.w === e.to && cur.P[e.to] === e.from;
          const isPathEdge = pathEdges.has(`${e.from}-${e.to}`);
          const col = isPathEdge ? GRN : isTree ? AC : inS ? '#bbb' : '#ddd';
          const w = isPathEdge ? 3 : isTree ? 2.5 : 1.5;
          const n1 = NODES_POS[e.from], n2 = NODES_POS[e.to];
          const mx = (n1.x + n2.x) / 2, my = (n1.y + n2.y) / 2;
          return (
            <g key={i}>
              <Arrow x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} color={col} width={w} r={22} />
              <text x={mx + (e.from === 1 && e.to === 4 ? 10 : 0)} y={my - 7} textAnchor="middle"
                fontFamily="'JetBrains Mono',monospace" fontSize={10} fill={isPathEdge ? GRN : col} fontWeight={isPathEdge ? 700 : 400}>{e.w}</text>
            </g>
          );
        })}
        {Object.entries(NODES_POS).map(([id, pos]) => {
          const n = parseInt(id);
          const inS = cur.S.includes(n);
          const isCur = cur.w === n;
          const isOnPath = highlightPath.includes(n);
          const fill = isOnPath ? GRN : isCur ? AC : inS ? '#f5c0c8' : '#fff';
          const stroke = isOnPath ? GRN : isCur ? AC : inS ? RED : BD;
          const d = cur.D[n];
          return (
            <g key={id} style={{ cursor: 'pointer' }} onClick={() => setShowPath(n === src ? null : showPath === n ? null : n)}>
              <circle cx={pos.x} cy={pos.y} r={22} fill={fill} stroke={stroke} strokeWidth={isCur || isOnPath ? 2.5 : 1.5} />
              <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontFamily="'Lora',serif" fontSize={14} fontWeight={700} fill={(isCur || isOnPath) ? '#fff' : TX}>{id}</text>
              <text x={pos.x} y={pos.y + 37} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9.5}
                fill={inS ? (isOnPath ? GRN : AC) : '#bbb'}>{d === INF ? '∞' : d}</text>
            </g>
          );
        })}
        <text x={8} y={300} fontFamily="'JetBrains Mono',monospace" fontSize={8.5} fill="#aaa">D[v] bajo cada nodo · clic en nodo para ver camino</text>
      </svg>

      {/* Path display */}
      {showPath && step === steps.length - 1 && (
        <div style={{ background: '#edfdf5', border: `1px solid ${GRN}`, padding: '5px 10px', marginTop: 4, fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: GRN }}>
          Camino {src}→{showPath}: {highlightPath.length ? highlightPath.join(' → ') + ` (costo ${steps[steps.length - 1].D[showPath]})` : 'no alcanzable'}
        </div>
      )}

      {/* Step note */}
      <div style={{ background: '#ffeaed', border: `1px solid ${AC}`, padding: '5px 10px', marginTop: 4, fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: AC, lineHeight: 1.6 }}>
        [{step + 1}/{steps.length}] {cur.note}
      </div>

      {/* S chips */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 5 }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#888' }}>S =</span>
        {cur.S.map(n => <Pill key={n} text={n} />)}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
        <button onClick={() => { setStep(0); setPlaying(false); }} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, background: '#e8e8e3', border: '1px solid #ccc', padding: '3px 8px', cursor: 'pointer' }}>↺</button>
        <input type="range" min={0} max={steps.length - 1} value={step} onChange={e => { setStep(+e.target.value); setPlaying(false); }} style={{ flex: 1, accentColor: AC }} />
        <button onClick={() => { if (step >= steps.length - 1) setStep(0); setPlaying(p => !p); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: AC, fontSize: 22, lineHeight: 1, padding: 0 }}>
          {playing ? '⏸' : '▶'}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   FLOYD VIZ — animated graph + clickable cell explanation
   ═══════════════════════════════════════════════════════════ */
export function FloydViz() {
  const INF = '∞';
  const STATES = [
    { k: 'Inicial', A: [[0,8,5],[3,0,INF],[INF,2,0]], P: [[0,0,0],[0,0,0],[0,0,0]], changed: [], note: 'A[i,j] = costo directo i→j, ∞ si no hay arco. Diagonal = 0.', detail: '' },
    { k: 'k = 1', A: [[0,8,5],[3,0,8],[INF,2,0]], P: [[0,0,0],[0,0,1],[0,0,0]], changed: [[1,2]], note: 'k=1: usar vértice 1 como intermediario.', detail: 'A[2,3] = min(∞, A[2,1]+A[1,3]) = min(∞, 3+5) = 8\nNuevo camino: 2 → 1 → 3, costo 8' },
    { k: 'k = 2', A: [[0,8,5],[3,0,8],[5,2,0]], P: [[0,0,0],[0,0,1],[2,0,0]], changed: [[2,0]], note: 'k=2: usar vértice 2 como intermediario.', detail: 'A[3,1] = min(∞, A[3,2]+A[2,1]) = min(∞, 2+3) = 5\nNuevo camino: 3 → 2 → 1, costo 5' },
    { k: 'k = 3 (final)', A: [[0,7,5],[3,0,8],[5,2,0]], P: [[0,3,0],[0,0,1],[2,0,0]], changed: [[0,1]], note: 'k=3: usar vértice 3 como intermediario.', detail: 'A[1,2] = min(8, A[1,3]+A[3,2]) = min(8, 5+2) = 7\nMejora: 1→3→2 cuesta 7 < arco directo 1→2 (costo 8)' },
  ];

  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [selected, setSelected] = useState(null); // {i,j} cell selected
  const [showPath, setShowPath] = useState(null); // {i,j} show reconstructed path
  const cur = STATES[idx];
  const labels = ['1', '2', '3'];

  useEffect(() => {
    if (!playing) return;
    if (idx >= STATES.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setIdx(i => i + 1), 1200);
    return () => clearTimeout(t);
  }, [playing, idx]);

  const NODES = { 0: { x: 110, y: 45 }, 1: { x: 28, y: 170 }, 2: { x: 192, y: 170 } };
  const GRAPH_EDGES = [
    { from: 0, to: 1, w: 8 }, { from: 1, to: 0, w: 3 },
    { from: 0, to: 2, w: 5 }, { from: 2, to: 1, w: 2 },
  ];

  // Reconstruct path i→j using final P matrix
  function reconstructPath(i, j) {
    const finalP = STATES[STATES.length - 1].P;
    const finalA = STATES[STATES.length - 1].A;
    if (finalA[i][j] === INF) return [];
    function rec(a, b) {
      const k = finalP[a][b];
      if (k === 0) return [a + 1, b + 1];
      return [...rec(a, k - 1).slice(0, -1), k, ...rec(k - 1, b).slice(1)];
    }
    return rec(i, j);
  }

  const pathNodes = showPath ? reconstructPath(showPath.i, showPath.j) : [];
  const pathSet = new Set(pathNodes.map(n => n - 1));
  const pathEdgeSet = new Set();
  for (let x = 0; x < pathNodes.length - 1; x++) pathEdgeSet.add(`${pathNodes[x] - 1}-${pathNodes[x + 1] - 1}`);

  const isChanged = (i, j) => cur.changed.some(c => c[0] === i && c[1] === j);
  const isSel = (i, j) => selected && selected.i === i && selected.j === j;

  // Cell explanation
  function cellExplain(i, j) {
    const v = STATES[STATES.length - 1].A[i][j];
    const p = STATES[STATES.length - 1].P[i][j];
    if (i === j) return `Diagonal: distancia de ${i + 1} a sí mismo = 0`;
    if (v === INF) return `${i + 1}→${j + 1}: no existe camino`;
    if (p === 0) return `${i + 1}→${j + 1}: camino directo, costo ${v}`;
    const path = reconstructPath(i, j);
    return `${i + 1}→${j + 1}: costo mínimo ${v}\nCamino: ${path.join(' → ')} (via vértice ${p})`;
  }

  return (
    <div>
      {/* K buttons + play */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        {STATES.map((s, i) => (
          <button key={i} onClick={() => { setIdx(i); setPlaying(false); }} style={{
            background: idx === i ? AC : '#e8e8e3', color: idx === i ? '#fff' : TX,
            border: `1.5px solid ${idx === i ? AC : '#ccc'}`, padding: '4px 11px', cursor: 'pointer',
            fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: 0.5,
          }}>{s.k}</button>
        ))}
        <button onClick={() => { if (idx >= STATES.length - 1) setIdx(0); setPlaying(p => !p); }}
          style={{ marginLeft: 6, background: 'none', border: 'none', cursor: 'pointer', color: AC, fontSize: 20, lineHeight: 1, padding: 0 }}>
          {playing ? '⏸' : '▶'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* SVG Graph */}
        <div>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: '#888', marginBottom: 3, letterSpacing: 1 }}>GRAFO</div>
          <svg width={228} height={212} style={{ background: '#f9f8f4', border: '1px solid #ddd' }}>
            {GRAPH_EDGES.map((e, i) => {
              const n1 = NODES[e.from], n2 = NODES[e.to];
              const isPath = pathEdgeSet.has(`${e.from}-${e.to}`);
              const off = (e.from === 0 && e.to === 1) || (e.from === 1 && e.to === 0) ? 9 : 0;
              const a = Math.atan2(n2.y - n1.y, n2.x - n1.x);
              const nx = -Math.sin(a) * off, ny = Math.cos(a) * off;
              const col = isPath ? GRN : idx > 0 && (e.from === idx - 1 || e.to === idx - 1) ? AC : BD;
              const r = 18;
              const ex = n2.x - r * Math.cos(a) + nx, ey = n2.y - r * Math.sin(a) + ny;
              const sx = n1.x + r * Math.cos(a) + nx, sy = n1.y + r * Math.sin(a) + ny;
              return (
                <g key={i}>
                  <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={col} strokeWidth={isPath ? 2.5 : 1.5} />
                  <polygon points={`${ex},${ey} ${ex - 7 * Math.cos(a - 0.4)},${ey - 7 * Math.sin(a - 0.4)} ${ex - 7 * Math.cos(a + 0.4)},${ey - 7 * Math.sin(a + 0.4)}`} fill={col} />
                  <text x={(n1.x + n2.x) / 2 + nx + (e.from === 1 && e.to === 0 ? -12 : e.from === 0 && e.to === 1 ? 12 : 0)} y={(n1.y + n2.y) / 2 + ny + (e.from === 2 && e.to === 1 ? 12 : 0)}
                    textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={11} fill={isPath ? GRN : AC} fontWeight={700}>{e.w}</text>
                </g>
              );
            })}
            {Object.entries(NODES).map(([id, pos]) => {
              const n = parseInt(id);
              const isInter = idx > 0 && n === idx - 1;
              const isPath = pathSet.has(n);
              const fill = isPath ? GRN : isInter ? AC : '#fff';
              const stroke = isPath ? GRN : isInter ? AC : BD;
              return (
                <g key={id}>
                  <circle cx={pos.x} cy={pos.y} r={18} fill={fill} stroke={stroke} strokeWidth={isInter || isPath ? 2.5 : 1.5} />
                  <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontFamily="'Lora',serif" fontSize={14} fontWeight={700} fill={isInter || isPath ? '#fff' : TX}>{n + 1}</text>
                  {isInter && <text x={pos.x} y={pos.y - 24} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={8} fill={AC}>★ k</text>}
                </g>
              );
            })}
            {pathNodes.length > 0 && (
              <text x={4} y={208} fontFamily="'JetBrains Mono',monospace" fontSize={8} fill={GRN}>camino: {pathNodes.join('→')}</text>
            )}
          </svg>
        </div>

        {/* Matrices */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {[{ label: 'MATRIZ A (distancias)', data: cur.A, isP: false }, { label: 'MATRIZ P (intermedios)', data: cur.P, isP: true }].map(({ label, data, isP }) => (
            <div key={label}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: '#888', marginBottom: 3, letterSpacing: 1 }}>{label}</div>
              <table style={{ borderCollapse: 'collapse' }}>
                <thead><tr>
                  <td style={{ width: 18 }} />
                  {labels.map(l => <th key={l} style={{ width: 40, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#888', textAlign: 'center', border: '1px solid #ddd', padding: '2px 0', background: '#f0f0ec' }}>{l}</th>)}
                </tr></thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i}>
                      <td style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#888', textAlign: 'right', paddingRight: 3 }}>{labels[i]}</td>
                      {row.map((v, j) => {
                        const ch = isChanged(i, j), diag = i === j, sel = isSel(i, j);
                        const bg = sel ? '#fff3b0' : diag ? '#f0f0ec' : ch ? '#ffeaed' : '#fff';
                        const col = sel ? '#b8860b' : diag ? '#aaa' : ch ? AC : (isP && v === 0) ? '#ddd' : TX;
                        return (
                          <td key={j} onClick={() => { setSelected(sel ? null : { i, j }); setShowPath((!isP && !diag && !sel) ? { i, j } : null); }}
                            style={{ border: `1.5px solid ${sel ? '#b8860b' : ch ? AC : '#ccc'}`, width: 40, height: 30, textAlign: 'center', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, background: bg, color: col, fontWeight: ch || sel ? 700 : 400, padding: 0, cursor: 'pointer', transition: 'background 0.2s' }}>
                            {isP ? (v === 0 ? '·' : String(v)) : String(v)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      {/* Cell explanation on click */}
      {selected && idx === STATES.length - 1 && (
        <div style={{ background: '#fff3b0', border: '1px solid #b8860b', padding: '6px 10px', marginTop: 6, fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: '#7a5f00', lineHeight: 1.7, whiteSpace: 'pre' }}>
          {cellExplain(selected.i, selected.j)}
        </div>
      )}

      {/* Step note */}
      <div style={{ background: '#ffeaed', border: `1px solid ${AC}`, padding: '6px 10px', marginTop: 6, fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: AC, lineHeight: 1.7 }}>
        <strong>{cur.note}</strong>
        {cur.detail && <div style={{ color: '#555', marginTop: 4, whiteSpace: 'pre' }}>{cur.detail}</div>}
      </div>
      {idx === STATES.length - 1 && <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: '#aaa', marginTop: 3 }}>Clic en celda de A para ver camino reconstruido</div>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BPF VIZ — with arc-type legend filter + speed control
   ═══════════════════════════════════════════════════════════ */
export function BPFViz() {
  const NODES = {
    A: { x: 370, y: 60 }, B: { x: 290, y: 60 }, C: { x: 370, y: 180 },
    D: { x: 290, y: 180 }, E: { x: 80, y: 120 }, F: { x: 165, y: 60 }, G: { x: 165, y: 180 },
  };
  const EDGES = [
    ['E','F'],['E','G'],['F','B'],['F','G'],['G','D'],
    ['B','A'],['B','D'],['B','C'],['D','A'],['D','C'],['A','B'],['C','A'],
  ];
  const STEPS = [
    { cur: 'A', stack: ['A'], visited: ['A'], arc: null, note: 'Visitar A — árbol nuevo (desde A)' },
    { cur: 'B', stack: ['A','B'], visited: ['A','B'], arc: { e: ['A','B'], t: 'árbol' }, note: 'A→B: ÁRBOL — vértice nuevo' },
    { cur: 'C', stack: ['A','B','C'], visited: ['A','B','C'], arc: { e: ['B','C'], t: 'árbol' }, note: 'B→C: ÁRBOL — vértice nuevo' },
    { cur: null, stack: ['A','B'], visited: ['A','B','C'], arc: { e: ['C','A'], t: 'retroceso' }, note: 'C→A: RETROCESO — A está en la pila actual → ciclo' },
    { cur: 'D', stack: ['A','B','D'], visited: ['A','B','C','D'], arc: { e: ['B','D'], t: 'árbol' }, note: 'B→D: ÁRBOL — vértice nuevo' },
    { cur: null, stack: ['A','B'], visited: ['A','B','C','D'], arc: { e: ['D','A'], t: 'cruzado' }, note: 'D→A: CRUZADO — visitado, no ancestro de D' },
    { cur: null, stack: ['A','B'], visited: ['A','B','C','D'], arc: { e: ['D','C'], t: 'cruzado' }, note: 'D→C: CRUZADO — visitado, no ancestro de D' },
    { cur: null, stack: [], visited: ['A','B','C','D'], arc: null, note: 'Árbol 1 completo (A,B,C,D). Quedan E,F,G sin visitar.' },
    { cur: 'E', stack: ['E'], visited: ['A','B','C','D','E'], arc: null, note: 'Nuevo árbol: visitar E' },
    { cur: 'F', stack: ['E','F'], visited: ['A','B','C','D','E','F'], arc: { e: ['E','F'], t: 'árbol' }, note: 'E→F: ÁRBOL — vértice nuevo' },
    { cur: null, stack: ['E','F'], visited: ['A','B','C','D','E','F'], arc: { e: ['F','B'], t: 'cruzado' }, note: 'F→B: CRUZADO — B está en árbol diferente' },
    { cur: 'G', stack: ['E','F','G'], visited: ['A','B','C','D','E','F','G'], arc: { e: ['F','G'], t: 'árbol' }, note: 'F→G: ÁRBOL — vértice nuevo' },
    { cur: null, stack: [], visited: ['A','B','C','D','E','F','G'], arc: null, note: '✓ BPF completa. Bosque abarcador con 2 árboles.' },
  ];

  const ARC_COL = { árbol: AC, retroceso: RED, cruzado: BL, avance: GRN };
  const ARC_BG  = { árbol: '#ffeaed', retroceso: '#fde', cruzado: '#e8f0fa', avance: '#edfdf5' };

  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const [filter, setFilter] = useState(null); // highlight only this arc type in legend
  const cur = STEPS[step];

  // Track which arc types have been seen so far
  const seenTypes = {};
  for (let i = 0; i <= step; i++) if (STEPS[i].arc) seenTypes[STEPS[i].arc.t] = true;

  useEffect(() => {
    if (!playing) return;
    if (step >= STEPS.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStep(s => s + 1), speed);
    return () => clearTimeout(t);
  }, [playing, step, speed]);

  function getEdgeColor(from, to) {
    if (cur.arc && cur.arc.e[0] === from && cur.arc.e[1] === to) {
      const t = cur.arc.t;
      if (filter && filter !== t) return { color: '#eee', width: 1 };
      return { color: ARC_COL[t], width: 2.5 };
    }
    return { color: '#ddd', width: 1 };
  }

  return (
    <div>
      <svg width={450} height={248} style={{ display: 'block', background: '#f9f8f4', border: '1px solid #ddd' }}>
        {EDGES.map(([a, b], i) => {
          const { color, width } = getEdgeColor(a, b);
          const n1 = NODES[a], n2 = NODES[b];
          return <g key={i}><Arrow x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} color={color} width={width} r={19} /></g>;
        })}
        {Object.entries(NODES).map(([id, pos]) => {
          const inStack = cur.stack.includes(id);
          const visited = cur.visited.includes(id);
          const isCur = cur.cur === id;
          const fill = isCur ? AC : inStack ? '#f5c0c8' : visited ? '#e8f0fa' : '#fff';
          const stroke = isCur ? AC : inStack ? RED : visited ? BL : BD;
          return (
            <g key={id}>
              <circle cx={pos.x} cy={pos.y} r={19} fill={fill} stroke={stroke} strokeWidth={isCur ? 2.5 : 1.5} />
              <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontFamily="'Lora',serif" fontSize={13} fontWeight={700} fill={isCur ? '#fff' : TX}>{id}</text>
              {inStack && !isCur && <text x={pos.x} y={pos.y - 25} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={8} fill={RED}>pila</text>}
            </g>
          );
        })}
      </svg>

      {/* Arc type legend — clickable filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 5, marginBottom: 4 }}>
        {Object.entries(ARC_COL).map(([t, c]) => (
          <button key={t} onClick={() => setFilter(filter === t ? null : t)}
            disabled={!seenTypes[t]}
            style={{
              display: 'flex', alignItems: 'center', gap: 4, background: filter === t ? ARC_BG[t] : seenTypes[t] ? '#f5f5f5' : '#fafafa',
              border: `1.5px solid ${filter === t ? c : seenTypes[t] ? '#ccc' : '#eee'}`,
              padding: '2px 8px', cursor: seenTypes[t] ? 'pointer' : 'default', opacity: seenTypes[t] ? 1 : 0.35,
            }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: filter === t ? c : '#555' }}>{t}</span>
          </button>
        ))}
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: '#bbb', alignSelf: 'center' }}>clic para filtrar</span>
      </div>

      {/* Current arc */}
      {cur.arc && (
        <div style={{ background: ARC_BG[cur.arc.t] || '#ffeaed', border: `1.5px solid ${ARC_COL[cur.arc.t]}`, padding: '4px 10px', fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: ARC_COL[cur.arc.t], marginBottom: 4 }}>
          {cur.arc.e[0]}→{cur.arc.e[1]}: <strong>{cur.arc.t.toUpperCase()}</strong>
        </div>
      )}

      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#555', lineHeight: 1.5, marginBottom: 4 }}>
        [{step + 1}/{STEPS.length}] {cur.note}
      </div>

      {/* Stack display */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 5 }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#888' }}>Pila:</span>
        {cur.stack.length === 0
          ? <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#bbb' }}>(vacía)</span>
          : cur.stack.map(n => <Pill key={n} text={n} color={RED} bg="#fde" />)}
      </div>

      {/* Speed + controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => { setStep(0); setPlaying(false); }} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, background: '#e8e8e3', border: '1px solid #ccc', padding: '3px 8px', cursor: 'pointer' }}>↺</button>
        <input type="range" min={0} max={STEPS.length - 1} value={step} onChange={e => { setStep(+e.target.value); setPlaying(false); }} style={{ flex: 1, accentColor: AC }} />
        <button onClick={() => { if (step >= STEPS.length - 1) setStep(0); setPlaying(p => !p); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: AC, fontSize: 22, lineHeight: 1, padding: 0 }}>
          {playing ? '⏸' : '▶'}
        </button>
        <select value={speed} onChange={e => setSpeed(+e.target.value)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, border: '1px solid #ccc', background: '#f9f8f4', padding: '2px 4px', cursor: 'pointer' }}>
          <option value={400}>2×</option>
          <option value={900}>1×</option>
          <option value={1800}>0.5×</option>
        </select>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   TOPO VIZ — with call stack panel + order output animation
   ═══════════════════════════════════════════════════════════ */
export function TopoViz() {
  const NODES = {
    A: { x: 75, y: 130 }, B: { x: 215, y: 60 }, C: { x: 215, y: 130 },
    D: { x: 215, y: 200 }, E: { x: 325, y: 130 }, F: { x: 425, y: 130 },
  };
  const EDGES = [['A','B'],['A','C'],['A','D'],['C','B'],['C','E'],['D','E'],['B','F'],['E','F']];
  const STEPS = [
    { visited: [], order: [], cur: 'A', callStack: ['A'], activeEdge: null, note: 'DFS(A): visitar A, explorar vecinos' },
    { visited: ['A'], order: [], cur: 'B', callStack: ['A','B'], activeEdge: ['A','B'], note: 'DFS(B): A→B árbol' },
    { visited: ['A','B'], order: [], cur: 'F', callStack: ['A','B','F'], activeEdge: ['B','F'], note: 'DFS(F): B→F árbol' },
    { visited: ['A','B','F'], order: ['F'], cur: null, callStack: ['A','B'], activeEdge: null, note: 'F: sin vecinos sin visitar → AGREGAR F al inicio de lista' },
    { visited: ['A','B','F'], order: ['B','F'], cur: null, callStack: ['A'], activeEdge: null, note: 'B: todos visitados → AGREGAR B al inicio' },
    { visited: ['A','B','F'], order: ['B','F'], cur: 'C', callStack: ['A','C'], activeEdge: ['A','C'], note: 'DFS(C): A→C árbol' },
    { visited: ['A','B','C','F'], order: ['B','F'], cur: 'E', callStack: ['A','C','E'], activeEdge: ['C','E'], note: 'DFS(E): C→E árbol (C→B ya visitado)' },
    { visited: ['A','B','C','E','F'], order: ['E','B','F'], cur: null, callStack: ['A','C'], activeEdge: null, note: 'E: F ya visitado → AGREGAR E al inicio' },
    { visited: ['A','B','C','E','F'], order: ['C','E','B','F'], cur: null, callStack: ['A'], activeEdge: null, note: 'C: todos visitados → AGREGAR C al inicio' },
    { visited: ['A','B','C','D','E','F'], order: ['D','C','E','B','F'], cur: 'D', callStack: ['A','D'], activeEdge: ['A','D'], note: 'DFS(D): A→D árbol. E ya visitado → AGREGAR D al inicio' },
    { visited: ['A','B','C','D','E','F'], order: ['A','D','C','E','B','F'], cur: null, callStack: [], activeEdge: null, note: '✓ A completo → AGREGAR A. Orden final: A D C E B F' },
  ];

  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const cur = STEPS[step];

  useEffect(() => {
    if (!playing) return;
    if (step >= STEPS.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStep(s => s + 1), 950);
    return () => clearTimeout(t);
  }, [playing, step]);

  const isActiveEdge = (a, b) => cur.activeEdge && cur.activeEdge[0] === a && cur.activeEdge[1] === b;

  return (
    <div>
      <svg width={450} height={255} style={{ display: 'block', background: '#f9f8f4', border: '1px solid #ddd' }}>
        {EDGES.map(([a, b], i) => {
          const col = isActiveEdge(a, b) ? AC : '#ddd';
          const w = isActiveEdge(a, b) ? 2.5 : 1.5;
          return <g key={i}><Arrow x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} color={col} width={w} r={18} /></g>;
        })}
        {Object.entries(NODES).map(([id, pos]) => {
          const inOrder = cur.order.includes(id);
          const isVis = cur.visited.includes(id);
          const isCur = cur.cur === id;
          const inCallStack = cur.callStack.includes(id);
          const fill = isCur ? AC : inOrder ? '#d4edda' : inCallStack ? '#f5c0c8' : isVis ? '#f0f0ec' : '#fff';
          const stroke = isCur ? AC : inOrder ? GRN : inCallStack ? RED : isVis ? '#bbb' : BD;
          const orderIdx = cur.order.indexOf(id);
          return (
            <g key={id}>
              <circle cx={pos.x} cy={pos.y} r={18} fill={fill} stroke={stroke} strokeWidth={isCur || inOrder ? 2.5 : 1.5} />
              <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontFamily="'Lora',serif" fontSize={13} fontWeight={700} fill={isCur || inOrder ? '#fff' : TX}>{id}</text>
              {inOrder && <text x={pos.x + 22} y={pos.y - 10} fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={GRN}>#{orderIdx + 1}</text>}
            </g>
          );
        })}
        {/* Order output strip */}
        {cur.order.length > 0 && (
          <g>
            <text x={8} y={245} fontFamily="'JetBrains Mono',monospace" fontSize={9} fill="#888">Lista:</text>
            {cur.order.map((n, i) => (
              <g key={n}>
                <rect x={46 + i * 30} y={233} width={26} height={17} fill="#d4edda" stroke={GRN} strokeWidth={1} />
                <text x={59 + i * 30} y={245} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={10} fill={GRN} fontWeight={700}>{n}</text>
              </g>
            ))}
          </g>
        )}
      </svg>

      {/* Call stack panel */}
      <div style={{ display: 'flex', gap: 10, marginTop: 5, alignItems: 'flex-start' }}>
        <div style={{ minWidth: 110 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: '#888', letterSpacing: 1, marginBottom: 3 }}>CALL STACK</div>
          <div style={{ border: '1px solid #ddd', background: '#fafafa', minHeight: 32, padding: '3px 6px', display: 'flex', flexDirection: 'column-reverse', gap: 2 }}>
            {cur.callStack.length === 0
              ? <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: '#bbb' }}>vacío</span>
              : cur.callStack.map((n, i) => (
                <div key={n} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, background: i === cur.callStack.length - 1 ? '#ffeaed' : '#fff', color: i === cur.callStack.length - 1 ? AC : '#555', border: `1px solid ${i === cur.callStack.length - 1 ? AC : '#eee'}`, padding: '1px 6px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>DFS({n})</span>
                  {i === cur.callStack.length - 1 && <span style={{ fontSize: 8, color: AC }}>◄ top</span>}
                </div>
              ))}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: AC, padding: '4px 8px', background: '#ffeaed', border: `1px solid ${AC}`, lineHeight: 1.5 }}>
            [{step + 1}/{STEPS.length}] {cur.note}
          </div>
          {cur.order.length > 0 && (
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: GRN, marginTop: 5, padding: '3px 8px', background: '#edfdf5', border: `1px solid ${GRN}` }}>
              Lista (frente→): {cur.order.join(' → ')}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 10, marginTop: 5, flexWrap: 'wrap' }}>
        {[[AC,'actual'],[RED,'en call stack'],['#bbb','visitado'],[GRN,'en orden final']].map(([c,l])=>(
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: '#555' }}>{l}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
        <button onClick={() => { setStep(0); setPlaying(false); }} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, background: '#e8e8e3', border: '1px solid #ccc', padding: '3px 8px', cursor: 'pointer' }}>↺</button>
        <input type="range" min={0} max={STEPS.length - 1} value={step} onChange={e => { setStep(+e.target.value); setPlaying(false); }} style={{ flex: 1, accentColor: AC }} />
        <button onClick={() => { if (step >= STEPS.length - 1) setStep(0); setPlaying(p => !p); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: AC, fontSize: 22, lineHeight: 1, padding: 0 }}>
          {playing ? '⏸' : '▶'}
        </button>
      </div>
    </div>
  );
}
