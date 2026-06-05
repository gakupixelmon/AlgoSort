// basic_003: 二分探索 (C++)
// id:8 (while の }) と id:10 (関数の }) は trimStart() 後に同一テキスト
// 間に return -1 (id:9) が挟まる → [8,9] と [9,10] で「} return }」順を保証
// permutation ロジックにより、どちらの } が先でも「} return -1 }」順なら正解
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'basic_003',
  title: '二分探索',
  category: 'basic',
  categoryLabel: '基本アルゴリズム',
  difficulty: 2,
  language: 'cpp',
  description: '【二分探索とは】辞書で単語を探すとき、真ん中のページを開いて「目的の単語より前か後ろか」を判断し、半分ずつ範囲を絞り込む方法のことです。1000個の要素でも最大10回の比較（log₂1000 ≈ 10）で答えが見つかる、非常に効率的なアルゴリズムです。ただし、必ず「ソート済みの配列」に対してのみ使えます。\n\nソート済み配列に対して二分探索を行い、target の添字を返せ。見つからなければ -1 を返す。比較のたびに探索範囲を半分に絞るため O(log N) で動作する。',
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'int binary_search(vector<int>& arr, int target) {' },
    { id: 1,  code: '    int left = 0;' },
    { id: 2,  code: '    int right = (int)arr.size() - 1;' },
    { id: 3,  code: '    while (left <= right) {' },
    { id: 4,  code: '        int mid = left + (right - left) / 2;' },
    { id: 5,  code: '        if (arr[mid] == target) return mid;' },
    { id: 6,  code: '        else if (arr[mid] < target) left = mid + 1;' },
    { id: 7,  code: '        else right = mid - 1;' },
    { id: 8,  code: '    }' },
    { id: 9,  code: '    return -1;' },
    { id: 10, code: '}' },
  ],
  // id:1 (left=0) と id:2 (right=size-1) はどちらが先でも動作する
  // id:8 (while の }) と id:10 (関数の }) は視覚的に同一 → permutation で対応
  // [8,9]: while の } の後に return -1 / [9,10]: return -1 の後に関数の }
  partialOrder: [
    [0, 1], [0, 2],
    [1, 3], [2, 3],
    [3, 4], [4, 5], [5, 6], [6, 7],
    // 両 } (id:8, id:10) は while 本体の最後 (id:7) の後に来る
    [7, 8], [7, 10],
    // return -1 (id:9) も while 本体の後
    [7, 9],
    // return -1 は } と } の間に来る: } return -1 } の順を保証
    [8, 9], [9, 10],
  ],
  hints: [
    'left=0, right=arr.size()-1 で探索範囲を初期化する',
    'mid = left + (right - left) / 2 で中点を計算する（オーバーフロー防止）',
    'arr[mid] < target なら left = mid+1、大きければ right = mid-1 で範囲を絞る',
  ],
  explanation: {
    summary: '二分探索はソート済み配列を対象に、探索範囲を毎回半分に絞ることで O(log N) で目標値を見つけるアルゴリズムです。',
    points: [
      '必ずソート済み配列に適用する。未ソートでは正しく動作しない',
      'mid = (left + right) / 2 は large な値でオーバーフローする可能性があるため mid = left + (right - left) / 2 が安全',
      'arr[mid] == target なら即座に mid を返す。一致しなければ left/right を更新',
      'while (left <= right) の条件：left > right になった時点で「存在しない」と判断し -1 を返す',
    ],
    complexity: { time: 'O(log N)', space: 'O(1)' },
    tip: 'C++ STL には lower_bound() / upper_bound() という二分探索関数があり、競技プログラミングでよく使われます。',
  },
});
