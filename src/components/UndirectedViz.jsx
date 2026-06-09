import { useState, useEffect, useRef } from 'react';

const AC = '#e84055';
const BL = '#3a72b8';
const BD = '#1e1e1e';
const TX = '#111';
const GRN = '#27ae60';
const ORG = '#e67e22';
const PRP = '#8e44ad';

function Arrow({ x1, y1, x2, y2, color = BD, width = 1.5, r = 20, bidirectional = false }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const ex = x2 - r * Math.cos(a), ey = y2 - r * Math.sin(a);
  const sx = x1 + r * Math.cos(a), sy = y1 + r * Math.sin(a);
  if (bidirectional) {
    return <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={color} strokeWidth={width} />;
  }
  const pts = `${ex},${ey} ${ex - 8 * Math.cos(a - 0.4)},${ey - 8 * Math.sin(a - 0.4)} ${ex - 8 * Math.cos(a + 0.4)},${ey - 8 * Math.sin(a + 0.4)}`;
  return <g><line x1={sx} y1={sy} x2={ex} y2={ey} stroke={color} strokeWidth={width} /><polygon points={pts} fill={color} /></g>;
}

/* ═══════════════════════════════════════════════════════════
   INTERACTIVE GRAPH BUILDER
   Lets user click nodes to explore adjacency, degrees, paths
   ═══════════════════════════════════════════════════════════ */
