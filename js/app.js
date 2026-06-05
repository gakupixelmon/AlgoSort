/**
 * app.js - メインアプリケーション
 * 画面遷移・ルーティング管理
 */

const App = (() => {
  let currentScreen = 'home';
  const screens = {};
  let feedbackTimer = null;

  function init() {
    document.querySelectorAll('.screen').forEach((el) => {
      screens[el.id] = el;
    });
    Storage.checkStreakValidity();
    navigateTo('home');
  }

  function navigateTo(screenId, params = {}) {
    Object.values(screens).forEach((s) => s.classList.remove('active'));
    currentScreen = screenId;
    const target = screens[screenId];
    if (!target) return;
    target.classList.add('active');

    if (screenId === 'home') renderHome();
    else if (screenId === 'difficulty-select') renderDifficultySelect();
    else if (screenId === 'categories') renderCategories();
    else if (screenId === 'stages') renderStages(params.categoryId);
    else if (screenId === 'game') renderGame(params.problemId, params.fromRandom, params.selectedDifficulty);
    else if (screenId === 'result') renderResult(params);

    window.scrollTo(0, 0);
  }

  // ======= ホーム画面 =======
  function renderHome() {
    const streak = Storage.getStreak();
    const currentStreak = Storage.checkStreakValidity();

    const streakEl = document.getElementById('streak-count');
    const maxStreakEl = document.getElementById('max-streak');
    const totalEl = document.getElementById('total-solved');

    if (streakEl) streakEl.textContent = currentStreak;
    if (maxStreakEl) maxStreakEl.textContent = streak.max;
    if (totalEl) totalEl.textContent = Storage.getTotalSolved();

    const fireEl = document.getElementById('streak-fire');
    if (fireEl) fireEl.style.display = currentStreak > 0 ? 'inline' : 'none';

    const randomBtn = document.getElementById('btn-random');
    const categoryBtn = document.getElementById('btn-category');

    if (randomBtn) {
      randomBtn.replaceWith(randomBtn.cloneNode(true));
      document.getElementById('btn-random').addEventListener('click', () => {
        navigateTo('difficulty-select');
      });
    }
    if (categoryBtn) {
      categoryBtn.replaceWith(categoryBtn.cloneNode(true));
      document.getElementById('btn-category').addEventListener('click', () => {
        navigateTo('categories');
      });
    }
  }

  // ======= 難易度選択画面 =======
  function renderDifficultySelect() {
    const grid = document.getElementById('difficulty-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const available = DataManager.getAvailableDifficulties();
    // 1〜5 全て表示（問題なしはロック）
    for (let d = 1; d <= 5; d++) {
      const problems = DataManager.getProblemsByDifficulty(d);
      const hasProblems = problems.length > 0;
      const stars = '★'.repeat(d) + '☆'.repeat(5 - d);

      const diffLabels = ['', '入門', '初級', '中級', '上級', 'エキスパート'];
      const diffColors = ['', '#22d3ee', '#34d399', '#fbbf24', '#fb923c', '#f472b6'];
      const diffDescs = [
        '',
        'アルゴリズムの基本を学ぼう',
        'ループや配列を使いこなす',
        '複数の概念を組み合わせる',
        '高度なデータ構造を活用',
        '競技プログラミング上級者向け',
      ];

      const card = document.createElement('div');
      card.className = `difficulty-card${hasProblems ? '' : ' locked'}`;
      card.style.setProperty('--diff-color', diffColors[d]);
      card.innerHTML = `
        <div class="diff-stars">${stars}</div>
        <div class="diff-info">
          <div class="diff-level">難易度 ${d} <span class="diff-label-text">${diffLabels[d]}</span></div>
          <div class="diff-desc">${hasProblems ? `${problems.length} 問 ／ ${diffDescs[d]}` : 'Coming Soon'}</div>
        </div>
        <div class="diff-arrow">${hasProblems ? '→' : '🔒'}</div>
      `;

      if (hasProblems) {
        card.addEventListener('click', () => {
          const p = DataManager.getRandomProblemByDifficulty(d);
          if (p) navigateTo('game', { problemId: p.id, fromRandom: true, selectedDifficulty: d });
        });
      }

      grid.appendChild(card);
    }

    const backBtn = document.getElementById('difficulty-back');
    if (backBtn) {
      backBtn.replaceWith(backBtn.cloneNode(true));
      document.getElementById('difficulty-back').addEventListener('click', () => navigateTo('home'));
    }
  }

  // ======= カテゴリ選択画面 =======
  function renderCategories() {
    const grid = document.getElementById('category-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const categories = DataManager.getCategories();
    categories.forEach((cat) => {
      const problems = DataManager.getProblemsByCategory(cat.id);
      const cleared = problems.filter((p) => Storage.isClear(p.id)).length;

      const card = document.createElement('div');
      card.className = `category-card${cat.available ? '' : ' locked'}`;
      card.style.setProperty('--cat-color', cat.color);

      // ランダムモード対象外バッジ
      const notRandomBadge = (!cat.randomEligible)
        ? '<span class="not-random-badge">ランダム対象外</span>'
        : '';

      card.innerHTML = `
        <div class="cat-icon">${cat.icon}</div>
        <div class="cat-info">
          <div class="cat-label-row">
            <span class="cat-label">${cat.label}</span>
            ${notRandomBadge}
          </div>
          <div class="cat-progress">${cat.available ? `${cleared} / ${problems.length} クリア` : 'Coming Soon'}</div>
        </div>
        ${cat.available ? '' : '<div class="lock-icon">🔒</div>'}
      `;

      if (cat.available) {
        card.addEventListener('click', () => navigateTo('stages', { categoryId: cat.id }));
      }

      grid.appendChild(card);
    });

    const backBtn = document.getElementById('categories-back');
    if (backBtn) {
      backBtn.replaceWith(backBtn.cloneNode(true));
      document.getElementById('categories-back').addEventListener('click', () => navigateTo('home'));
    }
  }

  // ======= ステージ選択画面 =======
  function renderStages(categoryId) {
    const list = document.getElementById('stage-list');
    if (!list) return;
    list.innerHTML = '';

    const problems = DataManager.getProblemsByCategory(categoryId);
    const cat = DataManager.getCategories().find((c) => c.id === categoryId);

    const titleEl = document.getElementById('stages-title');
    if (titleEl && cat) titleEl.textContent = cat.label;

    problems.forEach((problem) => {
      const isCleared = Storage.isClear(problem.id);
      const stars = '★'.repeat(problem.difficulty) + '☆'.repeat(5 - problem.difficulty);
      const langBadge = problem.language === 'cpp' ? 'C++' : problem.language.toUpperCase();

      const item = document.createElement('div');
      item.className = `stage-item${isCleared ? ' cleared' : ''}`;
      item.innerHTML = `
        <div class="stage-left">
          <div class="stage-title">${problem.title}</div>
          <div class="stage-meta">
            <span class="stage-difficulty">${stars}</span>
            <span class="stage-lang-badge">${langBadge}</span>
          </div>
        </div>
        <div class="stage-right">
          ${isCleared ? '<span class="clear-badge">✓ CLEAR</span>' : '<span class="play-badge">▶ PLAY</span>'}
        </div>
      `;
      item.addEventListener('click', () => {
        navigateTo('game', { problemId: problem.id, fromRandom: false });
      });
      list.appendChild(item);
    });

    const backBtn = document.getElementById('stages-back');
    if (backBtn) {
      backBtn.replaceWith(backBtn.cloneNode(true));
      document.getElementById('stages-back').addEventListener('click', () => navigateTo('categories'));
    }
  }

  // ======= ゲーム画面 =======
  let currentGameProblem = null;
  let currentFromRandom = false;
  let currentSelectedDifficulty = null;

  function renderGame(problemId, fromRandom, selectedDifficulty) {
    const problem = DataManager.getProblemById(problemId);
    if (!problem) return;

    currentGameProblem = problem;
    currentFromRandom = fromRandom;
    currentSelectedDifficulty = selectedDifficulty || null;

    // ヘッダー情報
    document.getElementById('game-title').textContent = problem.title;
    document.getElementById('game-description').textContent = problem.description;
    document.getElementById('game-difficulty').textContent =
      '★'.repeat(problem.difficulty) + '☆'.repeat(5 - problem.difficulty);

    // 入力形式の表示
    const inputFormatCard = document.getElementById('input-format-card');
    const inputFormatContent = document.getElementById('input-format-content');
    if (inputFormatCard && inputFormatContent) {
      if (problem.inputFormat && problem.inputFormat.params && problem.inputFormat.params.length > 0) {
        inputFormatContent.innerHTML = '';
        // 各パラメータ行を生成
        problem.inputFormat.params.forEach((param) => {
          const row = document.createElement('div');
          row.className = 'input-format-row';
          row.innerHTML = `
            <span class="input-format-name">${escapeHtml(param.name)}</span>
            <span class="input-format-type">${escapeHtml(param.type)}</span>
            <span class="input-format-desc">${escapeHtml(param.desc)}</span>
          `;
          inputFormatContent.appendChild(row);
        });
        // 補足ノート（constraints等）
        if (problem.inputFormat.note) {
          const note = document.createElement('div');
          note.className = 'input-format-note';
          note.textContent = problem.inputFormat.note;
          inputFormatContent.appendChild(note);
        }
        inputFormatCard.style.display = '';
      } else {
        inputFormatCard.style.display = 'none';
      }
    }

    const langEl = document.getElementById('game-lang');
    langEl.textContent = problem.language === 'cpp' ? 'C++' : problem.language.toUpperCase();
    langEl.className = `lang-badge lang-${problem.language}`;

    const hintText = document.getElementById('hint-text');
    if (hintText) hintText.textContent = '';

    // 戻るボタン
    const backBtn = document.getElementById('game-back');
    if (backBtn) {
      backBtn.replaceWith(backBtn.cloneNode(true));
      document.getElementById('game-back').addEventListener('click', () => {
        if (fromRandom) navigateTo('difficulty-select');
        else navigateTo('stages', { categoryId: problem.category });
      });
    }

    // ゲームエンジン初期化
    GameEngine.init(
      problem,
      {
        answerZone: document.getElementById('answer-zone'),
        choicesZone: document.getElementById('choices-zone'),
        hintBtn: document.getElementById('hint-btn'),
        hintText: document.getElementById('hint-text'),
        checkBtn: document.getElementById('check-btn'),
        giveUpBtn: document.getElementById('give-up-btn'),
      },
      (result) => {
        const newStreak = Storage.recordClear(problem.id);
        navigateTo('result', {
          problemId: problem.id,
          score: result.score,
          hintsUsed: result.hintsUsed,
          elapsed: result.elapsed,
          streak: newStreak,
          fromRandom,
          selectedDifficulty: currentSelectedDifficulty,
        });
      }
    );
  }

  // ======= 結果画面 =======
  function renderResult(params) {
    const { problemId, score, hintsUsed, elapsed, streak, fromRandom, selectedDifficulty } = params;
    const problem = DataManager.getProblemById(problemId);

    const scoreColors = { S: '#fbbf24', A: '#34d399', B: '#60a5fa', C: '#a78bfa' };

    document.getElementById('result-score').textContent = score;
    document.getElementById('result-score').style.color = scoreColors[score] || '#fff';
    document.getElementById('result-title').textContent = problem ? problem.title : '';
    document.getElementById('result-hints').textContent = `${hintsUsed} 回`;
    document.getElementById('result-time').textContent = formatTime(elapsed);
    document.getElementById('result-streak').textContent = `🔥 ${streak} 日連続`;

    const messages = {
      S: '完璧！ヒントなしでクリア！',
      A: 'Great! もう少しで完璧！',
      B: 'Good! 練習を続けよう！',
      C: 'Keep going! 次回はヒント少なく！',
    };
    document.getElementById('result-message').textContent = messages[score] || '';

    const retryBtn = document.getElementById('result-retry');
    const nextBtn = document.getElementById('result-next');
    const homeBtn = document.getElementById('result-home');

    if (retryBtn) {
      retryBtn.replaceWith(retryBtn.cloneNode(true));
      document.getElementById('result-retry').addEventListener('click', () => {
        navigateTo('game', { problemId, fromRandom, selectedDifficulty });
      });
    }
    if (nextBtn) {
      nextBtn.replaceWith(nextBtn.cloneNode(true));
      document.getElementById('result-next').addEventListener('click', () => {
        if (fromRandom && selectedDifficulty) {
          // 同じ難易度からランダムに次の問題
          const p = DataManager.getRandomProblemByDifficulty(selectedDifficulty);
          if (p) navigateTo('game', { problemId: p.id, fromRandom: true, selectedDifficulty });
          else navigateTo('difficulty-select');
        } else {
          const p = DataManager.getRandomProblem();
          navigateTo('game', { problemId: p.id, fromRandom: true });
        }
      });
    }
    if (homeBtn) {
      homeBtn.replaceWith(homeBtn.cloneNode(true));
      document.getElementById('result-home').addEventListener('click', () => navigateTo('home'));
    }
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}分${s}秒` : `${s}秒`;
  }

  function showFeedback(msg, type = 'info') {
    let toast = document.getElementById('feedback-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'feedback-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = `feedback-toast ${type} show`;
    if (feedbackTimer) clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  return { init, navigateTo, showFeedback };
})();

document.addEventListener('DOMContentLoaded', () => App.init());
window.App = App;
