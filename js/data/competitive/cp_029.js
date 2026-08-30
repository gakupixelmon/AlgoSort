// cp_029: 連続部分列の和がKの倍数（Zero-Sum Ranges） ★4 (C++)
// 競プロ典型：区間の和がKの倍数になる条件は、累積和のKを法とする余りが等しいこと
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_029',
  title: '連続部分列の和がKの倍数（Zero-Sum Ranges）',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 4,
  language: 'cpp',
  description: '【累積和と剰余の頻出テクニック】\n非負整数からなる長さ N の列 A = (A_1, A_2, ..., A_N) と整数 K が与えられます。\nA の連続する部分列のうち、要素の総和が K の倍数となるようなものの個数を求めてください。\n※提示された「和がKの倍数となる部分列に分割する問題（貪欲法で解ける）」の類似・発展問題として、部分列の総数を数え上げる非常に有名な典型問題です。',
  inputFormat: {
    params: [
      { name: 'n', type: 'int', desc: '配列の長さ N' },
      { name: 'k', type: 'long long', desc: '法 K' },
      { name: 'a', type: 'vector<long long>', desc: '入力配列（長さ N）' },
    ],
    note: '出力: 条件を満たす連続部分列の個数\n制約: 1 ≤ N ≤ 2×10^5、1 ≤ K ≤ 10^9、0 ≤ A_i < K',
    examples: [
      {
        input: 'n = 6, k = 5\na = [1, 4, 2, 3, 5, 0]',
        output: '7',
        explanation: '累積和を 5 で割った余りを計算すると [0(初期), 1, 0, 2, 0, 0, 0] となります。同じ余りになるペアを選ぶと、その区間の和が 5 の倍数になります。'
      }
    ]
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'long long solveZeroSumRanges(int n, long long k, const vector<long long>& a) {' },
    { id: 1,  code: '    map<long long, long long> rem_count;' },
    { id: 2,  code: '    rem_count[0] = 1; // 何も選ばない場合の和は0' },
    { id: 3,  code: '    long long sum = 0;' },
    { id: 4,  code: '    long long ans = 0;' },
    { id: 5,  code: '    for (int i = 0; i < n; i++) {' },
    { id: 6,  code: '        sum = (sum + a[i]) % k;' },
    { id: 7,  code: '        ans += rem_count[sum];' },
    { id: 8,  code: '        rem_count[sum]++;' },
    { id: 9,  code: '    }' },
    { id: 10, code: '    return ans;' },
    { id: 11, code: '}  // end solveZeroSumRanges' },
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11]
  ],
  hints: [
    '連続部分列 A[l] から A[r] までの和が K の倍数になる条件を、累積和 S を使って考えましょう。',
    '(S[r] - S[l-1]) % K == 0 となるのは、S[r] % K == S[l-1] % K のときです。',
    '累積和の K で割った余りを記録しながら、これまでに出現した同じ余りの個数を足し合わせていくと O(N log N) で解けます。'
  ],
  explanation: {
    summary: '「区間の和がKの倍数」という条件は「累積和のKで割った余りが等しいペアを選ぶ」という条件に言い換えることができます。',
    points: [
      '区間の和に関する問題は累積和 S[i] を考えるのが鉄則です。',
      'S[r] - S[l-1] が K の倍数であることと、S[r] と S[l-1] を K で割った余りが等しいことは同値です。',
      '連想配列（map）を用いて、左から順に各余りの出現回数を記録することで、高速にペアの個数を数え上げることができます。'
    ],
    complexity: { time: 'O(N \\log N)', space: 'O(N)' },
    tip: '元の「Kの倍数の区間になるべく多く分割する」問題は、余りが一致した時点で即座に区間を切り出し、連想配列をリセットする貪欲法で解けます。一緒に覚えておくと良いでしょう。'
  }
});
