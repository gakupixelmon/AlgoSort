// dp_005: 巡回セールスマン問題 (bit DP) ★4 (C++)
// bit DP の代表例。集合を整数（ビット列）で表現し、動的計画法を行う
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dp_005',
  title: '巡回セールスマン問題 (bit DP)',
  category: 'dp',
  categoryLabel: '動的計画法',
  difficulty: 4,
  language: 'cpp',
  description: '【bit DPとは】\n「すでに訪問した頂点の集合」などをビット列（整数）として状態に持つ動的計画法です。\n巡回セールスマン問題 (TSP) は「全ての都市を1度ずつ訪問し、出発点に戻ってくる最小コストの経路」を求める問題です。\n都市の数を $N$ とするとき、全探索では $O(N!)$ かかりますが、bit DPを用いると $O(N^2 2^N)$ で解くことができます。\n\n頂点数 $N$ と、頂点 $u$ から $v$ への移動コスト `dist[u][v]` が与えられます。\n頂点0から出発し、すべての頂点を1度ずつ訪れて頂点0に戻る最小コストを求めてください。',
  inputFormat: {
    params: [
      { name: 'N', type: 'int', desc: '頂点の数' },
      { name: 'dist', type: 'vector<vector<int>>&', desc: '各頂点間の移動コスト（NxNの隣接行列）' },
    ],
    note: '戻り値: int（最小コスト）\n制約: 2 ≤ N ≤ 15、コストは非負整数で、経路が存在しない場合は十分に大きな値(1e9)が入っているとする',
    examples: [
      {
        input: 'N = 3, dist = [[0, 2, 9], [1, 0, 6], [4, 7, 0]]',
        output: '12',
        explanation: '0 → 1 → 2 → 0 の順に巡回すると 2 + 6 + 4 = 12 となり、これが最小コストです。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'int solveTSP(int N, const vector<vector<int>>& dist) {' },
    { id: 1,  code: '    int V = 1 << N;' },
    { id: 2,  code: '    vector<vector<int>> dp(V, vector<int>(N, 1e9));' },
    { id: 3,  code: '    dp[1][0] = 0;' },
    { id: 4,  code: '    for (int S = 1; S < V; S++) {' },
    { id: 5,  code: '        for (int u = 0; u < N; u++) {' },
    { id: 6,  code: '            if (!(S & (1 << u))) continue;' },
    { id: 7,  code: '            for (int v = 0; v < N; v++) {' },
    { id: 8,  code: '                if (!(S & (1 << v))) {' },
    { id: 9,  code: '                    dp[S | (1 << v)][v] = min(dp[S | (1 << v)][v], dp[S][u] + dist[u][v]);' },
    { id: 10, code: '                }' },
    { id: 11, code: '            }' },
    { id: 12, code: '        }' },
    { id: 13, code: '    }' },
    { id: 14, code: '    int ans = 1e9;' },
    { id: 15, code: '    for (int u = 1; u < N; u++) {' },
    { id: 16, code: '        ans = min(ans, dp[V - 1][u] + dist[u][0]);' },
    { id: 17, code: '    }' },
    { id: 18, code: '    return ans;' },
    { id: 19, code: '}' }
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9],
    [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16],
    [16, 17], [17, 18], [18, 19]
  ],
  hints: [
    'dp[S][u] = 「訪問済み頂点の集合が S で、現在頂点 u にいるときの最小コスト」として DP テーブルを定義します',
    '初期状態は頂点 0 だけを訪問した状態なので dp[1][0] = 0 (1 は 2進数で 000...001) となります',
    '状態 S から未訪問の頂点 v (S & (1 << v) が 0) への移動を考え、dp[S | (1 << v)][v] を更新します',
    '最後に、すべての頂点を訪問した状態 (V - 1) の各頂点 u から、出発点 0 に戻るコストを足して最小値をとります'
  ],
  explanation: {
    summary: '巡回セールスマン問題は bit DP のもっとも代表的な例題です。集合をビットマスクとして整数表現することで、DPの状態として持つことができます。',
    points: [
      '`1 << N` は $2^N$ を意味し、すべての部分集合の状態数を表します',
      '`S & (1 << u)` は「集合 S に頂点 u が含まれているか」の判定です',
      '`S | (1 << v)` は「集合 S に頂点 v を追加する」操作です',
      'すべての頂点を訪問した状態は `V - 1` (2進数で `111...1`) となります'
    ],
    complexity: { time: 'O(N^2 2^N)', space: 'O(N 2^N)' },
    tip: 'bit DP ではループの順番が重要です。ここでは外側のループが `S = 1` から順番に増加するため、「要素数が小さい集合から大きい集合へ」と正しくトポロジカルソート順に更新が行われます。'
  }
});
