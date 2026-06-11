import { AC, BL, BD, TX } from '../constants';
const GRN = '#27ae60';
const ORG = '#e67e22';
const PRP = '#8e44ad';

// ── shared helpers ────────────────────────────────────────
function Arrow({ x1, y1, x2, y2, color = BD, width = 1.5, r = 18, curved = 0 }) {
  if (curved) {
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2 - curved;
    const d = `M${x1},${y1} Q${mx},${my} ${x2},${y2}`;
    const a = Math.atan2(y2 - my, x2 - mx);
    const ex = x2 - r * Math.cos(a), ey = y2 - r * Math.sin(a);
    return <g>
      <path d={d} fill="none" stroke={color} strokeWidth={width} />
      <polygon points={`${ex},${ey} ${ex - 7 * Math.cos(a - 0.4)},${ey - 7 * Math.sin(a - 0.4)} ${ex - 7 * Math.cos(a + 0.4)},${ey - 7 * Math.sin(a + 0.4)}`} fill={color} />
    </g>;
  }
  const a = Math.atan2(y2 - y1, x2 - x1);
  const ex = x2 - r * Math.cos(a), ey = y2 - r * Math.sin(a);
  const sx = x1 + r * Math.cos(a), sy = y1 + r * Math.sin(a);
  return <g>
    <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={color} strokeWidth={width} />
    <polygon points={`${ex},${ey} ${ex - 7 * Math.cos(a - 0.4)},${ey - 7 * Math.sin(a - 0.4)} ${ex - 7 * Math.cos(a + 0.4)},${ey - 7 * Math.sin(a + 0.4)}`} fill={color} />
  </g>;
}

function Node({ cx, cy, r = 18, label, fill = '#fff', stroke = BD, sw = 1.5, fc = TX, sub, sc = '#aaa' }) {
  return <g>
    <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={sw} />
    <text x={cx} y={cy + 5} textAnchor="middle" fontFamily="'Lora',serif" fontSize={13} fontWeight={700} fill={fc}>{label}</text>
    {sub && <text x={cx} y={cy + r + 12} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={sc}>{sub}</text>}
  </g>;
}

function MatCell({ x, y, w = 38, h = 28, val, active, diag }) {
  const bg = diag ? '#f0f0ec' : active ? '#fff0e6' : '#fff';
  const col = diag ? '#aaa' : active ? AC : '#555';
  return <g>
    <rect x={x} y={y} width={w} height={h} fill={bg} stroke={active ? AC : '#ccc'} strokeWidth={active ? 1.5 : 0.5} />
    <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle"
      fontFamily="'JetBrains Mono',monospace" fontSize={11} fill={col} fontWeight={active ? 700 : 400}>{String(val)}</text>
  </g>;
}

// ─── DIJKSTRA PSEUDO VISUAL ──────────────────────────────
export function dijkstraPseudoVisual(step) {
  const NP = { 1:{x:110,y:35}, 2:{x:45,y:115}, 3:{x:110,y:205}, 4:{x:110,y:115}, 5:{x:175,y:115} };
  const EDGES = [[1,2,10],[1,4,30],[1,5,100],[2,3,50],[3,5,10],[4,3,20],[4,5,60]];
  const INF = '∞';

  const STATES = [
    { S:[1], D:{1:0,2:10,3:INF,4:30,5:100}, w:null, note:'Inicializar S y D' },
    { S:[1], D:{1:0,2:10,3:INF,4:30,5:100}, w:null, note:'S ← {origen=1}' },
    { S:[1], D:{1:0,2:10,3:INF,4:30,5:100}, w:null, note:'D[i] ← costo(1,i)' },
    { S:[1,2], D:{1:0,2:10,3:60,4:30,5:100}, w:2, note:'w=2 mínimo → S∪{2}' },
    { S:[1,2], D:{1:0,2:10,3:60,4:30,5:100}, w:2, note:'Relajar vecinos de w=2' },
    { S:[1,2,4], D:{1:0,2:10,3:50,4:30,5:90}, w:4, note:'w=4 → S∪{4}, relajar' },
    { S:[1,2,4,3], D:{1:0,2:10,3:50,4:30,5:60}, w:3, note:'w=3 → S∪{3}, relajar' },
    { S:[1,2,4,3,5], D:{1:0,2:10,3:50,4:30,5:60}, w:5, note:'✓ S=V, listo' },
  ];
  const st = STATES[Math.min(Math.max(step,0), STATES.length-1)];

  return <svg width={230} height={250} style={{display:'block'}}>
    {EDGES.map(([f,t,w],i) => {
      const n1=NP[f],n2=NP[t];
      const inS = st.S.includes(f)&&st.S.includes(t);
      const isW = st.w===f;
      return <g key={i}>
        <Arrow x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} color={isW?AC:inS?GRN:'#ddd'} width={isW?2.5:inS?2:1} r={18}/>
        <text x={(n1.x+n2.x)/2+4} y={(n1.y+n2.y)/2-4} textAnchor="middle"
          fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={isW?AC:'#bbb'}>{w}</text>
      </g>;
    })}
    {Object.entries(NP).map(([id,pos]) => {
      const n=parseInt(id), inS=st.S.includes(n), isW=st.w===n;
      const d = st.D[n];
      return <Node key={id} cx={pos.x} cy={pos.y} label={id}
        fill={isW?AC:inS?'#d4edda':'#fff'} stroke={isW?AC:inS?GRN:'#ccc'} sw={isW?2.5:1.5}
        fc={isW?'#fff':inS?GRN:TX} sub={d!==undefined?String(d):''} sc={isW?AC:inS?GRN:'#bbb'}/>;
    })}
    <text x={115} y={242} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#888">{st.note}</text>
  </svg>;
}

