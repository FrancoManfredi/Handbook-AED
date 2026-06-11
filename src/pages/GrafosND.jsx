import { Splash, TwoCol, FullPg } from '../components/PageShells';
import CompTable from '../components/CompTable';
import { GraphExplorerViz, PrimViz, KruskalViz, BFSViz, ArticulationViz } from '../components/UndirectedViz';
import { C, P, UL } from '../helpers';
import { AC, BL, BD, TX } from '../constants';
import PseudoBlock from '../components/PseudoBlock';
import { primPseudoVisual, kruskalPseudoVisual, beaPseudoVisual, articulationPseudoVisual, bpfPseudoVisual } from '../components/PseudoVisuals';

const GRN = '#27ae60';
const ORG = '#e67e22';
const PRP = '#8e44ad';

const pre  = { fontFamily:"'JetBrains Mono',monospace", fontSize:11, color:AC, lineHeight:2, margin:'0 0 10px', padding:'8px 10px', background:'#f9f8f4', border:'1px solid #ddd', whiteSpace:'pre', overflowX:'auto' };
const box  = { background:'#f9f8f4', border:'1px solid #ddd', padding:'8px 12px', marginBottom:10 };
const red  = { background:'#ffeaed', border:`1px solid ${AC}`, padding:'8px 12px', marginBottom:10 };
const blue = { background:'#e8f0fa', border:`1px solid ${BL}`, padding:'8px 12px', marginBottom:10 };
const grn  = { background:'#edfdf5', border:`1px solid ${GRN}`, padding:'8px 12px', marginBottom:10 };
const org  = { background:'#fef3e2', border:`1px solid ${ORG}`, padding:'8px 12px', marginBottom:10 };
const prp  = { background:'#f5edfb', border:`1px solid ${PRP}`, padding:'8px 12px', marginBottom:10 };

// Splash SVG for undirected graphs
function UndirectedSplashSVG() {
  const nodes = [[280,80],[140,190],[420,190],[200,300],[360,300],[280,300]];
  const edges = [[0,1],[0,2],[1,3],[2,4],[3,5],[4,5],[1,5],[2,3]];
  return (
    <svg width={560} height={340} style={{marginBottom:-5}}>
      {edges.map(([a,b],i)=>{
        const n1=nodes[a],n2=nodes[b];
        return <line key={i} x1={n1[0]} y1={n1[1]} x2={n2[0]} y2={n2[1]} stroke={BD} strokeWidth={2.5}/>;
      })}
      {nodes.map(([cx,cy],i)=>(
        <circle key={i} cx={cx} cy={cy} r={22} fill={'#f1dfc2'} stroke={i===0?AC:BD} strokeWidth={i===0?3:2.5}/>
      ))}
    </svg>
  );
}

