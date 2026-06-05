// graph_002: 幅優先探索 BFS (Python)
// 初期化行（id:1 visited=set, id:2 queue=deque, id:3 visited.add, id:4 order=[]）は相互に任意順
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'graph_002',
  title: '幅優先探索（BFS）Python版',
  category: 'graph',
  categoryLabel: 'グラフ理論',
  difficulty: 2,
  language: 'python',
  description: '【幅優先探索（BFS）とは】迷路の出口を探すとき、「入口から距離1のマスを全部調べてから、距離2のマスを調べる…」という層ごとに広がっていく探索方法です。「最短で何ステップか」を知りたい問題に特に向いています。PythonではC++の queue の代わりに collections.deque を使うのが定番です。\n\nグラフの幅優先探索（BFS）をPythonで実装せよ。deque を使い、始点 start から到達可能な全ノードを層ごとに探索し、訪問順のリストを返す。',
  pinnedCode: ['from collections import deque'],
  blocks: [
    { id: 0,  code: 'def bfs(graph, start):' },
    { id: 1,  code: '    visited = set()' },
    { id: 2,  code: '    queue = deque([start])' },
    { id: 3,  code: '    visited.add(start)' },
    { id: 4,  code: '    order = []' },
    { id: 5,  code: '    while queue:' },
    { id: 6,  code: '        node = queue.popleft()' },
    { id: 7,  code: '        order.append(node)' },
    { id: 8,  code: '        for next_node in graph[node]:' },
    { id: 9,  code: '            if next_node not in visited:' },
    { id: 10, code: '                visited.add(next_node)' },
    { id: 11, code: '                queue.append(next_node)' },
    { id: 12, code: '    return order' },
  ],
  // 初期化行（id:1-4）は相互に任意順。制約は「全て while の前（id:5 の前）」のみ
  // id:2（queue=deque([start])）は start を初期要素として持つので id:3（visited.add(start)）と同様に
  // どちらが先でも動作する
  partialOrder: [
    [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
    [1, 5], [2, 5], [3, 5], [4, 5],  // 初期化完了後に while
    [5, 6], [6, 7], [7, 8],
    [8, 9], [9, 10], [10, 11], [11, 12],
    [5, 12],
  ],
  hints: [
    'visited を set() で初期化し、deque に始点を入れて visited に追加する',
    'while queue: ループ内で popleft() してノードを取り出し、order に追加する',
    '隣接ノードが visited に含まれていなければ、visited に追加して queue に append する',
  ],
  explanation: {
    summary: 'PythonのBFSはcollections.dequeを使って実装します。dequeはリストより popleft() が O(1) で高速です。',
    points: [
      'collections.deque は両端キュー。append() で末尾追加、popleft() で先頭取り出しが O(1)',
      'list をキュー代わりに使うと pop(0) が O(N) になり遅いため、deque を使うのがベスト',
      'visited を set で管理することで「x in visited」の判定が O(1) になる',
      'order リストで訪問順を記録し、最後に返す',
    ],
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    tip: 'Python では deque を import して使うのが標準パターン。競技プログラミングでも from collections import deque はほぼ必須の定型文です。',
  },
});
