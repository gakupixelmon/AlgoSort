// cp_030: 動的括弧列クエリ (セグメント木) ★5 (C++)
// 競プロ典型：括弧列（やA/Bの増減）の整合性は「+1/-1の累積和の最小値」をセグメント木に乗せることで動的に処理できる
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_030',
  title: '動的括弧列クエリ (セグメント木)',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 5,
  language: 'cpp',
  description: '【括弧列の整合性とセグメント木】\n長さ N の \'(\' と \')\' からなる文字列 S が与えられます。\n以下の Q 個のクエリを処理してください。\n\nタイプ 1 : i 文字目を c に変更する。\nタイプ 2 : S の l 文字目から r 文字目までの部分文字列が、正しい括弧列であれば Yes、そうでなければ No と出力する。\n\n※提示された「AとBからなる文字列で、任意のプレフィックスでAの数がBの数以上であるかを動的に判定する問題」の類似・発展問題です。「正しい括弧列」はそれに加えて「全体の和が0」という条件が追加された有名な典型問題です。',
  inputFormat: {
    params: [
      { name: 'n', type: 'int', desc: '文字列の長さ N' },
      { name: 'q', type: 'int', desc: 'クエリの数 Q' },
      { name: 's', type: 'string', desc: '初期文字列 S' },
    ],
    note: 'クエリ制約: タイプ1(1 i c), タイプ2(2 l r)\n制約: 1 ≤ N, Q ≤ 5×10^5',
    examples: [
      {
        input: '5 3\n(())\n2 1 4\n1 2 )\n2 1 4',
        output: 'Yes\nNo',
        explanation: '最初の 1~4 文字目は (()) なので正しい括弧列です。2文字目を ) に変更すると ())) となり、正しい括弧列ではなくなります。'
      }
    ]
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'struct Node {' },
    { id: 1,  code: '    long long sum;' },
    { id: 2,  code: '    long long min_pref;' },
    { id: 3,  code: '};' },
    { id: 4,  code: 'Node merge_nodes(Node left, Node right) {' },
    { id: 5,  code: '    Node res;' },
    { id: 6,  code: '    res.sum = left.sum + right.sum;' },
    { id: 7,  code: '    res.min_pref = min(left.min_pref, left.sum + right.min_pref);' },
    { id: 8,  code: '    return res;' },
    { id: 9,  code: '}' },
    { id: 10, code: '// セグメント木の実装 (点更新・区間取得)' },
    { id: 11, code: 'void update(int v, int tl, int tr, int pos, int val, vector<Node>& tree) {' },
    { id: 12, code: '    if (tl == tr) {' },
    { id: 13, code: '        tree[v] = {val, min(0, val)};' },
    { id: 14, code: '    } else {' },
    { id: 15, code: '        int tm = (tl + tr) / 2;' },
    { id: 16, code: '        if (pos <= tm) update(v*2, tl, tm, pos, val, tree);' },
    { id: 17, code: '        else update(v*2+1, tm+1, tr, pos, val, tree);' },
    { id: 18, code: '        tree[v] = merge_nodes(tree[v*2], tree[v*2+1]);' },
    { id: 19, code: '    }' },
    { id: 20, code: '}' },
    { id: 21, code: 'Node query(int v, int tl, int tr, int l, int r, const vector<Node>& tree) {' },
    { id: 22, code: '    if (l > r) return {0, 0};' },
    { id: 23, code: '    if (l == tl && r == tr) return tree[v];' },
    { id: 24, code: '    int tm = (tl + tr) / 2;' },
    { id: 25, code: '    return merge_nodes(query(v*2, tl, tm, l, min(r, tm), tree),' },
    { id: 26, code: '                       query(v*2+1, tm+1, tr, max(l, tm+1), r, tree));' },
    { id: 27, code: '}' },
    { id: 28, code: '// 判定: クエリ結果の node に対して node.min_pref >= 0 && node.sum == 0 ならば Yes' },
  ],
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9],
    [10, 11], [11, 12], [12, 13], [13, 14], [14, 15], [15, 16], [16, 17], [17, 18], [18, 19], [19, 20],
    [21, 22], [22, 23], [23, 24], [24, 25], [25, 26], [26, 27]
  ],
  hints: [
    '\'(\' を +1、\')\' を -1 としたとき、正しい括弧列の条件は「途中の累積和が常に0以上」かつ「全体の総和が0」です。',
    '提示されたA/Bの挿入問題は「途中の累積和が常に0以上（A=1, B=-1）」のみを要求される問題と言い換えることができます。',
    '区間内の「総和」と「累積和の最小値」をモノイドとしてセグメント木に乗せることで、更新 O(log N)、クエリ O(log N) で処理できます。',
    '左部分木 L と右部分木 R をマージするとき、全体の総和は L.sum + R.sum、全体の最小値は min(L.min_pref, L.sum + R.min_pref) になります。'
  ],
  explanation: {
    summary: '括弧列（あるいは2種類の文字の増減）の整合性は、+1 / -1 に置き換えて「累積和の最小値」を管理することで判定できます。動的な更新がある場合はセグメント木が有効です。',
    points: [
      '要素の点更新を行うと、それ以降の累積和全体が変化してしまいますが、「区間の総和」と「区間のプレフィックスサムの最小値」をセグメント木に持たせると、遅延評価なしにマージのみで計算可能です。',
      '提示された問題「AとABの挿入」は、Bの前には必ずAが必要であるため、A=1, B=-1 としたときの「累積和の最小値が0以上（途中でBが多すぎない）」という条件に帰着できます。',
      'このデータ構造・モノイドの考え方は、競技プログラミングにおいて非常に多くの応用（最大部分配列和、括弧列の深さなど）が効く超重要テクニックです。'
    ],
    complexity: { time: '更新 O(\\log N), 取得 O(\\log N)', space: 'O(N)' },
    tip: '区間に対するクエリで「累積和」を考えたいときは、「その区間内での総和 (sum)」と「左端からの累積和の最大/最小 (pref)」をセットで管理するセグメント木を組むのが定石です。'
  }
});
