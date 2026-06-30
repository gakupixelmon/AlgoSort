// graph_009: クラスカル法 (Kruskal's Algorithm) ★3 (C++)
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'graph_009',
  title: 'クラスカル法 (最小全域木)',
  category: 'graph',
  categoryLabel: 'グラフ理論',
  difficulty: 3,
  language: 'cpp',
  description: '【クラスカル法】\n最小全域木 (MST) を求めるもう一つの代表的なアルゴリズムです。プリム法が「頂点」を基準に木を拡張していくのに対し、クラスカル法は「辺」をコストが小さい順にソートし、閉路を作らないように順番に辺を採用していきます。\n閉路の判定には Union-Find（素集合データ構造）を用いるのが一般的です。',
  inputFormat: {
    params: [
      { name: 'n', type: 'int', desc: '頂点数' },
      { name: 'edges', type: 'vector<Edge>', desc: '辺のリスト (u, v, cost)' }
    ]
  },
  pinnedCode: [
    '#include <bits/stdc++.h>',
    'using namespace std;',
    'struct Edge { int u, v, cost; };',
    '// UnionFind uf(n); が利用可能とします'
  ],
  blocks: [
    { id: 0,  code: 'long long kruskal(int n, vector<Edge>& edges) {' },
    { id: 1,  code: '    // 辺をコストの昇順にソートする' },
    { id: 2,  code: '    sort(edges.begin(), edges.end(), [](const Edge& a, const Edge& b) {' },
    { id: 3,  code: '        return a.cost < b.cost;' },
    { id: 4,  code: '    });' },
    { id: 5,  code: '    UnionFind uf(n);' },
    { id: 6,  code: '    long long total_weight = 0;' },
    { id: 7,  code: '    for (const auto& e : edges) {' },
    { id: 8,  code: '        // u と v が異なるグループに属しているか（閉路ができないか）確認' },
    { id: 9,  code: '        if (!uf.same(e.u, e.v)) {' },
    { id: 10, code: '            uf.unite(e.u, e.v);' },
    { id: 11, code: '            total_weight += e.cost;' },
    { id: 12, code: '        }' },
    { id: 13, code: '    }' },
    { id: 14, code: '    return total_weight;' },
    { id: 15, code: '} // end kruskal' }
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9],
    [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15]
  ],
  hints: [
    'まず、すべての辺をコストが小さい順に並べ替えます。',
    '一番コストの小さい辺から順番に見ていき、その辺を追加しても閉路ができないか確認します。',
    '閉路の判定とグループの統合には Union-Find を使うのが最適です。'
  ],
  explanation: {
    summary: '辺をコストの昇順にソートし、Union-Find を用いて閉路ができない辺だけを採用していく貪欲法です。',
    points: [
      '全体の計算量のボトルネックは辺のソート O(E log E) になります。',
      'Union-Findの操作はほぼ定数時間 O(α(V)) で行えるため、ソート後の処理は非常に高速です。'
    ],
    complexity: { time: 'O(E log E)', space: 'O(V)' }
  }
});