export function pages() {
  return [

    // ── p44: SPLASH ──────────────────────────────────────
    () => <Splash number="6. GRAFOS NO DIRIGIDOS" title="Grafos No Dirigidos" visual={<UndirectedSplashSVG />} />,

    // ── p45: DEFINICIONES ────────────────────────────────
    () => <TwoCol title="Grafos No Dirigidos" badge="DEFINICION Y TERMINOLOGIA" num={45}
      left={<div>
        <P>Sea G = (V, A) un grafo no dirigido. Si la arista (v, w) pertenece a A, entonces (v, w) = (w, v): las conexiones son <strong>bidireccionales</strong>. La matriz de adyacencia resultante es siempre <strong>simétrica</strong>.</P>
        <div style={{...box, textAlign:'center'}}>
          <span style={{fontFamily:"'JetBrains Mono',monospace", fontSize:16, color:AC, fontWeight:700}}>{'(v, w) = (w, v)'}</span>
          <p style={{fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:'#666', margin:'4px 0 0'}}>sin dirección · bidireccional · simétrico</p>
        </div>
        <P><strong>Arista:</strong> conexión sin dirección entre dos vértices. Se dice que es <strong>incidente</strong> sobre v y w. Ambos son mutuamente adyacentes.</P>
        <P><strong>Grado de un vértice:</strong> número de aristas incidentes sobre él.</P>
        <div style={red}>
          <p style={{fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, color:AC, lineHeight:1.9, margin:0}}>{`Propiedad de los grados:\nΣ grados(v) = 2 · |A|\n\nCada arista aporta 2 al total de grados\n(uno por cada extremo)`}</p>
        </div>
        <P><strong>Grafo conexo:</strong> existe un camino entre todo par de vértices.</P>
        <P><strong>Ciclo simple:</strong> camino simple de longitud ≥ 3 que empieza y termina en el mismo vértice, sin repetir vértices intermedios.</P>
      </div>}
      right={<div>
        <P><strong>Diferencias clave vs. grafos dirigidos:</strong></P>
        <CompTable headers={['Aspecto','Dirigido','No Dirigido']} rows={[
          ['Arista','Par ordenado (v→w)','Par no ordenado {v,w}'],
          ['Adyacencia','w adj. a v (no recíproco)','v y w son mutuamente adj.'],
          ['Matriz A','Puede ser asimétrica','Siempre simétrica'],
          ['Arcos lista adj.','1 arco por arista','2 arcos por arista'],
          ['Tipos de arco BPF','Árbol, retroceso, cruzado, avance','Solo árbol y retroceso'],
        ]} />
        <div style={{...blue, marginTop:12}}>
          <p style={{fontFamily:"'Lora',serif", fontWeight:700, fontSize:12.5, color:BL, margin:'0 0 4px'}}>Equivalencias para árbol libre</p>
          <p style={{fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:TX, lineHeight:1.9, margin:0}}>{`G es árbol libre ↔ G es conexo y acíclico\n               ↔ G es acíclico con |A|=|V|-1\n               ↔ G es conexo con |A|=|V|-1\n               ↔ único camino entre todo par`}</p>
        </div>
      </div>}
    />,

    // ── p46: REPRESENTACIÓN + EXPLORADOR INTERACTIVO ─────
    () => <TwoCol title="Grafos No Dirigidos" badge="REPRESENTACION" num={46}
      left={<div>
        <P>Los grafos no dirigidos se representan igual que los dirigidos, pero cada arista (v,w) se codifica <strong>dos veces</strong>: v→w y w→v.</P>
        <P><strong>Matriz de adyacencias</strong> — siempre simétrica {C('M[i][j] = M[j][i]')}. Espacio {C('O(V²)')}.</P>
        <div style={box}>
          <p style={{fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:'#444', margin:0, lineHeight:1.9}}>{`     a  b  c  d\na  [ 0  1  0  1 ]\nb  [ 1  0  1  1 ]\nc  [ 0  1  0  1 ]\nd  [ 1  1  1  0 ]`}</p>
        </div>
        <P><strong>Lista de adyacencias</strong> — más eficiente. Espacio {C('O(V + A)')}. Cada arista aparece en dos listas.</P>
        <div style={box}>
          <p style={{fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:AC, margin:0, lineHeight:1.9}}>{`a → [b, d]\nb → [a, c, d]\nc → [b, d]\nd → [a, b, c]`}</p>
        </div>
        <CompTable headers={['','Matriz','Lista']} rows={[
          ['Espacio','O(V²)','O(V+A)'],
          ['¿Existe arista?','O(1)','O(grado)'],
          ['Iterar vecinos','O(V)','O(grado)'],
          ['Mejor para','Densos','Dispersos'],
        ]} />
      </div>}
      right={<div>
        <P style={{margin:'0 0 8px'}}><strong>Explorador interactivo</strong> — clic en modos y nodos:</P>
        <GraphExplorerViz />
      </div>}
    />,

    // ── p47: ÁRBOLES LIBRES Y AAM ────────────────────────
    () => <TwoCol title="Grafos No Dirigidos" badge="ARBOLES LIBRES Y AAM" num={47}
      left={<div>
        <P>Un <strong>árbol libre</strong> es un grafo no dirigido conexo y acíclico. Es la base de los árboles abarcadores.</P>
        <div style={grn}>
          <p style={{fontFamily:"'Lora',serif", fontWeight:700, fontSize:12.5, color:GRN, margin:'0 0 4px'}}>Propiedad fundamental</p>
          <p style={{fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, color:TX, lineHeight:1.9, margin:0}}>{`Todo árbol libre con n ≥ 1 vértices\ntiene exactamente n − 1 aristas.\n\nSi se agrega cualquier arista → ciclo.\nSi se elimina cualquier arista → desconecta.`}</p>
        </div>
        <P><strong>Árbol Abarcador de Costo Mínimo (AAM):</strong> dado un grafo ponderado G=(V,A), el AAM es un árbol libre que conecta todos los vértices con el menor costo total posible.</P>
        <div style={box}>
          <p style={{fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, color:AC, lineHeight:1.9, margin:0}}>{`AAM = árbol libre que:\n  - conecta TODOS los vértices de V\n  - tiene exactamente |V|-1 aristas\n  - minimiza Σ c(u,v) de sus aristas`}</p>
        </div>
        <div style={red}>
          <p style={{fontFamily:"'Lora',serif", fontWeight:700, fontSize:12.5, margin:'0 0 4px'}}>Propiedad AAM (fundamento teórico)</p>
          <p style={{fontFamily:"'JetBrains Mono',monospace", fontSize:10, color:TX, lineHeight:1.8, margin:0}}>{`Sea U ⊂ V un subconjunto propio.\nSi (u,v) es la arista de costo mínimo\ncon u ∈ U y v ∈ V−U, entonces existe\nun AAM que incluye (u,v).\n\n→ Base de Prim y Kruskal`}</p>
        </div>
      </div>}
      right={<div>
        <P><strong>Dos algoritmos greedy principales:</strong></P>
        <CompTable headers={['Aspecto','Prim','Kruskal']} rows={[
          ['Estrategia','Crece vértice a vértice','Agrega aristas globalmente'],
          ['Inicio','Necesita un vértice origen','Sin vértice origen'],
          ['Estructura clave','Conjunto U de incluidos','Componentes (Union-Find)'],
          ['Complejidad base','O(V²)','O(E log E)'],
          ['Con heap / UF','O(E log V)','O(E log V)'],
          ['Mejor para','Grafos densos','Grafos dispersos'],
          ['Resultado','Ambos encuentran el AAM (puede variar si hay empates en costos)',''],
        ]} />
        <div style={{...org, marginTop:10}}>
          <p style={{fontFamily:"'Lora',serif", fontWeight:700, fontSize:12, color:ORG, margin:'0 0 4px'}}>¿Cuándo usar cuál?</p>
          <p style={{fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, color:TX, lineHeight:1.8, margin:0}}>{`Prim    → grafo denso (muchas aristas)\n          implementación con matriz O(V²)\n\nKruskal → grafo disperso (pocas aristas)\n          ordenar E aristas: O(E log E)\n          detectar ciclos: Union-Find O(α)`}</p>
        </div>
      </div>}
    />,

    // ── p48: PRIM — PSEUDOCÓDIGO + VISUALIZADOR ──────────
    () => <TwoCol title="Grafos No Dirigidos" badge="PRIM — ARBOL ABARCADOR MINIMO" num={48}
      left={<div>
        <P>Prim expande el árbol vértice por vértice eligiendo siempre la arista más barata que cruza el <strong>corte</strong> entre U (incluidos) y V−U (pendientes).</P>
        <PseudoBlock label="Prim(G, origen)" lines={[
          "Prim(G, origen)",
          "  U ← {origen}",
          "  V ← G.vertices",
          "  M ← grafo vacío (solo vértices)",
          "  costo ← 0",
          "",
          "  Mientras U ≠ V hacer",
          "    // buscar arista más barata",
          "    // que cruza el corte U / V-U",
          "    (u,v) ← arista de costo mínimo",
          "              con u ∈ U, v ∈ V-U",
          "    agregar (u,v) a M",
          "    agregar v a U",
          "    costo ← costo + c(u,v)",
          "  FinMientras",
          "  devolver M",
        ]} steps={[[0,1,2,3,4],[6],[7,8,9,10],[11],[12],[13],[14,15]]}
           visual={(step) => primPseudoVisual(step)} />
        <PseudoBlock label="buscarMin(G, U, V)" lines={[
          "// Función auxiliar",
          "buscarMin(G, U, V): Arista",
          "  min ← MAX_VALUE",
          "  Para cada u en U hacer",
          "    Para cada v en V hacer",
          "      arista ← G.buscarArista(u,v)",
          "      Si arista ≠ null",
          "         y arista.costo < min entonces",
          "        min  ← arista.costo",
          "        best ← arista",
          "      FinSi",
          "    FinPara",
          "  FinPara",
          "  devolver best",
        ]} steps={[[0,1,2],[3,4],[5],[6,7,8,9],[10,11,12],[13]]}
           visual={(step) => primPseudoVisual(Math.min(step+1,7))} />
        <div style={blue}>
          <p style={{fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, color:BL, lineHeight:1.8, margin:0}}>{`Complejidad:\n  Base: O(V · E)\n  Con heap binario: O(E log V)\n  Con heap Fibonacci: O(E + V log V)`}</p>
        </div>
      </div>}
      right={<PrimViz />}
    />,

    // ── p49: KRUSKAL — PSEUDOCÓDIGO + VISUALIZADOR ───────
    () => <TwoCol title="Grafos No Dirigidos" badge="KRUSKAL — ARBOL ABARCADOR MINIMO" num={49}
      left={<div>
        <P>Kruskal agrega aristas en orden de costo creciente, descartando las que crean ciclos. Usa componentes conexos para detectar ciclos eficientemente.</P>
        <PseudoBlock label="Kruskal(G) — versión 1" lines={[
          "Kruskal(G)",
          "  A ← lista de aristas vacía",
          "  // Cada vértice = su propia componente",
          "  Repetir",
          "    elegir arista (u,v) de costo",
          "      mínimo de G no procesada aún",
          "    Si u y v en componentes DISTINTOS",
          "      agregar (u,v) a A",
          "      // unir las dos componentes",
          "    FinSi",
          "    // Si misma componente → ciclo",
          "    //   → descartar",
          "  Hasta que todos en un componente",
          "  devolver grafo(V, A)",
        ]} steps={[[0,1,2],[3],[4,5],[6],[7,8],[9,10,11],[12],[13]]}
           visual={(step) => kruskalPseudoVisual(step)} />
        <PseudoBlock label="Kruskal(G) — versión 2" lines={[
          "// Versión alternativa",
          "Kruskal(G)",
          "  A ← todas las aristas ordenadas",
          "  M ← grafo con V, sin aristas",
          "  n ← |V| - 1   // aristas necesarias",
          "  i ← 0",
          "  Mientras i < n hacer",
          "    (u,v) ← extraer arista min de A",
          "    agregar (u,v) a M",
          "    Si M tiene ciclo entonces",
          "      remover (u,v) de M  // descarta",
          "    Sino",
          "      i ← i + 1          // cuenta",
          "    FinSi",
          "  FinMientras",
          "  devolver M",
        ]} steps={[[0,1,2,3,4,5],[6],[7,8],[9],[10],[11,12],[13,14],[15]]}
           visual={(step) => kruskalPseudoVisual(step)} />
        <div style={grn}>
          <p style={{fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, color:GRN, lineHeight:1.8, margin:0}}>{`Complejidad:\n  Ordenar aristas: O(E log E)\n  Con Union-Find: O(E log V)\n  Union-Find con path compression: O(E·α)`}</p>
        </div>
      </div>}
      right={<KruskalViz />}
    />,

    // ── p50: BFS — PSEUDOCÓDIGO + VISUALIZADOR ───────────
    () => <TwoCol title="Grafos No Dirigidos" badge="BFS — BUSQUEDA EN AMPLITUD" num={50}
      left={<div>
        <P>La <strong>BFS (Búsqueda en Amplitud / BEA)</strong> visita primero todos los vecinos de un nodo antes de profundizar. Usa una <strong>cola FIFO</strong>. Produce un árbol en que la distancia al origen es mínima (en número de aristas).</P>
        <PseudoBlock label="BEA(grafo G) — búsqueda en amplitud" lines={[
          "BEA(grafo G)",
          "  visitados ← conjunto vacío",
          "  cola      ← cola FIFO vacía",
          "",
          "  Para cada v en G hacer",
          "    Si v no visitado entonces",
          "      cola.encolar(v)",
          "      Para cada x = cola.desencolar()",
          "        agregar x a visitados",
          "        // procesar x",
          "        Para cada y adj. a x hacer",
          "          Si y no visitado entonces",
          "            cola.encolar(y)",
          "            agregar y a visitados",
          "            // marcar al encolar!",
          "          FinSi",
          "        FinPara",
          "      FinMientras",
          "    FinSi",
          "  FinPara",
        ]} steps={[[0,1,2],[4,5],[6],[7,8,9],[10,11],[12,13,14],[15,16],[17,18,19]]}
           visual={(step) => beaPseudoVisual(step)} />
        <CompTable headers={['','DFS','BFS']} rows={[
          ['Estructura','Pila / recursión','Cola FIFO'],
          ['Orden','Profundiza primero','Por niveles'],
          ['Árbol','Largo y angosto','Ancho y bajo'],
          ['Arcos (no dir.)','Árbol + retroceso','Árbol + entre niveles'],
          ['Aplicación','Ciclos, articulación','Camino mínimo (sin peso)'],
          ['Complejidad','O(V+A)','O(V+A)'],
        ]} />
      </div>}
      right={<BFSViz />}
    />,

    // ── p51: PUNTOS DE ARTICULACIÓN ──────────────────────
    () => <TwoCol title="Grafos No Dirigidos" badge="PUNTOS DE ARTICULACION Y BICONEXIDAD" num={51}
      left={<div>
        <P>Un <strong>punto de articulación</strong> es un vértice cuya eliminación desconecta el grafo. Son los "puntos débiles" de una red.</P>
        <div style={red}>
          <p style={{fontFamily:"'Lora',serif", fontWeight:700, fontSize:12.5, margin:'0 0 4px'}}>Grafo Biconexo</p>
          <p style={{fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, color:TX, lineHeight:1.8, margin:0}}>{`Sin puntos de articulación.\nEntre cualquier par de vértices\nexisten ≥ 2 caminos disjuntos en vértices.\nConectividad k ≥ 2.`}</p>
        </div>
        <P><strong>Algoritmo — DFS con num_bp y bajo[v]:</strong></P>
        <PseudoBlock label="DFS puntos de articulación" lines={[
          "// bajo[v] = mínimo de:",
          "//  1. num_bp[v]",
          "//  2. num_bp[z] aristas retroceso (v,z)",
          "//  3. bajo[w] hijos w en árbol",
          "",
          "dfs(G, v)",
          "  num_bp[v] ← ++contador",
          "  bajo[v]   ← num_bp[v]",
          "  hijos     ← 0",
          "  Para cada w adj. a v:",
          "    Si num_bp[w] = 0 entonces  // árbol",
          "      padre[w] ← v;  hijos++",
          "      dfs(G, w)",
          "      bajo[v] ← min(bajo[v], bajo[w])",
          "      // raíz con ≥2 hijos → AP",
          "      Si padre[v]=-1 y hijos≥2",
          "        reportar v como AP",
          "      FinSi",
          "      // no-raíz: bajo[w] ≥ num_bp[v] → AP",
          "      Si padre[v]≠-1 y bajo[w]≥num_bp[v]",
          "        reportar v como AP",
          "      FinSi",
          "    SiNo Si w ≠ padre[v]  // retroceso",
          "      bajo[v] ← min(bajo[v], num_bp[w])",
          "    FinSi",
          "  FinPara",
        ]} steps={[[0,1,2,3],[5,6,7,8],[9,10],[11,12],[13],[14,15,16,17],[18,19,20,21],[22,23,24],[25]]}
           visual={(step) => articulationPseudoVisual(step)} />
      </div>}
      right={<ArticulationViz />}
    />,

    // ── p52: DFS EN GRAFOS NO DIRIGIDOS ──────────────────
    () => <TwoCol title="Grafos No Dirigidos" badge="DFS Y TIPOS DE ARCOS" num={52}
      left={<div>
        <P>En grafos no dirigidos, el DFS funciona igual que en dirigidos pero los tipos de arcos se reducen a <strong>solo dos</strong>:</P>
        {[
          ['🌲 Arco de árbol', AC, 'Va a un vértice nuevo no visitado. Forma el árbol (o bosque) abarcador.'],
          ['↩ Arco de retroceso', '#c0392b', 'Va a un ancestro del vértice actual en el árbol DFS. En no dirigidos, no hay arcos cruzados ni de avance.'],
        ].map(([title, color, desc]) => (
          <div key={title} style={{ border: `1.5px solid ${color}`, padding: '7px 11px', marginBottom: 8, background: '#fff' }}>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color, fontWeight: 700, margin: '0 0 3px' }}>{title}</p>
            <p style={{ fontFamily: "'Lora',serif", fontSize: 12.5, color: TX, margin: 0, lineHeight: 1.6 }}>{desc}</p>
          </div>
        ))}
        <div style={blue}>
          <p style={{fontFamily:"'Lora',serif", fontWeight:700, fontSize:12.5, color:BL, margin:'0 0 4px'}}>¿Por qué solo 2 tipos?</p>
          <p style={{fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, color:TX, lineHeight:1.8, margin:0}}>{`En grafos no dirigidos, cada arista\n(u,v) aparece como (u,v) y (v,u).\n\nCuando DFS llega a un vértice ya\nvisitado w desde v:\n  Si w = padre[v] → ignorar\n  Si w es ancestro → RETROCESO\n  No puede ser cruzado ni avance\n  (las aristas son bidireccionales)`}</p>
        </div>
        <P><strong>Si el grafo es conexo:</strong> DFS produce un único árbol abarcador.</P>
        <P><strong>Si no es conexo:</strong> DFS produce un bosque abarcador (un árbol por componente).</P>
      </div>}
      right={<div>
        <P><strong>Comparación BFS vs DFS en grafos no dirigidos:</strong></P>
        <CompTable headers={['','DFS','BFS']} rows={[
          ['Estructura','Recursión / pila','Cola FIFO'],
          ['Árbol resultante','Largo y profundo','Ancho y bajo (por niveles)'],
          ['Arcos no dirigidos','Árbol + retroceso','Árbol + entre niveles adyacentes'],
          ['Detecta ciclos','Sí (arco retroceso)','Sí (arco entre niveles)'],
          ['Encuentra camino mínimo','No','Sí (en aristas, sin pesos)'],
          ['Biconexidad / AP','DFS es base del algoritmo','No adecuado'],
          ['Complejidad','O(V+A)','O(V+A)'],
        ]} />
        <div style={{...grn, marginTop:12}}>
          <p style={{fontFamily:"'Lora',serif", fontWeight:700, fontSize:12.5, color:GRN, margin:'0 0 6px'}}>Implementación BFS en Java</p>
          <p style={{fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, color:TX, lineHeight:1.9, margin:0}}>{`void bfs(Map<V,List<V>> adj, V origen) {\n  Set<V> vis = new HashSet<>();\n  Queue<V> cola = new LinkedList<>();\n  cola.add(origen);\n  vis.add(origen);\n  while (!cola.isEmpty()) {\n    V x = cola.poll();\n    // procesar x\n    for (V y : adj.get(x))\n      if (!vis.contains(y)) {\n        vis.add(y);\n        cola.add(y);\n      }\n  }\n}`}</p>
        </div>
      </div>}
    />,

    // ── p53: RESUMEN GRAFOS NO DIRIGIDOS ─────────────────
    () => <TwoCol title="Grafos No Dirigidos" badge="RESUMEN Y COMPLEJIDADES" num={53}
      left={<div>
        <CompTable headers={['Algoritmo','Tiempo','Espacio','Para qué']} rows={[
          ['DFS / BFS (lista adj.)','O(V+A)','O(V)','Recorrido, conexidad'],
          ['DFS / BFS (matriz)','O(V²)','O(V)','Recorrido, conexidad'],
          ['Prim (básico)','O(V·E)','O(V)','AAM grafos densos'],
          ['Prim (heap)','O(E log V)','O(V)','AAM general'],
          ['Kruskal','O(E log E)','O(V)','AAM grafos dispersos'],
          ['Puntos articulación','O(V+A)','O(V)','Biconexidad, robustez'],
          ['Verificar árbol libre','O(V+A)','O(V)','|V|-1 aristas + conexo'],
        ]} />
        <div style={{...blue, marginTop:10}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, color:BL, lineHeight:1.8, margin:0}}>{`V = vértices  ·  A = aristas  ·  E = |A|\n\nGrafo disperso: E ≈ V  → lista + Kruskal\nGrafo denso:   E ≈ V² → matriz + Prim`}</p>
        </div>
      </div>}
      right={<div>
        <p style={{fontFamily:"'Lora',serif", fontWeight:700, fontSize:13, marginBottom:10}}>¿Cuándo usar qué?</p>
        {[
          [AC,     'Prim',               'Red de tendido eléctrico con muchos nodos densamente conectados'],
          [GRN,    'Kruskal',            'Red de carreteras dispersa, ordenar aristas es barato'],
          [BL,     'BFS',               'Encontrar el camino más corto (en aristas) entre dos nodos de red'],
          ['#555', 'DFS',               'Detectar ciclos, verificar conexidad, componentes biconexas'],
          [AC,     'Punt. articulación','Identificar servidores críticos en una red, puentes en infraestructura'],
          [GRN,    'Árbol libre',       'Modelar una red sin ciclos ni redundancias (árbol de rutas)'],
        ].map(([col, name, desc]) => (
          <div key={name} style={{display:'flex', gap:10, marginBottom:8, alignItems:'baseline'}}>
            <code style={{color:col, fontFamily:"'JetBrains Mono',monospace", fontSize:11, minWidth:145, flexShrink:0}}>{name}</code>
            <span style={{fontFamily:"'Lora',serif", color:'#555', fontSize:12.5, lineHeight:1.5}}>{desc}</span>
          </div>
        ))}
        <div style={{...box, marginTop:10}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace", fontSize:10.5, color:AC, lineHeight:1.9, margin:0}}>{`Representación en Java:\n  Map<V, List<Edge>> adj   // lista\n  int[][] matrix            // matriz\n\n// Arista no dirigida:\nclass Edge {\n  V to; int weight;\n}`}</p>
        </div>
      </div>}
    />,

  ];
}
