// dl_017: 最大プーリング操作（Max Pooling 2D） (Python) ★3
// 空間方向の解像度を下げ、位置ズレに対するロバスト性を得る
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_017',
  title: '最大プーリング（Max Pooling 2D）',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 3,
  language: 'python',
  description: '【Max Poolingとは】CNN（畳み込みニューラルネット）で頻出するダウンサンプリング操作です。画像（特徴マップ）を小さなブロックに分割し、各ブロック内の「最大値」だけを抽出します。これにより空間解像度を下げて計算量を減らすとともに、微小な位置ズレに対する不変性（ロバスト性）を獲得します。\n\nNumPy を使って2次元最大プーリング（チャンネルなし・ストライド=プールサイズ・パディングなし）を実装せよ。入力画像 X（shape: [H, W]）とプールサイズ K（整数）を受け取り、出力特徴マップを返すこと。',
  inputFormat: {
    params: [
      { name: 'X', type: 'np.ndarray', desc: '入力画像（shape: [H, W]）' },
      { name: 'K', type: 'int', desc: 'プールサイズ（ストライド幅も K とする）' },
    ],
    note: '戻り値: np.ndarray（出力特徴マップ、shape: [H//K, W//K]）\nピン留め: import numpy as np',
    examples: [
      {
        input: 'X = np.array([[1,2,3,4],[5,6,7,8],[9,10,11,12],[13,14,15,16]]), K = 2',
        output: 'array([[ 6.,  8.], [14., 16.]])',
        explanation: '4×4の入力を2×2ブロック4つに分割。左上は max([1,2,5,6])=6、右上は max([3,4,7,8])=8 になる。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def max_pooling_2d(X, K):' },
    { id: 1, code: '    H, W = X.shape' },
    { id: 2, code: '    out_H = H // K' },
    { id: 3, code: '    out_W = W // K' },
    { id: 4, code: '    out = np.zeros((out_H, out_W))' },
    { id: 5, code: '    for i in range(out_H):' },
    { id: 6, code: '        for j in range(out_W):' },
    { id: 7, code: '            patch = X[i*K : (i+1)*K, j*K : (j+1)*K]' },
    { id: 8, code: '            out[i, j] = np.max(patch)' },
    { id: 9, code: '    return out' },
  ],
  // id:2 と id:3 は id:1 に依存（順不同）
  // id:4 は 2, 3 の後に来る
  partialOrder: [
    [0, 1],
    [1, 2], [1, 3],
    [2, 4], [3, 4],
    [4, 5], [5, 6], [6, 7], [7, 8], [8, 9],
  ],
  hints: [
    'ストライドが K なので、出力サイズは out_H = H // K と out_W = W // K になる',
    '二重ループの i, j に対し、元の画像上の切り出し範囲は i*K から (i+1)*K まで、j*K から (j+1)*K までになる',
    'np.max(patch) で切り出した K×K の小領域からの最大値を抽出し、out[i, j] に代入する',
  ],
  explanation: {
    summary: '最大プーリングはブロックごとの最大値を抽出するだけで、学習可能なパラメータを持ちません。しかし特徴の「強い反応」だけを残すため、エッジや模様の位置が少しズレても同じ出力を返すようになります。',
    points: [
      'ダウンサンプリング: H×W の画像が (H/K) × (W/K) に縮小されるため、後続層のパラメータ数や計算量が激減する',
      '最大値抽出の理由: 平均値（Average Pooling）より「特徴がそこにあるかどうか」という信号を強調できるため、画像認識では主流',
      'パッチの切り出し: スライス X[i*K:(i+1)*K, j*K:(j+1)*K] で K×K ブロックを抽出する',
    ],
    complexity: { time: 'O(H·W)（各ピクセルを1回参照）', space: 'O(H·W / K²)' },
    tip: '近年はプーリングを使わず「ストライド2の畳み込み」でダウンサンプリングを学習させるネットワーク（ResNet等）も増えていますが、計算コストの低さから Max Pooling は依然として標準的な選択肢です（PyTorch: nn.MaxPool2d）。',
  },
});
