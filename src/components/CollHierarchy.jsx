import { AC, BD, BL, TX } from '../constants';

export default function CollHierarchy() {
  const IF = { fill:'#e8f0fc', stroke:BL, rx:11 };
  const CL = { fill:'#fff', stroke:BD, rx:2 };
  const boxes = [
    // Collection branch
    {x:183,y:8,  w:130,h:22,label:'«Collection»',...IF},
    {x:30, y:65, w:95, h:22,label:'«List»',...IF},
    {x:195,y:65, w:95, h:22,label:'«Set»',...IF},
    {x:360,y:65, w:100,h:22,label:'«Queue»',...IF},
    {x:0,  y:120,w:105,h:22,label:'ArrayList',...CL},
    {x:118,y:120,w:110,h:22,label:'LinkedList',...CL},
    {x:172,y:120,w:100,h:22,label:'HashSet',...CL},
    {x:280,y:120,w:100,h:22,label:'TreeSet',...CL},
    {x:388,y:120,w:115,h:22,label:'ArrayDeque',...CL},
    // Map branch — explicitly separated
    {x:525,y:8,  w:120,h:22,label:'«Map»',...IF},
    {x:494,y:65, w:105,h:22,label:'HashMap',...CL},
    {x:612,y:65, w:105,h:22,label:'TreeMap',...CL},
  ];
  const edges = [
    [248,30,78,65],[248,30,242,65],[248,30,410,65],
    [78,87,52,120],[78,87,173,120],
    [242,87,222,120],[242,87,330,120],
    [410,87,445,120],
    [585,30,546,65],[585,30,664,65],
  ];
  return (
    <div>
      {/* Separation label */}
      <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:4}}>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:BL,paddingLeft:4}}>← rama Collection (Iterable)</span>
        <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:'#e84055',marginLeft:'auto',paddingRight:4}}>rama Map (separada) →</span>
      </div>
      <svg viewBox="0 0 730 155" width="690" height="148" style={{ overflow:'visible' }}>
        {/* Dashed separator between Collection and Map */}
        <line x1={488} y1={0} x2={488} y2={150} stroke="#ddd" strokeWidth={1.5} strokeDasharray="5 3"/>
        {edges.map(([x1,y1,x2,y2],i)=><line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#999" strokeWidth={1.5}/>)}
        {boxes.map((b,i)=>(
          <g key={i}>
            <rect x={b.x} y={b.y} width={b.w} height={b.h} fill={b.fill} stroke={b.stroke} strokeWidth={1.5} rx={b.rx}/>
            <text x={b.x+b.w/2} y={b.y+15} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9.5} fill={b.stroke}>{b.label}</text>
          </g>
        ))}
        <rect x={10} y={142} width={11} height={11} fill="#e8f0fc" stroke={BL} strokeWidth={1.5} rx={5}/>
        <text x={26} y={152} fontFamily="'JetBrains Mono',monospace" fontSize={9} fill="#555">interfaz</text>
        <rect x={90} y={142} width={11} height={11} fill="#fff" stroke={BD} strokeWidth={1.5} rx={1}/>
        <text x={106} y={152} fontFamily="'JetBrains Mono',monospace" fontSize={9} fill="#555">clase concreta</text>
      </svg>
      <div style={{ fontFamily:"'Lora',serif", fontSize:12, color:'#444', marginTop:8, lineHeight:1.7 }}>
        <span style={{color:'#e84055',fontWeight:700}}>Clave: </span>
        <code style={{color:'#e84055',fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>Map</code> <strong>no extiende</strong> <code style={{color:'#e84055',fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>Collection</code> — son jerarquías independientes.
        {' '}<code style={{color:'#e84055',fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>LinkedList</code> implementa <code style={{color:'#e84055',fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>List</code> y también <code style={{color:'#e84055',fontFamily:"'JetBrains Mono',monospace",fontSize:11}}>Deque</code>.
      </div>
    </div>
  );
}
