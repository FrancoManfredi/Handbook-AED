import { AC, BD, CH } from '../constants';

export function GraphSplashSVG() {
  // Directed graph splash: nodes with arrows
  const nodes = [[280,60],[140,160],[280,160],[420,160],[210,260],[350,260]];
  const edges = [[0,1],[0,2],[0,3],[1,4],[2,4],[2,5],[3,5]];
  function arrowPts(x1,y1,x2,y2) {
    const a=Math.atan2(y2-y1,x2-x1),r=22;
    const ex=x2-r*Math.cos(a),ey=y2-r*Math.sin(a);
    const sx=x1+r*Math.cos(a),sy=y1+r*Math.sin(a);
    return {sx,sy,ex,ey,a};
  }
  return (
    <svg width={560} height={310} style={{marginBottom:-5}}>
      {edges.map(([a,b],i)=>{
        const {sx,sy,ex,ey,a:ang}=arrowPts(nodes[a][0],nodes[a][1],nodes[b][0],nodes[b][1]);
        return (
          <g key={i}>
            <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={BD} strokeWidth={2}/>
            <polygon points={`${ex},${ey} ${ex-9*Math.cos(ang-0.4)},${ey-9*Math.sin(ang-0.4)} ${ex-9*Math.cos(ang+0.4)},${ey-9*Math.sin(ang+0.4)}`} fill={BD}/>
          </g>
        );
      })}
      {nodes.map(([cx,cy],i)=>(
        <circle key={i} cx={cx} cy={cy} r={22} fill={CH} stroke={i===0?AC:BD} strokeWidth={i===0?3:2.5}/>
      ))}
      {/* highlight arc cost label on one edge */}
      <text x={210} y={104} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={11} fill={AC}>w</text>
    </svg>
  );
}

export function TreeSplashSVG() {
  const sn=[[280,55],[165,135],[280,135],[395,135],[105,215],[225,215],[280,215],[345,215],[435,215]];
  const se=[[0,1],[0,2],[0,3],[1,4],[1,5],[2,6],[2,7],[3,8]];
  return (
    <svg width={560} height={285} style={{ marginBottom:-5 }}>
      {se.map(([a,b])=><line key={`${a}${b}`} x1={sn[a][0]} y1={sn[a][1]} x2={sn[b][0]} y2={sn[b][1]} stroke={BD} strokeWidth={2.5}/>)}
      {sn.map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r={22} fill={CH} stroke={BD} strokeWidth={2.5}/>)}
    </svg>
  );
}

export function TrieSplashSVG() {
  return (
    <svg width={360} height={200} style={{ marginBottom:10 }}>
      <line x1={180} y1={35} x2={120} y2={100} stroke={BD} strokeWidth={2}/><line x1={180} y1={35} x2={240} y2={100} stroke={BD} strokeWidth={2}/>
      <line x1={120} y1={100} x2={120} y2={165} stroke={BD} strokeWidth={2}/><line x1={240} y1={100} x2={240} y2={165} stroke={BD} strokeWidth={2}/>
      <line x1={120} y1={165} x2={75} y2={210} stroke={BD} strokeWidth={2}/><line x1={120} y1={165} x2={165} y2={210} stroke={BD} strokeWidth={2}/>
      {[['b',150,67],['c',210,67],['a',120,132],['a',240,132],['a',97,187],['t',143,187]].map(([ch,x,y])=>(
        <g key={`${ch}${x}`}><circle cx={x} cy={y} r={10} fill={CH} stroke={AC} strokeWidth={1.5}/><text x={x} y={y+4} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={10} fontWeight={700} fill={AC}>{ch}</text></g>
      ))}
      {[[180,35],[120,100],[240,100],[120,165],[240,165]].map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r={18} fill={CH} stroke={BD} strokeWidth={2}/>)}
      {[[75,210],[165,210]].map(([cx,cy],i)=><g key={i}><circle cx={cx} cy={cy} r={18} fill={CH} stroke={AC} strokeWidth={2.5}/><circle cx={cx} cy={cy} r={6} fill={AC}/></g>)}
    </svg>
  );
}

