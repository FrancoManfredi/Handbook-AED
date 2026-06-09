import { TwoCol } from '../components/PageShells';
import CompTable from '../components/CompTable';
import { AC, BL, BD, TX } from '../constants';

const GRN = '#27ae60';
const ORG = '#e67e22';
const PRP = '#8e44ad';

const box  = { background:'#f9f8f4', border:'1px solid #ddd', padding:'8px 12px', marginBottom:10 };
const red  = { background:'#ffeaed', border:`1px solid ${AC}`, padding:'7px 11px', marginBottom:8 };
const blue = { background:'#e8f0fa', border:`1px solid ${BL}`, padding:'7px 11px', marginBottom:8 };
const grn  = { background:'#edfdf5', border:`1px solid ${GRN}`, padding:'7px 11px', marginBottom:8 };

function SectionTitle({ children }) {
  return (
    <p style={{ fontFamily:"'Lora',serif", fontWeight:700, fontSize:13, margin:'10px 0 6px', borderBottom:`2px solid ${AC}`, paddingBottom:3, color:TX }}>
      {children}
    </p>
  );
}

function KV({ items, minWidth = 115 }) {
  return (
    <div>
      {items.map(([k, v, col]) => (
        <div key={k} style={{ display:'flex', gap:10, marginBottom:4, alignItems:'baseline' }}>
          <code style={{ color: col || AC, fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, minWidth, flexShrink:0 }}>{k}</code>
          <span style={{ fontFamily:"'Lora',serif", color:'#555', fontSize:12, lineHeight:1.5 }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

export function pages() {
  return [

    // ── p53: RESUMEN ESTRUCTURAS Y JAVA COLLECTIONS ───────
    () => <TwoCol title="Resumen General" badge="CHEATSHEET — ESTRUCTURAS Y COLECCIONES" num={53}
      left={<div>
        <SectionTitle>Estructuras jerárquicas</SectionTitle>
        <CompTable headers={['Estructura','Búsqueda','Inserción']} rows={[
          ['Árbol genérico (DFS)', 'O(n)', 'O(1) con ref. al padre'],
          ['Trie', 'O(d·m)', 'O(d·m)'],
          ['Hashing (separado)', 'O(1) ~', 'O(1) ~'],
          ['Hashing (abierto)', 'O(1) ~', 'O(1) ~'],
        ]} />
        <SectionTitle>Java Collections</SectionTitle>
        <CompTable headers={['Clase','get','add/put','remove','Orden']} rows={[
          ['ArrayList',   'O(1)',     'O(1)~',    'O(n)',     'inserción'],
          ['LinkedList',  'O(n)',     'O(1)**',   'O(1)**',   'inserción'],
          ['HashMap',     'O(1)',     'O(1)',      'O(1)',     'sin orden'],
          ['TreeMap',     'O(log n)', 'O(log n)', 'O(log n)', 'natural'],
          ['HashSet',     'O(1)',     'O(1)',      'O(1)',     'sin orden'],
          ['TreeSet',     'O(log n)', 'O(log n)', 'O(log n)', 'natural'],
          ['ArrayDeque',  'O(1)',     'O(1)',      'O(1)',     'inserción'],
          ['PriorityQueue','O(1) min','O(log n)', 'O(log n)', 'prioridad'],
        ]} />
        <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:9, color:'#888', marginTop:5 }}>
          ~ amortizado · ** con ref. al nodo · d = tamaño alfabeto · m = largo palabra
        </p>
      </div>}
      right={<div>
        <SectionTitle>Cuándo usar qué estructura</SectionTitle>
        <KV items={[
          ['ArrayList',    'acceso aleatorio por índice frecuente'],
          ['LinkedList',   'inserciones al inicio/fin, Queue o Deque'],
          ['HashMap',      'lookup O(1) por clave, sin necesidad de orden'],
          ['TreeMap',      'claves ordenadas, rangos, subMap()'],
          ['HashSet',      'pertenencia rápida, sin duplicados'],
          ['TreeSet',      'elementos únicos y en orden natural'],
          ['ArrayDeque',   'pila (push/pop) o cola FIFO eficiente'],
          ['PriorityQueue','atención por prioridad mínima (min-heap)'],
          ['Trie',         'prefijos, autocompletado, startsWith()'],
          ['Árbol genérico','jerarquías naturales (archivos, org)'],
          ['HashMap anidado','grafo: adyacencias con peso'],
        ]} />
        <div style={{ ...box, marginTop: 8 }}>
          <p style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:AC, lineHeight:1.8, margin:0 }}>{`Factor de carga ideal: 0.75 (HashMap)\nEvitar en grafos: O(n²) con matriz\n  si el grafo es disperso → usar lista`}</p>
        </div>
      </div>}
    />,

    // ── p54: RESUMEN GRAFOS DIRIGIDOS ────────────────────
    () => <TwoCol title="Resumen General" badge="CHEATSHEET — GRAFOS DIRIGIDOS" num={54}
      left={<div>
        <SectionTitle>Algoritmos de caminos mínimos</SectionTitle>
        <CompTable headers={['Algoritmo','Tiempo','Espacio','Restricción']} rows={[
          ['Dijkstra (matriz)',  'O(V²)',        'O(V)', 'Pesos ≥ 0'],
          ['Dijkstra (heap)',   'O((V+A)log V)', 'O(V)', 'Pesos ≥ 0'],
          ['Floyd (todos pares)','O(V³)',        'O(V²)','Sin ciclos neg.'],
          ['Warshall (bool)',   'O(V³)',         'O(V²)','Solo existencia'],
        ]} />
        <SectionTitle>Recorridos y clasificación</SectionTitle>
        <CompTable headers={['Algoritmo','Tiempo','Aplicación']} rows={[
          ['BPF/DFS (lista adj.)', 'O(V+A)', 'Ciclos, clasificar arcos, orden topológico'],
          ['BPF/DFS (matriz)',     'O(V²)',  'Igual, con overhead de matriz'],
          ['Orden topológico',     'O(V+A)', 'Solo para GDA (grafos acíclicos)'],
        ]} />
        <SectionTitle>Tipos de arcos en BPF dirigida</SectionTitle>
        <div style={red}><p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:AC,lineHeight:1.9,margin:0}}>{`🌲 Árbol      → vértice nuevo\n↩  Retroceso  → ancestro actual → ciclo\n↘  Avance     → descendiente ya visitado\n↔  Cruzado    → ni ancestro ni descendiente`}</p></div>
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:'#888',marginTop:2}}>V = vértices · A = arcos</p>
      </div>}
      right={<div>
        <SectionTitle>Cuándo usar cada algoritmo</SectionTitle>
        <KV minWidth={155} items={[
          ['Dijkstra',          'caminos desde un origen (GPS, redes)', AC],
          ['Floyd',             'tabla completa + centro del grafo', AC],
          ['Warshall',          'solo saber si existe camino entre par', AC],
          ['DFS + P[v]',        'recuperar camino con vector de predecesores', BL],
          ['DFS + bajo[v]',     'puntos de articulación, biconexidad', BL],
          ['Orden topológico',  'scheduling, previaturas, compiladores', GRN],
          ['Cerradura transitiva','alcanzabilidad entre todos los pares', GRN],
        ]} />
        <SectionTitle>Representaciones</SectionTitle>
        <CompTable headers={['','Matriz','Lista adj.']} rows={[
          ['Espacio', 'O(V²)', 'O(V+A)'],
          ['¿Existe arco?', 'O(1)', 'O(grado)'],
          ['Iterar vecinos', 'O(V)', 'O(grado)'],
          ['Mejor para', 'grafos densos', 'grafos dispersos'],
        ]} />
        <div style={{...blue, marginTop:6}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:BL,lineHeight:1.8,margin:0}}>{`GDA acíclico: DFS sin arco retroceso\nCentro: Floyd + max columna i = e(i)\n        centro = min(e(i))`}</p>
        </div>
      </div>}
    />,

    // ── p55: RESUMEN GRAFOS NO DIRIGIDOS ─────────────────
    () => <TwoCol title="Resumen General" badge="CHEATSHEET — GRAFOS NO DIRIGIDOS" num={55}
      left={<div>
        <SectionTitle>Árboles abarcadores de costo mínimo (AAM)</SectionTitle>
        <CompTable headers={['Algoritmo','Tiempo','Espacio','Mejor para']} rows={[
          ['Prim (básico)',    'O(V·E)',    'O(V)', 'Grafos densos'],
          ['Prim (heap)',      'O(E log V)','O(V)', 'General'],
          ['Kruskal',         'O(E log E)','O(V)', 'Grafos dispersos'],
          ['Kruskal + UF',    'O(E·α(V))', 'O(V)', 'Óptimo en práctica'],
        ]} />
        <SectionTitle>Recorridos</SectionTitle>
        <CompTable headers={['','DFS','BFS']} rows={[
          ['Estructura', 'Pila / recursión', 'Cola FIFO'],
          ['Orden', 'Profundiza primero', 'Por niveles'],
          ['Arcos (no dir.)', 'Árbol + retroceso', 'Árbol + entre niveles'],
          ['Camino mínimo (aristas)', 'No', 'Sí'],
          ['Detecta ciclos', 'Sí', 'Sí'],
          ['Tiempo', 'O(V+A)', 'O(V+A)'],
        ]} />
        <SectionTitle>Biconexidad</SectionTitle>
        <div style={red}><p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:AC,lineHeight:1.9,margin:0}}>{`Punto de articulación: vértice cuya\nelimación desconecta el grafo.\n\nDetectar con DFS en O(V+A):\n  bajo[v] = min(num_bp[v],\n               min(num_bp[z]) aristas ret.,\n               min(bajo[w])   hijos árbol)\n\nv es AP si:\n  · raíz con ≥ 2 hijos en árbol DFS, o\n  · no-raíz: bajo[hijo] ≥ num_bp[v]`}</p></div>
      </div>}
      right={<div>
        <SectionTitle>Propiedades clave</SectionTitle>
        <div style={grn}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:GRN,lineHeight:1.9,margin:0}}>{`Árbol libre (n vértices):\n  · conexo + acíclico\n  · exactamente n−1 aristas\n  · único camino entre todo par\n\nPropiedad AAM (fundamento Prim/Kruskal):\n  Arista más barata que cruza cualquier\n  corte U/V-U pertenece a algún AAM.`}</p>
        </div>
        <SectionTitle>Cuándo usar cada algoritmo</SectionTitle>
        <KV minWidth={155} items={[
          ['Prim',              'red de tendido eléctrico densa', AC],
          ['Kruskal',           'red de carreteras dispersa', AC],
          ['BFS',               'camino más corto en aristas (sin pesos)', BL],
          ['DFS',               'conexidad, ciclos, componentes biconexas', BL],
          ['Puntos articulación','servidores críticos, puentes de red', GRN],
          ['Árbol libre',       'modelar red sin ciclos ni redundancias', GRN],
        ]} />
        <SectionTitle>Diferencias Dirigido vs. No Dirigido</SectionTitle>
        <CompTable headers={['Aspecto','Dirigido','No Dirigido']} rows={[
          ['Arista', '(v,w) ≠ (w,v)', '(v,w) = (w,v)'],
          ['Matriz A', 'Asimétrica', 'Simétrica'],
          ['Tipos arco DFS', '4 tipos', 'Solo árbol + retroceso'],
          ['Caminos mínimos', 'Dijkstra / Floyd', 'BFS (sin pesos)'],
          ['AAM', 'No aplica', 'Prim / Kruskal'],
        ]} />
      </div>}
    />,

  ];
}
