import { useState } from 'react';
import { AC, BD, BL, TX } from '../constants';

const N = 9;
const KEYS = ['EN','TO','TRE','FIRE','FEM','SEKS','SYV'];

function charCode(s) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0));
  return h;
}
function H(k) { return Math.abs(charCode(k)) % N; }

function probeSequence(key, table, mode) {
  const h0 = H(key);
  const seq = [h0];
  let i = 1;
  while (table[seq[seq.length - 1]] !== null && table[seq[seq.length - 1]] !== key && i < N) {
    let next;
    if (mode === 'linear')    next = (h0 + i) % N;
    else                      next = (h0 + i * i) % N;
    seq.push(next);
    i++;
  }
  return seq;
}

export default function OpenAddressingViz() {
  const [table, setTable] = useState(Array(N).fill(null));
  const [keyIdx, setKeyIdx] = useState(0);
  const [mode, setMode] = useState('linear');
  const [probing, setProbing] = useState(null);
  const [inserted, setInserted] = useState(null);

  function next() {
    if (keyIdx >= KEYS.length) return;
    const key = KEYS[keyIdx];
    const seq = probeSequence(key, table, mode);
    const slot = seq[seq.length - 1];
    const newTable = [...table];
    newTable[slot] = key;
    setTable(newTable);
    setProbing(seq);
    setInserted({ key, slot, h0: H(key), seq });
    setKeyIdx(k => k + 1);
  }

  function reset() {
    setTable(Array(N).fill(null));
    setKeyIdx(0);
    setProbing(null);
    setInserted(null);
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        {['linear','cuadratica'].map(m => (
          <button key={m} onClick={() => { setMode(m); reset(); }}
            style={{ background: mode === m ? AC : '#ddd', color: mode === m ? '#fff' : TX, border: 'none', padding: '4px 12px', cursor: 'pointer', fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }}>
            {m === 'linear' ? 'Lineal: (h0+i) mod N' : 'Cuadrática: (h0+i²) mod N'}
          </button>
        ))}
      </div>

      {/* Array visual */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 12 }}>
        {table.map((cell, i) => {
          const isProbed = probing?.includes(i);
          const isInserted = inserted?.slot === i;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#888', marginBottom: 2 }}>{i}</div>
              <div style={{
                width: 46, height: 34, border: `2px solid ${isInserted ? AC : isProbed ? BL : BD}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isInserted ? '#ffeaed' : isProbed ? '#dce8fa' : cell ? '#f0f0ec' : '#fff',
                fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700,
                color: isInserted ? AC : isProbed ? BL : TX,
                transition: 'all 0.3s'
              }}>
                {cell ?? '—'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Info box */}
      {inserted && (
        <div style={{ background: '#f9f8f4', border: `1.5px solid ${BD}`, padding: '8px 12px', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, marginBottom: 10, lineHeight: 1.9 }}>
          <span style={{ color: '#888' }}>clave: </span><span style={{ color: AC, fontWeight: 700 }}>{inserted.key}</span>
          {'  '}
          <span style={{ color: '#888' }}>h0 = H({inserted.key}) = </span><span style={{ color: BL }}>{inserted.h0}</span>
          {'  '}
          <span style={{ color: '#888' }}>sondeo: </span>
          {inserted.seq.map((s, i) => (
            <span key={i} style={{ color: i === inserted.seq.length - 1 ? AC : '#888', fontWeight: i === inserted.seq.length - 1 ? 700 : 400 }}>
              {i > 0 ? '→' : ''}{s}
            </span>
          ))}
          {'  '}
          <span style={{ color: AC }}>→ insertado en [{inserted.slot}] ✓</span>
        </div>
      )}

      {/* Pending keys */}
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, marginBottom: 10 }}>
        <span style={{ color: '#888' }}>pendientes: </span>
        {KEYS.slice(keyIdx).map((k, i) => (
          <span key={k} style={{ marginRight: 8, color: i === 0 ? AC : TX, fontWeight: i === 0 ? 700 : 400 }}>{k}</span>
        ))}
        {keyIdx >= KEYS.length && <span style={{ color: BL }}>todos insertados ✓</span>}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={next} disabled={keyIdx >= KEYS.length}
          style={{ background: keyIdx >= KEYS.length ? '#888' : AC, color: '#fff', border: 'none', padding: '6px 18px', cursor: keyIdx >= KEYS.length ? 'not-allowed' : 'pointer', fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>
          INSERTAR "{KEYS[keyIdx] ?? '—'}" →
        </button>
        <button onClick={reset}
          style={{ background: '#555', color: '#fff', border: 'none', padding: '6px 14px', cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>
          RESET
        </button>
      </div>
    </div>
  );
}
