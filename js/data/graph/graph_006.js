// graph_006: クラスカル法（最小全域木）★4 (C++)
// 貪欲法とUnion-Findを組み合わせてMSTを構築するアルゴリズム
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'graph_006',
  title: 'クラスカル法（最小全域木）',
  category: 'graph',
  categoryLabel: 'グラフ理論',
  difficulty: 4,
  language: 'cpp',
  description: '【クラスカル法とは】グラフのすべての頂点を結ぶ辺の部分集合のうち、辺の重みの総和が最小になるもの（最小全域木：MST）を求めるアルゴリズムです。\n\n辺を重みの小さい順にソートし、Union-Findを使って「閉路ができない場合のみ辺を採用する」という貪欲法（Greedy）を行います。\n\n与えられた Edge 構造体の配列 edges を用い、クラスカル法で最小全域木のコストの総和を計算する関数 kruskal を完成させよ。Union-Find (uf) は実装済みとする。',
  inputFormat: {
    params: [
      { name: 'V', type: 'int', desc: '頂点数' },
      { name: 'edges', type: 'vector<Edge>', desc: '辺のリスト' },
    ],
    note: '戻り値: long long (最小全域木のコスト総和)\n制約: 1 ≤ V ≤ 10^5, 0 ≤ E ≤ 10^5',
  },
  pinnedCode: [
    '#include <bits/stdc++.h>',
    'using namespace std;',
    '',
    'struct Edge { int u, v, cost; };',
    '// bool operator<(const Edge& a, const Edge& b) は定義済みとする',
    '// struct UnionFind { ... } は定義済みとする'
  ],
  blocks: [
    { id: 0,  code: 'long long kruskal(int V, vector<Edge>& edges) {' },
    { id: 1,  code: '    sort(edges.begin(), edges.end());' },
    { id: 2,  code: '    UnionFind uf(V);' },
    { id: 3,  code: '    long long res = 0;' },
    { id: 4,  code: '    for (const auto& e : edges) {' },
    { id: 5,  code: '        if (!uf.isSame(e.u, e.v)) {' },
    { id: 6,  code: '            uf.unite(e.u, e.v);' },
    { id: 7,  code: '            res += e.cost;' },
    { id: 8,  code: '        }' },
    { id: 9,  code: '    }' },
    { id: 10, code: '    return res;' },
    { id: 11, code: '}' },
  ],
  partialOrder: [
    [0, 1], [0, 2], [0, 3], 
    [1, 4], [2, 4], [3, 4], // sort, uf初期化, res初期化はループより前
    [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], // ループ内部
    [9, 10], [10, 11] // return
  ],
  hints: [
    'まず、すべての辺をコストが小さい順にソート（sort）します。',
    '各辺 e について、端点 e.u と e.v がUnion-Find上で同じグループに属していなければ（閉路ができなければ）、その辺を採用します（uniteし、コストを加算）。',
    'すべての辺を調べ終わった後のコストの合計 res が最小全域木のコストになります。',
  ],
  explanation: {
    summary: 'クラスカル法は「コストが小さい辺から順に、閉路を作らないように選ぶ」という直感的な貪欲法です。',
    points: [
      '辺のソート: O(E log E) の時間がかかります。',
      '閉路判定: Union-Findの isSame() を使うことで、ほぼ O(1) で判定できます。',
      '全体の計算量はソートが支配的となり O(E log E) となります。',
    ],
    complexity: { time: 'O(E log E)', space: 'O(V)' },
    tip: '密グラフ（辺が非常に多いグラフ）の場合は、プリム法（Prim\'s Algorithm）の方が O(V^2) や O(E + V log V) となり有利な場合があります。',
  },
});
