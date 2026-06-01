import { AC, BD, BL, TX } from '../constants';

export function TermDiagramTree() {
  const N = {
    root:{x:310,y:75,v:1}, b:{x:180,y:155,v:3}, c:{x:310,y:155,v:5},
    d:{x:440,y:155,v:8},   e:{x:120,y:235,v:7}, f:{x:240,y:235,v:2}, g:{x:310,y:235,v:9}
  };
  const edges = [['root','b'],['root','c'],['root','d'],['b','e'],['b','f'],['c','g']];
  const ls = { fontFamily:"'Lora',serif", fontWeight:700, fontSize:14, fill:TX };
  const ds = { fontFamily:"'JetBrains Mono',monospace", fontSize:9.5, fill:'#444' };
  return (
    <svg viewBox="0 0 700 330" width="660" height="310" style={{ overflow:'visible' }}>
      <rect x={106} y={133} width={208} height={125} fill="none" stroke={BL} strokeWidth={1.5} strokeDasharray="5 3" rx={4}/>
      <text x={120} y={128} fontFamily="'Lora',serif" fontSize={11} fontStyle="italic" fill={BL}>subárbol</text>
      {[75,155,235].map((y,i)=>(<g key={i}><line x1={28} y1={y} x2={56} y2={y} stroke="#ccc" strokeWidth={1} strokeDasharray="3 2"/><text x={2} y={y+4} fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={AC}>p.{i}</text></g>))}
      {edges.map(([a,b])=><line key={`${a}${b}`} x1={N[a].x} y1={N[a].y} x2={N[b].x} y2={N[b].y} stroke={BD} strokeWidth={1.5}/>)}
      {Object.entries(N).map(([id,{x,y,v}])=>(<g key={id}><circle cx={x} cy={y} r={21} fill="#fff" stroke={BD} strokeWidth={1.5}/><text x={x} y={y+5} textAnchor="middle" fontFamily="'Lora',serif" fontSize={13} fill={TX}>{v}</text></g>))}
      {[N.e,N.f,N.g,N.d].map((n,i)=><circle key={i} cx={n.x} cy={n.y+31} r={5} fill={AC}/>)}
      <circle cx={585} cy={75} r={5} fill={AC}/><line x1={580} y1={75} x2={N.root.x+21} y2={N.root.y} stroke={BD} strokeWidth={1}/>
      <text x={595} y={71} {...ls}>Raíz</text><text x={595} y={87} {...ds}>nodo superior,</text><text x={595} y={99} {...ds}>sin padre.</text>
      <circle cx={585} cy={155} r={5} fill={AC}/><line x1={580} y1={155} x2={N.c.x+21} y2={N.c.y} stroke={BD} strokeWidth={1}/>
      <text x={595} y={151} {...ls}>Nodo Interno</text><text x={595} y={167} {...ds}>tiene al menos</text><text x={595} y={179} {...ds}>un hijo.</text>
      <circle cx={25} cy={250} r={5} fill={AC}/><line x1={30} y1={250} x2={N.e.x-21} y2={N.e.y} stroke={BD} strokeWidth={1}/>
      <text x={35} y={242} {...ls}>Hoja</text><text x={35} y={258} {...ds}>sin hijos,</text><text x={35} y={270} {...ds}>grado = 0.</text>
      <circle cx={585} cy={235} r={5} fill={AC}/><line x1={580} y1={235} x2={N.g.x+21} y2={N.g.y} stroke={BD} strokeWidth={1}/>
      <text x={595} y={231} {...ls}>Hijo</text><text x={595} y={247} {...ds}>desc. directo</text><text x={595} y={259} {...ds}>de su padre.</text>
      <text x={155} y={143} fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={BL}>grado: 2</text>
      <line x1={495} y1={75} x2={495} y2={235} stroke="#aaa" strokeWidth={1} strokeDasharray="3 2"/>
      <line x1={490} y1={75} x2={500} y2={75} stroke="#aaa" strokeWidth={1}/><line x1={490} y1={235} x2={500} y2={235} stroke="#aaa" strokeWidth={1}/>
      <text x={503} y={162} fontFamily="'Lora',serif" fontSize={11} fontStyle="italic" fill={AC}>altura = 2</text>
    </svg>
  );
}

