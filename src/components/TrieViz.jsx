import { useState, useEffect } from 'react';
import { AC, BD, BG, TX } from '../constants';
import { position, cEdgesL, cNodes } from '../treeUtils';
import { INIT_TRIE, trieToTree, trieSearch } from '../data';

export default function TrieViz({ trie = INIT_TRIE }) {
  const [query, setQuery] = useState('');
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);

  const { path, found } = query ? trieSearch(trie, query) : { path: [], found: false };
  const maxStep = path.length - 1;

  useEffect(() => { setStep(-1); setPlaying(false); }, [query]);
  useEffect(() => {
    if (!playing) return;
    if (step >= maxStep) { setPlaying(false); return; }
    const t = setTimeout(() => setStep(s => s + 1), 700);
    return () => clearTimeout(t);
  }, [playing, step, maxStep]);

  const activeIds = new Set(path.slice(0, step + 1));
  const laid = position(trieToTree(trie, ''), 15, 435, 40, 58);
  const nodes = cNodes(laid);
  const edges = cEdgesL(laid);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input value={query}
          onChange={e => setQuery(e.target.value.toLowerCase().replace(/[^a-z]/g, ''))}
          placeholder="escribe una palabra... (cat, car, bat...)"
          style={{ border: `1.5px solid ${BD}`, padding: '4px 10px', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: TX, background: '#f9f8f4', outline: 'none', flex: 1 }} />
        <button onClick={() => { if (step >= maxStep) setStep(-1); setPlaying(p => !p); }}
          disabled={!query}
          style={{ background: !query ? '#aaa' : AC, color: '#fff', border: 'none', padding: '4px 14px', cursor: !query ? 'default' : 'pointer', fontSize: 20 }}>
          {playing ? '⏸' : '▶'}
        </button>
      </div>
      <svg width={445} height={300} style={{ overflow: 'visible', display: 'block' }}>
        {edges.map((e, i) => {
          const isA = activeIds.has(e.sid) && activeIds.has(e.did);
          const mx = (e.x1 + e.x2) / 2, my = (e.y1 + e.y2) / 2;
          return (
            <g key={i}>
              <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={isA ? AC : BD} strokeWidth={isA ? 2.5 : 1.5} />
              <circle cx={mx} cy={my} r={9} fill={isA ? AC : BG} stroke={isA ? AC : '#bbb'} strokeWidth={1} />
              <text x={mx} y={my + 4} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={10} fontWeight={700} fill={isA ? '#fff' : BD}>{e.ch}</text>
            </g>
          );
        })}
        {nodes.map(n => {
          const isA = activeIds.has(n.id);
          const isRoot = n.id === trie.id;
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={isRoot ? 10 : 18}
                fill={isA ? (n.isEnd ? AC : '#ffeaed') : (n.isEnd ? '#f5c0c8' : '#fff')}
                stroke={isA ? AC : (n.isEnd ? AC : BD)} strokeWidth={isA ? 2.5 : 1.5} />
              {isRoot && <text x={n.x} y={n.y + 4} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={TX}>●</text>}
              {n.isEnd && !isRoot && <circle cx={n.x} cy={n.y} r={5} fill={isA ? '#fff' : AC} />}
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: AC }} />
        <input type="range" min={-1} max={Math.max(0, maxStep)} value={step}
          onChange={e => { setStep(+e.target.value); setPlaying(false); }}
          style={{ flex: 1, accentColor: AC }} />
      </div>
      {query && step >= 0 && (
        <div style={{ fontFamily: "'Lora',serif", fontSize: 12, color: TX, marginTop: 5 }}>
          {step < query.length
            ? <><span style={{ fontStyle: 'italic', color: '#3a72b8' }}>buscando: </span><span style={{ color: AC, fontWeight: 700 }}>{query.slice(0, step + 1)}</span><span style={{ color: '#aaa' }}>{query.slice(step + 1)}</span></>
            : <span style={{ color: found ? '#3a72b8' : AC, fontWeight: 700 }}>{found ? `"${query}" encontrado ✓` : `"${query}" no existe ✗`}</span>
          }
        </div>
      )}
    </div>
  );
}
