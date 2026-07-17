// dl_024: Label Smoothing Cross Entropy (Python) ★3
// one-hotを少し平滑化して過信を抑える分類損失
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_024',
  title: 'Label Smoothing Cross Entropy',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 3,
  language: 'python',
  description: '【Label Smoothing とは】分類モデルの学習では、正解クラスを1、その他を0とする one-hot ラベルを使うことが一般的です。しかし、モデルが正解クラスに対して過度に高い確信を持つと、汎化性能や確率の校正が悪化することがあります。\n\nLabel Smoothing は、正解クラスの確率を 1 ではなく 1 - ε にし、残りの ε を全クラスに薄く配る正則化手法です。これによりモデルの過信を抑え、Transformer や画像分類モデルなどで広く使われます。\n\nNumPy を使って、ロジット logits と整数ラベル labels から Label Smoothing Cross Entropy を計算する関数を実装せよ。',
  inputFormat: {
    params: [
      { name: 'logits', type: 'np.ndarray', desc: 'モデル出力ロジット（shape: [batch, num_classes]）' },
      { name: 'labels', type: 'np.ndarray', desc: '正解ラベル（整数インデックス、shape: [batch]）' },
      { name: 'epsilon', type: 'float', desc: '平滑化係数（例: 0.1）' },
    ],
    note: '戻り値: float（バッチ平均損失）\nピン留め: import numpy as np',
    examples: [
      {
        input: 'logits = np.array([[2.0, 0.0, -1.0]])\nlabels = np.array([0])\nepsilon = 0.1',
        output: '小さめの正の損失',
        explanation: '正解クラス0の target は 0.9 ではなく、全クラスに epsilon / C が足された平滑化分布になります。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def label_smoothing_loss(logits, labels, epsilon=0.1):' },
    { id: 1, code: '    num_classes = logits.shape[1]' },
    { id: 2, code: '    shifted = logits - np.max(logits, axis=1, keepdims=True)' },
    { id: 3, code: '    log_probs = shifted - np.log(np.sum(np.exp(shifted), axis=1, keepdims=True))' },
    { id: 4, code: '    targets = np.full_like(log_probs, epsilon / num_classes)' },
    { id: 5, code: '    targets[np.arange(len(labels)), labels] += 1.0 - epsilon' },
    { id: 6, code: '    loss = -np.sum(targets * log_probs, axis=1)' },
    { id: 7, code: '    return np.mean(loss)' },
  ],
  partialOrder: [
    [0, 1], [0, 2],
    [2, 3],
    [1, 4], [3, 4],
    [4, 5], [5, 6], [3, 6], [6, 7],
  ],
  hints: [
    'まず logits から行ごとの最大値を引き、log-softmax を数値安定に計算します',
    'targets は全要素を epsilon / num_classes で初期化します',
    '正解クラスには 1.0 - epsilon を追加します。結果として各行の target 分布の和は1になります',
    '損失は -Σ target * log_prob を各サンプルで計算し、平均します',
  ],
  explanation: {
    summary: 'Label Smoothing は one-hot ラベルを少し平滑化する正則化です。正解クラスだけに確率1を置く代わりに、他クラスにも小さな確率を配ることで、モデルの過信を抑えます。',
    points: [
      '通常の Cross Entropy は正解クラスの log_prob だけを見るが、Label Smoothing では全クラスの log_prob を target 分布で重み付けする',
      'log-softmax を直接計算すると、softmax 後に log を取るより数値的に安定する',
      'epsilon が大きすぎると正解信号が弱くなるため、0.05〜0.1 程度がよく使われる',
    ],
    complexity: { time: 'O(batch \\cdot num\\_classes)', space: 'O(batch \\cdot num\\_classes)' },
    tip: 'Transformer の原論文でも Label Smoothing が使われています。精度だけでなく、予測確率の校正改善にも寄与します。',
  },
});
