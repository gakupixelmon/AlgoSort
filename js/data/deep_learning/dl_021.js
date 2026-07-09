// dl_021: マルチヘッドアテンション（Multi-Head Attention） (Python) ★5
// 複数の「注意の視点（ヘッド）」を並列に走らせ、結合するTransformerの構成部品
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_021',
  title: 'マルチヘッドアテンション（Multi-Head Attention）',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 5,
  language: 'python',
  description: '【Multi-Head Attentionとは】\nスケール化ドット積アテンション（dl_020）は「1つの視点」から文脈を捉えます。Multi-Head Attentionはこれを $h$ 個のヘッドに分割して並列に実行し、各ヘッドが「別々の注意パターン（構文・意味・位置関係など）」を学習できるようにします。各ヘッドの出力を結合 (Concat) した後、線形変換 $W^O$ を通して最終出力を得ます。\n\n【数学的定義】\n$\\text{MultiHead}(Q, K, V) = \\text{Concat}(\\text{head}_1, \\ldots, \\text{head}_h) W^O$\nただし $\\text{head}_i = \\text{Attention}(Q W_i^Q,\\; K W_i^K,\\; V W_i^V)$\n\nヘッド数 $h$、モデル次元 $d_{\\text{model}}$ のとき、各ヘッドの次元は $d_k = d_v = d_{\\text{model}} / h$ とする。\n\n入力 Q, K, V（shape: [seq_len, d_model]）と重み行列 W_Q, W_K, W_V（各 [d_model, d_model]）、W_O（[d_model, d_model]）を受け取り、Multi-Head Attentionの出力（shape: [seq_len, d_model]）を返す関数を実装せよ。',
  inputFormat: {
    params: [
      { name: 'Q', type: 'np.ndarray', desc: 'Query 行列 [seq_len, d_model]' },
      { name: 'K', type: 'np.ndarray', desc: 'Key 行列 [seq_len, d_model]' },
      { name: 'V', type: 'np.ndarray', desc: 'Value 行列 [seq_len, d_model]' },
      { name: 'W_Q', type: 'np.ndarray', desc: 'Query 投影重み [d_model, d_model]' },
      { name: 'W_K', type: 'np.ndarray', desc: 'Key 投影重み [d_model, d_model]' },
      { name: 'W_V', type: 'np.ndarray', desc: 'Value 投影重み [d_model, d_model]' },
      { name: 'W_O', type: 'np.ndarray', desc: '出力投影重み [d_model, d_model]' },
      { name: 'h', type: 'int', desc: 'ヘッド数（d_model の約数）' },
    ],
    note: '戻り値: np.ndarray（shape: [seq_len, d_model]）\nピン留め: import numpy as np',
    examples: [
      {
        input: 'seq_len=2, d_model=4, h=2\n全重み行列は np.eye(4)（単位行列）',
        output: 'shape (2, 4) の行列（単位行列の場合は入力と等しくなる）',
        explanation: '全ての重みが単位行列のとき、各ヘッドは元の空間を保ち、出力も入力と同じになります。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def scaled_dot_product_attention(Q, K, V):' },
    { id: 1, code: '    d_k = Q.shape[-1]' },
    { id: 2, code: '    scores = np.matmul(Q, K.T) / np.sqrt(d_k)' },
    { id: 3, code: '    exp_s = np.exp(scores - np.max(scores, axis=-1, keepdims=True))' },
    { id: 4, code: '    attn = exp_s / np.sum(exp_s, axis=-1, keepdims=True)' },
    { id: 5, code: '    return np.matmul(attn, V)' },
    { id: 6, code: 'def multi_head_attention(Q, K, V, W_Q, W_K, W_V, W_O, h):' },
    { id: 7, code: '    d_model = Q.shape[-1]' },
    { id: 8, code: '    d_k = d_model // h' },
    { id: 9, code: '    Q_proj = Q @ W_Q' },
    { id: 10, code: '    K_proj = K @ W_K' },
    { id: 11, code: '    V_proj = V @ W_V' },
    { id: 12, code: '    heads = []' },
    { id: 13, code: '    for i in range(h):' },
    { id: 14, code: '        Q_i = Q_proj[:, i*d_k:(i+1)*d_k]' },
    { id: 15, code: '        K_i = K_proj[:, i*d_k:(i+1)*d_k]' },
    { id: 16, code: '        V_i = V_proj[:, i*d_k:(i+1)*d_k]' },
    { id: 17, code: '        heads.append(scaled_dot_product_attention(Q_i, K_i, V_i))' },
    { id: 18, code: '    concat = np.concatenate(heads, axis=-1)' },
    { id: 19, code: '    return concat @ W_O' },
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
    [6, 7], [7, 8],
    [6, 9], [6, 10], [6, 11],
    [8, 14], [8, 15], [8, 16],
    [9, 14], [10, 15], [11, 16],
    [6, 12], [12, 13],
    [13, 14], [13, 15], [13, 16],
    [14, 17], [15, 17], [16, 17],
    [17, 18], [18, 19],
  ],
  hints: [
    '最初にスケール化ドット積アテンションのヘルパー関数を定義する（Q, K, V それぞれが既にヘッドごとに分割済みの行列を受け取る）',
    'Q, K, V をそれぞれ W_Q, W_K, W_V で線形投影し、Q_proj, K_proj, V_proj（shape: [seq_len, d_model]）を作る',
    'ループ内で各ヘッドのスライス Q_proj[:, i*d_k:(i+1)*d_k] を取り出し、アテンションを計算してリストに追加する',
    '全ヘッドの出力を np.concatenate(heads, axis=-1) で結合し（shape: [seq_len, d_model]）、W_O で最終投影する',
  ],
  explanation: {
    summary: 'Multi-Head Attention は、入力を $h$ 個のヘッドに分割してそれぞれ独立にアテンションを計算し、結合することで「多様な注意パターンを同時に学習」します。これがTransformerの表現力の源泉です。',
    points: [
      '並列性: 各ヘッドは独立して計算できるため、GPU等で効率的に並列実行できる',
      '多様な視点: ヘッドによって「構文的な依存関係」「意味的な関連」「指示語の解決」など、異なる注意パターンを専門化して学習することが観察されている',
      '次元の分割: $d_{\\text{model}}$ を $h$ 等分することで、Multi-Head全体の計算コストはSingle-Headと同等に保たれる',
      '最終投影 $W^O$: 各ヘッドの情報を混合し、出力次元を $d_{\\text{model}}$ に整える役割を持つ',
    ],
    complexity: { time: 'O(h \\cdot seq\\_len^2 \\cdot d_k) = O(seq\\_len^2 \\cdot d\\_model)', space: 'O(seq\\_len^2 + seq\\_len \\cdot d\\_model)' },
    tip: 'PyTorchでは nn.MultiheadAttention として実装されており、batch_first=True を指定すると入力を [batch, seq, d_model] の形で扱えます。実用実装では各ヘッドをバッチ次元に並べた [batch, h, seq, d_k] の4Dテンソルで処理します。',
  }
});
