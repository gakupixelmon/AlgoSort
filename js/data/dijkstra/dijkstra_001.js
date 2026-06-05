// dijkstra_001: ダイクストラ法（優先度付きキュー）(C++)
// id:13,14,15,16 はすべて } → trimStart() 後に同一テキスト → 相互の順序制約なし
// 全て pq.push（id:12）の後に来ればよい
// id:1(n=graph.size()) と id:4(priority_queue宣言) は相互に任意順（独立した宣言）
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dijkstra_001',
  title: 'ダイクストラ法（優先度付きキュー）',
  category: 'dijkstra',
  categoryLabel: 'ダイクストラ法',
  difficulty: 4,
  language: 'cpp',
  description: '【ダイクストラ法とは】地図上の最短経路を求めるアルゴリズムです。カーナビの経路探索でも使われています。「まだ確定していない頂点のうち、スタートから最も近い頂点を選んで確定する」という操作を繰り返すことで、全ての頂点への最短距離を求めます。優先度付きキュー（ヒープ）を使うと高速に動作します。ただし、負のコストを持つ辺には使えません。\n\n優先度付きキュー（priority_queue）を使ってダイクストラ法を実装せよ。有向重み付きグラフにおいて、始点 start から全ノードへの最短距離を dist[] に記録する。グラフは隣接リスト形式（pair<ノード番号,重み>）。INT_MAX で未到達を表現し、キューから取り出したコストが dist より大きい場合はスキップする（遅延削除）。',
  inputFormat: {
    params: [
      { name: 'graph', type: 'vector<vector<pair<int,int>>>&', desc: '隣接リスト（graph[v] = {next, weight} のリスト）' },
      { name: 'start', type: 'int', desc: '始点ノード番号' },
      { name: 'dist', type: 'vector<int>&', desc: '各ノードへの最短距離を格納する配列（出力用）' },
    ],
    note: '戻り値: void（dist[] に結果を書き込む）\n制約: 1 ≤ V ≤ 10^5、1 ≤ E ≤ 2×10^5、重み ≥ 0',
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'void dijkstra(vector<vector<pair<int,int>>>& graph, int start, vector<int>& dist) {' },
    { id: 1,  code: '    int n = graph.size();' },
    { id: 2,  code: '    dist.assign(n, INT_MAX);' },
    { id: 3,  code: '    dist[start] = 0;' },
    { id: 4,  code: '    priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;' },
    { id: 5,  code: '    pq.push({0, start});' },
    { id: 6,  code: '    while (!pq.empty()) {' },
    { id: 7,  code: '        auto [cost, node] = pq.top(); pq.pop();' },
    { id: 8,  code: '        if (cost > dist[node]) continue;' },
    { id: 9,  code: '        for (auto& [next, weight] : graph[node]) {' },
    { id: 10, code: '            if (dist[node] + weight < dist[next]) {' },
    { id: 11, code: '                dist[next] = dist[node] + weight;' },
    { id: 12, code: '                pq.push({dist[next], next});' },
    { id: 13, code: '            }' },
    { id: 14, code: '        }' },
    { id: 15, code: '    }' },
    { id: 16, code: '}' },
  ],
  // id:1 と id:4 は相互に任意順（独立した宣言）。id:1→id:2 (n を使う) の依存のみ
  // id:13,14,15,16 はすべて } → 相互の順序制約なし。全て pq.push（id:12）の後に来ればよい
  partialOrder: [
    [0, 1], [0, 4],          // n の宣言と pq の宣言は関数直後にどちらが先でも可
    [1, 2],                   // n の宣言 → dist.assign(n, ...)
    [2, 3],                   // dist.assign → dist[start]=0
    [4, 5],                   // pq 宣言 → pq.push
    [3, 5], [2, 5],           // dist 初期化完了後に pq.push({0, start})
    [5, 6],                   // pq.push → while
    [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12],
    // 全 } (id:13-16) は最後の操作（id:12 pq.push）の後に来ればよい → 相互順序自由
    [12, 13], [12, 14], [12, 15], [12, 16],
  ],
  hints: [
    'dist を INT_MAX で初期化し、dist[start]=0 としてから pq に {0, start} を push する',
    'while(!pq.empty()) で pq.top() から {cost, node} を取り出し、cost > dist[node] ならスキップ（遅延削除）',
    '各隣接ノード next への緩和 dist[node]+weight < dist[next] が成り立つなら dist[next] を更新し pq に push する',
  ],
  explanation: {
    summary: 'ダイクストラ法は最小ヒープ（優先度付きキュー）を利用して、非負重み有向グラフの単一始点最短経路を O((V+E) log V) で求めるアルゴリズムです。',
    points: [
      'dist[] を INT_MAX で初期化し、dist[start]=0 のみ 0 にする。始点以外はまだ到達不可能',
      'priority_queue を greater<> で最小ヒープ化することで「コストが小さい順」に取り出せる（デフォルトは最大ヒープ）',
      '遅延削除: cost > dist[node] のチェックで古いエントリをスキップ。これがダイクストラ実装のポイント',
      '緩和チェック: dist[node] + weight < dist[next] なら dist[next] を更新して pq に push。等号なしは同コストの再訪問を避けるため',
      'auto [cost, node] = pq.top() は C++17 の構造化バインディング。pair.first/second より読みやすい',
    ],
    complexity: { time: 'O((V + E) log V)', space: 'O(V + E)' },
    tip: 'ダイクストラ法は負の重みを持つ辺には適用不可。負の重みがある場合はベルマン-フォード法を使用します。AtCoder では最短経路問題の定番です。',
  },
});