// ─── FLOYD PSEUDO VISUAL ─────────────────────────────────
export function floydPseudoVisual(step) {
  const INF = '∞';
  const STATES = [
    { A:[[0,8,5],[3,0,INF],[INF,2,0]], k:null, i:null, j:null, changed:[], note:'A ← C inicial' },
    { A:[[0,8,5],[3,0,INF],[INF,2,0]], k:null, i:null, j:null, changed:[], note:'P[i,j] ← 0' },
    { A:[[0,8,5],[3,0,INF],[INF,2,0]], k:1, i:null, j:null, changed:[], note:'k=1: intermediario 1' },
    { A:[[0,8,5],[3,0,INF],[INF,2,0]], k:1, i:2, j:3, changed:[], note:'i=2, j=3: A[2,1]+A[1,3]=3+5=8' },
    { A:[[0,8,5],[3,0,8],[INF,2,0]], k:1, i:2, j:3, changed:[[1,2]], note:'8<∞ → A[2,3]=8, P[2,3]=1' },
    { A:[[0,8,5],[3,0,8],[5,2,0]], k:2, i:3, j:1, changed:[[2,0]], note:'k=2: A[3,1]=min(∞,2+3)=5' },
    { A:[[0,7,5],[3,0,8],[5,2,0]], k:3, i:1, j:2, changed:[[0,1]], note:'k=3: A[1,2]=min(8,5+2)=7' },
    { A:[[0,7,5],[3,0,8],[5,2,0]], k:null, i:null, j:null, changed:[], note:'✓ Distancias mínimas' },
  ];
  const st = STATES[Math.min(Math.max(step,0),STATES.length-1)];
  const labels = ['1','2','3'];
  const OX=20, OY=15, CW=44, CH=30;

  return <svg width={230} height={190} style={{display:'block'}}>
    <text x={75} y={12} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill="#888">MATRIZ A</text>
    {/* col headers */}
    {labels.map((l,j) => <text key={j} x={OX+CW*(j+1)+CW/2} y={OY+10} textAnchor="middle"
      fontFamily="'JetBrains Mono',monospace" fontSize={9} fill="#999">{l}</text>)}
    {/* row headers + cells */}
    {st.A.map((row,i) => {
      const isActiveRow = st.i===i+1;
      return <g key={i}>
        <text x={OX+CW*0+14} y={OY+CH*(i+1)+CH/2+4} textAnchor="middle"
          fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={isActiveRow?AC:'#999'}>{labels[i]}</text>
        {row.map((v,j) => {
          const isChanged = st.changed.some(c=>c[0]===i&&c[1]===j);
          const isK = st.k && (i+1===st.k||j+1===st.k);
          const isDiag = i===j;
          const isFocus = st.i===i+1&&st.j===j+1;
          const bg = isFocus?'#fff0e6':isChanged?'#ffeaed':isK&&!isDiag?'#f0f8ff':isDiag?'#f0f0ec':'#fff';
          const col = isChanged?AC:isFocus?ORG:isDiag?'#aaa':'#555';
          return <g key={j}>
            <rect x={OX+CW*(j+1)} y={OY+CH*(i+1)} width={CW} height={CH}
              fill={bg} stroke={isChanged?AC:isFocus?ORG:'#ccc'} strokeWidth={isChanged||isFocus?1.5:0.5}/>
            <text x={OX+CW*(j+1)+CW/2} y={OY+CH*(i+1)+CH/2+4} textAnchor="middle"
              fontFamily="'JetBrains Mono',monospace" fontSize={11} fill={col} fontWeight={isChanged?700:400}>{String(v)}</text>
          </g>;
        })}
      </g>;
    })}
    {/* k indicator */}
    {st.k && <g>
      <rect x={OX+CW*st.k} y={OY+CH*0} width={CW} height={8} fill={BL+'44'} />
      <text x={OX+CW*st.k+CW/2} y={OY+8} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={7.5} fill={BL}>k={st.k}</text>
    </g>}
    <text x={115} y={182} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#888">{st.note}</text>
  </svg>;
}

