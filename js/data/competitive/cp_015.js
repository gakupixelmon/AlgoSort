// cp_015: 円環の展開（配列の2倍化） ★3 (C++)
// 競プロ典型：円環の問題は配列を2倍にして直線として扱う
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_015',
  title: '円環の展開（配列の2倍化）',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 3,
  language: 'cpp',
  description: '【円環の2倍化テクニック】\n円環状（リング状）に並んだデータに対する処理は、境界条件（最後尾から先頭へのループ）の扱いが面倒になりがちです。\nこのような場合、配列を「2周分」繋げて長さ 2N の直線配列にすることで、単なる「長さ N 以下の連続部分列」の処理に帰着でき、計算量を落としたり実装を劇的にシンプルにできます。\nここでは例として、円環状の配列から長さ N 以下の連続部分列を選んだときの最大和を求めます。',
  inputFormat: {
    params: [
      { name: 'a', type: 'vector<int>', desc: '入力配列（長さ N）' },
    ],
    note: '出力: 円環状の連続部分列（長さ N 以下）の最大和\n制約: 1 ≤ N ≤ 10^5、|a[i]| ≤ 10^9',
    examples: [
      {
        input: 'a = [1, -2, 3, 1]',
        output: '5',
        explanation: '要素を 3, 1, 1 と選んだ場合が最大値 5 となります。配列を [1, -2, 3, 1, 1, -2, 3, 1] と2倍に展開して考えます。'
      }
    ]
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'long long solveCircularMaxSum(const vector<int>& a) {' },
    { id: 1,  code: '    int n = a.size();' },
    { id: 2,  code: '    vector<int> A(2 * n);' },
    { id: 3,  code: '    vector<long long> S(2 * n + 1, 0);' },
    { id: 4,  code: '    for (int i = 0; i < 2 * n; i++) {' },
    { id: 5,  code: '        A[i] = a[i % n];' },
    { id: 6,  code: '        S[i + 1] = S[i] + A[i];' },
    { id: 7,  code: '    }' },
    { id: 8,  code: '    long long ans = -1e18;' },
    { id: 9,  code: '    deque<int> dq;' },
    { id: 10, code: '    for (int j = 1; j <= 2 * n; j++) {' },
    { id: 11, code: '        int i_cand = j - 1;' },
    { id: 12, code: '        while (!dq.empty() && S[dq.back()] >= S[i_cand]) dq.pop_back();' },
    { id: 13, code: '        dq.push_back(i_cand);' },
    { id: 14, code: '        while (!dq.empty() && dq.front() < j - n) dq.pop_front();' },
    { id: 15, code: '        ans = max(ans, S[j] - S[dq.front()]);' },
    { id: 16, code: '    }' },
    { id: 17, code: '    return ans;' },
    { id: 18, code: '}  // end solveCircularMaxSum' },
  ],
  partialOrder: [
    [0, 1], [1, 2], [1, 3], [2, 4], [3, 4], [4, 5], [5, 6], [6, 7],
    [7, 8], [7, 9], [8, 10], [9, 10], [10, 11], [10, 14], [11, 12],
    [12, 13], [13, 15], [14, 15], [15, 16], [16, 17], [17, 18]
  ],
  hints: [
    'まずは配列 a の要素を 2 回繰り返した長さ 2N の配列 A を構築します',
    '次に配列 A の累積和 S を計算します',
    'あとは S[j] - S[i] の最大化を考えます。i は j-n 以上である必要があるため、幅 n のスライド最小値を利用して O(N) で解けます'
  ],
  explanation: {
    summary: '円環の問題は「配列を2周分用意する」ことで直線の問題に帰着できることが多いです。長さN以下の部分列を選ぶ問題は、長さ2Nの直線配列における長さN以下の部分列の問題と完全に等価になります。',
    points: [
      'A[i] = a[i % n] とすることで、剰余演算を使って簡単に2周分の配列が作れます',
      '累積和とスライド最小値を組み合わせることで、区間の和の最大値を O(N) で求めることができます',
      '円環の分割問題（円環DPや区間の分割など）でも同様に、開始位置を全探索するかわりに2倍の配列を用意して直線の問題に帰着させるテクニックが頻出します'
    ],
    complexity: { time: 'O(N)', space: 'O(N)' },
    tip: '円環配列では、「2周分の配列を作る」か「(全体の和) - (最小連続部分列)」のように余事象を考えるかのどちらかが典型的なアプローチになります。'
  }
});
