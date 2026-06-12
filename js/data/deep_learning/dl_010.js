// dl_010: Layer Normalization (Python) ★3
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_010',
  title: 'レイヤー正規化（Layer Normalization）',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 3,
  language: 'python',
  description: '【Layer Normalization とは】Batch Normalization はバッチ方向で正規化しますが、Transformer など系列モデルでは系列長が可変のため利用しにくい問題があります。Layer Normalization（LayerNorm）は1サンプルの特徴次元方向（axis=-1）で正規化するため、バッチサイズに依存しないという利点があります。\n\nNumPy を使って Layer Normalization を実装せよ。入力 X（shape: [バッチ数, 特徴数]）に対して、サンプルごとに特徴方向（axis=-1）で正規化し、γ と β で再スケールした結果を返す。',
  inputFormat: {
    params: [
      { name: 'X', type: 'np.ndarray', desc: '入力データ（shape: [バッチ数, 特徴数]）' },
      { name: 'gamma', type: 'np.ndarray', desc: 'スケールパラメータ（shape: [特徴数]）' },
      { name: 'beta', type: 'np.ndarray', desc: 'シフトパラメータ（shape: [特徴数]）' },
    ],
    note: '戻り値: np.ndarray（正規化・再スケール済みの出力、shape: [バッチ数, 特徴数]）\n正規化はサンプルごとに特徴方向（axis=-1）で行う\nピン留め: import numpy as np',
    examples: [
      {
        input: 'X = np.array([[2.0, 4.0, 4.0, 4.0, 5.0, 5.0, 7.0, 9.0]])\ngamma = np.ones(8)\nbeta = np.zeros(8)',
        output: 'array([[-1.5, -0.5, -0.5, -0.5, 0.0, 0.0, 1.0, 2.0]])',
        explanation: '各サンプルについて特徴次元の平均・分散を計算し、標準化します。γ=1, β=0 なのでスケール変換はなし。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def layer_norm(X, gamma, beta, eps=1e-8):' },
    { id: 1, code: '    mu = np.mean(X, axis=-1, keepdims=True)' },
    { id: 2, code: '    var = np.var(X, axis=-1, keepdims=True)' },
    { id: 3, code: '    X_norm = (X - mu) / np.sqrt(var + eps)' },
    { id: 4, code: '    return gamma * X_norm + beta' },
  ],
  // mu（id:1）と var（id:2）はどちらが先でも正解（両方X単体に依存）
  // X_norm（id:3）はmu とvar 両方に依存
  partialOrder: [
    [0, 1], [0, 2],   // 関数定義の後、mu と var はどちらが先でも可
    [1, 3], [2, 3],   // X_norm は mu と var 両方に依存
    [3, 4],           // return は X_norm の後
  ],
  hints: [
    'Batch Norm との違いは axis の方向。axis=-1（特徴方向）で各サンプルごとに正規化する',
    'mu = np.mean(X, axis=-1, keepdims=True)、var = np.var(X, axis=-1, keepdims=True) で計算する',
    'X_norm = (X - mu) / sqrt(var + eps) で標準化し、gamma * X_norm + beta で再スケールする',
  ],
  explanation: {
    summary: 'Layer Normalization は各サンプルの特徴方向で正規化します。Batch Normalization との最大の違いは「正規化する軸」で、LayerNorm はバッチに依存しないため Transformer の標準コンポーネントになっています。',
    points: [
      'Batch Norm: axis=0（バッチ方向）で正規化 → バッチサイズに依存する',
      'Layer Norm: axis=-1（特徴方向）で正規化 → バッチサイズ・系列長に非依存',
      'keepdims=True を付けることで (B, 1) 形状となり、ブロードキャストで (B, D) の X から引ける',
      'γ と β は Batch Norm と同様に学習可能。γ=1, β=0 で初期化（恒等変換）',
    ],
    complexity: { time: 'O(B·D)（B=バッチ数, D=特徴次元数）', space: 'O(B·D)' },
    tip: 'PyTorch では nn.LayerNorm(normalized_shape) で利用できます。GPT や BERT など大規模言語モデルは全て LayerNorm を採用しています。',
  },
});
