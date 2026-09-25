// cp_035: ビット非交差の良い整数列 ★3 (C++)
// 互いに立っているビットが重ならない加法を使い、最小値を popcount へ帰着する
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_035',
  title: 'ビット非交差の良い整数列',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 3,
  language: 'cpp',
  description: '【問題】\n正整数 $N$ が与えられます。長さ $N$ の正整数列 $A=(A_1,A_2,\\ldots,A_N)$ が、すべての $i,j\\ge 1$ で $i+j\\le N$ かつ $(i\\mathbin{\\&}j)=0$ を満たすときに $A_{i+j}\\ge A_i+A_j$ を満たすなら、$A$ を**良い整数列**と呼びます。ここで `&` は bitwise AND です。\n\n良い整数列すべてについて、$A_N$ として取り得る最小値を返してください。\n\n【観察】\n$N$ を、立っている各ビットに対応する $2$ のべき乗の和へ分解します。これらの添字同士はビットが重ならないため、条件を繰り返し使えます。各 $A_i$ は正整数なので、$A_N$ は $N$ の立っているビット数以上です。一方、$A_i=\\operatorname{popcount}(i)$ とすれば、ビットが重ならないとき等号が成り立ちます。',
  inputFormat: {
    params: [
      { name: 'N', type: 'long long', desc: '良い整数列の長さ' },
    ],
    note: '戻り値: int（A_N として取り得る最小値）\n制約: 1 ≤ N ≤ 10^18',
    examples: [
      {
        input: 'N = 13',
        output: '3',
        explanation: '$13=8+4+1=(1101)_2$ です。各項は正整数なので A_13 ≥ A_8+A_4+A_1 ≥ 3 です。A_i=popcount(i) とすれば達成できます。',
      },
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0, code: 'int minimumLastValue(long long N) {' },
    { id: 1, code: '    int answer = 0;' },
    { id: 2, code: '    while (N > 0) {' },
    { id: 3, code: '        answer += N & 1LL;' },
    { id: 4, code: '        N >>= 1;' },
    { id: 5, code: '    }' },
    { id: 6, code: '    return answer;' },
    { id: 7, code: '}' },
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7],
  ],
  hints: [
    'N を 2 のべき乗の和、すなわち立っているビットごとに分解してみましょう。',
    '異なる 2 のべき乗は bitwise AND が 0 です。部分和を足していくときにも、この性質を使えます。',
    '各 A_i は少なくとも 1 なので、立っているビットが t 個なら A_N は少なくとも t です。',
    'A_i=popcount(i) を考えると、(i & j)=0 のとき popcount(i+j)=popcount(i)+popcount(j) です。',
    'したがって答えは N の popcount です。最下位ビットを足して右シフトする操作を繰り返します。',
  ],
  explanation: {
    summary: '条件が適用できるのは、足し合わせる添字の立っているビットが重ならない場合です。N の二進展開はまさにそのような 2 のべき乗の和なので、答えは popcount(N) になります。',
    points: [
      'N の各立ちビットを 2^p と書くと、異なる項どうしの AND は 0 であり、部分和と次の項の AND も 0 になる',
      'よって条件を繰り返して A_N ≥ Σ A_(2^p) ≥ 立っているビット数 が従う',
      'A_i=popcount(i) では、ビットが重ならない i,j に対して桁上がりが発生せず、A_(i+j)=A_i+A_j になる',
      '下界を達成する列が存在するため、最小値は popcount(N) である',
    ],
    complexity: { time: 'O(log N)', space: 'O(1)' },
    tip: 'AND が 0 という条件を見たら、「二進数で立っているビットが重ならない」と言い換えると、和や popcount との関係が見つけやすくなります。',
  },
});