export function GraphExplorerViz() {
  // Fixed undirected graph: a-b-c-d with extra edges
  const NODES = {
    a: { x: 120, y: 80 },  b: { x: 280, y: 80 },
    c: { x: 120, y: 200 }, d: { x: 280, y: 200 },
    e: { x: 200, y: 140 },
  };
  const EDGES = [
    ['a','b'], ['a','c'], ['a','e'],
    ['b','d'], ['b','e'],
    ['c','d'], ['c','e'],
    ['d','e'],
  ];

  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState('explore'); // 'explore' | 'degree' | 'path'
  const [pathTarget, setPathTarget] = useState(null);
  const [highlightEdges, setHighlightEdges] = useState(new Set());

  const adj = {};
  Object.keys(NODES).forEach(n => { adj[n] = []; });
  EDGES.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });

  // BFS path
  function bfsPath(src, dst) {
    if (!src || !dst || src === dst) return [];
    const visited = new Set([src]);
    const queue = [[src, [src]]];
    while (queue.length) {
      const [cur, path] = queue.shift();
      for (const nb of adj[cur]) {
        if (nb === dst) return [...path, nb];
        if (!visited.has(nb)) { visited.add(nb); queue.push([nb, [...path, nb]]); }
      }
    }
    return [];
  }

  const path = mode === 'path' && selected && pathTarget ? bfsPath(selected, pathTarget) : [];
  const pathEdgeSet = new Set();
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i], b = path[i + 1];
    pathEdgeSet.add(`${a}-${b}`); pathEdgeSet.add(`${b}-${a}`);
  }

  const degree = selected ? adj[selected].length : 0;

  return (
    <div>
      {/* Mode selector */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        {[['explore','🔍 Explorar'],['degree','📊 Grados'],['path','🛤️ Camino']].map(([m, label]) => (
          <button key={m} onClick={() => { setMode(m); setSelected(null); setPathTarget(null); }}
            style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, padding: '3px 10px', cursor: 'pointer', border: `1.5px solid ${mode === m ? AC : '#ccc'}`, background: mode === m ? '#ffeaed' : '#f9f8f4', color: mode === m ? AC : TX }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <svg width={400} height={285} style={{ background: '#f9f8f4', border: '1px solid #ddd', flexShrink: 0 }}>
          {EDGES.map(([a, b], i) => {
            const isPath = pathEdgeSet.has(`${a}-${b}`);
            const isAdj = mode === 'explore' && selected && (a === selected || b === selected);
            const col = isPath ? GRN : isAdj ? AC : '#ccc';
            const w = isPath || isAdj ? 2.5 : 1.5;
            const n1 = NODES[a], n2 = NODES[b];
            const mx = (n1.x + n2.x) / 2, my = (n1.y + n2.y) / 2;
            return (
              <g key={i}>
                <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} stroke={col} strokeWidth={w} />
                {mode === 'degree' && (
                  <text x={mx} y={my - 6} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill="#999">arista</text>
                )}
              </g>
            );
          })}
          {Object.entries(NODES).map(([id, pos]) => {
            const isSel = selected === id;
            const isPathNode = path.includes(id);
            const isAdj = mode === 'explore' && selected && adj[selected].includes(id);
            const isTarget = mode === 'path' && pathTarget === id;
            const fill = isPathNode && mode === 'path' ? GRN : isTarget ? GRN : isSel ? AC : isAdj ? '#f5c0c8' : '#fff';
            const stroke = isPathNode && mode === 'path' ? GRN : isTarget ? GRN : isSel ? AC : isAdj ? AC : BD;
            const deg = adj[id].length;
            return (
              <g key={id} style={{ cursor: 'pointer' }} onClick={() => {
                if (mode === 'path' && selected && id !== selected) { setPathTarget(id); }
                else { setSelected(selected === id ? null : id); setPathTarget(null); }
              }}>
                <circle cx={pos.x} cy={pos.y} r={22} fill={fill} stroke={stroke} strokeWidth={isSel || isTarget || isPathNode ? 2.5 : 1.5} />
                <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontFamily="'Lora',serif" fontSize={14} fontWeight={700} fill={isSel || isTarget || isPathNode ? '#fff' : TX}>{id}</text>
                {mode === 'degree' && (
                  <text x={pos.x} y={pos.y + 36} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={10} fill={AC}>grado: {deg}</text>
                )}
              </g>
            );
          })}
          {/* Total degree sum */}
          {mode === 'degree' && (
            <text x={200} y={276} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill="#888">
              Σ grados = {Object.values(adj).reduce((s, nb) => s + nb.length, 0)} = 2 × {EDGES.length} aristas
            </text>
          )}
        </svg>

        {/* Info panel */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {mode === 'explore' && !selected && (
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: '#888', lineHeight: 1.8 }}>
              Clic en un nodo para ver sus vecinos y propiedades.
            </div>
          )}
          {mode === 'explore' && selected && (
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: AC, fontWeight: 700, marginBottom: 4 }}>Nodo: {selected}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: TX, lineHeight: 2 }}>
                Grado: <strong>{degree}</strong><br/>
                Vecinos: <strong>{adj[selected].join(', ')}</strong><br/>
                <span style={{ color: '#888', fontSize: 10 }}>Las aristas en rojo son incidentes sobre {selected}</span>
              </div>
              {/* Adjacency list for this node */}
              <div style={{ background: '#ffeaed', border: `1px solid ${AC}`, padding: '6px 10px', marginTop: 8, fontFamily: "'JetBrains Mono',monospace", fontSize: 10 }}>
                {selected} → [{adj[selected].join(', ')}]
              </div>
            </div>
          )}
          {mode === 'degree' && (
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: AC, fontWeight: 700, marginBottom: 6 }}>Grados de todos los nodos</div>
              {Object.entries(adj).map(([n, nb]) => (
                <div key={n} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, lineHeight: 1.9, display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ width: 12, fontWeight: 700, color: AC }}>{n}</span>
                  <span style={{ color: TX }}>grado = {nb.length}</span>
                  <span style={{ color: '#888', fontSize: 9 }}>({nb.join(',')})</span>
                </div>
              ))}
              <div style={{ marginTop: 8, background: '#e8f0fa', border: `1px solid ${BL}`, padding: '5px 8px', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: BL }}>
                Propiedad: Σ grados = 2|A| = {Object.values(adj).reduce((s, nb) => s + nb.length, 0)}
              </div>
            </div>
          )}
          {mode === 'path' && (
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: GRN, fontWeight: 700, marginBottom: 4 }}>Modo camino (BFS)</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#666', lineHeight: 1.9 }}>
                {!selected ? '① Clic para elegir origen' : !pathTarget ? `Origen: ${selected}\n② Clic para elegir destino` : ''}
              </div>
              {selected && pathTarget && (
                <div style={{ background: path.length ? '#edfdf5' : '#ffeaed', border: `1px solid ${path.length ? GRN : AC}`, padding: '6px 10px', fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: path.length ? GRN : AC, lineHeight: 1.8 }}>
                  {selected} → {pathTarget}:<br/>
                  {path.length ? <>Camino: <strong>{path.join(' → ')}</strong><br/>Longitud: {path.length - 1} arista(s)</> : 'No existe camino'}
                </div>
              )}
              {selected && <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#888', marginTop: 6 }}>Origen seleccionado: <strong style={{ color: AC }}>{selected}</strong></div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   PRIM VIZ — animated MST construction
   ═══════════════════════════════════════════════════════════ */
export function PrimViz() {
  // Graph: 7 nodes, weighted edges matching the class example
  const NODES = {
    1: { x: 100, y: 120 }, 2: { x: 200, y: 50 },  3: { x: 310, y: 120 },
    4: { x: 200, y: 190 }, 5: { x: 100, y: 255 }, 6: { x: 310, y: 255 }, 7: { x: 200, y: 310 },
  };
  const ALL_EDGES = [
    [1,2,6],[1,4,5],[2,3,5],[2,4,5],[3,4,3],[3,6,5],
    [4,5,1],[4,6,2],[5,7,4],[6,7,6],[1,5,4],[2,6,1],
  ];

  // Pre-computed Prim steps starting from node 1
  const STEPS = [
    { U: [1], treeEdges: [], candidate: null, note: 'Inicio: U = {1}. Buscar arista más barata que cruza el corte.' },
    { U: [1,4], treeEdges: [[1,4,5]], candidate: [4,5,1], note: 'Elegir (1,4) costo 1→ Agregar 4 a U. Actualizar aristas candidatas.' },
    { U: [1,4,5], treeEdges: [[1,4,5],[4,5,1]], candidate: [4,5,1], note: 'Elegir (4,5) costo 1. Agregar 5 a U.' },
    { U: [1,4,5,2], treeEdges: [[1,4,5],[4,5,1],[2,6,1]], candidate: [2,6,1], note: 'Elegir (2,6)? No — candidata es (4,6) costo 2→ Agregar la mínima.' },
    { U: [1,4,5,6], treeEdges: [[1,4,5],[4,5,1],[4,6,2]], candidate: [4,6,2], note: 'Elegir (4,6) costo 2. Agregar 6 a U.' },
    { U: [1,4,5,6,3], treeEdges: [[1,4,5],[4,5,1],[4,6,2],[3,4,3]], candidate: [3,4,3], note: 'Elegir (3,4) costo 3. Agregar 3 a U.' },
    { U: [1,4,5,6,3,7], treeEdges: [[1,4,5],[4,5,1],[4,6,2],[3,4,3],[5,7,4]], candidate: [5,7,4], note: 'Elegir (5,7) costo 4. Agregar 7 a U.' },
    { U: [1,4,5,6,3,7,2], treeEdges: [[1,4,5],[4,5,1],[4,6,2],[3,4,3],[5,7,4],[1,2,6]], candidate: [1,2,6], note: '✓ U = V. AAM completo! Costo total = 5+1+2+3+4+6 = 21' },
  ];

  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const cur = STEPS[step];

  useEffect(() => {
    if (!playing) return;
    if (step >= STEPS.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStep(s => s + 1), 1100);
    return () => clearTimeout(t);
  }, [playing, step]);

  const treeEdgeSet = new Set(cur.treeEdges.map(([a, b]) => `${Math.min(a,b)}-${Math.max(a,b)}`));
  const inU = new Set(cur.U);

  // Find all crossing edges (one end in U, other not)
  const crossing = ALL_EDGES.filter(([a, b]) => (inU.has(a) && !inU.has(b)) || (!inU.has(a) && inU.has(b)));

  return (
    <div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <svg width={420} height={345} style={{ background: '#f9f8f4', border: '1px solid #ddd', flexShrink: 0 }}>
          {ALL_EDGES.map(([a, b, w], i) => {
            const key = `${Math.min(a,b)}-${Math.max(a,b)}`;
            const isTree = treeEdgeSet.has(key);
            const isCross = crossing.some(([x, y]) => Math.min(x,y) === Math.min(a,b) && Math.max(x,y) === Math.max(a,b));
            const isCand = cur.candidate && Math.min(cur.candidate[0],cur.candidate[1]) === Math.min(a,b) && Math.max(cur.candidate[0],cur.candidate[1]) === Math.max(a,b);
            const col = isTree ? GRN : isCand ? AC : isCross ? ORG : '#ccc';
            const wt = isTree ? 3 : isCand ? 2.5 : isCross ? 1.5 : 1;
            const n1 = NODES[a], n2 = NODES[b];
            const mx = (n1.x + n2.x) / 2, my = (n1.y + n2.y) / 2;
            return (
              <g key={i}>
                <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} stroke={col} strokeWidth={wt} />
                <text x={mx + 1} y={my - 5} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={10}
                  fill={isTree ? GRN : isCand ? AC : isCross ? ORG : '#bbb'} fontWeight={isTree || isCand ? 700 : 400}>{w}</text>
              </g>
            );
          })}
          {Object.entries(NODES).map(([id, pos]) => {
            const n = parseInt(id);
            const inUSet = inU.has(n);
            const fill = inUSet ? '#d4edda' : '#fff';
            const stroke = inUSet ? GRN : BD;
            return (
              <g key={id}>
                <circle cx={pos.x} cy={pos.y} r={20} fill={fill} stroke={stroke} strokeWidth={inUSet ? 2.5 : 1.5} />
                <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontFamily="'Lora',serif" fontSize={14} fontWeight={700} fill={inUSet ? GRN : TX}>{id}</text>
              </g>
            );
          })}
        </svg>

        <div style={{ flex: 1, minWidth: 140 }}>
          {/* Legend */}
          <div style={{ marginBottom: 8 }}>
            {[[GRN,'Árbol AAM'],[AC,'Candidata (elegida)'],[ORG,'Cruza el corte'],['#ccc','Ignorada']].map(([c,l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
                <div style={{ width: 20, height: 3, background: c, flexShrink: 0 }} />
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: '#555' }}>{l}</span>
              </div>
            ))}
          </div>

          {/* U set */}
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#888', marginBottom: 3 }}>U (incluidos):</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginBottom: 8 }}>
            {cur.U.map(n => <span key={n} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, background: '#d4edda', color: GRN, border: `1px solid ${GRN}`, padding: '1px 7px', fontWeight: 700 }}>{n}</span>)}
          </div>

          {/* Tree edges */}
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#888', marginBottom: 3 }}>Aristas AAM:</div>
          {cur.treeEdges.length === 0
            ? <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#bbb' }}>(ninguna aún)</div>
            : cur.treeEdges.map(([a, b, w]) => (
              <div key={`${a}-${b}`} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: GRN, lineHeight: 1.8 }}>({a},{b}) costo {w}</div>
            ))
          }
          {step === STEPS.length - 1 && (
            <div style={{ marginTop: 8, background: '#edfdf5', border: `1px solid ${GRN}`, padding: '5px 8px', fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: GRN, fontWeight: 700 }}>
              Costo total: {cur.treeEdges.reduce((s,[,, w]) => s + w, 0)}
            </div>
          )}
        </div>
      </div>

      <div style={{ background: '#ffeaed', border: `1px solid ${AC}`, padding: '5px 10px', marginTop: 6, fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: AC, lineHeight: 1.6 }}>
        [{step + 1}/{STEPS.length}] {cur.note}
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

