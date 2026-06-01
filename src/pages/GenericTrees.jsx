import { Splash, TwoCol, FullPg } from '../components/PageShells';
import TreeViz from '../components/TreeViz';
import TraversalViz from '../components/TraversalViz';
import CodeBlock from '../components/CodeBlock';
import CompTable from '../components/CompTable';
import { TermDiagramTree } from '../components/TermDiagrams';
import { TreeSplashSVG } from '../components/SplashVisuals';
import { S, C, P, UL } from '../helpers';
import { AC, BL } from '../constants';

export function pages(tree, setTree) {
  return [
    () => <Splash number="1. ARBOLES GENERICOS" title="Arboles Genericos" visual={<TreeSplashSVG/>}/>,

    () => <TwoCol title="Arboles Genericos" badge="DEFINICION" num={1}
      left={<div>
        <P>Un <strong>arbol generico</strong> es un conjunto finito T de uno o mas nodos tal que:</P>
        <UL items={[
          "a) Existe un nodo especialmente designado: la raiz del arbol, raiz(T).",
          "b) Los restantes nodos estan distribuidos en m >= 0 conjuntos disjuntos T1,...,Tm, y cada uno de estos conjuntos es a su vez un arbol.",
        ]}/>
        <P>Los arboles T1,...,Tm son llamados <strong>subarbolesde la raiz</strong>.</P>
        <P><strong>Propiedades:</strong></P>
        <UL items={["Un unico nodo raiz","Cada nodo (excepto raiz) tiene exactamente un padre","No hay ciclos","Unico camino entre dos nodos cualesquiera"]}/>
        <P><strong>Usos:</strong> sistemas de archivos, DOM HTML/XML, organigramas, tries.</P>
      </div>}
      right={<TreeViz tree={tree} onUpdate={setTree}/>}
    />,

    () => <FullPg title="Arboles Genericos" badge="TERMINOLOGIA" num={2} content={<TermDiagramTree/>}/>,

    () => <TwoCol title="Arboles Genericos" badge="REPRESENTACION EN JAVA" num={3}
      left={<div>
        <P>La representacion mas directa usa {C("Node<T>")} con {C("List<Node<T>> children")}. Alternativa mas eficiente en memoria: <strong>primer hijo – hermano derecho</strong>.</P>
        <P><strong>TDA ARBOL — operaciones:</strong></P>
        <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:AC,margin:"4px 0 10px",lineHeight:2,background:"#f9f8f4",padding:"8px 10px",border:"1px solid #ddd"}}>{`Padre( unNodo )\nHijoIzquierdo( unNodo )   // primer hijo\nHermanoDerecho( unNodo )  // sgte hermano\nEtiqueta( unNodo )        // dato\nRaiz                      // nodo raiz\nAnula                     // vacia el arbol\nAltura`}</pre>
        <P>Usa el slider para ver la construccion linea por linea.</P>
      </div>}
      right={<CodeBlock label="Nodo con lista de hijos" lines={[
        "class Node<T> {","    T data;","    List<Node<T>> children;","",
        "    Node(T data) {","        this.data = data;","        this.children =","            new ArrayList<>();","    }","",
        "    void addChild(Node<T> c) {","        children.add(c);","    }","}"
      ]} steps={[[0],[1],[2],[4,5,6,7,8],[10,11,12],[13]]}/>}
    />,

    () => <TwoCol title="Arboles Genericos" badge="RECORRIDOS" num={4}
      left={<div>
        <P>Si un arbol A es nulo, el listado en cualquier orden es la lista vacia. Si tiene un solo nodo, ese nodo constituye el listado en los tres ordenes.</P>
        <P><strong>Preorden:</strong> Raiz de A, seguido de los nodos de A1 en preorden, luego A2, etc. El nodo es visitado <strong>antes</strong> que sus descendientes.</P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px",marginBottom:10}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:AC,lineHeight:1.9,margin:0}}>{`Algoritmo preOrden(v)\n  visitar(v)\n  Para cada hijo w de v\n    preOrden(w)`}</p>
          <p style={{fontFamily:"'Lora',serif",fontSize:11,color:"#555",margin:"6px 0 0",fontStyle:"italic"}}>Aplicacion: imprimir un documento estructurado</p>
        </div>
        <P><strong>Inorden:</strong> Nodos de A1 en inorden, luego la raiz, luego los nodos de los restantes subarboles en inorden.</P>
        <P><strong>Postorden:</strong> Nodos de A1 en postorden, hasta el final, y luego la raiz. El nodo es visitado <strong>despues</strong> de sus descendientes.</P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px"}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:AC,lineHeight:1.9,margin:0}}>{`Algoritmo postOrden(v)\n  Para cada hijo w de v\n    postOrden(w)\n  visitar(v)`}</p>
          <p style={{fontFamily:"'Lora',serif",fontSize:11,color:"#555",margin:"6px 0 0",fontStyle:"italic"}}>Aplicacion: calcular espacio usado por archivos en un directorio</p>
        </div>
      </div>}
      right={<TraversalViz tree={tree}/>}
    />,
  ];
}
