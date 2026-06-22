// cp_013: 二進数分割（Binary Decomposition）による個数制限ナップサック ★3 (C++)
// 競プロ典型：個数 m を 1,2,4,... に分割して 0-1 ナップサックに帰着させる
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_013',
  title: '二進数分割（Binary Decomposition）',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 3,
  language: 'cpp',
  description: '【二進数分割とは】個数制限付きナップサック問題（各アイテムを最大 m 個まで使える）を解くテクニックです。m 個のアイテムを「1, 2, 4, …, 2^(k-1) 個の疑似アイテム群 + 余り」に分割すると O(log m) 種類のアイテムで 0 〜 m 個を全て表現できます。これにより O(N × m × W) の素朴解を O(N × log m × W) に改善できます。\n\nN 種のアイテム（重さ w、価値 v、最大個数 m）と容量 W のナップサックが与えられる。二進数分割で 0-1 ナップサック化し、最大価値を求めよ。',
  inputFormat: {
    params: [
      { name: 'N', type: 'int', desc: 'アイテムの種類数' },
      { name: 'W', type: 'int', desc: 'ナップサックの容量' },
    ],
    note: '各アイテム: w v m（重さ・価値・最大個数）\n制約: 1 ≤ N ≤ 100、1 ≤ W ≤ 10^4、1 ≤ w,v ≤ 10^3、1 ≤ m ≤ 10^3',
    examples: [
      {
        input: 'N=1, W=10, アイテム: w=3, v=4, m=5',
        output: '12',
        explanation: '容量10にw=3を3個（=9）入れると価値12が最大。分割後の疑似アイテム: {3,4},{6,8},{6,8}（1+2+2=5）'
      },
      {
        input: 'N=2, W=10, アイテム: (w=2,v=3,m=3), (w=3,v=5,m=2)',
        output: '13',
        explanation: '(w=2,v=3)×2 + (w=3,v=5)×2 = 合計重さ10、価値16が最大（実際の計算を行う）'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'void solve() {' },
    { id: 1,  code: '    int N, W;' },
    { id: 2,  code: '    cin >> N >> W;' },
    { id: 3,  code: '    vector<int> weight, value;' },
    { id: 4,  code: '    for (int i = 0; i < N; i++) {' },
    { id: 5,  code: '        int w, v, m;' },
    { id: 6,  code: '        cin >> w >> v >> m;' },
    { id: 7,  code: '        for (int k = 1; k <= m; k *= 2) {' },
    { id: 8,  code: '            weight.push_back(k * w);' },
    { id: 9,  code: '            value.push_back(k * v);' },
    { id: 10, code: '            m -= k;' },
    { id: 11, code: '        }  // end 2^k グループ' },
    { id: 12, code: '        if (m > 0) {' },
    { id: 13, code: '            weight.push_back(m * w);' },
    { id: 14, code: '            value.push_back(m * v);' },
    { id: 15, code: '        }  // end remainder' },
    { id: 16, code: '    }  // end items loop' },
    { id: 17, code: '    vector<int> dp(W + 1, 0);' },
    { id: 18, code: '    for (int i = 0; i < (int)weight.size(); i++) {' },
    { id: 19, code: '        for (int j = W; j >= weight[i]; j--) {' },
    { id: 20, code: '            dp[j] = max(dp[j], dp[j - weight[i]] + value[i]);' },
    { id: 21, code: '        }  // end j loop' },
    { id: 22, code: '    }  // end dp loop' },
    { id: 23, code: '    cout << dp[W] << endl;' },
    { id: 24, code: '}  // end solve' },
  ],
  // solve の宣言（id:0）→ 変数初期化（id:1〜3）→ アイテム読込ループ（id:4〜16）
  // 二進数分割内ループ（id:7〜11）は k の累乗グループを疑似アイテムとして追加
  // 余り処理（id:12〜15）は分割ループの後
  // 0-1 ナップサック DP（id:17〜22）はアイテム列挙の後
  // j の逆順ループが 0-1 ナップサックの重複選択防止のポイント
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [4, 5], [5, 6], [6, 7],
    [7, 8], [8, 9], [9, 10], [10, 11],
    [11, 12], [12, 13], [13, 14], [14, 15],
    [15, 16],
    [16, 17], [17, 18],
    [18, 19], [19, 20], [20, 21],
    [21, 22],
    [22, 23], [23, 24],
  ],
  hints: [
    '二進数分割: k=1 から k*=2 でループ。1+2+4+…で最大 2^k-1 個を 0-1 ナップサック的に表現できる。m から k を引きながら余りを別途追加すると 0〜m 個を全て表現可能',
    'k のループ条件は k <= m に注意。m -= k した後 k*=2 するので、余りが次の k より小さくなった時点でループが終わる',
    '0-1 ナップサックの内側ループは j を W から逆順（j >= weight[i]）に回すことで「同一アイテムの重複選択」を防ぐ',
  ],
  explanation: {
    summary: '整数 m は 1+2+4+…+2^(k-1)+r（r = 余り）と分割でき、O(log m) 個のグループで 0〜m の全ての整数を表現できます。各グループを「1つのアイテム」として 0-1 ナップサックに入れると、素朴な O(m) 個展開より大幅に高速化できます。',
    points: [
      '二進数分割の核心: 任意の整数は二進数（1,2,4,8…）の和で表せる → O(log m) 個のグループで 0〜m 個を全表現',
      '余り処理: ループ終了後に m > 0 ならその分の疑似アイテムを追加して「ちょうど m 個」までカバー',
      '0-1 ナップサックの内側逆順ループ: j を大きい方から更新することで dp[j-w] が「今回のアイテムを使う前の値」を指す',
      '計算量: O(N × log(max_m) × W)。素朴解 O(N × m × W) に比べ log 因子分の高速化',
    ],
    complexity: { time: 'O(N × log(max_m) × W)', space: 'O(W)' },
    tip: '二進数分割は「個数制限ナップサック」の定番高速化です。さらに高速化するなら単調キュー最適化（O(NW)）も存在しますが、実装の簡単さから競プロでは二進数分割が最頻出です。',
  },
});
