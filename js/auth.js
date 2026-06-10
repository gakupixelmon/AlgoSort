/**
 * auth.js - GitHub OAuth 認証管理
 *
 * window.AuthManager を公開する。
 * FIREBASE_ENABLED = false の場合はすべての操作が no-op になる。
 */

const AuthManager = (() => {
  let _currentUser  = null;
  let _githubLogin  = null; // GitHub ユーザー名（@id形式）

  // ─── 初期化 ──────────────────────────────────────────────
  function init() {
    if (!window.FIREBASE_ENABLED || !window.firebaseAuth) return;

    firebaseAuth.onAuthStateChanged(async (user) => {
      _currentUser = user;

      if (user && window.db) {
        // publicProfiles から githubLogin を読み取る（ページリロード対応）
        try {
          const profileDoc = await db.collection('publicProfiles').doc(user.uid).get();
          if (profileDoc.exists) {
            const data = profileDoc.data();
            _githubLogin = data.githubLogin || null;
            if (window.Storage && Storage.syncFromFirebase) {
              Storage.syncFromFirebase(data);
            }
          }
        } catch (_e) { /* 読み取り失敗は無視 */ }
      } else {
        _githubLogin = null;
      }

      _updateUI(user);

      // ログイン済みならプロフィールURLボタンを表示
      if (_githubLogin && window.ProfileManager) {
        ProfileManager.renderProfileLinkBtn(_githubLogin);
      }
      
      // ホーム画面の場合は更新して最新のストリーク等を反映
      if (window.App && App.getCurrentScreen && App.getCurrentScreen() === 'home') {
        App.renderHome();
      }
    });
  }

  // ─── GitHub ログイン（ポップアップ） ──────────────────────
  function signInWithGitHub() {
    if (!window.FIREBASE_ENABLED || !window.firebaseAuth) return;

    const provider = new firebase.auth.GithubAuthProvider();
    firebaseAuth.signInWithPopup(provider)
      .then(async (result) => {
        const login = result.additionalUserInfo?.username || result.user.displayName || '';
        _githubLogin = login || null;
        console.info('[Auth] Signed in as:', login);

        // Firestore に GitHub ログインを保存（公開プロフィール用）
        if (login && window.db) {
          const uid = result.user.uid;
          try {
            const batch = db.batch();
            // ユーザー名 → UID のルックアップテーブル
            batch.set(
              db.collection('usersByLogin').doc(login.toLowerCase()),
              { uid }
            );
            // 公開プロフィールの基本情報を初期化
            batch.set(
              db.collection('publicProfiles').doc(uid),
              {
                githubLogin:  login,
                displayName:  result.user.displayName || login,
                avatarUrl:    result.user.photoURL   || '',
              },
              { merge: true }
            );
            await batch.commit();
          } catch (e) {
            console.warn('[Auth] Failed to write usersByLogin:', e);
          }
        }

        // プロフィールURLボタンを表示
        if (login && window.ProfileManager) {
          ProfileManager.renderProfileLinkBtn(login);
        }
      })
      .catch((err) => {
        if (err.code === 'auth/popup-closed-by-user') return;
        console.error('[Auth] signInWithGitHub error:', err);
        if (window.App) App.showFeedback('ログインに失敗しました', 'error');
      });
  }

  // ─── ログアウト ──────────────────────────────────────────
  function signOut() {
    if (!window.FIREBASE_ENABLED || !window.firebaseAuth) return;
    firebaseAuth.signOut().then(() => {
      _githubLogin = null;
      // プロフィールURLボタンを隠す
      const container = document.getElementById('profile-link-container');
      if (container) container.style.display = 'none';
      if (window.App) App.showFeedback('ログアウトしました');
    });
  }

  // ─── 現在のユーザー取得 ───────────────────────────────────
  function getCurrentUser()  { return _currentUser; }
  function getGitHubLogin()  { return _githubLogin; }

  // ─── 内部: UI 更新 ────────────────────────────────────────
  function _updateUI(user) {
    const section  = document.getElementById('auth-section');
    const loginBtn = document.getElementById('auth-login-btn');
    const userInfo = document.getElementById('auth-user-info');
    const avatar   = document.getElementById('auth-avatar');
    const username = document.getElementById('auth-username');

    if (section) section.style.display = 'flex';

    if (user) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (userInfo) userInfo.style.display = 'flex';
      if (avatar)   { avatar.src = user.photoURL || ''; avatar.style.display = user.photoURL ? 'block' : 'none'; }
      if (username) username.textContent = _githubLogin || user.displayName || 'User';
    } else {
      if (loginBtn) loginBtn.style.display = 'flex';
      if (userInfo) userInfo.style.display = 'none';
    }
  }

  return { init, signInWithGitHub, signOut, getCurrentUser, getGitHubLogin };
})();

window.AuthManager = AuthManager;
