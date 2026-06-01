import { AC, BD, TX } from '../constants';
import { position, cEdges, cNodes, updNode } from '../treeUtils';

export default function TreeViz({ tree, onUpdate, w = 440, h = 258 }) {
  const laid = position(tree, 28, w - 28, 42);
  const edges = cEdges(laid), nodes = cNodes(laid);
  return (
    <div>
      <div style={{ fontFamily: "'Lora',serif", fontSize: 11, color: AC, textAlign: 'center', marginBottom: 4, fontStyle: 'italic' }}>
        árbol genérico (n-ario)
      </div>
      <svg width={w} height={h} style={{ overflow: 'visible', display: 'block', margin: '0 auto' }}>
        {edges.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={BD} strokeWidth={1.5} />)}
        {nodes.map(n => (
          <g key={n.id} style={{ cursor: 'pointer' }}
            onClick={() => onUpdate(updNode(tree, n.id, 1))}
            onContextMenu={e => { e.preventDefault(); onUpdate(updNode(tree, n.id, -1)); }}>
            <circle cx={n.x} cy={n.y} r={21} fill="#fff" stroke={BD} strokeWidth={1.5} />
            <text x={n.x} y={n.y + 5} textAnchor="middle" fontFamily="'Lora',serif" fontSize={13} fill={TX}>{n.value}</text>
          </g>
        ))}
        {nodes.filter(n => !n.children?.length).map(n =>
          <circle key={`nl${n.id}`} cx={n.x} cy={n.y + 31} r={5} fill={AC} />
        )}
      </svg>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#777', textAlign: 'center', marginTop: 4 }}>
        clic: +1 | clic derecho: −1
      </div>
    </div>
  );
}
