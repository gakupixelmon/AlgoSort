// basic_002: バブルソート (Python)
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'basic_002',
  title: 'バブルソート（Python版）',
  category: 'basic',
  categoryLabel: '基本アルゴリズム',
  difficulty: 1,
  language: 'python',
  description: '【バブルソートとは】隣り合う2つの数を比べて、大きい方を右に移動させる操作を繰り返すことで、配列を小さい順に並べる方法です。泡が浮かび上がるように大きな値が末尾へ移動していく、プログラミング学習の入門アルゴリズムです。\n\n配列 arr をバブルソートで昇順に並び替えよ。Python で隣接要素の比較・交換を繰り返し実装する。',
  blocks: [
    { id: 0, code: 'def bubble_sort(arr):' },
    { id: 1, code: '    n = len(arr)' },
    { id: 2, code: '    for i in range(n - 1):' },
    { id: 3, code: '        for j in range(n - 1 - i):' },
    { id: 4, code: '            if arr[j] > arr[j + 1]:' },
    { id: 5, code: '                arr[j], arr[j + 1] = arr[j + 1], arr[j]' },
    { id: 6, code: '    return arr' },
  ],
  // Python はインデントで構造が分かるため全て固定順
  correctOrders: [[0, 1, 2, 3, 4, 5, 6]],
  hints: [
    'n = len(arr) でリストの長さを取得し、外側ループは range(n - 1)',
    '内側ループは range(n - 1 - i) で末尾の確定済み部分をスキップ',
    'Python のタプル代入 a, b = b, a で swap できる',
  ],
  explanation: {
    summary: 'Python でバブルソートを実装します。C++ の swap() の代わりに Python のタプル代入を使うのが特徴です。',
    points: [
      'Python ではタプル代入 arr[j], arr[j+1] = arr[j+1], arr[j] で一行でスワップ可能',
      '内側ループ range(n-1-i) の上限は i の増加に伴い小さくなる（確定済み末尾を除外）',
      'return arr は関数の最後に配置（Python は pass-by-reference ではないため明示的に返す）',
    ],
    complexity: { time: 'O(N²)', space: 'O(1)' },
    tip: 'Python の sorted() や list.sort() は TimSort アルゴリズムで O(N log N) です。実用はそちらを使いましょう。',
  },
});
