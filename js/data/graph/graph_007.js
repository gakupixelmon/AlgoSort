// graph_007: トポロジカルソート（Kahn's Algorithm）★4 (C++)
// DAG の頂点を依存関係の順に並べる。競プロ・ビルドシステム等で頻出
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'graph_007',
  title: 'トポロジカルソート（Kahn\'s Algorithm）',
  category: 'graph',
  categoryLabel: 'グラフ理論',
  difficulty: 4,
  language: 'cpp',
  description: '【トポロジカルソートとは】有向非循環グラフ（DAG）の頂点を「辺の向きに沿って先に来る順番」で並べる操作です。例えば「授業Aは授業Bの前に履修しなければならない」という依存関係をグラフで表したとき、履修順を求めるのがトポロジカルソートです。\n\nKahn\'s Algorithm は「入次数が 0 の頂点から順にキューに入れ、取り出すたびに隣接頂点の入次数を減らす」という BFS 的な手法です。\n\nDAG の隣接リスト graph と頂点数 V を受け取り、トポロジカル順序のリストを返せ。循環があって全頂点を並べられない場合は空 vector を返す。',
  inputFormat: {
    params: [
      { name: 'V', type: 'int', desc: '頂点数' },
      { name: 'graph', type: 'vector<vector<int>>&', desc: '有向グラフの隣接リスト（graph[u] = u から出る辺の先のリスト）' },
    ],
    note: '戻り値: vector<int>（トポロジカル順序。循環がある場合は空 vector）\n制約: 1 ≤ V ≤ 10^5、0 ≤ E ≤ 10^5',
    examples: [
      {
        input: 'V = 4\ngraph = [[1, 2], [3], [3], []]',
        output: '[0, 1, 2, 3] または [0, 2, 1, 3]',
        explanation: '0番ノードが1と2に依存される。1と2は両方3に依存される。入次数0の0から始め、1と2の順は任意、最後に3。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'vector<int> topoSort(int V, vector<vector<int>>& graph) {' },
    { id: 1,  code: '    vector<int> indegree(V, 0);' },
    { id: 2,  code: '    for (int u = 0; u < V; u++)' },
    { id: 3,  code: '        for (int v : graph[u]) indegree[v]++;' },
    { id: 4,  code: '    queue<int> q;' },
    { id: 5,  code: '    for (int u = 0; u < V; u++)' },
    { id: 6,  code: '        if (indegree[u] == 0) q.push(u);' },
    { id: 7,  code: '    vector<int> order;' },
    { id: 8,  code: '    while (!q.empty()) {' },
    { id: 9,  code: '        int u = q.front(); q.pop();' },
    { id: 10, code: '        order.push_back(u);' },
    { id: 11, code: '        for (int v : graph[u]) {' },
    { id: 12, code: '            if (--indegree[v] == 0) q.push(v);' },
    { id: 13, code: '        }' },
    { id: 14, code: '    }' },
    { id: 15, code: '    return order.size() == V ? order : vector<int>{};' },
    { id: 16, code: '}' },
  ],
  // id:1（indegree宣言）→ id:2-3（indegree計算ループ）の依存
  // id:4（queue宣言）→ id:5-6（入次数0の頂点をenqueue）は indegree 計算後（id:3の後）
  // id:7（order宣言）はどのタイミングでも可だが while より前
  // id:13, id:14, id:16 は全て } で同一テキスト、id:12の後
  partialOrder: [
    [0, 1],
    [1, 2], [2, 3],           // indegree 計算
    [3, 4],                   // queue は indegree 計算完了後に宣言
    [4, 5], [5, 6],           // 入次数0の頂点を queue に追加
    [3, 7],                   // order は indegree 計算後であればいつでも可
    [6, 8], [7, 8],           // while は queue と order 両方の後
    [8, 9], [9, 10], [10, 11], [11, 12],
    [12, 13], [12, 14], [12, 16],  // } は最後の処理（id:12）の後（相互順序自由）
    [13, 14], [14, 15], [15, 16],  // } } return } の順
  ],
  hints: [
    '各頂点の入次数（indegree）を計算する。辺 u→v があれば indegree[v]++ する',
    '入次数が 0 の頂点を全て queue に入れる。while(!q.empty()) でキューから取り出し order に追加、隣接頂点の indegree を -1 して 0 になったら queue に追加',
    'ループ後 order.size() == V なら全頂点を処理できた（DAG）。そうでなければ循環あり → 空 vector を返す',
  ],
  explanation: {
    summary: 'Kahn\'s Algorithm はトポロジカルソートを BFS で実現します。「入次数 0 = 他の何にも依存しない」頂点から順に処理し、処理するたびに依存関係を解消します。順序が一意でない場合は複数の正解が存在します。',
    points: [
      '入次数（in-degree）= その頂点に入ってくる辺の数。0 なら誰にも依存していない',
      'キューから取り出した頂点 u の隣接頂点 v について --indegree[v] == 0 になったら v をキューに追加',
      'order.size() < V ならサイクルが存在する（全頂点を処理できなかった）',
      'DFS ベースのトポロジカルソートもあるが、Kahn\'s は循環検出も同時にできる利点がある',
    ],
    complexity: { time: 'O(V + E)', space: 'O(V + E)' },
    tip: 'AtCoder では「依存関係のある作業の順番を決めよ」という形でトポロジカルソートが頻出です。順序が辞書順最小などの条件が付く場合は priority_queue を使います。',
  },
});
