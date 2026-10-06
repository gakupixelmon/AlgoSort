// cp_041: 最小番号優先探索順を作る木の個数 ★5 (C++)
// 親候補の下限を previous greater element として単調スタックで求める
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_041',
  title: '最小番号優先探索順を作る木の個数',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 5,
  language: 'cpp',
  description: '【問題】\n頂点 $0,1,\\ldots,N-1$ の $N$ 頂点木を根 $0$ から探索します。最初、候補集合には頂点 $0$ だけが入っています。候補集合から番号が最小の頂点を取り出して出力し、その頂点に隣接する未発見頂点を候補集合へ追加する操作を $N$ 回繰り返します。\n\n順列 `order` が与えられます。`order[0]=0` が保証されるとき、この探索で出力順がちょうど `order` になる木の個数を $998244353$ で割った余りとして返してください。辺集合が異なる木は区別します。\n\n【観察】\n位置 $i$ の頂点 `order[i]` の親は、それより前に出力された頂点です。ただし親を選んだ直後から `order[i]` が取り出されるまでに、それより大きい番号の頂点が出力されてはいけません。よって親の位置は、直前に現れた `order[i]` より大きい値の位置以降に限られます。',
  inputFormat: {
    params: [
      { name: 'order', type: 'const vector<int>&', desc: '0..N-1 の順列。order[0] = 0' },
    ],
    note: '戻り値: int（条件を満たす木の個数 modulo 998244353）\n制約: 1 ≤ N ≤ 2×10^5、order は 0..N-1 の順列、order[0]=0',
    examples: [
      {
        input: 'order = [0, 1, 2]',
        output: '2',
        explanation: '辺 {0-1, 0-2} と {0-1, 1-2} の2通りです。どちらでも 0 を処理後、候補に 1 があり 2 より先に取り出されます。',
      },
      {
        input: 'order = [0, 2, 1]',
        output: '1',
        explanation: '頂点1が頂点2より先に候補へ入ると、番号の小さい1が先に出力されてしまいます。辺は 0-2, 2-1 に限られます。',
      },
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0, code: 'int countPrioritySearchTrees(const vector<int>& order) {' },
    { id: 1, code: '    const long long MOD = 998244353;' },
    { id: 2, code: '    long long answer = 1;' },
    { id: 3, code: '    vector<int> decreasing;' },
    { id: 4, code: '    decreasing.push_back(0);' },
    { id: 5, code: '    for (int i = 1; i < (int)order.size(); i++) {' },
    { id: 6, code: '        while (!decreasing.empty() && order[decreasing.back()] < order[i]) {' },
    { id: 7, code: '            decreasing.pop_back();' },
    { id: 8, code: '        }' },
    { id: 9, code: '        int previousGreater = decreasing.empty() ? 0 : decreasing.back();' },
    { id: 10, code: '        answer = answer * (i - previousGreater) % MOD;' },
    { id: 11, code: '        decreasing.push_back(i);' },
    { id: 12, code: '    }' },
    { id: 13, code: '    return (int)answer;' },
    { id: 14, code: '}' },
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9],
    [9, 10], [10, 11], [11, 12], [12, 13], [13, 14],
  ],
  hints: [
    'order[i] の親は必ず i より前の位置にあります。親を選べば、辺の向きは根から一意に定まります。',
    '親が位置 p にあるとすると、p と i の間に order[i] より大きい値が出力されることはできません。order[i] が候補に残っていれば、そちらより先に選ばれるためです。',
    'したがって p は、i より前で最後に order[i] より大きい値が現れた位置以上でなければなりません。',
    'previous greater element は、値が単調減少するように位置を積んだスタックで O(N) に求められます。',
    '親候補数は i - previousGreater です。各頂点は前の頂点だけを親に持つため、選択肢数を全て掛け合わせられます。',
  ],
  explanation: {
    summary: '各頂点の親を選ぶ問題へ変形すると、選択の制約は「直前に現れたより大きい値」だけで決まります。単調スタックでその位置を管理すれば、全ての頂点の親候補数を線形時間で数えられます。',
    points: [
      'order[i] が親 p により候補へ入るのは p を処理した直後である',
      'p<i の途中に order[i] より大きい order[j] があれば、order[i] は候補にあるので、番号の小さい order[i] が先に選ばれて矛盾する',
      '最後のより大きい値の位置を g とすると、親は g,g+1,...,i-1 の i-g 通りから選べる。存在しない場合は g=0 とする',
      '親は常に探索順で前の頂点なので閉路はできず、各親選択は異なる木に対応する。よって候補数の積が答えになる',
    ],
    complexity: { time: 'O(N)', space: 'O(N)' },
    tip: '探索順から親の選び方を数える問題では、「ある頂点が候補集合へ入った後、いつまで待たされるか」に注目すると制約が1次元の previous greater/smaller 問題へ変わることがあります。',
  },
});
