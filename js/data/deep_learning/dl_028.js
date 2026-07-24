// dl_028: RMSNorm (Python) ★3
// 平均を引かず、RMS だけで特徴量を正規化する
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_028',
  title: 'RMSNorm',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 3,
  language: 'python',
  description: '【RMSNorm とは】\nRMSNorm（Root Mean Square Layer Normalization）は、特徴量の平均を引かず、二乗平均平方根（RMS）だけで正規化する手法です。Layer Normalization より計算が少し単純であり、LLaMA など多くの Transformer で使われています。\n\n各トークンの最後の次元について RMS を求め、入力を割った後に学習可能なスケール gamma を掛けます。NumPy を使って、shape [..., dim] の入力 x に RMSNorm を適用する関数を実装せよ。',
  inputFormat: {
    params: [
      { name: 'x', type: 'np.ndarray', desc: '入力テンソル（最後の次元が特徴量 dim）' },
      { name: 'gamma', type: 'np.ndarray', desc: '学習可能なスケール（shape: [dim]）' },
      { name: 'eps', type: 'float', desc: 'ゼロ除算を避ける小さな定数' },
    ],
    note: '戻り値: np.ndarray（x と同じ shape）\nピン留め: import numpy as np',
    examples: [
      {
        input: 'x = np.array([[3.0, 4.0]])\ngamma = np.array([1.0, 1.0])',
        output: '[[約0.85, 約1.13]]',
        explanation: 'RMS は sqrt((3^2 + 4^2) / 2) = 約3.54 です。各要素をこれで割ります。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def rms_norm(x, gamma, eps=1e-6):' },
    { id: 1, code: '    mean_square = np.mean(x ** 2, axis=-1, keepdims=True)' },
    { id: 2, code: '    rms = np.sqrt(mean_square + eps)' },
    { id: 3, code: '    normalized = x / rms' },
    { id: 4, code: '    return normalized * gamma' },
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4],
  ],
  hints: [
    'RMS は sqrt(mean(x^2)) です。平均 x の値そのものは引きません',
    '最後の特徴量次元ごとに正規化するため、axis=-1 を指定します',
    'keepdims=True にすると、x / rms のブロードキャストが自然に行えます',
    'gamma は最後の次元に沿って掛かるため、入力がバッチや系列の次元を持っていても使えます',
  ],
  explanation: {
    summary: 'RMSNorm は、各特徴ベクトルを RMS で割り、学習可能なスケール gamma を掛ける正規化手法です。平均を引かない点が Layer Normalization と異なります。',
    points: [
      'mean_square は最後の次元における各要素の二乗平均であり、入力の大きさを表す',
      'eps を加えてから平方根を取ることで、全要素が0に近いベクトルでも安定して計算できる',
      'gamma により、正規化後にも各特徴次元の適切なスケールを学習できる',
      'LayerNorm のような平均の計算・減算が不要なため、実装と計算が少し簡潔になる',
    ],
    complexity: { time: 'O(要素数)', space: 'O(入力の最後の次元を除く要素数)' },
    tip: 'RMSNorm は平均を0に揃えるのではなく、特徴ベクトルの大きさをそろえます。LayerNorm と同じように、Transformer の各サブレイヤーの前後で使われます。',
  },
});
