// cp_007: 二分探索木（BST）の挿入と探索 ★3 (C++)
// 競プロ典型：BST の基本操作（挿入・探索・中順巡回）を実装する
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_007',
  title: '二分探索木（BST）の挿入と探索',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 3,
  language: 'cpp',
  description: '【二分探索木とは】各ノードについて「左部分木のすべてのキー < 自身のキー < 右部分木のすべてのキー」を満たす二分木です。この性質により、探索・挿入・削除が平均 O(log N) で行えます（最悪 O(N)）。中順巡回（左→根→右）すると昇順に要素が得られるのが大きな特徴です。\n\n整数を管理する BST を実装せよ。insert(key) でノードを挿入し、search(key) でキーが存在するか判定する。また inorder(node) で中順巡回を行い、キーを昇順に出力する。',
  inputFormat: {
    params: [
      { name: 'key', type: 'int', desc: '挿入または探索するキー' },
    ],
    note: '・insert: key を BST に挿入（重複は無視）\n・search: key が存在すれば true、なければ false\n・inorder: 中順巡回で昇順にキーを出力\n制約: 1 ≤ key ≤ 10^9、操作数 ≤ 10^5',
    examples: [
      {
        input: 'insert(5), insert(3), insert(7), insert(1), search(3)',
        output: 'true',
        explanation: '3 は挿入済みなので true が返ります。'
      },
      {
        input: 'insert(5), insert(3), insert(7), inorder(root)',
        output: '3 5 7',
        explanation: '中順巡回（左→根→右）で昇順に出力されます。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'struct Node {' },
    { id: 1,  code: '    int key;' },
    { id: 2,  code: '    Node *left, *right;' },
    { id: 3,  code: '    Node(int k) : key(k), left(nullptr), right(nullptr) {}' },
    { id: 4,  code: '};' },
    { id: 5,  code: 'Node* insert(Node* root, int key) {' },
    { id: 6,  code: '    if (!root) return new Node(key);' },
    { id: 7,  code: '    if (key < root->key)  root->left  = insert(root->left,  key);' },
    { id: 8,  code: '    else if (key > root->key) root->right = insert(root->right, key);' },
    { id: 9,  code: '    return root;' },
    { id: 10, code: '}' },
    { id: 11, code: 'bool search(Node* root, int key) {' },
    { id: 12, code: '    if (!root) return false;' },
    { id: 13, code: '    if (key == root->key) return true;' },
    { id: 14, code: '    if (key < root->key)  return search(root->left,  key);' },
    { id: 15, code: '    return search(root->right, key);' },
    { id: 16, code: '}' },
    { id: 17, code: 'void inorder(Node* root) {' },
    { id: 18, code: '    if (!root) return;' },
    { id: 19, code: '    inorder(root->left);' },
    { id: 20, code: '    cout << root->key << " ";' },
    { id: 21, code: '    inorder(root->right);' },
    { id: 22, code: '}' },
  ],
  // Node 構造体（id:0〜4）が先
  // insert（id:5〜10）・search（id:11〜16）・inorder（id:17〜22）は並列でどの順でも可
  partialOrder: [
    [0, 1], [0, 2], [0, 3],
    [1, 4], [2, 4], [3, 4],
    [4, 5], [4, 11], [4, 17],
    [5, 6], [6, 7], [7, 8], [8, 9], [9, 10],
    [11, 12], [12, 13], [13, 14], [14, 15], [15, 16],
    [17, 18], [18, 19], [19, 20], [20, 21], [21, 22],
  ],
  hints: [
    'insert: root が nullptr なら新ノードを作成して返す。key < root->key なら左へ、key > root->key なら右へ再帰。重複は何もしない（そのまま return root）',
    'search: root が nullptr なら false。key == root->key なら true。それ以外は key の大小で左右の部分木を再帰的に探索',
    'inorder: 左部分木→根→右部分木の順で再帰的に巡回。BST の性質より自動的に昇順になる',
  ],
  explanation: {
    summary: '二分探索木は「左 < 根 < 右」の性質を保つ二分木です。挿入・探索ともに根から始めてキーの大小で左右を選択する単純な再帰で実現できます。',
    points: [
      'insert: 再帰の基底は root == nullptr（新ノード生成）。BST の性質を保つため、左右どちらに挿入するかをキーの大小で決定する',
      'search: 二分探索と同じ発想。毎回半分のノードを除外できるため平均 O(log N)',
      'inorder（中順巡回）: 「左→根→右」の順に訪問すると昇順。BST の最重要性質の一つ',
      '最悪ケース: 昇順（または降順）に挿入すると木が偏り O(N)。これを防ぐために AVL木・赤黒木などの平衡BST が使われる',
    ],
    complexity: { time: '平均 O(log N)・最悪 O(N) per insert/search', space: 'O(N)' },
    tip: '競プロでは std::set / std::map が赤黒木ベースの BST です。手実装は面接・教育目的が主ですが、BST の性質を理解することが平衡BST・セグメント木・BIT の基礎になります。',
  },
});
