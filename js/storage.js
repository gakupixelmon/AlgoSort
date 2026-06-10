/**
 * storage.js - localStorage管理モジュール
 * ストリーク・クリア状況・ユーザーデータを管理
 */

const Storage = (() => {
  const KEYS = {
    STREAK: 'algosort_streak',
    LAST_PLAYED: 'algosort_last_played',
    MAX_STREAK: 'algosort_max_streak',
    CLEARED: 'algosort_cleared',
    TOTAL_SOLVED: 'algosort_total_solved',
  };

  function load(key, defaultValue) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? JSON.parse(val) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('localStorage save failed:', e);
    }
  }

  // 今日の日付を YYYY-MM-DD 形式で返す
  function todayStr() {
    return new Date().toISOString().slice(0, 10);
  }

  // ストリーク情報を取得
  function getStreak() {
    return {
      current: load(KEYS.STREAK, 0),
      max: load(KEYS.MAX_STREAK, 0),
      lastPlayed: load(KEYS.LAST_PLAYED, null),
    };
  }

  // 問題クリア時にストリーク更新
  function recordClear(problemId) {
    const today = todayStr();
    const lastPlayed = load(KEYS.LAST_PLAYED, null);
    let streak = load(KEYS.STREAK, 0);

    if (lastPlayed === today) {
      // 今日すでにプレイ済み → ストリークはそのまま
    } else if (lastPlayed === getPrevDay(today)) {
      // 昨日もプレイ → 連続継続
      streak += 1;
    } else {
      // 途切れた or 初回
      streak = 1;
    }

    save(KEYS.LAST_PLAYED, today);
    save(KEYS.STREAK, streak);

    const maxStreak = load(KEYS.MAX_STREAK, 0);
    if (streak > maxStreak) save(KEYS.MAX_STREAK, streak);

    // クリア済み問題リストに追加
    const cleared = load(KEYS.CLEARED, {});
    cleared[problemId] = { clearedAt: today };
    save(KEYS.CLEARED, cleared);

    // 総解答数
    const total = load(KEYS.TOTAL_SOLVED, 0);
    save(KEYS.TOTAL_SOLVED, total + 1);

    return streak;
  }

  function getPrevDay(dateStr) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  }

  function isClear(problemId) {
    const cleared = load(KEYS.CLEARED, {});
    return !!cleared[problemId];
  }

  function getTotalSolved() {
    return load(KEYS.TOTAL_SOLVED, 0);
  }

  // ストリークが今日有効かチェック（日付が変わっていたらリセット）
  function checkStreakValidity() {
    const today = todayStr();
    const lastPlayed = load(KEYS.LAST_PLAYED, null);
    const streak = load(KEYS.STREAK, 0);

    if (!lastPlayed) return 0;
    if (lastPlayed === today) return streak;
    if (lastPlayed === getPrevDay(today)) return streak; // 昨日までは有効
    // それ以上前ならストリークリセット
    save(KEYS.STREAK, 0);
    return 0;
  }

  // Firebaseから取得したデータでローカルストレージを同期
  function syncFromFirebase(data) {
    if (data.currentStreak !== undefined) save(KEYS.STREAK, data.currentStreak);
    if (data.maxStreak !== undefined) save(KEYS.MAX_STREAK, data.maxStreak);
    if (data.lastPlayed !== undefined) save(KEYS.LAST_PLAYED, data.lastPlayed);
    if (data.totalClears !== undefined) save(KEYS.TOTAL_SOLVED, data.totalClears);
    if (data.clearedIds && Array.isArray(data.clearedIds)) {
      const cleared = load(KEYS.CLEARED, {});
      data.clearedIds.forEach(id => { cleared[id] = cleared[id] || { clearedAt: todayStr() } });
      save(KEYS.CLEARED, cleared);
    }
  }

  return { getStreak, recordClear, isClear, getTotalSolved, checkStreakValidity, syncFromFirebase };
})();
