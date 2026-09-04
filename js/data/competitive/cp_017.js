// cp_017: 高々K個の連続区間を選ぶDP ★4 (C++)
// 競プロ典型：差分に変換し、最大K個の非交差区間の最大和をDPで求める
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_017',
  title: '高々K個の連続区間を選ぶDP',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 4,
  language: 'cpp',
  description: '【問題】\nN 日間の売上予測があります。日 i は通常営業なら A_i 円、キャンペーンを実施すると B_i 円の売上になります。キャンペーンは高々 K 回まで実施でき、1回のキャンペーンでは連続する日付区間 [l, r] を選んで、その区間内の全日をキャンペーン日にします。\n\n全期間の売上合計として考えられる最大値を求めてください。\n\n【ポイント】\n通常営業の合計を base とし、キャンペーンに切り替えたときの差分 gain_i = B_i - A_i を考えると、「gain 配列から高々 K 個の連続区間を選び、その和を最大化する問題」に変換できます。これはカードを区間反転する問題と同じ構造で、区間の内側にいるかどうかを状態に持つDPで解けます。',
  inputFormat: {
    params: [
      { name: 'A', type: 'vector<long long>', desc: '通常営業時の売上配列' },
      { name: 'B', type: 'vector<long long>', desc: 'キャンペーン実施時の売上配列' },
      { name: 'K', type: 'int', desc: '選べる連続区間の最大個数' },
    ],
    note: '戻り値: long long（最大売上合計）\n制約: 1 ≤ N ≤ 2×10^5、0 ≤ K ≤ N、|A_i|, |B_i| ≤ 10^9',
    examples: [
      {
        input: 'A = [3, 2, 5, 4, 1]\nB = [5, 1, 8, 2, 6]\nK = 2',
        output: '24',
        explanation: 'base = 15、gain = [2, -1, 3, -2, 5]。区間 [1,3] の gain 4 と区間 [5,5] の gain 5 を選ぶと、合計 15 + 9 = 24 になります。'
      },
      {
        input: 'A = [10, 1, 1, 10]\nB = [1, 8, 9, 1]\nK = 1',
        output: '37',
        explanation: 'gain = [-9, 7, 8, -9] なので、2〜3日目だけをキャンペーンにするのが最適です。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'long long maxCampaignSales(const vector<long long>& A, const vector<long long>& B, int K) {' },
    { id: 1,  code: '    int n = A.size();' },
    { id: 2,  code: '    long long base = 0;' },
    { id: 3,  code: '    vector<long long> gain(n);' },
    { id: 4,  code: '    for (int i = 0; i < n; i++) {' },
    { id: 5,  code: '        base += A[i];' },
    { id: 6,  code: '        gain[i] = B[i] - A[i];' },
    { id: 7,  code: '    }' },
    { id: 8,  code: '    const long long NEG = -(1LL << 60);' },
    { id: 9,  code: '    vector<long long> out(K + 1, NEG), in(K + 1, NEG);' },
    { id: 10, code: '    out[0] = 0;' },
    { id: 11, code: '    for (int i = 0; i < n; i++) {' },
    { id: 12, code: '        vector<long long> nextOut = out, nextIn(K + 1, NEG);' },
    { id: 13, code: '        for (int j = 0; j <= K; j++) {' },
    { id: 14, code: '            nextOut[j] = max(nextOut[j], in[j]);' },
    { id: 15, code: '            if (in[j] != NEG) nextIn[j] = max(nextIn[j], in[j] + gain[i]);' },
    { id: 16, code: '            if (j > 0 && out[j - 1] != NEG) nextIn[j] = max(nextIn[j], out[j - 1] + gain[i]);' },
    { id: 17, code: '        }' },
    { id: 18, code: '        out.swap(nextOut);' },
    { id: 19, code: '        in.swap(nextIn);' },
    { id: 20, code: '    }' },
    { id: 21, code: '    long long best = 0;' },
    { id: 22, code: '    for (int j = 0; j <= K; j++) {' },
    { id: 23, code: '        best = max({best, out[j], in[j]});' },
    { id: 24, code: '    }' },
    { id: 25, code: '    return base + best;' },
    { id: 26, code: '}  // end maxCampaignSales' },
  ],
  // 構文上のスコープとデータ依存だけを制約する。
  // 1. base(id:2) と n(id:1) の宣言は互いに独立。
  // 2. base/gain 計算ループ内の base+=A[i] と gain[i]=... は互いに独立。
  // 3. 内側ループ内の nextOut 更新(id:14) と nextIn 更新2式(id:15, 16) は互いに読み書きが独立しており 3!=6 通り順不同。
  // 4. swap 処理(id:18, 19) は out と in で独立しており順不同。
  // 5. DP初期化(id:8..10) と base/gain計算(id:1..7) の前後関係も許容。
  partialOrders: [
    // パターン1: base/gain計算(id:1..7) → DP初期化(id:8..10) → DPループ(id:11..)
    [
      [0, 1], [0, 2], [1, 3],
      [1, 4], [2, 4], [3, 4],
      [4, 5], [4, 6], [5, 7], [6, 7],
      [7, 8], [8, 9], [9, 10], [10, 11],
      [11, 12], [12, 13],
      [13, 14], [13, 15], [13, 16],
      [14, 17], [15, 17], [16, 17],
      [17, 18], [17, 19],
      [18, 20], [19, 20],
      [20, 21], [21, 22], [22, 23], [23, 24], [24, 25], [25, 26],
    ],
    // パターン2: DP初期化(id:8..10) → base/gain計算(id:1..7) → DPループ(id:11..)
    [
      [0, 8], [8, 9], [9, 10],
      [0, 1], [0, 2], [1, 3],
      [10, 4], [1, 4], [2, 4], [3, 4],
      [4, 5], [4, 6], [5, 7], [6, 7],
      [7, 11],
      [11, 12], [12, 13],
      [13, 14], [13, 15], [13, 16],
      [14, 17], [15, 17], [16, 17],
      [17, 18], [17, 19],
      [18, 20], [19, 20],
      [20, 21], [21, 22], [22, 23], [23, 24], [24, 25], [25, 26],
    ],
    // パターン3: NEG定数(id:8)冒頭定義 → base/gain計算(id:1..7) → out/in初期化(id:9..10) → DPループ(id:11..)
    [
      [0, 8],
      [0, 1], [0, 2], [1, 3],
      [1, 4], [2, 4], [3, 4],
      [4, 5], [4, 6], [5, 7], [6, 7],
      [7, 9], [8, 9], [9, 10], [10, 11],
      [11, 12], [12, 13],
      [13, 14], [13, 15], [13, 16],
      [14, 17], [15, 17], [16, 17],
      [17, 18], [17, 19],
      [18, 20], [19, 20],
      [20, 21], [21, 22], [22, 23], [23, 24], [24, 25], [25, 26],
    ],
  ],
  hints: [
    '【前処理】全日通常営業の売上 base = ∑A[i] を基準とし、キャンペーンによる差分 gain[i] = B[i] - A[i] を計算します。問題は「高々 K 個の連続区間を選び、その gain の合計を最大化する」ことに帰着されます',
    '【状態定義】out[j] は「j 個の区間を使い終え（または開始前）、現在は区間外」、in[j] は「まさに j 個目の区間を実行中（区間内）」の最大 gain です。初期状態は「0個使用で区間外」の out[0] = 0 のみ可能で、他はすべて到達不能（NEG）で初期化します',
    '【区間外の更新】各日 i では、前日の状態から nextOut = out、nextIn を NEG で用意します。現在の日をキャンペーンにしない（通常営業に戻る）場合は、開いていた区間を閉じるため nextOut[j] を in[j] で更新します（何もしない遷移はコピー初期化で反映済み）',
    '【区間内の更新と集計】現在の日をキャンペーンにする場合は、既存区間の継続 in[j] + gain[i] と、新しい区間の開始 out[j-1] + gain[i] の最大値で nextIn[j] を更新します。最終日は全 j について out[j], in[j] の最大値を求め、base に足して返します',
  ],
  explanation: {
    summary: 'この問題は、元の合計 base と差分 gain に分けると「高々 K 個の連続区間の最大和」になります。区間の外にいる状態 out と、区間の中にいる状態 in を持つことで、各日を O(K) で処理できます。',
    points: [
      'gain[i] が正ならキャンペーンにしたい日、負なら通常営業のままにしたい日。ただし連続区間としてまとめて選ぶ制約がある',
      'out[j]: j 個の区間を使い終えた、または区間外にいる状態。in[j]: j 個目の区間を開いている状態',
      'nextOut[j] = max(out[j], in[j]) は、現在の日を選ばず、開いていた区間を閉じる遷移',
      'nextIn[j] は、開いている区間を継続する遷移 in[j] + gain[i] と、新しい区間を開始する遷移 out[j-1] + gain[i] の最大',
      '最後は区間外でも区間内でもよいので、すべての j について out[j] と in[j] の最大を取る',
    ],
    complexity: { time: 'O(NK)', space: 'O(K)' },
    tip: '区間反転・キャンペーン期間・休暇期間など、「高々 K 個の連続区間を選ぶ」形に変換できる問題では、この out/in DP がそのまま使えます。',
  },
});
