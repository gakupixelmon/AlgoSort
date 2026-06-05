// dl_003: ソフトマックス＋交差エントロピー損失 (Python) ★3
// 競プロ風：「最小の計算で正しい損失値を求めよ」
// 数値安定化のため max を引いてからソフトマックスを計算する構成
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_003',
  title: 'ソフトマックス＋交差エントロピー損失',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 3,
  language: 'python',
  description: '【問題】\n長さ C の実数列（ロジット）z が与えられる。ソフトマックス関数で確率分布 p に変換し、正解クラス t（0-indexed）に対する交差エントロピー損失 L を計算せよ。\n\nソフトマックス: p[i] = exp(z[i]) / sum(exp(z[j]))\n交差エントロピー: L = -log(p[t])\n\n【制約】\n・数値爆発を防ぐため z から最大値 m = max(z) を引いてから exp を計算すること\n・結果は p（ndarray）と L（float）のタプルで返すこと\n\n【ヒント】exp をとる前に max を引いても確率は変わらない（log-sum-exp の安定化）。',
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def softmax_cross_entropy(z, t):' },
    { id: 1, code: '    m = np.max(z)' },
    { id: 2, code: '    exp_z = np.exp(z - m)' },
    { id: 3, code: '    p = exp_z / np.sum(exp_z)' },
    { id: 4, code: '    L = -np.log(p[t])' },
    { id: 5, code: '    return p, L' },
  ],
  correctOrders: [[0, 1, 2, 3, 4, 5]],
  hints: [
    '数値安定化のため m = np.max(z) を計算し、z - m として exp に渡す',
    'exp_z / np.sum(exp_z) でソフトマックス確率分布 p を計算する',
    'L = -np.log(p[t]) で正解クラス t の交差エントロピー損失を得る',
  ],
  explanation: {
    summary: 'ソフトマックス関数はロジットを確率分布に変換し、交差エントロピー損失は予測分布と正解の"ずれ"を測ります。数値安定化（max引き）は実装上の必須テクニックです。',
    points: [
      '生の exp(z) は z が大きいと数値オーバーフローする。m = max(z) を引くと指数の最大値が 1 に抑えられ安全',
      'p[i] = exp(z[i]-m) / sum(exp(z[j]-m)) は数学的に exp(z[i]) / sum(exp(z[j])) と等価（m は分子分母でキャンセル）',
      'L = -log(p[t]) は正解クラスの確率が 1 に近いほど 0 に、0 に近いほど無限大になる',
      '多クラス分類では正解クラス以外の損失は計算不要（one-hot ラベルとの内積で正解クラスのみ残る）',
    ],
    complexity: { time: 'O(C)', space: 'O(C)' },
    tip: '実用では softmax と cross-entropy を合体した log-softmax + NLLLoss（PyTorch）や sparse_categorical_crossentropy（Keras）を使う。内部では同じ安定化が施されている。',
  },
});
