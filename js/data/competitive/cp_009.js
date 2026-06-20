// cp_009: バイナリヒープ（最小ヒープ）の実装 ★3 (C++)
// 競プロ典型：push / pop で最小値を O(log N) で管理する優先度付きキュー
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_009',
  title: 'バイナリヒープ（最小ヒープ）の実装',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 3,
  language: 'cpp',
  description: '【バイナリヒープとは】完全二分木の配列表現を利用したデータ構造で、「親 ≤ 子」（最小ヒープ）または「親 ≥ 子」（最大ヒープ）の性質を保ちます。最小値の取得が O(1) で、挿入・削除が O(log N) で行えます。優先度付きキューや Dijkstra 法で必須のデータ構造です。\n\n1-indexed の配列で最小ヒープを実装せよ。push(val) で値を挿入し、top() で最小値を返し、pop() で最小値を削除する。ヒープの性質はヒープアップ（pushUp）とヒープダウン（pushDown）で維持する。',
  inputFormat: {
    params: [
      { name: 'val', type: 'int', desc: '挿入する値' },
    ],
    note: '・push(val): ヒープに値を追加（ヒープアップで再整列）\n・top(): 最小値を返す（heap[1]）\n・pop(): 最小値を削除（ヒープダウンで再整列）\n制約: 1 ≤ val ≤ 10^9、操作数 ≤ 10^5',
    examples: [
      {
        input: 'push(5), push(3), push(7), top()',
        output: '3',
        explanation: '3 が最小値なので top() は 3 を返します。'
      },
      {
        input: 'push(5), push(3), push(7), pop(), top()',
        output: '5',
        explanation: 'pop() で 3 が削除された後、次の最小値 5 が返ります。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'struct MinHeap {' },
    { id: 1,  code: '    vector<int> heap;' },
    { id: 2,  code: '    int sz;' },
    { id: 3,  code: '    MinHeap() : sz(0) { heap.push_back(0); }' },
    { id: 4,  code: '    void pushUp(int i) {' },
    { id: 5,  code: '        while (i > 1 && heap[i] < heap[i / 2]) {' },
    { id: 6,  code: '            swap(heap[i], heap[i / 2]);' },
    { id: 7,  code: '            i /= 2;' },
    { id: 8,  code: '        }' },
    { id: 9,  code: '    }' },
    { id: 10, code: '    void pushDown(int i) {' },
    { id: 11, code: '        while (2 * i <= sz) {' },
    { id: 12, code: '            int c = 2 * i;' },
    { id: 13, code: '            if (c + 1 <= sz && heap[c + 1] < heap[c]) ++c;' },
    { id: 14, code: '            if (heap[i] <= heap[c]) break;' },
    { id: 15, code: '            swap(heap[i], heap[c]);' },
    { id: 16, code: '            i = c;' },
    { id: 17, code: '        }' },
    { id: 18, code: '    }' },
    { id: 19, code: '    void push(int val) {' },
    { id: 20, code: '        heap.push_back(val);' },
    { id: 21, code: '        ++sz;' },
    { id: 22, code: '        pushUp(sz);' },
    { id: 23, code: '    }' },
    { id: 24, code: '    int top() { return heap[1]; }' },
    { id: 25, code: '    void pop() {' },
    { id: 26, code: '        heap[1] = heap[sz--];' },
    { id: 27, code: '        heap.pop_back();' },
    { id: 28, code: '        pushDown(1);' },
    { id: 29, code: '    }' },
    { id: 30, code: '};' },
  ],
  // pushUp（id:4〜9）と pushDown（id:10〜18）はどちらが先でも可
  // push（id:19〜23）は pushUp の後、pop（id:25〜29）は pushDown の後
  partialOrder: [
    [0, 1], [0, 2],
    [1, 3], [2, 3],
    [3, 4], [3, 10],
    [4, 5], [5, 6], [6, 7], [7, 8], [8, 9],
    [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16], [16, 17], [17, 18],
    [9, 19],   // push は pushUp の後
    [18, 25],  // pop は pushDown の後
    [19, 20], [20, 21], [21, 22], [22, 23],
    [23, 24],  // top は push の後（構造的に）
    [24, 25],
    [25, 26], [26, 27], [27, 28], [28, 29],
    [29, 30],
  ],
  hints: [
    'pushUp（ヒープアップ）: 末尾に追加したノードを親と比較し、親より小さければ swap。i /= 2 で親へ上がる。i == 1（根）になるか heap[i] >= heap[i/2] になったら終了',
    'pushDown（ヒープダウン）: 根に末尾の値を置き、子と比較して大きければ swap。左右の子のうち小さいほうと交換する（c+1 <= sz && heap[c+1] < heap[c] なら右の子を選ぶ）',
    'pop: heap[1]（最小値）を heap[sz] で上書きし、sz-- で末尾を削除してから pushDown(1) で再整列',
  ],
  explanation: {
    summary: '最小ヒープは「親 ≤ 子」を常に維持する完全二分木です。pushUp と pushDown の 2 種類の再整列操作で挿入・削除後もヒープ性質を O(log N) で回復します。',
    points: [
      'pushUp: 挿入時に使用。新ノードを末尾に追加後、親と比較して小さければ上へ伝播',
      'pushDown: 削除時に使用。根に末尾値を置いた後、子の小さい方と比較して大きければ下へ伝播',
      'pop の末尾移動: 最後のノードを根に置くことで完全二分木の形を保ったまま削除できる',
      'STL の priority_queue<int, vector<int>, greater<int>> が最小ヒープ。実装を理解すると自前のキーでのカスタムヒープも作れる',
    ],
    complexity: { time: 'push: O(log N)、top: O(1)、pop: O(log N)', space: 'O(N)' },
    tip: 'Dijkstra 法や Prim 法の優先度付きキューとして必須のデータ構造です。また、ヒープソート（Heap Sort）の内部でも同じ pushDown 操作が使われます。',
  },
});
