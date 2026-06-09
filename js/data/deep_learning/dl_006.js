// dl_006: Adam オプティマイザ (Python) ★4
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_006',
  title: 'Adam オプティマイザ',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 4,
  language: 'python',
  description: '【Adam とは】ニューラルネットワークの学習で最もよく使われる最適化アルゴリズムの一つです。過去の勾配の「平均（1次モーメント m）」と「分散（2次モーメント v）」の両方を指数移動平均で記録し、パラメータごとに学習の歩幅を自動調整します。これにより収束が速く、設定のチューニングが比較的簡単になる強力なメリットがあります。\n\nNumPy を使って Adam による1ステップのパラメータ更新を実装せよ。ステップ初期のゼロバイアスを補正する「バイアス補正（Bias correction）」も含めること。',
  inputFormat: {
    params: [
      { name: 'w', type: 'np.ndarray', desc: '現在のパラメータ（重みなど）' },
      { name: 'dw', type: 'np.ndarray', desc: '現在のステップで計算された勾配' },
      { name: 'm', type: 'np.ndarray', desc: '1次モーメント（初期値 0）' },
      { name: 'v', type: 'np.ndarray', desc: '2次モーメント（初期値 0）' },
      { name: 't', type: 'int', desc: '現在のステップ数（1, 2, ...）' },
    ],
    note: '戻り値: (w, m, v)（更新後のパラメータとモーメント）\nピン留め: import numpy as np',
    examples: [
      {
        input: 'w = np.array([1.0]), dw = np.array([0.1])\nm = np.array([0.0]), v = np.array([0.0]), t = 1',
        output: 'w = array([0.999]), m = array([0.01]), v = array([0.00001])',
        explanation: '勾配 dw に基づいて m と v が更新され、バイアス補正を経た上でパラメータ w が僅かに更新されます。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def adam_step(w, dw, m, v, t, lr=0.001, beta1=0.9, beta2=0.999, eps=1e-8):' },
    { id: 1, code: '    m = beta1 * m + (1 - beta1) * dw' },
    { id: 2, code: '    v = beta2 * v + (1 - beta2) * (dw ** 2)' },
    { id: 3, code: '    m_hat = m / (1 - beta1 ** t)' },
    { id: 4, code: '    v_hat = v / (1 - beta2 ** t)' },
    { id: 5, code: '    w -= lr * m_hat / (np.sqrt(v_hat) + eps)' },
    { id: 6, code: '    return w, m, v' },
  ],
  partialOrder: [
    [0, 1], [0, 2],
    [1, 3], [2, 4],
    [3, 5], [4, 5],
    [5, 6]
  ],
  hints: [
    '最初に m と v をそれぞれ beta1, beta2 を使って更新します。これらは順不同で可能です。',
    '次に、更新した m と v をそれぞれ 1 - beta^t で割ることで初期ステップのバイアスを補正（m_hat, v_hat）します。',
    '最後に w -= lr * m_hat / (np.sqrt(v_hat) + eps) でパラメータを更新します。'
  ],
  explanation: {
    summary: 'Adam（Adaptive Moment Estimation）は、Momentum（慣性）と RMSProp（学習率の適応的調整）の良いとこ取りをしたアルゴリズムです。',
    points: [
      'm: 勾配の移動平均。Momentumのように、過去の勾配の方向を引き継ぎます。',
      'v: 勾配の2乗の移動平均。過去に大きく更新されたパラメータの学習率を下げ、あまり更新されていないパラメータの学習率を上げます。',
      'バイアス補正 (m_hat, v_hat): 学習の初期段階では m, v が0に偏りすぎるため、それを 1 - beta^t で割って補正します。',
      'eps (1e-8) はゼロ除算を防ぐための小さな値です。'
    ],
    complexity: { time: 'O(N) (Nはパラメータ数)', space: 'O(N)' },
    tip: '現代の深層学習では「とりあえず Adam を使っておけばうまくいく」と言われるほど強力なデフォルトの選択肢です。',
  },
});
