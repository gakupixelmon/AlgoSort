// dl_027: Rotary Position Embedding (Python) ★4
// 埋め込みの偶数・奇数次元を位置ごとの角度で回転する
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_027',
  title: 'Rotary Position Embedding（RoPE）',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 4,
  language: 'python',
  description: '【RoPE とは】\nRotary Position Embedding（RoPE）は、Transformer の Query と Key に位置情報を与える手法です。位置ベクトルを加算する代わりに、埋め込みの隣り合う2次元をひと組として、位置に応じた角度で回転させます。\n\n回転後の Query と Key の内積には相対的な位置差が自然に反映されます。そのため LLaMA 系をはじめ、多くの現代的な Transformer で利用されています。\n\nNumPy を使って、shape [seq_len, dim] の埋め込み x に RoPE を適用する関数を実装せよ。ただし dim は偶数とします。',
  inputFormat: {
    params: [
      { name: 'x', type: 'np.ndarray', desc: '入力埋め込み（shape: [seq_len, dim]、dim は偶数）' },
      { name: 'base', type: 'float', desc: '周波数の基数（通常は 10000.0）' },
    ],
    note: '戻り値: np.ndarray（x と同じ shape）\nピン留め: import numpy as np',
    examples: [
      {
        input: 'x = np.array([[1.0, 0.0, 2.0, 0.0], [1.0, 0.0, 2.0, 0.0]])\nbase = 10000.0',
        output: 'shape (2, 4) の配列',
        explanation: '位置0では回転角が0なので元の値のままです。位置1では、各次元ペアが異なる角度で回転します。'
      }
    ],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def apply_rope(x, base=10000.0):' },
    { id: 1, code: '    seq_len, dim = x.shape' },
    { id: 2, code: '    assert dim % 2 == 0' },
    { id: 3, code: '    half_dim = dim // 2' },
    { id: 4, code: '    inv_freq = 1.0 / (base ** (np.arange(half_dim) / half_dim))' },
    { id: 5, code: '    positions = np.arange(seq_len)' },
    { id: 6, code: '    angles = positions[:, None] * inv_freq[None, :]' },
    { id: 7, code: '    cos, sin = np.cos(angles), np.sin(angles)' },
    { id: 8, code: '    even, odd = x[:, 0::2], x[:, 1::2]' },
    { id: 9, code: '    rotated_even = even * cos - odd * sin' },
    { id: 10, code: '    rotated_odd = even * sin + odd * cos' },
    { id: 11, code: '    out = np.empty_like(x)' },
    { id: 12, code: '    out[:, 0::2], out[:, 1::2] = rotated_even, rotated_odd' },
    { id: 13, code: '    return out' },
  ],
  partialOrder: [
    [0, 1], [1, 2], [1, 3],
    [3, 4], [1, 5], [4, 6], [5, 6], [6, 7],
    [1, 8], [7, 9], [8, 9], [7, 10], [8, 10],
    [9, 11], [10, 11], [11, 12], [9, 12], [10, 12], [12, 13],
  ],
  hints: [
    '埋め込みの 0, 1 次元、2, 3 次元のように、隣り合う2次元を回転平面として扱います',
    '回転角は position * inv_freq です。次元ペアごとに inv_freq を変えます',
    '2次元回転は (a, b) を (a cos - b sin, a sin + b cos) に変換します',
    'x[:, 0::2] と x[:, 1::2] を使うと、偶数・奇数次元のペアをまとめて扱えます',
  ],
  explanation: {
    summary: 'RoPE は、埋め込みの各2次元ペアを位置依存の角度で回転し、Attention に相対位置の情報を持たせる手法です。',
    points: [
      '各次元ペアを複素数の実部・虚部のように見なし、位置に応じて回転させる',
      'inv_freq は次元ペアごとに異なるため、短い周期と長い周期の位置情報を同時に表現できる',
      '回転行列は長さを保存するので、各位置の埋め込みのノルムは変わらない',
      'Query と Key の両方に同じ仕組みを適用すると、その内積が絶対位置だけでなく相対位置差に依存する形になる',
    ],
    complexity: { time: 'O(seq_len \cdot dim)', space: 'O(seq_len \cdot dim)' },
    tip: '実運用では [batch, heads, seq_len, head_dim] のようなテンソルに対し、cos と sin をブロードキャストして同じ回転を適用します。長い文脈向けに RoPE の周波数を調整する派生手法もあります。',
  },
});
