// basic_007: 二分探索（Lower Bound）★3 (C++)
// ソート済み配列で条件を満たす最小インデックスを O(log N) で探す
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'basic_007',
  title: '二分探索（Lower Bound）',
  category: 'basic',
  categoryLabel: '基本アルゴリズム',
  difficulty: 3,
  language: 'cpp',
  description: '【二分探索とは】「答えの範囲を半分ずつ絞り込む」探索手法です。ソート済み配列に対して毎回中央の要素を調べ、目的の値より大きいか小さいかで探索範囲を半分に削ります。N 個の要素に対して O(log N) で答えが見つかります。\n\nソート済みの整数配列 arr から、値 target 以上の要素が最初に現れるインデックス（Lower Bound）を返せ。存在しない場合は arr.size() を返す。',
  inputFormat: {
    params: [
      { name: 'arr', type: 'vector<int>&', desc: 'ソート済み整数配列' },
      { name: 'target', type: 'int', desc: '探索対象の値' },
    ],
    note: '戻り値: int（target 以上の要素の最初のインデックス。なければ arr.size()）\n制約: 1 ≤ N ≤ 10^6、配列は昇順ソート済み',
    examples: [
      {
        input: 'arr = [1, 2, 4, 4, 5, 8]\ntarget = 4',
        output: '2',
        explanation: '4 以上の最初の要素はインデックス 2 にあります。'
      },
      {
        input: 'arr = [1, 2, 4, 4, 5, 8]\ntarget = 6',
        output: '5',
        explanation: '6 以上の最初の要素は 8 で、インデックス 5 にあります。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'int lower_bound_manual(vector<int>& arr, int target) {' },
    { id: 1,  code: '    int lo = 0, hi = (int)arr.size();' },
    { id: 2,  code: '    while (lo < hi) {' },
    { id: 3,  code: '        int mid = lo + (hi - lo) / 2;' },
    { id: 4,  code: '        if (arr[mid] < target) {' },
    { id: 5,  code: '            lo = mid + 1;' },
    { id: 6,  code: '        } else {' },
    { id: 7,  code: '            hi = mid;' },
    { id: 8,  code: '        }' },
    { id: 9,  code: '    }' },
    { id: 10, code: '    return lo;' },
    { id: 11, code: '}' },
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [4, 6],
    [5, 8], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11],
  ],
  hints: [
    'lo = 0, hi = arr.size() で「答えが存在しうる半開区間 [lo, hi)」を初期化する',
    '中央インデックス mid = lo + (hi - lo) / 2 を計算し、arr[mid] < target なら lo = mid + 1、そうでなければ hi = mid とする',
    'while (lo < hi) のループが終わると lo == hi となり、その値が Lower Bound のインデックス',
  ],
  explanation: {
    summary: '二分探索は探索範囲を毎回半分にすることで O(log N) で答えを見つけます。Lower Bound は「target 以上の最初の位置」を返す典型パターンです。',
    points: [
      'mid = lo + (hi - lo) / 2 のように計算することで int オーバーフローを防ぐ',
      'arr[mid] < target のとき lo = mid + 1：mid は条件を満たさないので左側を切り捨て',
      'それ以外は hi = mid：mid が答え候補になりうるので右側を切り捨て',
      'ループ終了時 lo == hi がそのまま答えになる（存在しない場合は arr.size()）',
    ],
    complexity: { time: 'O(log N)', space: 'O(1)' },
    tip: 'C++ 標準ライブラリの std::lower_bound(arr.begin(), arr.end(), target) で同じ結果が得られます。競技では自前実装よりこちらが速くて安全です。',
  },
});
