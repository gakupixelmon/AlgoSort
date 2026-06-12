// basic_008: マージソート (C++) ★3
// 分割統治法の代表的なアルゴリズム。O(N log N)を保証するソート
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'basic_008',
  title: 'マージソート',
  category: 'basic',
  categoryLabel: '基本アルゴリズム',
  difficulty: 3,
  language: 'cpp',
  description: '【マージソートとは】「配列を半分に分割し、それぞれをソートしてから1つにまとめる（マージする）」を再帰的に繰り返すアルゴリズムです。バブルソートの O(N²) と違い、常に O(N log N) を保証できるため大規模データに向いています。「分割統治法（Divide and Conquer）」の典型例です。\n\n配列 arr[lo, hi)（半開区間）をマージソートで昇順に並び替えよ。再帰的に左右に分割し、merge_sort_impl でマージする。マージ処理は一時バッファ tmp を使って実現せよ。',
  inputFormat: {
    params: [
      { name: 'arr', type: 'vector<int>&', desc: '並び替え対象の整数配列（参照渡し）' },
      { name: 'lo', type: 'int', desc: 'ソート対象の開始インデックス（含む）' },
      { name: 'hi', type: 'int', desc: 'ソート対象の終了インデックス（含まない）' },
    ],
    note: '戻り値: void（arr を直接変更する）\n制約: 1 ≤ arr.size() ≤ 10^6',
    examples: [
      {
        input: 'arr = [5, 2, 8, 1, 9, 3]\nlo = 0, hi = 6',
        output: 'arr = [1, 2, 3, 5, 8, 9]',
        explanation: '[5,2,8] と [1,9,3] に分割し各々ソート後にマージ。[2,5,8] と [1,3,9] → [1,2,3,5,8,9]。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'void merge_sort_impl(vector<int>& arr, int lo, int hi) {' },
    { id: 1,  code: '    if (hi - lo <= 1) return;' },
    { id: 2,  code: '    int mid = lo + (hi - lo) / 2;' },
    { id: 3,  code: '    merge_sort_impl(arr, lo, mid);' },
    { id: 4,  code: '    merge_sort_impl(arr, mid, hi);' },
    { id: 5,  code: '    vector<int> tmp;' },
    { id: 6,  code: '    int l = lo, r = mid;' },
    { id: 7,  code: '    while (l < mid || r < hi) {' },
    { id: 8,  code: '        if (r >= hi || (l < mid && arr[l] <= arr[r])) {' },
    { id: 9,  code: '            tmp.push_back(arr[l++]);' },
    { id: 10, code: '        } else {' },
    { id: 11, code: '            tmp.push_back(arr[r++]);' },
    { id: 12, code: '        }' },
    { id: 13, code: '    }' },
    { id: 14, code: '    copy(tmp.begin(), tmp.end(), arr.begin() + lo);' },
    { id: 15, code: '}' },
  ],
  // id:3（左再帰）と id:4（右再帰）はどちらが先でも論理的に等価
  // ただし id:2（mid計算）の後でないといけない
  // id:5（tmp宣言）と id:6（l,r初期化）はどちらが先でも可（両者は独立）
  // id:12, id:13 は } で同一テキスト。12 は if-else の直後、13 は while の直後
  // 12 < 13 の順序を強制
  partialOrder: [
    [0, 1], [1, 2],
    [2, 3], [2, 4],     // 左右の再帰はどちらが先でも可（midが決まってから）
    [3, 5], [4, 5],     // tmp宣言は両再帰の後
    [3, 6], [4, 6],     // l,r初期化は両再帰の後
    [5, 7], [6, 7],     // while は tmp と l,r 両方の後
    [7, 8], [8, 9], [8, 10],
    [9, 12], [10, 11], [11, 12],
    [12, 13],
    [13, 14], [14, 15],
  ],
  hints: [
    '再帰のベースケース: hi - lo <= 1（要素が1個以下）なら return',
    'mid = lo + (hi - lo) / 2 で中点を計算し、左 [lo, mid) と右 [mid, hi) を再帰的にソートする（順不同）',
    'マージ: l=lo, r=mid として左右から小さい方を tmp に追加。r >= hi（右が尽きた）または arr[l] <= arr[r] なら左から取る。最後に copy で arr に書き戻す',
  ],
  explanation: {
    summary: 'マージソートは「分割統治法」の典型例です。常に O(N log N) を保証でき、安定ソートでもあります。再帰の深さが O(log N)、各レベルでの処理が O(N) であることから全体 O(N log N) が導かれます。',
    points: [
      '分割: mid = lo + (hi - lo) / 2 で半分に割る。左右の再帰はどちらが先でも正解',
      'マージ条件: r >= hi（右が尽きた）または l < mid かつ arr[l] <= arr[r] なら左から取る。等号（<=）により安定ソートが実現される',
      'copy(tmp.begin(), tmp.end(), arr.begin() + lo) でマージ結果を元の配列に書き戻す',
      'バブルソート O(N²) と違い最悪ケースでも O(N log N) を保証。ただし O(N) の追加メモリが必要',
    ],
    complexity: { time: 'O(N log N)', space: 'O(N)（一時バッファ）' },
    tip: 'std::sort() は多くの実装でイントロソート（クイックソート + ヒープソート + 挿入ソートのハイブリッド）を使います。マージソートは外部ソート（ファイルのソート）や安定ソートが必要な場面で重要です。',
  },
});
