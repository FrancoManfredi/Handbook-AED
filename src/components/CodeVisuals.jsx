import { AC, BL, BD, TX } from '../constants';
const GRN = '#27ae60';
const ORG = '#e67e22';
const PRP = '#8e44ad';
const INF = '∞';

// ── shared mini helpers ───────────────────────────────────
function NodeCircle({ cx, cy, r = 18, label, fill = '#fff', stroke = BD, strokeW = 1.5, labelColor = TX, sub, subColor = '#aaa' }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={strokeW} />
      <text x={cx} y={cy + 5} textAnchor="middle" fontFamily="'Lora',serif" fontSize={13} fontWeight={700} fill={labelColor}>{label}</text>
      {sub && <text x={cx} y={cy + r + 11} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={subColor}>{sub}</text>}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, color = BD, width = 1.5, r = 18 }) {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const ex = x2 - r * Math.cos(a), ey = y2 - r * Math.sin(a);
  const sx = x1 + r * Math.cos(a), sy = y1 + r * Math.sin(a);
  return (
    <g>
      <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={color} strokeWidth={width} />
      <polygon points={`${ex},${ey} ${ex - 7 * Math.cos(a - 0.4)},${ey - 7 * Math.sin(a - 0.4)} ${ex - 7 * Math.cos(a + 0.4)},${ey - 7 * Math.sin(a + 0.4)}`} fill={color} />
    </g>
  );
}

function Label({ text, color = AC, bg = '#ffeaed', x = 0, y = 0 }) {
  return (
    <g>
      <text x={x} y={y} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={color}>{text}</text>
    </g>
  );
}

