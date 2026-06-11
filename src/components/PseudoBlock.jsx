import { useState, useEffect } from 'react';
import { AC, BL, BD, TX } from '../constants';

const GRN = '#27ae60';
const ORG = '#e67e22';

// Keyword sets for pseudocode coloring
const KEYWORDS = new Set(['Para','todo','hacer','FinPara','Si','entonces','Sino','SiNo','FinSi',
  'Mientras','FinMientras','Repetir','Hasta','devolver','return','Elegir','Agregar','agregar',
  'min','max','AND','OR','NOT','null','true','false','nulo','crear','procedure','fin','Fin',
  'Para cada','método','De','SiNo']);
const ARROWS = /←|→|≠|≤|≥|∈|∉|⊆|∅/g;

function colorLine(line, isActive) {
  if (!line.trim()) return <span>&nbsp;</span>;

  const commentMatch = line.match(/^(\s*)(\/\/.*|#.*)$/);
  if (commentMatch) {
    return <span style={{ whiteSpace: 'pre' }}>
      <span>{commentMatch[1]}</span>
      <span style={{ color: '#7a8799', fontStyle: 'italic' }}>{commentMatch[2]}</span>
    </span>;
  }

  // preserve leading whitespace
  const indentMatch = line.match(/^(\s+)/);
  const indent = indentMatch ? indentMatch[1] : '';
  const rest = line.slice(indent.length);

  // split on word boundaries and operators
  const tokens = rest.split(/(\b|\s+|[←→≠≤≥∈∉⊆∅{}();,[\]=+\-*/<>!.@])/);
  const colored = tokens.map((tok, i) => {
    if (!tok) return null;
    if (KEYWORDS.has(tok)) return <span key={i} style={{ color: BL, fontWeight: 600 }}>{tok}</span>;
    if (/^[←→≠≤≥∈∉⊆∅]$/.test(tok)) return <span key={i} style={{ color: ORG, fontWeight: 600 }}>{tok}</span>;
    if (/^\d+$/.test(tok)) return <span key={i} style={{ color: GRN }}>{tok}</span>;
    if (/^[{}();,[\]]$/.test(tok)) return <span key={i} style={{ color: '#888' }}>{tok}</span>;
    return <span key={i} style={{ color: isActive ? '#c0392b' : '#444' }}>{tok}</span>;
  });

  return <span style={{ whiteSpace: 'pre' }}><span>{indent}</span>{colored}</span>;
}

export default function PseudoBlock({ label, lines, steps = [], visual }) {
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const max = steps.length;

  useEffect(() => { setStep(-1); setPlaying(false); }, [label]);

  useEffect(() => {
    if (!playing) return;
    if (step >= max - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStep(s => s + 1), 1000);
    return () => clearTimeout(t);
  }, [playing, step, max]);

  const raw = step >= 0 ? steps[step] : undefined;
  const active = Array.isArray(raw) ? raw : [];
  const hasVisual = !!visual;
  const hasControls = max > 0;

  return (
    <div style={{ border: `1.5px solid #ccc`, fontFamily: "'JetBrains Mono',monospace", marginBottom: 10 }}>

      {/* Header */}
      <div style={{ padding: '5px 10px', borderBottom: '1px solid #ddd', fontSize: 11, display: 'flex', alignItems: 'center', gap: 8, background: '#f0f0ec' }}>
        <span style={{ color: '#888', fontSize: 9, letterSpacing: 1 }}>PSEUDOCÓDIGO</span>
        <span style={{ color: BD, fontWeight: 700, fontSize: 11 }}>{label}</span>
        {step >= 0 && <span style={{ marginLeft: 'auto', fontSize: 9, color: AC, background: '#ffeaed', padding: '1px 6px', border: `1px solid ${AC}` }}>paso {step + 1}/{max}</span>}
      </div>

      {/* Body */}
      <div style={{ display: 'flex' }}>

        {/* Code */}
        <div style={{ flex: hasVisual ? '0 0 auto' : 1, padding: '8px 4px', background: '#f9f8f4', overflowX: 'auto', borderRight: hasVisual ? '1px solid #eee' : 'none', minWidth: 0 }}>
          {(lines || []).map((ln, i) => {
            const hi = active.includes(i);
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center',
                background: hi ? '#fff0e6' : 'transparent',
                borderLeft: `3px solid ${hi ? AC : 'transparent'}`,
                padding: '0 8px', lineHeight: 1.9, minHeight: 21,
              }}>
                <span style={{ color: hi ? AC : '#ddd', fontSize: 8.5, minWidth: 16, textAlign: 'right', marginRight: 8, userSelect: 'none', flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 11 }}>{colorLine(ln, hi)}</span>
                {hi && <span style={{ marginLeft: 6, color: AC, fontSize: 8, flexShrink: 0 }}>◄</span>}
              </div>
            );
          })}
        </div>

        {/* Visual panel */}
        {hasVisual && (
          <div style={{ flex: 1, minWidth: 180, maxWidth: 260, padding: '8px', background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderLeft: '1px solid #eee' }}>
            {step < 0
              ? <div style={{ color: '#ccc', fontFamily: "'JetBrains Mono',monospace", fontSize: 9, textAlign: 'center' }}>▶ para ver<br/>animación</div>
              : visual(step, active)
            }
          </div>
        )}
      </div>

      {/* Controls */}
      {hasControls && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 10px', borderTop: '1px solid #ddd', background: '#f0f0ec' }}>
          <button onClick={() => { setStep(-1); setPlaying(false); }}
            style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, background: '#e0e0dc', border: '1px solid #ccc', padding: '1px 6px', cursor: 'pointer', color: '#666' }}>↺</button>
          <input type="range" min={-1} max={max - 1} value={step}
            onChange={e => { setStep(+e.target.value); setPlaying(false); }}
            style={{ flex: 1, accentColor: AC }} />
          <button onClick={() => { if (step >= max - 1) setStep(-1); setPlaying(p => !p); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: AC, fontSize: 19, lineHeight: 1, padding: 0 }}>
            {playing ? '⏸' : '▶'}
          </button>
        </div>
      )}
    </div>
  );
}
