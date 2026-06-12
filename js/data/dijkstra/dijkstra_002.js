// dijkstra_002: ベルマン-フォード法（負の辺対応最短路）★4 (C++)
// Bellman-Ford: 負の重みを持つ辺がある場合の単一始点最短路アルゴリズム
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dijkstra_002',
  title: 'ベルマン-フォード法（負辺対応最短路）',
  category: 'dijkstra',
  categoryLabel: 'ダイクストラ法',
  difficulty: 4,
  language: 'cpp',
  description: '【ベルマン-フォード法とは】ダイクストラ法は辺の重みが非負（0以上）であることが前提ですが、現実には「割引やコスト軽減で負のコストが生じる」ケースがあります。ベルマン-フォード法は負の重みを持つ辺があっても正しく最短経路を求められます。また「負のサイクル（一周すると合計コストが負になる閉路）の検出」も可能です。\n\nEdge 構造体のリスト edges と頂点数 V を受け取り、ベルマン-フォード法で始点 0 から全頂点への最短距離を返せ。負のサイクルが存在する場合は空 vector を返す。',
  inputFormat: {
    params: [
      { name: 'V', type: 'int', desc: '頂点数' },
      { name: 'edges', type: 'vector<Edge>&', desc: 'struct Edge {int u, v, cost;} の辺リスト' },
    ],
    note: '戻り値: vector<long long>（始点0から各頂点への最短距離。到達不能は LLONG_MAX/2。負のサイクルがあれば空 vector）\nピン留め: struct Edge { int u, v, cost; };',
    examples: [
      {
        input: 'V = 4\nedges = [{0,1,5}, {0,2,4}, {1,3,3}, {2,1,-4}, {3,2,-1}]',
        output: '[0, 3, 4, 6]',
        explanation: '0→2→1 でコスト 4-4=0、そこから3へ+3=3。0→2 は4のまま。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;', '', 'struct Edge { int u, v, cost; };'],
  blocks: [
    { id: 0,  code: 'vector<long long> bellman_ford(int V, vector<Edge>& edges) {' },
    { id: 1,  code: '    const long long INF = LLONG_MAX / 2;' },
    { id: 2,  code: '    vector<long long> dist(V, INF);' },
    { id: 3,  code: '    dist[0] = 0;' },
    { id: 4,  code: '    for (int i = 0; i < V; i++) {' },
    { id: 5,  code: '        for (const auto& e : edges) {' },
    { id: 6,  code: '            if (dist[e.u] != INF && dist[e.u] + e.cost < dist[e.v]) {' },
    { id: 7,  code: '                dist[e.v] = dist[e.u] + e.cost;' },
    { id: 8,  code: '                if (i == V - 1) return {};' },
    { id: 9,  code: '            }' },
    { id: 10, code: '        }' },
    { id: 11, code: '    }' },
    { id: 12, code: '    return dist;' },
    { id: 13, code: '}' },
  ],
  // id:9, id:10, id:11 は全て } で同一テキスト
  // 9 は if の直後（id:7, id:8 の後）、10 は edges ループの直後、11 は V 回ループの直後
  // 9 < 10 < 11 の順序を強制
  partialOrder: [
    [0, 1], [0, 2],
    [1, 2],           // INF 定数宣言 → dist 初期化
    [2, 3],           // dist 初期化 → dist[0]=0
    [3, 4],           // dist[0]=0 の後にループ開始
    [4, 5], [5, 6], [6, 7], [7, 8],
    [8, 9],           // return {} → }（if 閉じ）
    [9, 10], [10, 11],
    [11, 12], [12, 13],
  ],
  hints: [
    'dist を INF（到達不能）で初期化し dist[0]=0。V 回のループで全辺を緩和（V-1 回で十分だが V 回目に更新があれば負サイクル）',
    '各辺 e について dist[e.u] + e.cost < dist[e.v] なら dist[e.v] を更新。dist[e.u] == INF なら加算前にスキップ（オーバーフロー防止）',
    'i == V-1 のとき（V回目のループ）に更新が発生すれば負のサイクルあり → 空 vector を返す',
  ],
  explanation: {
    summary: 'ベルマン-フォード法は全辺を V-1 回繰り返し緩和することで単一始点最短路を求めます。V 回目にも更新が起きれば負のサイクルが存在します。ダイクストラ法と異なり負の辺に対応できますが、計算量は O(VE) とやや大きいです。',
    points: [
      'なぜ V-1 回繰り返すか: 最短路は高々 V-1 本の辺で構成される（V 頂点なら V-1 本の辺で全頂点を結べる）',
      'V 回目に更新が起きる = V 本以上の辺を使う最短路が存在 = 負のサイクルあり',
      'dist[e.u] != INF チェックは LLONG_MAX/2 + 負のコストでのオーバーフローを防ぐ安全策',
      'ダイクストラとの違い: 負辺が扱えるが O(VE) とやや遅い。辺が少なければ十分実用的',
    ],
    complexity: { time: 'O(V · E)', space: 'O(V)' },
    tip: '負のサイクルに「到達可能な」頂点を全て列挙したい場合は、V 回目に更新された頂点から BFS/DFS で到達可能な頂点を探します。AtCoder では SPFA（Shortest Path Faster Algorithm）という高速化版も使われます。',
  },
});
