// cp_033: 順列順の極値スワップ ★4 (C++)
// 有効位置を順に増やし、集合内の最小値・最大値を O(1) で追跡する
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_033',
  title: '順列順の極値スワップ',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 4,
  language: 'cpp',
  description: '【問題】\n長さ $N$ の整数列 `A` と、$0,1,\ldots,N-1$ の順列 `order` が与えられます。`i=0,1,\ldots,N-1` の順に、位置 `order[0]` から `order[i]` の要素だけを含む集合を考えます。その集合の最小値と最大値が置かれている位置の値を入れ替えてください。全操作後の配列 `A` を返します。\n\n`A` の要素はすべて異なるものとします。\n\n【観察】\n新しい位置を1つ加えたときだけ、最小値または最大値が更新される可能性があります。その後に最小値と最大値を入れ替えても、極値そのものは変わらず、保持すべきなのはそれらの位置だけです。よって毎回集合を走査せず、現在の最小値・最大値とその位置を追跡できます。',
  inputFormat: {
    params: [
      { name: 'A', type: 'vector<long long>', desc: '要素がすべて異なる整数列' },
      { name: 'order', type: 'const vector<int>&', desc: '0-indexed の位置からなる順列' },
    ],
    note: '戻り値: vector<long long>（全操作後の配列）\n制約: 1 ≤ N ≤ 2×10^5、A の要素はすべて異なる、order は 0..N-1 の順列',
    examples: [
      {
        input: 'A = [5, 2, 8, 1], order = [2, 0, 3, 1]',
        output: '[8, 2, 5, 1]',
        explanation: '有効位置が [2,0] になった時点で 8 と5を交換します。次に位置3を加えると 8 と1を交換し、最後に全体の最小値1と最大値8を交換します。',
      },
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0, code: 'vector<long long> swapActiveExtremes(vector<long long> A, const vector<int>& order) {' },
    { id: 1, code: '    long long mn = LLONG_MAX, mx = LLONG_MIN;' },
    { id: 2, code: '    int minPos = -1, maxPos = -1;' },
    { id: 3, code: '    for (int pos : order) {' },
    { id: 4, code: '        if (A[pos] < mn) { mn = A[pos]; minPos = pos; }' },
    { id: 5, code: '        if (A[pos] > mx) { mx = A[pos]; maxPos = pos; }' },
    { id: 6, code: '        swap(A[minPos], A[maxPos]);' },
    { id: 7, code: '        swap(minPos, maxPos);' },
    { id: 8, code: '    }' },
    { id: 9, code: '    return A;' },
    { id: 10, code: '}' },
  ],
  partialOrder: [
    [0, 1], [0, 2], [1, 3], [2, 3], [3, 4], [3, 5],
    [4, 6], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10],
  ],
  hints: [
    '有効位置を新たに追加する前の最小値 mn、最大値 mx と、その位置 minPos、maxPos を保持します。',
    '今回の A[pos] が mn より小さいか、mx より大きいかだけを調べれば、新しい極値が分かります。',
    '最小値と最大値を入れ替えた後、値 mn と mx はそのままです。位置 minPos と maxPos だけを swap して追跡を続けます。',
    '順列の各位置を1回ずつ処理するだけなので、全体で O(N) です。',
  ],
  explanation: {
    summary: '有効集合の極値を毎回探し直すと O(N^2) になりますが、追加される要素が1つずつであることと、極値スワップが値の集合を変えないことを使えば O(N) にできます。',
    points: [
      '新しい位置 pos を加えたとき、A[pos] と現在の mn, mx を比べるだけで極値を更新できる',
      'スワップ前後で有効集合に含まれる値の集合は同じなので、mn と mx の値は変化しない',
      'スワップ後は mn が maxPos に、mx が minPos に移るため、位置情報だけを入れ替える',
      '要素がすべて異なるため、最小値・最大値の位置は常に一意に定まる',
    ],
    complexity: { time: 'O(N)', space: 'O(1)（返却配列を除く）' },
    tip: '「集合へ要素を追加しながら最小・最大を使う」問題では、極値操作の後に値そのものが変わるのか、位置だけが変わるのかを確認すると状態を小さく保てます。',
  },
});