// ─── WARSHALL VISUAL ─────────────────────────────────────
export function warshallVisual(step) {
  const STATES = [
    { A:[[0,1,1],[1,0,0],[0,1,0]], note:'C inicial (bool)' },
    { A:[[0,1,1],[1,0,0],[0,1,0]], note:'A ← C, diagonal 0' },
    { A:[[0,1,1],[1,0,1],[0,1,0]], k:1, changed:[[1,2]], note:'k=1: A[2,3]=A[2,1]∧A[1,3]=1∧1=1' },
    { A:[[0,1,1],[1,0,1],[1,1,0]], k:2, changed:[[2,0]], note:'k=2: A[3,1]=A[3,2]∧A[2,1]=1∧1=1' },
    { A:[[0,1,1],[1,0,1],[1,1,0]], k:3, changed:[], note:'k=3: sin cambios' },
    { A:[[0,1,1],[1,0,1],[1,1,0]], note:'✓ Cerradura transitiva completa' },
  ];
  const st = STATES[Math.min(Math.max(step,0),STATES.length-1)];
  const labels = ['1','2','3'];
  const OX=20, OY=15, CW=48, CH=32;

  return <svg width={230} height={185} style={{display:'block'}}>
    <text x={80} y={12} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill="#888">MATRIZ BOOL A</text>
    {labels.map((l,j) => <text key={j} x={OX+CW*(j+1)+CW/2} y={OY+10} textAnchor="middle"
      fontFamily="'JetBrains Mono',monospace" fontSize={9} fill="#999">{l}</text>)}
    {st.A.map((row,i) => <g key={i}>
      <text x={OX+12} y={OY+CH*(i+1)+CH/2+4} textAnchor="middle"
        fontFamily="'JetBrains Mono',monospace" fontSize={9} fill="#999">{labels[i]}</text>
      {row.map((v,j) => {
        const isChanged = st.changed?.some(c=>c[0]===i&&c[1]===j);
        const isDiag = i===j;
        return <g key={j}>
          <rect x={OX+CW*(j+1)} y={OY+CH*(i+1)} width={CW} height={CH}
            fill={isChanged?'#ffeaed':v?'#edfdf5':isDiag?'#f0f0ec':'#fff'}
            stroke={isChanged?AC:v&&!isDiag?GRN:'#ccc'} strokeWidth={isChanged?1.5:0.5}/>
          <text x={OX+CW*(j+1)+CW/2} y={OY+CH*(i+1)+CH/2+4} textAnchor="middle"
            fontFamily="'JetBrains Mono',monospace" fontSize={12}
            fill={isChanged?AC:v&&!isDiag?GRN:isDiag?'#aaa':'#bbb'} fontWeight={v&&!isDiag?700:400}>
            {v?'T':'F'}</text>
        </g>;
      })}
    </g>)}
    {st.k && <text x={OX+CW*st.k+CW/2} y={OY+8} textAnchor="middle"
      fontFamily="'JetBrains Mono',monospace" fontSize={7.5} fill={BL}>k={st.k}</text>}
    <text x={115} y={178} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#888">{st.note}</text>
  </svg>;
}

