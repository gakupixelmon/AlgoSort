// cp_004: トライ木（Trie）の構築と検索 ★4 (C++)
// 競プロ典型：文字列集合を前置共有で管理するデータ構造
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_004',
  title: 'トライ木（Trie）の構築と検索',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 4,
  language: 'cpp',
  description: '【トライ木とは】文字列の集合を効率よく管理するデータ構造です。各ノードが1文字に対応し、根から葉へのパスが1つの単語を表します。共通の接頭辞（プレフィックス）を持つ文字列はノードを共有するため、検索が O(L)（L: 文字列長）で可能です。辞書検索・オートコンプリートで広く使われます。\n\n小文字英字のみからなる文字列の集合を管理する Trie を実装せよ。insert(word) で単語を挿入し、search(word) でその単語が存在するか判定する。',
  inputFormat: {
    params: [
      { name: 'word', type: 'string', desc: '小文字英字のみからなる文字列（insert / search 共通）' },
    ],
    note: '・insert: word を Trie に挿入（戻り値なし）\n・search: word が Trie 内に存在すれば true、なければ false\n制約: 1 ≤ |word| ≤ 20、文字は小文字英字のみ',
    examples: [
      {
        input: 'insert("apple"), insert("app"), search("apple")',
        output: 'true',
        explanation: '"apple" を挿入した後に検索すると true が返ります。'
      },
      {
        input: 'insert("apple"), search("app")',
        output: 'false（insert("app") なし）',
        explanation: '"app" を明示的に insert していない場合、search は false です（startsWith とは異なる）。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'struct TrieNode {' },
    { id: 1,  code: '    TrieNode* children[26];' },
    { id: 2,  code: '    bool isEnd;' },
    { id: 3,  code: '    TrieNode() : isEnd(false) { fill(children, children+26, nullptr); }' },
    { id: 4,  code: '};' },
    { id: 5,  code: 'struct Trie {' },
    { id: 6,  code: '    TrieNode* root;' },
    { id: 7,  code: '    Trie() { root = new TrieNode(); }' },
    { id: 8,  code: '    void insert(string word) {' },
    { id: 9,  code: '        TrieNode* cur = root;' },
    { id: 10, code: '        for (char c : word) {' },
    { id: 11, code: '            int idx = c - \'a\';' },
    { id: 12, code: '            if (!cur->children[idx]) cur->children[idx] = new TrieNode();' },
    { id: 13, code: '            cur = cur->children[idx];' },
    { id: 14, code: '        }' },
    { id: 15, code: '        cur->isEnd = true;' },
    { id: 16, code: '    }' },
    { id: 17, code: '    bool search(string word) {' },
    { id: 18, code: '        TrieNode* cur = root;' },
    { id: 19, code: '        for (char c : word) {' },
    { id: 20, code: '            int idx = c - \'a\';' },
    { id: 21, code: '            if (!cur->children[idx]) return false;' },
    { id: 22, code: '            cur = cur->children[idx];' },
    { id: 23, code: '        }' },
    { id: 24, code: '        return cur->isEnd;' },
    { id: 25, code: '    }' },
    { id: 26, code: '};' },
  ],
  // TrieNode 構造体（id:0〜4）が Trie 構造体（id:5〜26）より前
  // insert メソッド（id:8〜16）と search メソッド（id:17〜25）は並列でもよいが、
  // 各メソッド内部の順序は固定
  partialOrder: [
    [0, 1], [0, 2], [0, 3],   // TrieNode メンバーはどの順でも可
    [1, 4], [2, 4], [3, 4],   // }; はメンバー全て後
    [4, 5],                    // Trie 構造体は TrieNode の後
    [5, 6], [5, 7],            // root と コンストラクタはどちらが先でも可
    [6, 8], [7, 8],            // insert は root・コンストラクタの後
    [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16],
    [16, 17],                  // search は insert の後
    [17, 18], [18, 19], [19, 20], [20, 21], [21, 22], [22, 23], [23, 24], [24, 25],
    [25, 26],
  ],
  hints: [
    '各ノードは children[26]（a〜z）と isEnd フラグを持つ。children[idx] が nullptr なら新しいノードを作る',
    'insert: 根から1文字ずつたどり、存在しない子ノードは new TrieNode() で作成。最後に isEnd = true',
    'search: insert と同様にたどり、途中で nullptr が出たら false。最後に isEnd を返す',
  ],
  explanation: {
    summary: 'トライ木は文字列の前置共有ツリーです。各文字を1ノードで表し、子ノードへのポインタ配列（children[26]）と単語の終端フラグ（isEnd）で構成します。',
    points: [
      'children[26] で a〜z の各文字に対応。idx = c - \'a\' で 0〜25 のインデックスに変換',
      'insert と search は同じ「根からたどる」ロジック。insert は途中のノードを生成し isEnd を立てる',
      'search は途中で nullptr（未登録の文字）が出たら即 false。最後に isEnd を確認して登録済みか判定',
      '計算量: insert・search ともに O(L)（L: 文字列長）。ハッシュマップより定数倍が小さく安定',
    ],
    complexity: { time: 'O(L) per insert/search', space: 'O(N·L)（N: 単語数、L: 最長文字列長）' },
    tip: '競プロでは startsWith（前置詞の有無）を追加したり、各ノードに通過回数を記録して「k 番目の文字列」を求める問題に発展します。',
  },
});
