// dp_003: 最長増加部分列 LIS (C++) ★4
// 典型的な競プロ DP 問題。O(N log N) 解法
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dp_003',
  title: '最長増加部分列（LIS）',
  category: 'dp',
  categoryLabel: '動的計画法',
  difficulty: 4,
  language: 'cpp',
  description: '【LIS（最長増加部分列）とは】配列の中から「後ろに行くほど値が増える」要素を選んで部分列を作ったとき、その長さの最大値を求める問題です。例えば [3, 1, 4, 1, 5, 9, 2, 6] から [1, 4, 5, 9] や [1, 2, 6] などを選べますが、最長は長さ4です。\n\n整数配列 arr の最長増加部分列（Longest Increasing Subsequence, LIS）の長さを返せ。要素の添字は必ずしも連続でなくてよい。O(N log N) の解法を実装せよ。',
  inputFormat: {
    params: [
      { name: 'arr', type: 'vector<int>&', desc: '整数配列（長さ N）' },
    ],
    note: '戻り値: int（LIS の長さ）\n制約: 1 ≤ N ≤ 10^5、−10^9 ≤ arr[i] ≤ 10^9',
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'int lis(vector<int>& arr) {' },
    { id: 1,  code: '    vector<int> dp;' },
    { id: 2,  code: '    for (int x : arr) {' },
    { id: 3,  code: '        auto it = lower_bound(dp.begin(), dp.end(), x);' },
    { id: 4,  code: '        if (it == dp.end()) {' },
    { id: 5,  code: '            dp.push_back(x);' },
    { id: 6,  code: '        } else {' },
    { id: 7,  code: '            *it = x;' },
    { id: 8,  code: '        }' },
    { id: 9,  code: '    }' },
    { id: 10, code: '    return (int)dp.size();' },
    { id: 11, code: '}' },
  ],
  // id:8 は if-else の閉じ括弧で id:5 または id:7 の後に来る
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [4, 6],
    [5, 8], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11],
  ],
  hints: [
    'dp を空の vector<int> として初期化する。dp[i] は「長さ i+1 の増加部分列の末尾の最小値」を保持する',
    '各要素 x について lower_bound で dp の中から x 以上の最初の位置 it を探す',
    'it == dp.end() なら dp を末尾に追加（LIS が伸びた）。そうでなければ *it = x で末尾最小値を更新する',
  ],
  explanation: {
    summary: 'O(N log N) の LIS は「dp[i] = 長さ i+1 の増加部分列の末尾の最小値」という配列を管理することで実現します。dp は常に単調増加を維持するため binary search が使えます。',
    points: [
      'dp は「現時点で作れる各長さの増加部分列の末尾最小値」であり、常に昇順に並ぶ',
      'lower_bound(dp.begin(), dp.end(), x) は dp の中で x 以上の最初の位置を O(log N) で返す',
      'it が dp.end() → 全要素より大きい → 新しい最長部分列が出来た → push_back',
      '*it = x で更新 → 同じ長さの部分列の末尾をより小さい値で置き換え、将来の伸びしろを最大化',
    ],
    complexity: { time: 'O(N log N)', space: 'O(N)' },
    tip: 'この dp は最終的な LIS の実際の並びを示しているわけではなく、あくまで「長さの計算」に特化した補助配列です。実際の LIS 数列を復元したい場合は親ポインタ配列を別途管理する必要があります。',
  },
});
