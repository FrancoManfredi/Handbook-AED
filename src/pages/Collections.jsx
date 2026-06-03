import { Splash, TwoCol, FullPg } from '../components/PageShells';
import CodeBlock from '../components/CodeBlock';
import CollHierarchy from '../components/CollHierarchy';
import CompTable from '../components/CompTable';
import { CollSplashSVG } from '../components/SplashVisuals';
import { S, C, P, UL } from '../helpers';
import { AC, BL } from '../constants';

export function pages() {
  return [
    // ── p20: SPLASH ──────────────────────────────────────
    () => <Splash number="4. JAVA COLLECTIONS API" title="Java Collections" visual={<CollSplashSVG/>}/>,

    // ── p21: JERARQUIA ───────────────────────────────────
    () => <FullPg title="Java Collections API" badge="JERARQUIA" num={21} content={<CollHierarchy/>}/>,

    // ── p22: COLLECTION E INTERFAZ LIST ──────────────────
    () => <TwoCol title="Java Collections API" badge="COLLECTION E INTERFAZ LIST" num={22}
      left={<div>
        <P><strong>Interfaz Collection — métodos base:</strong></P>
        <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:AC,margin:"4px 0 10px",lineHeight:1.9,background:"#f9f8f4",padding:"8px 10px",border:"1px solid #ddd"}}>{`int size()\nboolean isEmpty()\nboolean contains(Object element)\nboolean add(E element)\nboolean remove(Object element)\nIterator<E> iterator()`}</pre>
        <P><strong>Formas de recorrer una Collection:</strong></P>
        <UL items={[
          "for-each",
          "Iterador explícito (Iterator)",
          "Operaciones bulk / agregadas",
          <>{C("toArray()")} — array operations</>,
        ]}/>
        <P><strong>Operaciones bulk:</strong> {C("addAll")}, {C("removeAll")}, {C("containsAll")}</P>
        <P><strong>Interfaz List</strong> extiende Collection agregando:</P>
        <UL items={[
          <>Acceso por posición: {C("get")}, {C("set")}, {C("add")}, {C("addAll")}, {C("remove")}</>,
          <>Búsqueda: {C("indexOf")}, {C("lastIndexOf")}</>,
          <>Iteración bidireccional: {C("listIterator")}</>,
          <>Vista de subrango: {C("subList(fromIndex, toIndex)")}</>,
        ]}/>
      </div>}
      right={<CodeBlock label="Collection — iteradores y uso" lines={[
        "Collection<String> col = new ArrayList<>();","",
        "col.add(\"a\"); col.size();",
        "col.contains(\"a\"); col.remove(\"a\");","",
        "// Iterador explícito",
        "Iterator<String> it = col.iterator();",
        "while (it.hasNext()) {",
        "    String s = it.next();",
        "    if (s.isEmpty()) it.remove();",
        "    // ⚠ usar it.remove(), NO col.remove()",
        "    // (evita ConcurrentModification)",
        "    // Exception si se modifica la colección",
        "    // directamente durante la iteración","}","",
        "// Operaciones bulk",
        "col.addAll(otraColeccion);",
        "col.removeAll(otraColeccion);"
      ]} steps={[[0],[2,3],[5,6,7,8,9,10,11,12,13,14],[16,17,18]]}/>}
    />,

    // ── p23: LISTITERATOR Y ALGORITMOS ───────────────────
    () => <TwoCol title="Java Collections API" badge="LIST ITERATOR Y ALGORITMOS" num={23}
      left={<div>
        <P><strong>ListIterator — interfaz completa (bidireccional):</strong></P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px",marginBottom:10}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:AC,lineHeight:2,margin:0}}>{`1. hasNext()\n2. next()\n3. remove()     // elimina el último next()\n4. hasPrevious()\n5. previous()\n6. add(e)       // inserta antes del cursor\n7. set(e)       // reemplaza el último next()`}</p>
        </div>
        <P><strong>subList — vista O(1):</strong></P>
        <div style={{background:"#fff8e8",border:"1px solid #e8a000",padding:"6px 10px",marginBottom:10}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:"#7a5000",lineHeight:1.7,margin:0}}>{`list.subList(from, to)  // O(1), es una VISTA\nlos cambios se reflejan en la lista original\n⚠ modificaciones estructurales invalidan la sublista`}</p>
        </div>
        <P><strong>Algoritmos de Collections (sobre List):</strong></P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px"}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:AC,lineHeight:1.9,margin:0}}>{`sort        → estable, O(n log n)\nbinarySearch→ O(log n), lista ordenada\nreverse     → invierte el orden\nshuffle     → permutación aleatoria\nrotate(n,k) → rota k posiciones a la derecha\nswap(n,i,j) → intercambia posiciones i y j\nfill(n,obj) → reemplaza todos por obj\ncopy(dst,src)→ copia src en dst\nindexOfSubList / lastIndexOfSubList`}</p>
        </div>
      </div>}
      right={<CodeBlock label="listIterator y algoritmos" lines={[
        "List<String> list = new ArrayList<>();",
        "list.add(\"a\"); list.add(\"b\"); list.add(\"c\");","",
        "// listIterator: bidireccional",
        "ListIterator<String> li = list.listIterator();",
        "while (li.hasNext())",
        "    System.out.println(li.next());",
        "while (li.hasPrevious())",
        "    System.out.println(li.previous());","",
        "// subList: vista O(1)",
        "List<String> sub = list.subList(1, 3);",
        "sub.clear(); // elimina [1,3) de list","",
        "// Algoritmos",
        "Collections.sort(list);",
        "Collections.shuffle(list);",
        "Collections.rotate(list, 2);",
        "Collections.swap(list, 0, 1);",
        "int i = Collections.binarySearch(list, \"b\");"
      ]} steps={[[0,1],[3,4,5,6],[7,8],[10,11,12],[14,15],[16,17,18,19]]}/>}
    />,

    // ── p24: MAP — VISTAS Y COLLECTION VIEWS ─────────────
    () => <TwoCol title="Java Collections API" badge="MAP: VISTAS Y COLLECTION VIEWS" num={24}
      left={<div>
        <P><strong>Map</strong> mapea claves a valores. Cada clave puede mapear a lo sumo a un valor. <strong>Map no extiende Collection.</strong></P>
        <P><strong>Operaciones básicas:</strong></P>
        <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:AC,margin:"4px 0 10px",lineHeight:1.9,background:"#f9f8f4",padding:"8px 10px",border:"1px solid #ddd"}}>{`put, get, remove\ncontainsKey, containsValue\nsize, isEmpty`}</pre>
        <P><strong>Operaciones bulk:</strong> {C("putAll")}, {C("clear")}</P>
        <P><strong>Vistas (Collection views)</strong> — única forma de iterar un Map:</P>
        <UL items={[
          <>{C("keySet()")} — Set de claves</>,
          <>{C("values()")} — Collection de valores</>,
          <>{C("entrySet()")} — Set de pares {C("Map.Entry<K,V>")}</>,
        ]}/>
        <P><strong>Implementaciones:</strong></P>
        <UL items={[
          <>{C("HashMap")} — O(1) promedio, sin orden</>,
          <>{C("TreeMap")} — O(log n), claves ordenadas</>,
          <>{C("LinkedHashMap")} — orden de inserción</>,
        ]}/>
      </div>}
      right={<CodeBlock label="Map — vistas e iteracion" lines={[
        "Map<String,Integer> m = new HashMap<>();","",
        "// Iterar claves (keySet)",
        "for (String key : m.keySet())",
        "    System.out.println(key);","",
        "// Iterar con iterador + remove seguro",
        "Iterator<String> it = m.keySet().iterator();",
        "while (it.hasNext()) {",
        "    String k = it.next();",
        "    if (isBogus(k)) it.remove();","}","",
        "// Iterar entradas (entrySet)",
        "for (Map.Entry<String,Integer> e",
        "        : m.entrySet()) {",
        "    System.out.println(",
        "        e.getKey()+\": \"+e.getValue());","}"
      ]} steps={[[0],[2,3,4],[6,7,8,9,10,11],[13,14,15,16,17,18]]}/>}
    />,

    // ── p25: COMPARABLE & COMPARATOR ─────────────────────
    () => <TwoCol title="Java Collections API" badge="COMPARABLE & COMPARATOR" num={25}
      left={<div>
        <P><strong>Comparable{"<T>"}:</strong> la clase define su propio orden natural implementando {C("compareTo(T o)")}. Retorna: negativo si {C("this < o")}, 0 si iguales, positivo si {C("this > o")}.</P>
        <P>Usado por {C("TreeMap")}, {C("TreeSet")}, {C("Collections.sort()")}.</P>
        <P><strong>Comparator{"<T>"}:</strong> objeto separado que define un orden externo. Útil cuando no controlamos la clase o necesitamos múltiples criterios.</P>
        <P><strong>Métodos útiles:</strong></P>
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
      ]} steps={[[0,1,2],[3,4,5,6],[8,9,10],[12,13,14,15,16],[18,19]]}/>}
    />,

    // ── p26: QUEUE, STACK Y ALGORITMOS ───────────────────
    () => <TwoCol title="Java Collections API" badge="QUEUE, STACK Y ALGORITMOS" num={26}
      left={<div>
        <P><strong>Implementaciones de Queue (Cola):</strong></P>
        <UL items={[
          <>{C("LinkedList")} — cola normal, offer/poll/peek</>,
          <>{C("ArrayDeque")} — más eficiente que LinkedList para colas simples</>,
          <>{C("PriorityQueue")} — atiende según prioridad (Comparable o Comparator)</>,
        ]}/>
        <P><strong>Pila (Stack):</strong> {C("Stack")} está en desuso. Usar {C("ArrayDeque")} como pila: {C("push")}, {C("pop")}, {C("peek")}.</P>
        <P><strong>Algoritmos de Collections:</strong></P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px"}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:AC,lineHeight:1.9,margin:0}}>{`sort        → estable, O(n log n)\nbinarySearch→ O(log n), lista ordenada\nreverse     → invierte\nshuffle     → permutación aleatoria\nrotate(n,k) → rota k posiciones a la derecha\nswap(n,i,j) → intercambia posiciones i y j\nfill(n,obj) → rellena con valor dado\ncopy(dst,src)→ copia src en dst`}</p>
        </div>
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
        "// PriorityQueue (min-heap)",
        "Queue<Integer> pq = new PriorityQueue<>();",
        "pq.offer(5); pq.offer(1); pq.offer(3);",
        "pq.poll(); // retorna 1 (el menor)","",
        "// Algoritmos",
        "Collections.sort(lista);",
        "Collections.reverse(lista);",
        "int i = Collections.binarySearch(lista,\"x\");"
      ]} steps={[[0,1],[2,3,4],[6,7],[8,9],[11,12,13,14],[16,17],[18,19]]}/>}
    />,

    // ── p27: CRITERIOS PARA ELEGIR ───────────────────────
    () => <TwoCol title="Java Collections API" badge="CRITERIOS PARA ELEGIR" num={27}
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
