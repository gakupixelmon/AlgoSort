// graph_015: 強連結成分分解（反復 Kosaraju 法） ★4
// 1回目のDFSで帰りがけ順を作り、逆グラフをその順に探索して成分を分ける
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'graph_015',
  title: '強連結成分分解（SCC）',
  category: 'graph',
  categoryLabel: 'グラフ理論',
  difficulty: 4,
  language: 'cpp',
  description: '【問題】\n$N$ 頂点 $M$ 辺の有向グラフが与えられます。頂点 $u$ と頂点 $v$ が同じ強連結成分に属するとは、$u$ から $v$ へ到達でき、かつ $v$ から $u$ へも到達できることとします。\n\n各頂点がどの強連結成分に属するかを表す配列を返してください。同じ成分の頂点には同じ番号を付け、異なる成分には異なる番号を付ければよく、成分番号の付け方は自由です。\n\n【方針】\nKosaraju 法では、元のグラフで帰りがけ順を記録する DFS と、辺を逆向きにしたグラフでその逆順に行う DFS の2段階で分解します。再帰を使わず、明示的なスタックで DFS を実装します。',
  inputFormat: {
    params: [
      { name: 'n', type: 'int', desc: '頂点数（0-indexed）' },
      { name: 'edges', type: 'const vector<pair<int, int>>&', desc: '有向辺 (from, to) のリスト' },
    ],
    note: '戻り値: vector<int>（各頂点の SCC 番号）\n制約: 1 ≤ n ≤ 2×10^5、0 ≤ M ≤ 2×10^5、0 ≤ from,to < n',
    examples: [
      {
        input: 'n = 5, edges = {{0,1}, {1,0}, {1,2}, {2,3}, {3,2}, {3,4}}',
        output: '[0, 0, 1, 1, 2]',
        explanation: '0 と1は相互に行き来でき、2と3も相互に行き来できます。4はどこからも戻れないため別成分です。成分番号は別の付け方でも正解です。',
      },
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0, code: 'vector<int> stronglyConnectedComponents(int n, const vector<pair<int, int>>& edges) {' },
    { id: 1, code: '    vector<vector<int>> graph(n), reverseGraph(n);' },
    { id: 2, code: '    for (auto [from, to] : edges) { graph[from].push_back(to); reverseGraph[to].push_back(from); }' },
    { id: 3, code: '    vector<char> visited(n, false); vector<int> order;' },
    { id: 4, code: '    for (int start = 0; start < n; start++) {' },
    { id: 5, code: '        if (visited[start]) continue;' },
    { id: 6, code: '        vector<pair<int, int>> stack = {{start, 0}}; visited[start] = true;' },
    { id: 7, code: '        while (!stack.empty()) { int v = stack.back().first; int& next = stack.back().second; if (next < (int)graph[v].size()) { int to = graph[v][next++]; if (!visited[to]) { visited[to] = true; stack.push_back({to, 0}); } } else { order.push_back(v); stack.pop_back(); } }' },
    { id: 8, code: '    }' },
    { id: 9, code: '    vector<int> component(n, -1); int componentCount = 0;' },
    { id: 10, code: '    for (int i = n - 1; i >= 0; i--) {' },
    { id: 11, code: '        int start = order[i];' },
    { id: 12, code: '        if (component[start] != -1) continue;' },
    { id: 13, code: '        vector<int> stack = {start}; component[start] = componentCount;' },
    { id: 14, code: '        while (!stack.empty()) { int v = stack.back(); stack.pop_back(); for (int to : reverseGraph[v]) if (component[to] == -1) { component[to] = componentCount; stack.push_back(to); } }' },
    { id: 15, code: '        componentCount++;' },
    { id: 16, code: '    }' },
    { id: 17, code: '    return component;' },
    { id: 18, code: '}' },
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9],
    [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16], [16, 17], [17, 18],
  ],
  hints: [
    'まず元のグラフで DFS を行い、頂点を探索し終えた順に order へ追加します。',
    '再帰 DFS の代わりに、各頂点と次に見る辺の番号を pair としてスタックに積みます。',
    '元のグラフの辺を逆向きにした reverseGraph を作ります。',
    'order の逆順に未所属頂点から reverseGraph を DFS すると、1回の DFS がちょうど1つの強連結成分になります。',
    '各頂点を高々2回の DFS で訪問するため、全体の計算量は O(N+M) です。',
  ],
  explanation: {
    summary: 'Kosaraju 法は、元グラフの帰りがけ順と逆グラフの DFS を組み合わせて強連結成分を取り出します。再帰を使わないため、頂点数が大きく深いグラフでも実行しやすい実装です。',
    points: [
      '元グラフの DFS で得られる帰りがけ順は、成分を縮約した DAG の順序情報を持つ',
      'その順序を逆にして逆グラフを探索すると、異なる強連結成分へ DFS が広がらない',
      '同じ成分内では元グラフと逆グラフの両方向の到達性があるため、1回の探索で全頂点を回収できる',
      '各辺と各頂点を元グラフ・逆グラフで定数回見るため、計算量は O(N+M)、メモリも O(N+M) である',
    ],
    complexity: { time: 'O(N+M)', space: 'O(N+M)' },
    tip: '「相互に到達できる頂点をまとめる」「有向グラフを DAG に縮約する」といった条件を見たら、強連結成分分解を考えてみましょう。',
  },
});
