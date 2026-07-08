// dl_001: 2層ニューラルネット 順伝播 (Python)
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_001',
  title: '2層ニューラルネット 順伝播',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 2,
  language: 'python',
  description: '【ニューラルネットワーク 順伝播とは】人間の脳の神経細胞（ニューロン）を模倣した計算モデルです。入力データ（例：画像のピクセル値）に重み行列 W を掛けて足し合わせ（線形変換）、その結果をシグモイド関数などの「活性化関数」に通すことで非線形な表現を学習できます。これを複数の層で繰り返して出力（予測）を得る計算が「順伝播（Forward Pass）」です。\n\nNumPy を使って2層ニューラルネットワークの順伝播（Forward Pass）を実装せよ。シグモイド関数を活性化関数として使用し、入力 X から出力 A2 を計算する。',
  inputFormat: {
    params: [
      { name: 'X', type: 'np.ndarray', desc: '入力データ（shape: [バッチ数, 入力次元数]）' },
      { name: 'W1, b1', type: 'np.ndarray', desc: '第1層の重み行列とバイアスベクトル' },
      { name: 'W2, b2', type: 'np.ndarray', desc: '第2層の重み行列とバイアスベクトル' },
    ],
    note: '戻り値: np.ndarray（出力 A2、shape: [バッチ数, 出力次元数]、値域 (0, 1)）\nピン留め: import numpy as np',
    examples: [
      {
        input: 'X = np.array([[0.5, 0.2]])\nW1 = np.array([[0.1, 0.3], [0.2, 0.4]])\nb1 = np.array([0.1, 0.1])\nW2 = np.array([[0.5], [0.6]])\nb2 = np.array([0.2])',
        output: 'array([[0.725...]])',
        explanation: '入力データに行列の重みとバイアスを掛け、シグモイド関数を通す処理を2層繰り返した結果の確率が出力されます。'
      }
    ],
  },
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
  // sigmoid と forward_pass の関数定義順は Python ではどちらでも可
  atomicGroups: [
    [0, 1],
    [2, 3, 4, 5, 6, 7],
  ],
  partialOrder: [
    [0, 1],
    [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],
  ],
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
});
