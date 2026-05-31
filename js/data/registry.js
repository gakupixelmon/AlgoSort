/**
 * registry.js - 問題レジストリ・カテゴリ定義・DataManager
 *
 * 問題ファイル（js/data/カテゴリ/問題ID.js）が先に読み込まれ、
 * window.PROBLEMS_REGISTRY に問題データを push しておく。
 * このファイルで PROBLEMS_DB に自動集約し、DataManager を通じて提供する。
 *
 * ── 新しい問題の追加手順 ──────────────────────────────
 * 1. js/data/<カテゴリ>/<問題ID>.js を作成（末尾に push する形式で）
 * 2. index.html に <script src="js/data/<カテゴリ>/<問題ID>.js"> を追加
 *    （registry.js より前に読み込む）
 * 3. 新カテゴリが必要な場合のみ下の CATEGORIES 配列に追加
 * ─────────────────────────────────────────────────────
 */

// ── PROBLEMS_DB: 問題ファイルから自動集約 ──────────────────
// window.PROBLEMS_DB に代入して全スクリプトからアクセス可能にする
window.PROBLEMS_DB = window.PROBLEMS_DB || {};
const PROBLEMS_DB = window.PROBLEMS_DB;
(window.PROBLEMS_REGISTRY || []).forEach(p => {
  if (!PROBLEMS_DB[p.category]) PROBLEMS_DB[p.category] = [];
  PROBLEMS_DB[p.category].push(p);
});
// 各カテゴリを ID 順（数値比較）でソート
Object.values(PROBLEMS_DB).forEach(arr =>
  arr.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))
);

// ── カテゴリ定義 ──────────────────────────────────────────
// randomEligible: false のカテゴリはランダムモードの出題対象外
window.CATEGORIES = window.CATEGORIES || [];
const CATEGORIES = window.CATEGORIES = [
  {
    id: 'basic',
    label: '基本アルゴリズム',
    icon: '⚡',
    color: '#22d3ee',
    available: true,
    randomEligible: true,
  },
  {
    id: 'dp',
    label: '動的計画法',
    icon: '📊',
    color: '#fb923c',
    available: true,
    randomEligible: true,
  },
  {
    id: 'graph',
    label: 'グラフ理論',
    icon: '🕸️',
    color: '#a78bfa',
    available: true,
    randomEligible: true,
  },
  {
    id: 'dijkstra',
    label: 'ダイクストラ法',
    icon: '🗺️',
    color: '#34d399',
    available: true,
    randomEligible: true,
  },
  {
    id: 'deep_learning',
    label: '深層学習',
    icon: '🧠',
    color: '#f472b6',
    available: true,
    randomEligible: false,   // ← ランダムモードには出題しない
  },
];

// ── DataManager ───────────────────────────────────────────
// window.DataManager に代入して確実にグローバル公開
const DataManager = window.DataManager = (() => {
  // 全問題をフラットなリストで返す（カテゴリモード用）
  function getAllProblems() {
    return Object.values(PROBLEMS_DB).flat();
  }

  // ランダムモード対象の問題だけを返す（randomEligible: false のカテゴリを除外）
  function getRandomEligibleProblems() {
    const eligibleCatIds = new Set(
      CATEGORIES.filter((c) => c.randomEligible !== false).map((c) => c.id)
    );
    return getAllProblems().filter((p) => eligibleCatIds.has(p.category));
  }

  // カテゴリで絞り込み
  function getProblemsByCategory(categoryId) {
    return PROBLEMS_DB[categoryId] || [];
  }

  // 難易度で絞り込み（ランダムモード用：randomEligible のものだけ）
  function getProblemsByDifficulty(difficulty) {
    return getRandomEligibleProblems().filter((p) => p.difficulty === difficulty);
  }

  // IDで1問取得（全問題から）
  function getProblemById(id) {
    return getAllProblems().find((p) => p.id === id) || null;
  }

  // 難易度を指定してランダムに1問取得（randomEligible のみ）
  function getRandomProblemByDifficulty(difficulty) {
    const pool = getProblemsByDifficulty(difficulty);
    if (pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  // 全ランダム対象問題からランダムに1問取得
  function getRandomProblem() {
    const all = getRandomEligibleProblems();
    if (all.length === 0) return null;
    return all[Math.floor(Math.random() * all.length)];
  }

  // ランダムモード用：問題が存在する難易度一覧（randomEligible のみ）
  function getAvailableDifficulties() {
    const all = getRandomEligibleProblems();
    const set = new Set(all.map((p) => p.difficulty));
    return [1, 2, 3, 4, 5].filter((d) => set.has(d));
  }

  // カテゴリ情報を返す
  function getCategories() {
    return CATEGORIES;
  }

  // ブロックをシャッフル
  function shuffleBlocks(blocks) {
    const arr = [...blocks];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  return {
    getAllProblems,
    getRandomEligibleProblems,
    getProblemsByCategory,
    getProblemsByDifficulty,
    getProblemById,
    getRandomProblem,
    getRandomProblemByDifficulty,
    getAvailableDifficulties,
    getCategories,
    shuffleBlocks,
  };
})();
