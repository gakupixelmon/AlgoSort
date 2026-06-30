// graph_008: プリム法 (Prim's Algorithm) ★3 (C++)
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'graph_008',
  title: 'プリム法 (最小全域木)',
  category: 'graph',
  categoryLabel: 'グラフ理論',
  difficulty: 3,
  language: 'cpp',
  description: '【プリム法】\nグラフのすべての頂点を結ぶ部分グラフのうち、辺の重みの総和が最小になるものを最小全域木（Minimum Spanning Tree, MST）と呼びます。\nプリム法は、ある頂点から始めて、すでに木に含まれている頂点群とそれ以外の頂点を結ぶ最小コストの辺を貪欲に追加していくことで MST を構築します。',
  inputFormat: {
    params: [
      { name: 'n', type: 'int', desc: '頂点数' },
      { name: 'adj', type: 'vector<vector<pair<int, int>>>', desc: '隣接リスト (to, weight)' }
    ],
    note: '出力: 最小全域木の辺の重みの総和'
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'long long prim(int n, const vector<vector<pair<int, int>>>& adj) {' },
    { id: 1,  code: '    long long total_weight = 0;' },
    { id: 2,  code: '    vector<bool> visited(n, false);' },
    { id: 3,  code: '    // priority_queue はデフォルトで最大ヒープなので、最小ヒープにする' },
    { id: 4,  code: '    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> pq;' },
    { id: 5,  code: '    pq.push({0, 0}); // {cost, vertex}' },
    { id: 6,  code: '    while (!pq.empty()) {' },
    { id: 7,  code: '        auto [cost, u] = pq.top();' },
    { id: 8,  code: '        pq.pop();' },
    { id: 9,  code: '        if (visited[u]) continue;' },
    { id: 10, code: '        visited[u] = true;' },
    { id: 11, code: '        total_weight += cost;' },
    { id: 12, code: '        for (auto& edge : adj[u]) {' },
    { id: 13, code: '            int v = edge.first;' },
    { id: 14, code: '            int weight = edge.second;' },
    { id: 15, code: '            if (!visited[v]) {' },
    { id: 16, code: '                pq.push({weight, v});' },
    { id: 17, code: '            }' },
    { id: 18, code: '        }' },
    { id: 19, code: '    }' },
    { id: 20, code: '    return total_weight;' },
    { id: 21, code: '} // end prim' }
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10],
    [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16], [16, 17], [17, 18],
    [18, 19], [19, 20], [20, 21]
  ],
  hints: [
    'まずは priority_queue を用意し、始点をキューに入れます（コスト0）。',
    'キューから最小コストの頂点を取り出し、未訪問であれば訪問済みにします。',
    '現在いる頂点から繋がる辺のうち、未訪問の頂点へ向かうものをキューに追加します。'
  ],
  explanation: {
    summary: 'ダイクストラ法と非常に似ていますが、キューに入れるコストが「始点からの総距離」ではなく「現在の木からその頂点への辺の重み」である点が異なります。',
    points: [
      '優先度付きキュー(priority_queue)を用いて、O(E log V) の計算量で実装できます。',
      '連結でないグラフの場合は、未訪問の頂点が残っていればそこから再度キューを初期化して探査する必要があります。'
    ],
    complexity: { time: 'O(E log V)', space: 'O(V + E)' }
  }
});
