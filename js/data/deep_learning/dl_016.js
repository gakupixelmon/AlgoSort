// dl_016: GRU（Gated Recurrent Unit）順伝播 (Python) ★4
// リセットゲートと更新ゲートの2ゲートで LSTM を簡略化した RNN の実装
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_016',
  title: 'GRU（Gated Recurrent Unit）の順伝播',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 4,
  language: 'python',
  description: '【GRUとは】Cho et al. (2014) が提案した LSTM の簡略版 RNN です。LSTM の 4 ゲート（忘却・入力・出力・セル候補）を 2 ゲート（リセット・更新）に統合し、セル状態と隠れ状態を 1 本のベクトルにまとめます。パラメータ数が少なく学習が速い一方、多くのタスクで LSTM に匹敵する性能を発揮します。\n\nGRU の 1 ステップ順伝播を実装せよ。入力 x と前ステップの隠れ状態 h_prev から、2 つのゲートと候補隠れ状態を計算し、新しい隠れ状態 h を返すこと。',
  inputFormat: {
    params: [
      { name: 'x',      type: 'np.ndarray', desc: '現ステップの入力（shape: [input_size]）' },
      { name: 'h_prev', type: 'np.ndarray', desc: '前ステップの隠れ状態（shape: [hidden_size]）' },
      { name: 'Wz',     type: 'np.ndarray', desc: '更新ゲートの重み（shape: [hidden_size, input_size+hidden_size]）' },
      { name: 'Wr',     type: 'np.ndarray', desc: 'リセットゲートの重み（同 shape）' },
      { name: 'Wh',     type: 'np.ndarray', desc: '候補隠れ状態の重み（同 shape）' },
      { name: 'bz',     type: 'np.ndarray', desc: '更新ゲートのバイアス（shape: [hidden_size]）' },
      { name: 'br',     type: 'np.ndarray', desc: 'リセットゲートのバイアス（同 shape）' },
      { name: 'bh',     type: 'np.ndarray', desc: '候補隠れ状態のバイアス（同 shape）' },
    ],
    note: '戻り値: h（新しい隠れ状態, shape: [hidden_size]）\n活性化関数: sigmoid(z) = 1 / (1 + np.exp(-z))、候補状態は np.tanh\nピン留め: import numpy as np',
    examples: [
      {
        input: 'hidden_size=2, input_size=2\nx=[1,0], h_prev=[0,0], 全重み=単位行列, 全バイアス=0',
        output: 'h ≈ [0.231, 0.0]',
        explanation: 'z≈sigmoid(1)≈0.731, r≈sigmoid(1)≈0.731, h_cand≈tanh(r*0)=tanh(x+r*h_prev)≈tanh(1)≈0.762。h=(1-z)*h_prev+z*h_cand≈(1-0.731)*0+0.731*0.762≈0.557'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def gru_step(x, h_prev, Wz, Wr, Wh, bz, br, bh):' },
    { id: 1, code: '    xh = np.concatenate([x, h_prev])' },
    { id: 2, code: '    z = 1 / (1 + np.exp(-(Wz @ xh + bz)))' },
    { id: 3, code: '    r = 1 / (1 + np.exp(-(Wr @ xh + br)))' },
    { id: 4, code: '    xrh = np.concatenate([x, r * h_prev])' },
    { id: 5, code: '    h_cand = np.tanh(Wh @ xrh + bh)' },
    { id: 6, code: '    h = (1 - z) * h_prev + z * h_cand' },
    { id: 7, code: '    return h' },
  ],
  // id:1（xh）: x と h_prev の結合 → z と r の計算に必要
  // id:2（z）, id:3（r）: xh に依存（互いに独立）
  // id:4（xrh）: r に依存（リセットゲートで h_prev をマスク）
  // id:5（h_cand）: xrh に依存
  // id:6（h）: z と h_cand と h_prev に依存
  partialOrder: [
    [0, 1],           // 関数定義 → xh
    [1, 2], [1, 3],   // xh → z, r（互いに独立）
    [3, 4],           // r → xrh（リセットで h_prev をマスク）
    [1, 4],           // xrh にも x が必要（xh 経由で x が揃っている）
    [4, 5],           // xrh → h_cand
    [2, 6], [5, 6],   // z と h_cand → h
    [6, 7],           // h → return
  ],
  hints: [
    '最初に x と h_prev を連結して xh を作る。更新ゲート z とリセットゲート r は両方とも xh を入力とし、sigmoid で活性化する',
    'リセットゲート r は h_prev に掛けて「過去の記憶をどれだけ忘れるか」を制御する。r * h_prev を x と連結した xrh が候補隠れ状態の入力になる',
    '最終更新式 h = (1-z) * h_prev + z * h_cand: 更新ゲート z が大きいほど新しい候補状態を多く採用し、小さいほど過去の状態を保持する',
  ],
  explanation: {
    summary: 'GRU は LSTM の「セル状態と隠れ状態の 2 本立て + 4 ゲート」を「隠れ状態 1 本 + 2 ゲート」に簡略化します。リセットゲート r が短期記憶、更新ゲート z が長期記憶の制御を担当し、LSTM と同等の表現力を少ないパラメータで実現します。',
    points: [
      '更新ゲート z（update gate）: h_prev をどれだけ保持し、候補状態をどれだけ採用するかを [0,1] で制御',
      'リセットゲート r（reset gate）: 候補状態の計算時に h_prev をどれだけ利用するかを制御。r≈0 なら過去を無視して新しい入力だけで候補を作る',
      '候補隠れ状態 h_cand: r で「リセット済み」の h_prev を使って計算。過去の影響を選択的に受ける',
      '更新式 h=(1-z)*h_prev + z*h_cand は LSTM の「忘却ゲート×過去 + 入力ゲート×候補」に対応する',
    ],
    complexity: { time: 'O(d_h · (d_x + d_h))（d_h=隠れ次元, d_x=入力次元）', space: 'O(d_h)' },
    tip: 'GRU と LSTM の主な実用上の違い: GRU はパラメータが約 25% 少なく学習が速い。短いシーケンス・データ量が少ない場合は GRU が有利なことが多い。PyTorch では nn.GRU(input_size, hidden_size) で利用可能で、出力は h_n のみ（c_n がない点が LSTM と異なる）。',
  },
});
