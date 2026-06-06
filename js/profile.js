/**
 * profile.js - 公開プロフィール・草グラフ管理
 *
 * URL: https://algo-sort-seven.vercel.app/?user=githubUsername
 * で他者のプロフィール（ヒートマップ・クリア済み問題）を表示する。
 */

const ProfileManager = (() => {
  const MONTH_NAMES = ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'];

  // ─── URL の ?user=xxx を検知してプロフィールを表示 ────────────
  async function checkAndShow() {
    const params      = new URLSearchParams(window.location.search);
    const githubLogin = params.get('user');
    if (!githubLogin) return false;
    await show(githubLogin);
    return true;
  }

  // ─── プロフィール表示 ─────────────────────────────────────────
  async function show(githubLogin) {
    const screen = document.getElementById('profile');
    if (!screen) return;

    _activate(screen);
    screen.innerHTML = `
      <div class="profile-loading">
        <div class="profile-spinner"></div>
        <p>プロフィールを読み込み中...</p>
      </div>`;

    if (!window.FIREBASE_ENABLED || !window.db) {
      _renderError(screen, 'Firebase が設定されていません。');
      return;
    }

    try {
      // githubLogin → uid を解決
      const loginDoc = await db.collection('usersByLogin').doc(githubLogin.toLowerCase()).get();
      if (!loginDoc.exists) {
        _renderError(screen,
          `「${githubLogin}」さんのプロフィールが見つかりません。\nまだ AlgoSort にログインしていない可能性があります。`
        );
        return;
      }

      const { uid } = loginDoc.data();
      const profileDoc = await db.collection('publicProfiles').doc(uid).get();

      if (!profileDoc.exists) {
        _renderError(screen,
          'プロフィールデータがまだありません。\n問題をクリアするとアクティビティが記録されます。'
        );
        return;
      }

      _render(screen, profileDoc.data());
    } catch (e) {
      console.error('[Profile]', e);
      _renderError(screen, 'プロフィールの読み込みに失敗しました。');
    }
  }

  function _activate(screen) {
    document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
    screen.classList.add('active');
    window.scrollTo(0, 0);
  }

  function _renderError(screen, msg) {
    screen.innerHTML = `
      <div class="profile-error">
        <div class="profile-error-icon">😕</div>
        <p class="profile-error-msg">${msg.replace(/\n/g, '<br>')}</p>
        <a href="${window.location.pathname}" class="btn btn-secondary"
           style="display:inline-flex;width:auto;margin-top:20px;">← ホームへ</a>
      </div>`;
  }

  // ─── プロフィール描画 ─────────────────────────────────────────
  function _render(screen, profile) {
    const {
      githubLogin    = '',
      displayName    = '',
      avatarUrl      = '',
      totalClears    = 0,
      clearedIds     = [],
      dailyActivity  = {},
    } = profile;

    const weeks           = _buildHeatmap(dailyActivity);
    const activeDays      = Object.values(dailyActivity).filter((v) => v > 0).length;
    const clearedProblems = window.DataManager
      ? clearedIds.map((id) => DataManager.getProblemById(id)).filter(Boolean)
      : [];
    const profileUrl = `${window.location.origin}${window.location.pathname}?user=${(githubLogin || '').toLowerCase()}`;

    screen.innerHTML = `
      <div class="profile-container">

        <!-- ヘッダー -->
        <div class="profile-page-header">
          <a href="${window.location.pathname}" class="profile-back-link">← AlgoSort</a>
          <button class="profile-share-btn" id="profile-share-btn">🔗 URLをコピー</button>
        </div>

        <!-- ユーザーカード -->
        <div class="profile-user-card">
          ${avatarUrl
            ? `<img class="profile-avatar" src="${avatarUrl}" alt="${githubLogin}" />`
            : `<div class="profile-avatar-placeholder">👤</div>`}
          <div class="profile-user-info">
            <div class="profile-username">${githubLogin || displayName || 'AlgoSort User'}</div>
            <div class="profile-user-sub">AlgoSort プレイヤー</div>
            <div class="profile-user-badges">
              <span class="profile-badge">📝 ${totalClears}問クリア</span>
              <span class="profile-badge">📅 ${activeDays}日アクティブ</span>
            </div>
          </div>
        </div>

        <!-- 草グラフ -->
        <div class="profile-section">
          <div class="profile-section-title">📅 AlgoSort Activity（過去1年）</div>
          <div class="heatmap-scroll-wrap">
            ${_renderHeatmap(weeks)}
          </div>
          <div class="heatmap-legend">
            <span class="heatmap-legend-label">少ない</span>
            ${[0,1,2,3,4].map((l) => `<div class="heatmap-cell level-${l}"></div>`).join('')}
            <span class="heatmap-legend-label">多い</span>
          </div>
        </div>

        <!-- クリア済み問題 -->
        <div class="profile-section">
          <div class="profile-section-title">✓ クリア済み問題（${clearedProblems.length}問）</div>
          ${clearedProblems.length > 0
            ? `<div class="profile-cleared-list">
                ${clearedProblems.map((p) => `
                  <div class="profile-cleared-item">
                    <span class="profile-cleared-check">✓</span>
                    <div class="profile-cleared-body">
                      <span class="profile-cleared-title">${p.title}</span>
                      <span class="profile-cleared-meta">${p.categoryLabel} ・ ${'★'.repeat(p.difficulty)}${'☆'.repeat(5 - p.difficulty)}</span>
                    </div>
                  </div>`).join('')}
              </div>`
            : `<p class="profile-empty">まだ問題をクリアしていません</p>`}
        </div>

      </div>`;

    // 共有ボタン
    document.getElementById('profile-share-btn')?.addEventListener('click', () => {
      navigator.clipboard.writeText(profileUrl)
        .then(() => {
          const btn = document.getElementById('profile-share-btn');
          if (!btn) return;
          btn.textContent = '✓ コピーしました';
          btn.classList.add('copied');
          setTimeout(() => { btn.textContent = '🔗 URLをコピー'; btn.classList.remove('copied'); }, 2000);
        })
        .catch(() => prompt('URLをコピーしてください:', profileUrl));
    });
  }

  // ─── ヒートマップデータ構築（52週 × 7日） ─────────────────────
  function _buildHeatmap(dailyActivity) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 今週の月曜から 51 週前の月曜を開始点にする
    const start = new Date(today);
    const dow   = today.getDay(); // 0=日, 1=月...
    const daysToMonday = dow === 0 ? 6 : dow - 1;
    start.setDate(today.getDate() - daysToMonday - 51 * 7);

    const weeks = [];
    const cur   = new Date(start);

    while (true) {
      // 月曜に達したら今週（今日まで）で終わり
      if (weeks.length > 0 && cur.getDay() === 1 && cur > today) break;

      const week = [];
      for (let d = 0; d < 7; d++) {
        const isFuture = cur > today;
        const y = cur.getFullYear();
        const m = String(cur.getMonth() + 1).padStart(2, '0');
        const dd = String(cur.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${dd}`;
        week.push({
          date:  dateStr,
          count: isFuture ? -1 : (dailyActivity[dateStr] || 0),
          month: cur.getMonth(),
        });
        cur.setDate(cur.getDate() + 1);
      }
      weeks.push(week);
    }

    return weeks;
  }

  // ─── ヒートマップ HTML 生成 ──────────────────────────────────
  function _renderHeatmap(weeks) {
    if (!weeks.length) return '<p class="heatmap-empty">まだアクティビティはありません</p>';

    // 月ラベル行
    const monthLabels = weeks.map((week, i) => {
      const m     = week[0].month;
      const prevM = i > 0 ? weeks[i - 1][0].month : -1;
      return `<span class="heatmap-month-span">${m !== prevM ? MONTH_NAMES[m] : ''}</span>`;
    }).join('');

    // 曜日ラベル（月・水・金のみ表示）
    const dayLabels = ['月','','水','','金','',''].map((l) =>
      `<div class="heatmap-day-label">${l}</div>`
    ).join('');

    // セル
    const cols = weeks.map((week) => {
      const cells = week.map((day) => {
        if (day.count < 0) return '<div class="heatmap-cell empty"></div>';
        const lv = day.count === 0 ? 0 : day.count === 1 ? 1 : day.count === 2 ? 2 : day.count <= 4 ? 3 : 4;
        return `<div class="heatmap-cell level-${lv}" title="${day.date}: ${day.count}問クリア"></div>`;
      }).join('');
      return `<div class="heatmap-col">${cells}</div>`;
    }).join('');

    return `
      <div class="heatmap-root">
        <div class="heatmap-month-row">
          <div class="heatmap-day-labels-gap"></div>
          <div class="heatmap-months">${monthLabels}</div>
        </div>
        <div class="heatmap-body-row">
          <div class="heatmap-day-labels">${dayLabels}</div>
          <div class="heatmap-grid">${cols}</div>
        </div>
      </div>`;
  }

  // ─── ホーム画面にプロフィールURLコピーボタンを表示 ────────────
  function renderProfileLinkBtn(githubLogin) {
    const container = document.getElementById('profile-link-container');
    if (!container || !githubLogin) return;

    const url = `${window.location.origin}${window.location.pathname}?user=${githubLogin.toLowerCase()}`;

    container.innerHTML = `
      <button class="profile-link-home-btn" id="copy-profile-btn">
        🔗 プロフィールURLをコピー
      </button>`;
    container.style.display = 'flex';

    document.getElementById('copy-profile-btn')?.addEventListener('click', () => {
      navigator.clipboard.writeText(url)
        .then(() => {
          const btn = document.getElementById('copy-profile-btn');
          if (btn) {
            btn.textContent = '✓ コピーしました！';
            setTimeout(() => { btn.textContent = '🔗 プロフィールURLをコピー'; }, 2000);
          }
        })
        .catch(() => prompt('URLをコピーしてください:', url));
    });
  }

  return { checkAndShow, show, renderProfileLinkBtn };
})();

window.ProfileManager = ProfileManager;
