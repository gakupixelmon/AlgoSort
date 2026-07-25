// cp_022: 完全順列を数える包除原理 ★4 (C++)
// 「少なくとも1つが元の位置にある」を包除原理で除く
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_022',
  title: '完全順列を数える包除原理',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 4,
  language: 'cpp',
  description: '【問題】\n1, 2, ..., N を並べ替えて順列 P を作ります。どの i についても P_i != i である順列、すなわち完全順列（derangement）の個数を 998244353 で割った余りとして求めてください。\n\n【ポイント】\n「P_i = i である」という事象を E_i とします。求めたいのは、どの E_i も起こらない順列の数です。t 個の事象を同時に起こすよう固定すると、残り N - t 個は自由に並べられるため (N - t)! 通りです。固定する t 個の選び方 C(N, t) と、包除原理の符号を組み合わせます。',
  inputFormat: {
    params: [
      { name: 'N', type: 'int', desc: '順列の長さ' },
    ],
    note: '出力: 完全順列の個数 mod 998244353\n制約: 1 <= N <= 2 * 10^5',
    examples: [
      {
        input: 'N = 3',
        output: '2',
        explanation: '[2, 3, 1] と [3, 1, 2] の2通りです。'
      },
      {
        input: 'N = 4',
        output: '9',
        explanation: '4! - C(4,1)3! + C(4,2)2! - C(4,3)1! + C(4,4)0! = 9 です。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0, code: 'constexpr long long MOD = 998244353;' },
    { id: 1, code: 'long long modPow(long long a, long long e) {' },
    { id: 2, code: '    long long result = 1;' },
    { id: 3, code: '    while (e > 0) {' },
    { id: 4, code: '        if (e & 1) result = result * a % MOD;' },
    { id: 5, code: '        a = a * a % MOD;' },
    { id: 6, code: '        e >>= 1;' },
    { id: 7, code: '    }' },
    { id: 8, code: '    return result;' },
    { id: 9, code: '}' },
    { id: 10, code: 'vector<long long> fact(N + 1), invFact(N + 1);' },
    { id: 11, code: 'fact[0] = 1;' },
    { id: 12, code: 'for (int i = 1; i <= N; ++i) fact[i] = fact[i - 1] * i % MOD;' },
    { id: 13, code: 'invFact[N] = modPow(fact[N], MOD - 2);' },
    { id: 14, code: 'for (int i = N; i >= 1; --i) invFact[i - 1] = invFact[i] * i % MOD;' },
    { id: 15, code: 'auto comb = [&](int n, int r) { return fact[n] * invFact[r] % MOD * invFact[n - r] % MOD; };' },
    { id: 16, code: 'long long answer = 0;' },
    { id: 17, code: 'for (int fixed = 0; fixed <= N; ++fixed) {' },
    { id: 18, code: '    long long term = comb(N, fixed) * fact[N - fixed] % MOD;' },
    { id: 19, code: '    answer = (answer + (fixed % 2 ? MOD - term : term)) % MOD;' },
    { id: 20, code: '}' },
    { id: 21, code: 'cout << answer << "\\n";' },
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9],
    [0, 10], [10, 11], [11, 12], [9, 13], [12, 13], [13, 14], [12, 15], [14, 15],
    [15, 16], [16, 17], [17, 18], [18, 19], [19, 20], [20, 21],
  ],
  hints: [
    'E_i を「i 番目に i が置かれる」事象とします。求めるのは E_1, ..., E_N のどれも起きない場合です',
    'fixed 個の事象を同時に起こすよう固定すると、残り N - fixed 個は自由に並べられます',
    '固定する添字の集合は C(N, fixed) 通りあるので、その項は C(N, fixed) * (N - fixed)! です',
    '包除原理により fixed が偶数なら足し、奇数なら引きます',
    '組合せを高速に求めるため、階乗と逆階乗を前計算します',
  ],
  explanation: {
    summary: '完全順列の個数は、「固定点を1つ以上持つ順列」を全順列から包除原理で除くことで数えられます。',
    points: [
      't 個の特定の位置を固定しても、残り N-t 個の値は任意に並べられるので (N-t)! 通り',
      '固定する位置の選び方が C(N,t) 通りあるため、同時発生する t 個の事象の寄与は C(N,t)(N-t)!',
      '複数の固定点を持つ順列は引きすぎ・足しすぎが起きるため、包除原理で符号を交互にする',
      'MOD が素数なので、フェルマーの小定理 a^(MOD-2) を用いて逆階乗を計算できる',
    ],
    complexity: { time: 'O(N + log MOD)', space: 'O(N)' },
    tip: '「少なくとも1つの禁止条件を破る」集合を数えやすいときは、その補集合を包除原理で求める方法が有効です。',
  },
});