// ─── BPF PSEUDO VISUAL ───────────────────────────────────
export function bpfPseudoVisual(step) {
  const NP = { A:{x:185,y:50}, B:{x:110,y:50}, C:{x:185,y:150}, D:{x:110,y:150}, E:{x:30,y:100} };
  const EDGES = [['E','A'],['E','B'],['A','B'],['A','C'],['B','D'],['C','D']];
  const STATES = [
    { vis:[], stk:[], cur:null, arc:null, note:'Todos sin visitar' },
    { vis:[], stk:[], cur:'A', arc:null, note:'Llamar bpf(A)' },
    { vis:['A'], stk:['A'], cur:'A', arc:null, note:'Marcar A visitado' },
    { vis:['A','B'], stk:['A','B'], cur:'B', arc:['A','B'], arcType:'árbol', note:'A→B árbol' },
    { vis:['A','B','D'], stk:['A','B','D'], cur:'D', arc:['B','D'], arcType:'árbol', note:'B→D árbol' },
    { vis:['A','B','D','C'], stk:['A','B','D','C'], cur:'C', arc:['D','C'], arcType:'árbol', note:'D→C árbol?' },
    { vis:['A','B','D','C'], stk:['A','B'], cur:null, arc:['C','A'], arcType:'retroceso', note:'C→A retroceso (ciclo)' },
    { vis:['A','B','D','C','E'], stk:[], cur:'E', arc:null, note:'Nuevo árbol desde E' },
    { vis:['A','B','D','C','E'], stk:[], cur:null, arc:null, note:'✓ BPF completa' },
  ];
  const ARC_COL = { árbol:GRN, retroceso:AC, cruzado:BL, avance:ORG };
  const st = STATES[Math.min(Math.max(step,0),STATES.length-1)];

  return <svg width={230} height={225} style={{display:'block'}}>
    {EDGES.map(([a,b],i) => {
      const isArc = st.arc&&st.arc[0]===a&&st.arc[1]===b;
      const col = isArc?ARC_COL[st.arcType]||AC:'#ddd';
      return <line key={i} x1={NP[a].x} y1={NP[a].y} x2={NP[b].x} y2={NP[b].y}
        stroke={col} strokeWidth={isArc?2.5:1}/>;
    })}
    {Object.entries(NP).map(([id,pos]) => {
      const inStk=st.stk.includes(id), vis=st.vis.includes(id), isCur=st.cur===id;
      return <Node key={id} cx={pos.x} cy={pos.y} label={id}
        fill={isCur?AC:inStk?'#f5c0c8':vis?'#e8f0fa':'#fff'}
        stroke={isCur?AC:inStk?AC:vis?BL:'#ccc'} sw={isCur?2.5:1.5}
        fc={isCur?'#fff':TX}/>;
    })}
    {st.arc && <text x={115} y={182} textAnchor="middle"
      fontFamily="'JetBrains Mono',monospace" fontSize={8.5}
      fill={ARC_COL[st.arcType]||AC}>{st.arc[0]}→{st.arc[1]}: {st.arcType}</text>}
    {/* stack */}
    <text x={5} y={198} fontFamily="'JetBrains Mono',monospace" fontSize={7.5} fill="#888">Pila:</text>
    {st.stk.map((n,i) => <g key={i}>
      <rect x={28+i*24} y={188} width={20} height={14} fill="#ffeaed" stroke={AC} strokeWidth={0.5}/>
      <text x={38+i*24} y={199} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={AC}>{n}</text>
    </g>)}
    <text x={115} y={218} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#888">{st.note}</text>
  </svg>;
}

// ─── CAMINO PSEUDO VISUAL ────────────────────────────────
export function caminoPseudoVisual(step) {
  const NP = { A:{x:35,y:115}, B:{x:115,y:55}, C:{x:115,y:175}, D:{x:195,y:115} };
  const EDGES = [['A','B'],['A','C'],['B','D'],['C','D'],['B','C']];
  const STATES = [
    { stk:[], vis:[], cur:null, path:null, note:'Inicio — visitar origen' },
    { stk:['A'], vis:['A'], cur:'A', path:null, note:'Visitar A, agregar al camino' },
    { stk:['A','B'], vis:['A','B'], cur:'B', path:null, note:'A→B: w adyacente, no visitado' },
    { stk:['A','B','D'], vis:['A','B','D'], cur:'D', path:null, note:'B→D: w adyacente' },
    { stk:['A','B','D'], vis:['A','B','D'], cur:'D', path:['A','B','D'], note:'D==Destino → Guardar camino!' },
    { stk:['A','B'], vis:['A','B','D'], cur:'B', path:null, note:'Backtrack: Quitar D' },
    { stk:['A'], vis:['A','B','D'], cur:'A', path:null, note:'Backtrack: Quitar B' },
    { stk:['A','C'], vis:['A','B','D','C'], cur:'C', path:null, note:'A→C: explorar otra rama' },
    { stk:[], vis:[], cur:null, path:['A','B','D'], note:'✓ Camino encontrado: A→B→D' },
  ];
  const st = STATES[Math.min(Math.max(step,0),STATES.length-1)];
  const pathSet = new Set();
  if (st.path) for (let i=0;i<st.path.length-1;i++) { pathSet.add(`${st.path[i]}-${st.path[i+1]}`); pathSet.add(`${st.path[i+1]}-${st.path[i]}`); }
  const stkSet = new Set();
  for (let i=0;i<st.stk.length-1;i++) { stkSet.add(`${st.stk[i]}-${st.stk[i+1]}`); }

  return <svg width={240} height={230} style={{display:'block'}}>
    {EDGES.map(([a,b],i) => {
      const isPath=pathSet.has(`${a}-${b}`), isStk=stkSet.has(`${a}-${b}`)||stkSet.has(`${b}-${a}`);
      return <line key={i} x1={NP[a].x} y1={NP[a].y} x2={NP[b].x} y2={NP[b].y}
        stroke={isPath?GRN:isStk?AC:'#ddd'} strokeWidth={isPath?2.5:isStk?2:1}/>;
    })}
    {Object.entries(NP).map(([id,pos]) => {
      const inStk=st.stk.includes(id), vis=st.vis.includes(id), isCur=st.cur===id;
      const inPath=st.path?.includes(id);
      return <Node key={id} cx={pos.x} cy={pos.y} label={id}
        fill={inPath?GRN:isCur?AC:inStk?'#f5c0c8':vis?'#f0f0ec':'#fff'}
        stroke={inPath?GRN:isCur?AC:inStk?AC:'#ccc'} sw={isCur||inPath?2.5:1.5}
        fc={inPath||isCur?'#fff':TX}/>;
    })}
    {/* stack display */}
    <text x={5} y={200} fontFamily="'JetBrains Mono',monospace" fontSize={7.5} fill="#888">ElCamino:</text>
    {st.stk.map((n,i) => <g key={i}>
      <rect x={50+i*24} y={190} width={20} height={14} fill={st.path?'#edfdf5':'#ffeaed'} stroke={st.path?GRN:AC} strokeWidth={0.5}/>
      <text x={60+i*24} y={201} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={st.path?GRN:AC}>{n}</text>
    </g>)}
    <text x={120} y={222} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#888">{st.note}</text>
  </svg>;
}

