// cp_001: 累積和（区間和クエリ）★2 (C++)
// 競プロ典型：O(1)で区間和を返す前処理
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_001',
  title: '累積和（区間和クエリ）',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 2,
  language: 'cpp',
  description: '【問題】\n長さ N の整数配列 a がある。Q 個のクエリ (l, r) それぞれに対して、a[l] + a[l+1] + ... + a[r-1]（0-indexed, 半開区間 [l, r)）を答えよ。\n\n【制約】\n・N, Q ≤ 10^5\n・クエリごとに O(N) で計算すると TLE になる\n\n【ポイント】\n累積和配列 prefix を前処理で作っておけば、各クエリは O(1) で答えられる。\nprefix[i] = a[0] + a[1] + ... + a[i-1]（prefix[0] = 0）と定義すると、区間和は prefix[r] - prefix[l]。',
  inputFormat: {
    params: [
      { name: 'a', type: 'vector<int>', desc: '整数配列（0-indexed）' },
      { name: 'queries', type: 'vector<pair<int,int>>', desc: 'クエリ (l, r) のリスト（半開区間 [l, r)）' },
    ],
    note: '戻り値: vector<int>（各クエリの区間和）\n制約: 1 ≤ N, Q ≤ 10^5',
    examples: [
      {
        input: 'a = [1, 2, 3, 4, 5]\nqueries = [(1, 4), (0, 3)]',
        output: '[9, 6]',
        explanation: '[1,4)は a[1]+a[2]+a[3]=2+3+4=9、[0,3)は a[0]+a[1]+a[2]=1+2+3=6'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0, code: 'vector<int> range_sum(vector<int>& a, vector<pair<int,int>>& queries) {' },
    { id: 1, code: '    int n = a.size();' },
    { id: 2, code: '    vector<int> prefix(n + 1, 0);' },
    { id: 3, code: '    for (int i = 0; i < n; i++)' },
    { id: 4, code: '        prefix[i + 1] = prefix[i] + a[i];' },
    { id: 5, code: '    vector<int> ans;' },
    { id: 6, code: '    for (auto& [l, r] : queries)' },
    { id: 7, code: '        ans.push_back(prefix[r] - prefix[l]);' },
    { id: 8, code: '    return ans;' },
    { id: 9, code: '}' },
  ],
  partialOrder: [
    [0, 1], [0, 2],       // id:1（n）と id:2（prefix）はどちらが先でも可
    [1, 3], [2, 3],       // forループは n と prefix の両方に依存
    [3, 4],               // ループ本体はヘッダの後
    [4, 5],               // prefix 構築完了後に ans を宣言
    [5, 6], [6, 7],       // クエリループ
    [7, 8], [8, 9],       // return → 関数閉じ
  ],
  hints: [
    'まず前処理: prefix[0] = 0 とし、prefix[i+1] = prefix[i] + a[i] で累積和配列を構築する',
    '区間 [l, r) の和は prefix[r] - prefix[l] の1回の引き算で O(1) で求まる',
    'クエリごとに ans.push_back(prefix[r] - prefix[l]) で結果を追加して返す',
  ],
  explanation: {
    summary: '累積和は「配列の前処理を O(N) で行い、クエリを O(1) で答える」競プロの超頻出テクニックです。区間和を繰り返し問われる問題では必須の道具です。',
    points: [
      'prefix[i] = a[0] + ... + a[i-1]（prefix[0] = 0）と定義すると、[l, r) の和 = prefix[r] - prefix[l]',
      '前処理 O(N) + クエリ O(1) × Q 回 = 合計 O(N + Q)。ナイーブな O(NQ) より大幅に高速',
      '2次元累積和に拡張すれば矩形領域の和も O(1) で求まる（競プロ頻出の発展テクニック）',
      'vector<int> prefix(n + 1, 0) で 0-indexed のシフトに対応。サイズを n+1 にするのがポイント',
    ],
    complexity: { time: 'O(N + Q)', space: 'O(N)' },
    tip: 'AtCoder では「配列の区間和を Q 回求めよ」という形で頻出。差分配列と組み合わせて「区間加算・一点取得」も実現できる。',
  },
});
