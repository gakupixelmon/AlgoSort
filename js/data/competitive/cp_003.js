// cp_003: スタックを使った括弧の対応チェック ★2 (C++)
// 競プロ頻出：スタックで括弧列の妥当性を検証する
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'cp_003',
  title: '括弧列の妥当性チェック（スタック）',
  category: 'competitive',
  categoryLabel: '競技プログラミング',
  difficulty: 2,
  language: 'cpp',
  description: '【問題】\n文字列 s が与えられる。s に含まれる括弧（(, ), [, ], {, }）の対応が正しい「妥当な括弧列」かどうかを判定せよ。\n\n妥当な括弧列の条件：\n・開き括弧と対応する閉じ括弧が同じ種類\n・すべての閉じ括弧に対応する開き括弧がある\n・括弧は正しくネストしている\n\n【制約】\n・s の長さ ≤ 10^4\n・s は括弧文字のみからなる\n\n【ポイント】\nスタック（後入れ先出し）を使うと、「直近に開いた括弧と閉じ括弧を対応させる」操作を自然に実装できる。競プロでも面接でも頻出の古典問題。',
  inputFormat: {
    params: [
      { name: 's', type: 'string', desc: '括弧のみからなる文字列' },
    ],
    note: '戻り値: bool（妥当な括弧列なら true、そうでなければ false）',
    examples: [
      {
        input: 's = "([{}])"',
        output: 'true',
        explanation: '全ての開き括弧に対応する閉じ括弧があり、正しくネストしています。'
      },
      {
        input: 's = "([)]"',
        output: 'false',
        explanation: '[ と ) が対応しておらず、ネストが崩れています。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0, code: 'bool isValid(string s) {' },
    { id: 1, code: '    stack<char> st;' },
    { id: 2, code: '    map<char,char> match = {{")", "("}, {"]", "["}, {"}", "{"}};' },
    { id: 3, code: '    for (char c : s) {' },
    { id: 4, code: '        if (c == "(" || c == "[" || c == "{") {' },
    { id: 5, code: '            st.push(c);' },
    { id: 6, code: '        } else {' },
    { id: 7, code: '            if (st.empty() || st.top() != match[c]) return false;' },
    { id: 8, code: '            st.pop();' },
    { id: 9, code: '        }' },
    { id: 10, code: '    }' },
    { id: 11, code: '    return st.empty();' },
    { id: 12, code: '}' },
  ],
  // id:1（stack宣言）と id:2（matchマップ）はどちらが先でも正解
  partialOrder: [
    [0, 1], [0, 2],       // stack と map はどちらが先でも可
    [1, 3], [2, 3],       // forループは st と match の両方に依存
    [3, 4], [4, 5], [4, 6], // if(開き括弧) の分岐
    [5, 9], [6, 7],       // push後→}, チェック後
    [7, 8], [8, 9],       // pop→}
    [9, 10], [10, 11], [11, 12], // for終了→return→関数閉じ
  ],
  hints: [
    'スタックを使う。開き括弧（(, [, {）が来たらスタックに積む',
    '閉じ括弧が来たら、スタックが空 or トップの文字が対応する開き括弧でなければ false を返す。正しければ pop する',
    'ループ終了後、スタックが空ならすべての括弧が対応していた（true）、そうでなければ false',
  ],
  explanation: {
    summary: 'スタックは「最後に開いた括弧と最初に閉じるべき括弧が対応する」という LIFO の性質を活かして、括弧のネスト検証に最適です。',
    points: [
      'map<char,char> で閉じ括弧→開き括弧の対応を事前定義。if-else の羅列を避けてスマートに書ける',
      '閉じ括弧チェック: st.empty()（対応する開き括弧がない）or st.top() != match[c]（種類が違う）で false',
      'ループ後 st.empty() が残った開き括弧チェック。st が空でないと括弧が余っている',
      '時間計算量 O(N)：各文字を1回ずつ処理するだけ',
    ],
    complexity: { time: 'O(N)', space: 'O(N)（最悪ケース：すべて開き括弧）' },
    tip: 'スタックの応用として「次に大きい要素（Next Greater Element）」「単調スタック」など多数の競プロ問題に発展します。括弧の問題は面接でも頻出。',
  },
});
