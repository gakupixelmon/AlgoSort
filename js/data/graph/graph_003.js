// graph_003: 深さ優先探索 DFS (C++)
// id:6,7,8 はすべて } → trimStart() 後に同一テキスト → 相互の順序制約なし
// 全て dfs() 再帰呼び出し（id:5）の後に来ればよい
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'graph_003',
  title: '深さ優先探索（DFS）',
  category: 'graph',
  categoryLabel: 'グラフ理論',
  difficulty: 2,
  language: 'cpp',
  description: '【深さ優先探索（DFS）とは】迷路を探索するとき「一本道を行けるところまで進み、行き止まりになったら1つ前の分岐に戻る」という方法です。再帰（または自前のスタック）を使って実装します。BFS と対比して「できるだけ深く潜ってから戻る」探索で、連結成分の確認やサイクル検出などに使われます。\n\nグラフの深さ優先探索（DFS）を再帰を使って実装せよ。始点 start から到達可能な全ノードを深く潜りながら探索する。visited 配列でサイクルを防ぐこと。',
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0, code: 'void dfs(vector<vector<int>>& graph, int node,' },
    { id: 1, code: '         vector<bool>& visited) {' },
    { id: 2, code: '    visited[node] = true;' },
    { id: 3, code: '    for (int next : graph[node]) {' },
    { id: 4, code: '        if (!visited[next]) {' },
    { id: 5, code: '            dfs(graph, next, visited);' },
    { id: 6, code: '        }' },
    { id: 7, code: '    }' },
    { id: 8, code: '}' },
  ],
  // id:6,7,8 はすべて } → 相互の順序制約なし。全て dfs() 呼び出し（id:5）の後に来ればよい
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
    // 全 } (id:6,7,8) は dfs() 再帰呼び出し（id:5）の後
    [5, 6], [5, 7], [5, 8],
  ],
  hints: [
    'まず現在のノードを visited[node] = true にマークする',
    '隣接ノードをループし、未訪問なら再帰的に dfs() を呼び出す',
    '再帰の引数には graph（参照）、次のノード番号、visited（参照）を渡す',
  ],
  explanation: {
    summary: 'DFS（深さ優先探索）は再帰（またはスタック）を使い、できる限り深く潜ってから戻る探索アルゴリズムです。',
    points: [
      '現在のノードを訪問済みにしてから隣接ノードを再帰探索する',
      'visited 配列がないと同じノードを無限に再帰し、スタックオーバーフローになる',
      'BFS と異なりキューは使わず、関数呼び出しスタックで深さを管理する',
      'graph と visited を参照渡しすることで、再帰全体で同じデータを共有できる',
    ],
    complexity: { time: 'O(V + E)', space: 'O(V)（再帰スタック）' },
    tip: '連結成分の数え上げ、トポロジカルソート、サイクル検出など DFS の応用は非常に広範です。',
  },
});
