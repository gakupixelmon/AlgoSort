// cp_018: 隣接和の偶奇を合わせる最小操作 ★3 (C++)
// M=2 では「1を足す操作」は偶奇反転なので、最終偶奇列を2通りだけ試す
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_018',
  title: '隣接和の偶奇を合わせる最小操作',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 3,
  language: 'cpp',
  description: '【問題】\n0 または 1 からなる長さ N の整数列 A と、長さ N-1 の整数列 B が与えられます。1回の操作で、好きな A_i に 1 を加えることができます。\n\nすべての i=1,2,...,N-1 について、A_i + A_{i+1} を 2 で割った余りが B_i になるようにするための最小操作回数を求めてください。\n\n【ポイント】\nM=2 なので、値そのものではなく偶奇だけが重要です。1 を加える操作は偶奇を反転させる操作であり、同じ場所に2回足すのは条件を変えずに操作回数だけ増やすため最適ではありません。\n\n最終的な偶奇列を X とすると、条件は X_i xor X_{i+1} = B_i と同じです。X_1 を 0 にするか 1 にするかを決めると、残りの X はすべて一意に決まります。よって2通りを試し、元の A と偶奇が違う位置の個数の最小値が答えです。',
  inputFormat: {
    params: [
      { name: 'A', type: 'vector<int>', desc: '初期配列（各要素は 0 または 1）' },
      { name: 'B', type: 'vector<int>', desc: '隣接和 mod 2 の目標値（各要素は 0 または 1）' },
    ],
    note: '戻り値: int（必要な最小操作回数）\n制約: 2 ≤ N ≤ 2×10^5、M = 2、0 ≤ A_i, B_i ≤ 1',
    examples: [
      {
        input: 'A = [0, 0, 1, 1]\nB = [1, 0, 1]',
        output: '1',
        explanation: '最終偶奇列を [0,1,1,0] にすると条件を満たし、4番目だけを反転すればよいので1回です。'
      },
      {
        input: 'A = [1, 0, 0]\nB = [0, 1]',
        output: '1',
        explanation: 'X_1=1 とすると X=[1,1,0] になり、2番目だけを反転すれば条件を満たします。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0, code: 'int minOperationsParity(const vector<int>& A, const vector<int>& B) {' },
    { id: 1, code: '    int n = A.size();' },
    { id: 2, code: '    int ans = n + 1;' },
    { id: 3, code: '    for (int first = 0; first < 2; first++) {' },
    { id: 4, code: '        int cur = first;' },
    { id: 5, code: '        int cost = 0;' },
    { id: 6, code: '        for (int i = 0; i < n; i++) {' },
    { id: 7, code: '            if (cur != A[i]) cost++;' },
    { id: 8, code: '            if (i + 1 < n) cur ^= B[i];' },
    { id: 9, code: '        }' },
    { id: 10, code: '        ans = min(ans, cost);' },
    { id: 11, code: '    }' },
    { id: 12, code: '    return ans;' },
    { id: 13, code: '}  // end minOperationsParity' },
  ],
  // first=0/1 の2通りを試す。cur と cost の初期化は同じ first に対するループ内なら順不同
  partialOrder: [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4], [3, 5],
    [4, 6], [5, 6],
    [6, 7],
    [7, 8],
    [8, 9],
    [9, 10],
    [10, 11],
    [11, 12],
    [12, 13],
  ],
  hints: [
    'M=2 なので、A_i に 1 を足す操作は A_i の偶奇を反転させることと同じです',
    '最終偶奇列を X とすると、X_i + X_{i+1} mod 2 は X_i xor X_{i+1} と同じです',
    'X_i xor X_{i+1} = B_i より、X_{i+1} = X_i xor B_i です',
    'X_1 は 0 または 1 の2通りしかないため、両方試して A と違う位置数を数えます',
  ],
  explanation: {
    summary: 'M=2 では各要素の偶奇だけを考えればよく、1回の操作は偶奇反転です。先頭の最終偶奇を決めると、B によって残りの偶奇列が一意に決まるため、2通りを試すだけで最小操作回数が求まります。',
    points: [
      '条件 (A_i + A_{i+1}) mod 2 = B_i は、偶奇では X_i xor X_{i+1} = B_i と書ける',
      'X_{i+1} = X_i xor B_i なので、左から順に最終偶奇を復元できる',
      'ある位置の最終偶奇が初期 A_i と違うなら、その位置に1回足せばよい。2回以上足す必要はない',
      '先頭の偶奇は0か1の2択だけなので、全体は O(N) で解ける',
    ],
    complexity: { time: 'O(N)', space: 'O(1)' },
    tip: 'mod 2 の加算条件は xor に置き換えると見通しがよくなります。隣接条件では「先頭を決めると残りが連鎖的に決まる」構造を探すのが定石です。',
  },
});
