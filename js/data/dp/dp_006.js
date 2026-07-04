// dp_006: 桁DP (C++) ★4
// 数を文字列として扱い、上の桁から順番に条件を満たす数を数え上げるDP
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dp_006',
  title: '桁DP（各桁の和）',
  category: 'dp',
  categoryLabel: '動的計画法',
  difficulty: 4,
  language: 'cpp',
  description: '【桁DPとは】\n「$X$ 以下の整数のうち、条件を満たすものの個数を求めよ」という形式の問題に非常に強力な動的計画法です。\n数 $X$ を文字列（桁の配列）として扱い、一番上の桁から順に遷移を計算します。\nその際、「すでに $X$ より小さいことが確定しているか（smallerフラグ）」を状態として持つのが特徴です。\n\n$N$ 以下の非負整数のうち、10進数で各桁の数字の和がちょうど $D$ になるものの個数を求める関数を完成させてください。\n（※ $N$ は非常に大きいため文字列 $S$ として与えられます）',
  inputFormat: {
    params: [
      { name: 'S', type: 'const string&', desc: '上限となる整数 N の文字列表現' },
      { name: 'D', type: 'int', desc: '各桁の和の目標値' },
    ],
    note: '戻り値: long long（条件を満たす整数の個数）\n制約: 1 ≤ |S| ≤ 100, 1 ≤ D ≤ 900',
    examples: [
      {
        input: 'S = "100", D = 5',
        output: '6',
        explanation: '100以下の非負整数で各桁の和が5になるものは、5, 14, 23, 32, 41, 50 の 6 個です。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'long long solveDigitDP(const string& S, int D) {' },
    { id: 1,  code: '    int N = S.size();' },
    { id: 2,  code: '    vector<vector<vector<long long>>> dp(N + 1, vector<vector<long long>>(2, vector<long long>(D + 1, 0)));' },
    { id: 3,  code: '    dp[0][0][0] = 1;' },
    { id: 4,  code: '    for (int i = 0; i < N; i++) {' },
    { id: 5,  code: '        int nd = S[i] - \'0\';' },
    { id: 6,  code: '        for (int smaller = 0; smaller < 2; smaller++) {' },
    { id: 7,  code: '            for (int j = 0; j <= D; j++) {' },
    { id: 8,  code: '                if (dp[i][smaller][j] == 0) continue;' },
    { id: 9,  code: '                int limit = smaller ? 9 : nd;' },
    { id: 10, code: '                for (int d = 0; d <= limit; d++) {' },
    { id: 11, code: '                    if (j + d <= D) {' },
    { id: 12, code: '                        dp[i + 1][smaller || (d < limit)][j + d] += dp[i][smaller][j];' },
    { id: 13, code: '                    }' },
    { id: 14, code: '                }' },
    { id: 15, code: '            }' },
    { id: 16, code: '        }' },
    { id: 17, code: '    }' },
    { id: 18, code: '    return dp[N][0][D] + dp[N][1][D];' },
    { id: 19, code: '}' }
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9],
    [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16],
    [16, 17], [17, 18], [18, 19]
  ],
  hints: [
    'dp[i][smaller][j] = 「上から i 桁目まで決めて、Nより小さいことが確定しているか(smaller)、各桁の和が j である場合の数」',
    '初期値は一番上の桁を決める前、和が0なので dp[0][0][0] = 1 とします',
    '次に選べる数字 d の上限 (limit) は、すでに N より小さいことが確定 (smaller=1) なら 9、確定していないなら N の i 桁目の数字 (nd) になります',
    '状態遷移では、和が D を超えない範囲で dp[i+1][次状態のsmaller][j + d] に現在のパターン数を足し込みます'
  ],
  explanation: {
    summary: '桁DPは「$N$ 以下の数」を対象にする際に必須となるテクニックです。数を文字列とみなし、左（上の桁）から1桁ずつ決めていくことで辞書順の要領で全探索を効率化します。',
    points: [
      '`smaller` フラグ: これが 1 であれば、上位の桁ですでに $N$ よりも小さくなることが確定しているため、現在の桁は 0 から 9 のどれを選んでも $N$ を超えません',
      '`limit = smaller ? 9 : nd`: 次の桁に置ける数字の最大値です。`smaller` が 0 なら $N$ の同じ桁の数字 `nd` を超えてはいけません',
      '`smaller || (d < limit)`: 次の状態での `smaller` の値です。すでに小さいことが確定しているか、今回上限より小さい数字 `d` を選べば、以降は確実に $N$ より小さくなります'
    ],
    complexity: { time: 'O(|S| \\cdot D)', space: 'O(|S| \\cdot D)' },
    tip: '桁DPでは空間計算量を落とすために `i` の次元を `dp[2][2][D+1]` のように配列の使い回しで $O(D)$ に抑える実装もよく使われます。'
  }
});
