// basic_004: 答えの二分探索（木の切り出し問題）★3
// id:7 (while の }) と id:9 (関数の }) は trimStart() 後に同一テキスト
// 間に return lo (id:8) が挟まる → [7,8] と [8,9] で「} return lo }」順を保証
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'basic_004',
  title: '答えの二分探索（木の切り出し）',
  category: 'basic',
  categoryLabel: '基本アルゴリズム',
  difficulty: 3,
  language: 'cpp',
  description: '【答えの二分探索（パラメトリックサーチ）とは】「最大でどのくらいの高さで木を切れば、必要な量の木材が集まるか？」という問いに対して、「切る高さ H」の候補を二分探索で絞り込むテクニックです。「H が大きすぎれば木材が足りない、小さすぎれば木材が余る」という単調性を利用して、最適な H を効率よく見つけます。\n\nN 本の木が並んでおり、高さ H の位置で切ると trees[i] > H の木から (trees[i] − H) の木材が得られる。合計 m 以上の木材を得られる最大の H を求めよ。\n\n「答え（H）の空間 [0, max(trees)]」を二分探索する solve() 関数を実装せよ。判定関数 canGet() はピン留めで提供済み。\n\n【ポイント】「条件を満たす最大値」を求めるため、上丸め mid = (lo + hi + 1) / 2 と lo = mid 更新を使う。',
  pinnedCode: [
    '#include <bits/stdc++.h>',
    'using namespace std;',
    '// 高さ h で切ったとき合計 m 以上の木材が得られるか判定',
    'bool canGet(vector<int>& trees, long long h, long long m) {',
    '    long long total = 0;',
    '    for (int x : trees) {',
    '        if (x > h) total += x - h;',
    '    }',
    '    return total >= m;',
    '}',
  ],
  blocks: [
    { id: 0, code: 'long long solve(vector<int>& trees, long long m) {' },
    { id: 1, code: '    long long lo = 0;' },
    { id: 2, code: '    long long hi = *max_element(trees.begin(), trees.end());' },
    { id: 3, code: '    while (lo < hi) {' },
    { id: 4, code: '        long long mid = (lo + hi + 1) / 2;' },
    { id: 5, code: '        if (canGet(trees, mid, m)) lo = mid;' },
    { id: 6, code: '        else hi = mid - 1;' },
    { id: 7, code: '    }' },
    { id: 8, code: '    return lo;' },
    { id: 9, code: '}' },
  ],
  // id:7 (while の }) と id:9 (関数の }) は視覚的に同一 → permutation ロジックで対応
  // [7,8]: while の } の後に return lo / [8,9]: return lo の後に関数の }
  // どちらの } が前後しても「} return lo }」の視覚的配置なら正解
  partialOrder: [
    [0, 1], [0, 2],
    [1, 3], [2, 3],
    [3, 4], [4, 5], [5, 6],
    // 両 } (id:7, id:9) は while 本体 (id:5, id:6) の後に来る
    [5, 7], [6, 7], [5, 9], [6, 9],
    // return lo (id:8) も while 本体の後
    [5, 8], [6, 8],
    // return lo は } と } の間に来る: } return lo } の順を保証
    [7, 8], [8, 9],
  ],
  hints: [
    'lo=0, hi=max(trees) で答えの候補範囲を初期化し while (lo < hi) でループ',
    '上丸め mid = (lo + hi + 1) / 2 が重要。canGet で OK なら lo=mid、NG なら hi=mid-1',
    'ループ終了後 lo が答え（条件を満たす最大の H）。上丸めを使わないと lo=mid で無限ループになる',
  ],
  explanation: {
    summary: '「答えの二分探索（パラメトリックサーチ）」は、答えの候補空間を二分探索することで最大値・最小値を O(log N) で求めるテクニックです。',
    points: [
      '答えの空間 [lo, hi] を二分探索。canGet() で「mid が答えとして成立するか」を判定',
      '「条件を満たす最大値」は上丸め mid = (lo+hi+1)/2、lo=mid で更新（下丸めにすると lo=hi で無限ループ）',
      '「条件を満たす最小値」は下丸め mid = (lo+hi)/2、hi=mid で更新（形式が対称）',
      'while (lo < hi) 終了時に lo == hi が答え。境界条件のミスが最も多い注意ポイント',
    ],
    complexity: { time: 'O(N log(max(trees)))', space: 'O(1)' },
    tip: '「制約を満たす最大値/最小値を求める」問題は答えの二分探索の典型。めぐる式二分探索として有名です。',
  },
});
