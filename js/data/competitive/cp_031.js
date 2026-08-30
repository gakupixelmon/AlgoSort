// cp_031: カード集めゲームの操作回数 (分割統治NTT) ★6 (C++)
// 競プロ典型：確率や期待値、状態遷移を母関数（多項式）の積として表し、分割統治NTTで高速に係数を求める
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_031',
  title: 'カード集めゲームの操作回数 (分割統治NTT)',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 6,
  language: 'cpp',
  description: '【確率と母関数・分割統治NTT】\n1 から N までの整数が書かれた N 枚のカードがランダムに裏向きで並んでいます。\nあなたは「現在のターゲット x を探し、見つけたら食べ、見つからなければ裏に戻して記憶する」という最適戦略でカードを集めます。\n全てのカードを食べ終わるまでの操作回数が K 回となる確率を mod 998244353 で求めてください。\n（期待値最小化のための最適戦略に従ったときの確率分布を求める問題です）',
  inputFormat: {
    params: [
      { name: 'n', type: 'int', desc: 'カードの枚数 N' },
      { name: 'k', type: 'long long', desc: '求める操作回数 K' },
    ],
    note: '出力: 操作回数が K 回となる確率 (mod 998244353)\n制約: 1 ≤ N ≤ 5×10^5, N ≤ K ≤ 10^9',
    examples: [
      {
        input: '2 3',
        output: '499122177',
        explanation: 'N=2のとき、カードの並びは (1,2), (2,1) のいずれかです。(1,2) なら 1→2 で K=2 回。(2,1) なら 1を探して2をめくり裏返す→1をめくり食べる→2は記憶しているので直接めくり食べる、で K=3 回。よって K=3 となる確率は 1/2 です。1/2 ≡ 499122177 (mod 998244353) となります。'
      }
    ]
  },
  pinnedCode: [
    '#include <bits/stdc++.h>',
    '#include <atcoder/modint>',
    '#include <atcoder/convolution>',
    'using namespace std;',
    'using namespace atcoder;',
    'using mint = modint998244353;'
  ],
  blocks: [
    { id: 0,  code: 'mint solveCardGameProbability(int n, long long k) {' },
    { id: 1,  code: '    // 操作回数は最低でも N 回かかる。K - N が追加で失敗する（裏返す）回数' },
    { id: 2,  code: '    if (k < n || k > 2LL * n) return 0;' },
    { id: 3,  code: '    int extra = k - n;' },
    { id: 4,  code: '    ' },
    { id: 5,  code: '    // 分割統治で多項式の積を計算するラムダ式' },
    { id: 6,  code: '    auto dfs = [&](auto& self, int l, int r) -> vector<mint> {' },
    { id: 7,  code: '        if (l + 1 == r) {' },
    { id: 8,  code: '            mint inv_i = mint(l).inv();' },
    { id: 9,  code: '            // 定数項: 1/i (失敗0回), 1次の項: (i-1)/i (失敗1回)' },
    { id: 10, code: '            return {inv_i, mint(l - 1) * inv_i};' },
    { id: 11, code: '        }' },
    { id: 12, code: '        int m = (l + r) / 2;' },
    { id: 13, code: '        return convolution(self(self, l, m), self(self, m, r));' },
    { id: 14, code: '    };' },
    { id: 15, code: '    ' },
    { id: 16, code: '    // i = 1 から N までの多項式を掛け合わせる' },
    { id: 17, code: '    vector<mint> poly = dfs(dfs, 1, n + 1);' },
    { id: 18, code: '    ' },
    { id: 19, code: '    if (extra < poly.size()) {' },
    { id: 20, code: '        return poly[extra];' },
    { id: 21, code: '    }' },
    { id: 22, code: '    return 0;' },
    { id: 23, code: '} // end solveCardGameProbability' }
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10],
    [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16], [16, 17], [17, 18],
    [18, 19], [19, 20], [20, 21], [21, 22], [22, 23]
  ],
  hints: [
    '未知のカードは互いに等価であるため、「探しているカードが既知ならそれをめくる。未知なら一番左の未知のカードをめくる」という戦略が最適になります。',
    'この戦略では、数 i (1 ≤ i ≤ N) のカードがめくられる回数は、「1 から i のカードの中で、i が一番右にあるとき 1 回」「そうでないとき 2 回」となります。',
    'カードはランダムに並んでいるため、i が 1~i の中で一番右にある確率は 1/i です。',
    'それぞれの i が独立に操作回数 +1 または +2 に寄与するとみなせるため、求める確率は Π ( (1/i)x + ((i-1)/i)x^2 ) の x^K の係数になります。'
  ],
  explanation: {
    summary: '期待値や確率の分布を独立な事象の和として分解し、それらの母関数（多項式）の積として定式化して分割統治NTTで高速に計算する典型的な高度問題です。',
    points: [
      'ゲームの最適戦略を解析すると、各カード i に対する操作回数が独立な確率変数になることがわかります。',
      'カード i に対する寄与は (1/i) * x + ((i-1)/i) * x^2 と表せます。全体としてはこれらを i=1..N について掛け合わせた多項式の係数を求めればよいです。',
      'N個の1次多項式の積は、半分ずつ掛け合わせていく「分割統治」と「NTT（高速フーリエ変換の剰余環版）」を組み合わせることで O(N (\\log N)^2) で計算できます。'
    ],
    complexity: { time: 'O(N (\\log N)^2)', space: 'O(N \\log N)' },
    tip: 'atcoder/convolution を使うとNTTを簡単に呼び出せます。多項式をたくさん掛ける場合は必ず分割統治法を用いて、次数をバランスよく増やすのが O(N (\\log N)^2) に抑えるコツです。'
  }
});