export function TermDiagramTrie() {
  return (
    <svg viewBox="0 0 660 310" width="640" height="295" style={{ overflow:'visible' }}>
      <line x1={250} y1={55} x2={250} y2={120} stroke={BD} strokeWidth={2}/>
      <line x1={250} y1={120} x2={250} y2={185} stroke={BD} strokeWidth={2}/>
      <line x1={250} y1={185} x2={165} y2={258} stroke={BD} strokeWidth={2}/>
      <line x1={250} y1={185} x2={335} y2={258} stroke={BD} strokeWidth={2}/>
      {/* Etiquetas de nodo sobre las aristas - son etiquetas de los nodos hijos */}
      {[['c',250,87],['a',250,152],['t',207,221],['r',293,221]].map(([ch,x,y])=>(
        <g key={ch}>
          <circle cx={x} cy={y} r={11} fill="#e8e8e3" stroke={AC} strokeWidth={1.5}/>
          <text x={x} y={y+4} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={11} fontWeight={700} fill={AC}>{ch}</text>
        </g>
      ))}
      {/* Nodos */}
      {[[250,55],[250,120],[250,185]].map(([cx,cy],i)=>(<circle key={i} cx={cx} cy={cy} r={20} fill="#fff" stroke={BD} strokeWidth={2}/>))}
      <circle cx={165} cy={258} r={20} fill="#ffeaed" stroke={AC} strokeWidth={2.5}/>
      <circle cx={335} cy={258} r={20} fill="#ffeaed" stroke={AC} strokeWidth={2.5}/>
      <circle cx={165} cy={258} r={7} fill={AC}/><circle cx={335} cy={258} r={7} fill={AC}/>
      {/* Label: Raiz */}
      <circle cx={430} cy={55} r={5} fill={AC}/><line x1={425} y1={55} x2={270} y2={55} stroke={BD} strokeWidth={1}/>
      <text x={440} y={51} fontFamily="'Lora',serif" fontWeight={700} fontSize={14} fill={TX}>Raíz</text>
      <text x={440} y={67} fontFamily="'JetBrains Mono',monospace" fontSize={9.5} fill="#444">nodo inicial, sin carácter.</text>
      {/* Label: Etiqueta del nodo - CORREGIDO del original "Arista = caracter" */}
      <circle cx={430} cy={120} r={5} fill={AC}/><line x1={425} y1={120} x2={261} y2={110} stroke={BD} strokeWidth={1}/>
      <text x={440} y={112} fontFamily="'Lora',serif" fontWeight={700} fontSize={14} fill={TX}>Etiqueta del nodo</text>
      <text x={440} y={128} fontFamily="'JetBrains Mono',monospace" fontSize={9.5} fill="#444">cada nodo (excepto raíz)</text>
      <text x={440} y={141} fontFamily="'JetBrains Mono',monospace" fontSize={9.5} fill="#444">lleva un carácter de σ.</text>
      {/* Label: Prefijo */}
      <circle cx={40} cy={185} r={5} fill={AC}/><line x1={45} y1={185} x2={230} y2={185} stroke={BD} strokeWidth={1}/>
      <text x={5} y={175} fontFamily="'Lora',serif" fontWeight={700} fontSize={14} fill={TX}>Prefijo "ca"</text>
      <text x={5} y={192} fontFamily="'JetBrains Mono',monospace" fontSize={9.5} fill="#444">raíz → c → a</text>
      {/* Label: Fin de palabra */}
      <circle cx={430} cy={258} r={5} fill={AC}/><line x1={425} y1={258} x2={355} y2={258} stroke={BD} strokeWidth={1}/>
      <text x={440} y={250} fontFamily="'Lora',serif" fontWeight={700} fontSize={14} fill={TX}>Fin de palabra</text>
      <text x={440} y={267} fontFamily="'JetBrains Mono',monospace" fontSize={9.5} fill="#444">esPalabra = true.</text>
      <text x={440} y={280} fontFamily="'JetBrains Mono',monospace" fontSize={9.5} fill="#444">"cat" y "car" ✓</text>
    </svg>
  );
}
