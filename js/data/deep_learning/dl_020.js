// dl_020: スケール化ドット積アテンション (Python) ★4
// Transformer の中核をなす Self-Attention の計算
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_020',
  title: 'スケール化ドット積アテンション',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 4,
  language: 'python',
  description: '【スケール化ドット積アテンションとは】\nTransformerアーキテクチャの中核となる「Attention（注意機構）」の計算式です。\nQuery (Q) と Key (K) の内積を取り、次元数 $d_k$ の平方根で割る（スケールする）ことで勾配消失を防ぎます。これに Softmax を適用して Attention Weight を求め、Value (V) に掛け合わせることで、各単語が他のどの単語にどれくらい注目すべきかの文脈ベクトルを得ます。\n\n配列 Q, K, V（shape は共に [batch, seq_len, d_k] とする）を受け取り、出力ベクトルとアテンションの重みを返す関数を完成させてください。',
  inputFormat: {
    params: [
      { name: 'Q', type: 'np.ndarray', desc: 'Query 行列' },
      { name: 'K', type: 'np.ndarray', desc: 'Key 行列' },
      { name: 'V', type: 'np.ndarray', desc: 'Value 行列' },
      { name: 'mask', type: 'np.ndarray', desc: '無効な位置を 0 としたマスク行列（オプション）' },
    ],
    note: '戻り値: tuple(np.ndarray, np.ndarray)（出力とAttentionの重み）\nピン留め: import numpy as np',
    examples: [
      {
        input: 'Q = K = V = np.array([[1.0, 0.0], [0.0, 1.0]])',
        output: 'output, attn = scaled_dot_product_attention(Q, K, V)',
        explanation: '自分自身との内積が最大になり、Softmax後の重み行列の対角成分が大きくなります。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def scaled_dot_product_attention(Q, K, V, mask=None):' },
    { id: 1, code: '    d_k = Q.shape[-1]' },
    { id: 2, code: '    scores = np.matmul(Q, K.swapaxes(-2, -1)) / np.sqrt(d_k)' },
    { id: 3, code: '    if mask is not None:' },
    { id: 4, code: '        scores = np.where(mask == 0, -1e9, scores)' },
    { id: 5, code: '    exp_scores = np.exp(scores - np.max(scores, axis=-1, keepdims=True))' },
    { id: 6, code: '    attn_weights = exp_scores / np.sum(exp_scores, axis=-1, keepdims=True)' },
    { id: 7, code: '    output = np.matmul(attn_weights, V)' },
    { id: 8, code: '    return output, attn_weights' },
  ],
  partialOrder: [
    [0, 1], [0, 2], [1, 2],
    [2, 3], [3, 4], [2, 5], [4, 5],
    [5, 6], [6, 7], [7, 8]
  ],
  hints: [
    'まず Q と 転置した K の内積 (np.matmul) を取り、np.sqrt(d_k) で割って scores を求めます',
    'mask が指定されている場合は、無効な部分 (mask == 0) のスコアを -1e9 等の極端に小さな値に置き換え、Softmax後に 0 になるようにします',
    'Softmax の計算では、オーバーフロー防止のために scores から最大値を引いた exp_scores を使って正規化します',
    '最後に、求まった attn_weights と V の内積を取り、文脈を考慮したベクトル output を作成します'
  ],
  explanation: {
    summary: 'この計算は数式 $ \\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{QK^T}{\\sqrt{d_k}} \\right) V $ をそのまま実装したものです。',
    points: [
      'スケール因子 $\\sqrt{d_k}$: 次元数が大きくなると内積の分散が大きくなり、Softmaxの出力が1と0に極端に偏る（勾配が消失する）ため、分散を1に戻すために割ります',
      'Masking: 系列長が揃っていない場合の Padding や、未来の単語を参照できないようにする Causal Mask など、様々な条件を適用するために使われます',
      'Softmax の安定化: 数学的にはそのまま exp を計算してもよいですが、プログラム上は大きな値の exp がオーバーフローするため、各行の最大値を引いてから exp を計算する実装が一般的です'
    ],
    complexity: { time: 'O(seq\\_len^2 \\cdot d\\_k)', space: 'O(seq\\_len^2)' },
    tip: '系列長 (seq\\_len) に対する計算量が 2乗で増加するため、長文処理では Attention の計算ボトルネックが問題になります。これを解消するために Linear Attention などの手法が研究されています。'
  }
});
