/**
 * community.js - コミュニティ統計管理（Firestore）
 *
 * Firestore コレクション構造:
 *   /problemStats/{problemId}
 *     - attemptCount : number  （ユニーク挑戦人数）
 *     - clearCount   : number  （ユニーククリア人数）
 *
 *   /userStats/{uid}          ← プライベート
 *     - displayName  : string
 *     - avatarUrl    : string
 *     - attempts     : { [problemId]: timestamp }
 *     - clears       : { [problemId]: timestamp }
 *
 *   /publicProfiles/{uid}     ← 公開（草グラフ用）
 *     - githubLogin   : string
 *     - displayName   : string
 *     - avatarUrl     : string
 *     - totalClears   : number
 *     - clearedIds    : string[]
 *     - dailyActivity : { [YYYY-MM-DD]: number }
 *
 *   /usersByLogin/{githubLogin} ← 公開（UID ルックアップ）
 *     - uid : string
 *
 * FIREBASE_ENABLED = false の場合はすべての操作が no-op になる。
 */

const CommunityStats = (() => {
  const _attemptedInSession = new Set();
  const _clearedInSession   = new Set();

  // ─── 単一問題の統計を取得 ─────────────────────────────────
  async function getProblemStats(problemId) {
    if (!window.FIREBASE_ENABLED || !window.db) return null;
    try {
      const doc = await db.collection('problemStats').doc(problemId).get();
      return doc.exists ? doc.data() : { attemptCount: 0, clearCount: 0 };
    } catch (e) {
      console.warn('[Community] getProblemStats error:', e);
      return null;
    }
  }

  // ─── 複数問題の統計を一括取得 ──────────────────────────────
  async function getBatchStats(problemIds) {
    if (!window.FIREBASE_ENABLED || !window.db || !problemIds.length) return {};
    try {
      const docs = await Promise.all(
        problemIds.map((id) => db.collection('problemStats').doc(id).get())
      );
      const result = {};
      docs.forEach((doc, i) => {
        result[problemIds[i]] = doc.exists
          ? doc.data()
          : { attemptCount: 0, clearCount: 0 };
      });
      return result;
    } catch (e) {
      console.warn('[Community] getBatchStats error:', e);
      return {};
    }
  }

  // ─── 挑戦を記録（ユニーク） ───────────────────────────────
  async function recordAttempt(problemId) {
    if (!window.FIREBASE_ENABLED || !window.db) return;
    if (_attemptedInSession.has(problemId)) return;

    const user = window.AuthManager ? AuthManager.getCurrentUser() : null;
    if (!user) return;

    const uid      = user.uid;
    const userRef  = db.collection('userStats').doc(uid);
    const statsRef = db.collection('problemStats').doc(problemId);

    try {
      const userDoc  = await userRef.get();
      const userData = userDoc.exists ? userDoc.data() : {};
      const attempts = userData.attempts || {};

      if (!attempts[problemId]) {
        const batch = db.batch();
        batch.set(userRef, {
          displayName: user.displayName || '',
          avatarUrl:   user.photoURL   || '',
          attempts: { ...attempts, [problemId]: Date.now() },
        }, { merge: true });
        batch.set(statsRef, {
          attemptCount: firebase.firestore.FieldValue.increment(1),
        }, { merge: true });
        await batch.commit();
        console.info(`[Community] Attempt recorded: ${problemId}`);
      }
      _attemptedInSession.add(problemId);
    } catch (e) {
      console.warn('[Community] recordAttempt error:', e);
    }
  }

  // ─── クリアを記録（ユニーク） ──────────────────────────────
  async function recordClear(problemId) {
    if (!window.FIREBASE_ENABLED || !window.db) return;
    if (_clearedInSession.has(problemId)) return;

    const user = window.AuthManager ? AuthManager.getCurrentUser() : null;
    if (!user) return;

    const uid       = user.uid;
    const userRef   = db.collection('userStats').doc(uid);
    const statsRef  = db.collection('problemStats').doc(problemId);
    const publicRef = db.collection('publicProfiles').doc(uid);

    try {
      const userDoc  = await userRef.get();
      const userData = userDoc.exists ? userDoc.data() : {};
      const clears   = userData.clears || {};

      if (!clears[problemId]) {
        // 今日の日付文字列 YYYY-MM-DD
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
        
        const streakInfo = window.Storage ? Storage.getStreak() : null;

        const batch = db.batch();

        // ① プライベート統計（userStats）
        batch.set(userRef, {
          clears: { ...clears, [problemId]: Date.now() },
        }, { merge: true });

        // ② 全体統計（problemStats）
        batch.set(statsRef, {
          clearCount: firebase.firestore.FieldValue.increment(1),
        }, { merge: true });

        // ③ 公開プロフィール（草グラフ用）
        //    dailyActivity.YYYY-MM-DD をインクリメント（ドット記法でネストフィールドを指定）
        batch.set(publicRef, {
          totalClears:              firebase.firestore.FieldValue.increment(1),
          clearedIds:               firebase.firestore.FieldValue.arrayUnion(problemId),
          [`dailyActivity.${dateStr}`]: firebase.firestore.FieldValue.increment(1),
          currentStreak: streakInfo ? streakInfo.current : 0,
          maxStreak: streakInfo ? streakInfo.max : 0,
          lastPlayed: streakInfo ? streakInfo.lastPlayed : null,
          displayName: user.displayName || '',
          avatarUrl:   user.photoURL   || '',
        }, { merge: true });

        await batch.commit();
        console.info(`[Community] Clear recorded: ${problemId} (${dateStr})`);
      }
      _clearedInSession.add(problemId);
    } catch (e) {
      console.warn('[Community] recordClear error:', e);
    }
  }

  return { getProblemStats, getBatchStats, recordAttempt, recordClear };
})();

window.CommunityStats = CommunityStats;
