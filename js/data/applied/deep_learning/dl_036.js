// dl_036: Transformer の Position-wise FFN (Python) ★3
// 各トークンに同じ2層 MLP を独立に適用する
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_036',
  title: 'Transformer の Position-wise FFN',
  category: 'applied',
  categoryLabel: '応用',
  difficulty: 3,
  language: 'python',
  description: '【Position-wise FFN とは】\nAttention はトークン間で情報を混ぜますが、Transformer には各トークンの特徴を個別に変換する Feed-Forward Network（FFN）もあります。同じ2層ニューラルネットワークを、系列中の各位置へ独立に適用するため Position-wise FFN と呼ばれます。\n\n【問題】\n入力 x（shape: [seq_len, dim]）に対して、`Linear -> ReLU -> Linear` の FFN を実装してください。NumPy の行列積は行ごとに同じ線形変換を適用できるため、ループは不要です。',
  inputFormat: {
    params: [
      { name: 'x', type: 'np.ndarray', desc: '入力（shape: [seq_len, dim]）' },
      { name: 'w1', type: 'np.ndarray', desc: '第1層重み（shape: [dim, hidden_dim]）' },
      { name: 'b1', type: 'np.ndarray', desc: '第1層バイアス（shape: [hidden_dim]）' },
      { name: 'w2', type: 'np.ndarray', desc: '第2層重み（shape: [hidden_dim, dim]）' },
      { name: 'b2', type: 'np.ndarray', desc: '第2層バイアス（shape: [dim]）' },
    ],
    note: '戻り値: np.ndarray（shape: [seq_len, dim]）\nピン留め: import numpy as np',
    examples: [{
      input: 'x.shape = (4, 8)\nw1.shape = (8, 32)\nw2.shape = (32, 8)',
      output: '出力 shape = (4, 8)',
      explanation: '各トークンは8次元から32次元へ広げられ、ReLU 後に再び8次元へ戻ります。'
    }],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def position_wise_ffn(x, w1, b1, w2, b2):' },
    { id: 1, code: '    hidden = x @ w1 + b1' },
    { id: 2, code: '    activated = np.maximum(hidden, 0)' },
    { id: 3, code: '    return activated @ w2 + b2' },
  ],
  partialOrder: [[0, 1], [1, 2], [2, 3]],
  hints: [
    'x @ w1 + b1 で、全トークンに第1層をまとめて適用できます',
    'ReLU は np.maximum(hidden, 0) です',
    '活性化後の hidden_dim 次元を第2層で元の dim 次元へ戻します',
  ],
  explanation: {
    summary: 'Position-wise FFN は、トークン同士を混ぜずに、各トークンの特徴だけを非線形に変換する2層ネットワークです。',
    points: [
      'Attention が系列方向の情報交換を担い、FFN が各位置の特徴変換を担う',
      '同じ w1, b1, w2, b2 を全トークンで共有するため、位置ごとに独立でもモデルサイズは増えない',
      '通常 hidden_dim は dim より大きく、特徴を一度広げてから戻すことで表現力を得る',
      '実際のモデルでは ReLU の代わりに GELU や SwiGLU が使われることも多い',
    ],
    complexity: { time: 'O(seq_len * dim * hidden_dim)', space: 'O(seq_len * hidden_dim)' },
    tip: 'Self-Attention、Add & Norm、FFN を組み合わせると、Transformer Encoder の基本ブロックになります。',
  },
});