// ─── TOPO SORT VISUAL ────────────────────────────────────
export function topoPseudoVisual(step) {
  const NP = { A:{x:40,y:115}, B:{x:120,y:55}, C:{x:120,y:115}, D:{x:120,y:175}, E:{x:200,y:115}, F:{x:40,y:115} };
  const nodePos = { A:{x:40,y:110}, B:{x:120,y:50}, C:{x:120,y:110}, D:{x:120,y:170}, E:{x:200,y:110} };
  const EDGES = [['A','B'],['A','C'],['A','D'],['C','B'],['C','E'],['D','E'],['B','F'],['E','F']];
  const allNodes = ['A','B','C','D','E'];
  const STATES = [
    { vis:[], order:[], cur:null, note:'Inicio: visitados vacío, lista vacía' },
    { vis:['A'], order:[], cur:'A', note:'DFS(A): marcar A visitado' },
    { vis:['A','B'], order:[], cur:'B', note:'DFS(B): A→B árbol' },
    { vis:['A','B'], order:['B'], cur:'B', note:'B: sin vecinos nuevos → PREPEND B' },
    { vis:['A','B','C'], order:['B'], cur:'C', note:'DFS(C): A→C árbol' },
    { vis:['A','B','C','E'], order:['B'], cur:'E', note:'DFS(E): C→E árbol' },
    { vis:['A','B','C','E'], order:['E','B'], cur:'E', note:'E: PREPEND E' },
    { vis:['A','B','C','E'], order:['C','E','B'], cur:'C', note:'C: PREPEND C' },
    { vis:['A','B','C','D','E'], order:['D','C','E','B'], cur:'D', note:'DFS(D): PREPEND D' },
    { vis:['A','B','C','D','E'], order:['A','D','C','E','B'], cur:'A', note:'A: PREPEND A → orden final' },
  ];
  const st = STATES[Math.min(Math.max(step,0),STATES.length-1)];

  return <svg width={230} height={220} style={{display:'block'}}>
    {EDGES.filter(([a,b])=>allNodes.includes(a)&&allNodes.includes(b)).map(([a,b],i) => {
      const n1=nodePos[a], n2=nodePos[b];
      if (!n1||!n2) return null;
      return <line key={i} x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} stroke="#ddd" strokeWidth={1}/>;
    })}
    {allNodes.map(id => {
      const pos=nodePos[id];
      const inOrder=st.order.includes(id), vis=st.vis.includes(id), isCur=st.cur===id;
      const orderIdx=st.order.indexOf(id);
      return <g key={id}>
        <Node cx={pos.x} cy={pos.y} label={id}
          fill={isCur?AC:inOrder?'#d4edda':vis?'#f0f0ec':'#fff'}
          stroke={isCur?AC:inOrder?GRN:vis?'#ccc':'#ccc'} sw={isCur||inOrder?2.5:1.5}
          fc={isCur||inOrder?GRN:TX}/>
        {inOrder&&<text x={pos.x+22} y={pos.y-10}
          fontFamily="'JetBrains Mono',monospace" fontSize={8} fill={GRN}>#{orderIdx+1}</text>}
      </g>;
    })}
    {/* order list */}
    <text x={5} y={192} fontFamily="'JetBrains Mono',monospace" fontSize={7.5} fill="#888">Lista:</text>
    {st.order.map((n,i) => <g key={i}>
      <rect x={32+i*26} y={182} width={22} height={14} fill="#edfdf5" stroke={GRN} strokeWidth={0.5}/>
      <text x={43+i*26} y={193} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={GRN}>{n}</text>
    </g>)}
    <text x={115} y={213} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#888">{st.note}</text>
  </svg>;
}

