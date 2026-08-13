// dl_038: Cross-Attention (Python) ★3
// Query はデコーダ、Key と Value はエンコーダの出力から作る
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_038',
  title: 'Cross-Attention の最小実装',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 3,
  language: 'python',
  description: '【Cross-Attention とは】\nSelf-Attention は1つの系列の中で情報を参照します。一方 Cross-Attention では、Query をデコーダ側の系列から、Key と Value をエンコーダ側の系列から作ります。翻訳では、生成中の単語が入力文のどこを参照すべきかを学習できます。\n\nデコーダ埋め込みとエンコーダ出力から、単一ヘッド Cross-Attention の出力を計算してください。`scaled_dot_product_attention` は利用可能とします。',
  inputFormat: {
    params: [
      { name: 'decoder_x', type: 'np.ndarray', desc: 'デコーダ側の入力（shape: [target_len, dim]）' },
      { name: 'encoder_output', type: 'np.ndarray', desc: 'エンコーダ出力（shape: [source_len, dim]）' },
      { name: 'w_q', type: 'np.ndarray', desc: 'Query 用の重み' },
      { name: 'w_k', type: 'np.ndarray', desc: 'Key 用の重み' },
      { name: 'w_v', type: 'np.ndarray', desc: 'Value 用の重み' },
    ],
    note: '戻り値: np.ndarray（shape: [target_len, dim]）\nピン留め: import numpy as np',
    examples: [{
      input: 'decoder_x.shape = (2, 4)\nencoder_output.shape = (5, 4)',
      output: 'shape (2, 4)',
      explanation: 'デコーダの各位置は、5つのエンコーダ位置から必要な情報を集めます。'
    }],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def cross_attention(decoder_x, encoder_output, w_q, w_k, w_v):' },
    { id: 1, code: '    q = decoder_x @ w_q' },
    { id: 2, code: '    k = encoder_output @ w_k' },
    { id: 3, code: '    v = encoder_output @ w_v' },
    { id: 4, code: '    return scaled_dot_product_attention(q, k, v)' },
  ],
  partialOrder: [[0, 1], [0, 2], [0, 3], [1, 4], [2, 4], [3, 4]],
  hints: [
    'Query だけは、次の出力を生成しようとしている decoder_x から作ります',
    'Key と Value は、参照される側の encoder_output から作ります',
    'q, k, v を作った後の Attention 本体は Self-Attention と同じです',
  ],
  explanation: {
    summary: 'Cross-Attention は、ある系列が別の系列を参照する Attention です。Encoder-Decoder Transformer のデコーダが入力文を参照するために使います。',
    points: [
      'Query の長さは target_len、Key と Value の長さは source_len になり得る',
      'Attention の重み行列は [target_len, source_len] となり、出力位置ごとの参照先を表す',
      '翻訳、要約、画像キャプション、マルチモーダルモデルなどで広く使われる',
      'Self-Attention と違い、Q と K/V の入力元が異なることが本質的な違い',
    ],
    complexity: { time: 'O(target_len * source_len * dim)', space: 'O(target_len * source_len)' },
    tip: 'Encoder-Decoder 構造のデコーダには、Causal Self-Attention と Cross-Attention の両方が含まれます。',
  },
});
