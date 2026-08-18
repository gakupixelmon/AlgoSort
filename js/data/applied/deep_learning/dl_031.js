// dl_031: In-Context Learning の分類例 (Python) ★3
// ラベル付きの例を整形し、分類用の few-shot プロンプトを作る
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_031',
  title: 'Few-Shot 文書分類プロンプト',
  category: 'applied',
  categoryLabel: '応用',
  difficulty: 3,
  language: 'python',
  description: '【例がタスクを定義する】\nICL では、同じモデルでもプロンプト中の例を変えるだけで分類基準を切り替えられます。たとえばレビュー文と `positive` / `negative` の対応を示せば、モデルは追加学習なしに感情分類の形式を推測します。\n\n【問題】\nラベル付き文章の例から、感情分類用の few-shot プロンプトを作成してください。先頭に分類できるラベル一覧を置き、各例は `Review:` と `Sentiment:` で整形します。新しい review にはラベルを付けず、モデルが `Sentiment:` の続きに1語で出力できるようにします。',
  inputFormat: {
    params: [
      { name: 'examples', type: 'list[tuple[str, str]]', desc: 'レビュー文と感情ラベルの例' },
      { name: 'review', type: 'str', desc: '分類したい新しいレビュー' },
      { name: 'labels', type: 'list[str]', desc: '出力を許可するラベル' },
    ],
    note: '戻り値: str（分類用プロンプト）',
    examples: [{
      input: "examples = [('Loved it', 'positive'), ('Too slow', 'negative')]\nreview = 'Great acting'\nlabels = ['positive', 'negative']",
      output: 'Labels: positive, negative\n\nReview: Loved it\nSentiment: positive\n\nReview: Too slow\nSentiment: negative\n\nReview: Great acting\nSentiment:',
      explanation: '出力候補を最初に限定し、例と同じ Sentiment: の後をモデルに補完させます。'
    }],
  },
  pinnedCode: [],
  blocks: [
    { id: 0, code: 'def build_classification_prompt(examples, review, labels):' },
    { id: 1, code: "    header = 'Labels: ' + ', '.join(labels)" },
    { id: 2, code: '    demonstrations = []' },
    { id: 3, code: '    for text, label in examples:' },
    { id: 4, code: "        demonstrations.append(f'Review: {text}\\nSentiment: {label}')" },
    { id: 5, code: "    query = f'Review: {review}\\nSentiment:'" },
    { id: 6, code: "    return '\\n\\n'.join([header, *demonstrations, query])" },
  ],
  partialOrder: [[0, 1], [0, 2], [2, 3], [3, 4], [0, 5], [1, 6], [4, 6], [5, 6]],
  hints: [
    'labels は join して、モデルが出力すべき候補を最初に示します',
    'demonstrations に例を1件ずつ同じ書式で追加します',
    'query では Sentiment: の後を空にします',
    'header、例、query を空行で結合すると、構造が読み取りやすくなります',
  ],
  explanation: {
    summary: '分類 ICL では、ラベル名と対応例を文脈に置くことで、モデルが今回の分類規則と出力形式を推測します。',
    points: [
      'ラベル候補を明示すると、説明文のような余計な出力を抑えやすい',
      '正例・負例など、対照的な例を含めると境界を理解しやすい',
      'query は例と完全に同じテンプレートにし、答え部分だけを空欄にする',
      '例の順番や表現で精度が変わることがあり、これを prompt sensitivity と呼ぶ',
    ],
    complexity: { time: 'O(プロンプト文字数)', space: 'O(プロンプト文字数)' },
    tip: '本番では生成結果を `labels` に含まれる語だけへ正規化・検証すると、後続処理を安定させられます。',
  },
});
