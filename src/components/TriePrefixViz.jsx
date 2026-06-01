import { useState } from 'react';
import { AC, BD, BG, TX, BL } from '../constants';
import { INIT_TRIE, trieToTree } from '../data';
import { position, cEdgesL, cNodes } from '../treeUtils';

function getAllWords(trieNode, prefix = '') {
  const results = [];
  if (trieNode.isEnd) results.push(prefix);
  for (const [ch, child] of Object.entries(trieNode.children)) {
    results.push(...getAllWords(child, prefix + ch));
  }
  return results;
}

function getNodeAtPrefix(trie, prefix) {
  let node = trie;
  const pathIds = [node.id];
  for (const ch of prefix) {
    if (!node.children[ch]) return { node: null, pathIds };
    node = node.children[ch];
    pathIds.push(node.id);
  }
  return { node, pathIds };
}

function collectSubtreeIds(trieNode, acc = new Set()) {
  acc.add(trieNode.id);
  for (const child of Object.values(trieNode.children)) collectSubtreeIds(child, acc);
  return acc;
}

export default function TriePrefixViz({ trie = INIT_TRIE }) {
  const [prefix, setPrefix] = useState('');

  const { node: prefixNode, pathIds } = prefix ? getNodeAtPrefix(trie, prefix) : { node: trie, pathIds: [trie.id] };
  const pathSet = new Set(pathIds);
  const subtreeIds = prefixNode ? collectSubtreeIds(prefixNode) : new Set();
  const matchedWords = prefixNode ? getAllWords(prefixNode, prefix) : [];

  const laid = position(trieToTree(trie, ''), 15, 435, 40, 58);
  const nodes = cNodes(laid);
  const edges = cEdgesL(laid);

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
        <input value={prefix}
          onChange={e => setPrefix(e.target.value.toLowerCase().replace(/[^a-z]/g, ''))}
          placeholder="escribe un prefijo... (b, ba, ca, car...)"
          style={{ border: `1.5px solid ${BD}`, padding: '4px 10px', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: TX, background: '#f9f8f4', outline: 'none', flex: 1 }} />
        <button onClick={() => setPrefix('')}
          style={{ background: '#888', color: '#fff', border: 'none', padding: '4px 12px', cursor: 'pointer', fontSize: 12, fontFamily: "'JetBrains Mono',monospace" }}>
          LIMPIAR
        </button>
      </div>
      <svg width={445} height={295} style={{ overflow: 'visible', display: 'block' }}>
        {edges.map((e, i) => {
          const onPath = pathSet.has(e.sid) && pathSet.has(e.did);
          const inSubtree = subtreeIds.has(e.sid) && subtreeIds.has(e.did) && !onPath;
          const mx = (e.x1 + e.x2) / 2, my = (e.y1 + e.y2) / 2;
          return (
            <g key={i}>
              <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
                stroke={onPath ? AC : inSubtree ? BL : '#ccc'}
                strokeWidth={onPath ? 2.5 : inSubtree ? 2 : 1.5} />
              <circle cx={mx} cy={my} r={9}
                fill={onPath ? AC : inSubtree ? '#dce8fa' : BG}
                stroke={onPath ? AC : inSubtree ? BL : '#bbb'} strokeWidth={1} />
              <text x={mx} y={my + 4} textAnchor="middle" fontFamily="'JetBrains Mono',monospace"
                fontSize={10} fontWeight={700}
                fill={onPath ? '#fff' : inSubtree ? BL : '#999'}>{e.ch}</text>
            </g>
          );
        })}
        {nodes.map(n => {
          const onPath = pathSet.has(n.id) && n.id !== trie.id;
          const inSubtree = subtreeIds.has(n.id) && !pathSet.has(n.id);
          const isRoot = n.id === trie.id;
          return (
            <g key={n.id}>
              <circle cx={n.x} cy={n.y} r={isRoot ? 10 : 18}
                fill={onPath ? AC : inSubtree ? '#dce8fa' : n.isEnd ? '#f5c0c8' : '#fff'}
                stroke={onPath ? AC : inSubtree ? BL : n.isEnd ? AC : '#ccc'}
                strokeWidth={onPath || inSubtree ? 2.5 : 1.5} />
              {isRoot && <text x={n.x} y={n.y + 4} textAnchor="middle" fontFamily="'JetBrains Mono',monospace" fontSize={9} fill={TX}>●</text>}
              {n.isEnd && !isRoot && <circle cx={n.x} cy={n.y} r={5} fill={onPath ? '#fff' : AC} />}
            </g>
          );
        })}
      </svg>
      <div style={{ marginTop: 6, minHeight: 32 }}>
        {prefix && prefixNode && matchedWords.length > 0 && (
          <div style={{ fontFamily: "'Lora',serif", fontSize: 12 }}>
            <span style={{ fontStyle: 'italic', color: BL }}>palabras con prefijo "{prefix}": </span>
            {matchedWords.map((w, i) => (
              <span key={i} style={{ marginRight: 8, color: AC, fontWeight: 700, fontFamily: "'JetBrains Mono',monospace" }}>{w}</span>
            ))}
          </div>
        )}
        {prefix && !prefixNode && (
          <span style={{ fontFamily: "'Lora',serif", fontSize: 12, color: AC, fontWeight: 700 }}>
            prefijo "{prefix}" no existe en el trie ✗
          </span>
        )}
      </div>
    </div>
  );
}
