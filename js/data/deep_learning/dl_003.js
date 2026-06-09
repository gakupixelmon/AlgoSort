// dl_003: ReLU活性化関数と多層順伝播 (Python)
// 普通のDeep Learning問題: ReLU を使った3層ネットワークの順伝播
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_003',
  title: '3層ニューラルネット（ReLU）順伝播',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 3,
  language: 'python',
  description: '【ReLU活性化関数とは】sigmoid は大きな値で勾配が消えてしまう「勾配消失問題」を起こしやすいという弱点があります。ReLU（Rectified Linear Unit）は f(x) = max(0, x) という超シンプルな関数で、この問題を大幅に軽減しました。現代のニューラルネットワークでは隠れ層に ReLU を、出力層に sigmoid または softmax を使うのが標準的なパターンです。\n\nNumPy を使って3層ニューラルネットワーク（入力層→隠れ層→隠れ層→出力層）の順伝播を実装せよ。隠れ層の活性化関数に ReLU、出力層の活性化関数に sigmoid を使用する。',
  inputFormat: {
    params: [
      { name: 'X', type: 'np.ndarray', desc: '入力データ（shape: [バッチ数, 入力次元数]）' },
      { name: 'W1, b1', type: 'np.ndarray', desc: '第1層（入力→隠れ層1）の重みとバイアス' },
      { name: 'W2, b2', type: 'np.ndarray', desc: '第2層（隠れ層1→隠れ層2）の重みとバイアス' },
      { name: 'W3, b3', type: 'np.ndarray', desc: '第3層（隠れ層2→出力層）の重みとバイアス' },
    ],
    note: '戻り値: np.ndarray（出力 A3、値域 (0, 1)）\n隠れ層: ReLU、出力層: sigmoid\nピン留め: import numpy as np',
    examples: [
      {
        input: 'X = np.array([[1.0, -1.0]])\n各層の重みとバイアス',
        output: 'array([[0.812...]])',
        explanation: '隠れ層では ReLU 関数により 0 以下の値がカットされ、最終出力層では sigmoid 関数により (0, 1) の範囲に収まった確率値が返ります。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def relu(x):' },
    { id: 1, code: '    return np.maximum(0, x)' },
    { id: 2, code: 'def sigmoid(x):' },
    { id: 3, code: '    return 1 / (1 + np.exp(-x))' },
    { id: 4, code: 'def forward(X, W1, b1, W2, b2, W3, b3):' },
    { id: 5, code: '    Z1 = np.dot(X, W1) + b1' },
    { id: 6, code: '    A1 = relu(Z1)' },
    { id: 7, code: '    Z2 = np.dot(A1, W2) + b2' },
    { id: 8, code: '    A2 = relu(Z2)' },
    { id: 9, code: '    Z3 = np.dot(A2, W3) + b3' },
    { id: 10, code: '    A3 = sigmoid(Z3)' },
    { id: 11, code: '    return A3' },
  ],
  correctOrders: [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]],
  hints: [
    'relu(x) = np.maximum(0, x) でゼロ未満をカットする関数を定義する',
    '第1・第2隠れ層は「線形変換 Z → relu で A」というペアを繰り返す',
    '出力層だけ sigmoid を適用して確率（0〜1）として出力する',
  ],
  explanation: {
    summary: '現代のニューラルネットワークでは隠れ層に ReLU、出力層に sigmoid（2値分類）または softmax（多クラス）を使うのが標準的です。層を深くしても ReLU は勾配消失が起きにくいため、深層学習の普及を支えました。',
    points: [
      'ReLU: f(x) = max(0, x)。負の入力を 0 にカットし正の入力はそのまま通す。微分が常に 0 か 1 なので勾配消失が起きにくい',
      'sigmoid は (0, 1) に値を押し込む。出力を「確率」として解釈したい 2 値分類の出力層で使う',
      '隠れ層を増やすほどモデルの表現力が上がるが、過学習しやすくなるため正則化が必要',
      'np.maximum(0, x) はベクトル・行列にも一括適用できる。Python の max() と混同しないこと',
    ],
    complexity: { time: 'O(n·d₁ + d₁·d₂ + d₂·d₃)', space: 'O(d₁ + d₂ + d₃)' },
    tip: '実用では PyTorch の nn.ReLU() や nn.Linear() を組み合わせる。手動実装は「バックプロパゲーションで何が起きているか」を理解するうえで非常に重要。',
  },
});
