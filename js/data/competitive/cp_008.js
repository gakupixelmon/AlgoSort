// cp_008: 完全二分木（Complete Binary Tree）の配列表現 ★3 (C++)
// 競プロ典型：配列で完全二分木を管理し、親・子の添字計算を実装する
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_008',
  title: '完全二分木の配列表現と添字計算',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 3,
  language: 'cpp',
  description: '【完全二分木とは】すべての葉が同じ深さか最終段だけ左から詰まっている二分木です。配列で効率よく表現でき、1-indexed のとき i 番目のノードの親は i/2、左の子は 2i、右の子は 2i+1 で得られます（配列の余分なポインタ不要）。ヒープや BFS 管理に利用されます。\n\n1-indexed の配列で完全二分木を管理するクラス CBT を実装せよ。push(val) で末尾に値を追加し、parent(i) / leftChild(i) / rightChild(i) でそれぞれの添字を返す。存在しない場合は -1 を返す。',
  inputFormat: {
    params: [
      { name: 'val', type: 'int',  desc: '追加する値' },
      { name: 'i',   type: 'int',  desc: 'ノードの添字（1-indexed）' },
    ],
    note: '・push(val): 末尾（最後の葉の次）にノードを追加\n・parent(i): 親の添字（i==1 なら -1）\n・leftChild(i): 左の子の添字（存在しなければ -1）\n・rightChild(i): 右の子の添字（存在しなければ -1）\n制約: ノード数 N ≤ 10^6',
    examples: [
      {
        input: 'push(1),push(2),push(3),push(4), parent(4)',
        output: '2',
        explanation: '4番目のノードの親は 4/2 = 2 です。'
      },
      {
        input: 'push(1),push(2),push(3), leftChild(1)',
        output: '2',
        explanation: '1番ノードの左の子は 2*1 = 2 です。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'struct CBT {' },
    { id: 1,  code: '    vector<int> tree;' },
    { id: 2,  code: '    int size;' },
    { id: 3,  code: '    CBT() : size(0) { tree.push_back(0); }' },
    { id: 4,  code: '    void push(int val) {' },
    { id: 5,  code: '        tree.push_back(val);' },
    { id: 6,  code: '        ++size;' },
    { id: 7,  code: '    }' },
    { id: 8,  code: '    int parent(int i) {' },
    { id: 9,  code: '        if (i <= 1) return -1;' },
    { id: 10, code: '        return i / 2;' },
    { id: 11, code: '    }' },
    { id: 12, code: '    int leftChild(int i) {' },
    { id: 13, code: '        int c = 2 * i;' },
    { id: 14, code: '        return c <= size ? c : -1;' },
    { id: 15, code: '    }' },
    { id: 16, code: '    int rightChild(int i) {' },
    { id: 17, code: '        int c = 2 * i + 1;' },
    { id: 18, code: '        return c <= size ? c : -1;' },
    { id: 19, code: '    }' },
    { id: 20, code: '};' },
  ],
  // struct 内のメンバ変数・コンストラクタ・メンバ関数は、この問題ではトップレベル順不同
  // 各メンバ関数の内部だけは連続したまとまりとして扱う
  atomicGroups: [
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [16, 17, 18, 19],
  ],
  partialOrder: [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 8], [0, 12], [0, 16],
    [4, 5], [5, 6], [6, 7],
    [8, 9], [9, 10], [10, 11],
    [12, 13], [13, 14], [14, 15],
    [16, 17], [17, 18], [18, 19],
    [1, 20], [2, 20], [3, 20], [7, 20], [11, 20], [15, 20], [19, 20],
  ],
  hints: [
    'tree[0] はダミー（使用しない）。1-indexed にすることで親 = i/2、左の子 = 2i、右の子 = 2i+1 という綺麗な式が成立する',
    'push では tree.push_back(val) と ++size の両方が必要。size が現在の要素数を管理し、子の存在確認に使う',
    '子の存在確認: leftChild(i) は 2*i <= size のときのみ存在。rightChild(i) は 2*i+1 <= size のときのみ存在',
  ],
  explanation: {
    summary: '完全二分木を配列で表現するとポインタが不要になり、メモリ効率と局所性が向上します。1-indexed の場合、親・子の添字が整数除算と乗算だけで求まるのが最大の利点です。',
    points: [
      '1-indexed 配列: tree[0] は未使用（ダミー）。tree[1] が根、tree[size] が最後の葉',
      '親: i / 2（整数除算）。根（i=1）の親は存在しないので -1',
      '左の子: 2 * i。存在条件: 2*i <= size',
      '右の子: 2 * i + 1。存在条件: 2*i+1 <= size',
      'この性質はバイナリヒープ・セグメント木・BFS キューの実装に直結する',
    ],
    complexity: { time: 'push: O(1) amortized、parent/leftChild/rightChild: O(1)', space: 'O(N)' },
    tip: '配列の 0-indexed でも同様の計算ができます（親: (i-1)/2、左の子: 2i+1、右の子: 2i+2）。STL の priority_queue は内部でこの配列表現のヒープを使っています。',
  },
});
