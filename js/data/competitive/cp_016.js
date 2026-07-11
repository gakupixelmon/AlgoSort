// cp_016: しゃくとり法（尺取り法 / Two Pointers） ★3 (C++)
// 競プロ典型：条件を満たす区間を左右ポインタで管理して O(N) で数える
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_016',
  title: 'しゃくとり法（和がK以下の区間数）',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 3,
  language: 'cpp',
  description: '【しゃくとり法とは】左右2つのポインタで連続区間を管理し、条件を満たす範囲を少しずつ伸縮させるテクニックです。区間の左端 l と右端 r はどちらも一方向にしか進まないため、二重ループに見えても全体 O(N) で動きます。\n\n正の整数からなる配列 a と整数 K が与えられる。総和が K 以下である連続部分列の個数を求めよ。すべての要素は正なので、右端を伸ばすと区間和は増え、左端を進めると区間和は減る。この単調性を利用してしゃくとり法で実装せよ。',
  inputFormat: {
    params: [
      { name: 'a', type: 'vector<int>', desc: '正の整数配列（各要素 >= 1）' },
      { name: 'K', type: 'long long', desc: '区間和の上限' },
    ],
    note: '戻り値: long long（和が K 以下の連続部分列の個数）\n制約: 1 ≤ N ≤ 2×10^5、1 ≤ a[i] ≤ 10^9、1 ≤ K ≤ 10^18',
    examples: [
      {
        input: 'a = [2, 1, 3, 2], K = 4',
        output: '6',
        explanation: '条件を満たす区間は [2], [2,1], [1], [1,3], [3], [2] の6個です。'
      },
      {
        input: 'a = [5, 1, 1], K = 2',
        output: '3',
        explanation: '[1], [1], [1,1] の3個です。先頭の 5 は単体でも K を超えるため数えません。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'long long countSubarraysAtMostK(const vector<int>& a, long long K) {' },
    { id: 1,  code: '    int n = a.size();' },
    { id: 2,  code: '    long long ans = 0;' },
    { id: 3,  code: '    long long sum = 0;' },
    { id: 4,  code: '    int r = 0;' },
    { id: 5,  code: '    for (int l = 0; l < n; l++) {' },
    { id: 6,  code: '        while (r < n && sum + a[r] <= K) {' },
    { id: 7,  code: '            sum += a[r];' },
    { id: 8,  code: '            r++;' },
    { id: 9,  code: '        }' },
    { id: 10, code: '        ans += r - l;' },
    { id: 11, code: '        if (r == l) r++;' },
    { id: 12, code: '        else sum -= a[l];' },
    { id: 13, code: '    }' },
    { id: 14, code: '    return ans;' },
    { id: 15, code: '}  // end countSubarraysAtMostK' },
  ],
  // 初期化3行（ans, sum, r）は n の後なら順不同。ただしループ前に全て必要
  atomicGroups: [
    [11, 12],
  ],
  partialOrder: [
    [0, 1],
    [1, 2], [1, 3], [1, 4],
    [2, 5], [3, 5], [4, 5],
    [5, 6],
    [6, 7], [7, 8], [8, 9],
    [9, 10],
    [10, 11], [10, 12], [11, 12],
    [11, 13], [12, 13],
    [13, 14], [14, 15],
  ],
  hints: [
    '区間 [l, r) の和を sum として持ちます。r は「次に追加する位置」です',
    'while で sum + a[r] <= K の間だけ右端 r を伸ばし、伸ばした分だけ sum に足します',
    '左端 l を固定したとき、条件を満たす右端は l, l+1, ..., r-1 なので個数は r-l 個です',
    'a[l] を区間から外して次の l に進みます。ただし r == l の場合は空区間なので r だけ進めます',
  ],
  explanation: {
    summary: 'しゃくとり法は、条件を満たす連続区間を左右ポインタで管理する O(N) のテクニックです。この問題では要素が正なので、右端を伸ばすほど区間和が増えるという単調性があり、各ポインタは後戻りしません。',
    points: [
      '区間は半開区間 [l, r) として扱う。sum は a[l] から a[r-1] までの和',
      '各 l について、可能な限り r を右へ伸ばす。すると [l, l], [l, l+1], ..., [l, r-1] の r-l 個が条件を満たす',
      'r は全体で高々 N 回しか進まないため、for と while が入れ子でも計算量は O(N)',
      '要素に負数が含まれると「右端を伸ばすと和が増える」という単調性が崩れるため、この実装は使えない',
    ],
    complexity: { time: 'O(N)', space: 'O(1)' },
    tip: 'しゃくとり法は「最長部分列」「条件を満たす区間数」「重複なし部分文字列」などで頻出です。条件が単調に変化するかを確認するのが適用判断の要点です。',
  },
});
