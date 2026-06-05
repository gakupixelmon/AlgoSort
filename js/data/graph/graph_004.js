// graph_004: 深さ優先探索 DFS (Python)
// 完全固定順序。None チェックブロックの順序は論理的に固定
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'graph_004',
  title: '深さ優先探索（DFS）Python版',
  category: 'graph',
  categoryLabel: 'グラフ理論',
  difficulty: 2,
  language: 'python',
  description: '【深さ優先探索（DFS）とは】迷路を探索するとき「一本道を行けるところまで進み、行き止まりになったら1つ前の分岐に戻る」という方法です。Pythonでは再帰関数として実装するのが一般的です。\n\nPythonでDFSを書くときの注意：デフォルト引数に list や set などの可変オブジェクトを直接書くと、呼び出し間で意図せず共有されるバグが発生します。そのため visited=None と書いて関数内で初期化するのが正しいパターンです。\n\nグラフの深さ優先探索（DFS）をPythonで再帰を使って実装せよ。訪問順のリストを返す。visited を set で管理してサイクルを防ぐこと。',
  blocks: [
    { id: 0,  code: 'def dfs(graph, node, visited=None, order=None):' },
    { id: 1,  code: '    if visited is None:' },
    { id: 2,  code: '        visited = set()' },
    { id: 3,  code: '    if order is None:' },
    { id: 4,  code: '        order = []' },
    { id: 5,  code: '    visited.add(node)' },
    { id: 6,  code: '    order.append(node)' },
    { id: 7,  code: '    for next_node in graph[node]:' },
    { id: 8,  code: '        if next_node not in visited:' },
    { id: 9,  code: '            dfs(graph, next_node, visited, order)' },
    { id: 10, code: '    return order' },
  ],
  // Python の DFS は完全固定順序（インデントで構造が明確なため）
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
    [5, 6], [6, 7], [7, 8], [8, 9], [9, 10],
  ],
  hints: [
    '引数 visited と order をデフォルト None にし、None なら set() / [] で初期化する',
    'まず現在のノードを visited に追加し order に append する',
    '隣接ノードが visited にない場合、再帰的に dfs() を呼び出す',
  ],
  explanation: {
    summary: 'PythonのDFSは再帰関数で実装します。Pythonではデフォルト引数に可変オブジェクトを使うと副作用があるため、None で初期化するパターンが重要です。',
    points: [
      'def dfs(graph, node, visited=None, order=None) で None を初期値にする',
      'visited=set() のようにデフォルト引数に直接可変オブジェクトを置くと、呼び出し間で共有されるバグが起きる',
      'None チェック後に set() / [] で初期化することで、呼び出しごとに新しいオブジェクトが作られる',
      '再帰で visited と order を引き回すことで状態を共有する',
    ],
    complexity: { time: 'O(V + E)', space: 'O(V)（再帰スタック）' },
    tip: 'Pythonの再帰は sys.setrecursionlimit() で上限を変更できます。大きなグラフでは iterative DFS（スタック使用）の方が安全です。',
  },
});
