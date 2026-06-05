// basic_006: 区間スケジューリング（貪欲法）★3 (C++)
// 競プロ典型：終了時刻でソートして貪欲に選ぶ
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'basic_006',
  title: '区間スケジューリング（貪欲法）',
  category: 'basic',
  categoryLabel: '基本アルゴリズム',
  difficulty: 3,
  language: 'cpp',
  description: '【問題】\nN 個の会議 i がある。それぞれ開始時刻 s[i]、終了時刻 e[i] を持つ。\n会議室は 1 つしかなく、同時に複数の会議は開催できない（終了時刻 = 次の会議の開始時刻は OK）。\n開催できる会議の最大数を求めよ。\n\n【制約】\n・N ≤ 10^5\n・0 ≤ s[i] < e[i] ≤ 10^9\n\n【ポイント】\n「終了時刻が早い会議を優先して選ぶ」という貪欲戦略が最適解を与える。\nsort で終了時刻順に並べ、現在の終了時刻以降に始まる会議を選ぶだけでよい。',
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0, code: 'int schedule(vector<pair<int,int>>& meetings) {' },
    { id: 1, code: '    sort(meetings.begin(), meetings.end(),' },
    { id: 2, code: '         [](auto& a, auto& b){ return a.second < b.second; });' },
    { id: 3, code: '    int count = 0, cur = 0;' },
    { id: 4, code: '    for (auto& [s, e] : meetings) {' },
    { id: 5, code: '        if (s >= cur) {' },
    { id: 6, code: '            count++;' },
    { id: 7, code: '            cur = e;' },
    { id: 8, code: '        }' },
    { id: 9, code: '    }' },
    { id: 10, code: '    return count;' },
    { id: 11, code: '}' },
  ],
  // count++（id:6）と cur=e（id:7）は互いに独立 → どちらが先でも正解
  partialOrder: [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
    [5, 6], [5, 7],   // どちらも if(s>=cur) の後に来る
    [6, 8], [7, 8],   // } (id:8) は count++ と cur=e の両方の後
    [8, 9], [9, 10], [10, 11],
  ],
  hints: [
    'まず会議を「終了時刻が早い順」にソートする。開始時刻ではなく終了時刻でソートするのがポイント',
    'cur（現在の終了時刻）を 0 で初期化し、s >= cur なら会議を選んで cur = e に更新する',
    '選んだ会議数 count を返す。貪欲法なので全探索不要で O(N log N) で解ける',
  ],
  explanation: {
    summary: '区間スケジューリング問題は「終了時刻でソートして貪欲に選ぶ」ことで最適解が得られる典型的な貪欲法問題です。なぜ最適か？「最も早く終わる会議を選ぶ」ことで、次の会議に残せる時間を最大化できるからです。',
    points: [
      '「開始時刻が早い順」にソートする貪欲法は最適にならない反例がある。必ず「終了時刻が早い順」でソートする',
      's >= cur の条件で「重複なし」を確認。等号 OK は「前の会議の終了と同時に次が始まれる」仕様による',
      '選んだ後は cur = e で現在の終了時刻を更新。次の会議はここ以降から始まる必要がある',
      'O(N log N) のソートが支配的。貪欲の選択自体は O(N)。典型的な競プロ上位問題のテンプレ',
    ],
    complexity: { time: 'O(N log N)', space: 'O(1)' },
    tip: 'AtCoder では「区間」「最大本数」「重複しない」というキーワードが揃ったらこのテンプレを疑え。応用として「区間を最小本数でカバーする」問題（開始時刻でソート）もある。',
  },
});
