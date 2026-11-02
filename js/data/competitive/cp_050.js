// cp_050: 静止した人へのゾンビ拡散 ★3 (C++)
// 最初の感染方向を左右で試し、両端への到達時間を O(N) で求める
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_050',
  title: '静止した人へのゾンビ拡散',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 3,
  language: 'cpp',
  description: '【問題】\n数直線上に N 人の人が立っています。人 i の座標は X_i で、X_1 < X_2 < ... < X_N を満たします。\n\n時刻 0 に人 k がゾンビになります。ゾンビは数直線上を速さ 1 以下で自由に移動できますが、まだ人である人はその場から動きません。ゾンビと人が同じ座標にいると、その人もゾンビになります。\n\n各 k=1,2,...,N について、全員がゾンビになる時刻として考えられる最小値を求めてください。\n\n最初のゾンビが最初に左隣を感染させるか右隣を感染させるかを考えます。最初の感染が起きると、その場所に2体のゾンビがいるので、以後は左右へ分かれて進めます。',
  inputFormat: {
    params: [
      { name: 'x', type: 'const vector<long long>&', desc: '人が立つ座標の昇順列' },
    ],
    note: '戻り値: vector<long long>（各 k を最初のゾンビにしたときの最小時刻）\n制約: 2 ≤ N ≤ 2×10^5、0 ≤ X_1 < ... < X_N ≤ 10^9。',
    examples: [
      {
        input: 'x = [0, 2, 100, 102]',
        output: '[102, 100, 100, 102]',
        explanation: '端の人を最初にゾンビにすると全長102が必要です。人2では右隣を先に感染させると、左端への到達に2、右端への到達に100かかるため100です。人3も対称に100です。',
      },
      {
        input: 'x = [0, 4, 10]',
        output: '[10, 10, 10]',
        explanation: 'どの人から始めても、最終的には座標0と10の両方を感染させる必要があるため、最小時刻は10です。',
      },
    ],
  },
  pinnedCode: [
    '#include <bits/stdc++.h>',
    'using namespace std;',
  ],
  blocks: [
    { id: 0, code: 'vector<long long> minimumSpreadTime(const vector<long long>& x) {' },
    { id: 1, code: '    int n = (int)x.size();' },
    { id: 2, code: '    vector<long long> answer(n);' },
    { id: 3, code: '    answer[0] = answer[n - 1] = x.back() - x.front();' },
    { id: 4, code: '    for (int k = 1; k + 1 < n; k++) {' },
    { id: 5, code: '        long long firstLeft = max(x[k] - x.front(), x.back() - x[k - 1]);' },
    { id: 6, code: '        long long firstRight = max(x.back() - x[k], x[k + 1] - x.front());' },
    { id: 7, code: '        answer[k] = min(firstLeft, firstRight);' },
    { id: 8, code: '    }' },
    { id: 9, code: '    return answer;' },
    { id: 10, code: '}' },
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [2, 4],
    [4, 5], [4, 6], [5, 7], [6, 7], [7, 8],
    [8, 9], [9, 10],
  ],
  hints: [
    '最初のゾンビが最初に感染させられるのは、左隣か右隣のどちらかです。遠い人を先に選ぶ必要はありません',
    '左隣を最初に感染させると、その時点で2体のゾンビが左側と右側へ分かれます。左端までの時間は X_k-X_1、右端までの時間は X_N-X_{k-1} です',
    '右隣を最初に感染させる場合は、左端までの時間が X_{k+1}-X_1、右端までの時間が X_N-X_k です',
    '左右どちらを先に感染させる場合も、全員を感染させる時間は両端への到達時間の最大値です',
  ],
  explanation: {
    summary: '最初の感染が左隣なら、2体のゾンビは位置 X_{k-1} から左右へ分かれます。左端までに必要な総距離は X_k-X_1、右端までは X_N-X_{k-1} です。右隣を先にする場合も同様に計算し、2通りの小さい方を選びます。',
    points: [
      '端の人から始めた場合は、反対側の端までの距離 X_N-X_1 が答えです',
      '内部の人 k が左隣を先に感染させると、最初の移動分を含めた左端までの距離は X_k-X_1 になります',
      '同じ場合の右端までの距離は、最初の感染地点 X_{k-1} から測って X_N-X_{k-1} です',
      '右隣を先にする場合は左右を入れ替えた式になり、各 k を定数回の計算で処理できます',
    ],
    complexity: { time: 'O(N)', space: 'O(N)' },
    tip: '拡散や移動の問題では、最初に分岐が起きる地点を固定すると、その後の複数方向への処理を独立な区間として考えられることがあります。',
  },
});
