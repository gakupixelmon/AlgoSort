/**
 * data.js - 問題データの管理・ローダー
 * 将来的には fetch() で動的ロードも可能な設計
 *
 * randomEligible: false のカテゴリはランダムモードに出題されない
 * （深層学習など競技プログラミング外の問題を除外するため）
 */

const PROBLEMS_DB = {
  basic: [
    {
      id: 'basic_001',
      title: 'バブルソート',
      category: 'basic',
      categoryLabel: '基本アルゴリズム',
      difficulty: 1,
      language: 'cpp',
      description: '隣接する要素を比較・交換することでリストを昇順に並べる「バブルソート」を実装せよ。計算量は O(N²) であり、安定ソートである。',
      blocks: [
        { id: 0, code: 'void bubble_sort(vector<int>& arr) {' },
        { id: 1, code: '    int n = arr.size();' },
        { id: 2, code: '    for (int i = 0; i < n - 1; i++) {' },
        { id: 3, code: '        for (int j = 0; j < n - 1 - i; j++) {' },
        { id: 4, code: '            if (arr[j] > arr[j + 1]) {' },
        { id: 5, code: '                swap(arr[j], arr[j + 1]);' },
        { id: 6, code: '            }' },
        { id: 7, code: '        }' },
        { id: 8, code: '    }' },
        { id: 9, code: '}' },
      ],
      correctOrders: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]],
      hints: [
        '関数の戻り値は void で、引数は vector<int>& の参照渡し',
        '外側ループは i = 0 〜 n-2、内側ループは j = 0 〜 n-2-i まで',
        '隣接する arr[j] と arr[j+1] を比較し swap() する',
      ],
      explanation: {
        summary: 'バブルソートは隣接する2要素を繰り返し比較・交換することでリストを整列するシンプルなソートアルゴリズムです。',
        points: [
          '外側ループ（i）は「未整列区間の右端」を縮めていく。i 回目のパスでは最大値が末尾に確定する',
          '内側ループ（j）は 0 〜 n-2-i の範囲を走査。i が増えるほど比較回数が減る',
          'swap() は隣接要素を交換するだけでよいので実装が非常にシンプル',
          '安定ソートであるため、等しい要素の相対順序が保たれる',
        ],
        complexity: { time: 'O(N²)', space: 'O(1)' },
        tip: '最適化として「パス中に一度も swap が起きなければ既にソート済み」というフラグを使う早期終了テクニックがあります。',
      },
    },
    {
      id: 'basic_002',
      title: 'バブルソート（Python版）',
      category: 'basic',
      categoryLabel: '基本アルゴリズム',
      difficulty: 1,
      language: 'python',
      description: '隣接する要素を比較・交換することでリストを昇順に並べる「バブルソート」をPythonで実装せよ。',
      blocks: [
        { id: 0, code: 'def bubble_sort(arr):' },
        { id: 1, code: '    n = len(arr)' },
        { id: 2, code: '    for i in range(n - 1):' },
        { id: 3, code: '        for j in range(n - 1 - i):' },
        { id: 4, code: '            if arr[j] > arr[j + 1]:' },
        { id: 5, code: '                arr[j], arr[j + 1] = arr[j + 1], arr[j]' },
        { id: 6, code: '    return arr' },
      ],
      correctOrders: [[0, 1, 2, 3, 4, 5, 6]],
      hints: [
        '関数定義から始める（def bubble_sort(arr):）',
        '外側のループでn-1回、内側のループで比較範囲を i だけ狭める',
        '隣接する arr[j] と arr[j+1] を比較してswapする',
      ],
      explanation: {
        summary: 'PythonでのバブルソートはC++版と同じアルゴリズムですが、タプルアンパックで swap をよりシンプルに書けます。',
        points: [
          'Python では arr[j], arr[j+1] = arr[j+1], arr[j] と1行で swap できる',
          'range(n-1) で外側ループ、range(n-1-i) で内側ループを制御',
          '最後に return arr で整列済みリストを返す',
        ],
        complexity: { time: 'O(N²)', space: 'O(1)' },
        tip: 'Pythonには組み込みの sorted() や list.sort() があり実用上はそちらを使いますが、アルゴリズム理解の基礎として重要です。',
      },
    },
    {
      id: 'basic_003',
      title: '二分探索',
      category: 'basic',
      categoryLabel: '基本アルゴリズム',
      difficulty: 2,
      language: 'cpp',
      description: 'ソート済み配列に対して二分探索を行い、target の添字を返せ。見つからなければ -1 を返す。比較のたびに探索範囲を半分に絞るため O(log N) で動作する。',
      blocks: [
        { id: 0,  code: 'int binary_search(vector<int>& arr, int target) {' },
        { id: 1,  code: '    int left = 0;' },
        { id: 2,  code: '    int right = (int)arr.size() - 1;' },
        { id: 3,  code: '    while (left <= right) {' },
        { id: 4,  code: '        int mid = left + (right - left) / 2;' },
        { id: 5,  code: '        if (arr[mid] == target) return mid;' },
        { id: 6,  code: '        else if (arr[mid] < target) left = mid + 1;' },
        { id: 7,  code: '        else right = mid - 1;' },
        { id: 8,  code: '    }' },
        { id: 9,  code: '    return -1;' },
        { id: 10, code: '}' },
      ],
      correctOrders: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
      hints: [
        'left=0, right=arr.size()-1 で探索範囲を初期化する',
        'mid = left + (right - left) / 2 で中点を計算する（オーバーフロー防止）',
        'arr[mid] < target なら left = mid+1、大きければ right = mid-1 で範囲を絞る',
      ],
      explanation: {
        summary: '二分探索はソート済み配列を対象に、探索範囲を毎回半分に絞ることで O(log N) で目標値を見つけるアルゴリズムです。',
        points: [
          '必ずソート済み配列に適用する。未ソートでは正しく動作しない',
          'mid = (left + right) / 2 は large な値でオーバーフローする可能性があるため mid = left + (right - left) / 2 が安全',
          'arr[mid] == target なら即座に mid を返す。一致しなければ left/right を更新',
          'while (left <= right) の条件：left > right になった時点で「存在しない」と判断し -1 を返す',
        ],
        complexity: { time: 'O(log N)', space: 'O(1)' },
        tip: 'C++ STL には lower_bound() / upper_bound() という二分探索関数があり、競技プログラミングでよく使われます。',
      },
    },
  ],

  graph: [
    {
      id: 'graph_001',
      title: '幅優先探索（BFS）',
      category: 'graph',
      categoryLabel: 'グラフ理論',
      difficulty: 2,
      language: 'cpp',
      description: 'グラフの幅優先探索（BFS）を実装せよ。キュー（queue）を使い、始点 start から到達可能な全ノードを層ごとに探索する。各ノードの訪問済みフラグを管理して無限ループを防ぐこと。',
      pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
      blocks: [
        { id: 0, code: 'void bfs(vector<vector<int>>& graph, int start) {' },
        { id: 1, code: '    vector<bool> visited(graph.size(), false);' },
        { id: 2, code: '    queue<int> q;' },
        { id: 3, code: '    q.push(start);' },
        { id: 4, code: '    visited[start] = true;' },
        { id: 5, code: '    while (!q.empty()) {' },
        { id: 6, code: '        int node = q.front();' },
        { id: 7, code: '        q.pop();' },
        { id: 8, code: '        for (int next : graph[node]) {' },
        { id: 9, code: '            if (!visited[next]) {' },
        { id: 10, code: '                visited[next] = true;' },
        { id: 11, code: '                q.push(next);' },
        { id: 12, code: '            }' },
        { id: 13, code: '        }' },
        { id: 14, code: '    }' },
        { id: 15, code: '}' },
      ],
      correctOrders: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]],
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
    },
    {
      id: 'graph_002',
      title: '幅優先探索（BFS）Python版',
      category: 'graph',
      categoryLabel: 'グラフ理論',
      difficulty: 2,
      language: 'python',
      description: 'グラフの幅優先探索（BFS）をPythonで実装せよ。deque を使い、始点 start から到達可能な全ノードを層ごとに探索し、訪問順のリストを返す。',
      pinnedCode: ['from collections import deque'],
      blocks: [
        { id: 0, code: 'def bfs(graph, start):' },
        { id: 1, code: '    visited = set()' },
        { id: 2, code: '    queue = deque([start])' },
        { id: 3, code: '    visited.add(start)' },
        { id: 4, code: '    order = []' },
        { id: 5, code: '    while queue:' },
        { id: 6, code: '        node = queue.popleft()' },
        { id: 7, code: '        order.append(node)' },
        { id: 8, code: '        for next_node in graph[node]:' },
        { id: 9, code: '            if next_node not in visited:' },
        { id: 10, code: '                visited.add(next_node)' },
        { id: 11, code: '                queue.append(next_node)' },
        { id: 12, code: '    return order' },
      ],
      // partialOrder による部分順序制約方式で判定する。
      // 初期化行（id:1 visited=set, id:2 queue=deque, id:3 visited.add, id:4 order=[]）
      // は相互に任意順で良いため、制約に含めない。
      // 必須制約：
      //   0（def）→ 1,2,3,4,5,6,7,8,9,10,11,12 の全て
      //   1,2,3,4（初期化）→ 5（while queue）
      //   5 → 6（node=popleft）→ 7（order.append）→ 8（for next_node）
      //   8 → 9（if not in）→ 10（visited.add）→ 11（queue.append）→ 12（return）
      partialOrder: [
        [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
        [1, 5], [2, 5], [3, 5], [4, 5],
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
    },
    {
      id: 'graph_003',
      title: '深さ優先探索（DFS）',
      category: 'graph',
      categoryLabel: 'グラフ理論',
      difficulty: 2,
      language: 'cpp',
      description: 'グラフの深さ優先探索（DFS）を再帰を使って実装せよ。始点 start から到達可能な全ノードを深く潜りながら探索する。visited 配列でサイクルを防ぐこと。',
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
      correctOrders: [[0, 1, 2, 3, 4, 5, 6, 7, 8]],
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
    },
    {
      id: 'graph_004',
      title: '深さ優先探索（DFS）Python版',
      category: 'graph',
      categoryLabel: 'グラフ理論',
      difficulty: 2,
      language: 'python',
      description: 'グラフの深さ優先探索（DFS）をPythonで再帰を使って実装せよ。訪問順のリストを返す。visited を set で管理してサイクルを防ぐこと。',
      blocks: [
        { id: 0, code: 'def dfs(graph, node, visited=None, order=None):' },
        { id: 1, code: '    if visited is None:' },
        { id: 2, code: '        visited = set()' },
        { id: 3, code: '    if order is None:' },
        { id: 4, code: '        order = []' },
        { id: 5, code: '    visited.add(node)' },
        { id: 6, code: '    order.append(node)' },
        { id: 7, code: '    for next_node in graph[node]:' },
        { id: 8, code: '        if next_node not in visited:' },
        { id: 9, code: '            dfs(graph, next_node, visited, order)' },
        { id: 10, code: '    return order' },
      ],
      // partialOrder で内部定義務調値の None チェックブロックは完全に固定。
      // 0（def）→ 1（if visited is None）→ 2（visited=set）→ 3（if order is None）→ 4（order=[]）
      // → 5（visited.add）→ 6（order.append）→ 7（for next_node）→ 8（if not in）→ 9（dfs再帰）→ 10（return）
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
    },
  ],

  // ======= ダイクストラ法 =======
  dijkstra: [
    {
      id: 'dijkstra_001',
      title: 'ダイクストラ法（優先度付きキュー）',
      category: 'dijkstra',
      categoryLabel: 'ダイクストラ法',
      difficulty: 4,
      language: 'cpp',
      description: '優先度付きキュー（priority_queue）を使ってダイクストラ法を実装せよ。有向重み付きグラフにおいて、始点 start から全ノードへの最短距離を dist[] に記録する。グラフは隣接リスト形式（pair<ノード番号,重み>）。INT_MAX で未到達を表現し、キューから取り出したコストが dist より大きい場合はスキップする（遅延未定除）。',
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
      // 完全に固定順序の問題のため correctOrders で充分
      correctOrders: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]],
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
        tip: 'ダイクストラ法は負の重み大を持つ辺には適用不可。負の重みがある場合はベルマン-フォード法を使用します。AtCoder では最短経路問題の定番です。',
      },
    },
  ],

  dp: [
    {
      id: 'dp_001',
      title: 'フィボナッチ数列（DP）',
      category: 'dp',
      categoryLabel: '動的計画法',
      difficulty: 2,
      language: 'cpp',
      description: '動的計画法（DP）を使ってフィボナッチ数列の第 N 項を O(N) で求めよ。再帰では指数時間かかるが、DP なら線形時間で解ける。',
      blocks: [
        { id: 0, code: 'long long fibonacci(int n) {' },
        { id: 1, code: '    if (n <= 1) return n;' },
        { id: 2, code: '    vector<long long> dp(n + 1);' },
        { id: 3, code: '    dp[0] = 0;' },
        { id: 4, code: '    dp[1] = 1;' },
        { id: 5, code: '    for (int i = 2; i <= n; i++) {' },
        { id: 6, code: '        dp[i] = dp[i - 1] + dp[i - 2];' },
        { id: 7, code: '    }' },
        { id: 8, code: '    return dp[n];' },
        { id: 9, code: '}' },
      ],
      // dp[0]=0（id:3）と dp[1]=1（id:4）はどちらが先でも動作するため、相互制約はなし
      partialOrder: [
        [0, 1], [1, 2], [2, 3], [2, 4],
        [3, 5], [4, 5],
        [5, 6], [6, 7], [7, 8], [8, 9],
      ],
      hints: [
        'ベースケース: n が 0 または 1 のときそのまま返す',
        'サイズ n+1 の DP テーブルを用意し dp[0]=0, dp[1]=1 を初期化',
        'dp[i] = dp[i-1] + dp[i-2] の漸化式を i=2 から n まで適用',
      ],
      explanation: {
        summary: '動的計画法（DP）はフィボナッチのような重複する部分問題を「メモ化」して再計算を避けることで、指数時間を線形時間に削減するテクニックです。',
        points: [
          'ナイーブな再帰では fib(n) が fib(n-1) と fib(n-2) の両方から呼ばれ、指数的に爆発する',
          'DP テーブル dp[] に計算済みの値を保存し、以降は O(1) で参照できる',
          'dp[0]=0, dp[1]=1 がベースケース。漸化式 dp[i] = dp[i-1] + dp[i-2] でボトムアップに計算',
          'long long を使うことで大きな N でも整数オーバーフローを防止できる',
        ],
        complexity: { time: 'O(N)', space: 'O(N)' },
        tip: '空間最適化として「直前の2値だけ保持」すれば O(1) 空間で実装できます。競技では空間が問われることも多いです。',
      },
    },
  ],

  // ======= 深層学習（ランダムモード対象外） =======
  deep_learning: [
    {
      id: 'dl_001',
      title: '2層ニューラルネット 順伝播',
      category: 'deep_learning',
      categoryLabel: '深層学習',
      difficulty: 2,
      language: 'python',
      description: 'NumPy を使って2層ニューラルネットワークの順伝播（Forward Pass）を実装せよ。シグモイド関数を活性化関数として使用し、入力 X から出力 A2 を計算する。',
      pinnedCode: ['import numpy as np'],
      blocks: [
        { id: 0, code: 'def sigmoid(x):' },
        { id: 1, code: '    return 1 / (1 + np.exp(-x))' },
        { id: 2, code: 'def forward_pass(X, W1, b1, W2, b2):' },
        { id: 3, code: '    Z1 = np.dot(X, W1) + b1' },
        { id: 4, code: '    A1 = sigmoid(Z1)' },
        { id: 5, code: '    Z2 = np.dot(A1, W2) + b2' },
        { id: 6, code: '    A2 = sigmoid(Z2)' },
        { id: 7, code: '    return A2' },
      ],
      correctOrders: [[0, 1, 2, 3, 4, 5, 6, 7]],
      hints: [
        'ピン留めの import numpy as np は先頭に固定済み。sigmoid 関数の定義から始める',
        '第1層: Z1 = X @ W1 + b1 を計算し sigmoid で A1 を得る',
        '第2層: Z2 = A1 @ W2 + b2 を計算し sigmoid で A2 を得て return する',
      ],
      explanation: {
        summary: '順伝播（Forward Pass）はニューラルネットの推論ステップです。入力データが各層を通じて変換され、最終的な予測値が出力されます。',
        points: [
          'sigmoid(x) = 1 / (1 + exp(-x)) は出力を (0, 1) に押し込む活性化関数',
          'Z1 = X @ W1 + b1 で線形変換、A1 = sigmoid(Z1) で非線形変換を適用',
          '2層目も同様: Z2 = A1 @ W2 + b2 → A2 = sigmoid(Z2)',
          'np.dot() または @ 演算子で行列積を計算。入力・重みの形状に注意',
        ],
        complexity: { time: 'O(n·d₁ + d₁·d₂)', space: 'O(d₁ + d₂)' },
        tip: '実用では ReLU など他の活性化関数が主流ですが、二値分類の出力層や理論学習には sigmoid が基本です。',
      },
    },
    {
      id: 'dl_002',
      title: '勾配降下法（パラメータ更新）',
      category: 'deep_learning',
      categoryLabel: '深層学習',
      difficulty: 3,
      language: 'python',
      description: '勾配降下法を使ってニューラルネットワークのパラメータを更新せよ。\n\n以下の独自関数がすでに実装済みとして使用できる:\n・forward_pass(X, W1, b1, W2, b2) → (A2, cache): 順伝播を実行し出力と中間値キャッシュを返す\n・compute_loss(A2, y) → loss: 予測値A2と正解ラベルyから損失値（誤差）を計算する\n・backward_pass(A2, y, cache) → grads: 逆伝播で各パラメータの勾配辞書{"dW1","db1","dW2","db2"}を返す\n\nこれらを使って、gradient_descent関数と1ステップ分の学習処理train_stepを実装せよ。',
      blocks: [
        { id: 0, code: 'def gradient_descent(W, b, dW, db, lr):' },
        { id: 1, code: '    W = W - lr * dW' },
        { id: 2, code: '    b = b - lr * db' },
        { id: 3, code: '    return W, b' },
        { id: 4, code: 'def train_step(X, y, W1, b1, W2, b2, lr):' },
        { id: 5, code: '    A2, cache = forward_pass(X, W1, b1, W2, b2)' },
        { id: 6, code: '    loss = compute_loss(A2, y)' },
        { id: 7, code: '    grads = backward_pass(A2, y, cache)' },
        { id: 8, code: '    W1, b1 = gradient_descent(W1, b1, grads["dW1"], grads["db1"], lr)' },
        { id: 9, code: '    W2, b2 = gradient_descent(W2, b2, grads["dW2"], grads["db2"], lr)' },
        { id: 10, code: '    return W1, b1, W2, b2, loss' },
      ],
      correctOrders: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
      hints: [
        '先に gradient_descent 関数を定義する: W -= lr * dW, b -= lr * db',
        'train_step は 順伝播 → 損失計算 → 逆伝播 の順に実行する',
        '各レイヤーの重み・バイアスを gradient_descent で更新してまとめて return する',
      ],
      explanation: {
        summary: '勾配降下法はニューラルネットの学習の根幹です。損失関数の勾配（傾き）の反対方向にパラメータを少しずつ動かすことで、損失を最小化します。',
        points: [
          'W = W - lr * dW というシンプルな更新式。lr（学習率）は更新幅を制御する重要なハイパーパラメータ',
          '1ステップの学習は「順伝播 → 損失計算 → 逆伝播 → パラメータ更新」の順',
          '逆伝播 backward_pass() が返す grads 辞書から各パラメータの勾配を取り出す',
          'W1, b1, W2, b2 の全パラメータを更新して返すことで、次ステップに引き継ぐ',
        ],
        complexity: { time: 'O(n·d₁ + d₁·d₂) per step', space: 'O(d₁ + d₂)' },
        tip: '学習率が大きすぎると発散し、小さすぎると収束が遅い。Adam など適応的学習率アルゴリズムが現代では一般的です。',
      },
    },
  ],
};

