import { TwoCol } from "../components/PageShells";
import CompTable from "../components/CompTable";
import { P, C, UL } from "../helpers";
import { AC } from "../constants";

export function pages() {
  return [
    // ── p28: CHEATSHEET GENERAL ───────────────────────────
    () => <TwoCol title="Resumen General" badge="CHEATSHEET DE COMPLEJIDADES" num={28}
      left={<div>
        <p style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:13,marginBottom:6}}>Estructuras jerárquicas</p>
        <CompTable headers={["Estructura","Búsqueda","Inserción"]} rows={[
          ["Árbol genérico (DFS)","O(n)","O(1) con ref. al padre"],
          ["Trie","O(d·m)","O(d·m)"],
        ]}/>
        <p style={{fontFamily:"'Lora',serif",fontWeight:700,fontSize:13,margin:"10px 0 6px"}}>Java Collections</p>
        <CompTable headers={["Clase","get","add/put","remove","Orden"]} rows={[
          ["ArrayList","O(1)","O(1)~","O(n)","inserción"],
          ["LinkedList","O(n)","O(1)**","O(1)**","inserción"],
          ["HashMap","O(1)","O(1)","O(1)","sin orden"],
          ["TreeMap","O(log n)","O(log n)","O(log n)","natural"],
          ["HashSet","O(1)","O(1)","O(1)","sin orden"],
          ["TreeSet","O(log n)","O(log n)","O(log n)","natural"],
        ]}/>
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:"#666",marginTop:6}}>
          ~ amortizado | ** con ref. al nodo | d = tamaño alfabeto | m = largo palabra
        </p>
      </div>}
      right={<div style={{fontFamily:"'Lora',serif",fontSize:13,lineHeight:1.9}}>
        <p style={{fontWeight:700,marginBottom:10}}>Cuándo usar qué:</p>
        {[
          ["ArrayList","acceso por índice frecuente"],
          ["LinkedList","inserciones al inicio/fin, como Queue/Deque"],
          ["HashMap","lookup O(1), sin necesidad de orden"],
          ["TreeMap","claves ordenadas, rangos, subMap()"],
          ["HashSet","pertenencia rápida, sin duplicados"],
          ["TreeSet","elementos únicos y ordenados"],
          ["Trie","prefijos, autocompletado, startsWith"],
          ["Árbol genérico","jerarquías naturales (sistemas de archivos)"],
          ["ArrayDeque","pila o cola FIFO eficiente"],
          ["PriorityQueue","atención por prioridad (min-heap)"],
        ].map(([k,v]) => (
          <div key={k} style={{display:"flex",gap:10,marginBottom:5,alignItems:"baseline"}}>
            <code style={{color:AC,fontFamily:"'JetBrains Mono',monospace",fontSize:11,minWidth:115,flexShrink:0}}>{k}</code>
            <span style={{color:"#555",fontSize:12.5}}>{v}</span>
          </div>
        ))}
      </div>}
    />,
  ];
}
