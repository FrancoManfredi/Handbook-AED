export const INIT_TREE = {
  id: 1, value: 1, children: [
    { id: 2, value: 3, children: [{ id: 5, value: 7, children: [] }, { id: 6, value: 2, children: [] }] },
    { id: 3, value: 5, children: [{ id: 7, value: 9, children: [] }] },
    { id: 4, value: 8, children: [] },
  ]
};

export const INIT_TRIE = (() => {
  let nc = 0;
  const root = { id: nc++, children: {}, isEnd: false };
  ['cat', 'car', 'card', 'care', 'bat', 'bad'].forEach(w => {
    let nd = root;
    for (const c of w) {
      if (!nd.children[c]) nd.children[c] = { id: nc++, children: {}, isEnd: false };
      nd = nd.children[c];
    }
    nd.isEnd = true;
  });
  return root;
})();

export function trieToTree(nd, ch) {
  const children = Object.entries(nd.children)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([c, n]) => trieToTree(n, c));
  return { id: nd.id, char: ch, isEnd: nd.isEnd, children };
}

export function trieSearch(trie, word) {
  let nd = trie;
  const path = [nd.id];
  for (const c of word) {
    if (!nd.children[c]) return { path, found: false };
    nd = nd.children[c];
    path.push(nd.id);
  }
  return { path, found: nd.isEnd };
}

export const HS = 7;
export function hsh(key) {
  let h = 0;
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) % 997;
  return Math.abs(h) % HS;
}

export const INIT_HT = (() => {
  const t = Array(HS).fill(null).map((_, i) => ({ idx: i, chain: [] }));
  [['apple','fruta'],['cat','animal'],['hola','greeting'],['key','llave'],['one','1'],['java','lenguaje']]
    .forEach(([k, v]) => t[hsh(k)].chain.push({ k, v }));
  return t;
})();
