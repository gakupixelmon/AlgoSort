// dl_014: RNN（Elman RNN）順伝播 (Python) ★4
// 系列データを1ステップずつ処理し隠れ状態を更新するRNNの実装
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_014',
  title: 'RNN（再帰型ニューラルネット）の順伝播',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 4,
  language: 'python',
  description: '【RNN（再帰型ニューラルネット）とは】文章や時系列データのように「前後のつながり」が重要なデータを扱うためのニューラルネットです。各ステップで「現在の入力」と「前のステップの隠れ状態（記憶）」を使って次の隠れ状態を計算します。この仕組みにより過去の情報を保持しながら処理が進みます。\n\nElman RNN の順伝播を実装せよ。入力系列 xs（長さ T の入力リスト）を1ステップずつ処理し、各ステップの隠れ状態 h_t = tanh(Wx @ x_t + Wh @ h_{t-1} + b) を計算して全ステップの隠れ状態のリストを返す。',
  inputFormat: {
    params: [
      { name: 'xs', type: 'list[np.ndarray]', desc: '入力系列（長さT、各要素 shape: [input_size]）' },
      { name: 'Wx', type: 'np.ndarray', desc: '入力→隠れ層の重み（shape: [hidden_size, input_size]）' },
      { name: 'Wh', type: 'np.ndarray', desc: '隠れ→隠れ層の重み（shape: [hidden_size, hidden_size]）' },
      { name: 'b', type: 'np.ndarray', desc: 'バイアス（shape: [hidden_size]）' },
    ],
    note: '戻り値: list[np.ndarray]（各ステップの隠れ状態 h_t のリスト、各要素 shape: [hidden_size]）\n初期隠れ状態 h_{-1} はゼロベクトル\nピン留め: import numpy as np',
    examples: [
      {
        input: 'xs = [np.array([1.0, 0.0]), np.array([0.0, 1.0])]\nWx = np.eye(2)  # [2×2]\nWh = np.zeros((2, 2))\nb = np.zeros(2)',
        output: '[array([0.762, 0.0]), array([0.0, 0.762])]',
        explanation: '各ステップで x_t を入力し、前の隠れ状態と合わせて tanh で非線形変換した結果が隠れ状態として返ります。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def rnn_forward(xs, Wx, Wh, b):' },
    { id: 1, code: '    h = np.zeros(b.shape)' },
    { id: 2, code: '    hs = []' },
    { id: 3, code: '    for x in xs:' },
    { id: 4, code: '        h = np.tanh(Wx @ x + Wh @ h + b)' },
    { id: 5, code: '        hs.append(h)' },
    { id: 6, code: '    return hs' },
  ],
  // id:1（h初期化）と id:2（hs初期化）はどちらが先でも可（互いに独立）
  // id:3（forループ）は h と hs 両方に依存
  partialOrder: [
    [0, 1], [0, 2],         // h と hs の初期化はどちらが先でも可
    [1, 3], [2, 3],         // for ループは h と hs 両方の初期化後
    [3, 4], [4, 5], [5, 6], // ループ内: 計算 → append → return
  ],
  hints: [
    'まず初期隠れ状態 h = np.zeros(b.shape) と空リスト hs = [] を初期化する（順不同）',
    'for x in xs: で各タイムステップを処理し h = np.tanh(Wx @ x + Wh @ h + b) で隠れ状態を更新する',
    'hs.append(h) で各ステップの h を記録し、最後に hs を返す',
  ],
  explanation: {
    summary: 'Elman RNN は h_t = tanh(Wx x_t + Wh h_{t-1} + b) という漸化式で系列を処理します。各ステップで前の隠れ状態を参照することで過去の情報を保持します。ただし長期依存関係（遠い過去の情報）は勾配消失により学習が困難で、LSTM や GRU がその改善版です。',
    points: [
      'h_t = tanh(Wx x_t + Wh h_{t-1} + b)。tanh は (-1, 1) に値を押し込む活性化関数',
      '初期隠れ状態 h_{-1} はゼロベクトル（何も記憶がない状態）',
      'Wx: 入力を隠れ状態次元に変換。Wh: 前の隠れ状態から現在の隠れ状態への変換',
      '長期依存問題（Long-term dependency）: 系列が長いと初期の情報が消えてしまう → LSTM・GRU で対処',
    ],
    complexity: { time: 'O(T · d_h · (d_x + d_h))（T=系列長, d_h=隠れ次元, d_x=入力次元）', space: 'O(T · d_h)' },
    tip: 'PyTorch では nn.RNN(input_size, hidden_size) で利用できます。系列全体を一括で渡せる実装になっており、for ループは内部で並列化されています。',
  },
});
