// ahc_002: 焼きなまし法の遷移受理 ★4 (C++)
// 悪化する遷移も温度に応じて受理し、局所最適から抜け出す
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'ahc_002',
  title: '焼きなまし法の遷移受理',
  category: 'heuristic',
  categoryLabel: 'AtCoder ヒューリスティック',
  difficulty: 4,
  language: 'cpp',
  description: '【焼きなまし法とは】\n焼きなまし法（Simulated Annealing）は、近傍解が悪化する場合も温度に応じて確率的に受理する局所探索です。探索の初期は悪化遷移も受理しやすくして局所最適から抜け出し、終盤では温度を下げて良い解へ収束させます。\n\n【問題】\n大きいスコアほど良い最大化問題を考えます。現在のスコア currentScore、近傍解のスコア candidateScore、温度 temperature が与えられたとき、候補を受理するか判定する関数を実装してください。改善なら必ず受理し、悪化なら exp((candidateScore - currentScore) / temperature) の確率で受理します。',
  inputFormat: {
    params: [
      { name: 'currentScore', type: 'double', desc: '現在解のスコア（大きいほど良い）' },
      { name: 'candidateScore', type: 'double', desc: '近傍解のスコア' },
      { name: 'temperature', type: 'double', desc: '正の温度パラメータ' },
      { name: 'rng', type: 'mt19937&', desc: '乱数生成器' },
    ],
    note: '戻り値: bool（候補を採用するなら true）\n温度は正とする',
    examples: [
      {
        input: 'currentScore = 100, candidateScore = 105, temperature = 10',
        output: 'true',
        explanation: '改善する候補なので、乱数によらず必ず受理します。'
      },
      {
        input: 'currentScore = 100, candidateScore = 90, temperature = 100',
        output: '確率 exp(-0.1) で true',
        explanation: '温度が高いほど悪化遷移を受理しやすく、探索の多様性を保てます。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0, code: 'bool acceptMove(double currentScore, double candidateScore, double temperature, mt19937& rng) {' },
    { id: 1, code: '    double delta = candidateScore - currentScore;' },
    { id: 2, code: '    if (delta >= 0.0) return true;' },
    { id: 3, code: '    double probability = exp(delta / temperature);' },
    { id: 4, code: '    uniform_real_distribution<double> uniform(0.0, 1.0);' },
    { id: 5, code: '    return uniform(rng) < probability;' },
    { id: 6, code: '}' },
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [2, 4], [3, 5], [4, 5], [5, 6],
  ],
  hints: [
    'candidateScore - currentScore を delta とします。最大化問題では delta が正なら改善です',
    '改善する遷移は常に受理します',
    '悪化する遷移では delta は負なので、exp(delta / temperature) は0から1の間になります',
    '0以上1未満の一様乱数が受理確率より小さいときに候補を採用します',
  ],
  explanation: {
    summary: '焼きなまし法は、悪い遷移も確率的に受理して局所最適から脱出する探索手法です。温度を徐々に下げることで、探索から収束へ移行します。',
    points: [
      '最大化問題では delta = candidateScore - currentScore と置く。改善なら delta >= 0 なので必ず受理する',
      '悪化の大きさが小さいほど、exp(delta / temperature) は大きくなり受理されやすい',
      '同じ悪化でも温度が高いほど受理確率は高く、温度が低い終盤では悪化をほとんど受理しない',
      '実際の AHC では制限時間に合わせて温度を連続的に下げ、近傍生成・差分計算と組み合わせる',
    ],
    complexity: { time: 'O(1)', space: 'O(1)' },
    tip: 'スコアが小さいほど良い最小化問題では、delta の符号を逆にするか、exp((currentScore - candidateScore) / temperature) を使います。',
  },
});
