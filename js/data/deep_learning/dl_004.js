// dl_004: ソフトマックス関数とクロスエントロピー損失 (Python) ★3
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_004',
  title: 'Softmax とクロスエントロピー損失',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 3,
  language: 'python',
  description: '【Softmax と Cross-Entropy とは】多クラス分類（例：画像が犬・猫・鳥のどれか）では、モデルの出力を「各クラスの確率」として解釈したいです。Softmax 関数はスコアのベクトルを確率分布（合計=1）に変換します。そしてクロスエントロピー損失は、その予測確率と正解ラベルのズレを数値化します。この2つは多クラス分類の損失計算の基本セットです。\n\nNumPy を使って Softmax 関数とクロスエントロピー損失を実装せよ。数値安定性のため Softmax では max を引いてからベクトルを引数に受け取る。クロスエントロピー損失はバッチ平均を返す。',
  inputFormat: {
    params: [
      { name: 'z', type: 'np.ndarray', desc: 'Softmax への入力スコア（shape: [バッチ数, クラス数]）' },
      { name: 'y_true', type: 'np.ndarray', desc: '正解ラベル（shape: [バッチ数]、整数インデックス）' },
    ],
    note: 'softmax(z) 戻り値: np.ndarray（確率分布、shape: [バッチ数, クラス数]、各行の合計=1）\ncross_entropy(probs, y_true) 戻り値: float（バッチ平均損失）\nピン留め: import numpy as np',
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0,  code: 'def softmax(z):' },
    { id: 1,  code: '    z_stable = z - np.max(z, axis=1, keepdims=True)' },
    { id: 2,  code: '    exp_z = np.exp(z_stable)' },
    { id: 3,  code: '    return exp_z / np.sum(exp_z, axis=1, keepdims=True)' },
    { id: 4,  code: 'def cross_entropy(probs, y_true):' },
    { id: 5,  code: '    n = probs.shape[0]' },
    { id: 6,  code: '    log_probs = np.log(probs[np.arange(n), y_true] + 1e-8)' },
    { id: 7,  code: '    return -np.mean(log_probs)' },
  ],
  correctOrders: [[0, 1, 2, 3, 4, 5, 6, 7]],
  hints: [
    'Softmax: まず各行の最大値を引いて数値安定化（z_stable）。次に exp を取り、行ごとに合計で割る',
    'cross_entropy の引数はすでに Softmax 済みの確率行列 probs と正解インデックス y_true',
    'probs[np.arange(n), y_true] で各サンプルの正解クラスの確率だけを抽出し、log を取って平均する',
  ],
  explanation: {
    summary: 'Softmax + Cross-Entropy は多クラス分類の標準的な出力・損失の組み合わせです。数値安定性のために max を引くのが実装上の重要なポイントです。',
    points: [
      'Softmax: σ(z)_i = exp(z_i) / Σ exp(z_j)。exp は大きな値で溢れるため、max 引きで安定化する',
      'max を引いても softmax の値は変わらない（分子・分母に同じ定数が掛かるため相殺）',
      'クロスエントロピー L = -Σ y_true * log(probs)。正解クラス以外の y_true は 0 なので正解クラスの確率だけ取り出せばよい',
      '1e-8 を足して log(0) による -inf を防ぐ（数値安定化テクニック）',
    ],
    complexity: { time: 'O(B·C)（B=バッチ数, C=クラス数）', space: 'O(B·C)' },
    tip: 'PyTorch では nn.CrossEntropyLoss() が Softmax + Cross-Entropy を一括計算します。log-sum-exp のトリックで数値安定性も保証されています。',
  },
});
