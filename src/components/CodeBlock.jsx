import { useState, useEffect } from 'react';
import { AC, BD, BL, TX } from '../constants';

const GRN = '#27ae60';
const ORG = '#e67e22';

// ── Syntax token colors ──────────────────────────────────
function tokenize(line) {
  if (!line.trim()) return [{ t: line, c: null }];
  const tokens = [];
  let rest = line;

  // leading whitespace → preserve
  const indent = rest.match(/^(\s+)/);
  if (indent) { tokens.push({ t: indent[1], c: null, pre: true }); rest = rest.slice(indent[1].length); }

  // comment
  if (rest.startsWith('//') || rest.startsWith('#')) { tokens.push({ t: rest, c: '#7a8799' }); return tokens; }

  // tokenize word by word
  const parts = rest.split(/(\b|\s+|[{}();,<>[\]=+\-*\/!.@])/);
  const KW = new Set(['void','int','boolean','String','return','if','else','for','while','new','null','true','false','class','import','this','static','final','private','public','protected','extends','implements','throws']);
  const TYPES = new Set(['Node','List','Map','Set','Queue','Deque','ArrayList','LinkedList','HashMap','TreeMap','HashSet','TreeSet','ArrayDeque','PriorityQueue','Iterator','T','V','E','K','Object']);

  for (const part of parts) {
    if (!part) continue;
    if (KW.has(part)) tokens.push({ t: part, c: BL });
    else if (TYPES.has(part)) tokens.push({ t: part, c: ORG });
    else if (/^\d+$/.test(part)) tokens.push({ t: part, c: GRN });
    else if (/^".*"$/.test(part)) tokens.push({ t: part, c: GRN });
    else if (/^[{}();,<>[\]]$/.test(part)) tokens.push({ t: part, c: '#888' });
    else tokens.push({ t: part, c: null });
  }
  return tokens;
}

// ── Main CodeBlock ────────────────────────────────────────
export default function CodeBlock({ label, lines, steps = [], visual }) {
  const [step, setStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const max = steps.length;

  useEffect(() => { setStep(-1); setPlaying(false); }, [label]);

  useEffect(() => {
    if (!playing) return;
    if (step >= max - 1) { setPlaying(false); return; }
    const t = setTimeout(() => setStep(s => s + 1), 950);
    return () => clearTimeout(t);
  }, [playing, step, max]);

  const raw = step >= 0 ? steps[step] : undefined;
  const active = Array.isArray(raw) ? raw : [];
  const hasVisual = !!visual;

  return (
    <div style={{ border: `1.5px solid ${BD}`, fontFamily: "'JetBrains Mono',monospace", display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '6px 12px', borderBottom: '1px solid #ccc', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8, background: '#fafaf8' }}>
        <span style={{ fontFamily: "'Lora',serif", fontWeight: 700, fontSize: 12 }}>Implementación:</span>
        <span style={{ fontFamily: "'Lora',serif", fontStyle: 'italic', color: BL, fontSize: 12 }}>{label}</span>
        {step >= 0 && <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: AC, background: '#ffeaed', padding: '1px 7px', border: `1px solid ${AC}` }}>paso {step + 1}/{max}</span>}
      </div>

      {/* Body: code + optional visual side-by-side */}
      <div style={{ display: 'flex', flex: 1 }}>

        {/* Code panel */}
        <div style={{ flex: hasVisual ? '0 0 auto' : 1, minWidth: 0, padding: '8px 4px', background: '#f9f8f4', overflowX: 'auto', borderRight: hasVisual ? '1px solid #ddd' : 'none' }}>
          {(lines || []).map((ln, i) => {
            const hi = active.includes(i);
            const toks = tokenize(ln);
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center',
                background: hi ? '#fff0e6' : 'transparent',
                borderLeft: `3px solid ${hi ? AC : 'transparent'}`,
                padding: '0 8px',
                lineHeight: 1.85, minHeight: 22,
              }}>
                {/* Line number */}
                <span style={{ color: hi ? AC : '#ccc', fontSize: 9, minWidth: 18, textAlign: 'right', marginRight: 10, userSelect: 'none', flexShrink: 0 }}>{i + 1}</span>
                {/* Tokens with preserved whitespace */}
                <span style={{ whiteSpace: 'pre', fontSize: 11.5 }}>
                  {toks.map((tok, ti) => (
                    <span key={ti} style={{ color: tok.c || (hi ? '#c0392b' : '#444') }}>
                      {tok.t}
                    </span>
                  ))}
                </span>
                {hi && <span style={{ marginLeft: 8, color: AC, fontSize: 9, flexShrink: 0 }}>◄</span>}
              </div>
            );
          })}
        </div>

        {/* Visual panel */}
        {hasVisual && (
          <div style={{ flex: 1, minWidth: 0, padding: '8px', background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            {visual(step, active)}
          </div>
        )}
      </div>

      {/* Controls */}
      {max > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderTop: '1px solid #ddd', background: '#fafaf8' }}>
          <button onClick={() => { setStep(-1); setPlaying(false); }}
            style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, background: '#e8e8e3', border: '1px solid #ccc', padding: '2px 7px', cursor: 'pointer', color: '#666' }}>↺</button>
          <input type="range" min={-1} max={max - 1} value={step}
            onChange={e => { setStep(+e.target.value); setPlaying(false); }}
            style={{ flex: 1, accentColor: AC }} />
          <button onClick={() => { if (step >= max - 1) setStep(-1); setPlaying(p => !p); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: AC, fontSize: 20, lineHeight: 1, padding: 0 }}>
            {playing ? '⏸' : '▶'}
          </button>
        </div>
      )}
    </div>
  );
}
