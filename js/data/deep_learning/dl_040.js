// dl_040: Linear Learning Rate Warmup (Python) ★2
// 学習開始直後の学習率を線形に増やして安定化する
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_040',
  title: 'Linear Learning Rate Warmup',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 2,
  language: 'python',
  description: '【Learning Rate Warmup とは】\n大きなモデルを学習し始めた直後は、パラメータも最適化器の内部状態も安定していません。最初から大きな学習率を使うと、更新が大きすぎて損失が発散することがあります。\n\nLearning Rate Warmup は、学習率を0付近から目標値まで少しずつ増やす手法です。Transformer の学習でもよく用いられます。\n\n現在ステップ step、warmup のステップ数 warmup_steps、目標学習率 base_lr が与えられたとき、線形 warmup 後の学習率を返す関数を実装してください。warmup 完了後は常に base_lr を返します。',
  inputFormat: {
    params: [
      { name: 'step', type: 'int', desc: '現在の学習ステップ（0以上）' },
      { name: 'warmup_steps', type: 'int', desc: 'warmup を行うステップ数（正）' },
      { name: 'base_lr', type: 'float', desc: 'warmup 後の目標学習率' },
    ],
    note: '戻り値: float（現在の学習率）',
    examples: [
      { input: 'step = 0, warmup_steps = 1000, base_lr = 0.001', output: '0.0', explanation: '開始時点では学習率を0にします。' },
      { input: 'step = 500, warmup_steps = 1000, base_lr = 0.001', output: '0.0005', explanation: 'warmup の半分なので、目標学習率の半分です。' },
      { input: 'step = 1500, warmup_steps = 1000, base_lr = 0.001', output: '0.001', explanation: 'warmup 完了後は目標学習率を維持します。' },
    ],
  },
  pinnedCode: [],
  blocks: [
    { id: 0, code: 'def linear_warmup_lr(step, warmup_steps, base_lr):' },
    { id: 1, code: '    if step >= warmup_steps:' },
    { id: 2, code: '        return base_lr' },
    { id: 3, code: '    scale = step / warmup_steps' },
    { id: 4, code: '    return base_lr * scale' },
  ],
  partialOrder: [[0, 1], [1, 2], [1, 3], [3, 4]],
  hints: [
    'step が warmup_steps 以上なら、warmup は完了しています',
    'warmup 中の進捗率は step / warmup_steps です',
    '目標学習率 base_lr に進捗率を掛けると、0から base_lr まで線形に増えます',
    'Python 3 では / が浮動小数点の除算になるため、明示的な型変換は不要です',
  ],
  explanation: {
    summary: 'Linear Warmup は、学習開始直後の学習率を0から目標値まで線形に増やし、最適化を安定させるスケジューリング手法です。',
    points: [
      'step=0 では学習率は0、step=warmup_steps では base_lr になる',
      'warmup 後は学習率を一定にしてもよいし、Cosine Annealing など別のスケジューラへ接続してもよい',
      '大きなバッチサイズや Adam 系オプティマイザを使う Transformer 学習で特に広く使われる',
      'warmup_steps が短すぎると安定化の効果が弱く、長すぎると十分な学習率に達するまで時間がかかる',
    ],
    complexity: { time: 'O(1)', space: 'O(1)' },
    tip: '実務では `warmup + cosine decay` のように組み合わせ、まず安全に学習率を上げてから徐々に下げる設定がよく使われます。',
  },
});