// ─────────────────────────────────────────────────────────
//  DIJKSTRA VISUAL
//  steps map to these states:
//  0 → declare arrays   1 → initialize D   2 → fill D from origin
//  3 → outer loop       4 → find min w      5 → relax neighbors
//  6 → done
// ─────────────────────────────────────────────────────────
export function dijkstraVisual(step) {
  const NODES = { 1: { x: 110, y: 40 }, 2: { x: 40, y: 130 }, 3: { x: 110, y: 220 }, 4: { x: 110, y: 130 }, 5: { x: 180, y: 130 } };
  const EDGES = [
    { f: 1, t: 2, w: 10 }, { f: 1, t: 4, w: 30 }, { f: 1, t: 5, w: 100 },
    { f: 2, t: 3, w: 50 }, { f: 3, t: 5, w: 10 }, { f: 4, t: 3, w: 20 }, { f: 4, t: 5, w: 60 },
  ];

  const states = [
    // step 0: highlight S, D, P arrays
    { D: {}, S: [], note: 'Declarar arrays S[ ], D[ ], P[ ]' },
    // step 1: D[origen]=0
    { D: { 1: 0 }, S: [1], note: 'D[origen]=0, S={origen}' },
    // step 2: fill D with direct costs
    { D: { 1: 0, 2: 10, 3: '∞', 4: 30, 5: 100 }, S: [1], note: 'D[i] = costo(origen,i)' },
    // step 3: outer loop start
    { D: { 1: 0, 2: 10, 3: '∞', 4: 30, 5: 100 }, S: [1], w: null, note: 'Mientras V ≠ S…' },
    // step 4: pick w=2 (min D in V-S)
    { D: { 1: 0, 2: 10, 3: 60, 4: 30, 5: 100 }, S: [1, 2], w: 2, note: 'w=2 (D[2]=10 mínimo)' },
    // step 5: relax from w=4
    { D: { 1: 0, 2: 10, 3: 50, 4: 30, 5: 90 }, S: [1, 2, 4], w: 4, note: 'Relajar vecinos desde w=4' },
    // step 6: done
    { D: { 1: 0, 2: 10, 3: 50, 4: 30, 5: 60 }, S: [1, 2, 4, 3, 5], w: 5, note: '✓ D final — caminos mínimos' },
  ];

  const st = states[Math.min(Math.max(step, 0), states.length - 1)];

  return (
    <svg width={220} height={260} style={{ display: 'block' }}>
      {EDGES.map((e, i) => {
        const n1 = NODES[e.f], n2 = NODES[e.t];
        const inS = st.S.includes(e.f) && st.S.includes(e.t);
        const isRelaxed = st.w === e.f;
        const col = isRelaxed ? AC : inS ? GRN : '#ccc';
        return (
          <g key={i}>
            <Arrow x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} color={col} width={isRelaxed ? 2.5 : 1.5} r={18} />
            <text x={(n1.x + n2.x) / 2 + 5} y={(n1.y + n2.y) / 2 - 4} textAnchor="middle"
              fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={isRelaxed ? AC : '#aaa'}>{e.w}</text>
          </g>
        );
      })}
      {Object.entries(NODES).map(([id, pos]) => {
        const n = parseInt(id);
        const inS = st.S.includes(n);
        const isW = st.w === n;
        const d = st.D[n];
        return (
          <NodeCircle key={id} cx={pos.x} cy={pos.y} label={id}
            fill={isW ? AC : inS ? '#d4edda' : '#fff'}
            stroke={isW ? AC : inS ? GRN : '#ccc'}
            strokeW={isW ? 2.5 : 1.5}
            labelColor={isW ? '#fff' : inS ? GRN : TX}
            sub={d !== undefined ? String(d) : ''}
            subColor={isW ? AC : inS ? GRN : '#bbb'} />
        );
      })}
      <text x={110} y={252} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={8.5} fill="#888">{st.note}</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
//  PATH-FINDING VISUAL
//  Shows the recursive DFS stack + current path
// ─────────────────────────────────────────────────────────
export function pathVisual(step) {
  const NODES = { A: { x: 50, y: 100 }, B: { x: 130, y: 50 }, C: { x: 130, y: 150 }, D: { x: 210, y: 100 }, dest: { x: 50, y: 100 } };
  const EDGES = [['A','B'],['A','C'],['B','D'],['C','D']];
  const nodePos = { A:{x:50,y:110}, B:{x:130,y:55}, C:{x:130,y:165}, D:{x:210,y:110} };

  const states = [
    { vis: [], stk: [], cur: 'A', note: 'aux(A, D, vis, stk)' },
    { vis: ['A'], stk: ['A'], cur: 'B', note: 'vis.add(A); stk.push(A)' },
    { vis: ['A','B'], stk: ['A','B'], cur: 'D', note: 'vis.add(B); stk.push(B)' },
    { vis: ['A','B','D'], stk: ['A','B','D'], cur: 'D', note: 'n==dest → return copy([A,B,D])' },
    { vis: ['A','B'], stk: ['A','B'], cur: null, note: '← backtrack si no hubiera encontrado' },
    { vis: [], stk: [], cur: null, path: ['A','B','D'], note: '✓ Camino: A → B → D' },
  ];

  const st = states[Math.min(Math.max(step, 0), states.length - 1)];
  const pathEdges = new Set();
  if (st.path) for (let i = 0; i < st.path.length - 1; i++) pathEdges.add(`${st.path[i]}-${st.path[i+1]}`);

  return (
    <div style={{ width: '100%' }}>
      <svg width={260} height={220} style={{ display: 'block' }}>
        {EDGES.map(([a, b], i) => {
          const n1 = nodePos[a], n2 = nodePos[b];
          const isPath = pathEdges.has(`${a}-${b}`) || pathEdges.has(`${b}-${a}`);
          const isActive = st.stk.includes(a) && st.stk.includes(b);
          return (
            <g key={i}>
              <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} stroke={isPath ? GRN : isActive ? AC : '#ddd'} strokeWidth={isPath ? 2.5 : isActive ? 2 : 1} />
            </g>
          );
        })}
        {Object.entries(nodePos).map(([id, pos]) => {
          const inStk = st.stk.includes(id);
          const inPath = st.path?.includes(id);
          const isCur = st.cur === id;
          return (
            <NodeCircle key={id} cx={pos.x} cy={pos.y} r={17} label={id}
              fill={inPath ? GRN : isCur ? AC : inStk ? '#f5c0c8' : '#fff'}
              stroke={inPath ? GRN : isCur ? AC : inStk ? AC : '#ccc'}
              strokeW={isCur || inPath ? 2.5 : 1.5}
              labelColor={inPath || isCur ? '#fff' : TX} />
          );
        })}
        {/* Stack display */}
        <text x={10} y={195} fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#888">Stack:</text>
        {st.stk.map((n, i) => (
          <g key={i}>
            <rect x={40 + i * 26} y={184} width={22} height={14} fill="#ffeaed" stroke={AC} strokeWidth={1} />
            <text x={51 + i * 26} y={195} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={AC} fontWeight={700}>{n}</text>
          </g>
        ))}
        <text x={10} y={214} fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#666">{st.note}</text>
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  TREE NODE VISUAL — shows Node<T> structure
// ─────────────────────────────────────────────────────────
export function treeNodeVisual(step) {
  const states = [
    { highlight: 'class', note: 'Definición de la clase Node<T>' },
    { highlight: 'data', note: 'Campo data: almacena el valor' },
    { highlight: 'children', note: 'Lista de hijos (tamaño variable)' },
    { highlight: 'constructor', note: 'Constructor: inicializa la lista' },
    { highlight: 'addChild', note: 'addChild: agrega hijo a la lista' },
  ];
  const st = states[Math.min(Math.max(step, 0), states.length - 1)];
  const W = 220, H = 200;

  return (
    <svg width={W} height={H} style={{ display: 'block' }}>
      {/* Node box */}
      <rect x={60} y={20} width={100} height={50} fill={st.highlight === 'class' ? '#ffeaed' : '#f9f8f4'} stroke={st.highlight === 'class' ? AC : '#ccc'} strokeWidth={st.highlight === 'class' ? 2 : 1} />
      {/* data field */}
      <rect x={60} y={20} width={100} height={18} fill={st.highlight === 'data' ? '#ffeaed' : '#f0f0ec'} stroke="#ccc" strokeWidth={0.5} />
      <text x={110} y={32} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={st.highlight === 'data' ? AC : '#555'}>T data</text>
      {/* children field */}
      <rect x={60} y={38} width={100} height={18} fill={st.highlight === 'children' ? '#ffeaed' : '#fff'} stroke="#ccc" strokeWidth={0.5} />
      <text x={110} y={51} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={st.highlight === 'children' ? AC : '#555'}>List children</text>
      {/* Node label */}
      <text x={110} y={16} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#888">Node&lt;T&gt;</text>

      {/* Children nodes example */}
      {[55, 110, 165].map((cx, i) => (
        <g key={i}>
          <line x1={110} y1={70} x2={cx} y2={130}
            stroke={st.highlight === 'children' || st.highlight === 'addChild' ? AC : '#ccc'} strokeWidth={st.highlight === 'addChild' && i === 2 ? 2.5 : 1} strokeDasharray={i === 2 ? '4,2' : undefined} />
          <rect x={cx - 20} y={130} width={40} height={22} fill={i === 2 && st.highlight === 'addChild' ? '#ffeaed' : '#f9f8f4'} stroke={i === 2 && st.highlight === 'addChild' ? AC : '#ccc'} strokeWidth={1} />
          <text x={cx} y={145} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={i === 2 && st.highlight === 'addChild' ? AC : '#555'}>child{i}</text>
        </g>
      ))}

      <text x={110} y={190} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#888">{st.note}</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
//  BFS TREE VISUAL
// ─────────────────────────────────────────────────────────
export function bfsTreeVisual(step) {
  const nodePos = { root:{x:110,y:30}, c1:{x:55,y:100}, c2:{x:165,y:100}, c3:{x:30,y:170}, c4:{x:80,y:170}, c5:{x:140,y:170}, c6:{x:190,y:170} };
  const edges = [['root','c1'],['root','c2'],['c1','c3'],['c1','c4'],['c2','c5'],['c2','c6']];

  const states = [
    { q: ['root'], vis: [], note: 'Encolar raíz' },
    { q: ['c1','c2'], vis: ['root'], note: 'Desencolar root, encolar hijos' },
    { q: ['c2','c3','c4'], vis: ['root','c1'], note: 'Desencolar c1, encolar sus hijos' },
    { q: ['c3','c4','c5','c6'], vis: ['root','c1','c2'], note: 'Desencolar c2, encolar sus hijos' },
    { q: ['c4','c5','c6'], vis: ['root','c1','c2','c3'], note: 'Desencolar c3' },
    { q: ['c5','c6'], vis: ['root','c1','c2','c3','c4'], note: 'Desencolar c4' },
    { q: ['c6'], vis: ['root','c1','c2','c3','c4','c5'], note: 'Desencolar c5' },
    { q: [], vis: ['root','c1','c2','c3','c4','c5','c6'], note: '✓ BFS completo — por niveles' },
  ];

  const LEVEL_COLS = [AC, BL, GRN];
  const LEVEL_MAP = { root:0, c1:1, c2:1, c3:2, c4:2, c5:2, c6:2 };
  const st = states[Math.min(Math.max(step, 0), states.length - 1)];

  return (
    <svg width={220} height={200} style={{ display: 'block' }}>
      {edges.map(([a, b], i) => {
        const n1 = nodePos[a], n2 = nodePos[b];
        const vis = st.vis.includes(b);
        return <line key={i} x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} stroke={vis ? LEVEL_COLS[LEVEL_MAP[b]] : '#ddd'} strokeWidth={vis ? 2 : 1} />;
      })}
      {Object.entries(nodePos).map(([id, pos]) => {
        const inQ = st.q.includes(id);
        const vis = st.vis.includes(id);
        const lev = LEVEL_MAP[id];
        const col = LEVEL_COLS[lev];
        return (
          <g key={id}>
            <circle cx={pos.x} cy={pos.y} r={16} fill={vis ? col + '33' : inQ ? '#fff3b0' : '#fff'} stroke={vis ? col : inQ ? ORG : '#ccc'} strokeWidth={inQ ? 2 : 1.5} />
            <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={8.5} fill={vis ? col : inQ ? ORG : '#888'}>{id}</text>
          </g>
        );
      })}
      {/* Queue strip */}
      <text x={5} y={192} fontFamily="'JetBrains Mono',monospace" fontSize={7.5} fill="#888">Cola: [{st.q.join(',')}]</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
//  HEIGHT / SIZE VISUAL
// ─────────────────────────────────────────────────────────
export function heightVisual(step) {
  // Simple tree: root(A) → B,C; B → D; C → E,F
  const nodePos = { A:{x:110,y:25}, B:{x:65,y:90}, C:{x:155,y:90}, D:{x:45,y:155}, E:{x:135,y:155}, F:{x:175,y:155} };
  const edges = [['A','B'],['A','C'],['B','D'],['C','E'],['C','F']];
  const sizes = { A:6, B:2, C:3, D:1, E:1, F:1 };
  const heights = { A:2, B:1, C:1, D:0, E:0, F:0 };

  const states = [
    { fn: 'height', active: [], note: 'height(n): altura del subárbol' },
    { fn: 'height', active: ['D','E','F'], note: 'Hojas: height = 0 (base case)' },
    { fn: 'height', active: ['B','C'], note: 'height(B)=1, height(C)=1' },
    { fn: 'height', active: ['A'], note: 'height(A) = max(1,1)+1 = 2' },
    { fn: 'size', active: ['D','E','F'], note: 'size: hojas = 1' },
    { fn: 'size', active: ['B','C'], note: 'size(B)=2, size(C)=3' },
    { fn: 'size', active: ['A'], note: 'size(A) = 1+2+3 = 6' },
    { fn: 'bfs', active: ['A','B','C','D','E','F'], note: 'BFS: nivel por nivel' },
  ];

  const st = states[Math.min(Math.max(step, 0), states.length - 1)];

  return (
    <svg width={220} height={185} style={{ display: 'block' }}>
      {edges.map(([a, b], i) => {
        const n1 = nodePos[a], n2 = nodePos[b];
        return <line key={i} x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} stroke="#ccc" strokeWidth={1} />;
      })}
      {Object.entries(nodePos).map(([id, pos]) => {
        const isActive = st.active.includes(id);
        const val = st.fn === 'height' ? heights[id] : st.fn === 'size' ? sizes[id] : null;
        return (
          <g key={id}>
            <circle cx={pos.x} cy={pos.y} r={17} fill={isActive ? '#ffeaed' : '#f9f8f4'} stroke={isActive ? AC : '#ccc'} strokeWidth={isActive ? 2 : 1} />
            <text x={pos.x} y={pos.y + 4} textAnchor="middle" fontFamily="'Lora',serif" fontSize={12} fontWeight={700} fill={isActive ? AC : '#555'}>{id}</text>
            {isActive && val !== null && (
              <text x={pos.x + 20} y={pos.y - 8} fontFamily="'JetBrains Mono',monospace" fontSize={8.5} fill={AC}>{val}</text>
            )}
          </g>
        );
      })}
      <text x={110} y={178} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#888">{st.note}</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
//  FIRST-CHILD / RIGHT-SIBLING VISUAL
// ─────────────────────────────────────────────────────────
export function firstChildVisual(step) {
  const states = [
    { note: 'Estructura: firstChild + rightSibling' },
    { note: 'addChild: enlazar primer hijo' },
    { note: 'Hermanos: cadena de rightSibling' },
    { note: 'Árbol completo representado' },
  ];
  const st = states[Math.min(Math.max(step, 0), states.length - 1)];

  return (
    <svg width={220} height={185} style={{ display: 'block' }}>
      {/* Root */}
      <rect x={80} y={10} width={60} height={30} fill="#ffeaed" stroke={AC} strokeWidth={1.5} />
      <text x={110} y={30} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={AC}>data</text>
      {/* firstChild pointer */}
      <text x={70} y={52} textAnchor="end" fontFamily="'JetBrains Mono',monospace" fontSize={8} fill={BL}>fc↓</text>
      <line x1={80} y1={40} x2={70} y2={70} stroke={BL} strokeWidth={step >= 1 ? 2 : 0.5} strokeDasharray={step < 1 ? '3,3' : undefined} />
      {/* rightSibling pointer */}
      <text x={152} y={30} fontFamily="'JetBrains Mono',monospace" fontSize={8} fill={GRN}>rs→</text>

      {/* Child 1 */}
      <rect x={30} y={70} width={60} height={28} fill={step >= 1 ? '#e8f0fa' : '#f9f8f4'} stroke={step >= 1 ? BL : '#ccc'} strokeWidth={1} />
      <text x={60} y={88} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={step >= 1 ? BL : '#aaa'}>child1</text>
      {/* rightSibling from child1 → child2 */}
      <line x1={90} y1={84} x2={120} y2={84} stroke={GRN} strokeWidth={step >= 2 ? 2 : 0.5} strokeDasharray={step < 2 ? '3,3' : undefined} />
      <text x={106} y={79} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={7} fill={GRN}>rs→</text>

      {/* Child 2 */}
      <rect x={120} y={70} width={60} height={28} fill={step >= 2 ? '#e8f0fa' : '#f9f8f4'} stroke={step >= 2 ? BL : '#ccc'} strokeWidth={1} />
      <text x={150} y={88} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={step >= 2 ? BL : '#aaa'}>child2</text>

      {/* Grandchild */}
      <line x1={50} y1={98} x2={50} y2={135} stroke={BL} strokeWidth={step >= 3 ? 1.5 : 0.5} strokeDasharray={step < 3 ? '3,3' : undefined} />
      <rect x={20} y={135} width={60} height={24} fill={step >= 3 ? '#d4edda' : '#f9f8f4'} stroke={step >= 3 ? GRN : '#ccc'} strokeWidth={1} />
      <text x={50} y={151} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={step >= 3 ? GRN : '#aaa'}>grandchild</text>

      <text x={110} y={178} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#888">{st.note}</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
//  HASH MAP VISUAL
// ─────────────────────────────────────────────────────────
export function hashMapVisual(step) {
  const states = [
    { buckets: [null,null,null,null,null,null,null], note: 'HashMap vacío' },
    { buckets: [null,null,null,'{"a":1}',null,null,null], note: 'put("a",1) → bucket 3' },
    { buckets: [null,null,null,'{"a":1}',null,'{"b":2}',null], note: 'put("b",2) → bucket 5' },
    { buckets: [null,null,null,'{"a":1}','{"c":3}','{"b":2}',null], note: 'put("c",3) → bucket 4' },
    { buckets: [null,null,null,'{"a":1}','{"c":3}','{"b":2}',null], get: 'a', note: 'get("a") → O(1)' },
  ];
  const st = states[Math.min(Math.max(step, 0), states.length - 1)];

  return (
    <svg width={220} height={190} style={{ display: 'block' }}>
      <text x={5} y={14} fontFamily="'JetBrains Mono',monospace" fontSize={9} fill="#888">Tabla hash (7 buckets):</text>
      {(st.buckets || []).map((b, i) => (
        <g key={i}>
          <rect x={5} y={18 + i * 22} width={18} height={18} fill="#f0f0ec" stroke="#ccc" strokeWidth={1} />
          <text x={14} y={30 + i * 22} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#888">{i}</text>
          <rect x={26} y={18 + i * 22} width={120} height={18} fill={b ? '#ffeaed' : '#fff'} stroke={b ? AC : '#eee'} strokeWidth={1} />
          {b && <text x={86} y={30 + i * 22} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={8.5} fill={AC}>{b}</text>}
          {st.get && b && b.includes(`"${st.get}"`) && (
            <text x={150} y={30 + i * 22} fontFamily="'JetBrains Mono',monospace" fontSize={8} fill={GRN}>← hit!</text>
          )}
        </g>
      ))}
      <text x={5} y={184} fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#888">{st.note}</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
//  COLLECTION ITERATOR VISUAL
// ─────────────────────────────────────────────────────────
export function iteratorVisual(step) {
  const items = ['E0','E1','E2','E3','E4'];
  const states = [
    { pos: -1, note: 'iterator() → antes del primer elemento' },
    { pos: 0, note: 'next() → retorna E0' },
    { pos: 1, note: 'next() → retorna E1' },
    { pos: 2, note: 'next() → retorna E2' },
    { pos: 3, note: 'next() → retorna E3, remove()' },
    { pos: 4, note: 'next() → retorna E4' },
    { pos: 5, note: 'hasNext() = false — fin' },
  ];
  const st = states[Math.min(Math.max(step, 0), states.length - 1)];

  return (
    <svg width={220} height={120} style={{ display: 'block' }}>
      {items.map((e, i) => (
        <g key={i}>
          <rect x={10 + i * 40} y={30} width={34} height={30} fill={i === st.pos ? '#ffeaed' : '#f0f0ec'} stroke={i === st.pos ? AC : '#ccc'} strokeWidth={i === st.pos ? 2 : 1} />
          <text x={27 + i * 40} y={50} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9.5} fill={i === st.pos ? AC : '#555'}>{e}</text>
        </g>
      ))}
      {/* Cursor */}
      {st.pos >= 0 && st.pos < items.length && (
        <text x={27 + st.pos * 40} y={22} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={12} fill={AC}>▼</text>
      )}
      <text x={5} y={80} fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#888">pos → {st.pos < 0 ? 'antes' : st.pos >= items.length ? 'fin' : items[st.pos]}</text>
      <text x={5} y={95} fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#888">hasNext() = {st.pos < items.length - 1 ? 'true' : 'false'}</text>
      <text x={5} y={112} fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#888">{st.note}</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────
//  MAP ENTRY VISUAL
// ─────────────────────────────────────────────────────────
export function mapVisual(step) {
  const entries = [['a',1],['b',2],['c',3]];
  const states = [
    { view: 'none', note: 'Map<K,V> — par clave-valor' },
    { view: 'keyset', note: 'keySet() → {a, b, c}' },
    { view: 'values', note: 'values() → [1, 2, 3]' },
    { view: 'entryset', note: 'entrySet() → {a=1, b=2, c=3}' },
    { view: 'get', key: 'b', note: 'get("b") → 2' },
    { view: 'put', key: 'd', val: 4, note: 'put("d", 4) → nuevo entry' },
  ];
  const st = states[Math.min(Math.max(step, 0), states.length - 1)];
  const allEntries = st.view === 'put' ? [...entries, ['d', 4]] : entries;

  return (
    <svg width={220} height={165} style={{ display: 'block' }}>
      <text x={5} y={14} fontFamily="'JetBrains Mono',monospace" fontSize={9} fill="#888">TreeMap&lt;String,Integer&gt;</text>
      {allEntries.map(([k, v], i) => {
        const isKey = (st.view === 'keyset' || (st.view === 'get' && k === st.key));
        const isVal = (st.view === 'values' || (st.view === 'get' && k === st.key));
        const isEntry = st.view === 'entryset';
        const isNew = st.view === 'put' && k === 'd';
        return (
          <g key={k}>
            <rect x={30} y={20 + i * 30} width={40} height={22} fill={isKey || isEntry ? '#ffeaed' : '#f0f0ec'} stroke={isKey || isEntry ? AC : '#ccc'} strokeWidth={1} />
            <text x={50} y={35 + i * 30} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={10} fill={isKey || isEntry ? AC : '#555'}>{k}</text>
            <rect x={72} y={20 + i * 30} width={40} height={22} fill={isVal || isEntry ? '#e8f0fa' : '#f9f8f4'} stroke={isVal || isEntry ? BL : '#ccc'} strokeWidth={1} />
            <text x={92} y={35 + i * 30} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={10} fill={isVal || isEntry ? BL : '#555'}>{v}</text>
            {isNew && <text x={120} y={35 + i * 30} fontFamily="'JetBrains Mono',monospace" fontSize={8} fill={GRN}>← nuevo</text>}
          </g>
        );
      })}
      <text x={5} y={155} fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#888">{st.note}</text>
    </svg>
  );
}
