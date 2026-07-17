// dl_026: BCEWithLogits Loss (Python) ★3
// sigmoid と binary cross entropy を数値安定にまとめて計算する
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_026',
  title: 'BCEWithLogits Loss',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 3,
  language: 'python',
  description: '【BCEWithLogits Loss とは】\n二値分類やマルチラベル分類では、ロジットに sigmoid を適用して確率に変換し、その後 Binary Cross Entropy を計算します。しかし、sigmoid の出力が 0 や 1 に極端に近いと、log(0) に近い計算が発生して数値的に不安定になります。\n\nBCEWithLogits Loss は、sigmoid と BCE を別々に計算せず、ロジットから直接、数値安定な式で損失を計算します。\n\nNumPy を使って、logits と targets から BCEWithLogits Loss の平均値を返す関数を実装せよ。',
  inputFormat: {
    params: [
      { name: 'logits', type: 'np.ndarray', desc: 'モデル出力ロジット（任意 shape）' },
      { name: 'targets', type: 'np.ndarray', desc: '0 または 1 の正解ラベル（logits と同じ shape）' },
    ],
    note: '戻り値: float（全要素平均損失）\nピン留め: import numpy as np',
    examples: [
      {
        input: 'logits = np.array([0.0, 2.0, -2.0])\ntargets = np.array([1.0, 1.0, 0.0])',
        output: '正の平均損失',
        explanation: 'logits=0 は確率0.5なので損失が比較的大きく、正しい向きの大きなロジットは損失が小さくなります。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def bce_with_logits_loss(logits, targets):' },
    { id: 1, code: '    max_val = np.maximum(logits, 0)' },
    { id: 2, code: '    log_term = np.log1p(np.exp(-np.abs(logits)))' },
    { id: 3, code: '    loss = max_val - logits * targets + log_term' },
    { id: 4, code: '    return np.mean(loss)' },
  ],
  partialOrder: [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
  ],
  hints: [
    'sigmoid を先に計算してから log を取ると、極端なロジットで不安定になります',
    '安定形は max(logits, 0) - logits * targets + log(1 + exp(-abs(logits))) です',
    'np.log1p(x) は log(1 + x) を x が小さい場合でも精度よく計算できます',
    '最後は全要素の平均を返します',
  ],
  explanation: {
    summary: 'BCEWithLogits Loss は、sigmoid と Binary Cross Entropy を一体化し、ロジットから直接安定に損失を計算します。',
    points: [
      '確率に変換してから BCE を計算するより、極端なロジットでオーバーフローや log(0) を避けやすい',
      '二値分類では shape が [batch]、マルチラベル分類では [batch, num_labels] のように使える',
      'PyTorch の torch.nn.BCEWithLogitsLoss と同じ発想の実装である',
    ],
    complexity: { time: 'O(要素数)', space: 'O(要素数)' },
    tip: '二値分類で最後の層に sigmoid を入れてから BCEWithLogitsLoss 相当の損失を使うと、sigmoid が二重にかかるので注意が必要です。',
  },
});
