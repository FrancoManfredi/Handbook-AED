import { AC, BD, BG, CH, TX } from '../constants';

export function Splash({ number, title, visual }) {
  return (
    <div style={{ width: '100%', height: '100%', background: CH, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {visual}
      <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 40, color: BD, letterSpacing: 3, textAlign: 'center', marginTop: 4 }}>
        {title.toUpperCase()}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: BD, marginTop: 10, letterSpacing: 6, opacity: 0.6 }}>
        {number}
      </div>
    </div>
  );
}

export function TwoCol({ title, badge, left, right, num }) {
  return (
    <div style={{ width: '100%', height: '100%', background: BG, display: 'flex', flexDirection: 'column', padding: '28px 44px 22px', position: 'relative', fontFamily: "'Lora',serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, flexShrink: 0 }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 33, color: TX, margin: 0 }}>{title}</h1>
        <div style={{ border: `1.5px solid ${BD}`, padding: '3px 11px', fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, letterSpacing: 1.5, color: TX, flexShrink: 0 }}>{badge}</div>
      </div>
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, overflow: 'hidden' }}>
        <div style={{ fontSize: 13.5, lineHeight: 1.8, textAlign: 'justify', color: TX, overflowY: 'auto' }}>{left}</div>
        <div style={{ overflowY: 'auto' }}>{right}</div>
      </div>
      <div style={{ position: 'absolute', bottom: 12, left: 18, fontFamily: "'Lora',serif", fontSize: 15, fontWeight: 700, color: AC }}>{num}</div>
    </div>
  );
}

export function FullPg({ title, badge, content, num }) {
  return (
    <div style={{ width: '100%', height: '100%', background: BG, display: 'flex', flexDirection: 'column', padding: '28px 44px 22px', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, flexShrink: 0 }}>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontWeight: 900, fontSize: 33, color: TX, margin: 0 }}>{title}</h1>
        <div style={{ border: `1.5px solid ${BD}`, padding: '3px 11px', fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5, letterSpacing: 1.5, color: TX }}>{badge}</div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>{content}</div>
      <div style={{ position: 'absolute', bottom: 12, left: 18, fontFamily: "'Lora',serif", fontSize: 15, fontWeight: 700, color: AC }}>{num}</div>
    </div>
  );
}
