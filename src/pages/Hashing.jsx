import { Splash, TwoCol } from '../components/PageShells';
import CodeBlock from '../components/CodeBlock';
import HashViz from '../components/HashViz';
import OpenAddressingViz from '../components/OpenAddressingViz';
import CompTable from '../components/CompTable';
import { HashSplashSVG } from '../components/SplashVisuals';
import { S, C, P, UL } from '../helpers';
import { AC, BL } from '../constants';

export function pages() {
  return [
    // ── p10: SPLASH ──────────────────────────────────────
    () => <Splash number="3. HASHING & DICCIONARIOS" title="Hashing" visual={<HashSplashSVG/>}/>,

    // ── p11: MAPAS Y DICCIONARIOS ────────────────────────
    () => <TwoCol title="Hashing" badge="MAPAS Y DICCIONARIOS" num={11}
      left={<div>
        <P><strong>TDA Mapa:</strong> almacena pares (k,v) donde <strong>cada clave es única</strong>. Permite recuperar el valor dado su clave.</P>
        <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:AC,lineHeight:2,margin:"0 0 10px",padding:"6px 10px",background:"#f9f8f4",border:"1px solid #ddd"}}>{`tamaño() · estaVacio()\nrecuperar(k) · poner(k,v)\neliminar(k) · claves()\nvalores() · elementos()`}</pre>
        <P><strong>TDA Diccionario:</strong> similar al mapa pero <strong>permite múltiples entradas con la misma clave</strong>. Dos tipos: ordenados y desordenados.</P>
        <pre style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:AC,lineHeight:2,margin:"0 0 10px",padding:"6px 10px",background:"#f9f8f4",border:"1px solid #ddd"}}>{`tamaño() · estaVacio()\nbuscar(k) · buscarTodos(k)\ninsertar(k,v) · eliminar(e)\nelementos()`}</pre>
        <p style={{fontFamily:"'Lora',serif",fontSize:12,color:"#444"}}>Cada elemento tiene <code style={{color:AC,fontFamily:"'JetBrains Mono',monospace"}}>getKey()</code> y <code style={{color:AC,fontFamily:"'JetBrains Mono',monospace"}}>getValue()</code></p>
      </div>}
      right={<CodeBlock label="Map en Java (clave unica)" lines={[
        "// Map -> clave unica",
        "Map<String,Integer> mapa = new HashMap<>();","",
        "mapa.put(\"ci\", 12345);   // poner",
        "mapa.get(\"ci\");          // recuperar",
        "mapa.remove(\"ci\");       // eliminar",
        "mapa.containsKey(\"ci\"); // buscar",
        "mapa.keySet();           // claves()",
        "mapa.values();           // valores()",
        "mapa.entrySet();         // elementos()","",
        "// Diccionario -> permite duplicados",
        "Map<String,List<String>> dicc = new HashMap<>();",
        "dicc.computeIfAbsent(\"k\",",
        "    k->new ArrayList<>()).add(\"v1\");"
      ]} steps={[[0,1],[3,4,5],[6,7,8,9],[11,12,13,14]]}/>}
    />,

    // ── p12: FUNCION DE TRANSFORMACION ──────────────────
    () => <TwoCol title="Hashing" badge="FUNCION DE TRANSFORMACION" num={12}
      left={<div>
        <P>El <strong>hashing</strong> ("transformación de claves", "desmenuzamiento", "almacenamiento disperso") mapea un universo grande de claves sobre un espacio relativamente pequeño mediante cálculos aritméticos con la clave K.</P>
        <P><strong>Esquema de división (más común):</strong></P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"10px 14px",marginBottom:10,textAlign:"center"}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:16,color:AC,margin:0,fontWeight:700}}>h(K) = K mod N</p>
        </div>
        <P><strong>Elección de N:</strong> si N fuese potencia de 2, usar un primo <strong>M {'>'} N</strong> en su lugar. Las potencias de 2 no dan buenos resultados con claves de palabras o letras.</P>
        <P><strong>Colisión:</strong> h(Ki) = h(Kj) con Ki ≠ Kj. Inevitable cuando el universo de claves es mayor que N.</P>
        <P><strong>Ejemplo de clase (N=9):</strong></P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px"}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:AC,lineHeight:1.9,margin:0}}>{`K  = EN, TO, TRE, FIRE, FEM, SEKS, SYV\nh(K)+1 = 3,  1,   4,    1,   5,    9,   2\n\n→ Colisión: TO y FIRE → bucket 1`}</p>
        </div>
      </div>}
      right={<CodeBlock label="Funcion hash para String" lines={[
        "static int hash(String key, int N) {",
        "    int h = 0;",
        "    for (char c : key.toCharArray()) {",
        "        h = (h * 31 + c) % N;","    }",
        "    return Math.abs(h);","}","",
        "// Java hashCode() para String usa",
        "// formula polinomica:",
        "// s[0]*31^(n-1) + s[1]*31^(n-2)",
        "// + ... + s[n-1]","",
        "// N debe ser primo para buena",
        "// distribucion de claves"
      ]} steps={[[0],[1],[2,3,4],[5,6],[8,9,10,11],[13,14]]}/>}
    />,

    // ── p13: ENCADENAMIENTO SEPARADO ─────────────────────
    () => <TwoCol title="Hashing" badge="ENCADENAMIENTO SEPARADO" num={13}
      left={<div>
        <P><strong>Resolución de colisiones por encadenamiento:</strong> mantener N listas enlazadas (una por bucket). Los elementos que colisionan se insertan en la lista del bucket correspondiente.</P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px",marginBottom:10}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:AC,lineHeight:1.9,margin:0}}>{`Ejemplo clase: N=9\nK = EN,TO,TRE,FIRE,FEM,SEKS,SYV\nh(K)+1 = 3, 1, 4, 1, 5, 9, 2\n\nbucket 1 → TO → FIRE  (colisión)\nbucket 2 → SYV\nbucket 3 → EN\nbucket 4 → TRE\nbucket 5 → FEM\nbucket 9 → SEKS`}</p>
        </div>
        <P><strong>Factor de carga α (definición formal):</strong></P>
        <div style={{background:"#ffeaed",border:`1px solid ${AC}`,padding:"8px 12px",marginBottom:8}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,color:AC,fontWeight:700,textAlign:"center",margin:"0 0 6px"}}>α = número de entradas / número de listas</p>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:"#444",lineHeight:1.8,margin:0}}>{`α = 0: tabla vacía\nα ≈ 1: longitud promedio de listas ≈ 1\n       (desempeño óptimo)\nα > 1: listas más largas, búsqueda más lenta`}</p>
        </div>
        <p style={{fontFamily:"'Lora',serif",fontSize:12,color:"#555",fontStyle:"italic"}}>Java HashMap usa factor de carga predeterminado de 0.75 antes de redimensionar.</p>
        <P>Probá agregar entradas con PUT →</P>
      </div>}
      right={<HashViz/>}
    />,

    // ── p14: ENCADENAMIENTO ABIERTO ──────────────────────
    () => <TwoCol title="Hashing" badge="ENCADENAMIENTO ABIERTO" num={14}
      left={<div>
        <P>Eliminar completamente los enlaces. Mirar posiciones consecutivas hasta encontrar K o posición vacía.</P>
        <P><strong>1. Sondeo lineal:</strong></P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px",marginBottom:8}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:AC,lineHeight:2,margin:0}}>{`h0 = H(K)\nhi = (h0 + i) MOD N,  i = 1..N-1`}</p>
        </div>
        <div style={{background:"#fff8e8",border:"1px solid #e8a000",padding:"6px 10px",marginBottom:10}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:"#7a5000",lineHeight:1.7,margin:0}}>{`⚠ Clustering primario: los elementos\ntienden a agruparse en secuencias\ncontiguas → degrada rendimiento con α alto`}</p>
        </div>
        <P><strong>2. Sondeo cuadrático</strong> (reduce clustering primario):</P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px",marginBottom:6}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:AC,lineHeight:2,margin:0}}>{`h0 = H(K)\nhi = (h0 + i²) MOD N,  i > 0`}</p>
        </div>
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10.5,color:"#555",marginBottom:10}}>{`Condiciones: N debe ser primo y α ≤ 0.5\npara garantizar que siempre se\nencuentra una posición libre.`}</p>
        <P><strong>3. Doble hashing</strong> (reduce clustering secundario):</P>
        <div style={{background:"#f9f8f4",border:"1px solid #ddd",padding:"8px 12px"}}>
          <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:AC,lineHeight:2,margin:0}}>{`hi = (h0 + i·h2(K)) MOD N\nh2(K) ≠ 0, coprimo con N`}</p>
        </div>
      </div>}
      right={<OpenAddressingViz/>}
    />,
  ];
}
