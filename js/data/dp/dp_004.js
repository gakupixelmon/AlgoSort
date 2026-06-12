// dp_004: コイン問題（最小枚数） ★3 (C++)
// 典型的な DP 問題：最小枚数でお釣りを作る
(window.PROBLEMS_REGISTRY = window.PROBLEMS_REGISTRY || []).push({
  id: 'dp_004',
  title: 'コイン問題（最小枚数）',
  category: 'dp',
  categoryLabel: '動的計画法',
  difficulty: 3,
  language: 'cpp',
  description: '【コイン問題とは】「ある金額をコインで作るとき、最小何枚使えばよいか」という問題です。例えば 1 円・5 円・7 円コインで 11 円を作るとき、7+1+1+1=4 枚より 5+5+1=3 枚の方が少なく、さらに 7+4=7+1+1+1+1 より... と全探索すると指数時間かかりますが、DP を使うと O(amount × coins の種類数) で解けます。\n\n使用可能なコインの種類 coins と目標金額 amount が与えられる。amount を作るために必要なコインの最小枚数を返せ。作ることが不可能な場合は -1 を返す。',
  inputFormat: {
    params: [
      { name: 'coins', type: 'vector<int>&', desc: 'コインの種類のリスト（例: {1, 5, 7}）' },
      { name: 'amount', type: 'int', desc: '作りたい目標金額' },
    ],
    note: '戻り値: int（最小コイン枚数、不可能なら -1）\n制約: 1 ≤ coins.size() ≤ 12、1 ≤ coins[i] ≤ 10^4、0 ≤ amount ≤ 10^4\n各コインは何枚でも使える（無制限）',
    examples: [
      {
        input: 'coins = [1, 5, 7], amount = 11',
        output: '3',
        explanation: '7 + 1 + 1 + 1 = 4 枚より、5 + 5 + 1 = 3 枚が最小です。'
      },
      {
        input: 'coins = [2], amount = 3',
        output: '-1',
        explanation: '2 円コインだけでは 3 円を作ることができないため -1 を返します。'
      }
    ],
  },
  pinnedCode: ['#include <bits/stdc++.h>', 'using namespace std;'],
  blocks: [
    { id: 0,  code: 'int coinChange(vector<int>& coins, int amount) {' },
    { id: 1,  code: '    vector<int> dp(amount + 1, INT_MAX);' },
    { id: 2,  code: '    dp[0] = 0;' },
    { id: 3,  code: '    for (int i = 1; i <= amount; i++) {' },
    { id: 4,  code: '        for (int c : coins) {' },
    { id: 5,  code: '            if (i >= c && dp[i - c] != INT_MAX) {' },
    { id: 6,  code: '                dp[i] = min(dp[i], dp[i - c] + 1);' },
    { id: 7,  code: '            }' },
    { id: 8,  code: '        }' },
    { id: 9,  code: '    }' },
    { id: 10, code: '    return dp[amount] == INT_MAX ? -1 : dp[amount];' },
    { id: 11, code: '}' },
  ],
  // id:7, id:8, id:9 はすべて } で同一テキスト。
  // id:7 は if の直後（dp[i]のminを取った後）、id:8 は coins ループの直後、id:9 は amount ループの直後
  // 7 < 8 < 9 の順序を強制
  partialOrder: [
    [0, 1], [1, 2], [2, 3],
    [3, 4], [4, 5], [5, 6], [6, 7],
    [7, 8], [8, 9],
    [9, 10], [10, 11],
  ],
  hints: [
    'dp[i] = 「金額 i を作るときの最小コイン枚数」。dp[0]=0（0円は0枚）、それ以外は INT_MAX で初期化',
    '金額 i について、各コイン c を試す。i >= c かつ dp[i-c] が有効（INT_MAX でない）なら dp[i] = min(dp[i], dp[i-c]+1) で更新',
    '最後に dp[amount] が INT_MAX のままなら -1、そうでなければ dp[amount] を返す',
  ],
  explanation: {
    summary: 'コイン問題は「無制限ナップサック」の変形です。dp[i] に「金額 i を作る最小枚数」を記録し、各金額について全コインで緩和を行います。不可能な状態を INT_MAX で表し、最後に -1 に変換するのがポイントです。',
    points: [
      'dp[0]=0 がベースケース（0円はコイン0枚で作れる）',
      '外側ループは金額 i=1 から amount まで。内側ループは全コイン c について更新',
      'dp[i-c] != INT_MAX の確認は「INT_MAX + 1 でのオーバーフローを防ぐ」ための安全チェック',
      '無制限（Unbounded Knapsack）なので内側ループを正順にするだけでよい（0-1 ナップサックと違い逆順不要）',
    ],
    complexity: { time: 'O(amount × coins.size())', space: 'O(amount)' },
    tip: 'dp の初期化を amount+1 にするとき、vector<int> dp(amount+1, amount+1) で「amount+1 枚（不可能より大きい枚数）」を使う実装もあります。この場合 INT_MAX オーバーフローの心配が不要になります。',
  },
});
