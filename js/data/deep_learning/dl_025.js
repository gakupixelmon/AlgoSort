// dl_025: Gradient Clipping (Python) ★3
// 勾配の global norm を制限して exploding gradients を抑える
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_025',
  title: 'Gradient Clipping',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 3,
  language: 'python',
  description: '【Gradient Clipping とは】\nRNN や深いニューラルネットワークでは、逆伝播中に勾配が非常に大きくなる exploding gradients が起きることがあります。勾配が大きすぎると、パラメータ更新が不安定になり、損失が発散する原因になります。\n\nGradient Clipping は、全パラメータの勾配をまとめた global norm がしきい値 max_norm を超えた場合だけ、全勾配を同じ比率で縮小する手法です。勾配の向きは保ちつつ、大きさだけを制限できます。\n\nNumPy を使って、勾配辞書 grads と max_norm から global norm clipping 後の勾配を返す関数を実装せよ。',
  inputFormat: {
    params: [
      { name: 'grads', type: 'dict[str, np.ndarray]', desc: '各パラメータ名から勾配配列への辞書' },
      { name: 'max_norm', type: 'float', desc: '許容する global norm の上限' },
    ],
    note: '戻り値: dict[str, np.ndarray]（必要に応じてスケールされた勾配）\nピン留め: import numpy as np',
    examples: [
      {
        input: "grads = {'w': np.array([3.0, 4.0])}\nmax_norm = 1.0",
        output: "{'w': np.array([0.6, 0.8])} に近い値",
        explanation: 'global norm は5なので、1/5倍に縮小します。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def clip_gradients(grads, max_norm):' },
    { id: 1, code: '    total_norm = 0.0' },
    { id: 2, code: '    for g in grads.values():' },
    { id: 3, code: '        total_norm += np.sum(g ** 2)' },
    { id: 4, code: '    total_norm = np.sqrt(total_norm)' },
    { id: 5, code: '    scale = max_norm / (total_norm + 1e-6)' },
    { id: 6, code: '    if scale >= 1.0:' },
    { id: 7, code: '        return grads' },
    { id: 8, code: '    return {k: v * scale for k, v in grads.items()}' },
  ],
  partialOrder: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 5],
    [5, 6],
    [6, 7],
    [6, 8],
  ],
  hints: [
    'global norm は全勾配要素の二乗和の平方根です',
    'max_norm / total_norm が 1 未満のときだけ全勾配を同じ倍率で縮小します',
    'total_norm が0に近い場合のゼロ除算を避けるため、分母に小さな値を足します',
    'global norm clipping は各配列を個別に切るのではなく、辞書内の全勾配をまとめて扱います',
  ],
  explanation: {
    summary: 'Gradient Clipping は、勾配の global norm が大きすぎる場合だけ全勾配を同じ倍率で縮小し、学習の発散を防ぐ手法です。',
    points: [
      '全勾配をまとめて norm を計算するため、パラメータごとの相対的な勾配方向は保たれる',
      'scale が 1 以上なら既に max_norm 以下なので、勾配を変更する必要はない',
      'RNN、Transformer、強化学習など、勾配が不安定になりやすい学習でよく使われる',
    ],
    complexity: { time: 'O(勾配要素数)', space: 'O(勾配要素数)' },
    tip: 'PyTorch の torch.nn.utils.clip_grad_norm_ も同じ考え方で、全パラメータの global norm を制限します。',
  },
});
