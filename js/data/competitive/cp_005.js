// cp_005: 平衡二分探索木（AVL木）の回転操作 ★5 (C++)
// 競プロ典型：AVL木の左回転・右回転で高さバランスを維持する
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_005',
  title: '平衡二分探索木（AVL木）の挿入と回転',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 5,
  language: 'cpp',
  description: '【AVL木とは】高さのバランスを保つ二分探索木（BST）です。各ノードの左右部分木の高さの差（バランス因子）が常に -1〜+1 になるよう、挿入・削除後に「回転操作」を行います。これにより最悪ケースでも O(log N) が保証されます。\n\nAVL木に整数を挿入する insert 関数を完成させよ。LL・RR ケースの回転（leftRotate / rightRotate）を適切に呼び出し、挿入後も各ノードの高さと平衡を維持すること。',
  inputFormat: {
    params: [
      { name: 'node', type: 'Node*', desc: '現在の部分木の根（nullptr の場合もある）' },
      { name: 'key',  type: 'int',   desc: '挿入する整数値' },
    ],
    note: '戻り値: Node*（回転後の部分木の新しい根）\n・高さ: 葉ノードの高さ = 1\n・バランス因子 bf = height(left) - height(right)\n・bf > 1（左過多）→ LL/LR 回転、bf < -1（右過多）→ RR/RL 回転',
    examples: [
      {
        input: 'insert(root, 10), insert(root, 20), insert(root, 30)',
        output: '根が 20、左子 10、右子 30 の木',
        explanation: '30 の挿入後に RR ケース（右過多）が発生し、leftRotate で 20 が新しい根になります。'
      },
      {
        input: 'insert(root, 30), insert(root, 20), insert(root, 10)',
        output: '根が 20、左子 10、右子 30 の木',
        explanation: '10 の挿入後に LL ケース（左過多）が発生し、rightRotate で 20 が新しい根になります。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'struct Node { int key, height; Node *left, *right; };' },
    { id: 1,  code: 'int height(Node* n) { return n ? n->height : 0; }' },
    { id: 2,  code: 'Node* newNode(int key) {' },
    { id: 3,  code: '    return new Node{key, 1, nullptr, nullptr};' },
    { id: 4,  code: '}' },
    { id: 5,  code: 'Node* leftRotate(Node* x) {' },
    { id: 6,  code: '    Node* y = x->right;' },
    { id: 7,  code: '    x->right = y->left;' },
    { id: 8,  code: '    y->left = x;' },
    { id: 9,  code: '    x->height = 1 + max(height(x->left), height(x->right));' },
    { id: 10, code: '    y->height = 1 + max(height(y->left), height(y->right));' },
    { id: 11, code: '    return y;' },
    { id: 12, code: '}' },
    { id: 13, code: 'Node* rightRotate(Node* y) {' },
    { id: 14, code: '    Node* x = y->left;' },
    { id: 15, code: '    y->left = x->right;' },
    { id: 16, code: '    x->right = y;' },
    { id: 17, code: '    y->height = 1 + max(height(y->left), height(y->right));' },
    { id: 18, code: '    x->height = 1 + max(height(x->left), height(x->right));' },
    { id: 19, code: '    return x;' },
    { id: 20, code: '}' },
    { id: 21, code: 'Node* insert(Node* node, int key) {' },
    { id: 22, code: '    if (!node) return newNode(key);' },
    { id: 23, code: '    if (key < node->key) node->left  = insert(node->left,  key);' },
    { id: 24, code: '    else                  node->right = insert(node->right, key);' },
    { id: 25, code: '    node->height = 1 + max(height(node->left), height(node->right));' },
    { id: 26, code: '    int bf = height(node->left) - height(node->right);' },
    { id: 27, code: '    if (bf > 1  && key < node->left->key)  return rightRotate(node);' },
    { id: 28, code: '    if (bf < -1 && key > node->right->key) return leftRotate(node);' },
    { id: 29, code: '    if (bf > 1  && key > node->left->key)  { node->left  = leftRotate(node->left);  return rightRotate(node); }' },
    { id: 30, code: '    if (bf < -1 && key < node->right->key) { node->right = rightRotate(node->right); return leftRotate(node); }' },
    { id: 31, code: '    return node;' },
    { id: 32, code: '}' },
  ],
  // height の後なら leftRotate / rightRotate はどちらが先でも可
  // newNode は回転関数と独立。insert は height / newNode / 両回転関数の後
  atomicGroups: [
    [2, 3, 4],
    [5, 6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19, 20],
  ],
  partialOrder: [
    [0, 1], [0, 2],      // Node 構造体の後に height と newNode
    [2, 3], [3, 4],
    [1, 5], [1, 13],
    [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12],
    [13, 14], [14, 15], [15, 16], [16, 17], [17, 18], [18, 19], [19, 20],
    [1, 21], [4, 21], [12, 21], [20, 21],  // insert は依存関数の後
    [21, 22], [22, 23], [23, 24], [24, 25], [25, 26],
    [26, 27], [26, 28], [26, 29], [26, 30],
    [27, 31], [28, 31], [29, 31], [30, 31],
    [31, 32],
  ],
  hints: [
    '通常の BST 挿入（key < node->key なら左、それ以外なら右）の後、高さを更新してからバランス因子を計算する',
    'bf = height(left) - height(right)。bf > 1 なら左過多（LL/LR）、bf < -1 なら右過多（RR/RL）',
    'LL: rightRotate(node)、RR: leftRotate(node)、LR: 先に左子を leftRotate してから rightRotate、RL: 先に右子を rightRotate してから leftRotate',
  ],
  explanation: {
    summary: 'AVL木は挿入のたびに「バランス因子（左高さ − 右高さ）」を確認し、±1 を超えた場合に回転で修正します。4 パターン（LL/RR/LR/RL）の回転を正しく適用することで O(log N) の高さを維持します。',
    points: [
      'height(nullptr) = 0 として帰納的に高さを管理。挿入後に node->height を更新するのを忘れずに',
      'leftRotate(x): x の右子 y が新しい根になり、y->left は x の右子に移る',
      'rightRotate(y): y の左子 x が新しい根になり、x->right は y の左子に移る',
      'LR ケース: 左子が右側に偏っている → 左子を leftRotate してから rightRotate（2回回転）',
    ],
    complexity: { time: 'O(log N) per insert', space: 'O(N)' },
    tip: '競プロでは std::set や std::map が内部で平衡BST（多くは赤黒木）を使います。AVL木の手実装は面接・競プロ上級者向けですが、回転の仕組みを理解することで木系データ構造全般の理解が深まります。',
  },
});
