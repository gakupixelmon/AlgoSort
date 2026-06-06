// graph_006: Union-Find (素集合データ構造) ★3 (C++)
// 競プロの典型データ構造。連結性クエリを O(α(N)) で処理
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'graph_006',
  title: 'Union-Find（素集合データ構造）',
  category: 'graph',
  categoryLabel: 'グラフ理論',
  difficulty: 3,
  language: 'cpp',
  description: '【Union-Find とは】たくさんの要素をいくつかのグループに分けて管理し、「2つの要素が同じグループか？」「2つのグループを合併する」の2操作を超高速で処理するデータ構造です。グラフの連結性判定やクラスタリングに頻出します。\n\nUnion-Find を実装せよ。各ノードの親を管理する配列 parent を使い、経路圧縮（Path Compression）とランク付きマージ（Union by Rank）を適用して効率化する。find(x) は x の根を返し、unite(x, y) は x と y が属する集合を合併する。',
  inputFormat: {
    params: [
      { name: 'N', type: 'int', desc: '要素数（ノード番号 0 〜 N-1）' },
    ],
    note: 'find(x): int（x の根ノード番号）\nunite(x, y): void（x と y が属する集合を合併）\nisSame(x, y): bool（x と y が同じ集合か）\n制約: 1 ≤ N ≤ 10^5',
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
    { id: 16, code: '    bool isSame(int x, int y) { return find(x) == find(y); }' },
    { id: 17, code: '};' },
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8],
    [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15],
    [15, 16], [16, 17],
  ],
  hints: [
    'コンストラクタで parent[i] = i（自分が根）、rank[i] = 0 に初期化。iota を使うと簡潔に書ける',
    'find(x): parent[x] != x なら再帰的に根を探す。見つかったら parent[x] に直接根を格納する（経路圧縮）',
    'unite(x, y): まず両方の根を求め、rank が高い方を親にする（Union by Rank）。rank が同じなら一方を +1 する',
  ],
  explanation: {
    summary: 'Union-Find は経路圧縮（Path Compression）とランク付きマージ（Union by Rank）の2つの最適化により、N 個の要素に対する任意の M 回の操作が O(M α(N)) で処理できます（α は逆アッカーマン関数でほぼ定数）。',
    points: [
      '経路圧縮: find の際に根への直接リンクを貼ることで、次回の find を O(1) に近づける',
      'Union by Rank: 木の高さが低い方を高い方の子にすることで、木が深くなりすぎないようにする',
      'iota(parent.begin(), parent.end(), 0) は parent[i] = i を一括設定する標準関数',
      'isSame(x, y) は find(x) == find(y) だけ。一行で書けるほどシンプル',
    ],
    complexity: { time: 'O(α(N)) per operation', space: 'O(N)' },
    tip: '競技では「グラフに辺を追加しながら連結成分数を管理する」「クラスカル法で最小全域木を求める」など多くの場面で Union-Find が登場します。テンプレートとして暗記しておくと便利です。',
  },
});
