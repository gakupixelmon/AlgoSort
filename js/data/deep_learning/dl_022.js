// dl_022: 変分オートエンコーダ（VAE）再パラメータ化トリック (Python) ★4
// 確率的サンプリングを微分可能にする「Reparameterization Trick」の実装
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_022',
  title: '変分オートエンコーダ（VAE）再パラメータ化トリック',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 4,
  language: 'python',
  description: '【VAEの再パラメータ化トリックとは】\nVAE（Variational Autoencoder）のエンコーダは、入力を潜在ベクトル $z$ の確率分布 $q_\\phi(z|x) = \\mathcal{N}(\\mu, \\sigma^2 I)$ に変換します。学習では $z \\sim q_\\phi(z|x)$ からサンプリングしますが、サンプリング操作は微分不可能なため勾配を逆伝播できません。\n\n【再パラメータ化トリック（Reparameterization Trick）】\nランダム性を「外部ノイズ」として分離することでこの問題を解決します：\n$z = \\mu + \\sigma \\odot \\varepsilon, \\quad \\varepsilon \\sim \\mathcal{N}(0, I)$\nこのように書くと、$\\mu$ と $\\sigma$（つまりエンコーダのパラメータ $\\phi$）に対して勾配を通すことができます。\n\n【KLダイバージェンス損失】\nVAEの損失は再構成損失 + KLダイバージェンスで構成されます。事前分布 $p(z) = \\mathcal{N}(0, I)$ との KL ダイバージェンスの解析解は：\n$D_{\\text{KL}}(\\mathcal{N}(\\mu, \\sigma^2) \\| \\mathcal{N}(0, 1)) = \\frac{1}{2}\\sum_j (\\sigma_j^2 + \\mu_j^2 - 1 - \\log \\sigma_j^2)$\n\n以下の2つの関数を実装せよ：\n1. reparameterize(mu, log_var): 再パラメータ化トリックで潜在変数 z をサンプリング\n2. kl_divergence(mu, log_var): 標準正規分布との KL ダイバージェンスを計算\n\n※ 実装では数値安定性のため $\\sigma$ ではなく $\\log \\sigma^2$（= log_var）を入力とする。',
  inputFormat: {
    params: [
      { name: 'mu', type: 'np.ndarray', desc: '平均ベクトル（shape: [batch, latent_dim]）' },
      { name: 'log_var', type: 'np.ndarray', desc: '対数分散ベクトル log(σ²)（shape: [batch, latent_dim]）' },
    ],
    note: 'reparameterize(mu, log_var) 戻り値: np.ndarray（shape: [batch, latent_dim]）\nkl_divergence(mu, log_var) 戻り値: float（バッチ平均のKLダイバージェンス）\nピン留め: import numpy as np',
    examples: [
      {
        input: 'mu = np.zeros((2, 3))\nlog_var = np.zeros((2, 3))  # σ² = e^0 = 1',
        output: 'reparameterize: shape (2, 3) の標準正規分布からのサンプル\nkl_divergence: 0.0（mu=0, σ²=1 は事前分布と一致するためKL=0）',
        explanation: 'μ=0, log_var=0（σ²=1）の場合、事前分布 N(0,I) と完全に一致するためKLは0になります。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def reparameterize(mu, log_var):' },
    { id: 1, code: '    std = np.exp(0.5 * log_var)' },
    { id: 2, code: '    eps = np.random.randn(*mu.shape)' },
    { id: 3, code: '    return mu + std * eps' },
    { id: 4, code: 'def kl_divergence(mu, log_var):' },
    { id: 5, code: '    kl = -0.5 * (1 + log_var - mu**2 - np.exp(log_var))' },
    { id: 6, code: '    return np.mean(np.sum(kl, axis=-1))' },
  ],
  partialOrder: [
    [0, 1], [0, 2],
    [1, 3], [2, 3],
    [4, 5], [5, 6],
  ],
  hints: [
    'reparameterize の第1ステップ: std = np.exp(0.5 * log_var) で σ = √(σ²) を求める（log_var = log(σ²) なので 0.5倍して exp を取る）',
    'reparameterize の第2ステップ: np.random.randn(*mu.shape) で標準正規分布のノイズ ε を生成し、mu + std * eps を返す',
    'kl_divergence では、解析解 -0.5 * (1 + log_var - mu² - exp(log_var)) を要素ごとに計算する',
    '各サンプルの潜在次元方向（axis=-1）で sum を取り、バッチ方向で mean を取る',
  ],
  explanation: {
    summary: '再パラメータ化トリックは「$z = \\mu + \\sigma \\odot \\varepsilon$」という変換により、確率的サンプリングを含む計算グラフを微分可能にします。KLダイバージェンスはエンコーダが過度に分散した分布を学習するのを防ぐ正則化として機能します。',
    points: [
      '微分可能性: $\\varepsilon \\sim \\mathcal{N}(0,I)$ は固定されたランダム変数として扱われ、パラメータ $\\mu, \\sigma$ への勾配が流れる',
      'log_var の利用: ニューラルネットワークの出力は任意の実数値を取れるが、分散は正でなければならない。$\\log \\sigma^2$ は全実数に値を取れるため扱いやすく、数値的にも安定する',
      'KLダイバージェンスの役割: 潜在空間が連続的で滑らかになるよう制約し、学習後に $z \\sim \\mathcal{N}(0, I)$ からサンプリングして新しいデータを生成できるようにする',
      'Evidence Lower Bound (ELBO): VAEの損失は $-\\text{ELBO} = \\text{再構成損失} + D_{\\text{KL}}$ であり、ELBOを最大化することで対数尤度の下界を最大化する',
    ],
    complexity: { time: 'O(batch \\cdot latent\\_dim)', space: 'O(batch \\cdot latent\\_dim)' },
    tip: 'PyTorchでVAEを実装する場合、再パラメータ化は model.reparameterize() として書き、KLダイバージェンスは -0.5 * torch.sum(1 + log_var - mu.pow(2) - log_var.exp()) で計算します。β-VAEでは KL 項に係数 β > 1 をかけて潜在空間の解釈性を高めます。',
  }
});
