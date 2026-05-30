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
  let longPressTimer = null;   // 長押し判定タイマー
  let isDragMode = false;      // 長押しでドラッグモードに移行したか

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
    el.addEventListener('touchstart', onTouchStart, { passive: true });

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
    // touchstart 時点では preventDefault しない（スクロールを許可）

    const touch = e.touches[0];
    const targetEl = e.currentTarget;
    touchStartTime = Date.now();
    touchStartX = touch.clientX;
    touchStartY = touch.clientY;
    isDragMode = false;

    // 長押しタイマー（150ms後にドラッグモード開始）
    longPressTimer = setTimeout(() => {
      isDragMode = true;
      startDrag(targetEl, touch);
    }, 150);

    document.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('touchend', onTouchEnd);
  }

  function startDrag(targetEl, touch) {
    draggingEl = targetEl;
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
  }

  function onTouchMove(e) {
    const touch = e.touches[0];
    const movedX = Math.abs(touch.clientX - touchStartX);
    const movedY = Math.abs(touch.clientY - touchStartY);

    if (!isDragMode) {
      // 長押し前に 8px 以上動いたらスクロールと判断してドラッグキャンセル
      if (movedX > 8 || movedY > 8) {
        cancelDragMode();
      }
      return; // ドラッグモード未開始ならスクロールを許可（preventDefaultしない）
    }

    // ドラッグモード中はスクロール抑制
    e.preventDefault();
    if (!dragClone) return;
    dragClone.style.left = touch.clientX - dragOffsetX + 'px';
    dragClone.style.top = touch.clientY - dragOffsetY + 'px';

    dragClone.style.pointerEvents = 'none';
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    dragClone.style.pointerEvents = '';

    const zone = el ? el.closest('.drop-zone') : null;
    document.querySelectorAll('.drop-zone').forEach((z) => z.classList.remove('drag-over'));
    if (zone) zone.classList.add('drag-over');
  }

  function cancelDragMode() {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }
    isDragMode = false;
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);
    if (draggingEl) draggingEl.classList.remove('dragging');
    if (dragClone) {
      document.body.removeChild(dragClone);
      dragClone = null;
    }
    draggingEl = null;
  }

  function onTouchEnd(e) {
    document.removeEventListener('touchmove', onTouchMove);
    document.removeEventListener('touchend', onTouchEnd);

    // 長押しタイマーをキャンセル
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      longPressTimer = null;
    }

    const touch = e.changedTouches[0];
    const totalMoved = Math.hypot(
      touch.clientX - touchStartX,
      touch.clientY - touchStartY
    );
    const elapsed = Date.now() - touchStartTime;

    // ドラッグモードが開始されていない場合はタップ判定
    if (!isDragMode) {
      if (draggingEl) draggingEl.classList.remove('dragging');
      // 短タップ（動きが小さく短時間）ならタップ移動
      if (totalMoved < 10 && elapsed < 400) {
        const tappedEl = e.changedTouches[0] ? document.elementFromPoint(touch.clientX, touch.clientY) : null;
        const blockEl = tappedEl ? tappedEl.closest('.code-block:not(.pinned)') : null;
        if (blockEl) handleBlockTap(blockEl);
      }
      draggingEl = null;
      isDragMode = false;
      return;
    }

    // ドラッグモード終了処理
    if (!draggingEl) {
      isDragMode = false;
      return;
    }

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
    isDragMode = false;
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

  // 正解判定：partialOrder（部分順序制約）があれば制約チェック、なければ correctOrders と一致するか判定
  // partialOrder: [[a, b], ...] = 「ブロック id:a は id:b より前に来なければならない」制約リスト
  function isOrderCorrect(order, problem) {
    if (problem.partialOrder && problem.partialOrder.length > 0) {
      // 各ブロックIDの「答えエリア内での位置」を記録
      const indexMap = {};
      order.forEach((id, i) => { indexMap[id] = i; });
      // 全ての制約 [a, b]（a は b より前）を満たすか検証
      return problem.partialOrder.every(([a, b]) => indexMap[a] < indexMap[b]);
    }
    // 従来方式: correctOrders のいずれかと完全一致するか
    const orderStr = JSON.stringify(order);
    return problem.correctOrders.some((co) => JSON.stringify(co) === orderStr);
  }

  function triggerAutoCheck() {
    const answerBlocks = getAnswerBlocks();
    if (answerBlocks.length === currentProblem.blocks.length) {
      const order = answerBlocks.map((el) => parseInt(el.dataset.blockId));
      const isCorrect = isOrderCorrect(order, currentProblem);
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
    const isCorrect = isOrderCorrect(order, currentProblem);

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
    // correctOrders[0] を代表正解としてコード表示に使用
    const representativeOrder = problem.correctOrders[0];
    const orderedBlocks = representativeOrder.map((id) =>
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

    // 解説セクションのHTML（explanationが存在する場合のみ）
    const exp = problem.explanation;
    let explanationHtml = '';
    if (exp) {
      const pointsHtml = exp.points
        .map(p => `<li class="explanation-point">${p}</li>`)
        .join('');
      const complexityHtml = exp.complexity
        ? `<div class="explanation-complexity">
            <span class="complexity-item"><span class="complexity-label">時間計算量</span><code class="complexity-value">${exp.complexity.time}</code></span>
            <span class="complexity-item"><span class="complexity-label">空間計算量</span><code class="complexity-value">${exp.complexity.space}</code></span>
           </div>`
        : '';
      const tipHtml = exp.tip
        ? `<div class="explanation-tip"><span class="tip-icon">💡</span><span>${exp.tip}</span></div>`
        : '';
      explanationHtml = `
        <div class="solution-explanation-section">
          <div class="explanation-label">📖 解説</div>
          <p class="explanation-summary">${exp.summary}</p>
          <ul class="explanation-points">${pointsHtml}</ul>
          ${complexityHtml}
          ${tipHtml}
        </div>
      `;
    }

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
        ${explanationHtml}
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