// ─── PRIM PSEUDO VISUAL ──────────────────────────────────
export function primPseudoVisual(step) {
  const NP = { 1:{x:105,y:30},2:{x:45,y:100},3:{x:165,y:100},4:{x:105,y:100},5:{x:45,y:170},6:{x:165,y:170},7:{x:105,y:170} };
  const EDGES = [[1,2,6],[1,4,5],[2,4,5],[3,4,3],[4,5,1],[4,6,2],[5,7,4]];
  const STATES = [
    { U:[1], treeE:[], cand:null, note:'U ← {origen=1}' },
    { U:[1], treeE:[], cand:[4,5,1], note:'Buscar arista mín que cruza corte' },
    { U:[1,4], treeE:[[1,4,5]], cand:null, note:'(1,4) costo 5 → U∪{4}' },
    { U:[1,4,5], treeE:[[1,4,5],[4,5,1]], cand:[4,5,1], note:'(4,5) costo 1 → U∪{5}' },
    { U:[1,4,5,6], treeE:[[1,4,5],[4,5,1],[4,6,2]], cand:[4,6,2], note:'(4,6) costo 2 → U∪{6}' },
    { U:[1,4,5,6,3], treeE:[[1,4,5],[4,5,1],[4,6,2],[3,4,3]], cand:[3,4,3], note:'(3,4) costo 3 → U∪{3}' },
    { U:[1,4,5,6,3,7], treeE:[[1,4,5],[4,5,1],[4,6,2],[3,4,3],[5,7,4]], cand:[5,7,4], note:'(5,7) costo 4 → U∪{7}' },
    { U:[1,2,4,5,6,3,7], treeE:[[1,4,5],[4,5,1],[4,6,2],[3,4,3],[5,7,4],[1,2,6]], cand:[1,2,6], note:'✓ U=V, AAM completo' },
  ];
  const st = STATES[Math.min(Math.max(step,0),STATES.length-1)];
  const treeSet = new Set(st.treeE.map(([a,b])=>`${Math.min(a,b)}-${Math.max(a,b)}`));
  const inU = new Set(st.U);

  return <svg width={230} height={215} style={{display:'block'}}>
    {EDGES.map(([a,b,w],i) => {
      const key=`${Math.min(a,b)}-${Math.max(a,b)}`;
      const isTree=treeSet.has(key);
      const isCand=st.cand&&Math.min(st.cand[0],st.cand[1])===Math.min(a,b)&&Math.max(st.cand[0],st.cand[1])===Math.max(a,b);
      const cross=(inU.has(a)&&!inU.has(b))||(!inU.has(a)&&inU.has(b));
      const col=isTree?GRN:isCand?AC:cross?ORG:'#ddd';
      const n1=NP[a],n2=NP[b],mx=(n1.x+n2.x)/2,my=(n1.y+n2.y)/2;
      return <g key={i}>
        <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} stroke={col} strokeWidth={isTree?2.5:isCand?2:1}/>
        <text x={mx+3} y={my-3} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9}
          fill={isTree?GRN:isCand?AC:cross?ORG:'#ccc'}>{w}</text>
      </g>;
    })}
    {Object.entries(NP).map(([id,pos]) => {
      const n=parseInt(id), inUn=inU.has(n);
      return <Node key={id} cx={pos.x} cy={pos.y} label={id}
        fill={inUn?'#d4edda':'#fff'} stroke={inUn?GRN:'#ccc'} sw={inUn?2:1.5}
        fc={inUn?GRN:TX}/>;
    })}
    <text x={115} y={207} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#888">{st.note}</text>
  </svg>;
}

