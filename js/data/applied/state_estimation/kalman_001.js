// kalman_001: 1次元カルマンフィルタ ★3 (Python)
// 予測と観測更新を交互に行い、ノイズを含む観測から状態を推定する
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'kalman_001',
  title: '1次元カルマンフィルタ',
  category: 'applied',
  categoryLabel: '応用',
  difficulty: 3,
  language: 'python',
  description: '【カルマンフィルタとは】\nカルマンフィルタは、ノイズを含む観測値から、対象の本当の状態を逐次推定するアルゴリズムです。ロボットの位置推定、GPS と慣性センサの統合、時系列データの平滑化などで使われます。\n\n1次元の状態推定を考えます。前時刻の状態推定値 $x$ と不確かさ $P$、観測値 $z$、状態遷移係数 $A$、観測係数 $H$、プロセスノイズ分散 $Q$、観測ノイズ分散 $R$ が与えられます。1ステップの予測と観測更新を行い、更新後の $(x, P)$ を返してください。\n\n予測: $x^- = Ax$, $P^- = APA + Q$\n更新: $K = P^-H / (HP^-H + R)$, $x = x^- + K(z - Hx^-)$, $P = (1-KH)P^-$',
  inputFormat: {
    params: [
      { name: 'x, P', type: 'float', desc: '前時刻の状態推定値と推定誤差分散' },
      { name: 'z', type: 'float', desc: '今回の観測値' },
      { name: 'A, H', type: 'float', desc: '状態遷移係数と観測係数' },
      { name: 'Q, R', type: 'float', desc: 'プロセスノイズ分散と観測ノイズ分散' },
    ],
    note: '戻り値: tuple[float, float]（更新後の状態推定値 x と誤差分散 P）\n制約: P, Q, R > 0',
    examples: [
      {
        input: 'x = 0.0, P = 1.0, z = 10.0, A = 1.0, H = 1.0, Q = 0.0, R = 1.0',
        output: '(5.0, 0.5)',
        explanation: '予測値は 0、カルマンゲインは 1 / (1 + 1) = 0.5 です。観測値との中間へ更新され、不確かさも 0.5 に減ります。',
      },
    ],
  },
  pinnedCode: [],
  blocks: [
    { id: 0, code: 'def kalman_step(x, P, z, A, H, Q, R):' },
    { id: 1, code: '    x_pred = A * x' },
    { id: 2, code: '    P_pred = A * P * A + Q' },
    { id: 3, code: '    innovation = z - H * x_pred' },
    { id: 4, code: '    innovation_var = H * P_pred * H + R' },
    { id: 5, code: '    K = P_pred * H / innovation_var' },
    { id: 6, code: '    x_new = x_pred + K * innovation' },
    { id: 7, code: '    P_new = (1 - K * H) * P_pred' },
    { id: 8, code: '    return x_new, P_new' },
  ],
  partialOrder: [
    [0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5],
    [1, 6], [5, 6], [2, 7], [5, 7], [6, 8], [7, 8],
  ],
  hints: [
    'まずモデルだけを使い、状態の予測値 x_pred と不確かさ P_pred を計算します。',
    'innovation は観測値と予測した観測値の差、innovation_var はその差の不確かさです。',
    'カルマンゲイン K は、予測と観測のどちらをどれだけ信頼するかを決める重みです。',
    '状態と不確かさは、どちらも予測値ではなく更新後の値を返します。',
  ],
  explanation: {
    summary: 'カルマンフィルタは、モデルによる予測とノイズを含む観測を、その不確かさに応じて統合する逐次推定法です。',
    points: [
      '予測ステップでは、状態遷移 A で状態を進め、プロセスノイズ Q を加えて不確かさを増やす',
      'innovation は観測と予測のずれであり、カルマンゲイン K を掛けて状態を補正する',
      '観測ノイズ R が大きいほど K は小さくなり、観測値を強く信頼しない更新になる',
      '更新後の P は通常小さくなり、観測を得たことで状態への確信が増したことを表す',
    ],
    complexity: { time: 'O(1)', space: 'O(1)' },
    tip: '多次元版では x をベクトル、P を共分散行列に置き換えます。数値計算では P の対称性・半正定値性を保つ Joseph form の更新式もよく使われます。',
  },
});
