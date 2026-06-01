import { Splash, TwoCol, FullPg } from '../components/PageShells';
import CodeBlock from '../components/CodeBlock';
import TrieViz from '../components/TrieViz';
import TriePrefixViz from '../components/TriePrefixViz';
import CompTable from '../components/CompTable';
import { TermDiagramTrie } from '../components/TermDiagrams';
import { TrieSplashSVG } from '../components/SplashVisuals';
import { S, C, P, UL } from '../helpers';
import { AC, BL } from '../constants';

export function pages() {
  return [
    // ── p5: SPLASH ───────────────────────────────────────
    () => <Splash number="2. TRIES" title="Tries" visual={<TrieSplashSVG/>}/>,

    // ── p6: DEFINICION ───────────────────────────────────
    () => <TwoCol title="Tries" badge="DEFINICION" num={6}
      left={<div>
        <P>Sea S un conjunto de s strings del alfabeto σ tal que <strong>ninguna es prefijo de otra</strong>. Un <strong>trie estándar</strong> para S es un árbol ordenado T que cumple:</P>
        <UL items={[
          <><strong>a)</strong> Cada nodo de T, excepto la raíz, tiene por <strong>etiqueta un carácter de σ</strong></>,
          <><strong>b)</strong> El orden de los hijos de un nodo interno está determinado por el <strong>orden canónico del alfabeto</strong></>,
          <><strong>c)</strong> T tiene <strong>s nodos externos</strong>, cada uno asociado con una string de S</>,
          <><strong>d)</strong> La concatenación de etiquetas desde la raíz hasta un nodo externo produce la string asociada</>,
        ]}/>
        <P>Para garantizar que ninguna string sea prefijo de otra, se agrega el carácter especial <strong>"*"</strong> al final de cada string.</P>
        <P><strong>Propiedades estructurales:</strong></P>
        <UL items={[
          <><strong>Altura</strong> del trie = longitud de la string más larga de S</>,
          "Nodo interno: hasta d hijos (d = tamaño del alfabeto)",
          <><strong>Ejemplo clásico:</strong> bear, bell, bid, bull, buy, sell, stock, stop</>,
        ]}/>
        <P><strong>Aplicaciones:</strong> autocompletado, índices de documentos (al encontrar una palabra se retornan las páginas donde aparece), diccionarios de texto predictivo.</P>
      </div>}
      right={<TrieViz/>}
    />,

    // ── p7: TERMINOLOGIA ─────────────────────────────────
    () => <FullPg title="Tries" badge="TERMINOLOGIA" num={7} content={<TermDiagramTrie/>}/>,

    // ── p8: BUSQUEDA — pseudocodigos del parcial ─────────
    () => <TwoCol title="Tries" badge="BUSQUEDA: ALGORITMOS" num={8}
      left={<div>
        <P><strong>1. Búsqueda de palabra completa:</strong></P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px",marginBottom:10}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:AC,lineHeight:1.9,margin:0}}>{`buscarPalabra(trie, patron):\n  seguir camino desde raíz\n  según los caracteres de patron\n\n  si camino termina en NODO EXTERNO\n    → palabra encontrada (ej: "bull")\n  si no se puede seguir\n  O termina en NODO INTERNO\n    → no está (ej: "be", "bet")\n\nTiempo: O(d·m), m = largo del patrón`}</p>
        </div>
        <P><strong>2. Búsqueda de prefijo:</strong></P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px"}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:AC,lineHeight:1.9,margin:0}}>{`buscarPrefijo(trie, prefijo):\n  seguir camino según caracteres\n  del prefijo\n\n  si no se puede seguir → no existe\n\n  si llegamos al final del prefijo:\n    nodo v = raíz del subárbol\n    recorrer todos los subárboles\n    de v para obtener TODAS las\n    palabras con ese prefijo\n\nTiempo: O(k), k = largo del prefijo`}</p>
        </div>
      </div>}
      right={<div>
        <p style={{fontFamily:"'Lora',serif",fontSize:12,fontWeight:700,marginBottom:8,color:AC}}>
          Explorá búsqueda por prefijo →
        </p>
        <TriePrefixViz/>
        <div style={{marginTop:14,background:"#f0f0ec",border:"1px solid #ccc",padding:"8px 12px"}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,lineHeight:1.8,margin:0,color:"#444"}}>{`Aplicación índice:\n  al encontrar la palabra → retornar\n  lista de páginas donde aparece\n  (almacenada en el nodo externo)`}</p>
        </div>
      </div>}
    />,

    // ── p9: INSERCION + REPRESENTACION ───────────────────
    () => <TwoCol title="Tries" badge="INSERCION Y REPRESENTACION" num={9}
      left={<div>
        <P><strong>Inserción de string X:</strong></P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px",marginBottom:12}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:AC,lineHeight:1.9,margin:0}}>{`insertarString(trie, X):\n  tratar de recorrer el camino\n  asociado con X en T\n\n  si X NO está en T:\n    parar en nodo interno v\n    crear nueva cadena de nodos\n    descendientes de v para\n    los caracteres restantes de X\n\nTiempo inserción X: O(d·m)\nConstrucción trie entero: O(d·n)`}</p>
        </div>
        <P><strong>Trade-offs de representación de hijos:</strong></P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px"}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:AC,lineHeight:1.9,margin:"0 0 6px"}}>{`1. Vector de tamaño d (referencia a\n   cada posible carácter del alfabeto)\n   → O(1) acceso, O(d) memoria/nodo\n\n2. Lista enlazada de referencias\n   a subárboles\n   → O(d) acceso, O(hijos) memoria\n\n3. Tabla hash / Map<Char, Nodo>\n   → O(1) promedio, flexible\n   (implementación preferida en Java)`}</p>
        </div>
      </div>}
      right={<CodeBlock label="NodoTrie con Map (opcion 3)" lines={[
        "class NodoTrie {",
        "    boolean esPalabra;",
        "    // Opcion 1: vector de tamano d",
        "    // NodoTrie[] hijos = new NodoTrie[26];",
        "    // Opcion 2: lista de referencias",
        "    // List<NodoTrie> hijos;",
        "    // Opcion 3: mapa (preferida)",
        "    Map<Character, NodoTrie> hijos;","",
        "    NodoTrie() {",
        "        esPalabra = false;",
        "        hijos = new HashMap<>();","    }","",
        "    NodoTrie obtenerHijo(char c) {",
        "        return hijos.get(c);","    }","",
        "    void insertar(String X) {",
        "        NodoTrie cur = this;",
        "        for (char c : X.toCharArray()) {",
        "            cur.hijos.putIfAbsent(",
        "               c, new NodoTrie());",
        "            cur = cur.hijos.get(c);","        }",
        "        cur.esPalabra = true;","    }","}"
      ]} steps={[[0,1],[2,3],[4,5],[6,7],[9,10,11,12],[14,15,16],[18,19,20,21,22,23,24],[25,26,27]]}/>}
    />,
  ];
}
