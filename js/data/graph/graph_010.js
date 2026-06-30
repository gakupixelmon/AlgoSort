// graph_010: 最小シュタイナー木 (Minimum Steiner Tree) ★5 (C++)
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'graph_010',
  title: '最小シュタイナー木',
  category: 'graph',
  categoryLabel: 'グラフ理論',
  difficulty: 5,
  language: 'cpp',
  description: '【最小シュタイナー木問題】\nグラフにおいて、特定の頂点集合（ターミナルと呼ばれる）をすべて連結にする部分木のうち、重みが最小のものを求める問題です。\nこれはNP困難な問題ですが、ターミナルの数 K が小さい場合、部分集合に対する動的計画法（Dreyfus-Wagner アルゴリズム）を用いることで O(3^K * V + 2^K * E log V) 等で解くことができます。\nDP[S][v] を「ターミナルの部分集合 S を繋ぎ、かつ頂点 v を根とする木」の最小コストとして定義します。',
  inputFormat: {
    params: [
      { name: 'n', type: 'int', desc: '頂点数' },
      { name: 'terminals', type: 'vector<int>', desc: 'ターミナル頂点のリスト' },
      { name: 'adj', type: 'vector<vector<pair<int, int>>>', desc: '隣接リスト (to, weight)' }
    ]
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;', 'const long long INF = 1e18;'],
  blocks: [
    { id: 0,  code: 'long long minSteinerTree(int n, const vector<int>& terminals, const vector<vector<pair<int, int>>>& adj) {' },
    { id: 1,  code: '    int k = terminals.size();' },
    { id: 2,  code: '    if (k <= 1) return 0;' },
    { id: 3,  code: '    vector<vector<long long>> dp(1 << k, vector<long long>(n, INF));' },
    { id: 4,  code: '    // ターミナルの初期化' },
    { id: 5,  code: '    for (int i = 0; i < k; i++) dp[1 << i][terminals[i]] = 0;' },
    { id: 6,  code: '    for (int S = 1; S < (1 << k); S++) {' },
    { id: 7,  code: '        // 部分集合を二つに分割して更新' },
    { id: 8,  code: '        for (int sub = (S - 1) & S; sub > 0; sub = (sub - 1) & S) {' },
    { id: 9,  code: '            for (int v = 0; v < n; v++) {' },
    { id: 10, code: '                dp[S][v] = min(dp[S][v], dp[sub][v] + dp[S ^ sub][v]);' },
    { id: 11, code: '            }' },
    { id: 12, code: '        }' },
    { id: 13, code: '        // 緩和 (ダイクストラ法)' },
    { id: 14, code: '        priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<>> pq;' },
    { id: 15, code: '        for (int v = 0; v < n; v++) if (dp[S][v] != INF) pq.push({dp[S][v], v});' },
    { id: 16, code: '        while (!pq.empty()) {' },
    { id: 17, code: '            auto [cost, u] = pq.top(); pq.pop();' },
    { id: 18, code: '            if (cost > dp[S][u]) continue;' },
    { id: 19, code: '            for (auto& edge : adj[u]) {' },
    { id: 20, code: '                int v = edge.first, w = edge.second;' },
    { id: 21, code: '                if (dp[S][v] > dp[S][u] + w) {' },
    { id: 22, code: '                    dp[S][v] = dp[S][u] + w;' },
    { id: 23, code: '                    pq.push({dp[S][v], v});' },
    { id: 24, code: '                }' },
    { id: 25, code: '            }' },
    { id: 26, code: '        }' },
    { id: 27, code: '    }' },
    { id: 28, code: '    long long ans = INF;' },
    { id: 29, code: '    for (int v = 0; v < n; v++) ans = min(ans, dp[(1 << k) - 1][v]);' },
    { id: 30, code: '    return ans;' },
    { id: 31, code: '} // end minSteinerTree' }
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12],
    [12, 13], [13, 14], [14, 15], [15, 16], [16, 17], [17, 18], [18, 19], [19, 20], [20, 21], [21, 22],
    [22, 23], [23, 24], [24, 25], [25, 26], [26, 27], [27, 28], [28, 29], [29, 30], [30, 31]
  ],
  hints: [
    'dp[S][v] = (ターミナルの部分集合Sを連結し、vを根とする木の最小コスト) と置きます。',
    '状態遷移は2段階あります。1つ目はSを2つの部分集合に分ける遷移（dp[sub][v] + dp[S^sub][v]）、2つ目は辺を通る遷移（ダイクストラ法）。',
    '部分集合の列挙は sub = (sub - 1) & S のビット演算テクニックを使います。'
  ],
  explanation: {
    summary: 'Dreyfus-Wagner アルゴリズムと呼ばれる手法です。動的計画法において、同じ頂点でターミナル集合を二分する遷移と、辺をたどって根を移動する遷移を組み合わせることで最小シュタイナー木を構成します。',
    points: [
      '部分集合を分割するループは `sub = (sub - 1) & S` と書くことで、全ての S に対する合計 O(3^K) の計算量で実行可能です。',
      'ターミナル同士が遠い場合があるため、DPの各段階でダイクストラ法を用いて最短経路情報を伝播させます。'
    ],
    complexity: { time: 'O(3^K * V + 2^K * E log V)', space: 'O(2^K * V)' },
    tip: '最小シュタイナー木は現実のネットワーク配線問題などにも直結する非常に重要なアルゴリズムです。'
  }
});
