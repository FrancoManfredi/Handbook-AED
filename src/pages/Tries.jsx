import { Splash, TwoCol, FullPg } from '../components/PageShells';
import CodeBlock from '../components/CodeBlock';
import TrieViz from '../components/TrieViz';
import TriePrefixViz from '../components/TriePrefixViz';
import CompTable from '../components/CompTable';
import { TermDiagramTrie } from '../components/TermDiagrams';
import { TrieSplashSVG } from '../components/SplashVisuals';
import { S, C, P, UL } from '../helpers';
import { AC } from '../constants';

export function pages() {
  return [
    // ── p7: SPLASH ───────────────────────────────────────
    () => <Splash number="2. TRIES" title="Tries" visual={<TrieSplashSVG/>}/>,

    // ── p8: DEFINICION ───────────────────────────────────
    () => <TwoCol title="Tries" badge="DEFINICION" num={8}
      left={<div>
        <P>Sea S un conjunto de s strings del alfabeto σ tal que <strong>ninguna es prefijo de otra</strong>. Un <strong>trie estándar</strong> para S es un árbol ordenado T que cumple:</P>
        <UL items={[
          <><strong>a)</strong> Cada nodo de T, excepto la raíz, tiene por <strong>etiqueta un carácter de σ</strong></>,
          <><strong>b)</strong> El orden de los hijos está determinado por el <strong>orden canónico del alfabeto</strong></>,
          <><strong>c)</strong> T tiene <strong>s nodos externos</strong>, uno por cada string de S</>,
          <><strong>d)</strong> La concatenación de etiquetas raíz→nodo externo produce la string asociada</>,
        ]}/>
        <P>Para que ninguna string sea prefijo de otra, se agrega el carácter <strong>"*"</strong> al final de cada string.</P>
        <P><strong>Propiedades estructurales:</strong></P>
        <UL items={[
          <><strong>Altura</strong> = longitud de la string más larga de S</>,
          "Nodo interno: hasta d hijos (d = tamaño del alfabeto)",
          <><strong>Ejemplo clásico:</strong> bear, bell, bid, bull, buy, sell, stock, stop</>,
        ]}/>
        <P><strong>Aplicaciones:</strong> autocompletado, índices de documentos (páginas donde aparece la palabra), diccionarios de texto predictivo.</P>
      </div>}
      right={<TrieViz/>}
    />,

    // ── p9: TERMINOLOGIA ─────────────────────────────────
    () => <FullPg title="Tries" badge="TERMINOLOGIA" num={9} content={<TermDiagramTrie/>}/>,

    // ── p10: BUSQUEDA ────────────────────────────────────
    () => <TwoCol title="Tries" badge="BUSQUEDA: ALGORITMOS" num={10}
      left={<div>
        <P><strong>1. Búsqueda de palabra completa:</strong></P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px",marginBottom:10}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:AC,lineHeight:1.9,margin:0}}>{`buscarPalabra(trie, patron):\n  seguir camino desde raíz\n  según los caracteres de patron\n\n  si termina en NODO EXTERNO\n    → encontrada (ej: "bull")\n  si no se puede seguir\n  O termina en NODO INTERNO\n    → no está (ej: "be", "bet")\n\nTiempo: O(d·m), m = largo del patrón`}</p>
        </div>
        <P><strong>2. Búsqueda de prefijo:</strong></P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px"}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:AC,lineHeight:1.9,margin:0}}>{`buscarPrefijo(trie, prefijo):\n  seguir camino según caracteres\n\n  si no se puede seguir → no existe\n\n  si llegamos al final del prefijo:\n    raíz del subárbol encontrada\n    recorrer todos los subárboles\n    para obtener TODAS las palabras\n\nTiempo: O(k), k = largo del prefijo`}</p>
        </div>
      </div>}
      right={<div>
        <p style={{fontFamily:"'Lora',serif",fontSize:12,fontWeight:700,marginBottom:8,color:AC}}>Explorá búsqueda por prefijo →</p>
        <TriePrefixViz/>
        <div style={{marginTop:14,background:"#f0f0ec",border:"1px solid #ccc",padding:"8px 12px"}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,lineHeight:1.8,margin:0,color:"#444"}}>{`Aplicación índice:\n  al encontrar la palabra → retornar\n  lista de páginas donde aparece`}</p>
        </div>
      </div>}
    />,

    // ── p11: INSERCION + REPRESENTACION ──────────────────
    () => <TwoCol title="Tries" badge="INSERCION Y REPRESENTACION" num={11}
      left={<div>
        <P><strong>Inserción de string X:</strong></P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px",marginBottom:12}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:AC,lineHeight:1.9,margin:0}}>{`insertarString(trie, X):\n  tratar de recorrer el camino\n  asociado con X en T\n\n  si X NO está en T:\n    parar en nodo interno v\n    crear nueva cadena de nodos\n    descendientes de v para\n    los caracteres restantes de X\n\nTiempo inserción X: O(d·m)\nConstrucción trie entero: O(d·n)`}</p>
        </div>
        <P><strong>Trade-offs de representación de hijos:</strong></P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px"}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:AC,lineHeight:1.9,margin:0}}>{`1. Vector de tamaño d\n   → O(1) acceso, O(d) memoria/nodo\n\n2. Lista enlazada de referencias\n   → O(d) acceso, O(hijos) memoria\n\n3. Map<Char, Nodo>  (preferida Java)\n   → O(1) promedio, flexible`}</p>
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
        "    void insertar(String X) {",
        "        NodoTrie cur = this;",
        "        for (char c : X.toCharArray()) {",
        "            cur.hijos.putIfAbsent(",
        "               c, new NodoTrie());",
        "            cur = cur.hijos.get(c);","        }",
        "        cur.esPalabra = true;","    }","}"
      ]} steps={[[0,1],[2,3],[4,5],[6,7],[9,10,11,12],[14,15,16,17,18,19,20],[21,22,23]]}/>}
    />,

    // ── p12: ELIMINACION ─────────────────────────────────
    () => <TwoCol title="Tries" badge="ELIMINACION" num={12}
      left={<div>
        <P><strong>delete(word):</strong> recorrer el trie hasta el final de la palabra, desmarcar {C("esPalabra")} y podar nodos vacíos hacia arriba.</P>
        <P><strong>Criterio exacto de poda:</strong></P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px",marginBottom:10}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:AC,lineHeight:1.9,margin:0}}>{`isEmpty(n) = n.hijos.isEmpty()\n\nSe elimina un nodo si:\n  isEmpty(n) AND NOT n.esPalabra\n\n(si tiene hijos → no se elimina;\n si es fin de otra palabra → no se elimina)`}</p>
        </div>
        <P><strong>Casos al eliminar la palabra X:</strong></P>
        <UL items={[
          <>X es <strong>prefijo de otra palabra</strong> → solo desmarcar {C("esPalabra")}, no eliminar nodos</>,
          <>X <strong>comparte prefijo</strong> con otra → eliminar solo los nodos exclusivos de X</>,
          <>X no comparte prefijo con nadie → eliminar todos sus nodos</>,
        ]}/>
        <P><strong>Complejidades:</strong></P>
        <CompTable headers={["Operación","Tiempo"]} rows={[
          ["insert(w)","O(d·m)"],["search(w)","O(d·m)"],
          ["startsWith(p)","O(d·m)"],["delete(w)","O(d·m)"],
        ]}/>
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#666",marginTop:6}}>d = tamaño alfabeto | m = longitud de la palabra</p>
      </div>}
      right={<CodeBlock label="delete en Trie" lines={[
        "// Retorna true si el nodo puede",
        "// eliminarse tras el borrado",
        "boolean delete(NodoTrie n,",
        "        String w, int i) {",
        "    if (i == w.length()) {",
        "        if (!n.esPalabra) return false;",
        "        n.esPalabra = false;",
        "        return isEmpty(n);","    }",
        "    char c = w.charAt(i);",
        "    NodoTrie hijo = n.hijos.get(c);",
        "    if (hijo == null) return false;",
        "    boolean podar = delete(hijo,w,i+1);",
        "    if (podar) n.hijos.remove(c);",
        "    return n.hijos.isEmpty()",
        "           && !n.esPalabra;","}"
      ]} steps={[[0,1,2,3],[4,5,6],[7,8],[9,10,11],[12,13],[14,15,16]]}/>}
    />,

    // ── p13: PATRICIA ────────────────────────────────────
    () => <TwoCol title="Tries" badge="TRIE COMPRIMIDO (PATRICIA)" num={13}
      left={<div>
        <P>Muchos nodos del trie estándar tienen <strong>un solo hijo</strong> — cadenas redundantes. El <strong>trie comprimido (PATRICIA)</strong> las elimina.</P>
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:"#555",margin:"0 0 8px"}}>Practical Algorithm to Retrieve Information Coded in Alphanumeric</p>
        <P><strong>Regla:</strong> todos los nodos internos tienen <strong>al menos 2 hijos</strong>. Las cadenas de nodos con un solo hijo se comprimen en una sola arista etiquetada con la subcadena.</P>
        <P><strong>Tamaño:</strong> si S tiene s strings → como máximo <strong>s−1 nodos internos</strong> → O(s) nodos total.</P>
        <P><strong>Representación compacta:</strong> las etiquetas no guardan la subcadena completa sino una <strong>tríada (i, j, k)</strong> que referencia S[i][j..k] — la substring del string i-ésimo, desde posición j hasta k.</P>
        <P>Patricia es ventajosa como <strong>índice auxiliar</strong> cuando la colección ya está almacenada en otra estructura.</P>
      </div>}
      right={<div style={{fontFamily:"'Lora',serif",fontSize:13}}>
        <p style={{fontWeight:700,marginBottom:8}}>Trie estándar → Patricia:</p>
        <div style={{background:"#f9f8f4",border:"1.5px solid #ccc",padding:"10px 14px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,lineHeight:2,color:AC}}>
          <p style={{color:"#888",marginBottom:4}}>// S = conjunto de strings</p>
          <p>Trie estándar: nodos con</p>
          <p>1 solo hijo (redundantes)</p>
          <p style={{marginTop:8}}>Patricia: comprime cadenas</p>
          <p>→ aristas con substrings</p>
          <p style={{marginTop:8}}>Nodos internos {"<="} s − 1</p>
          <p>Tamaño total: O(s)</p>
        </div>
        <div style={{marginTop:12,padding:"8px 12px",background:"#f0f0ec",border:"1px solid #ccc"}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:"#444",lineHeight:1.8,margin:0}}>{`Etiqueta como tríada (i, j, k):\n  S[i][j..k] → subcadena del string\n  i-ésimo, posiciones j hasta k\n  (evita duplicar substrings en memoria)`}</p>
        </div>
      </div>}
    />,
  ];
}
