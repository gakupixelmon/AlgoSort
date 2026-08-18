// dl_029: GELU Activation (Python) ★3
// Transformer でよく使われる GELU の tanh 近似を実装する
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_029',
  title: 'GELU 活性化関数',
  category: 'applied',
  categoryLabel: '応用',
  difficulty: 3,
  language: 'python',
  description: '【GELU とは】\nGELU（Gaussian Error Linear Unit）は、入力値を滑らかに通過・抑制する活性化関数です。ReLU のように負の値を一律に0にせず、小さい負の値をなめらかに扱えるため、Transformer 系のモデルで広く使われています。\n\nNumPy を使って、GELU の tanh 近似を実装してください。近似式は $\\operatorname{GELU}(x) \\approx 0.5x\\left(1 + \\tanh\\left(\\sqrt{2 / \\pi}\\left(x + 0.044715x^3\\right)\\right)\\right)$ です。',
  inputFormat: {
    params: [
      { name: 'x', type: 'np.ndarray', desc: '任意 shape の入力テンソル' },
    ],
    note: '戻り値: np.ndarray（x と同じ shape）\nピン留め: import numpy as np',
    examples: [
      {
        input: 'x = np.array([-1.0, 0.0, 1.0])',
        output: '約 [-0.159, 0.0, 0.841]',
        explanation: '大きな正の値はほぼそのまま通し、負の値は滑らかに小さくします。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def gelu(x):' },
    { id: 1, code: '    coefficient = np.sqrt(2.0 / np.pi)' },
    { id: 2, code: '    cubic = x + 0.044715 * x ** 3' },
    { id: 3, code: '    inner = coefficient * cubic' },
    { id: 4, code: '    return 0.5 * x * (1.0 + np.tanh(inner))' },
  ],
  partialOrder: [
    [0, 1], [0, 2], [1, 3], [2, 3], [3, 4],
  ],
  hints: [
    'tanh 近似では、まず x + 0.044715 * x^3 を計算します',
    'sqrt(2 / pi) を掛けた値を tanh に渡します',
    '最後に 0.5 * x * (1 + tanh の結果) を返します',
    'NumPy の演算は要素ごとに適用されるため、入力の shape を変える必要はありません',
  ],
  explanation: {
    summary: 'GELU は入力を連続的に通過・抑制する活性化関数です。この tanh 近似は誤差関数を直接計算せずに高速に近い値を得られます。',
    points: [
      '入力が大きく正なら tanh の値は1に近づき、出力はほぼ x になる',
      '入力が大きく負なら tanh の値は-1に近づき、出力は0に近づく',
      'ReLU と異なり、0付近や負の領域でも出力が滑らかに変化する',
      'tanh 近似は、誤差関数を使う厳密な GELU より実装しやすく、実装でよく採用される',
    ],
    complexity: { time: 'O(要素数)', space: 'O(要素数)' },
    tip: 'GELU は Transformer の Feed-Forward Network でよく使われます。近年は計算をさらに簡略化した SiLU / Swish も広く使われています。',
  },
});
