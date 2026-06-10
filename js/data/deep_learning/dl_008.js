// dl_008: Dropout 正則化（推論時のスケーリング）(Python) ★3
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_008',
  title: 'Dropout 正則化',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 3,
  language: 'python',
  description: '【Dropout とは】ニューラルネットワークの過学習を防ぐ正則化手法です。学習時に各ニューロンを確率 p でランダムにゼロにします（「落とす」）。これにより特定のニューロンへの依存を防ぎ、アンサンブル学習的な効果が得られます。\n\n学習時と推論時で挙動が異なります。学習時はマスクを適用しスケールアップ（inverted dropout）、推論時はそのまま出力します。\n\nNumPy を使って inverted dropout を実装せよ。training=True の場合のみ dropout を適用する（確率 p でゼロにし、残ったニューロンを 1/(1-p) 倍する）。training=False の場合は入力をそのまま返す。',
  inputFormat: {
    params: [
      { name: 'X', type: 'np.ndarray', desc: '入力データ（任意のshape）' },
      { name: 'p', type: 'float', desc: 'ドロップアウト率（0以上1未満）' },
      { name: 'training', type: 'bool', desc: 'True=学習時（dropout適用）、False=推論時（スルー）' },
    ],
    note: '戻り値: np.ndarray（dropout適用後のデータ、shapeはXと同じ）\nピン留め: import numpy as np',
    examples: [
      {
        input: 'X = np.array([[1.0, 2.0, 3.0, 4.0]])\np = 0.5, training = True',
        output: '（ランダム）例: array([[0.0, 4.0, 0.0, 8.0]])',
        explanation: '確率0.5でニューロンをゼロにし、残ったものを2倍（1/(1-0.5)）します。推論時は同じ期待値になるよう設計されています。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def dropout(X, p, training=True):' },
    { id: 1, code: '    if not training:' },
    { id: 2, code: '        return X' },
    { id: 3, code: '    mask = np.random.rand(*X.shape) > p' },
    { id: 4, code: '    return X * mask / (1 - p)' },
  ],
  correctOrders: [[0, 1, 2, 3, 4]],
  hints: [
    '推論時（training=False）はそのまま X を返す（dropout不要）',
    '学習時は np.random.rand(*X.shape) > p でランダムなマスク（True/False の配列）を生成する',
    'X * mask でマスクを適用し、/ (1 - p) でスケールアップする（inverted dropout）',
  ],
  explanation: {
    summary: 'Inverted dropout は学習時にドロップアウト率 p の逆数でスケールアップすることで、推論時にスケール調整が不要になる実用的な実装です。',
    points: [
      '学習時: np.random.rand(*X.shape) > p で確率 (1-p) で True になるマスクを生成',
      'X * mask / (1 - p) の (1-p) 除算が "inverted" の核心。期待値を保つためのスケーリング',
      '推論時は dropout を適用しない（return X）。期待値がそろっているため調整不要',
      'p=0.5 が一般的な設定。大規模モデルでは p=0.1〜0.3 が多い',
    ],
    complexity: { time: 'O(N)（N=要素数）', space: 'O(N)（マスクの保存）' },
    tip: 'PyTorch では nn.Dropout(p=0.5) が同じ動作をします。model.eval() で推論モードに切り替えると自動的に dropout がオフになります（model.train() で再度オンに）。',
  },
});