/* ═══════════════════════════════════════════════════════════
   KRUSKAL VIZ — animated with union-find component display
   ═══════════════════════════════════════════════════════════ */
export function KruskalViz() {
  const NODES = {
    1: { x: 100, y: 120 }, 2: { x: 200, y: 50 },  3: { x: 310, y: 120 },
    4: { x: 200, y: 190 }, 5: { x: 100, y: 255 }, 6: { x: 310, y: 255 }, 7: { x: 200, y: 310 },
  };
  // Same graph, sorted edges for Kruskal
  const SORTED_EDGES = [
    [4,5,1],[2,6,1],[4,6,2],[3,4,3],[1,5,4],[5,7,4],[1,2,6],[1,4,5],[2,3,5],[2,4,5],[3,6,5],[6,7,6],
  ];

  const STEPS = [
    { processed: 0, tree: [], rejected: [], components: [[1],[2],[3],[4],[5],[6],[7]], note: 'Inicio: todas las aristas ordenadas por costo. Cada nodo es su propio componente.' },
    { processed: 1, tree: [[4,5,1]], rejected: [], components: [[1],[2],[3],[4,5],[6],[7]], note: '(4,5) costo 1 → nodos en componentes distintos → AGREGAR. Une {4} y {5}.' },
    { processed: 2, tree: [[4,5,1],[2,6,1]], rejected: [], components: [[1],[2,6],[3],[4,5],[7]], note: '(2,6) costo 1 → componentes distintos → AGREGAR. Une {2} y {6}.' },
    { processed: 3, tree: [[4,5,1],[2,6,1],[4,6,2]], rejected: [], components: [[1],[2,4,5,6],[3],[7]], note: '(4,6) costo 2 → 4 en {4,5}, 6 en {2,6} → AGREGAR. Une ambos grupos.' },
    { processed: 4, tree: [[4,5,1],[2,6,1],[4,6,2],[3,4,3]], rejected: [], components: [[1],[2,3,4,5,6],[7]], note: '(3,4) costo 3 → componentes distintos → AGREGAR. Une {3} al grupo grande.' },
    { processed: 5, tree: [[4,5,1],[2,6,1],[4,6,2],[3,4,3],[1,5,4]], rejected: [], components: [[1,2,3,4,5,6],[7]], note: '(1,5) costo 4 → AGREGAR. Une {1} al grupo principal.' },
    { processed: 6, tree: [[4,5,1],[2,6,1],[4,6,2],[3,4,3],[1,5,4]], rejected: [[5,7,4],[2,6,1]], note: '(5,7) costo 4... espera, necesitamos 6 aristas (n-1=6). Verificar.' },
    { processed: 7, tree: [[4,5,1],[2,6,1],[4,6,2],[3,4,3],[1,5,4],[5,7,4]], rejected: [], components: [[1,2,3,4,5,6,7]], note: '(5,7) costo 4 → AGREGAR. ✓ 6 aristas, 1 componente → AAM completo! Costo = 1+1+2+3+4+4 = 15' },
  ];

  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const cur = STEPS[Math.min(step, STEPS.length - 1)];

  useEffect(() => {
    if (!playing) return;
    if (step >= STEPS.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStep(s => s + 1), 1100);
    return () => clearTimeout(t);
  }, [playing, step]);

  const treeSet = new Set((cur.tree || []).map(([a, b]) => `${Math.min(a,b)}-${Math.max(a,b)}`));
  const rejSet = new Set((cur.rejected || []).map(([a, b]) => `${Math.min(a,b)}-${Math.max(a,b)}`));

  // Component colors
  const COMP_COLS = [AC, BL, GRN, ORG, PRP, '#c0392b', '#16a085'];
  const nodeComp = {};
  (cur.components || []).forEach((comp, ci) => comp.forEach(n => { nodeComp[n] = ci; }));

  return (
    <div>
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <svg width={420} height={345} style={{ background: '#f9f8f4', border: '1px solid #ddd', flexShrink: 0 }}>
          {SORTED_EDGES.map(([a, b, w], i) => {
            const key = `${Math.min(a,b)}-${Math.max(a,b)}`;
            const isTree = treeSet.has(key);
            const isRej = rejSet.has(key);
            const isCur = i === cur.processed - 1;
            const col = isTree ? GRN : isRej ? '#e0e0e0' : isCur ? AC : '#ccc';
            const lw = isTree ? 3 : isCur ? 2.5 : 1;
            const n1 = NODES[a], n2 = NODES[b];
            const mx = (n1.x + n2.x) / 2, my = (n1.y + n2.y) / 2;
            return (
              <g key={i}>
                <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} stroke={col} strokeWidth={lw} strokeDasharray={isRej ? '4,3' : undefined} />
                <text x={mx + 1} y={my - 5} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={10}
                  fill={isTree ? GRN : isRej ? '#ccc' : isCur ? AC : '#bbb'} fontWeight={isTree ? 700 : 400}>{w}</text>
              </g>
            );
          })}
          {Object.entries(NODES).map(([id, pos]) => {
            const n = parseInt(id);
            const ci = nodeComp[n] ?? 0;
            const col = COMP_COLS[ci % COMP_COLS.length];
            return (
              <g key={id}>
                <circle cx={pos.x} cy={pos.y} r={20} fill={col + '22'} stroke={col} strokeWidth={2} />
                <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontFamily="'Lora',serif" fontSize={14} fontWeight={700} fill={col}>{id}</text>
              </g>
            );
          })}
        </svg>

        <div style={{ flex: 1, minWidth: 140 }}>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#888', marginBottom: 4 }}>Componentes conexos:</div>
          {(cur.components || []).map((comp, ci) => (
            <div key={ci} style={{ display: 'flex', gap: 3, marginBottom: 3, alignItems: 'center' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: COMP_COLS[ci % COMP_COLS.length], display: 'inline-block', flexShrink: 0 }} />
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: COMP_COLS[ci % COMP_COLS.length] }}>{'{' + comp.join(',') + '}'}</span>
            </div>
          ))}
          <div style={{ marginTop: 8, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#888' }}>Aristas AAM:</div>
          {(cur.tree || []).length === 0
            ? <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#bbb' }}>(ninguna)</div>
            : (cur.tree || []).map(([a, b, w]) => (
              <div key={`${a}-${b}`} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: GRN, lineHeight: 1.8 }}>({a},{b}) costo {w}</div>
            ))
          }
          {step === STEPS.length - 1 && (
            <div style={{ marginTop: 8, background: '#edfdf5', border: `1px solid ${GRN}`, padding: '5px 8px', fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: GRN, fontWeight: 700 }}>
              Costo total: {(cur.tree || []).reduce((s,[,,w]) => s + w, 0)}
            </div>
          )}
        </div>
      </div>

      {/* Sorted edge queue */}
      <div style={{ marginTop: 8, overflowX: 'auto' }}>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: '#888', marginBottom: 3 }}>Cola de aristas (ordenada por costo):</div>
        <div style={{ display: 'flex', gap: 2, flexWrap: 'nowrap' }}>
          {SORTED_EDGES.map(([a, b, w], i) => {
            const key = `${Math.min(a,b)}-${Math.max(a,b)}`;
            const done = i < cur.processed;
            const isCur = i === cur.processed - 1;
            const isTree = treeSet.has(key);
            return (
              <div key={i} style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: 9, padding: '2px 5px', flexShrink: 0,
                background: isCur ? '#ffeaed' : done ? (isTree ? '#edfdf5' : '#f5f5f5') : '#f9f8f4',
                border: `1px solid ${isCur ? AC : done ? (isTree ? GRN : '#ccc') : '#ddd'}`,
                color: isCur ? AC : done ? (isTree ? GRN : '#bbb') : '#555',
                textDecoration: done && !isTree ? 'line-through' : 'none',
              }}>({a},{b}) {w}</div>
            );
          })}
        </div>
      </div>

      <div style={{ background: '#ffeaed', border: `1px solid ${AC}`, padding: '5px 10px', marginTop: 6, fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: AC }}>
        [{step + 1}/{STEPS.length}] {cur.note}
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

