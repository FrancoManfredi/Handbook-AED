import { useState, useEffect } from 'react';
import { AC, CHAPTERS, TOTAL } from './constants';
import { INIT_TREE } from './data';
import { pages as treePages } from './pages/GenericTrees';
import { pages as triePages } from './pages/Tries';
import { pages as hashPages } from './pages/Hashing';
import { pages as collPages } from './pages/Collections';
import { pages as extraPages } from './pages/Extra';

export default function App() {
  const [page, setPage] = useState(0);
  const [tree, setTree] = useState(INIT_TREE);

  const allPages = [
    ...treePages(tree, setTree),
    ...triePages(),
    ...hashPages(),
    ...collPages(),
    ...extraPages(tree),
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

      {/* Chapter tabs */}
      <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        {CHAPTERS.map(c => (
          <button key={c.id} onClick={() => setPage(c.start)}
            style={{ background: chap?.id === c.id ? AC : '#777', color: '#fff', border: 'none', padding: '5px 16px', cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, letterSpacing: 1 }}>
            {c.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Book */}
      <div style={{ width: '100%', maxWidth: 1200, height: 670, boxShadow: '0 12px 50px rgba(0,0,0,0.4)', overflow: 'hidden', position: 'relative' }}>
        {allPages[page]?.()}
      </div>

      {/* Navigation */}
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
