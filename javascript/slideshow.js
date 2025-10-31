(() => {
  const init = root => {
    const imgs = Array.from(root.querySelectorAll('.gs-viewport img'));
    if (!imgs.length) return;

    let i = 0, timer = null;
    const captionEl = root.querySelector('.gs-caption');
    const dotsEl = root.querySelector('.gs-dots');

    // ドット生成
    imgs.forEach((_, idx) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `スライド ${idx + 1}`);
      b.addEventListener('click', () => go(idx));
      dotsEl.appendChild(b);
    });

    const prevBtn = root.querySelector('.gs-prev');
    const nextBtn = root.querySelector('.gs-next');
    prevBtn.addEventListener('click', () => go(i - 1));
    nextBtn.addEventListener('click', () => go(i + 1));

    // キーボード操作（左右矢印）
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') go(i - 1);
      if (e.key === 'ArrowRight') go(i + 1);
    });
    root.tabIndex = 0; // フォーカス可能に

    const go = (n) => {
      i = (n + imgs.length) % imgs.length;
      imgs.forEach((img, idx) => img.classList.toggle('gs-active', idx === i));
      Array.from(dotsEl.children).forEach((b, idx) => {
        b.setAttribute('aria-current', idx === i ? 'true' : 'false');
      });
      captionEl.textContent = imgs[i].dataset.caption || imgs[i].alt || '';
    };

    // 初期表示
    go(0);

    // 任意の自動再生（data-autoplay="3000" などでms指定）
    const ap = Number(root.dataset.autoplay || 0);
    if (ap > 0) {
      const tick = () => { go(i + 1); timer = setTimeout(tick, ap); };
      timer = setTimeout(tick, ap);
      root.addEventListener('mouseenter', () => timer && clearTimeout(timer));
      root.addEventListener('mouseleave', () => { timer = setTimeout(tick, ap); });
    }
  };

  document.querySelectorAll('.gs-slideshow').forEach(init);
})();
