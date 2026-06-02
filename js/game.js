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

  let answerZone = null;
  let choicesZone = null;
  let hintBtn = null;
  let hintText = null;
  let hintNav = null;
  let hintPrevBtn = null;
  let hintNextBtn = null;
  let hintCounter = null;
  let checkBtn = null;
  let giveUpBtn = null;

  // 開示済みヒントの履歴と現在表示中のインデックス
  let viewingHintIndex = -1;  // -1 = 未表示, 0 = 1枚目 ...

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
  let lastTapTime = 0;         // タッチタップ終了時刻（click二重発火防止用）

  // PC DnD状態
  let draggedEl = null;
  let lastDragEndTime = 0;

  // スワイプページ切り替え状態
  let currentPage = 0;          // 0 = 問題文ページ, 1 = コードページ
  let sliderEl = null;
  let sliderSwipeStartX = 0;
  let sliderSwipeStartY = 0;
  let sliderDragging = false;
  let sliderStartTranslate = 0;
  let pageIndicator = null;

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
    giveUpBtn = elements.giveUpBtn;

    // ヒントナビゲーション要素
    hintNav     = document.getElementById('hint-nav');
    hintPrevBtn = document.getElementById('hint-prev-btn');
    hintNextBtn = document.getElementById('hint-next-btn');
    hintCounter = document.getElementById('hint-counter');

    answerZone.innerHTML = '';
    choicesZone.innerHTML = '';
    if (hintText) { hintText.innerHTML = ''; hintText.classList.remove('has-hint'); }
    if (hintNav) hintNav.hidden = true;
    viewingHintIndex = -1;

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

    // ⑤ ヒントボタン（重複登録防止）
    if (hintBtn) {
      const newBtn = hintBtn.cloneNode(true);
      hintBtn.parentNode.replaceChild(newBtn, hintBtn);
      hintBtn = newBtn;
      hintBtn.addEventListener('click', unlockNextHint);
      updateHintUI();
    }

    // ヒントナビボタン登録（cloneNode不要：毎回叁照を取り直すのできれい）
    if (hintPrevBtn) {
      const nb = hintPrevBtn.cloneNode(true);
      hintPrevBtn.parentNode.replaceChild(nb, hintPrevBtn);
      hintPrevBtn = nb;
      hintPrevBtn.addEventListener('click', () => goHint(-1));
    }
    if (hintNextBtn) {
      const nb = hintNextBtn.cloneNode(true);
      hintNextBtn.parentNode.replaceChild(nb, hintNextBtn);
      hintNextBtn = nb;
      hintNextBtn.addEventListener('click', () => goHint(1));
    }

    // ⑤ 正解チェックボタン（重複登録防止）
    if (checkBtn) {
      const newBtn = checkBtn.cloneNode(true);
      checkBtn.parentNode.replaceChild(newBtn, checkBtn);
      checkBtn = newBtn;
      checkBtn.addEventListener('click', checkAnswer);
    }

    // ⑥ 諦めるボタン（重複登録防止）
    if (giveUpBtn) {
      const newBtn = giveUpBtn.cloneNode(true);
      giveUpBtn.parentNode.replaceChild(newBtn, giveUpBtn);
      giveUpBtn = newBtn;
      giveUpBtn.addEventListener('click', handleGiveUp);
    }

    // ⑦ スワイプページ初期化
    initSwipePages();
  }

  // ======= スワイプページ切り替え =======
  function initSwipePages() {
    sliderEl = document.getElementById('game-slider');
    pageIndicator = document.getElementById('page-indicator');

    if (!sliderEl) return;

    // ページをリセット（問題文ページから開始）
    currentPage = 0;
    applySliderTransform(0, false);
    updatePageDots(0);

    // ドットのタップでもページ切り替え
    if (pageIndicator) {
      pageIndicator.querySelectorAll('.page-dot').forEach((dot) => {
        dot.addEventListener('click', () => {
          goToPage(parseInt(dot.dataset.page));
        });
      });
    }

    // 既存のイベントリスナーを除去（ゲーム再スタート時）
    sliderEl.removeEventListener('touchstart', onSliderTouchStart);
    sliderEl.removeEventListener('touchmove', onSliderTouchMove);
    sliderEl.removeEventListener('touchend', onSliderTouchEnd);

    // スマホのみスワイプイベントを登録
    if (window.matchMedia('(max-width: 767px)').matches) {
      sliderEl.addEventListener('touchstart', onSliderTouchStart, { passive: true });
      sliderEl.addEventListener('touchmove', onSliderTouchMove, { passive: false });
      sliderEl.addEventListener('touchend', onSliderTouchEnd);
    }

    // リサイズ時にも再適用
    window.removeEventListener('resize', onSliderResize);
    window.addEventListener('resize', onSliderResize);
  }

  function onSliderResize() {
    applySliderTransform(currentPage, false);
  }

  function goToPage(page) {
    currentPage = Math.max(0, Math.min(1, page));
    applySliderTransform(currentPage, true);
    updatePageDots(currentPage);
  }

  function applySliderTransform(page, animate) {
    if (!sliderEl) return;
    // スマホのみtransformを適用
    if (!window.matchMedia('(max-width: 767px)').matches) {
      sliderEl.style.transform = '';
      return;
    }
    const bodyWidth = sliderEl.parentElement ? sliderEl.parentElement.clientWidth : window.innerWidth;
    const translateX = -page * bodyWidth;
    if (!animate) sliderEl.classList.add('dragging');
    sliderEl.style.transform = `translateX(${translateX}px)`;
    if (!animate) {
      // 次フレームでdraggingクラスを削除してtransitionを有効化
      requestAnimationFrame(() => sliderEl.classList.remove('dragging'));
    }
  }

  function updatePageDots(page) {
    if (!pageIndicator) return;
    pageIndicator.querySelectorAll('.page-dot').forEach((dot) => {
      dot.classList.toggle('active', parseInt(dot.dataset.page) === page);
    });
  }

  function onSliderTouchStart(e) {
    if (e.touches.length !== 1) return;
    sliderSwipeStartX = e.touches[0].clientX;
    sliderSwipeStartY = e.touches[0].clientY;
    sliderStartTranslate = -currentPage * (sliderEl.parentElement ? sliderEl.parentElement.clientWidth : window.innerWidth);
    sliderDragging = false;
  }

  function onSliderTouchMove(e) {
    if (e.touches.length !== 1) return;
    // touchstart が未記録の場合はスキップ（guard）
    if (sliderSwipeStartX === 0 && sliderSwipeStartY === 0) return;

    const dx = e.touches[0].clientX - sliderSwipeStartX;
    const dy = e.touches[0].clientY - sliderSwipeStartY;

    // 方向判定フェーズ
    if (!sliderDragging) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) return; // 縦方向が優勢 → スクロール優先
      // 横方向のスワイプ確定：ブロックDnDをキャンセルして自分が引き受ける
      sliderDragging = true;
      cancelDragMode(); // ブロックの長押しDnDを中断
    }

    e.preventDefault();
    sliderEl.classList.add('dragging');
    const bodyWidth = sliderEl.parentElement ? sliderEl.parentElement.clientWidth : window.innerWidth;
    // ラバーバンド（端での抵抗感）
    let newTranslate = sliderStartTranslate + dx;
    const minTranslate = -bodyWidth;
    const maxTranslate = 0;
    if (newTranslate > maxTranslate) newTranslate = dx / 4;
    if (newTranslate < minTranslate) newTranslate = minTranslate + (newTranslate - minTranslate) / 4;
    sliderEl.style.transform = `translateX(${newTranslate}px)`;
  }

  function onSliderTouchEnd(e) {
    sliderEl.classList.remove('dragging');
    if (!sliderDragging) return;
    sliderDragging = false;

    // dx を計算してからリセット（順序重要）
    const dx = e.changedTouches[0].clientX - sliderSwipeStartX;
    sliderSwipeStartX = 0;
    sliderSwipeStartY = 0;

    const threshold = 60; // px

    if (dx < -threshold && currentPage === 0) {
      goToPage(1);
    } else if (dx > threshold && currentPage === 1) {
      goToPage(0);
    } else {
      goToPage(currentPage);
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
    // dragEnd後 150ms 以内のclickはドラッグ起因なのでスキップ
    // タッチタップ後 200ms 以内のclickはtouchendで既に処理済みなのでスキップ
    el.addEventListener('click', () => {
      if (Date.now() - lastDragEndTime < 150) return;
      if (Date.now() - lastTapTime < 200) return;
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
        // touchstart で記録した要素を使ってタップ判定
        // （elementFromPoint は指が少しずれた別のブロックを拾う場合があるため
        //   currentTarget 経由で登録済みの要素を優先する）
        const tappedEl = document.elementFromPoint(touch.clientX, touch.clientY);
        const blockEl = tappedEl ? tappedEl.closest('.code-block:not(.pinned)') : null;
        if (blockEl) {
          lastTapTime = Date.now(); // click二重発火防止
          handleBlockTap(blockEl);
        }
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

  // 配列の全順列を生成（同一テキストブロックの順列試行に使用）
  function generatePermutations(arr) {
    if (arr.length <= 1) return [arr.slice()];
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
      generatePermutations(rest).forEach(perm => result.push([arr[i], ...perm]));
    }
    return result;
  }

  // 正解判定：partialOrder（部分順序制約）があれば制約チェック、なければ correctOrders と一致するか判定
  // partialOrder: [[a, b], ...] = 「ブロック id:a は id:b より前に来なければならない」制約リスト
  //
  // 【同一表示テキスト対応】
  // } など trimStart() 後に同一テキストになるブロックは視覚的に区別不可。
  // そのため同一テキストを持つブロック群の全順列を試し、
  // いずれか一つが全制約を満たせば正解とする。
  function isOrderCorrect(order, problem) {
    if (problem.partialOrder && problem.partialOrder.length > 0) {
      const blocks = problem.blocks;

      // 各ブロックの表示テキスト（trimStart済み）を取得
      const displayText = {};
      blocks.forEach(b => { displayText[b.id] = b.code.trimStart(); });

      // 同一表示テキストのブロックをグループ化（orderに現れるIDのみ）
      const textGroups = {};
      order.forEach(id => {
        const text = displayText[id];
        if (!textGroups[text]) textGroups[text] = [];
        textGroups[text].push(id);
      });

      // 重複するグループ（サイズ2以上）のみ抽出
      const dupeGroups = Object.values(textGroups).filter(g => g.length > 1);

      // partialOrder 制約チェック（指定orderに対して）
      const checkConstraints = (testOrder) => {
        const indexMap = {};
        testOrder.forEach((id, i) => { indexMap[id] = i; });
        return problem.partialOrder.every(([a, b]) => indexMap[a] < indexMap[b]);
      };

      // 重複グループがなければそのままチェック
      if (dupeGroups.length === 0) {
        return checkConstraints(order);
      }

      // 同一テキストグループの全順列を試み、1つでも全制約を満たせば正解
      const tryAllPermutations = (currentOrder, groupIdx) => {
        if (groupIdx >= dupeGroups.length) {
          return checkConstraints(currentOrder);
        }
        const group = dupeGroups[groupIdx];
        // このグループのブロックが currentOrder 内で占める位置インデックス
        const positions = [];
        currentOrder.forEach((id, pos) => {
          if (group.includes(id)) positions.push(pos);
        });

        for (const perm of generatePermutations(group)) {
          const newOrder = [...currentOrder];
          positions.forEach((pos, i) => { newOrder[pos] = perm[i]; });
          if (tryAllPermutations(newOrder, groupIdx + 1)) return true;
        }
        return false;
      };

      return tryAllPermutations(order, 0);
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

  // ======= 諦める =======
  function handleGiveUp() {
    if (!currentProblem) return;
    if (!window.confirm('本当に諦めますか？\n答えが表示されます。')) return;
    showSolutionModal(currentProblem, '諦', 0, 0, true);
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
  function showSolutionModal(problem, score, elapsed, hints, isGiveUp = false) {
    const existing = document.getElementById('solution-modal');
    if (existing) existing.remove();

    // pinnedCode（import等）+ 並び替えブロックの順でコードを構築
    // correctOrders[0] があればそれを代表正解として使用。
    // partialOrder のみの問題（correctOrders なし）はトポロジカルソートで代表順を生成。
    // どちらもない場合は blocks の定義順にフォールバック。
    let representativeOrder;
    if (problem.correctOrders && problem.correctOrders.length > 0) {
      representativeOrder = problem.correctOrders[0];
    } else if (problem.partialOrder && problem.partialOrder.length > 0) {
      // トポロジカルソート（Kahn's algorithm）で partialOrder を満たす代表順を生成
      const blockIds = problem.blocks.map((b) => b.id);
      const inDegree = {};
      const adj = {};
      blockIds.forEach((id) => { inDegree[id] = 0; adj[id] = []; });
      problem.partialOrder.forEach(([a, b]) => {
        if (inDegree[b] !== undefined && adj[a] !== undefined) {
          adj[a].push(b);
          inDegree[b]++;
        }
      });
      const queue = blockIds.filter((id) => inDegree[id] === 0);
      representativeOrder = [];
      while (queue.length > 0) {
        const cur = queue.shift();
        representativeOrder.push(cur);
        (adj[cur] || []).forEach((next) => {
          inDegree[next]--;
          if (inDegree[next] === 0) queue.push(next);
        });
      }
      // トポロジカルソートで全ブロックを並べられなかった場合（循環等）は定義順にフォールバック
      if (representativeOrder.length !== blockIds.length) {
        representativeOrder = blockIds;
      }
    } else {
      // どちらもない場合は blocks の定義順
      representativeOrder = problem.blocks.map((b) => b.id);
    }
    const orderedBlocks = representativeOrder.map((id) =>
      problem.blocks.find((b) => b.id === id)
    );
    const pinnedLines = problem.pinnedCode || [];
    const codeLines = [
      ...pinnedLines,
      ...orderedBlocks.map((b) => b.code),
    ];

    const scoreColors = { S: '#fbbf24', A: '#34d399', B: '#60a5fa', C: '#a78bfa', '諦': '#ef4444' };
    const scoreColor = scoreColors[score] || '#fff';
    const scoreMessages = {
      S: '完璧！ヒントなしでクリア！🎉',
      A: 'Great！1ヒントでクリア！👏',
      B: 'Good！2ヒントでクリア！',
      C: 'クリア！次回はヒント少なく！',
      '諦': '諦めた…答えを確認して次回に挑戦！💪',
    };
    const langLabel = problem.language === 'cpp' ? 'C++' : problem.language.toUpperCase();
    const nextBtnLabel = isGiveUp ? '🏠 ホームに戻る' : '▶ 結果を見る';

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
          <button id="solution-next-btn" class="btn btn-primary">${nextBtnLabel}</button>
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
        if (isGiveUp) {
          // 諦めた場合は結果画面に行かずホームへ
          if (window.App && window.App.navigateTo) window.App.navigateTo('home');
        } else {
          if (onClearCallback) onClearCallback({ score, hintsUsed: hints, elapsed });
        }
      }, 300);
    });
  }

  // ======= ヒント =======

  // 新しいヒントを開示（スコアに影響）
  function unlockNextHint() {
    if (!currentProblem) return;
    if (hintsUsed >= currentProblem.hints.length) return;

    hintsUsed++;
    viewingHintIndex = hintsUsed - 1; // 開示した最新ヒントを表示
    renderHint();
    updateHintUI();
  }

  // 前後移動（delta: -1 または +1）
  function goHint(delta) {
    if (viewingHintIndex < 0) return;
    const next = viewingHintIndex + delta;
    if (next < 0 || next >= hintsUsed) return;
    viewingHintIndex = next;
    renderHint();
    updateHintUI();
  }

  // 現在の viewingHintIndex のヒントを表示
  function renderHint() {
    if (!hintText || viewingHintIndex < 0) return;
    const hint = currentProblem.hints[viewingHintIndex];
    hintText.textContent = `💡 ヒント ${viewingHintIndex + 1}: ${hint}`;
    hintText.classList.add('has-hint', 'hint-appear');
    setTimeout(() => hintText.classList.remove('hint-appear'), 400);
  }

  // UI状態を更新（ボタンの有効無効・カウンター・ナビ表示）
  function updateHintUI() {
    if (!currentProblem) return;
    const total = currentProblem.hints.length;
    const remaining = total - hintsUsed;

    // 開示ボタン
    if (hintBtn) {
      hintBtn.textContent = remaining > 0
        ? `💡 次のヒントを開く (残り${remaining})`
        : '💡 ヒントはこれで全部';
      hintBtn.disabled = remaining === 0;
    }

    // ナビゲーションバー（開示済みが1件以上なら表示）
    if (hintNav) {
      hintNav.hidden = hintsUsed === 0;
    }
    if (hintCounter) {
      hintCounter.textContent = hintsUsed > 0 ? `${viewingHintIndex + 1} / ${hintsUsed}` : '';
    }
    if (hintPrevBtn) {
      hintPrevBtn.disabled = viewingHintIndex <= 0;
    }
    if (hintNextBtn) {
      hintNextBtn.disabled = viewingHintIndex >= hintsUsed - 1;
    }
  }

  function showFeedback(msg, type) {
    if (window.App && window.App.showFeedback) {
      window.App.showFeedback(msg, type);
    }
  }

  return { init, checkAnswer };
})();
