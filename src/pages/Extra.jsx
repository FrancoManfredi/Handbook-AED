import { TwoCol, FullPg } from "../components/PageShells";
import CodeBlock from "../components/CodeBlock";
import CompTable from "../components/CompTable";
import { S, C, P, UL } from "../helpers";
import { AC, BL } from "../constants";

export function pages(tree) {
  return [
    // ── p20: ARBOLES GENERICOS — OPERACIONES EXTRA ───────
    () => <TwoCol title="Arboles Genericos" badge="OPERACIONES EXTRA" num={20}
      left={<div>
        <P><strong>height(node):</strong> longitud del camino más largo desde el nodo hasta una hoja. Base: hoja → 0.</P>
        <P><strong>size(node):</strong> cantidad total de nodos del subárbol (incluye el nodo mismo).</P>
        <P><strong>BFS nivel por nivel:</strong> usa {C("Queue")} (FIFO). Procesa todos los nodos de un nivel antes de bajar.</P>
        <P><strong>Primer hijo / hermano derecho:</strong> cada nodo guarda solo dos referencias — <strong>primer hijo</strong> y <strong>hermano derecho</strong>. Transforma el árbol genérico en estructura binaria; acceder al k-ésimo hijo cuesta O(k).</P>
        <P><strong>Complejidades:</strong></P>
        <CompTable headers={["Operación","Tiempo","Espacio aux."]} rows={[
          ["preOrder / postOrder","O(n)","O(h) — pila recursión"],
          ["height","O(n)","O(h) — pila recursión"],
          ["size","O(n)","O(h) — pila recursión"],
          ["BFS","O(n)","O(w) — anchura máxima"],
          ["k-ésimo hijo (1er-hijo/hermano)","O(k)","O(1)"],
        ]}/>
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#666",marginTop:6}}>h = altura del árbol | w = anchura máxima</p>
      </div>}
      right={<CodeBlock label="height · size · BFS" lines={[
        "int height(Node<T> n) {",
        "    if (n==null) return -1;",
        "    int max = -1;",
        "    for (Node<T> c : n.children)",
        "        max = Math.max(max, height(c));",
        "    return max + 1;",
        "}","",
        "int size(Node<T> n) {",
        "    if (n==null) return 0;",
        "    int s = 1;",
        "    for (Node<T> c : n.children)",
        "        s += size(c);",
        "    return s;",
        "}","",
        "void bfs(Node<T> root) {",
        "    Queue<Node<T>> q = new LinkedList<>();",
        "    q.offer(root);",
        "    while (!q.isEmpty()) {",
        "        Node<T> cur = q.poll();",
        "        visit(cur.data);",
        "        q.addAll(cur.children);","    }","}"
      ]} steps={[[0,1],[2,3,4],[5,6],[8,9],[10,11,12],[13,14],[16,17,18],[19,20,21,22,23,24]]}/>}
    />,

    // ── p21: TRIES — ELIMINACION + COMPLEJIDADES ─────────
    () => <TwoCol title="Tries" badge="ELIMINACION" num={21}
      left={<div>
        <P><strong>delete(word):</strong> recorrer el trie hasta el final de la palabra, desmarcar {C("esPalabra")} y podar nodos vacíos hacia arriba.</P>
        <P><strong>Criterio exacto de poda:</strong> un nodo puede eliminarse si y solo si:</P>
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
          ["insert(w)","O(d·m)"],
          ["search(w)","O(d·m)"],
          ["startsWith(p)","O(d·m)"],
          ["delete(w)","O(d·m) — recorre m niveles"],
        ]}/>
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#666",marginTop:6}}>d = tamaño del alfabeto | m = longitud de la palabra</p>
      </div>}
      right={<CodeBlock label="delete en Trie" lines={[
        "// Retorna true si el nodo puede",
        "// eliminarse tras el borrado",
        "boolean delete(NodoTrie n,",
        "        String w, int i) {",
        "    if (i == w.length()) {",
        "        if (!n.esPalabra) return false;",
        "        n.esPalabra = false;",
        "        // Podar si quedó vacío",
        "        return isEmpty(n);",
        "    }",
        "    char c = w.charAt(i);",
        "    NodoTrie hijo = n.hijos.get(c);",
        "    if (hijo == null) return false;",
        "    boolean podar = delete(hijo,w,i+1);",
        "    if (podar) n.hijos.remove(c);",
        "    // Eliminar nodo si vacío y no",
        "    // es fin de otra palabra",
        "    return n.hijos.isEmpty()",
        "           && !n.esPalabra;","}"
      ]} steps={[[0,1,2,3],[4,5,6],[7,8,9],[10,11,12],[13,14],[15,16,17,18,19]]}/>}
    />,

    // ── p22: HASHING — hashCode() Y equals() ─────────────
    () => <TwoCol title="Hashing" badge="hashCode() Y equals()" num={22}
      left={<div>
        <P><strong>Contrato hashCode/equals (Java) — para que HashMap funcione correctamente:</strong></P>
        <div style={{background:"#ffeaed",border:`1px solid ${AC}`,padding:"8px 12px",marginBottom:10}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:AC,lineHeight:1.9,margin:0}}>{`REGLA 1 (obligatoria):\n  a.equals(b) → a.hashCode() == b.hashCode()\n\nREGLA 2 (no obligatoria pero deseable):\n  a.hashCode() == b.hashCode()\n  no implica a.equals(b) (colisión normal)`}</p>
        </div>
        <UL items={[
          "Usar los mismos atributos en equals() y en hashCode()",
          <>Debe ser consistente: mismo resultado durante toda la ejecución</>,
        ]}/>
        <P><strong>Implementaciones estándar:</strong></P>
        <UL items={[
          <>{C("Integer")}: devuelve el valor int directamente</>,
          <>{C("String")}: s[0]·31^(n-1) + s[1]·31^(n-2) + ... + s[n-1]</>,
          <>{C("Float")}: basado en representación IEEE 754</>,
          <>Múltiples atributos: {C("Objects.hash(attr1, attr2, ...)")}</>,
        ]}/>
      </div>}
      right={<CodeBlock label="hashCode() y equals()" lines={[
        "// Un atributo identifica al objeto",
        "class Persona {","    String ci;",
        "    @Override","    public int hashCode() {",
        "        return ci.hashCode();","    }",
        "    @Override","    public boolean equals(Object o) {",
        "        if (!(o instanceof Persona))","            return false;",
        "        return ci.equals(((Persona)o).ci);","    }","}","",
        "// Varios atributos",
        "class EstudianteCurso {",
        "    String ci; String codCurso;",
        "    public int hashCode() {",
        "        return Objects.hash(ci, codCurso);","    }","}"
      ]} steps={[[0,1,2],[3,4,5,6],[7,8,9,10,11,12,13],[15,16,17],[18,19,20,21]]}/>}
    />,

    // ── p23: COMPARABLE & COMPARATOR ─────────────────────
    () => <TwoCol title="Java Collections API" badge="COMPARABLE & COMPARATOR" num={23}
      left={<div>
        <P><strong>Comparable{"<T>"}:</strong> la clase define su propio orden natural implementando {C("compareTo(T o)")}. Retorna: negativo si {C("this < o")}, 0 si iguales, positivo si {C("this > o")}.</P>
        <P>Usado por {C("TreeMap")}, {C("TreeSet")}, {C("Collections.sort()")}.</P>
        <P><strong>Comparator{"<T>"}:</strong> objeto separado que define un orden externo. Útil cuando no controlamos la clase o necesitamos múltiples criterios de ordenamiento.</P>
        <P><strong>Métodos útiles (verificados):</strong></P>
        <UL items={[
          C("Comparator.comparing(fn)"),
          C(".thenComparing(fn)"),
          C(".reversed()"),
          C("Collections.sort(list, comp)"),
          C("list.sort(comp)"),
        ]}/>
      </div>}
      right={<CodeBlock label="Comparable vs Comparator" lines={[
        "// Comparable — orden natural",
        "class Alumno implements Comparable<Alumno>{",
        "    String nombre; int nota;",
        "    public int compareTo(Alumno o) {",
        "        return this.nota - o.nota;","    }","}","",
        "// Comparator — orden externo",
        "Comparator<Alumno> porNombre =",
        "    Comparator.comparing(a->a.nombre);","",
        "// Componer criterios",
        "Comparator<Alumno> comp =",
        "    Comparator.comparingInt(a->a.nota)",
        "    .thenComparing(a->a.nombre)",
        "    .reversed();","",
        "list.sort(comp);",
        "Collections.sort(list, comp);"
      ]} steps={[[0,1,2],[3,4,5,6],[8,9,10],[12,13,14,15,16],[18,19,20]]}/>}
    />,

    // ── p24: CHEATSHEET DE COMPLEJIDADES ─────────────────
    () => <TwoCol title="Resumen General" badge="CHEATSHEET DE COMPLEJIDADES" num={24}
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
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9.5,color:"#666",marginTop:6}}>~ amortizado | ** con referencia al nodo | d = tamaño alfabeto | m = largo palabra</p>
      </div>}
      right={<div style={{fontFamily:"'Lora',serif",fontSize:13,lineHeight:1.9}}>
        <p style={{fontWeight:700,marginBottom:10}}>Cuándo usar qué:</p>
        {[
          ["ArrayList","acceso por índice frecuente"],
          ["LinkedList","inserciones al inicio/fin, como Queue/Deque"],
          ["HashMap","lookup O(1), sin necesidad de orden"],
          ["TreeMap","claves ordenadas, rangos, subMap()"],
          ["HashSet","pertenencia rápida, sin duplicados"],
          ["TreeSet","elementos únicos ordenados"],
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

    // ── p25: PRIMER HIJO / HERMANO DERECHO ───────────────
    () => <TwoCol title="Arboles Genericos" badge="PRIMER HIJO / HERMANO DERECHO" num={25}
      left={<div>
        <P>Representación alternativa eficiente: cada nodo guarda solo <strong>dos referencias</strong> — su <strong>primer hijo</strong> y su <strong>hermano derecho</strong> (siguiente hermano).</P>
        <P>Transforma cualquier árbol genérico en una <strong>estructura binaria</strong> sin perder información.</P>
        <P><strong>Operaciones del TDA:</strong></P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px",marginBottom:10}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:AC,lineHeight:2,margin:0}}>{`Padre( unNodo )\nHijoIzquierdo( unNodo )   // primer hijo\nHermanoDerecho( unNodo )  // sgte hermano\nEtiqueta( unNodo )        // dato\nRaiz                      // nodo sin padre`}</p>
        </div>
        <P><strong>Ventaja:</strong> estructura uniforme, solo dos punteros por nodo.</P>
        <P><strong>Desventaja:</strong> acceder al k-ésimo hijo requiere recorrer la lista de hermanos → O(k).</P>
      </div>}
      right={<CodeBlock label="Nodo primer hijo / hermano derecho" lines={[
        "class Nodo<T> {","    T etiqueta;",
        "    Nodo<T> primerHijo;","    Nodo<T> hermanoDerecho;","",
        "    Nodo(T e) {","        etiqueta = e;",
        "        primerHijo = null;","        hermanoDerecho = null;","    }","}","",
        "// Recorrer hijos de un nodo:",
        "Nodo<T> hijo = nodo.primerHijo;",
        "while (hijo != null) {","    visitar(hijo);",
        "    hijo = hijo.hermanoDerecho;","}"
      ]} steps={[[0,1,2,3],[5,6,7,8,9,10],[12,13],[14,15,16,17]]}/>}
    />,

    // ── p26: TRIE COMPRIMIDO (PATRICIA) ──────────────────
    () => <TwoCol title="Tries" badge="TRIE COMPRIMIDO (PATRICIA)" num={26}
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

    // ── p27: QUEUE, STACK Y ALGORITMOS ───────────────────
    () => <TwoCol title="Java Collections API" badge="QUEUE, STACK Y ALGORITMOS" num={27}
      left={<div>
        <P><strong>Implementaciones de Queue (Cola):</strong></P>
        <UL items={[
          <>{C("LinkedList")} — cola normal, offer/poll/peek</>,
          <>{C("ArrayDeque")} — más eficiente que LinkedList para colas simples</>,
          <>{C("PriorityQueue")} — atiende según prioridad (Comparable o Comparator)</>,
        ]}/>
        <P><strong>Pila (Stack):</strong> {C("Stack")} está en desuso. Usar {C("ArrayDeque")} como pila: {C("push")}, {C("pop")}, {C("peek")}.</P>
        <P><strong>Algoritmos de Collections (sobre List):</strong></P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px"}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:AC,lineHeight:1.9,margin:0}}>{`sort        → estable, O(n log n)\nbinarySearch→ O(log n) (lista ordenada)\nreverse     → invierte\nshuffle     → permutación aleatoria\nrotate(n,k) → rota k posiciones\nswap(n,i,j) → intercambia i y j\nfill(n,obj) → rellena con obj\ncopy(dst,src)→ copia src en dst\nindexOfSubList / lastIndexOfSubList`}</p>
        </div>
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:"#666",marginTop:6}}>{`Para contar frecuencias: usar Map<E,Integer>`}</p>
      </div>}
      right={<CodeBlock label="Queue, Stack, Algoritmos" lines={[
        "// Cola con ArrayDeque (eficiente)",
        "Queue<String> cola = new ArrayDeque<>();",
        "cola.offer(\"a\");   // encolar",
        "cola.poll();       // desencolar O(1)",
        "cola.peek();       // ver frente","",
        "// Pila con ArrayDeque",
        "Deque<String> pila = new ArrayDeque<>();",
        "pila.push(\"a\");    // apilar",
        "pila.pop();        // desapilar O(1)","",
        "// PriorityQueue (min-heap por defecto)",
        "Queue<Integer> pq = new PriorityQueue<>();",
        "pq.offer(5); pq.offer(1); pq.offer(3);",
        "pq.poll(); // retorna 1 (menor)","",
        "// Algoritmos",
        "Collections.sort(lista);       // estable",
        "Collections.reverse(lista);",
        "Collections.shuffle(lista);",
        "int i = Collections.binarySearch(lista,\"x\");"
      ]} steps={[[0,1],[2,3,4],[6,7],[8,9],[11,12,13,14],[16,17],[18,19,20]]}/>}
    />,

    // ── p28: CRITERIOS PARA ELEGIR ───────────────────────
    () => <TwoCol title="Java Collections API" badge="CRITERIOS PARA ELEGIR" num={28}
      left={<div>
        <P>Preguntas clave para elegir la estructura correcta:</P>
        <UL items={[
          <><strong>¿Qué se almacena?</strong> Objetos solos vs pares clave-valor → Collection vs Map</>,
          <><strong>¿Se aceptan duplicados?</strong> Set no permite, List sí permite</>,
          <><strong>¿Qué operaciones predominan?</strong> búsqueda vs inserciones/eliminaciones</>,
          <><strong>¿Importa el orden?</strong> TreeX ordena, LinkedHashX mantiene inserción</>,
          <><strong>¿Ambiente concurrente?</strong> → {C("ConcurrentHashMap")}</>,
        ]}/>
        <CompTable headers={["Necesidad","Usar"]} rows={[
          ["Búsqueda rápida O(1)","HashMap / HashSet"],
          ["Claves ordenadas","TreeMap / TreeSet"],
          ["Orden de inserción","LinkedHashMap"],
          ["Cola FIFO eficiente","ArrayDeque"],
          ["Cola con prioridad","PriorityQueue"],
          ["Pila (LIFO)","ArrayDeque (push/pop)"],
          ["Prefijos de strings","Trie"],
          ["Concurrencia","ConcurrentHashMap"],
        ]}/>
      </div>}
      right={<CodeBlock label="Elegir bien la coleccion" lines={[
        "// ¿Duplicados? → List",
        "List<String> nombres = new ArrayList<>();","",
        "// ¿Sin duplicados, sin orden? → HashSet",
        "Set<String> vistos = new HashSet<>();","",
        "// ¿Sin duplicados, ordenados? → TreeSet",
        "Set<String> ordenados = new TreeSet<>();","",
        "// ¿Clave→valor, rápido? → HashMap",
        "Map<String,Integer> freq","    = new HashMap<>();","",
        "// ¿Clave→valor, ordenado? → TreeMap",
        "Map<String,Integer> sorted","    = new TreeMap<>(freq);"
      ]} steps={[[0,1],[3,4],[6,7],[9,10,11],[13,14,15]]}/>}
    />,
  ];
}
