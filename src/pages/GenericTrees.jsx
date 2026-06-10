import { Splash, TwoCol, FullPg } from '../components/PageShells';
import TreeViz from '../components/TreeViz';
import TraversalViz from '../components/TraversalViz';
import CodeBlock from '../components/CodeBlock';
import CompTable from '../components/CompTable';
import { TermDiagramTree } from '../components/TermDiagrams';
import { TreeSplashSVG } from '../components/SplashVisuals';
import { S, C, P, UL } from '../helpers';
import { AC } from '../constants';
import { treeNodeVisual, heightVisual, bfsTreeVisual, firstChildVisual } from '../components/CodeVisuals';

export function pages(tree, setTree) {
  return [
    () => <Splash number="1. ARBOLES GENERICOS" title="Arboles Genericos" visual={<TreeSplashSVG/>}/>,

    () => <TwoCol title="Arboles Genericos" badge="DEFINICION" num={1}
      left={<div>
        <P>Un <strong>árbol genérico</strong> es un conjunto finito T de uno o más nodos tal que:</P>
        <UL items={[
          "a) Existe un nodo especialmente designado: la raíz del árbol, raiz(T).",
          "b) Los restantes nodos están distribuidos en m ≥ 0 conjuntos disjuntos T1,...,Tm, y cada uno de estos conjuntos es a su vez un árbol.",
        ]}/>
        <P>Los árboles T1,...,Tm son llamados <strong>subárboles de la raíz</strong>.</P>
        <P><strong>Propiedades:</strong></P>
        <UL items={["Un único nodo raíz","Cada nodo (excepto raíz) tiene exactamente un padre","No hay ciclos","Único camino entre dos nodos cualesquiera"]}/>
        <P><strong>Usos:</strong> sistemas de archivos, DOM HTML/XML, organigramas, tries.</P>
      </div>}
      right={<TreeViz tree={tree} onUpdate={setTree}/>}
    />,

    () => <FullPg title="Arboles Genericos" badge="TERMINOLOGIA" num={2} content={<TermDiagramTree/>}/>,

    () => <TwoCol title="Arboles Genericos" badge="REPRESENTACION EN JAVA" num={3}
      left={<div>
        <P>La representación más directa usa {C("Node<T>")} con {C("List<Node<T>> children")}.</P>
        <P><strong>TDA ÁRBOL — operaciones:</strong></P>
        <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:AC,margin:"4px 0 10px",lineHeight:2,background:"#f9f8f4",padding:"8px 10px",border:"1px solid #ddd"}}>{`Padre( unNodo )\nHijoIzquierdo( unNodo )   // primer hijo\nHermanoDerecho( unNodo )  // sgte hermano\nEtiqueta( unNodo )        // dato\nRaiz                      // nodo raíz\nAnula                     // vacía el árbol\nAltura`}</pre>
        <P>Alternativa eficiente: <strong>primer hijo – hermano derecho</strong> (ver p6).</P>
      </div>}
      right={<CodeBlock label="Nodo con lista de hijos" lines={[
        "class Node<T> {",
        "    T data;",
        "    List<Node<T>> children;",
        "",
        "    Node(T data) {",
        "        this.data = data;",
        "        this.children =",
        "            new ArrayList<>();",
        "    }",
        "",
        "    void addChild(Node<T> c) {",
        "        children.add(c);",
        "    }",
        "}",
      ]} steps={[[0],[1],[2],[4,5,6,7,8],[10,11,12],[13]]}
         visual={(step) => treeNodeVisual(step)}
      />}
    />,

    () => <TwoCol title="Arboles Genericos" badge="RECORRIDOS" num={4}
      left={<div>
        <P>Si un árbol A es nulo, el listado en cualquier orden es la lista vacía. Si tiene un solo nodo, ese nodo constituye el listado en los tres órdenes.</P>
        <P><strong>Preorden:</strong> raíz de A, seguido de los nodos de A1 en preorden, luego A2, etc.</P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px",marginBottom:10}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:AC,lineHeight:1.9,margin:0}}>{`Algoritmo preOrden(v)\n  visitar(v)\n  Para cada hijo w de v\n    preOrden(w)`}</p>
        </div>
        <P><strong>Inorden:</strong> nodos de A1 en inorden, luego la raíz, luego los restantes subárboles.</P>
        <P><strong>Postorden:</strong> todos los subárboles primero, luego la raíz.</P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px"}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:AC,lineHeight:1.9,margin:0}}>{`Algoritmo postOrden(v)\n  Para cada hijo w de v\n    postOrden(w)\n  visitar(v)`}</p>
        </div>
      </div>}
      right={<TraversalViz tree={tree}/>}
    />,

    () => <TwoCol title="Arboles Genericos" badge="OPERACIONES" num={5}
      left={<div>
        <P><strong>height(node):</strong> longitud del camino más largo desde el nodo hasta una hoja. Base: hoja → 0.</P>
        <P><strong>size(node):</strong> cantidad total de nodos del subárbol (incluye el nodo mismo).</P>
        <P><strong>BFS nivel por nivel:</strong> usa {C("Queue")} (FIFO). Procesa todos los nodos de un nivel antes de bajar.</P>
        <P><strong>Complejidades:</strong></P>
        <CompTable headers={["Operación","Tiempo","Espacio aux."]} rows={[
          ["preOrden / postOrden","O(n)","O(h) — pila recursión"],
          ["height","O(n)","O(h) — pila recursión"],
          ["size","O(n)","O(h) — pila recursión"],
          ["BFS","O(n)","O(w) — anchura máxima"],
          ["k-ésimo hijo (1er hijo/hermano)","O(k)","O(1)"],
        ]}/>
      </div>}
      right={<CodeBlock label="height · size · BFS" lines={[
        "int height(Node<T> n) {",
        "    if (n==null) return -1;",
        "    int max = -1;",
        "    for (Node<T> c : n.children)",
        "        max = Math.max(max, height(c));",
        "    return max + 1;",
        "}",
        "",
        "int size(Node<T> n) {",
        "    if (n==null) return 0;",
        "    int s = 1;",
        "    for (Node<T> c : n.children)",
        "        s += size(c);",
        "    return s;",
        "}",
        "",
        "void bfs(Node<T> root) {",
        "    Queue<Node<T>> q = new LinkedList<>();",
        "    q.offer(root);",
        "    while (!q.isEmpty()) {",
        "        Node<T> cur = q.poll();",
        "        visit(cur.data);",
        "        q.addAll(cur.children);",
        "    }",
        "}",
      ]} steps={[[0,1],[2,3,4],[5,6],[8,9],[10,11,12],[13,14],[16,17,18],[19,20,21,22,23,24]]}
         visual={(step) => heightVisual(step)}
      />}
    />,

    () => <TwoCol title="Arboles Genericos" badge="PRIMER HIJO / HERMANO DERECHO" num={6}
      left={<div>
        <P>Representación alternativa eficiente: cada nodo guarda solo <strong>dos referencias</strong> — su <strong>primer hijo</strong> y su <strong>hermano derecho</strong> (siguiente hermano).</P>
        <P>Transforma cualquier árbol genérico en una <strong>estructura binaria</strong> sin perder información.</P>
        <P><strong>Operaciones del TDA:</strong></P>
        <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:AC,margin:"4px 0 10px",lineHeight:2,background:"#f9f8f4",padding:"8px 10px",border:"1px solid #ddd"}}>{`Padre( unNodo )\nHijoIzquierdo( unNodo )   // primer hijo\nHermanoDerecho( unNodo )  // sgte hermano\nEtiqueta( unNodo )        // dato\nRaiz                      // nodo sin padre`}</pre>
        <P><strong>Ventaja:</strong> estructura uniforme, solo dos punteros por nodo.</P>
        <P><strong>Desventaja:</strong> acceder al k-ésimo hijo requiere recorrer la lista de hermanos → O(k).</P>
      </div>}
      right={<CodeBlock label="Nodo primer hijo / hermano derecho" lines={[
        "class Nodo<T> {",
        "    T etiqueta;",
        "    Nodo<T> primerHijo;",
        "    Nodo<T> hermanoDerecho;",
        "",
        "    Nodo(T e) {",
        "        etiqueta = e;",
        "        primerHijo = null;",
        "        hermanoDerecho = null;",
        "    }",
        "}",
        "",
        "// Recorrer hijos de un nodo:",
        "Nodo<T> hijo = nodo.primerHijo;",
        "while (hijo != null) {",
        "    visitar(hijo);",
        "    hijo = hijo.hermanoDerecho;",
        "}",
      ]} steps={[[0,1,2,3],[5,6,7,8,9,10],[12,13],[14,15,16,17]]}
         visual={(step) => firstChildVisual(step)}
      />}
    />,
  ];
}
