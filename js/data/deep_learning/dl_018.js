// dl_018: 残差接続（Residual Connection / ResNet Block） (Python) ★3
// スキップ接続により勾配消失を防ぎ、超深層学習を可能にしたブレイクスルー
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_018',
  title: '残差接続（Residual Connection）',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 3,
  language: 'python',
  description: '【残差接続とは】He et al. (2015) が提案した ResNet の核心的なアイデアです。層の出力に「入力そのもの」を足し合わせる（スキップ接続）ことで、ネットワークが「入力からの差分（残差）」だけを学習するようになり、100層を超える超深層ネットワークでも勾配消失を起こさず学習できるようになりました。Transformer にも標準採用されています。\n\n全結合層による単純な ResNet ブロック（2層）の順伝播を実装せよ。入力 X に対して層を2回通し、2回目の出力（活性化前）に入力 X を加算したのち、最後の ReLU を適用すること。',
  inputFormat: {
    params: [
      { name: 'X', type: 'np.ndarray', desc: '入力データ（shape: [batch, features]）' },
      { name: 'W1', type: 'np.ndarray', desc: '1層目の重み' },
      { name: 'b1', type: 'np.ndarray', desc: '1層目のバイアス' },
      { name: 'W2', type: 'np.ndarray', desc: '2層目の重み（出力次元は features に等しい）' },
      { name: 'b2', type: 'np.ndarray', desc: '2層目のバイアス' },
    ],
    note: '戻り値: np.ndarray（ブロックの出力）\n活性化関数: ReLU (np.maximum(0, z))\nピン留め: import numpy as np',
    examples: [
      {
        input: 'X=[-1, 2] (batch=1), W1,W2=単位行列, b1,b2=[0,0]',
        output: 'array([[0, 4]])',
        explanation: 'Z1=X@W1+b1=[-1, 2] → A1=ReLU(Z1)=[0, 2]\nZ2=A1@W2+b2=[0, 2]\n残差加算: Z2 + X = [0, 2] + [-1, 2] = [-1, 4]\n最終出力: ReLU([-1, 4]) = [0, 4]'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def resnet_block(X, W1, b1, W2, b2):' },
    { id: 1, code: '    Z1 = X @ W1 + b1' },
    { id: 2, code: '    A1 = np.maximum(0, Z1)' },
    { id: 3, code: '    Z2 = A1 @ W2 + b2' },
    { id: 4, code: '    out = Z2 + X' },
    { id: 5, code: '    return np.maximum(0, out)' },
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
  ],
  hints: [
    '1層目の計算: Z1 = X @ W1 + b1 の後に ReLU (np.maximum(0, Z1)) を適用して A1 とする',
    '2層目の計算: A1 を入力として Z2 = A1 @ W2 + b2 を計算する（ここではまだ ReLU はかけない）',
    '残差接続: 2層目の出力 Z2 に「元の入力 X」をそのまま足し合わせる (Z2 + X)',
    '最後にその足し合わせた結果に対して ReLU をかけて返す',
  ],
  explanation: {
    summary: '残差接続（out = F(X) + X）は深層学習における最大のブレイクスルーの1つです。逆伝播の際、足し算ノードは勾配をそのまま流す（+1）ため、どんなに層が深くても入力 X への勾配（情報の通り道）が確保され、勾配消失を防ぎます。',
    points: [
      'ネットワークは目的の関数 H(X) を直接学習するのではなく、差分（残差）F(X) = H(X) - X を学習する形になる',
      'F(X) の重みが全てゼロになっても出力は X（恒等写像）になるため、層を深くしても性能が悪化しにくい',
      'CNN（ResNet）だけでなく、Transformer の各サブレイヤー（Attention, FFN）の直後にも必ず適用されている（Add & Norm）',
    ],
    complexity: { time: 'O(B·F²)', space: 'O(B·F)' },
    tip: '実際の ResNet ではこの ReLU の前後に BatchNorm（バッチ正規化）が挟まりますが、「層の出力に入力を足す」という本質は全く同じです。',
  },
});
