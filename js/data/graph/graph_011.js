// graph_011: K分木上の最短経路（LCA） (C++) ★3
// 完全K分木の性質を利用して、親ノードを辿ることで最小共通祖先(LCA)と距離を求める
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'graph_011',
  title: 'K分木上の最短経路 (LCA)',
  category: 'graph',
  categoryLabel: 'グラフ理論',
  difficulty: 3,
  language: 'cpp',
  description: '【K分木上のLCA】\n頂点に $0, 1, 2, \\dots$ と番号が振られた無限に続く完全 $K$ 分木を考えます。頂点 $i$ の子は $K \\times i + 1, K \\times i + 2, \\dots, K \\times i + K$ となります。\nこのような木において、2つの頂点 $u, v$ の最短経路の長さを求めるには、双方が一致する（最小共通祖先 = LCA に到達する）まで「番号の大きい方」をその親ノードに移動させる操作を繰り返すのが効率的です。\n\n$K, u, v$ が与えられたとき、$u$ と $v$ の最短距離（エッジの数）を求める関数を完成させてください。ただし、$K=1$ の場合は木が一直線になるため、ループで辿るとTLEになることに注意してください。',
  inputFormat: {
    params: [
      { name: 'K', type: 'long long', desc: '木の子の数 (K分木)' },
      { name: 'u', type: 'long long', desc: '頂点 u (0-indexed)' },
      { name: 'v', type: 'long long', desc: '頂点 v (0-indexed)' },
    ],
    note: '戻り値: long long（2頂点間の最短距離）\n制約: 1 ≤ K ≤ 10^18、0 ≤ u, v ≤ 10^18',
    examples: [
      {
        input: 'K = 2, u = 3, v = 4',
        output: '2',
        explanation: '0-indexedの2分木を考えます。3の親は (3-1)/2 = 1。4の親は (4-1)/2 = 1。1の親は 0。3と4の共通祖先（LCA）は 1 となるため、3 -> 1 <- 4 と移動して最短距離は 2 になります。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'long long get_distance(long long K, long long u, long long v) {' },
    { id: 1,  code: '    if (K == 1) {' },
    { id: 2,  code: '        return abs(u - v);' },
    { id: 3,  code: '    }' },
    { id: 4,  code: '    long long dist = 0;' },
    { id: 5,  code: '    while (u != v) {' },
    { id: 6,  code: '        if (u < v) {' },
    { id: 7,  code: '            swap(u, v);' },
    { id: 8,  code: '        }' },
    { id: 9,  code: '        u = (u - 1) / K;' },
    { id: 10, code: '        dist++;' },
    { id: 11, code: '    }' },
    { id: 12, code: '    return dist;' },
    { id: 13, code: '}' }
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13]
  ],
  hints: [
    'K=1 のときは各頂点が1つの子しか持たない（直線状のグラフ）ため、距離は単純な差の絶対値 abs(u - v) になります',
    'K >= 2 のときは木の深さが O(log_K(N)) になるため、頂点番号の大きい方（= 深い方、または右側）を親に移動させていくことでLCAに到達できます',
    'u < v なら swap(u, v) とすることで、常に u 側を親へと移動させることができます',
    '頂点 u の親は (u - 1) / K (切り捨て) で求まります'
  ],
  explanation: {
    summary: '完全K分木の番号付けの性質を利用して、親ノードを計算することで深さ優先探索（DFS）などの事前計算なしに最小共通祖先（LCA）を $O(\\log_K N)$ で求めるアルゴリズムです。',
    points: [
      '$K=1$ の例外処理: 深さが $O(N)$ になってしまうため、別処理として $O(1)$ で計算します（競技プログラミングで非常によくあるコーナーケースです）',
      '親ノードの計算: 0-indexedの場合、頂点 $x$ の親は $(x - 1) // K$ になります（1-indexedの場合は $(x - 2) // K + 1$）',
      '常に番号が大きい頂点は、必ずもう一方の頂点以上の深さにあります（同じ深さの場合はより右側）。そのため、番号が大きい方を親に移動させる操作を繰り返すだけで確実に2つがLCAで衝突します'
    ],
    complexity: { time: 'O(\\log_K (\\max(u, v)))', space: 'O(1)' },
    tip: '一般的な木グラフの LCA は前計算 $O(N \\log N)$、クエリ $O(\\log N)$ のダブリング等が必要ですが、完全K分木のように規則的な構造を持つ場合は定数メモリと単純なループだけで高速に解くことができます。'
  }
});