// カテゴリ定義
// randomEligible: false のカテゴリはランダムモードの出題対象外
const CATEGORIES = [
  {
    id: 'basic',
    label: '基本アルゴリズム',
    icon: '⚡',
    color: '#22d3ee',
    available: true,
    randomEligible: true,
  },
  {
    id: 'dp',
    label: '動的計画法',
    icon: '📊',
    color: '#fb923c',
    available: true,
    randomEligible: true,
  },
  {
    id: 'graph',
    label: 'グラフ理論',
    icon: '🕸️',
    color: '#a78bfa',
    available: true,
    randomEligible: true,
  },
  {
    id: 'dijkstra',
    label: 'ダイクストラ法',
    icon: '🗺️',
    color: '#34d399',
    available: true,
    randomEligible: true,
  },
  {
    id: 'deep_learning',
    label: '深層学習',
    icon: '🧠',
    color: '#f472b6',
    available: true,
    randomEligible: false,   // ← ランダムモードには出題しない
  },
];

const DataManager = (() => {
  // 全問題をフラットなリストで返す（カテゴリモード用）
  function getAllProblems() {
    return Object.values(PROBLEMS_DB).flat();
  }

  // ランダムモード対象の問題だけを返す（randomEligible: false のカテゴリを除外）
  function getRandomEligibleProblems() {
    const eligibleCatIds = new Set(
      CATEGORIES.filter((c) => c.randomEligible !== false).map((c) => c.id)
    );
    return getAllProblems().filter((p) => eligibleCatIds.has(p.category));
  }

  // カテゴリで絞り込み
  function getProblemsByCategory(categoryId) {
    return PROBLEMS_DB[categoryId] || [];
  }

  // 難易度で絞り込み（ランダムモード用：randomEligible のものだけ）
  function getProblemsByDifficulty(difficulty) {
    return getRandomEligibleProblems().filter((p) => p.difficulty === difficulty);
  }

  // IDで1問取得（全問題から）
  function getProblemById(id) {
    return getAllProblems().find((p) => p.id === id) || null;
  }

  // 難易度を指定してランダムに1問取得（randomEligible のみ）
  function getRandomProblemByDifficulty(difficulty) {
    const pool = getProblemsByDifficulty(difficulty);
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // 全ランダム対象問題からランダムに1問取得
  function getRandomProblem() {
    const all = getRandomEligibleProblems();
    if (all.length === 0) return null;
    return all[Math.floor(Math.random() * all.length)];
  }

  // ランダムモード用：問題が存在する難易度一覧（randomEligible のみ）
  function getAvailableDifficulties() {
    const all = getRandomEligibleProblems();
    const set = new Set(all.map((p) => p.difficulty));
    return [1, 2, 3, 4, 5].filter((d) => set.has(d));
  }

  // カテゴリ情報を返す
  function getCategories() {
    return CATEGORIES;
  }

  // ブロックをシャッフル
  function shuffleBlocks(blocks) {
    const arr = [...blocks];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  return {
    getAllProblems,
    getRandomEligibleProblems,
    getProblemsByCategory,
    getProblemsByDifficulty,
    getProblemById,
    getRandomProblem,
    getRandomProblemByDifficulty,
    getAvailableDifficulties,
    getCategories,
    shuffleBlocks,
  };
})();
