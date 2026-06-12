// dl_012: L2正則化（Weight Decay）付き損失計算 (Python) ★2
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_012',
  title: 'L2正則化（Weight Decay）付き損失',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 2,
  language: 'python',
  description: '【L2正則化とは】ニューラルネットワークが訓練データに過度に適合してしまう「過学習」を防ぐ手法です。損失関数に「重みの二乗和」を追加することで、モデルが大きな重みを持つことにペナルティを与えます。これにより重みが小さく保たれ、汎化性能が向上します。\n\nMSE（平均二乗誤差）損失に L2 正則化項を加えた損失を計算せよ。L2 損失項は lambda_reg / 2 * Σ(w²) であり、各層の重み行列のリスト weights を受け取り全層分を合計する。',
  inputFormat: {
    params: [
      { name: 'y_pred', type: 'np.ndarray', desc: '予測値（shape: [バッチ数, 出力次元]）' },
      { name: 'y_true', type: 'np.ndarray', desc: '正解ラベル（shape: [バッチ数, 出力次元]）' },
      { name: 'weights', type: 'list[np.ndarray]', desc: '各層の重み行列のリスト' },
      { name: 'lambda_reg', type: 'float', desc: '正則化係数（例: 0.01）' },
    ],
    note: '戻り値: float（MSE損失 + L2正則化損失）\nL2項: (lambda_reg / 2) * 全重みの二乗和\nピン留め: import numpy as np',
    examples: [
      {
        input: 'y_pred = np.array([[0.8], [0.3]])\ny_true = np.array([[1.0], [0.0]])\nweights = [np.array([[0.5, -0.5]])]  # shape: [1, 2]\nlambda_reg = 0.1',
        output: '0.04 + 0.025 = 0.065',
        explanation: 'MSE = mean((0.8-1)² + (0.3-0)²) / 2 = 0.04。L2項 = (0.1/2) * (0.5² + 0.5²) = 0.025。合計 0.065。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def mse_with_l2(y_pred, y_true, weights, lambda_reg):' },
    { id: 1, code: '    mse = np.mean((y_pred - y_true) ** 2)' },
    { id: 2, code: '    l2 = sum(np.sum(w ** 2) for w in weights)' },
    { id: 3, code: '    return mse + (lambda_reg / 2) * l2' },
  ],
  // id:1（MSE計算）と id:2（L2項）はどちらが先でも可（互いに独立）
  partialOrder: [
    [0, 1], [0, 2],   // mse と l2 はどちらが先でも可
    [1, 3], [2, 3],   // return は両方に依存
  ],
  hints: [
    'MSE = mean((y_pred - y_true) ** 2) でバッチ平均二乗誤差を計算する',
    'L2 項は weights リストの各要素の二乗和をすべて合計する（ジェネレータ式が便利）',
    'return mse + (lambda_reg / 2) * l2 で正則化済み損失を返す',
  ],
  explanation: {
    summary: 'L2 正則化は損失関数に重みの二乗和ペナルティを加えることで、モデルが大きな重みを持つことを抑制します。大きな重みは特定の特徴に過度に依存していることを意味するため、汎化性能が下がります。',
    points: [
      'MSE 損失 L_mse = mean((ŷ - y)²) にペナルティ項 (λ/2) Σ w² を加える',
      'λ（lambda_reg）が大きいほど正則化が強くなり、重みが小さく保たれる（代わりに訓練精度は下がる）',
      '/2 は微分したときに係数が消えてシンプルになる（∂/∂w[(λ/2)w²] = λw）というだけの慣習',
      'L1 正則化（|w| の和）はスパースな重みを生む。L2 は均等に小さい重みを生む',
    ],
    complexity: { time: 'O(B·D + P)（B=バッチ数, D=出力次元, P=総パラメータ数）', space: 'O(1)' },
    tip: 'PyTorch では optimizer = torch.optim.Adam(model.parameters(), weight_decay=0.01) と指定するだけで L2 正則化が自動適用されます。',
  },
});