/* ═══════════════════════════════════════════════════════════
   BFS VIZ — with queue display and level coloring
   ═══════════════════════════════════════════════════════════ */
export function BFSViz() {
  const NODES = {
    A: { x: 60, y: 140 }, B: { x: 160, y: 60 }, C: { x: 160, y: 140 }, D: { x: 160, y: 220 },
    E: { x: 260, y: 60 }, F: { x: 260, y: 140 }, G: { x: 260, y: 220 }, H: { x: 360, y: 100 }, I: { x: 360, y: 200 },
  };
  const EDGES = [
    ['A','B'],['A','C'],['A','D'],['B','E'],['C','E'],['C','F'],['D','F'],['D','G'],
    ['E','H'],['F','H'],['F','I'],['G','I'],
  ];

  const LEVEL_COLS = ['#e84055', BL, GRN, ORG];

  const STEPS = [
    { cur: 'A', queue: ['A'], visited: ['A'], order: [], levels: { A: 0 }, processedEdges: [], note: 'Encolar A. Cola: [A]' },
    { cur: 'A', queue: ['B','C','D'], visited: ['A','B','C','D'], order: ['A'], levels: { A:0, B:1, C:1, D:1 }, processedEdges: [['A','B'],['A','C'],['A','D']], note: 'Desencolar A. Encolar vecinos: B, C, D (nivel 1)' },
    { cur: 'B', queue: ['C','D','E'], visited: ['A','B','C','D','E'], order: ['A','B'], levels: { A:0, B:1, C:1, D:1, E:2 }, processedEdges: [['A','B'],['A','C'],['A','D'],['B','E']], note: 'Desencolar B. Encolar E (nivel 2). C ya visitado.' },
    { cur: 'C', queue: ['D','E','F'], visited: ['A','B','C','D','E','F'], order: ['A','B','C'], levels: { A:0, B:1, C:1, D:1, E:2, F:2 }, processedEdges: [['A','B'],['A','C'],['A','D'],['B','E'],['C','F']], note: 'Desencolar C. Encolar F. E ya visitado.' },
    { cur: 'D', queue: ['E','F','G'], visited: ['A','B','C','D','E','F','G'], order: ['A','B','C','D'], levels: { A:0, B:1, C:1, D:1, E:2, F:2, G:2 }, processedEdges: [['A','B'],['A','C'],['A','D'],['B','E'],['C','F'],['D','G']], note: 'Desencolar D. Encolar G. F ya visitado.' },
    { cur: 'E', queue: ['F','G','H'], visited: ['A','B','C','D','E','F','G','H'], order: ['A','B','C','D','E'], levels: { A:0, B:1, C:1, D:1, E:2, F:2, G:2, H:3 }, processedEdges: [['A','B'],['A','C'],['A','D'],['B','E'],['C','F'],['D','G'],['E','H']], note: 'Desencolar E. Encolar H (nivel 3).' },
    { cur: 'F', queue: ['G','H','I'], visited: ['A','B','C','D','E','F','G','H','I'], order: ['A','B','C','D','E','F'], levels: { A:0, B:1, C:1, D:1, E:2, F:2, G:2, H:3, I:3 }, processedEdges: [['A','B'],['A','C'],['A','D'],['B','E'],['C','F'],['D','G'],['E','H'],['F','I']], note: 'Desencolar F. Encolar I. H ya visitado.' },
    { cur: 'G', queue: ['H','I'], visited: ['A','B','C','D','E','F','G','H','I'], order: ['A','B','C','D','E','F','G'], levels: { A:0, B:1, C:1, D:1, E:2, F:2, G:2, H:3, I:3 }, processedEdges: [['A','B'],['A','C'],['A','D'],['B','E'],['C','F'],['D','G'],['E','H'],['F','I']], note: 'Desencolar G. I ya visitado.' },
    { cur: 'H', queue: ['I'], visited: ['A','B','C','D','E','F','G','H','I'], order: ['A','B','C','D','E','F','G','H'], levels: { A:0, B:1, C:1, D:1, E:2, F:2, G:2, H:3, I:3 }, processedEdges: [['A','B'],['A','C'],['A','D'],['B','E'],['C','F'],['D','G'],['E','H'],['F','I']], note: 'Desencolar H. Sin vecinos nuevos.' },
    { cur: 'I', queue: [], visited: ['A','B','C','D','E','F','G','H','I'], order: ['A','B','C','D','E','F','G','H','I'], levels: { A:0, B:1, C:1, D:1, E:2, F:2, G:2, H:3, I:3 }, processedEdges: [['A','B'],['A','C'],['A','D'],['B','E'],['C','F'],['D','G'],['E','H'],['F','I']], note: '✓ BFS completo. Orden: A B C D E F G H I' },
  ];

  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(900);
  const cur = STEPS[step];

  useEffect(() => {
    if (!playing) return;
    if (step >= STEPS.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStep(s => s + 1), speed);
    return () => clearTimeout(t);
  }, [playing, step, speed]);

  const treeEdgeSet = new Set(cur.processedEdges.map(([a, b]) => `${a}-${b}`));

  return (
    <div>
      <svg width={430} height={295} style={{ display: 'block', background: '#f9f8f4', border: '1px solid #ddd' }}>
        {EDGES.map(([a, b], i) => {
          const isTree = treeEdgeSet.has(`${a}-${b}`) || treeEdgeSet.has(`${b}-${a}`);
          return <g key={i}><line x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} stroke={isTree ? '#555' : '#ddd'} strokeWidth={isTree ? 2 : 1} /></g>;
        })}
        {Object.entries(NODES).map(([id, pos]) => {
          const level = cur.levels[id];
          const col = level !== undefined ? LEVEL_COLS[level % LEVEL_COLS.length] : BD;
          const isCur = cur.cur === id;
          const inQueue = cur.queue.includes(id);
          const fill = level !== undefined ? col + '22' : '#fff';
          const stroke = level !== undefined ? col : '#ccc';
          return (
            <g key={id}>
              <circle cx={pos.x} cy={pos.y} r={20} fill={fill} stroke={stroke} strokeWidth={isCur ? 3 : inQueue ? 2 : 1.5}
                style={isCur ? { filter: 'drop-shadow(0 0 6px ' + col + ')' } : {}} />
              <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontFamily="'Lora',serif" fontSize={13} fontWeight={700} fill={col}>{id}</text>
              {level !== undefined && <text x={pos.x} y={pos.y + 34} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={8.5} fill={col}>L{level}</text>}
            </g>
          );
        })}
        {/* Level labels */}
        {[0,1,2,3].map(l => (
          <text key={l} x={[60,160,260,360][l]} y={20} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={LEVEL_COLS[l]}>Nivel {l}</text>
        ))}
      </svg>

      {/* Queue display */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 6, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#888' }}>Cola:</span>
        {cur.queue.length === 0
          ? <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#bbb' }}>(vacía)</span>
          : cur.queue.map((n, i) => {
            const l = cur.levels[n] ?? 0;
            return (
              <span key={i} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, background: LEVEL_COLS[l % LEVEL_COLS.length] + '22', color: LEVEL_COLS[l % LEVEL_COLS.length], border: `1px solid ${LEVEL_COLS[l % LEVEL_COLS.length]}`, padding: '1px 8px', fontWeight: 700 }}>{n}</span>
            );
          })
        }
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: '#aaa', marginLeft: 4 }}>← front</span>
      </div>

      {/* Visit order */}
      <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 4, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#888' }}>Visitados:</span>
        {cur.order.map((n, i) => {
          const l = cur.levels[n] ?? 0;
          return <span key={i} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: LEVEL_COLS[l % LEVEL_COLS.length] }}>{n}{i < cur.order.length - 1 ? '→' : ''}</span>;
        })}
      </div>

      <div style={{ background: '#ffeaed', border: `1px solid ${AC}`, padding: '5px 10px', marginTop: 5, fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: AC }}>
        [{step + 1}/{STEPS.length}] {cur.note}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
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
   ARTICULATION POINTS VIZ
   ═══════════════════════════════════════════════════════════ */