export function HashSplashSVG() {
  return (
    <svg width={500} height={120} style={{ marginBottom:16 }}>
      <rect x={20} y={40} width={110} height={38} fill={CH} stroke={BD} strokeWidth={2}/>
      <text x={75} y={64} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={14} fontWeight={700} fill={AC}>"apple"</text>
      <line x1={130} y1={59} x2={178} y2={59} stroke={BD} strokeWidth={2}/><polygon points="178,53 190,59 178,65" fill={BD}/>
      <rect x={190} y={34} width={130} height={50} fill={CH} stroke={BD} strokeWidth={2}/>
      <text x={255} y={55} textAnchor="middle" fontFamily="'Lora',serif" fontWeight={700} fontSize={13} fill="#111">hashCode()</text>
      <text x={255} y={75} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={12} fill="#3a72b8">% 7</text>
      <line x1={320} y1={59} x2={368} y2={59} stroke={BD} strokeWidth={2}/><polygon points="368,53 380,59 368,65" fill={BD}/>
      <rect x={380} y={34} width={100} height={50} fill={CH} stroke={AC} strokeWidth={2.5}/>
      <text x={430} y={55} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={12} fill="#111">bucket</text>
      <text x={430} y={76} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={22} fontWeight={700} fill={AC}>2</text>
    </svg>
  );
}

export function CollSplashSVG() {
  return (
    <svg width={480} height={185} style={{ marginBottom:12 }}>
      {/* Collection branch */}
      <rect x={80} y={5} width={130} height={26} fill={CH} stroke="#3a72b8" strokeWidth={2} rx={13}/>
      <text x={145} y={23} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={12} fill="#3a72b8">«Collection»</text>
      <line x1={145} y1={31} x2={80} y2={62} stroke={BD} strokeWidth={1.5}/>
      <line x1={145} y1={31} x2={210} y2={62} stroke={BD} strokeWidth={1.5}/>
      {[['«List»',42],['«Set»',172]].map(([l,x])=>(<g key={l}><rect x={x} y={62} width={75} height={24} fill={CH} stroke="#3a72b8" strokeWidth={1.5} rx={12}/><text x={x+37} y={79} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={10} fill="#3a72b8">{l}</text></g>))}
      <line x1={80} y1={86} x2={52} y2={120} stroke={BD} strokeWidth={1.5}/>
      <line x1={80} y1={86} x2={130} y2={120} stroke={BD} strokeWidth={1.5}/>
      <line x1={210} y1={86} x2={188} y2={120} stroke={BD} strokeWidth={1.5}/>
      <line x1={210} y1={86} x2={258} y2={120} stroke={BD} strokeWidth={1.5}/>
      {[['ArrayList',10],['LinkedList',95],['HashSet',160],['TreeSet',228]].map(([l,x])=>(<g key={l}><rect x={x} y={120} width={82} height={22} fill={CH} stroke={BD} strokeWidth={1.5} rx={2}/><text x={x+41} y={136} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill="#111">{l}</text></g>))}

      {/* Map branch — SEPARADO, no extiende Collection */}
      <rect x={345} y={5} width={110} height={26} fill={CH} stroke="#3a72b8" strokeWidth={2} rx={13}/>
      <text x={400} y={23} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={12} fill="#3a72b8">«Map»</text>
      <line x1={370} y1={31} x2={350} y2={62} stroke={BD} strokeWidth={1.5}/>
      <line x1={420} y1={31} x2={420} y2={62} stroke={BD} strokeWidth={1.5}/>
      {[['HashMap',318],['TreeMap',385]].map(([l,x])=>(<g key={l}><rect x={x} y={62} width={78} height={22} fill={CH} stroke={BD} strokeWidth={1.5} rx={2}/><text x={x+39} y={78} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill="#111">{l}</text></g>))}

      {/* Separator note */}
      <line x1={310} y1={0} x2={310} y2={100} stroke="#bbb" strokeWidth={1} strokeDasharray="4 3"/>
      <text x={313} y={115} fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#888">Map no extiende</text>
      <text x={313} y={126} fontFamily="'JetBrains Mono',monospace" fontSize={8} fill="#888">Collection</text>
    </svg>
  );
}
