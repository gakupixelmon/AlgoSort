// basic_005: 選択ソート (C++) ★2
// 未ソート部分から最小値を選んで先頭と交換するアルゴリズム
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'basic_005',
  title: '選択ソート',
  category: 'basic',
  categoryLabel: '基本アルゴリズム',
  difficulty: 2,
  language: 'cpp',
  description: '【選択ソートとは】未整列の部分から「一番小さい値」を探し出して先頭に持ってくる、という操作を繰り返すことで配列を整列させる方法です。トランプを並べ替えるとき「残りの手札から一番小さいカードを選んで左端に置く」動作と同じです。\n\n配列 arr を選択ソートで昇順に並び替えよ。\n未ソート部分の最小値を見つけて先頭と交換することを繰り返すアルゴリズム。\n外側ループで「今確定する位置 i」を左から右へ移動し、内側ループで位置 i 以降の最小値のインデックス minIdx を探す。',
  inputFormat: {
    params: [
      { name: 'arr', type: 'vector<int>&', desc: '並び替え対象の整数配列（参照渡し）' },
    ],
    note: '戻り値: void（arr を直接変更する）\n制約: 1 ≤ N ≤ 10^4',
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0, code: 'void selection_sort(vector<int>& arr) {' },
    { id: 1, code: '    int n = arr.size();' },
    { id: 2, code: '    for (int i = 0; i < n - 1; i++) {' },
    { id: 3, code: '        int minIdx = i;' },
    { id: 4, code: '        for (int j = i + 1; j < n; j++) {' },
    { id: 5, code: '            if (arr[j] < arr[minIdx]) {' },
    { id: 6, code: '                minIdx = j;' },
    { id: 7, code: '            }' },
    { id: 8, code: '        }' },
    { id: 9, code: '        swap(arr[i], arr[minIdx]);' },
    { id: 10, code: '    }' },
    { id: 11, code: '}' },
  ],
  // id:7,8,10,11 はすべて } → trimStart() 後に同一テキスト
  // partialOrder でブロック間の順序制約を定義
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
    // } の順序制約：if の } (7) → for (8) → swap (9) → 外for (10) → 関数 (11)
    [6, 7],
    [7, 8], [5, 8],
    [8, 9],
    [9, 10],
    [10, 11],
    // minIdx = i は外側ループ内、内側ループの前
    [2, 3], [3, 4],
    // swap は内側ループの後
    [4, 9], [8, 9],
  ],
  hints: [
    '外側ループ i は 0〜n-2 まで。各ステップで「位置 i 以降の最小値のインデックス minIdx」を探す',
    '内側ループ j は i+1〜n-1 まで回し、arr[j] < arr[minIdx] なら minIdx を更新',
    '内側ループ終了後、arr[i] と arr[minIdx] を swap。これで i 番目が確定する',
  ],
  explanation: {
    summary: '選択ソートは「未ソート部分から最小値を選んで先頭に移動する」を繰り返すシンプルなソートアルゴリズムです。比較回数は常に O(N²) ですが、交換回数は最大 N-1 回と少ないのが特徴です。',
    points: [
      '外側ループが1周するごとに1つの要素が確定位置に移動する（左から確定していく）',
      '内側ループで最小値インデックス minIdx を探し、外側ループの先頭 i と交換',
      'バブルソートと同じ O(N²) だが、交換回数が少ない（最大 N-1 回）',
      '安定ソートではない（同値要素の相対順序が保証されない）',
    ],
    complexity: { time: 'O(N²)', space: 'O(1)' },
    tip: '「交換コストが高い場合」に選択ソートが有利なことがある。ただし実用では std::sort() を使用する。',
  },
});
