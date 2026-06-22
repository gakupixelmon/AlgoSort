// cp_014: スライド最小値（Sliding Window Minimum）by 単調デク ★3 (C++)
// 競プロ典型：幅 K のウィンドウ内の最小値を O(N) で全て求める
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_014',
  title: 'スライド最小値（Sliding Window Minimum）',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 3,
  language: 'cpp',
  description: '【スライド最小値とは】長さ N の配列 a に対し、幅 K のウィンドウをスライドさせながら、各位置でのウィンドウ内最小値を求める問題です。素朴に解くと O(NK) ですが、単調増加デク（monotone deque）を使うことで O(N) で解けます。\n\n単調デクにはインデックスを格納します。デクの先頭が常に現在のウィンドウ内の最小値のインデックスになるよう、2つの「お掃除」操作を維持してください。',
  inputFormat: {
    params: [
      { name: 'a', type: 'vector<int>', desc: '入力配列（長さ N）' },
      { name: 'K', type: 'int',        desc: 'ウィンドウ幅' },
    ],
    note: '出力: 各ウィンドウ位置（i = K-1 〜 N-1）における最小値、計 N-K+1 個\n制約: 1 ≤ K ≤ N ≤ 10^6、|a[i]| ≤ 10^9',
    examples: [
      {
        input: 'a = [3,1,2,4,1], K = 3',
        output: '1 1 1',
        explanation: 'ウィンドウ [3,1,2]→1, [1,2,4]→1, [2,4,1]→1'
      },
      {
        input: 'a = [5,3,1,4,2], K = 2',
        output: '3 1 1 2',
        explanation: 'ウィンドウ [5,3]→3, [3,1]→1, [1,4]→1, [4,2]→2'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'vector<int> slideMin(const vector<int>& a, int K) {' },
    { id: 1,  code: '    int n = a.size();' },
    { id: 2,  code: '    vector<int> res;' },
    { id: 3,  code: '    deque<int> dq;  // インデックスを格納する単調増加デク' },
    { id: 4,  code: '    for (int i = 0; i < n; i++) {' },
    { id: 5,  code: '        while (!dq.empty() && dq.front() < i - K + 1)' },
    { id: 6,  code: '            dq.pop_front();' },
    { id: 7,  code: '        while (!dq.empty() && a[dq.back()] >= a[i])' },
    { id: 8,  code: '            dq.pop_back();' },
    { id: 9,  code: '        dq.push_back(i);' },
    { id: 10, code: '        if (i >= K - 1) res.push_back(a[dq.front()]);' },
    { id: 11, code: '    }' },
    { id: 12, code: '    return res;' },
    { id: 13, code: '}  // end slideMin' },
    { id: 14, code: 'int main() {' },
    { id: 15, code: '    int n, K;' },
    { id: 16, code: '    cin >> n >> K;' },
    { id: 17, code: '    vector<int> a(n);' },
    { id: 18, code: '    for (int i = 0; i < n; i++) cin >> a[i];' },
    { id: 19, code: '    vector<int> ans = slideMin(a, K);' },
    { id: 20, code: '    for (int x : ans) cout << x << "\\n";' },
    { id: 21, code: '}  // end main' },
  ],
  // slideMin 関数（id:0〜13）と main 関数（id:14〜21）は順不同だが slideMin が先が自然
  // デクへの 2 段階お掃除（id:5〜6 → id:7〜8）の順序が重要
  // pop_front（古い要素除去）が先、pop_back（単調性維持）が後
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [4, 5], [5, 6],           // pop_front: ウィンドウ外インデックスを除去
    [6, 7], [7, 8],           // pop_back: 単調性を維持（新要素 a[i] より大きい要素を除去）
    [8, 9],                   // 新インデックスをデクに追加
    [9, 10], [10, 11],
    [11, 12], [12, 13],
    [13, 14],                 // main は slideMin の後
    [14, 15], [15, 16], [16, 17], [17, 18], [18, 19], [19, 20], [20, 21],
  ],
  hints: [
    '先頭お掃除（pop_front）: デク先頭がウィンドウの左端 i-K+1 より古いインデックスなら除去。ウィンドウ外の古い最小候補を捨てる',
    '末尾お掃除（pop_back）: 新要素 a[i] 以上の末尾インデックスを除去。後から来た a[i] の方が小さく長持ちするので不要になる',
    'デク先頭が常に現在ウィンドウの最小値インデックス。i >= K-1 になって初めてウィンドウが満杯なので結果を記録する',
  ],
  explanation: {
    summary: '単調増加デクは「将来の最小値候補として不要なインデックス」を常に捨てることで、デクの先頭が現ウィンドウの最小値インデックスを指すよう維持します。各インデックスはデクへの追加・削除が各 1 回のみなので全体 O(N) です。',
    points: [
      'pop_front（先頭除去）: ウィンドウが右にスライドすると左端が変わる。古いインデックスが範囲外になったら取り除く',
      'pop_back（末尾除去・単調性維持）: a[dq.back()] >= a[i] の間末尾を捨てる。新しい a[i] の方が小さいので古い大きい値は最小値候補にならない',
      'push_back(i): 現インデックスを追加。デクは常に「インデックス昇順 & 対応する a の値昇順」の単調性を保つ',
      '各要素は push/pop 合わせて O(1) 回しか操作されないため全体 O(N)',
    ],
    complexity: { time: 'O(N)', space: 'O(K)（デクのサイズ）' },
    tip: 'スライド最大値は a[dq.back()] <= a[i] に変えるだけです。DP の最適化（区間 DP、単調キュー最適化DP）でもこの単調デクのパターンが頻出します。「余計な候補を即座に捨てる」という発想が競プロ高速化の鍵になります。',
  },
});
