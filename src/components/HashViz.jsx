import { useState } from 'react';
import { AC, BD, BL, TX } from '../constants';
import { INIT_HT, HS, hsh } from '../data';

export default function HashViz() {
  const [table, setTable] = useState(INIT_HT);
  const [key, setKey] = useState('');
  const [val, setVal] = useState('');
  const [lastHash, setLastHash] = useState(null);

  function addEntry() {
    if (!key.trim() || !val.trim()) return;
    const idx = hsh(key);
    setLastHash({ key, idx });
    setTable(prev => prev.map((b, i) =>
      i === idx ? { ...b, chain: [...b.chain.filter(e => e.k !== key), { k: key, v: val }] } : b
    ));
    setKey(''); setVal('');
  }

  return (
    <div>
      {lastHash && (
        <div style={{ fontFamily: "'Lora',serif", fontSize: 12, marginBottom: 8, padding: '5px 10px', background: '#ffeaed', border: `1px solid ${AC}` }}>
          <span style={{ fontStyle: 'italic', color: BL }}>hash(</span>
          <span style={{ color: AC, fontFamily: "'JetBrains Mono',monospace" }}>"{lastHash.key}"</span>
          <span style={{ fontStyle: 'italic', color: BL }}>) % {HS} = </span>
          <strong style={{ color: AC, fontSize: 15 }}>{lastHash.idx}</strong>
          <span style={{ color: '#888', marginLeft: 8, fontSize: 11 }}>→ bucket[{lastHash.idx}]</span>
        </div>
      )}
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>
        {table.map((b, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
            <div style={{ width: 27, height: 27, border: `1.5px solid ${BD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: lastHash?.idx === i ? AC : '#777', background: lastHash?.idx === i ? '#ffeaed' : '#f0f0ec', flexShrink: 0, fontSize: 12 }}>{i}</div>
            <div style={{ width: 12, borderTop: '1px solid #999', height: 1 }} />
            {b.chain.length === 0
              ? <span style={{ color: '#bbb', fontSize: 11 }}>null</span>
              : b.chain.map((e, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center' }}>
                  {j > 0 && <span style={{ color: AC, margin: '0 3px', fontSize: 12 }}>→</span>}
                  <div style={{ border: `1.5px solid ${BD}`, padding: '2px 8px', background: lastHash?.idx === i && j === b.chain.length - 1 ? '#ffeaed' : '#fff', display: 'flex', gap: 4 }}>
                    <span style={{ color: AC }}>{e.k}</span><span style={{ color: '#bbb' }}>:</span><span style={{ color: BL }}>{e.v}</span>
                  </div>
                </div>
              ))
            }
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
        <input value={key} onChange={e => setKey(e.target.value)} placeholder="clave" onKeyDown={e => e.key === 'Enter' && addEntry()}
          style={{ border: `1.5px solid ${BD}`, padding: '4px 8px', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, flex: 1, background: '#f9f8f4', outline: 'none' }} />
        <input value={val} onChange={e => setVal(e.target.value)} placeholder="valor" onKeyDown={e => e.key === 'Enter' && addEntry()}
          style={{ border: `1.5px solid ${BD}`, padding: '4px 8px', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, flex: 1, background: '#f9f8f4', outline: 'none' }} />
        <button onClick={addEntry}
          style={{ background: AC, color: '#fff', border: 'none', padding: '4px 16px', cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", fontSize: 12, letterSpacing: 1 }}>
          PUT
        </button>
      </div>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#888', marginTop: 4 }}>
        Enter o click PUT para agregar | duplicados reemplazan el valor
      </div>
    </div>
  );
}
