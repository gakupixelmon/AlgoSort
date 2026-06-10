// dl_007: バッチ正規化（Batch Normalization）(Python) ★3
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_007',
  title: 'バッチ正規化（Batch Normalization）',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 3,
  language: 'python',
  description: '【バッチ正規化とは】ニューラルネットワークを深くすると、各層の入力の分布が学習中に大きくズレる「内部共変量シフト」が起きやすくなります。Batch Normalization（BN）は各ミニバッチ内でデータを平均0・分散1に正規化し、さらに学習可能なスケール（γ）とシフト（β）パラメータで再変換することで、この問題を緩和します。学習を安定させ収束を速くする効果があります。\n\nNumPy を使って順伝播時のバッチ正規化を実装せよ。入力 X（shape: [バッチ数, 特徴数]）に対して、バッチ方向（axis=0）で正規化し、γ と β で再スケールした結果を返す。',
  inputFormat: {
    params: [
      { name: 'X', type: 'np.ndarray', desc: '入力データ（shape: [バッチ数, 特徴数]）' },
      { name: 'gamma', type: 'np.ndarray', desc: 'スケールパラメータ（shape: [特徴数]）' },
      { name: 'beta', type: 'np.ndarray', desc: 'シフトパラメータ（shape: [特徴数]）' },
    ],
    note: '戻り値: np.ndarray（正規化・再スケール済みの出力、shape: [バッチ数, 特徴数]）\nピン留め: import numpy as np',
    examples: [
      {
        input: 'X = np.array([[1.0, 2.0], [3.0, 4.0], [5.0, 6.0]])\ngamma = np.array([1.0, 1.0])\nbeta = np.array([0.0, 0.0])',
        output: 'array([[-1.22, -1.22], [0.0, 0.0], [1.22, 1.22]])',
        explanation: '各特徴次元でバッチ内の平均を引き分散で割ることで、平均0・分散1に正規化されます。γ=1, β=0 なので再スケールなし。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def batch_norm(X, gamma, beta, eps=1e-8):' },
    { id: 1, code: '    mu = np.mean(X, axis=0)' },
    { id: 2, code: '    var = np.var(X, axis=0)' },
    { id: 3, code: '    X_norm = (X - mu) / np.sqrt(var + eps)' },
    { id: 4, code: '    return gamma * X_norm + beta' },
  ],
  // mu（id:1）と var（id:2）はどちらが先でも正解
  partialOrder: [
    [0, 1], [0, 2],   // 関数定義の後、mu と var はどちらが先でも可
    [1, 3], [2, 3],   // X_norm は mu と var の両方に依存
    [3, 4],           // return は X_norm の後
  ],
  hints: [
    'まずバッチ方向（axis=0）で平均 mu と分散 var を計算する',
    'X_norm = (X - mu) / sqrt(var + eps) で各特徴を標準化する（eps はゼロ除算防止）',
    'gamma * X_norm + beta でスケールとシフトを適用した結果を返す',
  ],
  explanation: {
    summary: 'Batch Normalization は各ミニバッチ内でデータを標準化し、γ・β で再スケールすることで学習を安定させます。学習率を大きくしても発散しにくくなる効果があります。',
    points: [
      'mu: バッチ方向の平均（axis=0）。var: バッチ方向の分散（axis=0）。この2つは独立して計算できる',
      'eps（1e-8）はゼロ除算防止の小さな値。var が 0 に近い場合でも安全に計算できる',
      'γ と β は学習可能なパラメータ。初期値は γ=1, β=0（恒等変換）',
      '推論時は学習中に蓄積した移動平均（running_mean, running_var）を使う（ミニバッチがないため）',
    ],
    complexity: { time: 'O(B·D)（B=バッチ数, D=特徴次元数）', space: 'O(D)' },
    tip: 'PyTorch では nn.BatchNorm1d()（全結合層向け）や nn.BatchNorm2d()（畳み込み層向け）が利用できます。Transformer では代わりに Layer Normalization がよく使われます。',
  },
});