// ─── KRUSKAL PSEUDO VISUAL ───────────────────────────────
export function kruskalPseudoVisual(step) {
  const NP = { 1:{x:105,y:30},2:{x:45,y:100},3:{x:165,y:100},4:{x:105,y:100},5:{x:45,y:170},6:{x:165,y:170},7:{x:105,y:170} };
  const SORTED = [[4,5,1],[2,6,1],[4,6,2],[3,4,3],[1,5,4],[5,7,4]];
  const COMP_COLS = [AC,BL,GRN,ORG,PRP,'#16a085','#c0392b'];
  const STATES = [
    { tree:[], rej:[], comps:[[1],[2],[3],[4],[5],[6],[7]], note:'Ordenar aristas por costo' },
    { tree:[[4,5,1]], rej:[], comps:[[1],[2],[3],[4,5],[6],[7]], note:'(4,5)=1: distintos → AGREGAR' },
    { tree:[[4,5,1],[2,6,1]], rej:[], comps:[[1],[2,6],[3],[4,5],[7]], note:'(2,6)=1: distintos → AGREGAR' },
    { tree:[[4,5,1],[2,6,1],[4,6,2]], rej:[], comps:[[1],[2,4,5,6],[3],[7]], note:'(4,6)=2: distintos → AGREGAR' },
    { tree:[[4,5,1],[2,6,1],[4,6,2],[3,4,3]], rej:[], comps:[[1],[2,3,4,5,6],[7]], note:'(3,4)=3: AGREGAR' },
    { tree:[[4,5,1],[2,6,1],[4,6,2],[3,4,3],[1,5,4]], rej:[], comps:[[1,2,3,4,5,6],[7]], note:'(1,5)=4: AGREGAR' },
    { tree:[[4,5,1],[2,6,1],[4,6,2],[3,4,3],[1,5,4],[5,7,4]], rej:[], comps:[[1,2,3,4,5,6,7]], note:'✓ (5,7)=4: AAM completo, costo=15' },
  ];
  const st = STATES[Math.min(Math.max(step,0),STATES.length-1)];
  const treeSet = new Set(st.tree.map(([a,b])=>`${Math.min(a,b)}-${Math.max(a,b)}`));
  const nodeComp = {};
  st.comps.forEach((comp,ci) => comp.forEach(n => { nodeComp[n]=ci; }));

  return <svg width={230} height={210} style={{display:'block'}}>
    {SORTED.map(([a,b,w],i) => {
      const key=`${Math.min(a,b)}-${Math.max(a,b)}`;
      const isTree=treeSet.has(key);
      const n1=NP[a],n2=NP[b];
      return <g key={i}>
        <line x1={n1.x} y1={n1.y} x2={n2.x} y2={n2.y} stroke={isTree?GRN:'#ddd'} strokeWidth={isTree?2.5:1}/>
        <text x={(n1.x+n2.x)/2+3} y={(n1.y+n2.y)/2-3} textAnchor="middle"
          fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={isTree?GRN:'#ccc'}>{w}</text>
      </g>;
    })}
    {Object.entries(NP).map(([id,pos]) => {
      const n=parseInt(id), ci=nodeComp[n]??0, col=COMP_COLS[ci%COMP_COLS.length];
      return <Node key={id} cx={pos.x} cy={pos.y} label={id}
        fill={col+'22'} stroke={col} sw={2} fc={col}/>;
    })}
    <text x={115} y={202} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#888">{st.note}</text>
  </svg>;
}

// ─── BEA (BFS no dirigido) VISUAL ────────────────────────
export function beaPseudoVisual(step) {
  const NP = { A:{x:35,y:115}, B:{x:100,y:55}, C:{x:100,y:115}, D:{x:100,y:175}, E:{x:165,y:55}, F:{x:165,y:115}, G:{x:165,y:175}, H:{x:215,y:85}, I:{x:215,y:145} };
  const EDGES = [['A','B'],['A','C'],['A','D'],['B','E'],['C','E'],['C','F'],['D','F'],['D','G'],['E','H'],['F','H'],['F','I'],['G','I']];
  const LEVEL_COLS = [AC,BL,GRN,ORG];
  const STATES = [
    { q:[], vis:[], lev:{}, cur:null, note:'Cola vacía, todos sin visitar' },
    { q:['A'], vis:['A'], lev:{A:0}, cur:'A', note:'Encolar A (nivel 0)' },
    { q:['B','C','D'], vis:['A','B','C','D'], lev:{A:0,B:1,C:1,D:1}, cur:'A', note:'Desencolar A → encolar B,C,D (L1)' },
    { q:['C','D','E'], vis:['A','B','C','D','E'], lev:{A:0,B:1,C:1,D:1,E:2}, cur:'B', note:'Desencolar B → encolar E (L2)' },
    { q:['D','E','F'], vis:['A','B','C','D','E','F'], lev:{A:0,B:1,C:1,D:1,E:2,F:2}, cur:'C', note:'Desencolar C → encolar F (L2)' },
    { q:['E','F','G'], vis:['A','B','C','D','E','F','G'], lev:{A:0,B:1,C:1,D:1,E:2,F:2,G:2}, cur:'D', note:'Desencolar D → encolar G (L2)' },
    { q:['F','G','H'], vis:['A','B','C','D','E','F','G','H'], lev:{A:0,B:1,C:1,D:1,E:2,F:2,G:2,H:3}, cur:'E', note:'Desencolar E → encolar H (L3)' },
    { q:['G','H','I'], vis:['A','B','C','D','E','F','G','H','I'], lev:{A:0,B:1,C:1,D:1,E:2,F:2,G:2,H:3,I:3}, cur:'F', note:'Desencolar F → encolar I (L3)' },
    { q:[], vis:['A','B','C','D','E','F','G','H','I'], lev:{A:0,B:1,C:1,D:1,E:2,F:2,G:2,H:3,I:3}, cur:null, note:'✓ BFS completo por niveles' },
  ];
  const st = STATES[Math.min(Math.max(step,0),STATES.length-1)];

  return <svg width={230} height={220} style={{display:'block'}}>
    {EDGES.map(([a,b],i) => {
      const lA=st.lev[a]??-1, lB=st.lev[b]??-1;
      const both=lA>=0&&lB>=0;
      return <line key={i} x1={NP[a].x} y1={NP[a].y} x2={NP[b].x} y2={NP[b].y}
        stroke={both?'#aaa':'#eee'} strokeWidth={both?1.5:1}/>;
    })}
    {Object.entries(NP).map(([id,pos]) => {
      const lev=st.lev[id], isCur=st.cur===id, inQ=st.q.includes(id);
      const col=lev!==undefined?LEVEL_COLS[lev%LEVEL_COLS.length]:'#ccc';
      return <Node key={id} cx={pos.x} cy={pos.y} r={15} label={id}
        fill={lev!==undefined?col+'22':'#fff'} stroke={isCur?col:inQ?ORG:lev!==undefined?col:'#ddd'}
        sw={isCur?3:inQ?2:1.5} fc={lev!==undefined?col:'#bbb'}/>;
    })}
    {/* Queue */}
    <text x={3} y={207} fontFamily="'JetBrains Mono',monospace" fontSize={7.5} fill="#888">Cola: [{st.q.slice(0,5).join(',')}]</text>
    <text x={3} y={218} fontFamily="'JetBrains Mono',monospace" fontSize={7.5} fill="#888">{st.note}</text>
  </svg>;
}

