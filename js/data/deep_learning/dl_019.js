// dl_019: 位置エンコーディング（Positional Encoding） (Python) ★4
// Transformerにおいて「単語の順序情報」を付与するためのサイン・コサイン波マトリクス
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_019',
  title: '位置エンコーディング（Positional Encoding）',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 4,
  language: 'python',
  description: '【Positional Encodingとは】Transformer は RNN や CNN と異なり、単語の「順序」を認識する仕組みを持っていません。そこで、入力された各単語の埋め込みベクトルに対して、その単語の「位置」を表す特定のパターン（サイン波とコサイン波）を加算します。これによりモデルが語順を理解できるようになります。\n\nシーケンス長 seq_len とモデル次元 d_model から、位置エンコーディング行列 PE（shape: [seq_len, d_model]）を計算せよ。\n偶数インデックス (2i) には sin(pos / 10000^(2i/d_model))、奇数インデックス (2i+1) には cos(pos / 10000^(2i/d_model)) を割り当てる。',
  inputFormat: {
    params: [
      { name: 'seq_len', type: 'int', desc: 'シーケンスの長さ（単語数）' },
      { name: 'd_model', type: 'int', desc: '埋め込みベクトルの次元数（偶数を想定）' },
    ],
    note: '戻り値: np.ndarray（PE 行列、shape: [seq_len, d_model]）\n※ 計算の安定化のため 1/10000^(2i/d_model) は exp(i * -(log(10000.0) / d_model)) として実装する\nピン留め: import numpy as np',
    examples: [
      {
        input: 'seq_len=2, d_model=4',
        output: 'array([[ 0.    ,  1.    ,  0.    ,  1.    ],\n       [ 0.8414,  0.5403,  0.0100,  0.9999]])',
        explanation: 'pos=0 の行は sin(0)=0, cos(0)=1。pos=1 の行は周期が異なる波の値が入ります。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def positional_encoding(seq_len, d_model):' },
    { id: 1, code: '    PE = np.zeros((seq_len, d_model))' },
    { id: 2, code: '    pos = np.arange(seq_len)[:, np.newaxis]' },
    { id: 3, code: '    i = np.arange(0, d_model, 2)' },
    { id: 4, code: '    div_term = np.exp(i * -(np.log(10000.0) / d_model))' },
    { id: 5, code: '    PE[:, 0::2] = np.sin(pos * div_term)' },
    { id: 6, code: '    PE[:, 1::2] = np.cos(pos * div_term)' },
    { id: 7, code: '    return PE' },
  ],
  // id:2 (pos) と id:3,4 (div_term) は順不同
  // id:5, 6 (代入) は id:1 (PE確保) と id:2,4 の後
  // id:7 (return) は最後
  partialOrder: [
    [0, 1], [0, 2], [0, 3],
    [3, 4],
    [1, 5], [1, 6],
    [2, 5], [2, 6],
    [4, 5], [4, 6],
    [5, 7], [6, 7],
  ],
  hints: [
    'pos: np.arange(seq_len)[:, np.newaxis] で shape を [seq_len, 1] にし、ブロードキャスト計算の準備をする',
    'i: np.arange(0, d_model, 2) で偶数インデックスの配列 [0, 2, 4, ...] を作る',
    'div_term: np.exp を使って 1 / (10000 ** (i / d_model)) を安定して計算する',
    'PE[:, 0::2] は偶数列すべてを指し、PE[:, 1::2] は奇数列すべてを指す',
  ],
  explanation: {
    summary: '位置エンコーディング（PE）は、次元（列）ごとに波長が異なるサイン波・コサイン波を用意し、各単語の位置（行）に応じた波の「高さ」を埋め込みベクトルに足し合わせることで、単語の相対的な位置関係をモデルに学習させます。',
    points: [
      '周期関数の利用: sin と cos を使うことで、位置が $k$ 離れた単語のエンコーディングが線形変換で表現可能になり、「相対的な距離」をモデルが捉えやすくなる',
      '波長の違い: 低い次元（左の方）は波長が短く頻繁に振動し、高い次元（右の方）は波長が非常に長くゆっくり変化する',
      '足し算で結合: 単語の埋め込みベクトル（Word Embedding）にこの PE をそのまま加算（Add）して Transformer の入力とする',
    ],
    complexity: { time: 'O(seq\\_len \\cdot d\\_model)', space: 'O(seq\\_len \\cdot d\\_model)' },
    tip: 'PyTorch 等の公式チュートリアルでも全く同じベクトル化された実装が使われています。最近の大規模言語モデル（LLM）では、この絶対的な加算ではなく、Attention計算内で相対位置を加味する RoPE（Rotary Position Embedding）や ALiBi といった相対位置エンコーディングが主流になりつつあります。',
  },
});
