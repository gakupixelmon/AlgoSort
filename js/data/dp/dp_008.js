// dp_008: 長さ2または3の区間分割 ★3 (C++)
// 区間の幅をコストとし、最後の2個または3個から最小値を更新する
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dp_008',
  title: '長さ2または3の区間分割',
  category: 'dp',
  categoryLabel: '動的計画法',
  difficulty: 3,
  language: 'cpp',
  description: '【問題】\n長さ N の正整数列 A が与えられます。A を、長さがちょうど2または3である1つ以上の連続部分列に分割してください。各部分列のスコアは、その部分列の最大値と最小値の差です。\n\n分割した部分列のスコアの総和としてあり得る最小値を求める関数を実装してください。\n\n元の問題では部分列の長さを自由に選びますが、この問題では長さ2または3に限定されます。最後に2個で終わる場合と3個で終わる場合を比較するDPを考えましょう。',
  inputFormat: {
    params: [
      { name: 'A', type: 'const vector<long long>&', desc: '分割する正整数列' },
    ],
    note: '戻り値: long long（分割後のスコアの最小値）\n制約: 2 ≤ N ≤ 2×10^5、1 ≤ A_i ≤ 10^9。N は2個または3個のブロックに分割可能な値とする。',
    examples: [
      {
        input: 'A = [1, 10, 2, 9]',
        output: '16',
        explanation: '[1,10] と [2,9] に分けるしかなく、スコアは (10-1)+(9-2)=16 です。',
      },
      {
        input: 'A = [1, 100, 2, 101, 3, 102]',
        output: '198',
        explanation: '[1,100,2] と [101,3,102] に分けると、99+99=198 になります。',
      },
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0, code: 'long long minPairTripleSpread(const vector<long long>& A) {' },
    { id: 1, code: '    int n = A.size();' },
    { id: 2, code: '    const long long INF = (1LL << 62);' },
    { id: 3, code: '    vector<long long> dp(n + 1, INF);' },
    { id: 4, code: '    dp[0] = 0;' },
    { id: 5, code: '    for (int i = 2; i <= n; i++) {' },
    { id: 6, code: '        long long pairCost = llabs(A[i - 1] - A[i - 2]);' },
    { id: 7, code: '        dp[i] = min(dp[i], dp[i - 2] + pairCost);' },
    { id: 8, code: '        if (i >= 3) {' },
    { id: 9, code: '            long long maximum = max({A[i - 3], A[i - 2], A[i - 1]});' },
    { id: 10, code: '            long long minimum = min({A[i - 3], A[i - 2], A[i - 1]});' },
    { id: 11, code: '            long long tripleCost = maximum - minimum;' },
    { id: 12, code: '            dp[i] = min(dp[i], dp[i - 3] + tripleCost);' },
    { id: 13, code: '        }' },
    { id: 14, code: '    }' },
    { id: 15, code: '    return dp[n];' },
    { id: 16, code: '}' },
  ],
  partialOrder: [
    [0, 1], [0, 2], [0, 3], [1, 3], [2, 3], [3, 4], [4, 5],
    [5, 6], [6, 7], [5, 8], [8, 9], [9, 10], [10, 11], [11, 12],
    [7, 14], [12, 13], [13, 14], [14, 15], [15, 16],
  ],
  hints: [
    'dp[i] を、A の先頭 i 個を条件通りに分割したときの最小スコアとします',
    '最後のブロックが長さ2なら、A[i-2], A[i-1] の差を dp[i-2] に加えます',
    '最後のブロックが長さ3なら、A[i-3], A[i-2], A[i-1] の最大値と最小値の差を dp[i-3] に加えます',
    '長さ2と長さ3の両方の候補を比較し、小さい方を dp[i] に保存します',
  ],
  explanation: {
    summary: '分割の最後のブロックだけに注目すると、その長さは2または3のどちらかです。したがって、先頭部分の最適解に最後のブロックのコストを加える遷移を行えば、全体の最適解を求められます。',
    points: [
      'dp[i] は先頭 i 個を分割した最小スコアです',
      '最後のブロックを固定すると、それより前の部分は独立した同じ形式の部分問題になります',
      '長さ2の区間スコアは2要素の絶対差、長さ3の区間スコアは3要素の最大値と最小値の差です',
      '各 i で高々2つの遷移だけを調べるため、全体を線形時間で処理できます',
    ],
    complexity: { time: 'O(N)', space: 'O(N)' },
    tip: '連続区間の分割DPでは「最後の区間の長さ」を列挙すると、先頭部分を表すDP状態へ自然に遷移できます。区間の種類が増える場合も、同じ考え方で遷移を追加できます。',
  },
});
