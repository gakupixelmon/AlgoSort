// cp_044: 連続配置された人の入れ替え回数 ★3 (C++)
// 目標位置の置換に含まれる転倒数を Fenwick Tree で数える
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_044',
  title: '連続配置された人の入れ替え回数',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 3,
  language: 'cpp',
  description: '【問題】\nN 人の人が数直線上の座標 0,1,...,N-1 に、番号順に1人ずつ立っています。人 i の目標座標 T_i は 0,1,...,N-1 の置換です。\n\n次の操作を好きな回数行えます。人を1人選び、隣の座標へ1マス移動させます。移動先に別の人がいる場合、その人は選んだ人がいた座標へ同時に移動します。\n\n全員が目標座標へ移動するまでの操作回数の最小値を求める関数を実装してください。\n\n初期位置と目標位置の集合が同じなので、空いている座標へ一度移動して遠回りする必要はありません。隣り合う人の交換1回で順序の転倒を1つ解消でき、答えは目標位置の列 T の転倒数になります。',
  inputFormat: {
    params: [
      { name: 'T', type: 'const vector<int>&', desc: '各人の目標座標。0..N-1 の置換' },
    ],
    note: '戻り値: long long（最小操作回数）\n制約: 1 ≤ N ≤ 2×10^5、T は 0..N-1 の置換。',
    examples: [
      {
        input: 'T = [2, 0, 1]',
        output: '2',
        explanation: '人0,1,2の目標座標はそれぞれ2,0,1です。順序 [2,0,1] には (2,0),(2,1) の2つの転倒があり、2回の隣接交換で実現できます。',
      },
      {
        input: 'T = [0, 1, 2, 3]',
        output: '0',
        explanation: 'はじめから全員が目標位置にいるため、操作は必要ありません。',
      },
    ],
  },
  pinnedCode: [
    '#include <bits/stdc++.h>',
    'using namespace std;',
    'struct Fenwick {',
    '    int n;',
    '    vector<int> bit;',
    '    Fenwick(int n) : n(n), bit(n + 1, 0) {}',
    '    void add(int index, int value) {',
    '        for (index++; index <= n; index += index & -index) bit[index] += value;',
    '    }',
    '    int sumPrefix(int count) const {',
    '        int result = 0;',
    '        for (; count > 0; count -= count & -count) result += bit[count];',
    '        return result;',
    '    }',
    '};',
  ],
  blocks: [
    { id: 0, code: 'long long minimumAdjacentSwaps(const vector<int>& T) {' },
    { id: 1, code: '    int n = T.size();' },
    { id: 2, code: '    Fenwick fenwick(n);' },
    { id: 3, code: '    long long answer = 0;' },
    { id: 4, code: '    for (int i = n - 1; i >= 0; i--) {' },
    { id: 5, code: '        answer += fenwick.sumPrefix(T[i]);' },
    { id: 6, code: '        fenwick.add(T[i], 1);' },
    { id: 7, code: '    }' },
    { id: 8, code: '    return answer;' },
    { id: 9, code: '}' },
  ],
  partialOrder: [
    [0, 1], [0, 2], [0, 3], [1, 4], [2, 4], [3, 4],
    [4, 5], [5, 6], [6, 7], [7, 8], [8, 9],
  ],
  hints: [
    '人 i の目標座標 T_i が小さい順に並ぶように人を並べると、目標状態の人の順序が分かります',
    '初期の人の順序は番号順なので、T_i > T_j (i < j) なら人 i と人 j は順序を入れ替える必要があります',
    '必要な交換回数は T の転倒数です。右側にある T_j < T_i の個数を数えます',
    'Fenwick Tree で右側に追加済みの値の個数を管理すると、各要素を O(log N) で処理できます',
  ],
  explanation: {
    summary: '操作で2人が出会うと、その2人の順序が隣接交換によって入れ替わります。目標位置の順序と現在の番号順が異なる各ペアは、少なくとも1回交換する必要があります。転倒するペアごとに隣接交換を行えば達成できるため、最小回数は転倒数です。',
    points: [
      'T_i > T_j (i < j) のペアでは、初期状態で i が j より左、目標状態で j が i より左になるため、必ず順序を入れ替える必要があります',
      '1回の隣接交換で変えられる転倒数は高々1つなので、転倒数が操作回数の下界になります',
      'バブルソートと同じ隣接交換を行えば、各転倒を1回ずつ解消して下界を達成できます',
      '右から左へ見て、すでに見た値のうち T_i より小さい個数を Fenwick Tree で求めます',
    ],
    complexity: { time: 'O(N log N)', space: 'O(N)' },
    tip: '「順序を保ったまま動く対象が、目標位置の順列へ並び替わる」問題では、まず転倒数への帰着を考えます。個数の集計には Fenwick Tree が便利です。',
  },
});
