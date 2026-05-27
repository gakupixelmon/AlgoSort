/**
 * game.js - ゲームエンジン
 * ・ドラッグ＆ドロップ（PC + スマホタッチ）
 * ・タップで即移動（ブロックをタップするだけで上下エリア間を移動）
 * ・ピン留めブロック（import等、最初から配置済み・移動不可）
 * ・正解後ソリューションモーダル（pinnedCodeも含む整形済みコード）
 */

const GameEngine = (() => {
  let currentProblem = null;
  let hintsUsed = 0;
  let startTime = null;
  let onClearCallback = null;

  // DOM参照
  let answerZone = null;
  let choicesZone = null;
  let hintBtn = null;
  let hintText = null;
  let checkBtn = null;

  // タッチDnD用状態
  let draggingEl = null;
  let dragClone = null;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let touchStartTime = 0;
  let touchStartX = 0;
  let touchStartY = 0;

  // PC DnD状態
  let draggedEl = null;
  let lastDragEndTime = 0;

  // ======= 初期化 =======
  function init(problem, elements, onClear) {
    currentProblem = problem;
    hintsUsed = 0;
    startTime = Date.now();
    onClearCallback = onClear;

    answerZone = elements.answerZone;
    choicesZone = elements.choicesZone;
    hintBtn = elements.hintBtn;
    hintText = elements.hintText;
    checkBtn = elements.checkBtn;

    answerZone.innerHTML = '';
    choicesZone.innerHTML = '';
    if (hintText) hintText.textContent = '';

    // ① ピン留めブロックを答えエリア上部に配置（固定・移動不可）
    if (problem.pinnedCode && problem.pinnedCode.length > 0) {
      problem.pinnedCode.forEach((code) => {
        const el = createPinnedElement(code);
        answerZone.appendChild(el);
      });
    }

    // ② 並び替え対象のブロックをシャッフルして選択肢エリアへ
    const shuffled = DataManager.shuffleBlocks(problem.blocks);
    shuffled.forEach((block) => {
      const el = createBlockElement(block);
      choicesZone.appendChild(el);
    });

    // ③ ゾーンのDnDイベント設定
    setupZoneEvents(answerZone);
    setupZoneEvents(choicesZone);

    // ④ ヒントボタン（重複登録防止）
    if (hintBtn) {
      const newBtn = hintBtn.cloneNode(true);
      hintBtn.parentNode.replaceChild(newBtn, hintBtn);
      hintBtn = newBtn;
      hintBtn.addEventListener('click', showNextHint);
      updateHintButton();
    }

    // ⑤ 正解チェックボタン（重複登録防止）
    if (checkBtn) {
      const newBtn = checkBtn.cloneNode(true);
      checkBtn.parentNode.replaceChild(newBtn, checkBtn);
      checkBtn = newBtn;
      checkBtn.addEventListener('click', checkAnswer);
    }
  }

  // ======= ピン留めブロック（固定表示・ドラッグ不可） =======
  function createPinnedElement(code) {
    const el = document.createElement('div');
    el.className = 'code-block pinned';

    const lockIcon = document.createElement('span');
    lockIcon.className = 'pinned-lock-icon';
    lockIcon.textContent = '📌';

    const codeSpan = document.createElement('span');
    codeSpan.className = 'block-code';
    codeSpan.textContent = code;

    el.appendChild(lockIcon);
    el.appendChild(codeSpan);
    return el;
  }

  // ======= 並び替えブロック（ドラッグ＆タップ対応） =======
  function createBlockElement(block) {
    const el = document.createElement('div');
    el.className = 'code-block';
    el.dataset.blockId = block.id;
    el.setAttribute('draggable', 'true');

    const codeSpan = document.createElement('span');
    codeSpan.className = 'block-code';
    codeSpan.textContent = block.code.trimStart(); // インデント除去して表示

    // タップヒントアイコン
    const tapIcon = document.createElement('span');
    tapIcon.className = 'block-tap-icon';
    tapIcon.textContent = '⇅';

    el.appendChild(codeSpan);
    el.appendChild(tapIcon);

    // === PC: HTML5 DnD ===
    el.addEventListener('dragstart', onDragStart);
    el.addEventListener('dragend', onDragEnd);

    // === PC: クリック（タップ移動） ===
    // dragEnd後 100ms 以内のclickはドラッグ起因なのでスキップ
    el.addEventListener('click', () => {
      if (Date.now() - lastDragEndTime < 150) return;
      handleBlockTap(el);
    });

    // === スマホ: タッチ ===
    el.addEventListener('touchstart', onTouchStart, { passive: false });

    return el;
  }

  // ======= タップで即移動 =======
  function handleBlockTap(el) {
    const zone = el.parentElement;
    if (!zone) return;

    if (zone === choicesZone) {
      // 選択肢 → 答えエリアの末尾へ
      answerZone.appendChild(el);
    } else if (zone === answerZone) {
      // 答えエリア → 選択肢エリアの末尾へ
      choicesZone.appendChild(el);
    }

    // タップアニメーション
    el.classList.add('tapped');
    setTimeout(() => el.classList.remove('tapped'), 300);

    triggerAutoCheck();
  }

  function setupZoneEvents(zone) {
    zone.addEventListener('dragover', onDragOver);
    zone.addEventListener('dragleave', onDragLeave);
    zone.addEventListener('drop', onDrop);
  }

  // ======= PC Drag & Drop =======
  function onDragStart(e) {
    draggedEl = e.currentTarget;
    draggedEl.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragEnd(e) {
    lastDragEndTime = Date.now();
    if (draggedEl) draggedEl.classList.remove('dragging');
    document.querySelectorAll('.drop-indicator').forEach((el) => el.remove());
    document.querySelectorAll('.drag-over').forEach((el) => el.classList.remove('drag-over'));
    draggedEl = null;
  }

  function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const zone = e.currentTarget;
    zone.classList.add('drag-over');

    const afterEl = getDragAfterElement(zone, e.clientY);
    const indicator = document.querySelector('.drop-indicator') || createDropIndicator();

    if (afterEl == null) {
      zone.appendChild(indicator);
    } else {
      zone.insertBefore(indicator, afterEl);
    }
  }

  function onDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      e.currentTarget.classList.remove('drag-over');
    }
  }

  function onDrop(e) {
    e.preventDefault();
    const zone = e.currentTarget;
    zone.classList.remove('drag-over');
    document.querySelectorAll('.drop-indicator').forEach((el) => el.remove());
    if (!draggedEl) return;

    const afterEl = getDragAfterElement(zone, e.clientY);
    if (afterEl == null) {
      zone.appendChild(draggedEl);
    } else {
      zone.insertBefore(draggedEl, afterEl);
    }

    draggedEl.classList.remove('dragging');
    draggedEl = null;
    triggerAutoCheck();
  }

  function getDragAfterElement(container, y) {
    // ピン留めブロックはスキップ
    const blocks = [...container.querySelectorAll('.code-block:not(.dragging):not(.pinned)')];
    return blocks.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        }
        return closest;
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  function createDropIndicator() {
    const div = document.createElement('div');
    div.className = 'drop-indicator';
    return div;
  }

  // ======= スマホ Touch Drag & Drop (タップ検出付き) =======
  function onTouchStart(e) {
    if (e.touches.length !== 1) return;
    e.preventDefault();

    draggingEl = e.currentTarget;
    const touch = e.touches[0];
    touchStartTime = Date.now();
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;

    const rect = draggingEl.getBoundingClientRect();
    dragOffsetX = touch.clientX - rect.left;
    dragOffsetY = touch.clientY - rect.top;

    // クローン作成
    dragClone = draggingEl.cloneNode(true);
    dragClone.className += ' drag-clone';
    dragClone.style.width = rect.width + 'px';
    dragClone.style.left = touch.clientX - dragOffsetX + 'px';
    dragClone.style.top = touch.clientY - dragOffsetY + 'px';
    document.body.appendChild(dragClone);

    draggingEl.classList.add('dragging');

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
  }

  function onTouchMove(e) {
    e.preventDefault();
    if (!dragClone) return;
    const touch = e.touches[0];
    dragClone.style.left = touch.clientX - dragOffsetX + 'px';
    dragClone.style.top = touch.clientY - dragOffsetY + 'px';

    dragClone.style.pointerEvents = 'none';
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    dragClone.style.pointerEvents = '';

    const zone = el ? el.closest('.drop-zone') : null;
    document.querySelectorAll('.drop-zone').forEach((z) => z.classList.remove('drag-over'));
    if (zone) zone.classList.add('drag-over');
  }

  function onTouchEnd(e) {
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
    if (!draggingEl) return;

    const touch = e.changedTouches[0];
    const totalMoved = Math.hypot(
      touch.clientX - touchStartX,
      touch.clientY - touchStartY
    );
    const elapsed = Date.now() - touchStartTime;

    // クローン後処理
    if (dragClone) {
      dragClone.style.pointerEvents = 'none';
    }
    const elUnder = document.elementFromPoint(touch.clientX, touch.clientY);
    if (dragClone) {
      dragClone.style.pointerEvents = '';
      document.body.removeChild(dragClone);
      dragClone = null;
    }

    draggingEl.classList.remove('dragging');
    document.querySelectorAll('.drop-zone').forEach((z) => z.classList.remove('drag-over'));

    // ★ タップ判定（動きが小さく短時間）
    if (totalMoved < 10 && elapsed < 300) {
      handleBlockTap(draggingEl);
      draggingEl = null;
      return;
    }

    // 通常ドラッグ終了：ドロップ先ゾーンに配置
    const targetZone = elUnder ? elUnder.closest('.drop-zone') : null;
    if (targetZone) {
      const afterEl = getTouchAfterElement(targetZone, touch.clientY);
      if (afterEl == null) {
        targetZone.appendChild(draggingEl);
      } else {
        targetZone.insertBefore(draggingEl, afterEl);
      }
    }

    draggingEl = null;
    triggerAutoCheck();
  }

  function getTouchAfterElement(container, y) {
    const blocks = [...container.querySelectorAll('.code-block:not(.dragging):not(.pinned)')];
    return blocks.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        }
        return closest;
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  // ======= ゲームロジック =======

  // ピン留めブロックを除いた並び替えブロックだけを取得
  function getAnswerBlocks() {
    return [...answerZone.querySelectorAll('.code-block:not(.pinned)')];
  }

  function triggerAutoCheck() {
    const answerBlocks = getAnswerBlocks();
    if (answerBlocks.length === currentProblem.blocks.length) {
      const order = answerBlocks.map((el) => parseInt(el.dataset.blockId));
      const isCorrect = JSON.stringify(order) === JSON.stringify(currentProblem.correctOrder);
      if (isCorrect) {
        setTimeout(onCorrect, 300);
      }
    }
  }

  function checkAnswer() {
    const answerBlocks = getAnswerBlocks();
    if (answerBlocks.length === 0) {
      showFeedback('コードブロックを上のエリアに配置してください！', 'warn');
      return;
    }
    if (answerBlocks.length < currentProblem.blocks.length) {
      showFeedback(`まだ ${currentProblem.blocks.length - answerBlocks.length} 個のブロックが残っています。`, 'warn');
      return;
    }

    const order = answerBlocks.map((el) => parseInt(el.dataset.blockId));
    const isCorrect = JSON.stringify(order) === JSON.stringify(currentProblem.correctOrder);

    if (isCorrect) {
      onCorrect();
    } else {
      showFeedback('惜しい！順序が正しくありません。', 'error');
      answerZone.classList.add('shake');
      setTimeout(() => answerZone.classList.remove('shake'), 500);
    }
  }

  function onCorrect() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const score = calcScore(hintsUsed, elapsed);
    showSolutionModal(currentProblem, score, elapsed, hintsUsed);
  }

  function calcScore(hints, elapsed) {
    if (hints === 0) return 'S';
    if (hints === 1) return 'A';
    if (hints === 2) return 'B';
    return 'C';
  }

  // ======= 正解後ソリューションモーダル =======
  function showSolutionModal(problem, score, elapsed, hints) {
    const existing = document.getElementById('solution-modal');
    if (existing) existing.remove();

    // pinnedCode（import等）+ 並び替えブロックの順でコードを構築
    const orderedBlocks = problem.correctOrder.map((id) =>
      problem.blocks.find((b) => b.id === id)
    );
    const pinnedLines = problem.pinnedCode || [];
    const codeLines = [
      ...pinnedLines,
      ...orderedBlocks.map((b) => b.code),
    ];

    const scoreColors = { S: '#fbbf24', A: '#34d399', B: '#60a5fa', C: '#a78bfa' };
    const scoreColor = scoreColors[score] || '#fff';
    const scoreMessages = {
      S: '完璧！ヒントなしでクリア！🎉',
      A: 'Great！1ヒントでクリア！👏',
      B: 'Good！2ヒントでクリア！',
      C: 'クリア！次回はヒント少なく！',
    };
    const langLabel = problem.language === 'cpp' ? 'C++' : problem.language.toUpperCase();

    const modal = document.createElement('div');
    modal.id = 'solution-modal';
    modal.className = 'solution-modal-overlay';
    modal.innerHTML = `
      <div class="solution-modal">
        <div class="solution-modal-header">
          <div class="solution-score-badge" style="color:${scoreColor};border-color:${scoreColor};">${score}</div>
          <div class="solution-header-info">
            <div class="solution-title">${problem.title}</div>
            <div class="solution-msg">${scoreMessages[score] || ''}</div>
          </div>
        </div>
        <div class="solution-code-section">
          <div class="solution-code-label">
            <span>✅ 正しいコード</span>
            <span class="solution-lang-badge lang-${problem.language}">${langLabel}</span>
          </div>
          <div class="solution-code-wrapper">
            <pre class="solution-pre"><code id="solution-code-content"></code></pre>
          </div>
        </div>
        <div class="solution-modal-footer">
          <button id="solution-next-btn" class="btn btn-primary">▶ 結果を見る</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // コード行を行番号付きで追加
    const codeEl = document.getElementById('solution-code-content');
    codeLines.forEach((line, i) => {
      const lineEl = document.createElement('div');
      lineEl.className = 'solution-line';

      const lineNum = document.createElement('span');
      lineNum.className = 'solution-line-num';
      lineNum.textContent = String(i + 1).padStart(2, ' ');

      const lineCode = document.createElement('span');
      lineCode.className = 'solution-line-code';
      // pinnedCodeの行は特別にハイライト
      if (i < pinnedLines.length) {
        lineEl.classList.add('solution-line-pinned');
        lineCode.textContent = line + '  # ← 自動配置済み';
      } else {
        lineCode.textContent = line;
      }

      lineEl.appendChild(lineNum);
      lineEl.appendChild(lineCode);
      codeEl.appendChild(lineEl);
    });

    requestAnimationFrame(() => {
      modal.classList.add('visible');
    });

    document.getElementById('solution-next-btn').addEventListener('click', () => {
      modal.classList.remove('visible');
      setTimeout(() => {
        modal.remove();
        if (onClearCallback) onClearCallback({ score, hintsUsed: hints, elapsed });
      }, 300);
    });
  }

  // ======= ヒント =======
  function showNextHint() {
    if (!currentProblem) return;
    if (hintsUsed >= currentProblem.hints.length) return;

    const hint = currentProblem.hints[hintsUsed];
    hintsUsed++;

    if (hintText) {
      hintText.textContent = `💡 ヒント ${hintsUsed}: ${hint}`;
      hintText.classList.add('hint-appear');
      setTimeout(() => hintText.classList.remove('hint-appear'), 500);
    }
    updateHintButton();
  }

  function updateHintButton() {
    if (!hintBtn || !currentProblem) return;
    const remaining = currentProblem.hints.length - hintsUsed;
    hintBtn.textContent = `💡 ヒント (残り${remaining})`;
    hintBtn.disabled = remaining === 0;
  }

  function showFeedback(msg, type) {
    if (window.App && window.App.showFeedback) {
      window.App.showFeedback(msg, type);
    }
  }

  return { init, checkAnswer };
})();
