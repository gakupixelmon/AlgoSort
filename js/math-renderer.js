/**
 * 数式を含む問題テキストを安全に描画する共通ユーティリティ。
 * MathJax の読み込み前でもテキストを表示し、準備完了後に組版する。
 */
(function () {
  const pendingElements = new Set();
  let loadStarted = false;
  let mathJaxReady = false;
  const mathJaxUrls = [
    'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js',
    'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.2.2/es5/tex-chtml.min.js',
  ];

  function escapeText(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function typeset(element) {
    if (!element) return;
    const mathJax = window.MathJax;
    if (mathJaxReady && mathJax && typeof mathJax.typesetPromise === 'function') {
      if (typeof mathJax.typesetClear === 'function') mathJax.typesetClear([element]);
      mathJax.typesetPromise([element]).catch((error) => {
        console.error('MathJax typesetting failed:', error);
      });
      return;
    }
    pendingElements.add(element);
  }

  function render(element, value) {
    if (!element) return;
    element.innerHTML = escapeText(value).replace(/\n/g, '<br>');
    typeset(element);
  }

  function flushPending() {
    pendingElements.forEach((element) => typeset(element));
    pendingElements.clear();
  }

  function markReady() {
    mathJaxReady = true;
    flushPending();
    window.dispatchEvent(new Event('mathjax-ready'));
  }

  function loadMathJax(urlIndex = 0) {
    if (urlIndex >= mathJaxUrls.length) {
      console.error('MathJax could not be loaded from any configured CDN.');
      return;
    }

    const script = document.createElement('script');
    script.src = mathJaxUrls[urlIndex];
    script.async = true;
    script.onload = () => {
      const startup = window.MathJax && window.MathJax.startup;
      if (startup && startup.promise) startup.promise.then(markReady).catch(() => loadMathJax(urlIndex + 1));
      else loadMathJax(urlIndex + 1);
    };
    script.onerror = () => loadMathJax(urlIndex + 1);
    document.head.appendChild(script);
  }

  function startLoading() {
    if (loadStarted) return;
    loadStarted = true;
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
      },
    };
    loadMathJax();
  }

  window.MathRenderer = { render, typeset };
  startLoading();
})();