// ─── ARTICULATION POINT VISUAL ───────────────────────────
export function articulationPseudoVisual(step) {
  const NP = { A:{x:35,y:125}, B:{x:115,y:65}, C:{x:115,y:185}, D:{x:195,y:65}, E:{x:195,y:145}, F:{x:195,y:185}, G:{x:270,y:185} };
  const EDGES = [['A','B'],['A','C'],['B','D'],['D','E'],['E','B'],['C','F'],['F','G'],['G','C']];
  const STATES = [
    { nums:{}, lows:{}, aps:[], cur:null, note:'Inicializar num_bp y bajo' },
    { nums:{A:1}, lows:{A:1}, aps:[], cur:'A', note:'num_bp[A]=1, bajo[A]=1' },
    { nums:{A:1,B:2}, lows:{A:1,B:1}, aps:[], cur:'B', note:'DFS(B): num=2, bajo=2' },
    { nums:{A:1,B:2,D:3}, lows:{A:1,B:1,D:1}, aps:[], cur:'D', note:'DFS(D): num=3' },
    { nums:{A:1,B:2,D:3,E:4}, lows:{A:1,B:1,D:1,E:1}, aps:[], cur:'E', note:'E→A: retroceso, bajo[E]=1' },
    { nums:{A:1,B:2,D:3,E:4}, lows:{A:1,B:1,D:1,E:1}, aps:[], cur:'B', note:'bajo[B]=min(bajo[B],bajo[D])=1' },
    { nums:{A:1,B:2,D:3,E:4,C:5}, lows:{A:1,B:1,D:1,E:1,C:5}, aps:[], cur:'C', note:'DFS(C): num=5' },
    { nums:{A:1,B:2,D:3,E:4,C:5,F:6,G:7}, lows:{A:1,B:1,D:1,E:1,C:5,F:5,G:5}, aps:['A'], cur:'A', note:'A: raíz con 2 hijos → ⚡AP' },
    { nums:{A:1,B:2,D:3,E:4,C:5,F:6,G:7}, lows:{A:1,B:1,D:1,E:1,C:5,F:5,G:5}, aps:['A'], cur:null, note:'✓ Punto de articulación: A' },
  ];
  const st = STATES[Math.min(Math.max(step,0),STATES.length-1)];

  return <svg width={245} height={230} style={{display:'block'}}>
    {EDGES.map(([a,b],i) => {
      const isBk=(a==='E'&&b==='B')||(a==='G'&&b==='C');
      return <line key={i} x1={NP[a].x} y1={NP[a].y} x2={NP[b].x} y2={NP[b].y}
        stroke={isBk?PRP:'#ccc'} strokeWidth={1.5} strokeDasharray={isBk?'5,3':undefined}/>;
    })}
    {Object.entries(NP).map(([id,pos]) => {
      const isAP=st.aps.includes(id), isCur=st.cur===id;
      const num=st.nums[id], low=st.lows[id];
      return <g key={id}>
        <Node cx={pos.x} cy={pos.y} r={17} label={id}
          fill={isCur?AC:isAP?'#ffeaed':'#fff'} stroke={isCur?AC:isAP?AC:'#ccc'} sw={isAP?2.5:1.5}
          fc={isCur?'#fff':isAP?AC:TX}/>
        {num&&<text x={pos.x} y={pos.y+30} textAnchor="middle"
          fontFamily="'JetBrains Mono',monospace" fontSize={7.5} fill="#888">{num}/{low}</text>}
        {isAP&&<text x={pos.x+20} y={pos.y-14}
          fontFamily="'JetBrains Mono',monospace" fontSize={8} fill={AC}>⚡</text>}
      </g>;
    })}
    <text x={5} y={218} fontFamily="'JetBrains Mono',monospace" fontSize={7.5} fill="#888">num_bp/bajo — ⚡ = punto articulación — - - retroceso</text>
    <text x={122} y={228} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={7.5} fill="#888">{st.note}</text>
  </svg>;
}
