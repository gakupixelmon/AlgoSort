// cp_006: Binary Indexed Tree（BIT / Fenwick Tree）★4 (C++)
// 競プロ典型：区間和クエリと点更新を O(log N) で処理するデータ構造
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_006',
  title: 'Binary Indexed Tree（BIT / Fenwick Tree）',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 4,
  language: 'cpp',
  description: '【BITとは】Binary Indexed Tree（Fenwick Tree）は、配列の「点更新」と「前置和クエリ（1〜i の和）」をどちらも O(log N) で処理できるデータ構造です。添字のビット演算（i & -i）を利用してノード間の依存関係を管理します。セグメント木より定数倍が小さく実装も簡潔なため、競プロで非常に頻繁に使われます。\n\n1-indexed の BIT を実装せよ。add(i, delta) で位置 i の値を delta 増やし、sum(i) で a[1] + a[2] + ... + a[i] の前置和を返す。',
  inputFormat: {
    params: [
      { name: 'n', type: 'int', desc: '配列の長さ（1-indexed）' },
    ],
    note: '・add(i, delta): a[i] に delta を加算（1 ≤ i ≤ n）\n・sum(i): a[1] + ... + a[i] の前置和を返す（1 ≤ i ≤ n）\n制約: 1 ≤ n ≤ 10^6、クエリ数 ≤ 10^5',
    examples: [
      {
        input: 'n=5, add(1,3), add(3,2), add(5,1), sum(3)',
        output: '5',
        explanation: 'a = [3, 0, 2, 0, 1] なので sum(3) = 3+0+2 = 5'
      },
      {
        input: 'n=5, add(2,4), sum(4)',
        output: '4',
        explanation: 'a = [0, 4, 0, 0, 0] なので sum(4) = 0+4+0+0 = 4'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0, code: 'struct BIT {' },
    { id: 1, code: '    int n;' },
    { id: 2, code: '    vector<long long> tree;' },
    { id: 3, code: '    BIT(int n) : n(n), tree(n + 1, 0) {}' },
    { id: 4, code: '    void add(int i, long long delta) {' },
    { id: 5, code: '        for (; i <= n; i += i & -i)' },
    { id: 6, code: '            tree[i] += delta;' },
    { id: 7, code: '    }' },
    { id: 8, code: '    long long sum(int i) {' },
    { id: 9, code: '        long long s = 0;' },
    { id: 10, code: '        for (; i > 0; i -= i & -i)' },
    { id: 11, code: '            s += tree[i];' },
    { id: 12, code: '        return s;' },
    { id: 13, code: '    }' },
    { id: 14, code: '};' },
  ],
  // id:1（int n）と id:2（vector）はどちらが先でも可
  // id:3（コンストラクタ）は id:1 と id:2 の後
  // add（id:4〜7）と sum（id:8〜13）は並列でどちらが先でも可
  partialOrder: [
    [0, 1], [0, 2],   // n と tree はどちらが先でも可
    [1, 3], [2, 3],   // コンストラクタは n と tree の後
    [3, 4], [3, 8],   // add と sum はどちらが先でも可
    [4, 5], [5, 6], [6, 7],
    [8, 9], [9, 10], [10, 11], [11, 12], [12, 13],
    [7, 14], [13, 14],
  ],
  hints: [
    'add(i, delta): i += i & -i で「i の最下位ビットを加算」して担当する上位ノードへ伝播。i <= n の間繰り返す',
    'sum(i): i -= i & -i で「i の最下位ビットを除去」して担当範囲を累積。i > 0 の間繰り返す',
    'i & -i は「i の最下位の立っているビットのみを取り出す」操作（例: 6 = 110₂ → 6 & -6 = 010₂ = 2）',
  ],
  explanation: {
    summary: 'BIT は配列 tree[i] が「i から i-(i&-i)+1 番目までの和」を担当するという設計です。i & -i（最下位ビット）を足し引きするだけで O(log N) の更新・クエリを実現します。',
    points: [
      'i & -i: 2の補数表現において -i = ~i + 1 なので、i と -i の AND で最下位ビットのみ取り出せる',
      'add では i を増やしながら「自分を含む上位ノード」に伝播。sum では i を減らしながら「累積和を集積」',
      '1-indexed が自然：i = 0 は i & -i = 0 で無限ループになるため注意',
      '区間 [l, r] の和は sum(r) - sum(l-1) で O(log N) に計算できる',
    ],
    complexity: { time: 'O(log N) per add/sum', space: 'O(N)' },
    tip: '転倒数の計算、座標圧縮と組み合わせた頻度カウント、2D BIT（二次元 Fenwick Tree）など競プロ頻出の応用が多数あります。セグメント木より実装が短く高速なため、まずこちらをマスターすることを推奨します。',
  },
});
