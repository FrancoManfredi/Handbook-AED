export function leaves(n) {
  return !n.children?.length ? 1 : n.children.reduce((s, c) => s + leaves(c), 0);
}
export function position(n, x1, x2, y, dy = 75) {
  const x = (x1 + x2) / 2;
  if (!n.children?.length) return { ...n, x, y };
  const tot = leaves(n); let cur = x1;
  const children = n.children.map(c => {
    const lc = leaves(c), end = cur + (x2 - x1) * (lc / tot);
    const laid = position(c, cur, end, y + dy, dy);
    cur = end; return laid;
  });
  return { ...n, x, y, children };
}
export function cEdges(n, a = []) {
  (n.children || []).forEach(c => { a.push([n.x, n.y, c.x, c.y]); cEdges(c, a); });
  return a;
}
export function cEdgesL(n, a = []) {
  (n.children || []).forEach(c => {
    a.push({ x1: n.x, y1: n.y, x2: c.x, y2: c.y, ch: c.char, sid: n.id, did: c.id });
    cEdgesL(c, a);
  });
  return a;
}
export function cNodes(n, a = []) {
  a.push(n);
  (n.children || []).forEach(c => cNodes(c, a));
  return a;
}
export function updNode(n, id, d) {
  if (n.id === id) return { ...n, value: Math.max(0, n.value + d) };
  return { ...n, children: (n.children || []).map(c => updNode(c, id, d)) };
}
