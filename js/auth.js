/**
 * auth.js - GitHub OAuth 認証管理
 *
 * window.AuthManager を公開する。
 * FIREBASE_ENABLED = false の場合はすべての操作が no-op になる。
 */

const AuthManager = (() => {
  let _currentUser = null;

  // ─── 初期化 ──────────────────────────────────────────────
  function init() {
    if (!window.FIREBASE_ENABLED || !window.firebaseAuth) return;

    // 認証状態の監視
    firebaseAuth.onAuthStateChanged((user) => {
      _currentUser = user;
      _updateUI(user);
    });
  }

  // ─── GitHub ログイン（ポップアップ） ──────────────────────
  function signInWithGitHub() {
    if (!window.FIREBASE_ENABLED || !window.firebaseAuth) return;

    const provider = new firebase.auth.GithubAuthProvider();
    firebaseAuth.signInWithPopup(provider)
      .then((result) => {
        // additionalUserInfo に GitHub ユーザー名が入っている
        const login = result.additionalUserInfo?.username || result.user.displayName || '';
        console.info('[Auth] Signed in as:', login);
      })
      .catch((err) => {
        if (err.code === 'auth/popup-closed-by-user') return; // キャンセルは無視
        console.error('[Auth] signInWithGitHub error:', err);
        if (window.App) App.showFeedback('ログインに失敗しました', 'error');
      });
  }

  // ─── ログアウト ──────────────────────────────────────────
  function signOut() {
    if (!window.FIREBASE_ENABLED || !window.firebaseAuth) return;
    firebaseAuth.signOut().then(() => {
      if (window.App) App.showFeedback('ログアウトしました');
    });
  }

  // ─── 現在のユーザー取得 ───────────────────────────────────
  function getCurrentUser() {
    return _currentUser;
  }

  // ─── 内部: UI 更新 ────────────────────────────────────────
  function _updateUI(user) {
    const section  = document.getElementById('auth-section');
    const loginBtn = document.getElementById('auth-login-btn');
    const userInfo = document.getElementById('auth-user-info');
    const avatar   = document.getElementById('auth-avatar');
    const username = document.getElementById('auth-username');

    // セクション全体を表示（Firebase 有効時のみ呼ばれる）
    if (section) section.style.display = 'flex';

    if (user) {
      // ─ ログイン済み ─
      const displayName = user.displayName || user.email || 'GitHub User';
      const photoURL    = user.photoURL;

      if (loginBtn) loginBtn.style.display = 'none';
      if (userInfo) userInfo.style.display = 'flex';
      if (avatar)   { avatar.src = photoURL || ''; avatar.style.display = photoURL ? 'block' : 'none'; }
      if (username) username.textContent = displayName;
    } else {
      // ─ 未ログイン ─
      if (loginBtn) loginBtn.style.display = 'flex';
      if (userInfo) userInfo.style.display = 'none';
    }
  }

  return { init, signInWithGitHub, signOut, getCurrentUser };
})();

window.AuthManager = AuthManager;