export function ArticulationViz() {
  // Graph from class: A-B, A-C, B-D, D-E, E-B, C-F, F-G, G-C
  const NODES = {
    A: { x: 60, y: 140 }, B: { x: 180, y: 80 }, C: { x: 180, y: 200 },
    D: { x: 280, y: 80 }, E: { x: 280, y: 160 }, F: { x: 280, y: 200 }, G: { x: 380, y: 200 },
  };
  const EDGES = [['A','B'],['A','C'],['B','D'],['D','E'],['E','B'],['C','F'],['F','G'],['G','C']];

  // DFS data from example
  const DFS_DATA = {
    A: { num: 1, low: 1, isAP: true,  reason: 'Raíz con 2 hijos (B y C)' },
    B: { num: 2, low: 1, isAP: false, reason: 'bajo[D]=1 < num_bp[B]=2' },
    D: { num: 3, low: 1, isAP: false, reason: 'bajo[E]=1 < num_bp[D]=3' },
    E: { num: 4, low: 1, isAP: false, reason: 'Arista retroceso a A (num_bp=1) → bajo[E]=1' },
    C: { num: 5, low: 5, isAP: false, reason: 'bajo[F]=5 ≥ num_bp[C]=5 (borderline, pero C tiene 1 hijo en árbol)' },
    F: { num: 6, low: 5, isAP: false, reason: 'bajo[G]=5 < num_bp[F]=6' },
    G: { num: 7, low: 5, isAP: false, reason: 'Arista retroceso a C (num_bp=5)' },
  };

  const [selected, setSelected] = useState(null);
  const [showRemoved, setShowRemoved] = useState(null); // show graph with node removed
  const [showTable, setShowTable] = useState(true);

  // Check if removing a node disconnects the graph
  function isConnected(removedNode) {
    const nodes = Object.keys(NODES).filter(n => n !== removedNode);
    if (nodes.length === 0) return true;
    const adjMap = {};
    nodes.forEach(n => { adjMap[n] = []; });
    EDGES.forEach(([a, b]) => {
      if (a !== removedNode && b !== removedNode) { adjMap[a].push(b); adjMap[b].push(a); }
    });
    const visited = new Set([nodes[0]]);
    const queue = [nodes[0]];
    while (queue.length) { const n = queue.shift(); adjMap[n].forEach(nb => { if (!visited.has(nb)) { visited.add(nb); queue.push(nb); } }); }
    return visited.size === nodes.length;
  }

  // Find connected components after removal
  function componentsAfterRemoval(removedNode) {
    const nodes = Object.keys(NODES).filter(n => n !== removedNode);
    const adjMap = {};
    nodes.forEach(n => { adjMap[n] = []; });
    EDGES.forEach(([a, b]) => {
      if (a !== removedNode && b !== removedNode) { adjMap[a].push(b); adjMap[b].push(a); }
    });
    const visited = new Set();
    const components = [];
    for (const start of nodes) {
      if (!visited.has(start)) {
        const comp = [];
        const queue = [start];
        visited.add(start);
        while (queue.length) { const n = queue.shift(); comp.push(n); adjMap[n].forEach(nb => { if (!visited.has(nb)) { visited.add(nb); queue.push(nb); } }); }
        components.push(comp);
      }
    }
    return components;
  }

  const COMP_COLS = [AC, BL, GRN, ORG, PRP];
  const compMap = {};
  if (showRemoved) {
    const comps = componentsAfterRemoval(showRemoved);
    comps.forEach((comp, ci) => comp.forEach(n => { compMap[n] = ci; }));
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 8, flexWrap: 'wrap' }}>
        <button onClick={() => setShowTable(!showTable)} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, padding: '3px 10px', cursor: 'pointer', border: `1.5px solid ${showTable ? BL : '#ccc'}`, background: showTable ? '#e8f0fa' : '#f9f8f4', color: showTable ? BL : TX }}>
          {showTable ? '▼ Ocultar tabla' : '▶ Ver tabla num_bp/bajo'}
        </button>
        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#888', alignSelf: 'center' }}>Clic en nodo → ver qué pasa si se elimina</span>
      </div>

      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <svg width={430} height={265} style={{ background: '#f9f8f4', border: '1px solid #ddd', flexShrink: 0 }}>
          {EDGES.map(([a, b], i) => {
            const isBackEdge = (a === 'E' && b === 'B') || (a === 'B' && b === 'E') || (a === 'G' && b === 'C') || (a === 'C' && b === 'G');
            const removed = showRemoved && (a === showRemoved || b === showRemoved);
            if (removed) return null;
            const ca = compMap[a] ?? -1, cb = compMap[b] ?? -1;
            const sameComp = showRemoved && ca >= 0 && ca === cb;
            const col = sameComp ? COMP_COLS[ca % COMP_COLS.length] : isBackEdge ? PRP : '#999';
            return (
              <g key={i}>
                <line x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} stroke={col} strokeWidth={isBackEdge ? 2 : 1.5} strokeDasharray={isBackEdge ? '5,3' : undefined} />
              </g>
            );
          })}
          {Object.entries(NODES).map(([id, pos]) => {
            const data = DFS_DATA[id];
            const isAP = data.isAP;
            const isSel = selected === id || showRemoved === id;
            const isRemoved = showRemoved === id;
            const ci = compMap[id] ?? -1;
            const col = isRemoved ? '#ccc' : ci >= 0 ? COMP_COLS[ci % COMP_COLS.length] : isAP ? AC : BD;
            return (
              <g key={id} style={{ cursor: 'pointer' }}
                onClick={() => { setSelected(id); setShowRemoved(showRemoved === id ? null : id); }}>
                <circle cx={pos.x} cy={pos.y} r={20} fill={isRemoved ? '#f0f0f0' : isAP ? '#ffeaed' : '#fff'}
                  stroke={col} strokeWidth={isAP || isSel ? 2.5 : 1.5}
                  strokeDasharray={isRemoved ? '4,3' : undefined} />
                <text x={pos.x} y={pos.y + 5} textAnchor="middle" fontFamily="'Lora',serif" fontSize={14} fontWeight={700} fill={isRemoved ? '#bbb' : col}>{id}</text>
                {isAP && !isRemoved && <text x={pos.x + 24} y={pos.y - 14} fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={AC}>⚡AP</text>}
                <text x={pos.x} y={pos.y + 35} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#888">{data.num}/{data.low}</text>
              </g>
            );
          })}
          <text x={5} y={260} fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#aaa">num_bp/bajo bajo cada nodo · - - - arista de retroceso</text>
        </svg>

        <div style={{ flex: 1, minWidth: 160 }}>
          {showRemoved ? (
            <div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, fontWeight: 700, color: AC, marginBottom: 4 }}>Eliminando nodo {showRemoved}:</div>
              {isConnected(showRemoved)
                ? <div style={{ background: '#edfdf5', border: `1px solid ${GRN}`, padding: '5px 8px', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: GRN }}>El grafo SIGUE CONEXO → {showRemoved} NO es punto de articulación</div>
                : <div style={{ background: '#ffeaed', border: `1px solid ${AC}`, padding: '5px 8px', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: AC }}>El grafo QUEDA DESCONECTADO → {showRemoved} ES punto de articulación ⚡</div>
              }
              <div style={{ marginTop: 6, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#888' }}>Componentes restantes:</div>
              {componentsAfterRemoval(showRemoved).map((comp, ci) => (
                <div key={ci} style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: COMP_COLS[ci % COMP_COLS.length], display: 'inline-block' }} />
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: COMP_COLS[ci % COMP_COLS.length] }}>{'{' + comp.join(', ') + '}'}</span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#888', lineHeight: 1.8 }}>
              ⚡ = punto de articulación<br/>
              num/bajo bajo cada nodo<br/><br/>
              Clic en nodo para simular su eliminación del grafo.
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      {showTable && (
        <div style={{ marginTop: 10, overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, width: '100%' }}>
            <thead>
              <tr>{['Vértice','num_bp','bajo','¿AP?','Motivo'].map(h => (
                <th key={h} style={{ border: '1.5px solid #1e1e1e', padding: '3px 8px', background: '#1e1e1e', color: '#fff', fontSize: 10 }}>{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {Object.entries(DFS_DATA).map(([n, d], i) => (
                <tr key={n} style={{ background: d.isAP ? '#ffeaed' : i % 2 === 0 ? '#f0f0ec' : '#fff', cursor: 'pointer' }} onClick={() => { setSelected(n); setShowRemoved(showRemoved === n ? null : n); }}>
                  <td style={{ border: '1px solid #ccc', padding: '3px 8px', color: d.isAP ? AC : TX, fontWeight: d.isAP ? 700 : 400 }}>{n}</td>
                  <td style={{ border: '1px solid #ccc', padding: '3px 8px', color: '#555' }}>{d.num}</td>
                  <td style={{ border: '1px solid #ccc', padding: '3px 8px', color: '#555' }}>{d.low}</td>
                  <td style={{ border: '1px solid #ccc', padding: '3px 8px', color: d.isAP ? AC : GRN, fontWeight: 700 }}>{d.isAP ? '⚡ Sí' : 'No'}</td>
                  <td style={{ border: '1px solid #ccc', padding: '3px 8px', color: '#666', fontSize: 9.5 }}>{d.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
