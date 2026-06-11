import { Splash, TwoCol, FullPg } from '../components/PageShells';
import CodeBlock from '../components/CodeBlock';
import CompTable from '../components/CompTable';
import { DijkstraViz, FloydViz, BPFViz, TopoViz } from '../components/GraphViz';
import { GraphSplashSVG } from '../components/SplashVisuals';
import { C, P, UL } from '../helpers';
import { AC, BL, BD, TX } from '../constants';
import { dijkstraVisual, pathVisual } from '../components/CodeVisuals';
import PseudoBlock from '../components/PseudoBlock';
import { dijkstraPseudoVisual, floydPseudoVisual, warshallVisual, bpfPseudoVisual, caminoPseudoVisual, topoPseudoVisual } from '../components/PseudoVisuals';

const pre = {
  fontFamily: "'JetBrains Mono',monospace",
  fontSize: 11,
  color: AC,
  lineHeight: 2,
  margin: '0 0 10px',
  padding: '8px 10px',
  background: '#f9f8f4',
  border: '1px solid #ddd',
  whiteSpace: 'pre',
  overflowX: 'auto',
};
const box  = { background: '#f9f8f4', border: '1px solid #ddd', padding: '8px 12px', marginBottom: 10 };
const red  = { background: '#ffeaed', border: `1px solid ${AC}`, padding: '8px 12px', marginBottom: 10 };
const blue = { background: '#e8f0fa', border: `1px solid ${BL}`, padding: '8px 12px', marginBottom: 10 };

