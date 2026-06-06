/**
 * community.js - コミュニティ統計管理（Firestore）
 *
 * Firestore コレクション構造:
 *   /problemStats/{problemId}
 *     - attemptCount : number  （ユニーク挑戦人数）
 *     - clearCount   : number  （ユニーククリア人数）
 *
 *   /userStats/{uid}
 *     - displayName  : string
 *     - avatarUrl    : string
 *     - attempts     : { [problemId]: timestamp }
 *     - clears       : { [problemId]: timestamp }
 *
 * FIREBASE_ENABLED = false の場合はすべての操作が no-op になる。
 */

const CommunityStats = (() => {
  // セッション内で記録済みの問題を追跡（無駄な読み込みを防ぐ）
  const _attemptedInSession = new Set();
  const _clearedInSession   = new Set();

  // ─── 単一問題の統計を取得 ─────────────────────────────────
  async function getProblemStats(problemId) {
    if (!window.FIREBASE_ENABLED || !window.db) return null;
    try {
      const doc = await db.collection('problemStats').doc(problemId).get();
      return doc.exists
        ? doc.data()
        : { attemptCount: 0, clearCount: 0 };
    } catch (e) {
      console.warn('[Community] getProblemStats error:', e);
      return null;
    }
  }

  // ─── 複数問題の統計を一括取得 ──────────────────────────────
  async function getBatchStats(problemIds) {
    if (!window.FIREBASE_ENABLED || !window.db || !problemIds.length) return {};
    try {
      const promises = problemIds.map((id) =>
        db.collection('problemStats').doc(id).get()
      );
      const docs = await Promise.all(promises);
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
    if (_attemptedInSession.has(problemId)) return; // セッション内で既記録

    const user = window.AuthManager ? AuthManager.getCurrentUser() : null;
    if (!user) return; // 未ログインは記録しない

    const uid      = user.uid;
    const userRef  = db.collection('userStats').doc(uid);
    const statsRef = db.collection('problemStats').doc(problemId);

    try {
      const userDoc  = await userRef.get();
      const userData = userDoc.exists ? userDoc.data() : {};
      const attempts = userData.attempts || {};

      if (!attempts[problemId]) {
        // 初めての挑戦 → カウントをインクリメント
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

    const uid      = user.uid;
    const userRef  = db.collection('userStats').doc(uid);
    const statsRef = db.collection('problemStats').doc(problemId);

    try {
      const userDoc  = await userRef.get();
      const userData = userDoc.exists ? userDoc.data() : {};
      const clears   = userData.clears || {};

      if (!clears[problemId]) {
        const batch = db.batch();
        batch.set(userRef, {
          clears: { ...clears, [problemId]: Date.now() },
        }, { merge: true });
        batch.set(statsRef, {
          clearCount: firebase.firestore.FieldValue.increment(1),
        }, { merge: true });
        await batch.commit();
        console.info(`[Community] Clear recorded: ${problemId}`);
      }
      _clearedInSession.add(problemId);
    } catch (e) {
      console.warn('[Community] recordClear error:', e);
    }
  }

  return { getProblemStats, getBatchStats, recordAttempt, recordClear };
})();

window.CommunityStats = CommunityStats;
