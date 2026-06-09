import { useState, useEffect } from 'react';
import { AC, CHAPTERS, TOTAL } from './constants';
import { INIT_TREE } from './data';
import { pages as treePages } from './pages/GenericTrees';
import { pages as triePages } from './pages/Tries';
import { pages as hashPages } from './pages/Hashing';
import { pages as collPages } from './pages/Collections';
import { pages as extraPages } from './pages/Extra';
import { pages as grafosPages, floydPages } from './pages/Grafos';
import { pages as grafosNDPages } from './pages/GrafosND';

export default function App() {
  const [page, setPage] = useState(0);
  const [tree, setTree] = useState(INIT_TREE);

  const allPages = [
    ...treePages(tree, setTree), // 0-6   (7)
    ...triePages(),              // 7-13  (7)
    ...hashPages(),              // 14-19 (6)
    ...collPages(),              // 20-27 (8)
    ...grafosPages(),            // 28-40 (13)
    ...floydPages(),             // 41-43 (3)
    ...grafosNDPages(),          // 43-52 (10)
    ...extraPages(tree),         // 53    (1) ← Resumen al final
  ];

  useEffect(() => {
    const h = e => {
      if (e.key === 'ArrowRight') setPage(p => Math.min(TOTAL - 1, p + 1));
      if (e.key === 'ArrowLeft')  setPage(p => Math.max(0, p - 1));
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const chap = CHAPTERS.slice().reverse().find(c => page >= c.start);

  return (
    <div style={{ minHeight: '100vh', background: '#b0b0ad', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 14, gap: 12 }}>

      <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        {CHAPTERS.map(c => (
          <button key={c.id} onClick={() => setPage(c.start)}
            style={{ background: chap?.id === c.id ? AC : '#777', color: '#fff', border: 'none', padding: '5px 16px', cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, letterSpacing: 1 }}>
            {c.label.toUpperCase()}
          </button>
        ))}
      </div>

      <div style={{ width: '100%', maxWidth: 1200, height: 670, boxShadow: '0 12px 50px rgba(0,0,0,0.4)', overflow: 'hidden', position: 'relative' }}>
        {allPages[page]?.()}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
          style={{ background: page === 0 ? '#888' : AC, color: '#fff', border: 'none', padding: '8px 22px', cursor: page === 0 ? 'not-allowed' : 'pointer', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: 1 }}>
          ← ANTERIOR
        </button>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: '#333', minWidth: 80, textAlign: 'center' }}>
          {page + 1} / {TOTAL}
        </div>
        <button onClick={() => setPage(p => Math.min(TOTAL - 1, p + 1))} disabled={page === TOTAL - 1}
          style={{ background: page === TOTAL - 1 ? '#888' : AC, color: '#fff', border: 'none', padding: '8px 22px', cursor: page === TOTAL - 1 ? 'not-allowed' : 'pointer', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: 1 }}>
          SIGUIENTE →
        </button>
      </div>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#666' }}>
        ← → teclas de flecha para navegar
      </div>
    </div>
  );
}
