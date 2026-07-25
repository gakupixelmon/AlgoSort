// cp_021: 置換の巡回成分数 ★4 (C++)
// 最大値を単独成分にするか、既存の巡回成分の辺へ挿入するかを数える
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_021',
  title: '置換の巡回成分数',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 4,
  language: 'cpp',
  description: '【問題】\n1, 2, ..., N の順列 P を考えます。各頂点 i から P_i へ有向辺を張ると、グラフは互いに交わらないいくつかの閉路（巡回成分）に分かれます。巡回成分の個数がちょうど K 個となる順列の個数を、998244353 で割った余りとして求めてください。\n\n【ポイント】\n1 から i - 1 までの置換に、新しい最大値 i を挿入して構築します。i を 1 頂点だけの閉路にすれば成分数は1増えます。既存の辺 x -> y を x -> i -> y に置き換えて挿入すれば、成分数は変わりません。既存の辺は i - 1 本あるため、連結成分数を状態にした挿入 DP が作れます。',
  inputFormat: {
    params: [
      { name: 'N', type: 'int', desc: '順列の長さ' },
      { name: 'K', type: 'int', desc: '必要な巡回成分数' },
    ],
    note: '出力: 条件を満たす順列の個数 mod 998244353\n制約: 1 <= K <= N <= 5000',
    examples: [
      {
        input: 'N = 3, K = 2',
        output: '3',
        explanation: '(1)(2 3), (2)(1 3), (3)(1 2) の3通りです。括弧は巡回置換を表します。'
      },
      {
        input: 'N = 4, K = 1',
        output: '6',
        explanation: '4頂点すべてを含む1つの閉路を作る順列は (4 - 1)! = 6 通りです。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0, code: 'constexpr long long MOD = 998244353;' },
    { id: 1, code: 'vector<long long> dp(K + 1, 0);' },
    { id: 2, code: 'dp[0] = 1;' },
    { id: 3, code: 'for (int i = 1; i <= N; ++i) {' },
    { id: 4, code: '    vector<long long> next(K + 1, 0);' },
    { id: 5, code: '    for (int components = 1; components <= min(i, K); ++components) {' },
    { id: 6, code: '        next[components] = dp[components - 1];  // i を単独の閉路にする' },
    { id: 7, code: '        next[components] += 1LL * (i - 1) * dp[components];  // 既存の辺へ挿入する' },
    { id: 8, code: '        next[components] %= MOD;' },
    { id: 9, code: '    }' },
    { id: 10, code: '    dp.swap(next);' },
    { id: 11, code: '}' },
    { id: 12, code: 'cout << dp[K] << "\\n";' },
  ],
  partialOrder: [
    [0, 1], [1, 2],
    [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11],
    [11, 12],
  ],
  hints: [
    'i -> P_i の辺を張ると、各頂点の入次数・出次数がともに1のため、グラフ全体は閉路の集合になります',
    '1..i-1 の置換から i を作ると考えます。dp[c] を「現在の巡回成分数が c」である個数とします',
    'i だけの閉路 (i) を作ると、成分数が1増えます',
    '既存の辺 x -> y を x -> i -> y に変えると、閉路の数は変わりません。挿入先の辺は i-1 本あります',
    '遷移式は next[c] = dp[c-1] + (i-1) * dp[c] です',
  ],
  explanation: {
    summary: '置換を有向グラフとして見ると閉路の集合になることを利用し、最大値を順に挿入する DP です。状態は現在の閉路、すなわち連結成分の個数だけで十分です。',
    points: [
      'dp[c] は、1..i-1 を使う置換で巡回成分が c 個である通り数を表す',
      '新しい i を単独閉路にする遷移は、c-1 個の成分から c 個へ移るため dp[c-1] を加える',
      '既存の任意の辺を分割して i を挿入すると、元の閉路は1つのままなので成分数は変わらない',
      '1..i-1 の置換にある辺の本数は i-1 本なので、その遷移は (i-1) * dp[c] 通りある',
      'これは符号なし第一種スターリング数の漸化式と一致する',
    ],
    complexity: { time: 'O(NK)', space: 'O(K)' },
    tip: '「新しい要素を入れたとき、成分数が増える操作と増えない操作がある」場面では、連結成分数を状態にする挿入 DP を検討できます。',
  },
});
