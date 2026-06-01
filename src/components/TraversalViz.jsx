import { useState, useEffect } from 'react';
import { AC, BD, TX } from '../constants';
import { position, cEdges, cNodes } from '../treeUtils';

export default function TraversalViz({ tree }) {
  const [mode, setMode] = useState('pre');
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);

  function preO(n, a = []) { a.push(n.id); (n.children || []).forEach(c => preO(c, a)); return a; }
  function postO(n, a = []) { (n.children || []).forEach(c => postO(c, a)); a.push(n.id); return a; }
  const order = mode === 'pre' ? preO(tree) : postO(tree);

  useEffect(() => { setStep(-1); setPlaying(false); }, [mode]);
  useEffect(() => {
    if (!playing) return;
    if (step >= order.length - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStep(s => s + 1), 700);
    return () => clearTimeout(t);
  }, [playing, step, order.length]);

  const visited = new Set(order.slice(0, step + 1));
  const current = step >= 0 ? order[step] : null;
  const laid = position(tree, 28, 440 - 28, 42);
  const nodes = cNodes(laid);
  const edges = cEdges(laid);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        {[['pre', 'Preorden'], ['post', 'Postorden']].map(([k, l]) => (
          <button key={k} onClick={() => setMode(k)}
            style={{ background: mode === k ? AC : '#ddd', color: mode === k ? '#fff' : TX, border: 'none', padding: '4px 14px', cursor: 'pointer', fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>
            {l}
          </button>
        ))}
      </div>
      <svg width={440} height={258} style={{ overflow: 'visible', display: 'block' }}>
        {edges.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={BD} strokeWidth={1.5} />)}
        {nodes.map(n => {
          const iC = n.id === current, isV = visited.has(n.id) && !iC;
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={21} fill={iC ? AC : isV ? '#f5c0c8' : '#fff'} stroke={iC ? AC : BD} strokeWidth={iC ? 2.5 : 1.5} />
              <text x={n.x} y={n.y + 5} textAnchor="middle" fontFamily="'Lora',serif" fontSize={13} fill={iC ? '#fff' : TX}>{n.value}</text>
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: AC }} />
        <input type="range" min={-1} max={order.length - 1} value={step}
          onChange={e => { setStep(+e.target.value); setPlaying(false); }}
          style={{ flex: 1, accentColor: AC }} />
        <button onClick={() => { if (step >= order.length - 1) setStep(-1); setPlaying(p => !p); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: AC, fontSize: 22, lineHeight: 1, padding: 0 }}>
          {playing ? '⏸' : '▶'}
        </button>
      </div>
      {step >= 0 && (
        <div style={{ marginTop: 6, fontFamily: "'Lora',serif", fontSize: 12, color: TX }}>
          <span style={{ fontStyle: 'italic', color: '#3a72b8' }}>secuencia: </span>
          {order.slice(0, step + 1).map((id, i) => {
            const n = nodes.find(x => x.id === id);
            return <span key={i} style={{ marginRight: 5, color: i === step ? AC : TX, fontWeight: i === step ? 700 : 400 }}>{n?.value}</span>;
          })}
        </div>
      )}
    </div>
  );
}
