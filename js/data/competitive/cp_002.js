// cp_002: 二分探索（整数列・条件判定型）★3 (C++)
// 競プロ典型：ソート済み配列で target を探索し、条件を満たす境界を求める
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_002',
  title: '二分探索（lower_bound の手実装）',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 3,
  language: 'cpp',
  description: '【二分探索とは】ソートされた配列の中から目的の値を探すとき、「真ん中の要素を見て、探す範囲を半分に絞る」を繰り返すことで O(log N) で見つけられる手法です。電話帳を探すとき、真ん中を開いて「ここより前か後か」で絞る感覚です。\n\nソート済みの整数配列 arr と整数 target が与えられる。arr の中で target 以上の最初の要素のインデックス（lower_bound）を返す手実装版を完成させよ。target より大きい要素が全くない場合は arr.size() を返す。STL の lower_bound は使わないこと。',
  inputFormat: {
    params: [
      { name: 'arr', type: 'vector<int>&', desc: 'ソート済みの整数配列' },
      { name: 'target', type: 'int', desc: '検索する値' },
    ],
    note: '戻り値: int（target 以上の最初の要素のインデックス。全要素 < target なら arr.size()）\n制約: 1 ≤ arr.size() ≤ 10^6、arr はソート済み',
    examples: [
      {
        input: 'arr = [1, 3, 3, 5, 7], target = 3',
        output: '1',
        explanation: 'arr[1]=3 が target=3 以上の最初の位置です。'
      },
      {
        input: 'arr = [1, 3, 5], target = 4',
        output: '2',
        explanation: 'target=4 以上の最初の要素は arr[2]=5 です。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0, code: 'int lower_bound_impl(vector<int>& arr, int target) {' },
    { id: 1, code: '    int lo = 0, hi = (int)arr.size();' },
    { id: 2, code: '    while (lo < hi) {' },
    { id: 3, code: '        int mid = lo + (hi - lo) / 2;' },
    { id: 4, code: '        if (arr[mid] < target) {' },
    { id: 5, code: '            lo = mid + 1;' },
    { id: 6, code: '        } else {' },
    { id: 7, code: '            hi = mid;' },
    { id: 8, code: '        }' },
    { id: 9, code: '    }' },
    { id: 10, code: '    return lo;' },
    { id: 11, code: '}' },
  ],
  // id:8, id:9 はいずれも } で同一テキスト。
  // id:8 は if-else の直後（id:5 または id:7 の後）、id:9 は while の直後
  // 8 < 9 の順序を強制
  partialOrder: [
    [0, 1], [1, 2],
    [2, 3], [3, 4], [4, 5], [4, 6],
    [5, 8], [6, 7], [7, 8],
    [8, 9], [9, 10], [10, 11],
  ],
  hints: [
    'lo=0, hi=arr.size() で探索範囲 [lo, hi) を初期化する（hi は「存在しうる最大のインデックスの1つ先」）',
    'mid = lo + (hi - lo) / 2 で中点を計算。arr[mid] < target なら lo = mid + 1、そうでなければ hi = mid',
    'while (lo < hi) が終了したとき lo が答え（target 以上の最初の位置）',
  ],
  explanation: {
    summary: '二分探索は「探索範囲を半分ずつ絞り込む」ことで O(log N) を実現します。lower_bound の手実装は「arr[mid] < target → 左半分を捨てる、それ以外 → 右半分を捨てる」という判定で実現できます。',
    points: [
      '探索区間を [lo, hi) の半開区間で管理するのが定石。hi = arr.size() で「全要素 < target なら arr.size() を返す」も自然に表現できる',
      'mid = lo + (hi - lo) / 2 は (lo + hi) / 2 のオーバーフロー防止版（lo と hi が大きい場合）',
      'arr[mid] < target のとき: mid 以下は全て条件を満たさない → lo = mid + 1',
      '等号なし（< のみ）がポイント。arr[mid] == target のとき hi = mid で「左端を狭める」→ 最初の位置が正確に求まる',
    ],
    complexity: { time: 'O(log N)', space: 'O(1)' },
    tip: '競技プログラミングでは STL の lower_bound / upper_bound を使えばよいですが、「答えを二分探索する」（答えの候補範囲を二分する）テクニックではカスタム条件判定が必要なので手実装の理解が不可欠です。',
  },
});
