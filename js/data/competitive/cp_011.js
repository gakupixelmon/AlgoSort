// cp_011: B木（B-Tree）の探索 ★4 (C++)
// 競プロ典型：最小次数 T の B木でキーを O(T × log_T N) に探索する
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_011',
  title: 'B木（B-Tree）の探索',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 4,
  language: 'cpp',
  description: '【B木とは】各ノードが複数のキーと子ポインタを持つ平衡多分木です。最小次数 T（T ≥ 2）のとき、根以外の各ノードは T-1 以上 2T-1 以下のキーを昇順に保持します。高さが O(log_T N) に抑えられ、ディスク I/O 削減のためにデータベースやファイルシステムで広く使われます。\n\nT = 2（いわゆる 2-3-4木）の B木において、キー探索を実装せよ。補助関数 findIdx でノード内のキー位置を特定し、再帰的に子ノードをたどって search を完成させること。',
  inputFormat: {
    params: [
      { name: 'x', type: 'BNode*', desc: '探索するノード（根から呼び出す）' },
      { name: 'k', type: 'int',    desc: '探索するキー' },
    ],
    note: '・findIdx(x, k): ノード x 内で keys[i] < k の間 i を進め、k 以上の最小インデックスを返す\n・search(x, k): キー k が木に存在すれば true、なければ false\n制約: ノード数 N ≤ 10^6、1 ≤ k ≤ 10^9',
    examples: [
      {
        input: 'T=2 の B木に [10,20,30] を挿入後、search(root, 20)',
        output: 'true',
        explanation: 'キー 20 はルートノードの keys[] に存在するため true が返ります。'
      },
      {
        input: 'T=2 の B木に [10,20,30] を挿入後、search(root, 15)',
        output: 'false',
        explanation: 'キー 15 は挿入されていないため、葉に達した時点で false が返ります。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'const int T = 2;' },
    { id: 1,  code: 'struct BNode {' },
    { id: 2,  code: '    int  n;' },
    { id: 3,  code: '    int  keys[2*T-1];' },
    { id: 4,  code: '    bool leaf;' },
    { id: 5,  code: '    BNode* ch[2*T];' },
    { id: 6,  code: '    BNode(bool lf) : n(0), leaf(lf) {' },
    { id: 7,  code: '        fill(ch, ch + 2*T, nullptr);' },
    { id: 8,  code: '    }' },
    { id: 9,  code: '};' },
    { id: 10, code: 'int findIdx(BNode* x, int k) {' },
    { id: 11, code: '    int i = 0;' },
    { id: 12, code: '    while (i < x->n && x->keys[i] < k) ++i;' },
    { id: 13, code: '    return i;' },
    { id: 14, code: '}' },
    { id: 15, code: 'bool search(BNode* x, int k) {' },
    { id: 16, code: '    int i = findIdx(x, k);' },
    { id: 17, code: '    if (i < x->n && x->keys[i] == k) return true;' },
    { id: 18, code: '    if (x->leaf) return false;' },
    { id: 19, code: '    return search(x->ch[i], k);' },
    { id: 20, code: '}' },
  ],
  // T 定数（id:0）は BNode 構造体（id:1〜9）より前
  // BNode のメンバ（id:2〜5）はどの順でも可
  // コンストラクタ（id:6〜8）はメンバ 4 つの後
  // findIdx（id:10〜14）は BNode 宣言の後
  // search（id:15〜20）は findIdx の後（findIdx を内部で使用）
  partialOrder: [
    [0, 1],
    [1, 2], [1, 3], [1, 4], [1, 5],
    [2, 6], [3, 6], [4, 6], [5, 6],
    [6, 7], [7, 8], [8, 9],
    [9, 10],
    [10, 11], [11, 12], [12, 13], [13, 14],
    [14, 15],
    [15, 16], [16, 17], [17, 18], [18, 19], [19, 20],
  ],
  hints: [
    'findIdx: keys[i] < k の間だけ ++i する。返り値 i は「k 以上の最小インデックス」で、i == n なら全キーより k が大きい',
    'search の終了条件は 2 つ: ①keys[i] == k（発見）、②x->leaf == true（葉まで来たが未発見）',
    '子選択: findIdx で求めた i がそのまま子ポインタ ch[i] のインデックスになる（BST の左右選択の多分木版）',
  ],
  explanation: {
    summary: 'B木の探索は「ノード内での線形スキャン → 適切な子へ再帰」を高さ分繰り返します。ノード内の比較回数が O(T) で高さが O(log_T N) なので全体 O(T × log_T N) です。',
    points: [
      'findIdx の返り値 i: keys[i-1] < k ≤ keys[i] の範囲を指す（i == n は末尾の子を意味する）',
      'leaf フラグ: 葉ノードには子ポインタがない。再帰を止めるための終了条件として必須',
      'ch[i] の意味: 「keys[i-1] と keys[i] の間の値が属する部分木」なので findIdx の結果と一致する',
      '二分探索化: findIdx を二分探索にすれば O(log T) にできるが、T が小さい場合は線形探索で十分',
    ],
    complexity: { time: 'O(T × log_T N)', space: 'O(T × N)' },
    tip: 'B木はデータベース（MySQL InnoDB など）のインデックス構造の基盤です。T を大きくとると木の高さが下がりディスクアクセス回数が減ります。競プロでは直接出ることは少ないですが、分割統治やセグメント木の「多分木化」の発想と直結します。',
  },
});
