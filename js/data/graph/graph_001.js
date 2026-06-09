// graph_001: 幅優先探索 BFS (C++)
// id:12,13,14,15 はすべて } → trimStart() 後に同一テキスト → 相互の順序制約なし
// 初期化ブロック（id:1-4）には依存関係あり：
//   id:1(visited宣言)→id:4(visited[start]=true)、id:2(queue宣言)→id:3(q.push)
//   id:3 と id:4 は相互に任意順
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'graph_001',
  title: '幅優先探索（BFS）',
  category: 'graph',
  categoryLabel: 'グラフ理論',
  difficulty: 2,
  language: 'cpp',
  description: '【幅優先探索（BFS）とは】迷路の出口を探すとき、「入口から距離1のマスを全部調べてから、距離2のマスを調べる…」という層ごとに広がっていく探索方法です。キュー（待ち行列）を使い、近いところから順番に確認していきます。「最短で何ステップか」を知りたい問題に特に向いています。\n\nグラフの幅優先探索（BFS）を実装せよ。キュー（queue）を使い、始点 start から到達可能な全ノードを層ごとに探索する。各ノードの訪問済みフラグを管理して無限ループを防ぐこと。',
  inputFormat: {
    params: [
      { name: 'graph', type: 'vector<vector<int>>&', desc: '隣接リスト表現のグラフ（graph[v] = v の隣接ノードリスト）' },
      { name: 'start', type: 'int', desc: 'BFS を開始するノード番号' },
    ],
    note: '戻り値: void（処理は内部で完結）\n制約: 1 ≤ V ≤ 10^5、0 ≤ E ≤ 10^5',
    examples: [
      {
        input: 'graph = [[1, 2], [0, 3], [0], [1]]\nstart = 0',
        output: '（コンソール出力などを想定）: 0 -> 1 -> 2 -> 3 の順で探索される',
        explanation: '0から始まり、距離1のノード1, 2が探索され、次にノード1の隣接ノード3が探索されます。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'void bfs(vector<vector<int>>& graph, int start) {' },
    { id: 1,  code: '    vector<bool> visited(graph.size(), false);' },
    { id: 2,  code: '    queue<int> q;' },
    { id: 3,  code: '    q.push(start);' },
    { id: 4,  code: '    visited[start] = true;' },
    { id: 5,  code: '    while (!q.empty()) {' },
    { id: 6,  code: '        int node = q.front();' },
    { id: 7,  code: '        q.pop();' },
    { id: 8,  code: '        for (int next : graph[node]) {' },
    { id: 9,  code: '            if (!visited[next]) {' },
    { id: 10, code: '                visited[next] = true;' },
    { id: 11, code: '                q.push(next);' },
    { id: 12, code: '            }' },
    { id: 13, code: '        }' },
    { id: 14, code: '    }' },
    { id: 15, code: '}' },
  ],
  // id:12,13,14,15 はすべて } → 相互の順序制約なし。全て if 本体（id:10, id:11）の後に来ればよい
  // id:1(visited宣言)→id:4(visited[start]=true)、id:2(queue宣言)→id:3(q.push)
  // id:10(visited[next]=true) と id:11(q.push(next)) は任意順
  partialOrder: [
    [0, 1], [0, 2], [0, 3], [0, 4],
    [1, 4],                          // visited 宣言 → visited[start]=true
    [2, 3],                          // queue 宣言 → q.push(start)
    [1, 5], [2, 5], [3, 5], [4, 5], // 初期化完了後に while
    [5, 6], [6, 7], [7, 8], [8, 9],
    [9, 10], [9, 11],                // if → （visited=true と q.push は任意順）
    // 全 } (id:12-15) は if 本体（id:10, id:11）の後に来ればよい → 相互順序自由
    [10, 12], [10, 13], [10, 14], [10, 15],
    [11, 12], [11, 13], [11, 14], [11, 15],
  ],
  hints: [
    'visited 配列と queue を用意し、始点を queue に積んで visited = true にする',
    'while (!q.empty()) ループで queue が空になるまで繰り返す。front() で取り出し pop() する',
    '隣接ノードを順番に確認し、未訪問なら visited = true にして queue に追加する',
  ],
  explanation: {
    summary: 'BFS（幅優先探索）はキューを使い、始点から近いノードを層ごとに順番に探索するアルゴリズムです。最短経路の発見に適しています。',
    points: [
      'キュー（FIFO）を使うことで「浅い（近い）ノードから順に」探索できる',
      'visited 配列で訪問済みを管理しないと、サイクルが存在する場合に無限ループになる',
      'BFS は無重みグラフにおける最短距離を求めるのに最適',
      'front() でキューの先頭を参照し、pop() で取り出す（C++ の queue は front+pop の2段階）',
    ],
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    tip: 'V はノード数、E はエッジ数。グリッドの最短経路問題でも BFS は頻出です（AtCoder などで多数出題）。',
  },
});
