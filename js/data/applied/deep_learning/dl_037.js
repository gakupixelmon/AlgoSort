// dl_037: Causal Attention Mask (Python) ★3
// 未来のトークンを参照できないよう Attention スコアをマスクする
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_037',
  title: 'Causal Attention Mask',
  category: 'applied',
  categoryLabel: '応用',
  difficulty: 3,
  language: 'python',
  description: '【Causal Mask とは】\n文章を左から右へ生成する言語モデルでは、ある位置のトークンが未来の正解トークンを見てはいけません。Causal Mask は Attention のスコア行列で未来の位置を $-\\infty$ にし、softmax 後の重みを0にする仕組みです。\n\nNumPy を使って、shape [seq_len, seq_len] の Attention スコアに下三角の causal mask を適用してください。行 i では列 i より右、すなわち未来の位置を `-np.inf` にします。',
  inputFormat: {
    params: [{ name: 'scores', type: 'np.ndarray', desc: 'Attention スコア（shape: [seq_len, seq_len]）' }],
    note: '戻り値: np.ndarray（マスク後のスコア）\nピン留め: import numpy as np',
    examples: [{
      input: 'scores = np.zeros((3, 3))',
      output: '[[0, -inf, -inf], [0, 0, -inf], [0, 0, 0]]',
      explanation: '各トークンは自分自身と過去の位置だけを参照できます。'
    }],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def apply_causal_mask(scores):' },
    { id: 1, code: '    seq_len = scores.shape[-1]' },
    { id: 2, code: '    future_mask = np.triu(np.ones((seq_len, seq_len), dtype=bool), k=1)' },
    { id: 3, code: '    masked_scores = scores.copy()' },
    { id: 4, code: '    masked_scores[future_mask] = -np.inf' },
    { id: 5, code: '    return masked_scores' },
  ],
  partialOrder: [[0, 1], [1, 2], [0, 3], [2, 4], [3, 4], [4, 5]],
  hints: [
    'np.triu(..., k=1) は対角線より上、つまり未来の位置だけを True にします',
    '元の scores を破壊しないよう copy を作ります',
    'Boolean mask を添字に使うと、未来のスコアをまとめて置き換えられます',
    'softmax の前に -np.inf を置くと、その位置の確率は0になります',
  ],
  explanation: {
    summary: 'Causal Mask は、自己回帰型 Transformer が未来のトークンを参照せずに次のトークンを予測するためのマスクです。',
    points: [
      '下三角部分だけを許可するため、位置 i は 0 から i までしか参照できない',
      '学習時も全トークンを並列計算できる一方、情報漏洩は防げる',
      'softmax 前に非常に小さい値または -inf を加えるのが一般的な実装方法',
      'GPT 系のデコーダ専用 Transformer で使われる。BERT のような双方向モデルでは通常使わない',
    ],
    complexity: { time: 'O(seq_len^2)', space: 'O(seq_len^2)' },
    tip: 'バッチやヘッド次元を持つスコアにも、[seq_len, seq_len] の mask をブロードキャストして適用できます。',
  },
});
