// graph_012: ワーシャル-フロイド法（全点対最短路） (C++) ★4
// すべての頂点ペア間の最短距離を O(N^3) で求める
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'graph_012',
  title: 'ワーシャル-フロイド法（全点対最短路）',
  category: 'graph',
  categoryLabel: 'グラフ理論',
  difficulty: 4,
  language: 'cpp',
  description: '【ワーシャル-フロイド法とは】全ての頂点ペア (s, t) について最短距離を求める動的計画法です。中継点として使ってよい頂点を 0, 1, 2, ... と1つずつ増やしながら、dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]) で距離を改善します。\n\n有向重み付きグラフの頂点数 n と辺リスト edges が与えられる。負の辺は存在してよいが、負閉路は存在しないものとする。到達不能な頂点ペアは INF のままとし、全点対最短距離 dist を返す関数を実装せよ。',
  inputFormat: {
    params: [
      { name: 'n', type: 'int', desc: '頂点数（0-indexed）' },
      { name: 'edges', type: 'vector<tuple<int,int,long long>>', desc: '有向辺 (from, to, cost) のリスト' },
    ],
    note: '戻り値: vector<vector<long long>>（dist[i][j] = i から j への最短距離、到達不能なら INF）\n制約: 1 ≤ n ≤ 400、|cost| ≤ 10^9、負閉路なし',
    examples: [
      {
        input: 'n = 3, edges = [(0,1,4), (0,2,10), (1,2,3)]',
        output: 'dist[0][2] = 7',
        explanation: '0 から 2 へ直接行くと 10 ですが、0 -> 1 -> 2 と進むと 4 + 3 = 7 になり短くなります。'
      },
      {
        input: 'n = 3, edges = [(0,1,2), (1,2,-5), (0,2,10)]',
        output: 'dist[0][2] = -3',
        explanation: '負辺があっても負閉路がなければ利用できます。0 -> 1 -> 2 で 2 + (-5) = -3 です。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'vector<vector<long long>> floydWarshall(int n, const vector<tuple<int,int,long long>>& edges) {' },
    { id: 1,  code: '    const long long INF = (1LL << 60);' },
    { id: 2,  code: '    vector<vector<long long>> dist(n, vector<long long>(n, INF));' },
    { id: 3,  code: '    for (int i = 0; i < n; i++) dist[i][i] = 0;' },
    { id: 4,  code: '    for (auto [u, v, w] : edges) {' },
    { id: 5,  code: '        dist[u][v] = min(dist[u][v], w);' },
    { id: 6,  code: '    }' },
    { id: 7,  code: '    for (int k = 0; k < n; k++) {' },
    { id: 8,  code: '        for (int i = 0; i < n; i++) {' },
    { id: 9,  code: '            for (int j = 0; j < n; j++) {' },
    { id: 10, code: '                if (dist[i][k] == INF || dist[k][j] == INF) continue;' },
    { id: 11, code: '                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);' },
    { id: 12, code: '            }' },
    { id: 13, code: '        }' },
    { id: 14, code: '    }' },
    { id: 15, code: '    return dist;' },
    { id: 16, code: '}  // end floydWarshall' },
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
    [6, 7], [7, 8], [8, 9], [9, 10], [10, 11],
    [11, 12], [12, 13], [13, 14], [14, 15], [15, 16],
  ],
  hints: [
    'まず dist を INF で初期化し、自分自身への距離 dist[i][i] を 0 にします',
    '辺 (u, v, w) について dist[u][v] = min(dist[u][v], w) とします。同じ2頂点間に複数辺がある場合に備えて min を使います',
    'ループ順は k -> i -> j です。k は「中継点として新しく使えるようにする頂点」を表します',
    'dist[i][k] または dist[k][j] が INF の場合は足し算せずに continue します。INF + 値 による誤更新を防ぐためです',
  ],
  explanation: {
    summary: 'ワーシャル-フロイド法は、使える中継点を段階的に増やすDPです。k 番目のループ時点で「頂点 0..k を中継点として使ってよい場合の最短距離」に更新されます。',
    points: [
      '状態の意味: dist[i][j] は現在許可されている中継点だけを使った i から j への最短距離',
      '遷移: i から j へ直接行く現在値と、i -> k -> j と k を経由する値を比較して小さい方を残す',
      '負辺に対応できるが、負閉路があると最短距離が定義できない。負閉路検出は処理後に dist[v][v] < 0 の頂点があるかで判定できる',
      '全点対を一度に求めるため、複数の始点からの最短距離クエリが多い場合に有効。ただし O(N^3) なので N が大きい場合はダイクストラ法などを使う',
    ],
    complexity: { time: 'O(N^3)', space: 'O(N^2)' },
    tip: 'AtCoder では「全点対最短路」「閉路の最小コスト」「各辺追加後の距離更新」などで頻出です。N が 300〜500 程度なら候補になります。',
  },
});
