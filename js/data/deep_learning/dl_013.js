// dl_013: Cosine Annealing 学習率スケジューラ (Python) ★3
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_013',
  title: 'Cosine Annealing 学習率スケジューラ',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 3,
  language: 'python',
  description: '【学習率スケジューラとは】ニューラルネットワークの学習では、最初は大きな学習率で素早く収束させ、後半は小さな学習率で精度を詰めるのが効果的です。Cosine Annealing は学習率をコサイン関数に沿ってなめらかに減衰させるスケジューラです。リスタート（SGDR）と組み合わせることも多く、現代の大規模学習でよく使われています。\n\n【数学的背景：なぜ Cosine 曲線を用いるのか？】\n**Definition (Cosine Annealing):**\n総ステップ数を $T_{max}$、現在のステップを $t \in [0, T_{max}]$ とし、最大・最小学習率を $\eta_{max}, \eta_{min}$ とする。ステップ $t$ における学習率 $\eta(t)$ を以下のように定義する。\n\n$\eta(t) = \eta_{min} + \frac{1}{2}(\eta_{max} - \eta_{min})\left(1 + \cos\left(\frac{\pi t}{T_{max}}\right)\right)$\n\n**Theorem:**\n学習率の減衰率（微分係数）$\frac{d\eta(t)}{dt}$ は、$t=0$ および $t=T_{max}$ の近傍で $0$ に近づき、$t=\frac{T_{max}}{2}$ で最大（絶対値）となる。\n\n**Proof:**\n$\eta(t)$ を $t$ で微分すると以下のようになる。\n$\frac{d\eta(t)}{dt} = -\frac{\pi}{2 T_{max}}(\eta_{max} - \eta_{min}) \sin\left(\frac{\pi t}{T_{max}}\right)$\n$t=0$ および $t=T_{max}$ のとき、$\sin(0) = \sin(\pi) = 0$ となり、変化率は0である。一方、$t=\frac{T_{max}}{2}$ のとき、$\sin\left(\frac{\pi}{2}\right) = 1$ となり、変化率は絶対値で最大となる。 $\blacksquare$\n\n**Conclusion:**\n学習初期 ($t \approx 0$) は学習率の減少が緩やかであり、高い学習率を維持することで、損失関数の鋭く浅い局所最適解 (Sharp Minima) を脱出し、平坦で汎化性能の高い最適解 (Flat Minima) の領域を探索できる。学習終盤 ($t \approx T_{max}$) でも減少が緩やかになり、小さな学習率で安定して最適解の谷底へ収束 (Fine-tuning) させることが可能になる。線形減衰と比較して、探索と収束のフェーズがより明確に分離されるという数理的利点がある。\n\nCosine Annealing の学習率スケジュールを実装せよ。ステップ t における学習率を lr(t) = lr_min + (lr_max - lr_min) / 2 * (1 + cos(π * t / T_max)) で計算する関数と、全ステップ分の学習率リストを生成する関数を実装する。',
  inputFormat: {
    params: [
      { name: 'lr_max', type: 'float', desc: '最大学習率（初期学習率）' },
      { name: 'lr_min', type: 'float', desc: '最小学習率（終端学習率）' },
      { name: 'T_max', type: 'int', desc: '半周期のステップ数（この期間で lr_max → lr_min に減衰）' },
    ],
    note: 'cosine_lr(t, lr_max, lr_min, T_max) 戻り値: float（ステップ t の学習率）\nget_schedule(lr_max, lr_min, T_max) 戻り値: list[float]（ステップ 0 から T_max までの学習率リスト）\nピン留め: import numpy as np',
    examples: [
      {
        input: 'lr_max=0.1, lr_min=0.0, T_max=10\ncosine_lr(0, 0.1, 0.0, 10)\ncosine_lr(5, 0.1, 0.0, 10)\ncosine_lr(10, 0.1, 0.0, 10)',
        output: '0.1, 0.05, 0.0',
        explanation: 't=0 で最大値0.1、t=T_max/2=5 で中間値0.05、t=T_max=10 で最小値0.0になります。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def cosine_lr(t, lr_max, lr_min, T_max):' },
    { id: 1, code: '    return lr_min + (lr_max - lr_min) / 2 * (1 + np.cos(np.pi * t / T_max))' },
    { id: 2, code: 'def get_schedule(lr_max, lr_min, T_max):' },
    { id: 3, code: '    return [cosine_lr(t, lr_max, lr_min, T_max) for t in range(T_max + 1)]' },
  ],
  // id:0→id:1（関数定義と本体）は固定。id:2→id:3も固定。
  // id:1→id:2 も固定（get_schedule が cosine_lr を呼ぶため、cosine_lr が先に定義される必要がある）
  partialOrder: [
    [0, 1], [1, 2], [2, 3],
  ],
  hints: [
    'cosine_lr の公式は lr_min + (lr_max - lr_min) / 2 * (1 + cos(π * t / T_max))',
    'np.cos() と np.pi を使う。t=0 で cos(0)=1 → lr_max、t=T_max で cos(π)=-1 → lr_min',
    'get_schedule は range(T_max + 1) でステップ 0 から T_max まで cosine_lr を呼ぶリスト内包表現で実装する',
  ],
  explanation: {
    summary: 'Cosine Annealing は学習率を cos 曲線に沿ってなめらかに lr_max から lr_min まで減衰させます。急激な変化がなく学習が安定しやすい特性から、大規模モデルの訓練で広く採用されています。',
    points: [
      'lr(t) = lr_min + (lr_max - lr_min)/2 * (1 + cos(πt/T_max)) が基本式',
      't=0: cos(0)=1 → lr = lr_min + (lr_max - lr_min) = lr_max',
      't=T_max: cos(π)=-1 → lr = lr_min + 0 = lr_min',
      'Warm Restart（SGDR）では T_max ごとにリセットして繰り返す。局所最小を脱出しやすい効果がある',
    ],
    complexity: { time: 'O(T_max)（スケジュール生成）', space: 'O(T_max)' },
    tip: 'PyTorch では torch.optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max) で使えます。Warm Restarts 版は CosineAnnealingWarmRestarts です。',
  },
});
