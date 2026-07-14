// cp_010: いもす法（Imos Method）による区間加算 ★2 (C++)
// 競プロ典型：差分配列を使って区間への一括加算を O(1) で処理する
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_010',
  title: 'いもす法（Imos Method）による区間加算',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 2,
  language: 'cpp',
  description: '【いもす法とは】差分配列（imos 配列）を使い、「区間 [l, r] の全要素に値 v を加算する」操作を O(1) で受け付け、最後に累積和を取ることで各要素の値を O(N) で確定させる手法です。クエリが多い区間加算問題を高速に解けます。\n\nN 要素の配列（初期値 0）に対して Q 回の区間加算クエリ「[l, r] に v を加算」を処理し、最終的な配列を出力せよ。いもす法（差分配列 + 累積和）を使って O(N + Q) で解くこと。',
  inputFormat: {
    params: [
      { name: 'n', type: 'int', desc: '配列の要素数' },
      { name: 'q', type: 'int', desc: 'クエリ数' },
    ],
    note: '各クエリ: l r v → a[l], a[l+1], ..., a[r] に v を加算（0-indexed）\n制約: 1 ≤ n ≤ 10^6、1 ≤ q ≤ 10^5、0 ≤ l ≤ r < n、|v| ≤ 10^9',
    examples: [
      {
        input: 'n=5, クエリ: [0,2,+3], [1,3,+2]',
        output: '3 5 5 2 0',
        explanation: 'a=[3,3,3,0,0] に [1,3]+2 → a=[3,5,5,2,0]'
      },
      {
        input: 'n=4, クエリ: [0,3,+1], [1,2,-1]',
        output: '1 0 0 1',
        explanation: 'a=[1,1,1,1] に [1,2]-1 → a=[1,0,0,1]'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0, code: 'int main() {' },
    { id: 1, code: '    int n, q;' },
    { id: 2, code: '    cin >> n >> q;' },
    { id: 3, code: '    vector<long long> imos(n + 1, 0);' },
    { id: 4, code: '    for (int i = 0; i < q; i++) {' },
    { id: 5, code: '        int l, r; long long v;' },
    { id: 6, code: '        cin >> l >> r >> v;' },
    { id: 7, code: '        imos[l]     += v;' },
    { id: 8, code: '        imos[r + 1] -= v;' },
    { id: 9, code: '    }' },
    { id: 10, code: '    for (int i = 1; i <= n; i++)' },
    { id: 11, code: '        imos[i] += imos[i - 1];' },
    { id: 12, code: '    for (int i = 0; i < n; i++)' },
    { id: 13, code: '        cout << imos[i] << " \\n"[i == n - 1];' },
    { id: 14, code: '    return 0;' },
    { id: 15, code: '}' },
  ],
  // クエリ読込ループ（id:4〜9）は imos 配列初期化（id:3）の後
  // 差分配列への2点更新（id:7,8）は同じクエリ内で独立しているため順不同
  // 累積和ループ（id:10〜11）はクエリ処理の後
  // 出力ループ（id:12〜13）は累積和の後
  partialOrder: [
    [0, 1], [1, 2], [2, 3],
    [3, 4],
    [4, 5], [5, 6],
    [6, 7], [6, 8],
    [7, 9], [8, 9],
    [9, 10],
    [10, 11],
    [11, 12],
    [12, 13],
    [13, 14], [14, 15],
  ],
  hints: [
    '差分配列への記録: 区間 [l, r] に v を加算するには imos[l] += v と imos[r+1] -= v の 2 点だけ更新する。O(1) で完了',
    '累積和: クエリ処理後、imos[i] += imos[i-1] を i=1 から順に適用すると各要素の実際の値が確定する',
    '配列サイズは n+1 にする: imos[r+1] を書き込む場合に r = n-1 のとき imos[n] にアクセスするため',
  ],
  explanation: {
    summary: 'いもす法は「差分配列への 2 点更新」と「最後の累積和」に分けることで、Q 回の区間加算を O(Q) で受け付け O(N) で確定させます。計算量の合計は O(N + Q) です。',
    points: [
      '差分配列の原理: a[i] を直接更新する代わりに「変化量の記録場所」として imos[l] と imos[r+1] に差を書く',
      '累積和で復元: imos[i] += imos[i-1] を左から順に適用すると、各インデックスで「それまでに適用された全加算の合計」が得られる',
      '配列サイズ n+1: r = n-1 の区間に対して imos[r+1] = imos[n] を使うためにダミー要素が必要',
      '応用: 2次元いもす法（二次元差分配列）を使えば矩形区間の加算もO(1)で処理できる',
    ],
    complexity: { time: 'O(N + Q)', space: 'O(N)' },
    tip: '「何回スタンプを押したか」「電力の時間帯別消費」「イベントの同時参加人数」など幅広い問題に適用できます。区間更新 + 全体の値確定という流れが典型パターンです。',
  },
});
