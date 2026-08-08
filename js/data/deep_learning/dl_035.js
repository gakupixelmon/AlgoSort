// dl_035: Transformer の Add & Norm (Python) ★3
// サブレイヤー出力に残差接続を足し、LayerNorm で安定化する
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_035',
  title: 'Transformer の Add & Norm',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 3,
  language: 'python',
  description: '【Add & Norm とは】\nTransformer の各サブレイヤーでは、Attention や Feed-Forward Network の出力をそのまま次へ渡しません。元の入力を足す残差接続（Add）と、特徴量を安定化する Layer Normalization（Norm）を組み合わせます。\n\n【問題】\n入力 x とサブレイヤーの出力 sublayer_output に対して、Post-LN 型の Add & Norm を実装してください。まず残差接続 $x + \\mathrm{sublayer\\_output}$ を作り、その結果を layer_norm に渡します。',
  inputFormat: {
    params: [
      { name: 'x', type: 'np.ndarray', desc: 'サブレイヤーへの入力（shape: [..., dim]）' },
      { name: 'sublayer_output', type: 'np.ndarray', desc: 'Attention または FFN の出力（x と同じ shape）' },
      { name: 'gamma', type: 'np.ndarray', desc: 'LayerNorm のスケール（shape: [dim]）' },
      { name: 'beta', type: 'np.ndarray', desc: 'LayerNorm のバイアス（shape: [dim]）' },
    ],
    note: '戻り値: np.ndarray\nピン留め: import numpy as np\nlayer_norm(x, gamma, beta) は利用可能とする',
    examples: [{
      input: 'x = np.array([[1.0, 2.0]])\nsublayer_output = np.array([[0.5, -0.5]])',
      output: 'layer_norm([[1.5, 1.5]], gamma, beta)',
      explanation: 'まず元の入力とサブレイヤー出力を足し、その和を正規化します。'
    }],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def add_and_norm(x, sublayer_output, gamma, beta):' },
    { id: 1, code: '    residual = x + sublayer_output' },
    { id: 2, code: '    return layer_norm(residual, gamma, beta)' },
  ],
  partialOrder: [[0, 1], [1, 2]],
  hints: [
    '残差接続は入力 x をサブレイヤー出力に足す操作です',
    'LayerNorm の入力は、足し算を終えた residual です',
    'gamma と beta は layer_norm にそのまま渡します',
  ],
  explanation: {
    summary: 'Add & Norm は、入力を保ったままサブレイヤーの変換を重ね、特徴量の分布を安定化する Transformer の基本部品です。',
    points: [
      '残差接続により、サブレイヤーが有用な変更だけを学びやすくなり、深いネットワークでも勾配が伝わりやすい',
      'LayerNorm は各トークンの特徴次元について正規化し、バッチサイズや系列長に依存しにくい',
      '元の Transformer は Post-LN を採用したが、近年の大規模言語モデルでは正規化を先に置く Pre-LN も広く使われる',
      'Attention の後と FFN の後に、この構造がそれぞれ現れる',
    ],
    complexity: { time: 'O(要素数)', space: 'O(要素数)' },
    tip: 'Pre-LN の場合は `x + sublayer(layer_norm(x))` となり、正規化の位置が異なります。',
  },
});
