// dl_023: 知識蒸留（Knowledge Distillation）損失 (Python) ★3
// 大きな教師モデルの「軟らかい確率分布」から小さな生徒モデルを学習させる
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_023',
  title: '知識蒸留（Knowledge Distillation）損失',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 3,
  language: 'python',
  description: '【知識蒸留とは】\n知識蒸留（Knowledge Distillation）は、大きな「教師モデル（Teacher）」の知識を、小さな「生徒モデル（Student）」に転移させる手法です。Hinton et al. (2015) によって提案されました。\n\n通常の学習では正解ラベル（ハードラベル）だけを使いますが、教師モデルの出力確率分布（ソフトラベル）には「このネコ画像はイヌにも少し似ている」といった豊かな情報が含まれています。生徒モデルはこのソフトラベルを学ぶことで、少ないデータでも高い精度を達成できます。\n\n【温度パラメータ $T$】\n確率分布を「柔らかく」するために温度 $T$ でロジットを割り、ソフトマックスを適用します：\n$p_i^{(T)} = \\frac{\\exp(z_i / T)}{\\sum_j \\exp(z_j / T)}$\n$T > 1$ で確率分布がなめらかになり、クラス間の相対的な情報が失われにくくなります。\n\n【蒸留損失】\n蒸留損失 $\\mathcal{L}_{\\text{distill}}$ は教師と生徒のソフト出力間の KL ダイバージェンス（温度 $T^2$ でスケール）で計算します：\n$\\mathcal{L}_{\\text{distill}} = T^2 \\cdot \\text{KL}(p^{\\text{teacher}}_T \\| p^{\\text{student}}_T)$\n\n最終損失は蒸留損失と通常の交差エントロピー損失の加重平均とします：\n$\\mathcal{L} = \\alpha \\cdot \\mathcal{L}_{\\text{distill}} + (1 - \\alpha) \\cdot \\mathcal{L}_{\\text{CE}}$\n\n以下の2つの関数を実装せよ：\n1. softmax_with_temperature(logits, T): 温度付きソフトマックス\n2. distillation_loss(student_logits, teacher_logits, labels, T, alpha): 蒸留損失の計算',
  inputFormat: {
    params: [
      { name: 'student_logits', type: 'np.ndarray', desc: '生徒モデルのロジット [batch, num_classes]' },
      { name: 'teacher_logits', type: 'np.ndarray', desc: '教師モデルのロジット [batch, num_classes]' },
      { name: 'labels', type: 'np.ndarray', desc: '正解ラベル（整数インデックス）[batch]' },
      { name: 'T', type: 'float', desc: '温度パラメータ（通常 2〜10）' },
      { name: 'alpha', type: 'float', desc: '蒸留損失の重み（0〜1）' },
    ],
    note: 'softmax_with_temperature(logits, T) 戻り値: np.ndarray（ソフト確率分布）\ndistillation_loss(student_logits, teacher_logits, labels, T, alpha) 戻り値: float（スカラー損失）\nピン留め: import numpy as np',
    examples: [
      {
        input: 'student_logits = np.array([[2.0, 1.0, 0.1]])\nteacher_logits = np.array([[2.0, 1.0, 0.1]])\nlabels = np.array([0])\nT=2.0, alpha=0.5',
        output: 'distillation_loss ≈ 0.0（教師と生徒が同じロジットの場合、KL=0）',
        explanation: '教師と生徒のロジットが完全に一致する場合、KLダイバージェンスは0になります。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def softmax_with_temperature(logits, T):' },
    { id: 1, code: '    shifted = logits - np.max(logits, axis=-1, keepdims=True)' },
    { id: 2, code: '    exp_l = np.exp(shifted / T)' },
    { id: 3, code: '    return exp_l / np.sum(exp_l, axis=-1, keepdims=True)' },
    { id: 4, code: 'def distillation_loss(student_logits, teacher_logits, labels, T, alpha):' },
    { id: 5, code: '    p_teacher = softmax_with_temperature(teacher_logits, T)' },
    { id: 6, code: '    p_student = softmax_with_temperature(student_logits, T)' },
    { id: 7, code: '    kl = np.sum(p_teacher * np.log(p_teacher / (p_student + 1e-9) + 1e-9), axis=-1)' },
    { id: 8, code: '    loss_distill = T**2 * np.mean(kl)' },
    { id: 9, code: '    p_student_hard = softmax_with_temperature(student_logits, 1.0)' },
    { id: 10, code: '    batch_idx = np.arange(len(labels))' },
    { id: 11, code: '    loss_ce = -np.mean(np.log(p_student_hard[batch_idx, labels] + 1e-9))' },
    { id: 12, code: '    return alpha * loss_distill + (1 - alpha) * loss_ce' },
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3],
    [4, 5], [4, 6],
    [5, 7], [6, 7],
    [7, 8],
    [4, 9], [9, 10], [10, 11],
    [8, 12], [11, 12],
  ],
  hints: [
    'softmax_with_temperature では、ロジットを T で割ってからソフトマックスを計算する。数値安定化のため max を引いてから exp を取る',
    '蒸留損失は KL(p_teacher || p_student) = Σ p_teacher * log(p_teacher / p_student) を各サンプルについて計算し、T² を掛けたバッチ平均',
    '通常の交差エントロピー損失は T=1.0 のソフトマックスを使い、-log(正解クラスの確率) のバッチ平均',
    '最終損失は alpha * loss_distill + (1 - alpha) * loss_ce の線形結合',
  ],
  explanation: {
    summary: '知識蒸留は、教師モデルのソフト出力（確率分布）を「軟らかいラベル」として生徒モデルに学習させます。温度 $T$ で分布を滑らかにすることで、クラス間の類似性情報（例：「8は3よりも1に似ている」）が保持されます。',
    points: [
      '温度パラメータ $T$ の効果: $T=1$ は通常のソフトマックス。$T$ を大きくするほど確率分布が一様に近づき、教師の「どのクラスに近いか」という細かい情報が生徒に伝わりやすくなる',
      '$T^2$ のスケーリング: バックプロパゲーション時に $1/T$ が2回かかるため、勾配の大きさを補正する目的で $T^2$ を掛ける（Hinton et al. 2015）',
      '圧縮・高速化: 大規模モデル（BERT, GPT等）を小型モデルに蒸留することで、推論コストを大幅に削減できる（例: DistilBERT は BERTの97%の性能を40%のパラメータで達成）',
      'データ拡張的側面: 正解ラベルだけでは提供できない「クラス間の相関」という追加情報が含まれており、少ないデータでも正則化効果をもたらす',
    ],
    complexity: { time: 'O(batch \\cdot num\\_classes)', space: 'O(batch \\cdot num\\_classes)' },
    tip: '実用上、$T$ は 2〜10 の範囲で選ぶことが多く、$\\alpha$ は 0.5〜0.9 程度が一般的です。近年では「中間層の特徴マップ」を蒸留する Feature-based Distillation や、Attention Map を蒸留する手法（TinyBERT等）も広く使われています。',
  }
});
