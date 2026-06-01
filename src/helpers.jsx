import { AC } from './constants';

export const S = (s) => <strong>{s}</strong>;
export const C = (s) => <code style={{ color: AC, fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5 }}>{s}</code>;
export const P = ({ children, mt = 0 }) => <p style={{ margin: `${mt}px 0 10px` }}>{children}</p>;
export const UL = ({ items }) => (
  <ul style={{ paddingLeft: 18, lineHeight: 2.1, margin: '4px 0 10px' }}>
    {items.map((it, i) => <li key={i}>{it}</li>)}
  </ul>
);
