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
      correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      hints: [
        '関数の戻り値は void で、引数は vector<int>& の参照渡し',
        '外側ループは i = 0 〜 n-2、内側ループは j = 0 〜 n-2-i まで',
        '隣接する arr[j] と arr[j+1] を比較し swap() する',
      ],
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
      correctOrder: [0, 1, 2, 3, 4, 5, 6],
      hints: [
        '関数定義から始める（def bubble_sort(arr):）',
        '外側のループでn-1回、内側のループで比較範囲を i だけ狭める',
        '隣接する arr[j] と arr[j+1] を比較してswapする',
      ],
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
      correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      hints: [
        'left=0, right=arr.size()-1 で探索範囲を初期化する',
        'mid = left + (right - left) / 2 で中点を計算する（オーバーフロー防止）',
        'arr[mid] < target なら left = mid+1、大きければ right = mid-1 で範囲を絞る',
      ],
    },
  ],

  graph: [],
  dijkstra: [],

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
      correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      hints: [
        'ベースケース: n が 0 または 1 のときそのまま返す',
        'サイズ n+1 の DP テーブルを用意し dp[0]=0, dp[1]=1 を初期化',
        'dp[i] = dp[i-1] + dp[i-2] の漸化式を i=2 から n まで適用',
      ],
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
      correctOrder: [0, 1, 2, 3, 4, 5, 6, 7],
      hints: [
        'ピン留めの import numpy as np は先頭に固定済み。sigmoid 関数の定義から始める',
        '第1層: Z1 = X @ W1 + b1 を計算し sigmoid で A1 を得る',
        '第2層: Z2 = A1 @ W2 + b2 を計算し sigmoid で A2 を得て return する',
      ],
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
      correctOrder: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      hints: [
        '先に gradient_descent 関数を定義する: W -= lr * dW, b -= lr * db',
        'train_step は 順伝播 → 損失計算 → 逆伝播 の順に実行する',
        '各レイヤーの重み・バイアスを gradient_descent で更新してまとめて return する',
      ],
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
    available: false,
    randomEligible: true,
  },
  {
    id: 'dijkstra',
    label: 'ダイクストラ法',
    icon: '🗺️',
    color: '#34d399',
    available: false,
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
