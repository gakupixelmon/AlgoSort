// dl_032: 類似例を選ぶ In-Context Learning (Python) ★4
// 新しい入力に近い例を選び、限られた文脈を有効に使う
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_032',
  title: '類似例を選ぶ In-Context Learning',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 4,
  language: 'python',
  description: '【なぜ例を選ぶのか】\nプロンプトに入れられる例の数には文脈長の制限があります。また、無関係な例を増やしても推論が不安定になることがあります。そこで、入力に意味が近い例を検索して few-shot プロンプトに入れる方法がよく使われます。\n\n【問題】\n各例と query は $L_2$ 正規化済みの埋め込みベクトルを持つとします。内積（コサイン類似度）を使って query に最も近い k 個の例を選び、類似度の高い順に返してください。',
  inputFormat: {
    params: [
      { name: 'example_embeddings', type: 'np.ndarray', desc: '例の埋め込み（shape: [num_examples, dim]、各行は正規化済み）' },
      { name: 'query_embedding', type: 'np.ndarray', desc: 'query の埋め込み（shape: [dim]、正規化済み）' },
      { name: 'k', type: 'int', desc: '選択する例の数' },
    ],
    note: '戻り値: np.ndarray（類似度降順の例のインデックス）\nピン留め: import numpy as np',
    examples: [{
      input: 'example_embeddings = np.array([[1, 0], [0, 1], [0.8, 0.6]])\nquery_embedding = np.array([1, 0])\nk = 2',
      output: 'array([0, 2])',
      explanation: '内積はそれぞれ 1.0, 0.0, 0.8 なので、0番、2番の順に選びます。'
    }],
  },
  pinnedCode: ['import numpy as np'],
  blocks: [
    { id: 0, code: 'def select_similar_examples(example_embeddings, query_embedding, k):' },
    { id: 1, code: '    similarities = example_embeddings @ query_embedding' },
    { id: 2, code: '    descending = np.argsort(-similarities)' },
    { id: 3, code: '    return descending[:k]' },
  ],
  partialOrder: [[0, 1], [1, 2], [2, 3]],
  hints: [
    '正規化済みベクトル同士では、内積がそのままコサイン類似度です',
    '行列 @ ベクトルで、全例との内積を一度に計算できます',
    'np.argsort は昇順なので、負号を付けて類似度の高い順のインデックスを得ます',
    '先頭 k 個のインデックスだけを返します',
  ],
  explanation: {
    summary: '類似例選択は、query に近い few-shot 例だけをプロンプトに入れる Retrieval-Augmented In-Context Learning の基本です。',
    points: [
      '$L_2$ 正規化済みなら、内積 $q^T e_i$ はコサイン類似度と等しい',
      '類似度が高い例は、語彙や構造、意図が query と近い可能性が高い',
      '選んだインデックスを使い、dl_030 のようなテンプレートで few-shot プロンプトを組み立てられる',
      '例が非常に多い場合は、全探索の代わりにベクトル検索インデックスを使う',
    ],
    complexity: { time: 'O(num_examples * dim + num_examples log num_examples)', space: 'O(num_examples)' },
    tip: '実際の検索では、例と query を同じ埋め込みモデルでベクトル化し、重複した例やラベルの偏りも確認します。',
  },
});
