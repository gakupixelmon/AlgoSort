// dl_033: Q-learning 更新式 (Python) ★3
// TD 誤差を使って行動価値 Q(s, a) を更新する
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_033',
  title: 'Q-learning の価値更新',
  category: 'applied',
  categoryLabel: '応用',
  difficulty: 3,
  language: 'python',
  description: "【強化学習とは】\n強化学習では、エージェントが環境の中で行動し、報酬を受け取りながら、将来得られる報酬の合計を最大化する方策を学びます。教師あり学習のように各入力に正解ラベルがあるのではなく、行動の結果として得られる報酬から試行錯誤します。\n\n【Q-learning とは】\nQ-learning は、状態 s で行動 a を選んだときの将来報酬の期待値 $Q(s, a)$ を学習する代表的な手法です。遷移 $(s, a, r, s')$ を観測したとき、TD target $r + \\gamma \\max_{a'} Q(s', a')$ に近づけるよう Q 値を更新します。\n\nNumPy を使って、Q テーブルの1要素を更新してください。次状態が終端なら、将来価値は0として扱います。",
  inputFormat: {
    params: [
      { name: 'q_table', type: 'np.ndarray', desc: 'Q値テーブル（shape: [num_states, num_actions]）' },
      { name: 'state', type: 'int', desc: '現在状態 s' },
      { name: 'action', type: 'int', desc: '選択した行動 a' },
      { name: 'reward', type: 'float', desc: '得た即時報酬 r' },
      { name: 'next_state', type: 'int', desc: '遷移先の状態 s\'' },
      { name: 'done', type: 'bool', desc: '遷移先が終端状態かどうか' },
      { name: 'alpha', type: 'float', desc: '学習率' },
      { name: 'gamma', type: 'float', desc: '割引率' },
    ],
    note: '戻り値: None（q_table を直接更新）\nピン留め: import numpy as np',
    examples: [{
      input: 'q_table = np.array([[1.0, 2.0], [3.0, 4.0]])\nstate=0, action=0, reward=5.0, next_state=1\ndone=False, alpha=0.5, gamma=0.9',
      output: 'q_table[0, 0] = 4.8',
      explanation: 'target は 5 + 0.9 * max(3, 4) = 8.6。古い値1.0を半分だけ target に近づけるので 1 + 0.5 * (8.6 - 1) = 4.8 です。'
    }],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def q_learning_update(q_table, state, action, reward, next_state, done, alpha, gamma):' },
    { id: 1, code: '    current_q = q_table[state, action]' },
    { id: 2, code: '    next_value = 0.0 if done else np.max(q_table[next_state])' },
    { id: 3, code: '    target = reward + gamma * next_value' },
    { id: 4, code: '    td_error = target - current_q' },
    { id: 5, code: '    q_table[state, action] = current_q + alpha * td_error' },
  ],
  partialOrder: [[0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [4, 5]],
  hints: [
    'current_q は、今回更新する Q(s, a) の古い値です',
    '終端状態なら次状態から報酬を得ることはないので、next_value は0です',
    '終端でなければ、Q(s\', a\') の最大値を次状態の価値として使います',
    'TD 誤差は target - current_q です。学習率 alpha の分だけ古い値を target に近づけます',
  ],
  explanation: {
    summary: 'Q-learning は、観測した1ステップの報酬と次状態の最大 Q 値から TD target を作り、Q(s, a) を少しずつ更新するモデルフリー強化学習手法です。',
    points: [
      'Q(s, a) は、その状態でその行動を選び、その後も良い行動を続けた場合の割引収益の期待値',
      'max Q(s\', a\') を使うため、実際に次に選んだ行動とは独立に最適方策へ近づく off-policy な更新になる',
      'gamma が小さいほど直近の報酬を重視し、1に近いほど将来の報酬を重視する',
      '表形式の Q-learning は状態数が少ないときに有効で、大きな状態空間では Q テーブルをニューラルネットワークに置き換えた DQN が使われる',
    ],
    complexity: { time: 'O(num_actions)', space: 'O(1)' },
    tip: '学習時には、greedy な最大 Q 行動だけでなく、確率 epsilon でランダム行動を選ぶ epsilon-greedy 方策を使い、未知の行動も探索します。',
  },
});
