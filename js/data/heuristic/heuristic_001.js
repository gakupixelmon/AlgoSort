// heuristic_001: 最近傍法で巡回路の初期解を作る ★3 (C++)
// 局所探索の初期解として使える、貪欲な経路構築
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'heuristic_001',
  title: '最近傍法で巡回路の初期解を作る',
  category: 'heuristic',
  categoryLabel: 'ヒューリスティック最適化',
  difficulty: 3,
  language: 'cpp',
  description: '【ヒューリスティック最適化とは】\n最適解を厳密に求める代わりに、制限時間内にできるだけ良いスコアの解を作る手法です。この問題では、平面上の都市をすべて1度ずつ訪れて出発点に戻る巡回路を作ります。\n\n【問題】\n都市0から出発し、未訪問の都市のうち現在地に最も近い都市を次に選ぶ最近傍法で訪問順を作ってください。最後に都市0へ戻ります。これは最適とは限りませんが、高速に妥当な初期解を作れるため、局所探索や焼きなましの出発点として有用です。',
  inputFormat: {
    params: [
      { name: 'cities', type: 'vector<Point>', desc: '各都市の座標。cities[0] が出発点' },
    ],
    note: '戻り値: vector<int>（0 から始まり、全都市を1度ずつ含み、末尾が再び0の経路）\n制約: 2 <= N <= 2000',
    examples: [
      {
        input: 'cities = [(0,0), (2,0), (1,1)]',
        output: '例: [0, 2, 1, 0]',
        explanation: '都市0から未訪問で最も近い都市を順に選び、最後に出発点へ戻します。距離が同じ場合はどちらを選んでも構いません。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0, code: 'struct Point { double x, y; };' },
    { id: 1, code: 'double dist2(const Point& a, const Point& b) {' },
    { id: 2, code: '    double dx = a.x - b.x, dy = a.y - b.y;' },
    { id: 3, code: '    return dx * dx + dy * dy;' },
    { id: 4, code: '}' },
    { id: 5, code: 'vector<int> nearestNeighborTour(const vector<Point>& cities) {' },
    { id: 6, code: '    int n = cities.size(), current = 0;' },
    { id: 7, code: '    vector<bool> used(n, false);' },
    { id: 8, code: '    vector<int> tour = {0}; used[0] = true;' },
    { id: 9, code: '    for (int step = 1; step < n; ++step) {' },
    { id: 10, code: '        int next = -1;' },
    { id: 11, code: '        for (int candidate = 0; candidate < n; ++candidate) {' },
    { id: 12, code: '            if (used[candidate]) continue;' },
    { id: 13, code: '            if (next == -1 || dist2(cities[current], cities[candidate]) < dist2(cities[current], cities[next])) next = candidate;' },
    { id: 14, code: '        }' },
    { id: 15, code: '        used[next] = true; tour.push_back(next); current = next;' },
    { id: 16, code: '    }' },
    { id: 17, code: '    tour.push_back(0);' },
    { id: 18, code: '    return tour;' },
    { id: 19, code: '}' },
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16], [16, 17], [17, 18], [18, 19],
  ],
  hints: [
    '距離の平方は距離と大小関係が同じなので、sqrt を毎回計算しなくても最寄り都市を選べます',
    'used で訪問済みの都市を除外します',
    '各ステップで未訪問都市をすべて見て、最小距離の candidate を next に保存します',
    '全都市を訪れた後、出発点0を末尾に追加して巡回路を閉じます',
  ],
  explanation: {
    summary: '最近傍法は、現在地から最も近い未訪問都市へ進む貪欲法です。高速に実行可能解を作れるため、より高度な改善法の初期解として便利です。',
    points: [
      '各都市をちょうど1度選ぶので、常に有効な巡回路が得られる',
      '局所的に近い都市を選ぶことは、巡回路全体の短さを保証しない',
      'まずこのような初期解を作り、2-opt や焼きなましで改善する流れがよく使われる',
      '距離比較には二乗距離で十分なので、不要な平方根計算を避けられる',
    ],
    complexity: { time: 'O(N^2)', space: 'O(N)' },
    tip: 'ヒューリスティックでは「必ず制約を満たす初期解を素早く作る」ことが大切です。初期解の品質が後続の探索結果に影響することもあります。',
  },
});
