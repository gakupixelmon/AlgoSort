// basic_001: バブルソート (C++)
// id:6,7,8,9 はすべて } → trimStart() 後に同一テキスト → 順序制約なし（game.js の permutation ロジックで対応）
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'basic_001',
  title: 'バブルソート',
  category: 'basic',
  categoryLabel: '基本アルゴリズム',
  difficulty: 1,
  language: 'cpp',
  description: '【バブルソートとは】隣り合う2つの数を比べて、大きい方を右に移動させる操作を繰り返すことで、配列を小さい順に並べる方法です。1回のパスが終わるたびに「その時点での最大値」が末尾に確定し、泡が水中を浮き上がるように大きな値が右端へ移動していくことが名前の由来です。\n\n配列 arr をバブルソートで昇順に並び替えよ。隣接する要素を比較・交換を繰り返すことで最大値が末尾に「浮き上がる」O(N²) アルゴリズム。',
  inputFormat: {
    params: [
      { name: 'arr', type: 'vector<int>&', desc: '並び替え対象の整数配列（参照渡し）' },
    ],
    note: '戻り値: void（arr を直接変更する）\n制約: 1 ≤ N ≤ 10^4',
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0, code: 'void bubble_sort(vector<int>& arr) {' },
    { id: 1, code: '    int n = arr.size();' },
    { id: 2, code: '    for (int i = 0; i < n - 1; i++) {' },
    { id: 3, code: '        for (int j = 0; j < n - 1 - i; j++) {' },
    { id: 4, code: '            if (arr[j] > arr[j + 1]) {' },
    { id: 5, code: '                swap(arr[j], arr[j + 1]);' },
    { id: 6, code: '            }' },
    { id: 7, code: '        }' },
    { id: 8, code: '    }' },
    { id: 9, code: '}' },
  ],
  // id:6,7,8,9 はすべて } → 相互の順序制約なし。swap(id:5)の後に全て来ればよい
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
    [5, 6], [5, 7], [5, 8], [5, 9],
  ],
  hints: [
    '外側ループ i は 0 〜 n-2 まで回す（最後の要素は比較不要）',
    '内側ループ j は 0 〜 n-2-i まで回す（i 回目の終了後、末尾 i 個は確定済み）',
    '隣接要素 arr[j] > arr[j+1] なら swap で入れ替える',
  ],
  explanation: {
    summary: 'バブルソートは隣接する要素を比較・交換して最大値を末尾に「浮き上がらせる」シンプルなソートアルゴリズムです。',
    points: [
      '外側ループが1周するごとに未確定部分の最大値が末尾に確定する',
      '内側ループの上限が n-1-i である理由：末尾 i 個はすでに確定済みなので比較不要',
      'swap() は C++ 標準ライブラリ。手動で tmp 変数を使う方法と等価',
      '最悪・平均計算量は O(N²)。実用では使われないが、アルゴリズム学習の基本',
    ],
    complexity: { time: 'O(N²)', space: 'O(1)' },
    tip: '実際の競技プログラミングでは std::sort()（O(N log N)）を使います。バブルソートは概念理解のための入門アルゴリズムです。',
  },
});
