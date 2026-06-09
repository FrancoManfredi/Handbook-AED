import { useState, useEffect } from 'react';
import { AC, BD, BL } from '../constants';

export default function CodeBlock({ label, lines, steps = [] }) {
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const max = steps.length;

  // Reset when lines change (page navigation)
  useEffect(() => {
    setStep(-1);
    setPlaying(false);
  }, [label]);

  useEffect(() => {
    if (!playing) return;
    if (step >= max - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStep(s => s + 1), 850);
    return () => clearTimeout(t);
  }, [playing, step, max]);

  // Defensive: active is always an array
  const raw = step >= 0 ? steps[step] : undefined;
  const active = Array.isArray(raw) ? raw : [];

  return (
    <div style={{ border: `1.5px solid ${BD}`, fontFamily: "'JetBrains Mono',monospace" }}>
      <div style={{ padding: '8px 12px', borderBottom: '1px solid #ccc', fontSize: 13 }}>
        <span style={{ fontFamily: "'Lora',serif", fontWeight: 700 }}>Implementación : </span>
        <span style={{ fontFamily: "'Lora',serif", fontStyle: 'italic', color: BL }}>{label}</span>
      </div>
      <div style={{ padding: '10px 12px', background: '#f9f8f4', minHeight: 90 }}>
        {(lines || []).map((ln, i) => {
          const hi = active.includes(i);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', background: hi ? '#ffeaed' : 'transparent', borderLeft: `3px solid ${hi ? AC : 'transparent'}`, padding: '1px 6px', lineHeight: 1.85, fontSize: 12 }}>
              {hi && <span style={{ color: AC, marginRight: 5, fontSize: 8 }}>●</span>}
              <span style={{ color: AC }}>{ln}</span>
            </div>
          );
        })}
      </div>
      {max > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderTop: '1px solid #ccc' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: AC }} />
          <input type="range" min={-1} max={max - 1} value={step}
            onChange={e => { setStep(+e.target.value); setPlaying(false); }}
            style={{ flex: 1, accentColor: AC }} />
          <button onClick={() => { if (step >= max - 1) setStep(-1); setPlaying(p => !p); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: AC, fontSize: 22, lineHeight: 1, padding: 0 }}>
            {playing ? '⏸' : '▶'}
          </button>
        </div>
      )}
    </div>
  );
}
