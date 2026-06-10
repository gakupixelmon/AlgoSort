// dl_009: 畳み込みニューラルネット（Conv2D）1ステップ (Python) ★5
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_009',
  title: '畳み込み操作（Conv2D）の実装',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 5,
  language: 'python',
  description: '【畳み込みとは】CNN（畳み込みニューラルネット）の核心操作です。小さなフィルタ（カーネル）を入力の上でスライドさせ、各位置でフィルタと入力の要素ごとの積和を計算します。これにより画像のエッジや模様などの局所的な特徴を抽出できます。\n\nNumPy を使って2次元畳み込み（チャンネルなし・ストライド1・パディングなし）を実装せよ。入力画像 X（shape: [H, W]）とカーネル K（shape: [kH, kW]）を受け取り、出力特徴マップを返す。',
  inputFormat: {
    params: [
      { name: 'X', type: 'np.ndarray', desc: '入力画像（shape: [H, W]）' },
      { name: 'K', type: 'np.ndarray', desc: '畳み込みカーネル（shape: [kH, kW]）' },
    ],
    note: '戻り値: np.ndarray（出力特徴マップ、shape: [H-kH+1, W-kW+1]）\nパディングなし・ストライド1\nピン留め: import numpy as np',
    examples: [
      {
        input: 'X = np.array([[1,2,3],[4,5,6],[7,8,9]])\nK = np.array([[1,0],[-1,0]])',
        output: 'array([[-3., -3.], [-3., -3.]])',
        explanation: '3×3の画像に2×2カーネルを適用すると2×2の特徴マップが得られます。各位置でカーネルと画像パッチの要素積を合計します。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def conv2d(X, K):' },
    { id: 1, code: '    kH, kW = K.shape' },
    { id: 2, code: '    H, W = X.shape' },
    { id: 3, code: '    out_H, out_W = H - kH + 1, W - kW + 1' },
    { id: 4, code: '    out = np.zeros((out_H, out_W))' },
    { id: 5, code: '    for i in range(out_H):' },
    { id: 6, code: '        for j in range(out_W):' },
    { id: 7, code: '            out[i, j] = np.sum(X[i:i+kH, j:j+kW] * K)' },
    { id: 8, code: '    return out' },
  ],
  // id:1（kH, kW）と id:2（H, W）はどちらが先でも可
  // id:3 は id:1 と id:2 の両方に依存
  // id:4 は id:3 に依存（出力サイズが決まってから zeros を確保）
  partialOrder: [
    [0, 1], [0, 2],   // kH,kW と H,W はどちらが先でも可
    [1, 3], [2, 3],   // out_H,out_W は kH,kW と H,W の両方に依存
    [3, 4],           // zeros は出力サイズ決定後
    [4, 5], [5, 6], [6, 7], [7, 8],  // ループと計算・return は順序固定
  ],
  hints: [
    'まずカーネルサイズ (kH, kW) と入力サイズ (H, W) から出力サイズ (out_H, out_W) を計算する',
    '出力サイズは out_H = H - kH + 1、out_W = W - kW + 1（パディングなし・ストライド1）',
    '二重ループで各位置 (i, j) の出力を X[i:i+kH, j:j+kW] * K の要素積の和（np.sum）で計算する',
  ],
  explanation: {
    summary: '畳み込み操作はカーネルを画像上でスライドさせ、各位置でカーネルと画像パッチの内積を計算します。これが CNN の「局所的な特徴抽出」の本質です。',
    points: [
      '出力サイズ = (H - kH + 1, W - kW + 1)（パディングなし）。padding="same" にすると入力と同じサイズになる',
      'X[i:i+kH, j:j+kW] はカーネルと同じサイズのパッチを切り出している（スライシング）',
      'np.sum(patch * K) で要素積の総和を計算（= 内積 = 畳み込みの1ステップ）',
      '実用では複数チャンネル・バッチ処理・ストライド・パディングが加わる。PyTorch の nn.Conv2d() が全て対応',
    ],
    complexity: { time: 'O(H·W·kH·kW)', space: 'O(H·W)' },
    tip: '実用では im2col という手法で畳み込みを行列積に変換し、GPU で高速に計算します。PyTorch の nn.Conv2d() は内部でこれに相当する最適化を行っています。',
  },
});
