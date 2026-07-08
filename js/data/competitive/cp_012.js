// cp_012: 赤黒木（Red-Black Tree）の挿入後修正 ★5 (C++)
// 競プロ典型：insertFixup で赤黒性質を O(log N) で回復する
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_012',
  title: '赤黒木（Red-Black Tree）の挿入後修正',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 5,
  language: 'cpp',
  description: '【赤黒木とは】各ノードを赤または黒に彩色した平衡 BST です。次の 4 性質を常に保ちます: ①根は黒、②赤ノードの子は黒（赤連続禁止）、③すべての葉〜根パスの黒ノード数が等しい、④葉（NIL）は黒。これにより高さが O(log N) に保証されます。\n\n挿入したノード z（初期色: 赤）の後、赤連続が生じた場合に fixup で修正する。3 ケース（叔父が赤 / 叔父が黒で内側 / 叔父が黒で外側）を左右対称に処理し、最後に根を黒に染め直すこと。',
  inputFormat: {
    params: [
      { name: 'root', type: 'Node*&', desc: '赤黒木の根（参照渡し）' },
      { name: 'z',    type: 'Node*',  desc: '新規挿入されたノード（color=RED）' },
    ],
    note: '・leftRotate(root, x): x を中心に左回転\n・rightRotate(root, y): y を中心に右回転\n・fixup(root, z): 赤連続を解消して赤黒性質を回復\n制約: ノード数 N ≤ 10^6',
    examples: [
      {
        input: '挿入: 10→20→30（右側に偏る）',
        output: '根=20（黒）、左=10（黒）、右=30（黒）',
        explanation: '30 挿入後に RR ケース（叔父なし・外側）が発生。leftRotate + 再彩色で修正。'
      },
      {
        input: '挿入: 10→20→15（LR ケース）',
        output: '根=15（黒）、左=10（黒）、右=20（黒）',
        explanation: '15 挿入後に叔父が黒・内側。まず rightRotate 後 leftRotate で修正。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    // ── データ構造 ──────────────────────────────────────────
    { id: 0,  code: 'enum Color { RED, BLACK };' },
    { id: 1,  code: 'struct Node { int key; Color color; Node *left, *right, *parent; };' },
    { id: 2,  code: 'Node* newNode(int k) { return new Node{k, RED, nullptr, nullptr, nullptr}; }' },
    // ── 左回転 ──────────────────────────────────────────────
    { id: 3,  code: 'void leftRotate(Node*& root, Node* x) {' },
    { id: 4,  code: '    Node* y = x->right;' },
    { id: 5,  code: '    x->right = y->left;' },
    { id: 6,  code: '    if (y->left) y->left->parent = x;' },
    { id: 7,  code: '    y->parent = x->parent;' },
    { id: 8,  code: '    if (!x->parent) root = y;' },
    { id: 9,  code: '    else if (x == x->parent->left) x->parent->left = y;' },
    { id: 10, code: '    else x->parent->right = y;' },
    { id: 11, code: '    y->left = x;  x->parent = y;' },
    { id: 12, code: '}  // end leftRotate' },
    // ── 右回転 ──────────────────────────────────────────────
    { id: 13, code: 'void rightRotate(Node*& root, Node* y) {' },
    { id: 14, code: '    Node* x = y->left;' },
    { id: 15, code: '    y->left = x->right;' },
    { id: 16, code: '    if (x->right) x->right->parent = y;' },
    { id: 17, code: '    x->parent = y->parent;' },
    { id: 18, code: '    if (!y->parent) root = x;' },
    { id: 19, code: '    else if (y == y->parent->left) y->parent->left = x;' },
    { id: 20, code: '    else y->parent->right = x;' },
    { id: 21, code: '    x->right = y;  y->parent = x;' },
    { id: 22, code: '}  // end rightRotate' },
    // ── 挿入後修正 ──────────────────────────────────────────
    { id: 23, code: 'void fixup(Node*& root, Node* z) {' },
    { id: 24, code: '    while (z->parent && z->parent->color == RED) {' },
    { id: 25, code: '        Node* gp = z->parent->parent;' },
    { id: 26, code: '        if (z->parent == gp->left) {' },
    { id: 27, code: '            Node* u = gp->right;  // 叔父（right side）' },
    { id: 28, code: '            if (u && u->color == RED) {  // Case1: 叔父が赤（left）' },
    { id: 29, code: '                z->parent->color = BLACK;  u->color = BLACK;  gp->color = RED;  z = gp;  // left' },
    { id: 30, code: '            } else {  // Case2/3: 叔父が黒（left）' },
    { id: 31, code: '                if (z == z->parent->right) { z = z->parent;  leftRotate(root, z); }' },
    { id: 32, code: '                z->parent->color = BLACK;  gp->color = RED;  rightRotate(root, gp);' },
    { id: 33, code: '            }' },
    { id: 34, code: '        } else {' },
    { id: 35, code: '            Node* u = gp->left;   // 叔父（left side）' },
    { id: 36, code: '            if (u && u->color == RED) {  // Case1: 叔父が赤（right）' },
    { id: 37, code: '                z->parent->color = BLACK;  u->color = BLACK;  gp->color = RED;  z = gp;  // right' },
    { id: 38, code: '            } else {  // Case2/3: 叔父が黒（right）' },
    { id: 39, code: '                if (z == z->parent->left) { z = z->parent;  rightRotate(root, z); }' },
    { id: 40, code: '                z->parent->color = BLACK;  gp->color = RED;  leftRotate(root, gp);' },
    { id: 41, code: '            }' },
    { id: 42, code: '        }' },
    { id: 43, code: '    }' },
    { id: 44, code: '    root->color = BLACK;' },
    { id: 45, code: '}  // end fixup' },
  ],
  // データ構造（id:0〜2）→ leftRotate（id:3〜12）と rightRotate（id:13〜22）は並列で可
  // fixup（id:23〜45）は両回転関数の後
  // fixup 内は線形順序（if/else の対称構造が鍵）
  atomicGroups: [
    [3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    [13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    [23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
  ],
  partialOrder: [
    [0, 1], [1, 2],
    [2, 3], [2, 13],           // 両回転はどちらが先でも可
    [3,  4], [4,  5], [5,  6], [6,  7], [7,  8], [8,  9], [9, 10], [10, 11], [11, 12],
    [13, 14], [14, 15], [15, 16], [16, 17], [17, 18], [18, 19], [19, 20], [20, 21], [21, 22],
    [12, 23], [22, 23],        // fixup は両回転の後
    [23, 24], [24, 25], [25, 26], [26, 27], [27, 28], [28, 29], [29, 30], [30, 31], [31, 32],
    [32, 33], [33, 34], [34, 35], [35, 36], [36, 37], [37, 38], [38, 39], [39, 40], [40, 41],
    [41, 42], [42, 43], [43, 44], [44, 45],
  ],
  hints: [
    'whileループの継続条件: z->parent が存在し、かつ親が赤（赤連続が続く間回し続ける）',
    'Case 1（叔父が赤）: 親と叔父を黒に、祖父を赤に再彩色して z = gp に上げる。左右対称で全く同じ操作',
    'Case 2（叔父が黒・内側）: z が内側の子なら親まで z を上げて反対方向に回転 → Case 3 に帰着する',
    'Case 3（叔父が黒・外側）: 親を黒・祖父を赤に彩色してから祖父を回転。最後に root->color = BLACK で根を黒に',
  ],
  explanation: {
    summary: '赤黒木の fixup は「赤連続（親子ともに赤）」が生じた場合に色変え＋回転で修復します。親が祖父の左子・右子かで対称な 2 分岐があり、各分岐に叔父の色で決まる 3 ケースが存在します。',
    points: [
      'Case 1（叔父赤）: 再彩色のみで赤連続を上へ伝播。z を祖父に引き上げてループ継続',
      'Case 2（叔父黒・内側）: まず親を起点に逆方向回転して Case 3 の形に変換する',
      'Case 3（叔父黒・外側）: 親黒・祖父赤に彩色後、祖父を外側方向に回転。ループは終了する',
      '左右対称: 親が gp->left か gp->right かで分岐するが、操作は左右を入れ替えた鏡像になる',
      '終端処理: ループ後に root->color = BLACK を必ず実行（Case 1 で根が赤になる場合がある）',
    ],
    complexity: { time: 'O(log N) per insert（回転は O(1)、while ループは高さ分）', space: 'O(N)' },
    tip: 'std::set / std::map は内部で赤黒木（GCC の実装）を使っています。面接や競プロ上級では実装よりも「なぜ O(log N) が保証されるか」の理解が重要です。AVL木より挿入が速い（回転回数が少ない）のが赤黒木の実用上の強みです。',
  },
});
