// dl_015: LSTM（Long Short-Term Memory）順伝播 (Python) ★5
// ゲート機構（入力・忘却・出力・セル候補）を使った1ステップの実装
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_015',
  title: 'LSTM の順伝播（1ステップ）',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 5,
  language: 'python',
  description: '【LSTMとは】RNN が苦手とする「勾配消失」を克服するために考案されたゲート付き再帰型ネットワークです。セル状態（長期記憶）と隠れ状態（短期記憶）の2本のベクトルを持ち、4種類のゲート（入力・忘却・出力・セル候補）で情報の取捨選択を学習します。\n\nLSTM の1ステップ順伝播を実装せよ。入力 x（shape: [input_size]）と前ステップの隠れ状態 h_prev（shape: [hidden_size]）・セル状態 c_prev（shape: [hidden_size]）を受け取り、新しい隠れ状態 h と セル状態 c を返す。\n各ゲートは z = W @ concat(x, h_prev) + b で線形変換した後、sigmoid または tanh で活性化する。',
  inputFormat: {
    params: [
      { name: 'x', type: 'np.ndarray', desc: '現ステップの入力（shape: [input_size]）' },
      { name: 'h_prev', type: 'np.ndarray', desc: '前ステップの隠れ状態（shape: [hidden_size]）' },
      { name: 'c_prev', type: 'np.ndarray', desc: '前ステップのセル状態（shape: [hidden_size]）' },
      { name: 'Wf', type: 'np.ndarray', desc: '忘却ゲートの重み（shape: [hidden_size, input_size+hidden_size]）' },
      { name: 'Wi', type: 'np.ndarray', desc: '入力ゲートの重み（同shape）' },
      { name: 'Wc', type: 'np.ndarray', desc: 'セル候補の重み（同shape）' },
      { name: 'Wo', type: 'np.ndarray', desc: '出力ゲートの重み（同shape）' },
      { name: 'bf', type: 'np.ndarray', desc: '忘却ゲートのバイアス（shape: [hidden_size]）' },
      { name: 'bi', type: 'np.ndarray', desc: '入力ゲートのバイアス（同shape）' },
      { name: 'bc', type: 'np.ndarray', desc: 'セル候補のバイアス（同shape）' },
      { name: 'bo', type: 'np.ndarray', desc: '出力ゲートのバイアス（同shape）' },
    ],
    note: '戻り値: tuple(h, c)（新しい隠れ状態と新しいセル状態）\n活性化関数: sigmoid(z) = 1 / (1 + np.exp(-z))、tanh は np.tanh を使用\nピン留め: import numpy as np',
    examples: [
      {
        input: '全ての重みを単位行列・バイアスをゼロで初期化（hidden_size=2, input_size=2）\nx = np.array([1.0, 0.0])、h_prev = c_prev = np.zeros(2)',
        output: 'h ≈ array([0.376, 0.0])、c ≈ array([0.462, 0.0])',
        explanation: '各ゲートは sigmoid(1.0), sigmoid(1.0), tanh(1.0), sigmoid(1.0) の値を計算。セル状態 c = f⊙c_prev + i⊙g、隠れ状態 h = o⊙tanh(c) で更新されます。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def lstm_step(x, h_prev, c_prev, Wf, Wi, Wc, Wo, bf, bi, bc, bo):' },
    { id: 1, code: '    xh = np.concatenate([x, h_prev])' },
    { id: 2, code: '    f = 1 / (1 + np.exp(-(Wf @ xh + bf)))' },
    { id: 3, code: '    i = 1 / (1 + np.exp(-(Wi @ xh + bi)))' },
    { id: 4, code: '    g = np.tanh(Wc @ xh + bc)' },
    { id: 5, code: '    o = 1 / (1 + np.exp(-(Wo @ xh + bo)))' },
    { id: 6, code: '    c = f * c_prev + i * g' },
    { id: 7, code: '    h = o * np.tanh(c)' },
    { id: 8, code: '    return h, c' },
  ],
  // id:1（xh）は全ゲートの前提
  // id:2〜5（f, i, g, o）は xh さえあれば互いに独立
  // id:6（c）は f, i, g に依存
  // id:7（h）は o と c に依存
  partialOrder: [
    [0, 1],                         // xh の計算が最初
    [1, 2], [1, 3], [1, 4], [1, 5], // 4ゲートは xh に依存（互いに独立）
    [2, 6], [3, 6], [4, 6],         // c = f*c_prev + i*g
    [5, 7], [6, 7],                 // h = o*tanh(c)
    [7, 8],                         // return
  ],
  hints: [
    'まず x と h_prev を連結して xh = np.concatenate([x, h_prev]) を作る。4ゲートは全てこの xh を入力とする',
    '忘却ゲート f・入力ゲート i・出力ゲート o は sigmoid（= 1/(1+exp(-z))）で活性化。セル候補 g は np.tanh で活性化',
    'セル状態 c = f * c_prev + i * g（忘却 + 書き込み）。隠れ状態 h = o * np.tanh(c)（読み出し）で更新し (h, c) を返す',
  ],
  explanation: {
    summary: 'LSTMの核心は「ゲートによる情報の取捨選択」です。忘却ゲート f で過去の記憶を削除し、入力ゲート i で新しい情報を書き込み、出力ゲート o で現在の記憶から読み出します。この仕組みにより、長期依存関係を学習できます。',
    points: [
      '忘却ゲート f: どれだけ過去の記憶（c_prev）を残すかを [0,1] で制御',
      '入力ゲート i × セル候補 g: どの新しい情報をどれだけ書き込むかを制御',
      '出力ゲート o: セル状態のどの部分を隠れ状態として出力するかを制御',
      'セル状態 c が「長期記憶」、隠れ状態 h が「短期記憶・出力」の役割を担う',
    ],
    complexity: { time: 'O(d_h · (d_x + d_h))（d_h=隠れ次元, d_x=入力次元）', space: 'O(d_h)' },
    tip: 'PyTorch では nn.LSTM(input_size, hidden_size) で利用できます。(h_n, c_n) の2つのテンソルが返る点がRNNとの大きな違いです。GRU は忘却・入力ゲートを統合して2ゲートに簡略化したLSTMの変種です。',
  },
});