export function pages() {
  return [

    // ── p29: SPLASH ──────────────────────────────────────
    () => <Splash number="5. GRAFOS DIRIGIDOS" title="Grafos Dirigidos" visual={<GraphSplashSVG />} />,

    // ── p30: DEFINICIÓN ──────────────────────────────────
    () => <TwoCol title="Grafos Dirigidos" badge="DEFINICION" num={30}
      left={<div>
        <P>Los <strong>grafos</strong> son modelos naturales para representar relaciones entre objetos de datos. Un grafo consiste de un conjunto finito de vértices V y un conjunto de arcos A:</P>
        <div style={{ ...box, textAlign: 'center' }}>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 18, color: AC, fontWeight: 700 }}>G = (V, A)</span>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#666', margin: '4px 0 0' }}>V = {'{'}v₁,v₂,...,vₙ{'}'} · A = {'{'}(vᵢ,vⱼ){'}'}</p>
        </div>
        <P>En un <strong>grafo dirigido</strong>, cada arco es un par ordenado (v, w): el nodo v es la <strong>cola</strong> y w es la <strong>cabeza</strong>. Se dice que w es adyacente a v.</P>
        <P>Si las aristas no son dirigidas, es decir (vᵢ,vⱼ) = (vⱼ,vᵢ), el grafo se llama <strong>no dirigido</strong>.</P>
        <P><strong>Propiedades:</strong></P>
        <UL items={[
          "Existe como máximo una arista conectando cualesquiera dos vértices",
          "Dos vértices son adyacentes si existe una arista que los conecta",
          "Un grafo está conectado si existe un camino entre cualquier par de vértices",
        ]} />
      </div>}
      right={<div>
        <P><strong>Camino:</strong> secuencia de vértices v₁,...,vₙ tal que (v₁,v₂),...,(vₙ₋₁,vₙ) son arcos. La <strong>longitud</strong> es el número de arcos.</P>
        <div style={box}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: AC, lineHeight: 1.9, margin: 0 }}>{`Camino simple: todos los vértices\n  (excepto quizás primero y último)\n  son DISTINTOS\n\nCiclo: camino simple de longitud ≥ 2\n  que empieza y termina en el mismo\n  vértice`}</p>
        </div>
        <P><strong>Ejemplos de uso:</strong></P>
        <UL items={[
          "Vértices = ciudades, arcos = distancias",
          "Vértices = materias, arcos = previaturas",
          "Vértices = estados de autómata, arcos = transiciones",
          "Vértices = bloques de programa, arcos = flujo de control",
        ]} />
      </div>}
    />,

    // ── p31: REPRESENTACIONES ────────────────────────────
    () => <TwoCol title="Grafos Dirigidos" badge="REPRESENTACIONES" num={31}
      left={<div>
        <P><strong>Matriz de adyacencias:</strong> matriz n×n donde A[i,j] contiene el peso del arco i→j (o ∞ si no existe). Espacio mínimo {C('O(n²)')}.</P>
        <div style={box}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#444', margin: 0, lineHeight: 1.9 }}>{`     V0  V1  V2  V3  V4  V5\nV0 [  —   2   —   1   —   — ]\nV1 [  —   —   —   3  10   — ]\nV2 [  4   —   —   —   —   5 ]\nV3 [  —   —   2   —   2   8 ]\nV4 [  —   —   —   —   —   — ]\nV5 [  —   —   —   —   —   — ]`}</p>
        </div>
        <P><strong>Lista de adyacencias:</strong> para cada vértice, lista de sus vecinos con pesos. Espacio {C('O(n + a)')} donde a = arcos. Preferible para grafos dispersos.</P>
        <div style={box}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: AC, margin: 0, lineHeight: 1.9 }}>{`V0 → 1(2) → 3(1)\nV1 → 4(10) → 3(3)\nV2 → 0(4) → 5(5)\nV3 → 4(2) → 6(4) → 5(8) → 2(2)\nV4 → 6(6)`}</p>
        </div>
      </div>}
      right={<div>
        <CompTable
          headers={['Representación', 'Espacio', 'Verificar arco', 'Iterar vecinos']}
          rows={[
            ['Matriz de adyacencias', 'O(n²)', 'O(1)', 'O(n)'],
            ['Lista de adyacencias', 'O(n+a)', 'O(grado)', 'O(grado)'],
          ]}
        />
        <p style={{ fontFamily: "'Lora',serif", fontSize: 12, color: '#555', marginTop: 10, fontStyle: 'italic' }}>
          Usar <strong>matriz</strong> cuando el grafo es denso o se necesita verificar arcos en O(1). Usar <strong>lista</strong> cuando el grafo es disperso o se itera frecuentemente sobre vecinos.
        </p>
        <div style={{ ...red, marginTop: 14 }}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: AC, lineHeight: 1.8, margin: 0 }}>{`TDA Grafo — operaciones:\n  camino(u, v)\n  caminosMinimos(origen)\n  todosLosCaminosMinimos()\n  centroYExcentricidad()\n  cerraduraTransitiva()\n  bpf()  /  bfa()\n  clasificacionTopologica()`}</p>
        </div>
      </div>}
    />,

    // ── p32: DIJKSTRA ────────────────────────────────────
    () => <TwoCol title="Grafos Dirigidos" badge="DIJKSTRA — CAMINOS MINIMOS" num={32}
      left={<div>
        <P>Dado G=(V,A) con pesos <strong>no negativos</strong> y un vértice origen, determina el costo del camino más corto desde el origen a cada vértice. Técnica <strong>ávida (greedy)</strong>.</P>
        <div style={box}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: AC, lineHeight: 1.8, margin: 0 }}>{`S  → vértices con distancia conocida\n     (inicia con {origen})\nD  → vector de costos mínimos\nP  → vector de predecesores`}</p>
        </div>
        <PseudoBlock label="dijkstra(origen, costo, V)" lines={[
          "dijkstra(origen, costo, V)",
          "  S ← {origen}",
          "  Para todo i en V hacer",
          "    D[i] ← costo(origen, i)",
          "    P[i] ← origen",
          "  FinPara",
          "  Mientras V ≠ S hacer",
          "    Elegir w ∈ V-S: D[w] mínimo",
          "    Agregar w a S",
          "    Para todo v en V-S hacer",
          "      Si D[w]+costo(w,v) < D[v]",
          "        D[v] ← D[w]+costo(w,v)",
          "        P[v] ← w",
          "      FinSi",
          "    FinPara",
          "  FinMientras",
        ]} steps={[[0],[1],[2,3,4,5],[6],[7,8],[9,10,11,12,13,14],[15]]}
           visual={(step) => dijkstraPseudoVisual(step)} />
        <p style={{ fontFamily: "'Lora',serif", fontSize: 12, color: '#555', fontStyle: 'italic' }}>
          Recuperar camino al destino t: seguir P[t] → P[P[t]] → ... → origen (orden inverso).
        </p>
      </div>}
      right={<DijkstraViz />}
    />,

    // ── p33: DIJKSTRA TRAZA ──────────────────────────────
    () => <TwoCol title="Grafos Dirigidos" badge="DIJKSTRA — TRAZA Y RECUPERACION" num={33}
      left={<div>
        <P>Grafo de 5 vértices. Arcos: 1→2(10), 1→4(30), 1→5(100), 2→3(50), 3→5(10), 4→3(20), 4→5(60).</P>
        <div style={{ overflowX: 'auto', marginBottom: 10 }}>
          <table style={{ borderCollapse: 'collapse', fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, width: '100%' }}>
            <thead>
              <tr>
                {['Iter','S','w','D[2]','D[3]','D[4]','D[5]'].map(h =>
                  <th key={h} style={{ border: '1.5px solid #1e1e1e', padding: '4px 8px', background: '#1e1e1e', color: '#fff', fontSize: 10, textAlign: 'left' }}>{h}</th>
                )}
              </tr>
            </thead>
            <tbody>
              {[
                ['init','{1}','—','10','∞','30','100'],
                ['1','{1,2}','2','10','60','30','100'],
                ['2','{1,2,4}','4','10','50','30','90'],
                ['3','{1,2,4,3}','3','10','50','30','60'],
                ['4','{1,2,4,3,5}','5','10','50','30','60'],
              ].map((row, i) => (
                <tr key={i} style={{ background: i % 2 === 0 ? '#f0f0ec' : '#fff' }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ border: '1px solid #ccc', padding: '4px 8px', color: j === 2 ? AC : '#555', fontWeight: j === 2 ? 700 : 400 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={red}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: AC, lineHeight: 1.8, margin: 0 }}>{`Vector P final:\nP[2]=1  P[3]=4  P[4]=1  P[5]=3\n\nCamino 1→5:\n  5 ← P[5]=3 ← P[3]=4 ← P[4]=1\n  → 1, 4, 3, 5  (costo: 60)`}</p>
        </div>
        <CompTable headers={['Implementación', 'Complejidad']} rows={[
          ['Matriz de adyacencias', 'O(n²)'],
          ['Con heap binario', 'O((n+a) log n)'],
        ]} />
      </div>}
      right={<CodeBlock label="Dijkstra en Java" lines={[
        "void dijkstra(int origen, int[][] c, int n) {",
        "    boolean[] S = new boolean[n+1];",
        "    int[] D = new int[n+1];",
        "    int[] P = new int[n+1];",
        "    Arrays.fill(D, Integer.MAX_VALUE/2);",
        "    D[origen] = 0;",
        "    Arrays.fill(P, origen);",
        "",
        "    for (int iter = 0; iter < n; iter++) {",
        "        // elegir w en V-S con D[w] minimo",
        "        int w = -1;",
        "        for (int v=1; v<=n; v++)",
        "            if (!S[v] && (w==-1 || D[v]<D[w]))",
        "                w = v;",
        "        S[w] = true;",
        "",
        "        for (int v=1; v<=n; v++) {",
        "            if (!S[v] && c[w][v] < INF) {",
        "                int nd = D[w] + c[w][v];",
        "                if (nd < D[v]) {",
        "                    D[v] = nd;",
        "                    P[v] = w;",
        "                }",
        "            }",
        "        }",
        "    }",
        "}",
      ]} steps={[[0],[1,2,3],[4,5,6],[8],[9,10,11,12,13,14],[16,17,18,19,20,21,22,23,24],[25,26]]}
         visual={(step) => dijkstraVisual(step)} />}
    />,

    // ── p34: FLOYD ───────────────────────────────────────
    () => <TwoCol title="Grafos Dirigidos" badge="FLOYD — TODOS LOS PARES" num={34}
      left={<div>
        <P>Resuelve el problema de <strong>caminos mínimos entre todos los pares</strong>: obtiene la tabla completa de distancias. Más directo que aplicar Dijkstra n veces.</P>
        <div style={{ ...box, textAlign: 'center' }}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: AC, fontWeight: 700, margin: '0 0 4px' }}>Aₖ[i,j] = min( Aₖ₋₁[i,j] , Aₖ₋₁[i,k] + Aₖ₋₁[k,j] )</p>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#888', margin: 0 }}>¿Mejor camino directo o pasar por el vértice k?</p>
        </div>
        <PseudoBlock label="floyd — todos los pares" lines={[
          "// Inicialización",
          "Para todo i=1..n hacer",
          "  Para todo j=1..n hacer",
          "    A[i,j] ← C[i,j]",
          "    P[i,j] ← 0",
          "  FinPara;  A[i,i] ← 0",
          "FinPara",
          "",
          "// Iteración principal",
          "Para todo k=1..n hacer",
          "  Para todo i=1..n hacer",
          "    Para todo j=1..n hacer",
          "      Si A[i,k]+A[k,j] < A[i,j]",
          "        A[i,j] ← A[i,k]+A[k,j]",
          "        P[i,j] ← k",
          "      FinSi",
          "    FinPara",
          "  FinPara",
          "FinPara",
        ]} steps={[[0,1,2,3,4,5,6],[8,9],[10],[11],[12],[13,14],[15,16,17,18]]}
           visual={(step) => floydPseudoVisual(step)} />
        <PseudoBlock label="camino(i, j) — recuperar con P" lines={[
          "// Recuperar camino i→j:",
          "camino(i, j)",
          "  k ← P[i,j]",
          "  Si k == 0 → salir  // directo",
          "  camino(i, k)",
          "  imprimir(k)",
          "  camino(k, j)",
          "fin",
        ]} steps={[[0,1],[2],[3],[4],[5],[6],[7]]}
           visual={(step) => floydPseudoVisual(Math.min(step+4,7))} />
      </div>}
      right={<FloydViz />}
    />,

    // ── p35: EXCENTRICIDAD Y WARSHALL ────────────────────
    () => <TwoCol title="Grafos Dirigidos" badge="EXCENTRICIDAD, CENTRO Y WARSHALL" num={35}
      left={<div>
        <P>La <strong>excentricidad</strong> de un nodo v es la máxima de las distancias mínimas desde todos los demás nodos hacia v:</P>
        <div style={{ ...box, textAlign: 'center' }}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: AC, fontWeight: 700, margin: 0 }}>{"e(v) = max{ d(u,v) }  ∀u ∈ V"}</p>
        </div>
        <P>El <strong>centro de G</strong> es el vértice con mínima excentricidad. Para hallarlo: aplicar Floyd, hallar el máximo de cada columna i (= excentricidad de i), luego el mínimo entre ellas.</P>
        <div style={{ overflowX: 'auto', marginBottom: 10 }}>
          <table style={{ borderCollapse: 'collapse', fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, width: '100%' }}>
            <thead>
              <tr>{['Nodo','Distancias hacia los demás','e(v)'].map(h =>
                <th key={h} style={{ border: '1.5px solid #1e1e1e', padding: '3px 8px', background: '#1e1e1e', color: '#fff', fontSize: 10 }}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ['A','0, 3, 1, 4, 2','9'],
                ['B','6, 0, 7, 10, 3','7'],
                ['C','4, 2, 0, 8, 1','7'],
                ['D','9, 7, 5, 0, 6','10'],
                ['E','3, 6, 4, 7, 0','6 ← CENTRO'],
              ].map(([n,d,e],i) => (
                <tr key={i} style={{ background: i===4?'#ffeaed':i%2===0?'#f0f0ec':'#fff' }}>
                  <td style={{ border:'1px solid #ccc',padding:'3px 8px',color:AC,fontWeight:700 }}>{n}</td>
                  <td style={{ border:'1px solid #ccc',padding:'3px 8px',color:'#555' }}>{d}</td>
                  <td style={{ border:'1px solid #ccc',padding:'3px 8px',color:i===4?AC:'#555',fontWeight:i===4?700:400 }}>{e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>}
      right={<div>
        <div style={red}>
          <p style={{ fontFamily: "'Lora',serif", fontWeight: 700, fontSize: 12.5, margin: '0 0 6px' }}>Cerradura Transitiva — Warshall</p>
          <p style={{ fontFamily: "'Lora',serif", fontSize: 12, color: TX, lineHeight: 1.7, margin: '0 0 8px' }}>
            Cuando solo importa saber <strong>si existe</strong> un camino entre cada par, sin calcular costos. Warshall es Floyd aplicado a booleanos:
          </p>
          <pre style={{ ...pre, margin: 0, fontSize: 10 }}>{`// C[i,j]=true si existe arco i→j\nPara todo i=1..n hacer\n  Para todo j=1..n hacer\n    A[i,j] ← C[i,j]\n  FinPara\n  A[i,i] ← 0\nFinPara\n\nPara todo k=1..n hacer\n  Para todo i=1..n hacer\n    Para todo j=1..n hacer\n      Si A[i,j] = false entonces\n        A[i,j] ← A[i,k] AND A[k,j]\n      FinSi\n    FinPara\n  FinPara\nFinPara`}</pre>
        </div>
        <CompTable headers={['Algoritmo', 'Tiempo', 'Para qué']} rows={[
          ['Dijkstra (1 origen)', 'O(n²)', 'Caminos desde un origen'],
          ['Floyd (todos pares)', 'O(n³)', 'Tabla completa + centro'],
          ['Warshall', 'O(n³)', 'Solo existencia de camino'],
        ]} />
      </div>}
    />,

    // ── p36: BPF ─────────────────────────────────────────
    () => <TwoCol title="Grafos Dirigidos" badge="BUSQUEDA EN PROFUNDIDAD (BPF / DFS)" num={36}
      left={<div>
        <P>La <strong>BPF (DFS)</strong> visita sistemáticamente todos los vértices del grafo. Generalización del recorrido en preorden de árboles. Complejidad: {C('O(a)')} con listas de adyacencia.</P>
        <PseudoBlock label="bpf(vértice, visitados)" lines={[
          "bpf(vértice, visitados)",
          "  Si vértice en visitados → salir",
          "  Sino",
          "    agregar vértice a visitados",
          "    // procesar vértice",
          "    Para cada w adyacente:",
          "      bpf(w, visitados)",
          "    FinPara",
          "  FinSi",
          "Fin",
          "",
          "// Llamada principal:",
          "Para cada v en V hacer",
          "  bpf(v, visitados)",
          "FinPara",
        ]} steps={[[0],[1,2],[3,4],[5,6],[7,8,9],[11,12,13,14]]}
           visual={(step) => bpfPseudoVisual(step)} />
        <div style={box}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: AC, lineHeight: 1.9, margin: 0 }}>{`Tiempo con lista de adyacencias:\n  O(a) — cada arco examinado una vez\n\nTiempo con matriz:\n  O(n²) — se revisan todas las celdas`}</p>
        </div>
        <P>Los arcos que llevan a vértices nuevos forman el <strong>bosque abarcador en profundidad</strong>.</P>
      </div>}
      right={<BPFViz />}
    />,

    // ── p37: TIPOS DE ARCOS ──────────────────────────────
    () => <TwoCol title="Grafos Dirigidos" badge="TIPOS DE ARCOS EN BPF" num={37}
      left={<div>
        <P>Al numerar los vértices en el orden de descubrimiento (Num(v)), cada arco (v→w) se clasifica en uno de cuatro tipos:</P>
        {[
          ['🌲 Arco de árbol', AC, 'Va a un vértice nuevo no visitado. Forma el bosque abarcador en profundidad.'],
          ['↩ Arco de retroceso', '#c0392b', 'Va de v a un ANCESTRO de v en el árbol. Indica un ciclo en el grafo.'],
          ['↘ Arco de avance', '#27ae60', 'Va de v a un DESCENDIENTE propio ya visitado. Num(v) < Num(w).'],
          ['↔ Arco cruzado', BL, 'Va a un vértice que NO es ni ancestro ni descendiente. Num(w) < Num(v) pero w no es ancestro.'],
        ].map(([title, color, desc]) => (
          <div key={title} style={{ border: `1.5px solid ${color}`, padding: '7px 11px', marginBottom: 8, background: '#fff' }}>
            <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color, fontWeight: 700, margin: '0 0 3px' }}>{title}</p>
            <p style={{ fontFamily: "'Lora',serif", fontSize: 12.5, color: TX, margin: 0, lineHeight: 1.6 }}>{desc}</p>
          </div>
        ))}
        <div style={box}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: AC, lineHeight: 1.9, margin: 0 }}>{`w es DESCENDIENTE de v ↔\nNum(v) < Num(w) ≤ Num(v) + cant.desc(v)`}</p>
        </div>
      </div>}
      right={<div>
        <div style={{ ...red, marginBottom: 14 }}>
          <p style={{ fontFamily: "'Lora',serif", fontWeight: 700, fontSize: 13, margin: '0 0 6px' }}>⚠ Prueba de Aciclidad</p>
          <p style={{ fontFamily: "'Lora',serif", fontSize: 12.5, color: TX, lineHeight: 1.7, margin: 0 }}>
            Un grafo dirigido es <strong>acíclico (GDA)</strong> si y solo si la BPF <strong>no encuentra ningún arco de retroceso</strong>. Cada arco de retroceso corresponde exactamente a un ciclo.
          </p>
        </div>
        <P><strong>Grafos Dirigidos Acíclicos (GDA / DAG):</strong></P>
        <UL items={[
          "Más generales que árboles, menos que grafos arbitrarios",
          "Útiles para expresiones aritméticas con subexpresiones comunes",
          "Apropiados para representar órdenes parciales",
          "Ejemplo: ((a+b)*c + ((a+b)+e)*(e+f)) * ((a+b)*c)",
        ]} />
        <div style={box}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#444', lineHeight: 1.9, margin: 0 }}>{`Al explorar arco v→w durante BPF:\n\nw NO visitado       → árbol\nw en pila actual    → retroceso (ciclo)\nw visitado, desc.   → avance\nw visitado, no desc → cruzado`}</p>
        </div>
      </div>}
    />,

    // ── p38: OBTENCIÓN DE CAMINOS ────────────────────────
    () => <TwoCol title="Grafos Dirigidos" badge="OBTENCION DE CAMINOS" num={38}
      left={<div>
        <P>La BPF es la base para encontrar caminos. "ElCamino" es una colección <strong>LIFO</strong> con los vértices pendientes en la recursión actual.</P>
        <PseudoBlock label="método Camino(Destino, ElCamino)" lines={[
          "// Método de TVertice",
          "método Camino(Destino, ElCamino)",
          "  Visitar(); Agregar(this, ElCamino)",
          "  Para cada w adyacente:",
          "    Si w == Destino entonces",
          "      Guardar(ElCamino + Destino)",
          "    Sino",
          "      Si no(visitado(w)) entonces",
          "        w.Camino(Destino, ElCamino)",
          "      FinSi",
          "    FinSi",
          "  FinPara",
          "  Quitar(this, ElCamino)  // backtrack",
          "FIN",
        ]} steps={[[0,1],[2],[3,4],[5],[6,7],[8],[9,10],[11],[12],[13]]}
           visual={(step) => caminoPseudoVisual(step)} />
        <PseudoBlock label="obtenerCaminoAux — versión funcional" lines={[
          "obtenerCamino(origen, destino):",
          "  vis ← conjunto vacío",
          "  stk ← stack de nodos",
          "  devolver aux(origen, destino, vis, stk)",
          "",
          "aux(nodo, dest, vis, stk):",
          "  Si nodo en vis → devolver nulo",
          "  Si nodo == dest → devolver copia(stk)",
          "  vis.add(nodo); stk.push(nodo)",
          "  Para cada w adyacente:",
          "    r ← aux(w, dest, vis, stk)",
          "    Si r ≠ nulo → devolver r",
          "  FinPara",
          "  vis.remove(nodo); stk.pop()",
          "  devolver nulo",
        ]} steps={[[0,1,2,3],[5,6],[7],[8],[9,10,11],[12],[13,14]]}
           visual={(step) => caminoPseudoVisual(step)} />
      </div>}
      right={<div>
        <div style={{ ...blue, marginBottom: 14 }}>
          <p style={{ fontFamily: "'Lora',serif", fontWeight: 700, fontSize: 13, color: BL, margin: '0 0 6px' }}>Un camino vs. Todos los caminos</p>
          <p style={{ fontFamily: "'Lora',serif", fontSize: 12.5, color: TX, lineHeight: 1.7, margin: 0 }}>
            Para encontrar <strong>todos los caminos</strong>: al hacer backtrack, quitar el nodo también del conjunto <em>visitados</em> (no solo del stack). Esto permite que sea explorado por rutas alternativas.
          </p>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: BL, margin: '8px 0 0' }}>Clave: "estar en el camino actual" ≠ "haber sido visitado alguna vez"</p>
        </div>
        <CodeBlock label="Obtener camino (Java)" lines={[
          "List<V> getCamino(V origen, V dest) {",
          "    Set<V> vis = new HashSet<>();",
          "    Deque<V> stk = new ArrayDeque<>();",
          "    return aux(origen, dest, vis, stk);",
          "}",
          "",
          "List<V> aux(V n,V d,Set<V> vis,Deque<V> stk){",
          "    if (vis.contains(n)) return null;",
          "    if (n.equals(d))",
          "        return new ArrayList<>(stk);",
          "    vis.add(n); stk.push(n);",
          "    for (V w : adj(n)) {",
          "        List<V> r = aux(w,d,vis,stk);",
          "        if (r != null) return r;",
          "    }",
          "    vis.remove(n); stk.pop();",
          "    return null;",
          "}",
        ]} steps={[[0],[1,2,3,4],[6],[7],[8,9],[10],[11,12,13,14],[15,16,17]]}
         visual={(step) => pathVisual(step)} />
      </div>}
    />,

    // ── p39: CLASIFICACIÓN TOPOLÓGICA ────────────────────
    () => <TwoCol title="Grafos Dirigidos" badge="CLASIFICACION TOPOLOGICA" num={39}
      left={<div>
        <P>Asigna un <strong>orden lineal</strong> a los vértices de un GDA tal que, si existe arco de i a j, entonces i aparece antes que j. Representa un "orden parcial" de las tareas.</P>
        <P><strong>Aplicaciones:</strong> previaturas de cursos, tareas de proyecto con dependencias, compiladores (análisis de dependencias).</P>
        <P>BPF con <strong>procesamiento en la salida recursiva</strong> (post-orden): el nodo se agrega al inicio de la lista cuando terminan de visitarse todos sus descendientes.</P>
        <PseudoBlock label="clasificacionTopologica" lines={[
          "clasificTopAux(nodo, vis, lista):",
          "  Si nodo NO en vis entonces",
          "    vis.agregar(nodo)",
          "    Para cada w adyacente:",
          "      clasificTopAux(w, vis, lista)",
          "    FinPara",
          "    // POST-ORDEN: agregar al PRINCIPIO",
          "    lista.agregarAlPrincipio(nodo)",
          "  FinSi",
          "",
          "clasificTopologica():",
          "  vis        ← conjunto vacío",
          "  listaNodos ← []",
          "  Para cada v en el grafo:",
          "    clasificTopAux(v, vis, listaNodos)",
          "  devolver listaNodos",
        ]} steps={[[0],[1,2],[3,4],[5],[6,7],[8,9],[10,11,12],[13,14],[15]]}
           visual={(step) => topoPseudoVisual(step)} />
        <p style={{ fontFamily: "'Lora',serif", fontSize: 11.5, color: '#555', fontStyle: 'italic' }}>
          Complejidad: <strong>O(n + a)</strong> — igual que la BPF misma.
        </p>
      </div>}
      right={<TopoViz />}
    />,

    // ── p40: RESUMEN ─────────────────────────────────────
    () => <TwoCol title="Grafos Dirigidos" badge="RESUMEN Y COMPLEJIDADES" num={40}
      left={<div>
        <CompTable
          headers={['Algoritmo', 'Tiempo', 'Espacio', 'Requisito']}
          rows={[
            ['Dijkstra (matriz)', 'O(n²)', 'O(n)', 'Pesos ≥ 0'],
            ['Dijkstra (heap)', 'O((n+a)logn)', 'O(n)', 'Pesos ≥ 0'],
            ['Floyd (todos pares)', 'O(n³)', 'O(n²)', 'Sin ciclos neg.'],
            ['Warshall (bool)', 'O(n³)', 'O(n²)', 'Solo existencia'],
            ['BPF con lista adj.', 'O(n+a)', 'O(n)', '—'],
            ['BPF con matriz', 'O(n²)', 'O(n)', '—'],
            ['Clasificación topo.', 'O(n+a)', 'O(n)', 'Solo GDA'],
          ]}
        />
        <div style={{ ...blue, marginTop: 12 }}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: BL, lineHeight: 1.8, margin: 0 }}>{`n = vértices  ·  a = arcos\n\nGrafo disperso: a ≈ n  → lista mejor\nGrafo denso:   a ≈ n² → matriz mejor`}</p>
        </div>
      </div>}
      right={<div>
        <p style={{ fontFamily: "'Lora',serif", fontWeight: 700, fontSize: 13, marginBottom: 10 }}>¿Cuándo usar qué?</p>
        {[
          ['Dijkstra', 'caminos mínimos desde un punto (GPS, redes)'],
          ['Floyd', 'tabla completa de distancias + centro del grafo'],
          ['Warshall', 'solo saber si existe camino entre cada par'],
          ['BPF', 'detectar ciclos, clasificar arcos, componentes'],
          ['Orden topológico', 'scheduling, previaturas, compiladores'],
          ['GDA', 'expresiones aritméticas, dependencias sin ciclos'],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'baseline' }}>
            <code style={{ color: AC, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, minWidth: 130, flexShrink: 0 }}>{k}</code>
            <span style={{ fontFamily: "'Lora',serif", color: '#555', fontSize: 12.5, lineHeight: 1.5 }}>{v}</span>
          </div>
        ))}
        <div style={{ ...box, marginTop: 12 }}>
          <p style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, color: AC, lineHeight: 1.9, margin: 0 }}>{`Representación en Java:\n  Map<V, List<V>> adjList   // lista\n  int[][] adjMatrix          // matriz\n  Map<V, Map<V,Integer>> w  // pesos`}</p>
        </div>
      </div>}
    />,

  ];
}

