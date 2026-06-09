// dl_005: 誤差逆伝播（バックプロパゲーション）基礎 (Python) ★4
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_005',
  title: '誤差逆伝播（バックプロパゲーション）',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 4,
  language: 'python',
  description: '【バックプロパゲーションとは】ニューラルネットワークが学習するとき、「どの重みをどれだけ変えれば損失が減るか」を計算する手法です。連鎖律（Chain Rule）を使って出力から入力方向に誤差を伝播させ、各重みの勾配（∂L/∂W）を求めます。これが「逆伝播」と呼ばれる理由です。\n\n1 つの全結合層（Z = X @ W + b → A = sigmoid(A) → Loss = MSE）の順伝播と逆伝播を実装せよ。順伝播では A と中間値 Z を計算し、逆伝播では dL/dW と dL/db を返す。',
  inputFormat: {
    params: [
      { name: 'X', type: 'np.ndarray', desc: '入力データ（shape: [バッチ数, 入力次元]）' },
      { name: 'W', type: 'np.ndarray', desc: '重み行列（shape: [入力次元, 出力次元]）' },
      { name: 'b', type: 'np.ndarray', desc: 'バイアスベクトル（shape: [出力次元]）' },
      { name: 'y_true', type: 'np.ndarray', desc: '正解ラベル（shape: [バッチ数, 出力次元]）' },
    ],
    note: 'forward(X, W, b): (A, Z) を返す\nbackward(X, A, Z, y_true): (dW, db) を返す\nピン留め: import numpy as np',
    examples: [
      {
        input: 'X = np.array([[1.0, 2.0]])\ny_true = np.array([[1.0]])',
        output: 'dW = np.array([[-0.1...], [-0.2...]])\ndb = np.array([-0.1...])',
        explanation: '順伝播で出力 A を計算し、誤差 (A - y_true) を求め、連鎖律に従って重みとバイアスそれぞれの勾配を逆算して返します。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0,  code: 'def sigmoid(x):' },
    { id: 1,  code: '    return 1 / (1 + np.exp(-x))' },
    { id: 2,  code: 'def forward(X, W, b):' },
    { id: 3,  code: '    Z = np.dot(X, W) + b' },
    { id: 4,  code: '    A = sigmoid(Z)' },
    { id: 5,  code: '    return A, Z' },
    { id: 6,  code: 'def backward(X, A, Z, y_true):' },
    { id: 7,  code: '    n = X.shape[0]' },
    { id: 8,  code: '    dL_dA = 2 * (A - y_true) / n' },
    { id: 9,  code: '    dA_dZ = A * (1 - A)' },
    { id: 10, code: '    delta = dL_dA * dA_dZ' },
    { id: 11, code: '    dW = np.dot(X.T, delta)' },
    { id: 12, code: '    db = np.sum(delta, axis=0)' },
    { id: 13, code: '    return dW, db' },
  ],
  partialOrder: [
    [0, 1],
    [1, 2], // 関数の混ざりを防ぐため順序を固定
    [2, 3], [3, 4], [4, 5],
    [5, 6], // 関数の混ざりを防ぐため順序を固定
    [6, 7], [6, 9], // 7(n) と 9(dA_dZ) は順不同
    [7, 8],         // 8(dL_dA) は 7(n) に依存
    [8, 10], [9, 10], // 10(delta) は 8(dL_dA) と 9(dA_dZ) に依存
    [10, 11], [10, 12], // 11(dW) と 12(db) は 10(delta) に依存し順不同
    [11, 13], [12, 13], // 13(return) は最後
  ],
  hints: [
    '順伝播: Z = X @ W + b → A = sigmoid(Z) → (A, Z) を返す',
    '逆伝播の出発点: MSE 損失 L = mean((A - y_true)^2) の A に対する微分 dL/dA = 2(A - y_true) / n',
    'sigmoid の微分: dA/dZ = A * (1 - A)。連鎖律で delta = dL/dA * dA/dZ を計算し、dW = X.T @ delta、db = sum(delta, axis=0)',
  ],
  explanation: {
    summary: '逆伝播は連鎖律（Chain Rule）を層ごとに適用します。L → A → Z → W の各依存関係を逆向きに辿ることで、重みの勾配 ∂L/∂W を計算できます。',
    points: [
      'MSE 損失 L = mean((A - y_true)^2)の A への微分: dL/dA = 2(A - y_true) / n',
      'sigmoid の微分: σ\'(x) = σ(x)(1 - σ(x))。A = sigmoid(Z) から A * (1 - A) で計算できる',
      'delta = dL/dZ = dL/dA * dA/dZ（連鎖律）',
      'dW = X.T @ delta（行列積で全サンプルの勾配を一括計算）、db = Σ delta（バッチ方向に合計）',
    ],
    complexity: { time: 'O(B·d_in·d_out)', space: 'O(B·d_out)' },
    tip: 'PyTorch や TensorFlow では loss.backward() が自動微分（Autograd）でこれを全層分自動計算します。手動実装でバックプロパゲーションの本質を理解することが、フレームワークを深く使いこなす近道です。',
  },
});
