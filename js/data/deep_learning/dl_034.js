// dl_034: Self-Attention の最小実装 (Python) ★2
// Q, K, V を作り、各トークンが文脈を参照する
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_034',
  title: 'Self-Attention の最小実装',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 2,
  language: 'python',
  description: '【Transformer の出発点】\nTransformer は、系列中の各トークンが他のトークンを参照して情報を集める Self-Attention を中心にしたモデルです。RNN のように左から順に状態を渡すのではなく、系列全体を並列に処理できます。\n\n【問題】\n入力埋め込み x（shape: [seq_len, dim]）と重み行列 $W_Q, W_K, W_V$ から、単一ヘッド Self-Attention の出力を計算してください。まず Query, Key, Value を線形変換で作り、スケール化ドット積 Attention を適用します。',
  inputFormat: {
    params: [
      { name: 'x', type: 'np.ndarray', desc: '入力埋め込み（shape: [seq_len, dim]）' },
      { name: 'w_q', type: 'np.ndarray', desc: 'Query 用の重み（shape: [dim, dim]）' },
      { name: 'w_k', type: 'np.ndarray', desc: 'Key 用の重み（shape: [dim, dim]）' },
      { name: 'w_v', type: 'np.ndarray', desc: 'Value 用の重み（shape: [dim, dim]）' },
    ],
    note: '戻り値: np.ndarray（shape: [seq_len, dim]）\nピン留め: import numpy as np\nscaled_dot_product_attention(q, k, v) は利用可能とする',
    examples: [{
      input: 'x = np.array([[1.0, 0.0], [0.0, 1.0]])\nw_q = w_k = w_v = np.eye(2)',
      output: 'shape (2, 2) の文脈化された埋め込み',
      explanation: '恒等行列では Q, K, V は x と同じです。各トークンは内積の大きさに応じて2つの Value を混合します。'
    }],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def self_attention(x, w_q, w_k, w_v):' },
    { id: 1, code: '    q = x @ w_q' },
    { id: 2, code: '    k = x @ w_k' },
    { id: 3, code: '    v = x @ w_v' },
    { id: 4, code: '    return scaled_dot_product_attention(q, k, v)' },
  ],
  partialOrder: [[0, 1], [0, 2], [0, 3], [1, 4], [2, 4], [3, 4]],
  hints: [
    'Query, Key, Value はすべて入力 x に重み行列を右から掛けて作ります',
    'q, k, v の計算は互いに依存しないため、順番はどれでも構いません',
    'Attention 本体には変換済みの q, k, v を渡します',
  ],
  explanation: {
    summary: 'Self-Attention は、同じ入力系列から Query、Key、Value を作り、各位置が系列内のどこを参照するかを学習する仕組みです。',
    points: [
      'Query は「何を探しているか」、Key は「何を持っているか」、Value は「渡す情報」として捉えられる',
      '各行の Attention 重みは、そのトークンが他の各トークンをどの程度参照するかを表す',
      'Q, K, V の線形変換に異なる重みを使うことで、同じ入力から異なる役割の表現を作れる',
      '実際の Transformer では、これを複数並列に行う Multi-Head Attention へ拡張する',
    ],
    complexity: { time: 'O(seq_len^2 * dim)', space: 'O(seq_len^2 + seq_len * dim)' },
    tip: '文章生成のように未来のトークンを見せたくない場合は、Attention スコアに causal mask を加えます。',
  },
});
