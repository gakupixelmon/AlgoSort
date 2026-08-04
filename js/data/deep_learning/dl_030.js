// dl_030: In-Context Learning のプロンプト構築 (Python) ★2
// Few-shot 例と新しい入力を1つの文脈に整形する
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dl_030',
  title: 'In-Context Learning のプロンプト構築',
  category: 'deep_learning',
  categoryLabel: '深層学習',
  difficulty: 2,
  language: 'python',
  description: '【In-Context Learning とは】\nIn-Context Learning（ICL）は、モデルの重みを更新せず、プロンプト中に例を与えるだけで新しいタスクの形式を学ばせる使い方です。たとえば「英語: cat / 日本語: 猫」のような例を数個見せると、モデルは次の英単語に対しても日本語を返す形式を推測できます。\n\n【問題】\n入出力の例 `examples` と、新しい入力 `query` から few-shot プロンプトを組み立ててください。各例は `Input: ...` と `Output: ...` の形式で並べ、最後に `Input: query` と出力欄だけの `Output:` を追加します。',
  inputFormat: {
    params: [
      { name: 'examples', type: 'list[tuple[str, str]]', desc: '入力と期待出力の例' },
      { name: 'query', type: 'str', desc: 'モデルに解かせたい新しい入力' },
    ],
    note: '戻り値: str（few-shot プロンプト）',
    examples: [{
      input: "examples = [('cold', '寒い'), ('hot', '暑い')]\nquery = 'rain'",
      output: "Input: cold\nOutput: 寒い\n\nInput: hot\nOutput: 暑い\n\nInput: rain\nOutput:",
      explanation: '最後の Output を空欄にすることで、モデルが続きとして答えを生成する余地を作ります。'
    }],
  },
  pinnedCode: [],
  blocks: [
    { id: 0, code: 'def build_few_shot_prompt(examples, query):' },
    { id: 1, code: '    parts = []' },
    { id: 2, code: '    for input_text, output_text in examples:' },
    { id: 3, code: "        parts.append(f'Input: {input_text}\\nOutput: {output_text}')" },
    { id: 4, code: "    parts.append(f'Input: {query}\\nOutput:')" },
    { id: 5, code: "    return '\\n\\n'.join(parts)" },
  ],
  partialOrder: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
  hints: [
    'examples の各要素は input_text, output_text の2つに分けて取り出します',
    '例と新しい質問を同じ Input / Output 形式にそろえます',
    'query の Output は書かずに、ラベルとコロンだけを追加します',
    '各ブロックの間を空行で区切ると、例の境界がモデルに伝わりやすくなります',
  ],
  explanation: {
    summary: 'Few-shot ICL では、タスクの規則を説明する代わりに、入出力例そのものを文脈として与えます。最後の出力を空欄にして、モデルに同じ形式の続きを生成させます。',
    points: [
      'モデルのパラメータは更新しないため、これはファインチューニングとは異なる',
      '入出力ラベルを全例で統一すると、モデルがどちらが質問でどちらが答えかを把握しやすい',
      '例の区切りを空行にすることで、1つの例の終わりを明確にできる',
      '実際には、プロンプトの最後に答えの書式や制約を短く添えることも多い',
    ],
    complexity: { time: 'O(プロンプト文字数)', space: 'O(プロンプト文字数)' },
    tip: '最初は2〜3個の短い例から始め、期待する出力形式が安定しない場合だけ例を追加すると、文脈長を節約できます。',
  },
});
