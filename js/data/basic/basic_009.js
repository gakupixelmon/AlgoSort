// basic_009: ヒープソート (C++) ★4
// 二分ヒープを用いたソートアルゴリズム。O(N log N)で追加メモリなしのインプレースソートを実現
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'basic_009',
  title: 'ヒープソート',
  category: 'basic',
  categoryLabel: '基本アルゴリズム',
  difficulty: 4,
  language: 'cpp',
  description: '【ヒープソートとは】\n配列を「二分ヒープ（最大値が常に根にくる木構造）」とみなし、最大の要素を末尾と交換してヒープを再構築する操作を繰り返すことでソートを行うアルゴリズムです。\n時間計算量 $O(N \\log N)$ かつ追加メモリ $O(1)$ のインプレースソートを実現します。\n\nまず配列全体をヒープ化し、その後「根（最大値）を取り出して末尾に置き、残りをヒープ化する」ことを繰り返して配列 `arr` を昇順にソートしてください。',
  inputFormat: {
    params: [
      { name: 'arr', type: 'vector<int>&', desc: '並び替え対象の整数配列（参照渡し）' },
    ],
    note: '戻り値: void（arr を直接変更する）\n制約: 1 ≤ arr.size() ≤ 10^5',
    examples: [
      {
        input: 'arr = [4, 10, 3, 5, 1]',
        output: 'arr = [1, 3, 4, 5, 10]',
        explanation: 'まず最大ヒープを構築し [10, 5, 3, 4, 1] となります。次に 10 と末尾の 1 を交換し、サイズ 4 の部分で再度ヒープ化します。これを繰り返すことで昇順になります。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'void heapify(vector<int>& arr, int n, int i) {' },
    { id: 1,  code: '    int largest = i;' },
    { id: 2,  code: '    int left = 2 * i + 1;' },
    { id: 3,  code: '    int right = 2 * i + 2;' },
    { id: 4,  code: '    if (left < n && arr[left] > arr[largest]) {' },
    { id: 5,  code: '        largest = left;' },
    { id: 6,  code: '    }' },
    { id: 7,  code: '    if (right < n && arr[right] > arr[largest]) {' },
    { id: 8,  code: '        largest = right;' },
    { id: 9,  code: '    }' },
    { id: 10, code: '    if (largest != i) {' },
    { id: 11, code: '        swap(arr[i], arr[largest]);' },
    { id: 12, code: '        heapify(arr, n, largest);' },
    { id: 13, code: '    }' },
    { id: 14, code: '}' },
    { id: 15, code: 'void heap_sort(vector<int>& arr) {' },
    { id: 16, code: '    int n = arr.size();' },
    { id: 17, code: '    for (int i = n / 2 - 1; i >= 0; i--) {' },
    { id: 18, code: '        heapify(arr, n, i);' },
    { id: 19, code: '    }' },
    { id: 20, code: '    for (int i = n - 1; i > 0; i--) {' },
    { id: 21, code: '        swap(arr[0], arr[i]);' },
    { id: 22, code: '        heapify(arr, i, 0);' },
    { id: 23, code: '    }' },
    { id: 24, code: '}' }
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9],
    [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16],
    [16, 17], [17, 18], [18, 19], [19, 20], [20, 21], [21, 22], [22, 23], [23, 24]
  ],
  hints: [
    'heapify関数は、注目するノード i とその左右の子 (left = 2*i+1, right = 2*i+2) の中で最大のものを見つけます',
    '最大値が i 以外だった場合、要素を交換して、交換された子に対して再帰的に heapify を呼び出します',
    'heap_sortの前半では、配列の後ろ半分の親ノード (n/2 - 1 から 0) に対して heapify を呼び、全体を最大ヒープにします',
    '後半では、根 (最大値) を未ソート部分の末尾と swap して確定させ、残りの部分 (サイズ i) の根から heapify で再構築します'
  ],
  explanation: {
    summary: 'ヒープソートは、二分ヒープ（完全二分木）の性質を利用したソートです。マージソートのような追加配列を必要としない（インプレースな）アルゴリズムです。',
    points: [
      '完全二分木を配列で表現した場合、インデックス `i` の左の子は `2*i+1`、右の子は `2*i+2` になります',
      'ヒープの構築は $O(N)$ で行えることが数学的に証明されています（深さごとのノード数の等比級数和）',
      '根を取り出して再構築する処理に $O(\\log N)$ かかり、これを $N$ 回繰り返すため全体の計算量は $O(N \\log N)$ です'
    ],
    complexity: { time: 'O(N log N)', space: 'O(1) （再帰呼び出しのスタック領域を除く）' },
    tip: '定数倍の小ささではクイックソートに劣りますが、クイックソートと違って最悪ケースでも $O(N \\log N)$ を保証する強みがあります（C++の std::sort の一部として使われるイントロソートのフォールバック先になっています）。'
  }
});
