// dp_001: フィボナッチ数列（DP）(C++)
// id:7 (for の }) と id:9 (関数の }) は trimStart() 後に同一テキスト
// 間に return dp[n] (id:8) が挟まる → [7,8] と [8,9] で「} return } 」順を保証
// dp[0]=0（id:3）と dp[1]=1（id:4）は相互に任意順
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dp_001',
  title: 'フィボナッチ数列（DP）',
  category: 'dp',
  categoryLabel: '動的計画法',
  difficulty: 2,
  language: 'cpp',
  description: '動的計画法（DP）を使ってフィボナッチ数列の第 N 項を O(N) で求めよ。再帰では指数時間かかるが、DP なら線形時間で解ける。',
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0, code: 'long long fibonacci(int n) {' },
    { id: 1, code: '    if (n <= 1) return n;' },
    { id: 2, code: '    vector<long long> dp(n + 1);' },
    { id: 3, code: '    dp[0] = 0;' },
    { id: 4, code: '    dp[1] = 1;' },
    { id: 5, code: '    for (int i = 2; i <= n; i++) {' },
    { id: 6, code: '        dp[i] = dp[i - 1] + dp[i - 2];' },
    { id: 7, code: '    }' },
    { id: 8, code: '    return dp[n];' },
    { id: 9, code: '}' },
  ],
  // id:3 (dp[0]=0) と id:4 (dp[1]=1) は相互に任意順
  // id:7 (for の }) と id:9 (関数の }) は視覚的に同一 → permutation ロジックで対応
  // [7,8]: for の } の後に return dp[n] / [8,9]: return dp[n] の後に関数の }
  partialOrder: [
    [0, 1], [1, 2],
    [2, 3], [2, 4],   // vector 宣言 → dp[0] と dp[1] の初期化（相互任意順）
    [3, 5], [4, 5],   // 両初期化後に for ループ
    [5, 6],
    // 両 } (id:7, id:9) は for 本体（id:6）の後に来る
    [6, 7], [6, 9],
    // return dp[n] (id:8) は for 本体の後
    [6, 8],
    // return dp[n] は } と } の間に来る: } return } の順を保証
    [7, 8], [8, 9],
  ],
  hints: [
    'ベースケース: n が 0 または 1 のときそのまま返す',
    'サイズ n+1 の DP テーブルを用意し dp[0]=0, dp[1]=1 を初期化',
    'dp[i] = dp[i-1] + dp[i-2] の漸化式を i=2 から n まで適用',
  ],
  explanation: {
    summary: '動的計画法（DP）はフィボナッチのような重複する部分問題を「メモ化」して再計算を避けることで、指数時間を線形時間に削減するテクニックです。',
    points: [
      'ナイーブな再帰では fib(n) が fib(n-1) と fib(n-2) の両方から呼ばれ、指数的に爆発する',
      'DP テーブル dp[] に計算済みの値を保存し、以降は O(1) で参照できる',
      'dp[0]=0, dp[1]=1 がベースケース。漸化式 dp[i] = dp[i-1] + dp[i-2] でボトムアップに計算',
      'long long を使うことで大きな N でも整数オーバーフローを防止できる',
    ],
    complexity: { time: 'O(N)', space: 'O(N)' },
    tip: '空間最適化として「直前の2値だけ保持」すれば O(1) 空間で実装できます。競技では空間が問われることも多いです。',
  },
});
