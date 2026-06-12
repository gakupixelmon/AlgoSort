// dl_011: Scaled Dot-Product Attention (Python) ★5
// Transformer の核心: Q, K, V からアテンション出力を計算する
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_011',
  title: 'Scaled Dot-Product Attention',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 5,
  language: 'python',
  description: '【Self-Attention とは】Transformer の中核となる機構です。入力系列の各要素が「他のどの要素を、どのくらい参照すべきか」を学習します。Query（Q）・Key（K）・Value（V）の3つの行列を使い、Q と K の内積でスコアを計算し Softmax で確率化、それを V に掛けることで「注目度に応じた情報の重み付き和」を得ます。\n\nNumPy を使って Scaled Dot-Product Attention を実装せよ。スコアを sqrt(d_k) でスケーリングして数値安定化し、Softmax で正規化したあと V の重み付き和を返す。',
  inputFormat: {
    params: [
      { name: 'Q', type: 'np.ndarray', desc: 'クエリ行列（shape: [seq_len, d_k]）' },
      { name: 'K', type: 'np.ndarray', desc: 'キー行列（shape: [seq_len, d_k]）' },
      { name: 'V', type: 'np.ndarray', desc: 'バリュー行列（shape: [seq_len, d_v]）' },
    ],
    note: '戻り値: np.ndarray（アテンション出力、shape: [seq_len, d_v]）\nピン留め: import numpy as np',
    examples: [
      {
        input: 'Q = K = V = np.eye(3)',
        output: 'array（各行が Softmax(Q@K.T/sqrt(d_k)) @ V で計算された weighted sum）',
        explanation: 'Q と K の内積で各要素がどの要素に注目するかのスコアを計算し、sqrt(d_k) でスケーリングして Softmax を取り、V の重み付き和を求めます。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def scaled_dot_product_attention(Q, K, V):' },
    { id: 1, code: '    d_k = Q.shape[-1]' },
    { id: 2, code: '    scores = Q @ K.T / np.sqrt(d_k)' },
    { id: 3, code: '    scores -= np.max(scores, axis=-1, keepdims=True)' },
    { id: 4, code: '    weights = np.exp(scores)' },
    { id: 5, code: '    weights /= np.sum(weights, axis=-1, keepdims=True)' },
    { id: 6, code: '    return weights @ V' },
  ],
  // id:1（d_k）→ id:2（scores, スケーリングで d_k が必要）
  // id:3（max引き、数値安定化）→ id:4（exp）→ id:5（正規化）→ id:6（return）
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6],
  ],
  hints: [
    'd_k = Q.shape[-1] で次元数を取得し、Q @ K.T / np.sqrt(d_k) でスケーリング済みスコアを計算する',
    '数値安定化のため scores から各行の最大値を引く（log-sum-exp と同じトリック）',
    'exp(scores) で重みを求め、行ごとに和で割って正規化（Softmax）。最後に weights @ V で重み付き和を返す',
  ],
  explanation: {
    summary: 'Scaled Dot-Product Attention は Transformer の根幹です。Q・K の内積でどこに「注目するか」を決め、V の重み付き和として情報を集約します。スケーリング（÷√d_k）は Q・K の次元が増えても内積が大きくなりすぎて Softmax が飽和しないための工夫です。',
    points: [
      'Attention(Q, K, V) = Softmax(Q K^T / √d_k) V という式が全て',
      '÷√d_k のスケーリング: d_k が大きいと内積の分散が大きくなり Softmax の勾配が消える問題を防ぐ',
      '数値安定化（max 引き）: scores から最大値を引いても Softmax の値は変わらない（分子・分母に同じ定数が掛かる）',
      'weights の各行は確率分布（合計=1）。大きいほど対応する V の行を強く参照する',
    ],
    complexity: { time: 'O(seq_len² · d_k + seq_len² · d_v)', space: 'O(seq_len²)' },
    tip: '実用では複数のアテンションヘッドを並列に計算する Multi-Head Attention を使います。PyTorch では nn.MultiheadAttention() が利用できます。',
  },
});
