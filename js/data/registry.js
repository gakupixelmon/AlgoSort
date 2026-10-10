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

// ── カテゴリ内テーマ ─────────────────────────────────────
// problemIds はカテゴリ内の問題 ID。未分類の問題は一覧末尾の「その他」に表示する。
const CATEGORY_SECTIONS = {
  basic: [
    { label: 'ソート・整列', problemIds: ['basic_001', 'basic_002', 'basic_005', 'basic_008', 'basic_009'] },
    { label: '探索・貪欲法', problemIds: ['basic_003', 'basic_004', 'basic_006', 'basic_007'] },
  ],
  dp: [
    { label: 'DP の基礎', problemIds: ['dp_001', 'dp_004', 'dp_006'] },
    { label: '典型・発展 DP', problemIds: ['dp_002', 'dp_003', 'dp_005'] },
  ],
  graph: [
    { label: '探索・彩色', problemIds: ['graph_001', 'graph_002', 'graph_003', 'graph_004', 'graph_013', 'graph_014'] },
    { label: '連結性・DAG', problemIds: ['graph_005', 'graph_007', 'graph_015'] },
    { label: '最小全域木', problemIds: ['graph_006', 'graph_008', 'graph_009'] },
    { label: '最短路・木の構造', problemIds: ['graph_010', 'graph_011', 'graph_012'] },
  ],
  dijkstra: [
    { label: '最短路アルゴリズム', problemIds: ['dijkstra_001', 'dijkstra_002'] },
  ],
  competitive: [
    { label: '基本テクニック・数列', problemIds: ['cp_001', 'cp_002', 'cp_003', 'cp_010', 'cp_013', 'cp_014', 'cp_015', 'cp_016', 'cp_018', 'cp_029', 'cp_033', 'cp_036'] },
    { label: 'データ構造・クエリ', problemIds: ['cp_004', 'cp_005', 'cp_006', 'cp_007', 'cp_008', 'cp_009', 'cp_011', 'cp_012', 'cp_030', 'cp_039', 'cp_040'] },
    { label: 'DP・組合せ・構築', problemIds: ['cp_017', 'cp_021', 'cp_022', 'cp_031', 'cp_035', 'cp_037', 'cp_041'] },
    { label: '数論・文字列', problemIds: ['cp_023', 'cp_024', 'cp_025'] },
    { label: 'グラフ・最適化', problemIds: ['cp_019', 'cp_020', 'cp_028', 'cp_032', 'cp_038'] },
    { label: '幾何・高速化', problemIds: ['cp_026', 'cp_027', 'cp_034', 'cp_042'] },
  ],
  heuristic: [
    { label: '初期解の構築', problemIds: ['heuristic_001', 'heuristic_003'] },
    { label: '局所探索・確率的改善', problemIds: ['heuristic_002'] },
  ],
  applied: [
    { label: '深層学習・基礎と学習', problemIds: ['dl_001', 'dl_002', 'dl_003', 'dl_004', 'dl_005', 'dl_006', 'dl_007', 'dl_008', 'dl_010', 'dl_012', 'dl_013', 'dl_024', 'dl_025', 'dl_026', 'dl_028', 'dl_029', 'dl_040'] },
    { label: '深層学習・CNNとRNN', problemIds: ['dl_009', 'dl_014', 'dl_015', 'dl_016', 'dl_017', 'dl_018'] },
    { label: '深層学習・TransformerとLLM', problemIds: ['dl_011', 'dl_019', 'dl_020', 'dl_021', 'dl_027', 'dl_030', 'dl_031', 'dl_032', 'dl_034', 'dl_035', 'dl_036', 'dl_037', 'dl_038'] },
    { label: '深層学習・生成と表現学習', problemIds: ['dl_022', 'dl_023', 'dl_039'] },
    { label: '強化学習', problemIds: ['dl_033'] },
    { label: '状態推定・制御', problemIds: ['kalman_001'] },
  ],
};

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
    sections: CATEGORY_SECTIONS.basic,
  },
  {
    id: 'dp',
    label: '動的計画法',
    icon: '📊',
    color: '#fb923c',
    available: true,
    randomEligible: true,
    sections: CATEGORY_SECTIONS.dp,
  },
  {
    id: 'graph',
    label: 'グラフ理論',
    icon: '🕸️',
    color: '#a78bfa',
    available: true,
    randomEligible: true,
    sections: CATEGORY_SECTIONS.graph,
  },
  {
    id: 'dijkstra',
    label: 'ダイクストラ法',
    icon: '🗺️',
    color: '#34d399',
    available: true,
    randomEligible: true,
    sections: CATEGORY_SECTIONS.dijkstra,
  },
  {
    id: 'applied',
    label: '応用',
    icon: '🔬',
    color: '#f472b6',
    available: true,
    randomEligible: false,   // ← ランダムモードには出題しない
    sections: CATEGORY_SECTIONS.applied,
  },
  {
    id: 'competitive',
    label: '競技プログラミング',
    icon: '🏆',
    color: '#facc15',
    available: true,
    randomEligible: true,
    sections: CATEGORY_SECTIONS.competitive,
  },
  {
    id: 'heuristic',
    label: 'ヒューリスティック最適化',
    icon: '🎯',
    color: '#fb7185',
    available: true,
    randomEligible: false,
    sections: CATEGORY_SECTIONS.heuristic,
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

  // カテゴリ内テーマを返す。問題追加時に未登録でも「その他」へ表示される。
  function getCategorySections(categoryId) {
    const category = CATEGORIES.find((item) => item.id === categoryId);
    return category?.sections || [];
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
    getCategorySections,
    shuffleBlocks,
  };
})();
