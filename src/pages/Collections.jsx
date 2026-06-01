import { Splash, TwoCol, FullPg } from '../components/PageShells';
import CodeBlock from '../components/CodeBlock';
import CollHierarchy from '../components/CollHierarchy';
import CompTable from '../components/CompTable';
import { CollSplashSVG } from '../components/SplashVisuals';
import { S, C, P, UL } from '../helpers';
import { AC, BL } from '../constants';

export function pages() {
  return [
    // ── p15: SPLASH ──────────────────────────────────────
    () => <Splash number="4. JAVA COLLECTIONS API" title="Java Collections" visual={<CollSplashSVG/>}/>,

    // ── p16: JERARQUIA ───────────────────────────────────
    () => <FullPg title="Java Collections API" badge="JERARQUIA" num={16} content={<CollHierarchy/>}/>,

    // ── p17: INTERFAZ COLLECTION + LIST ──────────────────
    () => <TwoCol title="Java Collections API" badge="COLLECTION E INTERFAZ LIST" num={17}
      left={<div>
        <P><strong>Interfaz Collection — métodos base:</strong></P>
        <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:AC,margin:"4px 0 10px",lineHeight:1.9,background:"#f9f8f4",padding:"8px 10px",border:"1px solid #ddd"}}>{`int size()\nboolean isEmpty()\nboolean contains(Object element)\nboolean add(E element)\nboolean remove(Object element)\nIterator<E> iterator()`}</pre>
        <P><strong>Formas de recorrer una Collection:</strong></P>
        <UL items={[
          "for-each",
          "Iterador explícito (Iterator)",
          "Operaciones bulk / agregadas",
          <>Array operations: {C("toArray()")}</>,
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
        "// Métodos base","Collection<String> col","    = new ArrayList<>();","",
        "col.add(\"a\"); col.size();",
        "col.contains(\"a\"); col.remove(\"a\");","",
        "// Iterador explícito",
        "Iterator<String> it = col.iterator();",
        "while (it.hasNext()) {",
        "    String s = it.next();",
        "    if (s.isEmpty()) it.remove();","    // ⚠ usar it.remove(), NO col.remove()",
        "    // (evita ConcurrentModification)","    // Exception si modificás la colección",
        "    // directamente durante la iteración","}","",
        "// Operaciones bulk",
        "col.addAll(otraColeccion);",
        "col.removeAll(otraColeccion);"
      ]} steps={[[0,1,2],[4,5],[7,8,9,10,11,12,13,14,15,16],[18,19,20]]}/>}
    />,

    // ── p18: LISTITERATOR + ALGORITMOS ───────────────────
    () => <TwoCol title="Java Collections API" badge="LIST ITERATOR Y ALGORITMOS" num={18}
      left={<div>
        <P><strong>ListIterator — interfaz completa (bidireccional):</strong></P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px",marginBottom:10}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:AC,lineHeight:2,margin:0}}>{`1. hasNext()\n2. next()\n3. remove()     // elimina el último next()\n4. hasPrevious()\n5. previous()\n6. add(e)       // inserta antes del cursor\n7. set(e)       // reemplaza el último next()`}</p>
        </div>
        <P><strong>subList — vista O(1):</strong></P>
        <div style={{background:"#fff8e8",border:"1px solid #e8a000",padding:"6px 10px",marginBottom:10}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:"#7a5000",lineHeight:1.7,margin:0}}>{`list.subList(from, to)  // O(1), es una VISTA\nlos cambios se reflejan en la lista original\n⚠ modificaciones estructurales a la lista\n  original invalidan la sublista`}</p>
        </div>
        <P><strong>Algoritmos de Collections (sobre List):</strong></P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px"}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:AC,lineHeight:1.9,margin:0}}>{`sort        → estable, O(n log n)\nbinarySearch→ O(log n), lista debe estar\n               ordenada\nreverse     → invierte el orden\nshuffle     → permutación aleatoria\nrotate      → rota k posiciones a la derecha\nswap        → intercambia elementos en i y j\nfill        → reemplaza todos por un valor\ncopy        → copia src en dest (dest >= src)\nindexOfSubList / lastIndexOfSubList`}</p>
        </div>
      </div>}
      right={<CodeBlock label="listIterator y algoritmos" lines={[
        "List<String> list = new ArrayList<>();",
        "list.add(\"a\"); list.add(\"b\"); list.add(\"c\");","",
        "// listIterator: recorrido bidireccional",
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

    // ── p19: MAP — VISTAS Y COLLECTION VIEWS ─────────────
    () => <TwoCol title="Java Collections API" badge="MAP: VISTAS Y COLLECTION VIEWS" num={19}
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
  ];
}
