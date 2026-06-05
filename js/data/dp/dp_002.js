// dp_002: ナップサック問題（0-1 Knapsack）★4 (C++)
// 競技プログラミングの典型 DP 問題
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dp_002',
  title: '0-1 ナップサック問題',
  category: 'dp',
  categoryLabel: '動的計画法',
  difficulty: 4,
  language: 'cpp',
  description: '【ナップサック問題とは】旅行で荷物をリュック（ナップサック）に詰めるとき、「重さの制限内で、価値の合計が最大になるように品物を選ぶ」という問題です。全ての組み合わせを試すと指数時間かかりますが、DP（動的計画法）を使うと「重さ上限 j のとき i 番目まで考えたときの最大価値」を表に記録することで劇的に高速化できます。\n\nN 個の品物があり、それぞれ重さ w[i]・価値 v[i] を持つ。容量 W のナップサックに入れる品物を選び、価値の合計を最大化せよ（各品物は1個まで）。dp[i][j] = 「i 番目までの品物を考え、重さ上限 j のとき達成できる最大価値」として DP せよ。',
  inputFormat: {
    params: [
      { name: 'N', type: 'int', desc: '品物の個数' },
      { name: 'W', type: 'int', desc: 'ナップサックの容量（最大積載重量）' },
      { name: 'w', type: 'vector<int>&', desc: '各品物の重さ配列（w[i] は i 番目の品物の重さ）' },
      { name: 'v', type: 'vector<int>&', desc: '各品物の価値配列（v[i] は i 番目の品物の価値）' },
    ],
    note: '戻り値: int（選んだ品物の価値の最大合計）\n制約: 1 ≤ N ≤ 100、1 ≤ W ≤ 10^4、1 ≤ w[i], v[i] ≤ 10^3',
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'int knapsack(int N, int W, vector<int>& w, vector<int>& v) {' },
    { id: 1,  code: '    vector<vector<int>> dp(N + 1, vector<int>(W + 1, 0));' },
    { id: 2,  code: '    for (int i = 1; i <= N; i++) {' },
    { id: 3,  code: '        for (int j = 0; j <= W; j++) {' },
    { id: 4,  code: '            dp[i][j] = dp[i - 1][j];' },
    { id: 5,  code: '            if (j >= w[i - 1]) {' },
    { id: 6,  code: '                dp[i][j] = max(dp[i][j],' },
    { id: 7,  code: '                              dp[i - 1][j - w[i - 1]] + v[i - 1]);' },
    { id: 8,  code: '            }' },
    { id: 9,  code: '        }' },
    { id: 10, code: '    }' },
    { id: 11, code: '    return dp[N][W];' },
    { id: 12, code: '}' },
  ],
  // 8,9,10は全て } で同一テキスト。id:8は if の直後、id:9はjループの直後、id:10はiループの直後
  // 8 < 9 < 10 の順序を強制
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8],
    [8, 9], [9, 10], [10, 11], [11, 12],
  ],
  hints: [
    'dp[N+1][W+1] の2次元テーブルを全て 0 で初期化する。dp[i][j] は i 番目の品物までを考えて重さ上限 j での最大価値',
    '各品物 i について: まず dp[i][j] = dp[i-1][j]（品物 i を入れない場合）とコピーする',
    '品物 i を入れる場合: j >= w[i-1] なら dp[i][j] = max(dp[i][j], dp[i-1][j - w[i-1]] + v[i-1]) で更新する',
  ],
  explanation: {
    summary: '0-1 ナップサック問題は「各品物を使うか使わないか」の二択の組み合わせ最適化です。全探索は O(2^N) ですが、DP を用いると O(NW) で解けます。状態 dp[i][j] に「i 番目までを見て重さ上限 j での最大価値」を持たせるのがポイントです。',
    points: [
      '品物 i を「使わない」場合: dp[i][j] = dp[i-1][j]（前の状態をそのままコピー）',
      '品物 i を「使う」場合: j >= w[i-1] の条件が必要。dp[i][j] = dp[i-1][j - w[i-1]] + v[i-1]',
      '両者の max を取ることで最適解を記録する',
      '1D DP（dp[j] を内側ループで逆順更新）にすると空間 O(W) に圧縮できる',
    ],
    complexity: { time: 'O(NW)', space: 'O(NW)' },
    tip: '1D DP 版では for (int j = W; j >= w[i-1]; j--) と逆順に回す点が重要。正順だと同一品物を複数回使ってしまう（アンバウンドナップサックになる）。',
  },
});
