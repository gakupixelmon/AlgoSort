// cp_002: Union-Find（素集合データ構造）★4 (C++)
// 競プロ典型：グループ結合・同一グループ判定を O(α(N)) で行う
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_002',
  title: 'Union-Find（素集合データ構造）',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 4,
  language: 'cpp',
  description: '【問題】\nN 個の要素（0-indexed）に対して以下の操作を Q 回処理せよ。\n・unite(x, y): 要素 x と y を同じグループに統合する\n・same(x, y): 要素 x と y が同じグループかどうかを返す\n\n【制約】\n・N, Q ≤ 10^5\n・操作はほぼ O(1)（正確にはアッカーマン関数の逆関数 α(N)）で処理する必要がある\n\n【ポイント】\n「経路圧縮」と「ランクによる union」の2つの最適化を組み合わせたデータ構造を Union-Find（Disjoint Set Union, DSU とも呼ぶ）という。競プロでの連結判定・グループ管理の最重要テクニックの一つ。',
  inputFormat: {
    params: [
      { name: 'n', type: 'int', desc: '要素数' },
    ],
    note: 'コンストラクタで初期化し、unite(x, y) と same(x, y) メソッドを実装する\n制約: 1 ≤ N ≤ 10^5',
    examples: [
      {
        input: 'n = 5\nunite(0, 1)\nunite(2, 3)\nsame(0, 1) → true\nsame(0, 2) → false',
        output: 'true / false',
        explanation: '0と1は統合済み（同じグループ）。0と2は別グループのままです。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'struct UnionFind {' },
    { id: 1,  code: '    vector<int> parent, rank;' },
    { id: 2,  code: '    UnionFind(int n) : parent(n), rank(n, 0) {' },
    { id: 3,  code: '        iota(parent.begin(), parent.end(), 0);' },
    { id: 4,  code: '    }' },
    { id: 5,  code: '    int find(int x) {' },
    { id: 6,  code: '        if (parent[x] != x) parent[x] = find(parent[x]);' },
    { id: 7,  code: '        return parent[x];' },
    { id: 8,  code: '    }' },
    { id: 9,  code: '    void unite(int x, int y) {' },
    { id: 10, code: '        x = find(x); y = find(y);' },
    { id: 11, code: '        if (x == y) return;' },
    { id: 12, code: '        if (rank[x] < rank[y]) swap(x, y);' },
    { id: 13, code: '        parent[y] = x;' },
    { id: 14, code: '        if (rank[x] == rank[y]) rank[x]++;' },
    { id: 15, code: '    }' },
    { id: 16, code: '    bool same(int x, int y) { return find(x) == find(y); }' },
    { id: 17, code: '};' },
  ],
  partialOrder: [
    [0, 1], [1, 2],       // struct宣言 → メンバ変数 → コンストラクタ
    [2, 3], [3, 4],       // コンストラクタ本体 → 閉じ
    [4, 5],               // find関数
    [5, 6], [6, 7], [7, 8], // find本体 → 閉じ
    [8, 9],               // unite関数
    [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], // unite本体
    [15, 16], [16, 17],   // same → 閉じ
  ],
  hints: [
    'find(x) は「経路圧縮」で根を返す。parent[x] != x なら再帰で根を探し、見つけたら parent[x] に直接代入する',
    'unite(x, y) では先に find で根を求め、rank（木の高さの上限）が小さい方を大きい方の子にする（ランク管理）',
    'same(x, y) は find(x) == find(y) の1行で実現できる',
  ],
  explanation: {
    summary: 'Union-Find は「経路圧縮」と「ランクによる Union」の2つの最適化により、N 要素に対してほぼ O(1) でグループ管理を実現する競プロの必須データ構造です。',
    points: [
      '経路圧縮: find の再帰中に parent[x] = find(parent[x]) と代入することで、次回以降の探索を O(1) に近づける',
      'ランクによる Union: 高さが小さい木を大きい木の下につける。木が偏って深くなることを防ぐ',
      'iota(parent.begin(), parent.end(), 0) で parent[i] = i の初期化（各要素が自分の親）を一括処理',
      'same(x, y) = find(x) == find(y)。根が同じならば同じグループ',
    ],
    complexity: { time: 'O(α(N)) per operation（実用的にはほぼ O(1)）', space: 'O(N)' },
    tip: 'AtCoder では「グループ統合・連結判定」問題で Union-Find が最有力候補。グラフのクラスカル法（最小全域木）でも内部で使われる重要なデータ構造です。',
  },
});
