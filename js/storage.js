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
    TICKETS: 'algosort_freeze_tickets',
    TICKET_PROGRESS: 'algosort_ticket_progress',
    CATCHUP_PROGRESS: 'algosort_catchup_progress',
    DECAY_APPLIED_MISSED_DAYS: 'algosort_decay_applied_missed_days',
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
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function parseLocalDate(dateStr) {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function formatLocalDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  function daysBetween(fromDateStr, toDateStr) {
    const from = parseLocalDate(fromDateStr);
    const to = parseLocalDate(toDateStr);
    return Math.floor((to - from) / 86400000);
  }

  function applyMissedDayDecay(streak, missedDayNumber) {
    if (missedDayNumber === 1) return Math.max(1, Math.floor(streak * 0.5));
    if (missedDayNumber === 2) return Math.max(1, Math.floor(streak * 0.4));
    return 0;
  }

  // ストリーク情報を取得
  function getStreak() {
    return {
      current: load(KEYS.STREAK, 0),
      max: load(KEYS.MAX_STREAK, 0),
      lastPlayed: load(KEYS.LAST_PLAYED, null),
      tickets: load(KEYS.TICKETS, 0),
      ticketProgress: load(KEYS.TICKET_PROGRESS, 0),
      catchupProgress: load(KEYS.CATCHUP_PROGRESS, 0),
    };
  }

  function hasPlayedToday() {
    return load(KEYS.LAST_PLAYED, null) === todayStr();
  }

  // 問題クリア時にストリーク更新
  function recordClear(problemId) {
    // まず日付チェック（自動救済などの反映）
    checkStreakValidity();

    const today = todayStr();
    const lastPlayed = load(KEYS.LAST_PLAYED, null);
    let streak = load(KEYS.STREAK, 0);
    let catchupProgress = load(KEYS.CATCHUP_PROGRESS, 0);
    let maxStreak = load(KEYS.MAX_STREAK, 0);
    let bonusTriggered = false;

    if (lastPlayed === today) {
      // 今日すでにプレイ済み → ストリークはそのまま
      save(KEYS.DECAY_APPLIED_MISSED_DAYS, 0);
    } else if (lastPlayed === getPrevDay(today)) {
      // 昨日もプレイ → 連続継続
      streak += 1;
      catchupProgress += 1;
      save(KEYS.DECAY_APPLIED_MISSED_DAYS, 0);
      
      if (catchupProgress >= 15) {
        catchupProgress = 0;
        if (streak < maxStreak) {
          streak += 1;
          bonusTriggered = true;
        }
      }
    } else if (lastPlayed && daysBetween(lastPlayed, today) <= 3 && streak > 0) {
      // 1〜2日空いた場合は、減衰後のストリークに今日分を加えて復帰する
      streak += 1;
      catchupProgress = 1;
      save(KEYS.DECAY_APPLIED_MISSED_DAYS, 0);
    } else {
      // 初回、または3日以上空いて完全消滅した状態から再開
      streak = 1;
      catchupProgress = 1;
      save(KEYS.DECAY_APPLIED_MISSED_DAYS, 0);
    }

    save(KEYS.CATCHUP_PROGRESS, catchupProgress);
    save(KEYS.LAST_PLAYED, today);
    save(KEYS.STREAK, streak);

    if (streak > maxStreak) {
      maxStreak = streak;
      save(KEYS.MAX_STREAK, maxStreak);
    }

    // クリア済み問題リストに追加
    const cleared = load(KEYS.CLEARED, {});
    cleared[problemId] = { clearedAt: today };
    save(KEYS.CLEARED, cleared);

    // 総解答数
    const total = load(KEYS.TOTAL_SOLVED, 0);
    save(KEYS.TOTAL_SOLVED, total + 1);

    return { newStreak: streak, bonusTriggered };
  }

  function getPrevDay(dateStr) {
    const d = parseLocalDate(dateStr);
    d.setDate(d.getDate() - 1);
    return formatLocalDate(d);
  }

  function isClear(problemId) {
    const cleared = load(KEYS.CLEARED, {});
    return !!cleared[problemId];
  }

  function getTotalSolved() {
    return load(KEYS.TOTAL_SOLVED, 0);
  }

  // ストリークが今日有効かチェック（日付が変わっていたら減衰を反映）
  function checkStreakValidity() {
    const today = todayStr();
    let lastPlayed = load(KEYS.LAST_PLAYED, null);
    let streak = load(KEYS.STREAK, 0);
    let appliedMissedDays = load(KEYS.DECAY_APPLIED_MISSED_DAYS, 0);

    if (!lastPlayed) return 0;
    const elapsedDays = daysBetween(lastPlayed, today);

    if (elapsedDays <= 0) {
      save(KEYS.DECAY_APPLIED_MISSED_DAYS, 0);
      return streak;
    }

    const missedDays = elapsedDays - 1;
    if (missedDays <= 0) {
      save(KEYS.DECAY_APPLIED_MISSED_DAYS, 0);
      return streak; // 昨日までは有効
    }

    for (let d = appliedMissedDays + 1; d <= missedDays; d++) {
      streak = applyMissedDayDecay(streak, d);
    }

    save(KEYS.DECAY_APPLIED_MISSED_DAYS, missedDays);
    save(KEYS.STREAK, streak);
    return streak;
  }

  // Firebaseから取得したデータでローカルストレージを同期
  function syncFromFirebase(data) {
    if (data.currentStreak !== undefined) save(KEYS.STREAK, data.currentStreak);
    if (data.maxStreak !== undefined) save(KEYS.MAX_STREAK, data.maxStreak);
    if (data.lastPlayed !== undefined) save(KEYS.LAST_PLAYED, data.lastPlayed);
    if (data.tickets !== undefined) save(KEYS.TICKETS, data.tickets);
    if (data.ticketProgress !== undefined) save(KEYS.TICKET_PROGRESS, data.ticketProgress);
    if (data.catchupProgress !== undefined) save(KEYS.CATCHUP_PROGRESS, data.catchupProgress);
    if (data.totalClears !== undefined) save(KEYS.TOTAL_SOLVED, data.totalClears);
    if (data.clearedIds && Array.isArray(data.clearedIds)) {
      const cleared = load(KEYS.CLEARED, {});
      data.clearedIds.forEach(id => { cleared[id] = cleared[id] || { clearedAt: todayStr() } });
      save(KEYS.CLEARED, cleared);
    }
  }

  return { getStreak, hasPlayedToday, recordClear, isClear, getTotalSolved, checkStreakValidity, syncFromFirebase };
})();