// ─── FLOYD/WARSHALL EXTENDED PAGES ───────────────────────────────────────────
// These are exported separately and merged in App.jsx after the base pages

export function floydPages() {
  const AC_C = '#e84055';
  const BL_C = '#3a72b8';
  const TX_C = '#111';
  const pre = {
    fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: AC_C,
    lineHeight: 2, margin: '0 0 10px', padding: '8px 10px',
    background: '#f9f8f4', border: '1px solid #ddd', whiteSpace: 'pre', overflowX: 'auto',
  };
  const box  = { background: '#f9f8f4', border: '1px solid #ddd', padding: '8px 12px', marginBottom: 10 };
  const red  = { background: '#ffeaed', border: `1px solid ${AC_C}`, padding: '8px 12px', marginBottom: 10 };
  const grn  = { background: '#edfdf5', border: '1px solid #27ae60', padding: '8px 12px', marginBottom: 10 };
  const blue = { background: '#e8f0fa', border: `1px solid ${BL_C}`, padding: '8px 12px', marginBottom: 10 };

  // Shared mini-matrix renderer
  function MiniMatrix({ A, changed, label, prev }) {
    const INF = '∞';
    const labs = ['1','2','3'];
    const isC = (i,j) => changed && changed.some(c=>c[0]===i&&c[1]===j);
    return (
      <div style={{display:'inline-block',marginRight:16,verticalAlign:'top'}}>
        {label && <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#888',marginBottom:3,letterSpacing:0.5}}>{label}</div>}
        <table style={{borderCollapse:'collapse'}}>
          <thead><tr>
            <td style={{width:18}}/>
            {labs.map(l=><th key={l} style={{width:38,fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#888',textAlign:'center',border:'1px solid #ddd',padding:'2px 0',background:'#f0f0ec'}}>{l}</th>)}
          </tr></thead>
          <tbody>
            {A.map((row,i)=>(
              <tr key={i}>
                <td style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#888',textAlign:'right',paddingRight:3}}>{labs[i]}</td>
                {row.map((v,j)=>{
                  const ch=isC(i,j), diag=i===j;
                  return <td key={j} style={{border:'1px solid #ccc',width:38,height:28,textAlign:'center',fontFamily:"'JetBrains Mono',monospace",fontSize:12,background:diag?'#f0f0ec':ch?'#ffeaed':'#fff',color:diag?'#aaa':ch?AC_C:TX_C,fontWeight:ch?700:400,padding:0}}>{String(v)}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  const INF = '∞';
  const A0 = [[0,8,5],[3,0,INF],[INF,2,0]];
  const A1 = [[0,8,5],[3,0,8],[INF,2,0]];
  const A2 = [[0,8,5],[3,0,8],[5,2,0]];
  const A3 = [[0,7,5],[3,0,8],[5,2,0]];

  return [

    // ── p41: FLOYD — EJEMPLO COMPLETO (grafo + inicialización) ──
    () => <TwoCol title="Grafos Dirigidos" badge="FLOYD — EJEMPLO PASO A PASO" num={41}
      left={<div>
        <P>Grafo de 3 vértices del ejemplo de clase. Arcos con sus costos:</P>
        <div style={box}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:AC_C,lineHeight:1.9,margin:0}}>{`1 → 2 = 8\n2 → 1 = 3\n3 → 2 = 2\n1 → 3 = 5`}</p>
        </div>
        <P><strong>Paso 1 — Inicializar A = C</strong> y forzar diagonal a 0:</P>
        <div style={{marginBottom:10}}><MiniMatrix A={A0} changed={[]} label="A inicial = C"/></div>
        <div style={blue}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:BL_C,lineHeight:1.8,margin:0}}>{`A[1,2] = 8   (arco directo 1→2)\nA[2,3] = ∞   (no hay arco directo 2→3)\nA[3,1] = ∞   (no hay arco directo 3→1)\nA[i,i] = 0   (quedarse en mismo nodo)`}</p>
        </div>
        <P>A partir de acá se prueban intermediarios k = 1, 2 y 3.</P>
        <PseudoBlock label="Idea Floyd" lines={[
          "// Pregunta en cada iteración k:",
          "// ¿conviene ir i → k → j",
          "//   en vez de ir i → j directamente?",
          "",
          "Si A[i,k]+A[k,j] < A[i,j]:",
          "  A[i,j] ← A[i,k]+A[k,j]",
          "  P[i,j] ← k",
        ]} steps={[[0,1,2],[4],[5,6]]}
           visual={(step) => floydPseudoVisual(step+1)} />
      </div>}
      right={<div>
        <P><strong>Algoritmo completo con recuperación de caminos:</strong></P>
        <PseudoBlock label="floyd con recuperación de caminos" lines={[
          "// A y C: matrices N×N de costos",
          "Para todo i=1..n hacer",
          "  Para todo j=1..n hacer",
          "    A[i,j] ← C[i,j]",
          "    P[i,j] ← 0",
          "  FinPara",
          "  A[i,i] ← 0",
          "FinPara",
          "",
          "Para todo k=1..n hacer",
          "  Para todo i=1..n hacer",
          "    Para todo j=1..n hacer",
          "      Si A[i,k]+A[k,j] < A[i,j]",
          "        A[i,j] ← A[i,k]+A[k,j]",
          "        P[i,j] ← k",
          "      FinSi",
          "    FinPara",
          "  FinPara",
          "FinPara",
        ]} steps={[[0,1,2,3,4,5,6,7],[9],[10],[11],[12],[13,14],[15,16,17,18]]}
           visual={(step) => floydPseudoVisual(step)} />
        <div style={red}>
          <p style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:12.5,margin:'0 0 6px'}}>Interpretación de P[i,j]</p>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:TX_C,lineHeight:1.8,margin:0}}>{`P[i,j] = 0  → camino directo i→j\nP[i,j] = k  → el camino óptimo pasa\n               por el vértice k\n\nRecuperar camino i→j:\n  camino(i, j)\n    k ← P[i,j]\n    Si k == 0 → salir (directo)\n    camino(i, k)\n    imprimir(k)\n    camino(k, j)\n  fin`}</p>
        </div>
      </div>}
    />,

    // ── p42: FLOYD — ITERACIONES k=1, k=2, k=3 ──────────
    () => <TwoCol title="Grafos Dirigidos" badge="FLOYD — ITERACIONES K=1, K=2, K=3" num={42}
      left={<div>
        <P><strong>k = 1</strong> — vértice 1 como intermediario: ¿conviene pasar por 1?</P>
        <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:6}}>
          <MiniMatrix A={A0} changed={[]} label="antes k=1"/>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,color:'#aaa'}}>→</span>
          <MiniMatrix A={A1} changed={[[1,2]]} label="después k=1"/>
        </div>
        <div style={grn}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:'#27ae60',lineHeight:1.8,margin:0}}>{`A[2,3]: min(∞, A[2,1]+A[1,3])\n       = min(∞, 3+5) = 8  ✓\nNuevo camino: 2 → 1 → 3, costo 8`}</p>
        </div>
        <P><strong>k = 2</strong> — vértice 2 como intermediario: ¿conviene pasar por 2?</P>
        <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:6}}>
          <MiniMatrix A={A1} changed={[]} label="antes k=2"/>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,color:'#aaa'}}>→</span>
          <MiniMatrix A={A2} changed={[[2,0]]} label="después k=2"/>
        </div>
        <div style={grn}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:'#27ae60',lineHeight:1.8,margin:0}}>{`A[3,1]: min(∞, A[3,2]+A[2,1])\n       = min(∞, 2+3) = 5  ✓\nNuevo camino: 3 → 2 → 1, costo 5`}</p>
        </div>
      </div>}
      right={<div>
        <P><strong>k = 3</strong> — vértice 3 como intermediario: ¿conviene pasar por 3?</P>
        <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:6}}>
          <MiniMatrix A={A2} changed={[]} label="antes k=3"/>
          <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:18,color:'#aaa'}}>→</span>
          <MiniMatrix A={A3} changed={[[0,1]]} label="después k=3 (final)"/>
        </div>
        <div style={grn}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:'#27ae60',lineHeight:1.8,margin:0}}>{`A[1,2]: min(8, A[1,3]+A[3,2])\n       = min(8, 5+2) = 7  ✓\nMejora: 1→3→2 (7) < 1→2 directo (8)`}</p>
        </div>
        <P><strong>Matriz A final</strong> — distancias mínimas entre todos los pares:</P>
        <MiniMatrix A={A3} changed={[]} label="A final"/>
        <div style={{...red,marginTop:10}}>
          <p style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:12.5,margin:'0 0 6px'}}>Observación clave</p>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:TX_C,lineHeight:1.8,margin:0}}>{`A[1,2] = 7, NO 8 (el arco directo).\nEl camino 1→3→2 es más barato.\n\nDesde 1: a 2 cuesta 7, a 3 cuesta 5\nDesde 2: a 1 cuesta 3, a 3 cuesta 8\nDesde 3: a 1 cuesta 5, a 2 cuesta 2`}</p>
        </div>
        <P><strong>Matriz P final</strong> — intermediarios usados:</P>
        <div style={box}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:AC_C,lineHeight:1.9,margin:0}}>{`P[1,2]=3 → camino 1→3→2\nP[2,3]=1 → camino 2→1→3\nP[3,1]=2 → camino 3→2→1\nP[i,j]=0 → camino directo`}</p>
        </div>
      </div>}
    />,

    // ── p43: WARSHALL — CERRADURA TRANSITIVA ─────────────
    () => <TwoCol title="Grafos Dirigidos" badge="WARSHALL — CERRADURA TRANSITIVA" num={43}
      left={<div>
        <P>Cuando solo interesa saber <strong>si existe</strong> un camino de i a j — sin calcular el costo — se usa Warshall. La matriz A es <strong>booleana</strong>: A[i,j]=true si hay algún camino de i a j.</P>
        <P>Es exactamente Floyd aplicado con lógica booleana: en vez de <code style={{color:AC_C,fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>min(suma)</code> se usa <code style={{color:AC_C,fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>OR(AND)</code>.</P>
        <PseudoBlock label="Warshall — cerradura transitiva" lines={[
          "procedure Warshall(C: bool[n,n])",
          "  Para todo i=1..n hacer",
          "    Para todo j=1..n hacer",
          "      A[i,j] ← C[i,j]",
          "    FinPara",
          "    A[i,i] ← 0",
          "  FinPara",
          "",
          "  Para todo k=1..n hacer",
          "    Para todo i=1..n hacer",
          "      Para todo j=1..n hacer",
          "        Si A[i,j] = false entonces",
          "          A[i,j] ← A[i,k] AND A[k,j]",
          "        FinSi",
          "      FinPara",
          "    FinPara",
          "  FinPara",
          "fin",
        ]} steps={[[0,1,2,3,4,5,6],[8,9],[10],[11],[12],[13,14,15,16,17]]}
           visual={(step) => warshallVisual(step)} />
        <div style={blue}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:BL_C,lineHeight:1.8,margin:0}}>{`Complejidad: O(n³) tiempo, O(n²) espacio\n\nOptimización: usar bitsets (arrays de ints\ncomo bitmasks) → 64x más rápido en\nmáquinas de 64 bits.`}</p>
        </div>
      </div>}
      right={<div>
        <P><strong>Ejemplo — mismo grafo (1→2, 2→1, 3→2, 1→3):</strong></P>
        <P>Matriz C de adyacencia (booleana):</P>
        <div style={{overflowX:'auto',marginBottom:10}}>
          <table style={{borderCollapse:'collapse',fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>
            <thead><tr>
              <th style={{border:'1.5px solid #1e1e1e',padding:'3px 10px',background:'#1e1e1e',color:'#fff',fontSize:10}}></th>
              {['1','2','3'].map(h=><th key={h} style={{border:'1.5px solid #1e1e1e',padding:'3px 10px',background:'#1e1e1e',color:'#fff',fontSize:10}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {[['1','0','1','1'],['2','1','0','0'],['3','0','1','0']].map((row,i)=>(
                <tr key={i} style={{background:i%2===0?'#f0f0ec':'#fff'}}>
                  {row.map((cell,j)=>(
                    <td key={j} style={{border:'1px solid #ccc',padding:'4px 10px',color:j===0?TX_C:cell==='1'?AC_C:'#bbb',fontWeight:j===0||cell==='1'?700:400,textAlign:'center'}}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <P><strong>Resultado — Cerradura Transitiva:</strong></P>
        <div style={{overflowX:'auto',marginBottom:10}}>
          <table style={{borderCollapse:'collapse',fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>
            <thead><tr>
              <th style={{border:'1.5px solid #1e1e1e',padding:'3px 10px',background:'#1e1e1e',color:'#fff',fontSize:10}}></th>
              {['1','2','3'].map(h=><th key={h} style={{border:'1.5px solid #1e1e1e',padding:'3px 10px',background:'#1e1e1e',color:'#fff',fontSize:10}}>{h}</th>)}
            </tr></thead>
            <tbody>
              {[['1','1','1','1'],['2','1','1','1'],['3','1','1','1']].map((row,i)=>(
                <tr key={i} style={{background:'#edfdf5'}}>
                  {row.map((cell,j)=>(
                    <td key={j} style={{border:'1px solid #ccc',padding:'4px 10px',color:j===0?TX_C:'#27ae60',fontWeight:700,textAlign:'center'}}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={grn}>
          <p style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:12.5,margin:'0 0 4px'}}>Todos los valores = 1</p>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:TX_C,lineHeight:1.8,margin:0}}>{`El grafo es fuertemente conexo:\nexiste camino entre todo par de\nvértices en ambas direcciones.`}</p>
        </div>
        <CompTable headers={['Floyd vs Warshall', 'Floyd', 'Warshall']} rows={[
          ['¿Qué calcula?', 'Costo mínimo', 'Solo existencia'],
          ['Tipo de dato', 'Numérico', 'Booleano'],
          ['Operación clave', 'min(suma)', 'OR(AND)'],
          ['Complejidad', 'O(n³)', 'O(n³)'],
        ]} />
      </div>}
    />,

  ];
}
