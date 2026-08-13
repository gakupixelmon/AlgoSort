// dl_039: InfoNCE Contrastive Loss (Python) ★4
// 正例との類似度を高め、同じバッチの他例を負例として扱う
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_039',
  title: 'InfoNCE 対照学習損失',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 4,
  language: 'python',
  description: '【対照学習とは】\n対照学習（Contrastive Learning）は、意味的に対応する2つの表現を近づけ、対応しない表現を離すように学習します。画像と文章の対応を学ぶ CLIP や、同じ画像の異なる拡張を使う SimCLR などで使われます。\n\n【問題】\n正規化済みの埋め込み `queries` と `keys` が対応する順に並んでいるとします。類似度行列を作り、対角要素を正例、それ以外を同じバッチ内の負例とする InfoNCE 損失を計算してください。',
  inputFormat: {
    params: [
      { name: 'queries', type: 'np.ndarray', desc: '正規化済み query 埋め込み（shape: [batch, dim]）' },
      { name: 'keys', type: 'np.ndarray', desc: '正規化済み key 埋め込み（shape: [batch, dim]）' },
      { name: 'temperature', type: 'float', desc: '類似度を調整する正の温度' },
    ],
    note: '戻り値: float（バッチ平均 InfoNCE 損失）\nピン留め: import numpy as np',
    examples: [{
      input: 'queries = keys = np.eye(2)\ntemperature = 1.0',
      output: '小さな正の損失',
      explanation: '対角の類似度は1、非対応ペアは0なので、正例が最も高い確率を持ちます。'
    }],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def info_nce_loss(queries, keys, temperature=0.07):' },
    { id: 1, code: '    logits = (queries @ keys.T) / temperature' },
    { id: 2, code: '    shifted = logits - np.max(logits, axis=1, keepdims=True)' },
    { id: 3, code: '    log_probs = shifted - np.log(np.sum(np.exp(shifted), axis=1, keepdims=True))' },
    { id: 4, code: '    targets = np.arange(len(queries))' },
    { id: 5, code: '    return -np.mean(log_probs[targets, targets])' },
  ],
  partialOrder: [[0, 1], [1, 2], [2, 3], [0, 4], [3, 5], [4, 5]],
  hints: [
    '正規化済みベクトルの内積はコサイン類似度です',
    'temperature で割ると、softmax の鋭さを調整できます',
    '行ごとに log-softmax を計算すると、各 query が全 key から正例を選ぶ分類問題になります',
    '対応ペアは同じバッチ位置にあるので、正解ラベルは 0, 1, ..., batch-1 です',
  ],
  explanation: {
    summary: 'InfoNCE は、各 query が対応する key を同じバッチ内の候補から選び出すように学習する対照学習の代表的な損失です。',
    points: [
      '類似度行列の対角要素が正例で、非対角要素が負例になる',
      '温度が小さいほど softmax は鋭くなり、正例と負例の差を強く要求する',
      'log-softmax を使うと、確率が極端な場合でも数値的に安定して計算できる',
      '大きなバッチほど負例が増えるため、表現の識別力を高めやすい',
    ],
    complexity: { time: 'O(batch^2 * dim)', space: 'O(batch^2)' },
    tip: '実際の CLIP では画像から文章方向だけでなく、文章から画像方向の損失も計算し、両方向を平均します。',
  },
});
