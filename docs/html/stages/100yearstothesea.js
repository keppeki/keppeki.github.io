// ===========================
// ハンバーガーメニュー
// ===========================

const btn = document.getElementById('menu-btn');
const menu = document.getElementById('nav-menu');

btn.addEventListener('click', () => {
  btn.classList.toggle('is-open');

  if (menu.classList.contains('hidden')) {
    menu.classList.remove('hidden');
    requestAnimationFrame(() => menu.classList.remove('opacity-0'));
  } else {
    menu.classList.add('opacity-0');
    menu.addEventListener('transitionend', () => menu.classList.add('hidden'), { once: true });
  }
});

menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      btn.classList.remove('is-open');
      menu.classList.add('opacity-0');
      menu.addEventListener('transitionend', () => menu.classList.add('hidden'), { once: true });
    }
  });
});

// ===========================
// ヒーローアニメーション（スクロール連動）
// ===========================

const heroText    = document.getElementById('hero-text');
const heroBg      = document.getElementById('hero-bg');
const heroOverlay = document.getElementById('hero-overlay');
const heroArrow   = document.getElementById('hero-arrow');
const header      = document.getElementById('site-header');

const SCROLL_END   = 400; // この値でアニメーション完了（px）
const SCROLL_CLEAR = 400; // この値でヒーロー要素が完全に消える（px）

// ヘッダーの位置を取得（スクロール後の吸収先）
function getHeaderPos() {
  const rect = header.getBoundingClientRect();
  return {
    x: rect.left,
    y: rect.top
  };
}

// 開始位置（画面中央）
function getStartPos() {
  return {
    x: window.innerWidth  / 2,
    y: window.innerHeight / 2
  };
}

// 0〜1の範囲に収める
function clamp(v) { return Math.min(1, Math.max(0, v)); }

// 線形補間
function lerp(a, b, t) { return a + (b - a) * t; }

function onScroll() {
  const progress = clamp(window.scrollY / SCROLL_END);
  const start = getStartPos();
  const end   = getHeaderPos();

  const x        = start.x
  const y        = lerp(start.y, end.y, progress);
  const fontSize = lerp(1.25, 0.75, progress);

  heroText.style.left      = `${x}px`;
  heroText.style.top       = `${y}px`;
  heroText.style.transform = `translate(-50%, -50%)`;
  heroText.style.fontSize  = `${fontSize}rem`;
  heroText.style.opacity   = 1 - progress * 0.8;

  heroBg.style.opacity      = progress * 0.9;
  heroOverlay.style.opacity = progress * 0.3;
  heroArrow.style.opacity   = 1 - progress * 3;

  // SCROLL_END 以降：オーバーレイとテキストだけ退場（背景画像はそのまま）
  if (window.scrollY > SCROLL_END) {
    const exitProgress = clamp((window.scrollY - SCROLL_END) / (SCROLL_CLEAR - SCROLL_END));

    heroOverlay.style.opacity = 0.3 * (1 - exitProgress);
    heroText.style.opacity    = 0;

    // オーバーレイが完全に消えたら pointer-events をオフ
    if (exitProgress >= 1) {
      heroOverlay.style.pointerEvents = 'none';
    } else {
      heroOverlay.style.pointerEvents = '';
    }
  }
}

window.addEventListener('scroll', onScroll);
onScroll(); // 初期状態にも適用

// // ===========================
// // セクション フェードイン
// // ===========================

// const fadeEls = document.querySelectorAll(
//   'header, main > section, footer'
// );

// fadeEls.forEach((el, i) => {
//   el.classList.add('fade-in');
//   el.style.transitionDelay = `${i * 0.05}s`;
//   el.dataset.seen = 'false'; // ← 追加
// });

// const sectionObserver = new IntersectionObserver((entries) => {
//   entries.forEach(entry => {
//     if (entry.isIntersecting) {
//       entry.target.classList.add('visible');
//       entry.target.dataset.seen = 'true'; // ← 一度見えたら記録
//     } else if (entry.target.dataset.seen === 'true') {
//       // 「一度も見ていない」要素は退場させない
//       entry.target.classList.remove('visible');
//     }
//   });
// }, { threshold: 0.6});

// fadeEls.forEach(el => sectionObserver.observe(el));

// ===========================
// あらすじ横スクロール オーバーレイ
// ===========================

(function() {
  const overlay     = document.getElementById('synopsis-overlay');
  const openBtn     = document.getElementById('synopsis-open');
  const closeBtn    = document.getElementById('synopsis-close');
  const scrollArea  = document.getElementById('synopsis-scroll-area');
  const spacer      = document.getElementById('synopsis-scroll-spacer');
  const track       = document.getElementById('synopsis-track');
  const lines       = document.querySelectorAll('.synopsis-line');
  const progressBar = document.getElementById('synopsis-progress');
  const hint        = document.getElementById('synopsis-hint');
  const bgImg       = document.getElementById('synopsis-bg-img');
  const gradient    = document.getElementById('synopsis-gradient');

  if (!overlay || !openBtn) return;

  let isOpen = false;
  let savedScrollY = 0;
  let autoCloseTimer = null;

  // 最後の行の中央位置を基準にスクロール距離を計算
  function calcScrollDistance() {
    const lastLine = lines[lines.length - 1];
    // 最後の行の中央がビューポート中央に来るためのオフセット
    const lastLineCenter = lastLine.offsetLeft + lastLine.offsetWidth / 2;
    const viewCenter = window.innerWidth / 2;
    return lastLineCenter - viewCenter;
  }

  function setup() {
    const scrollDistance = calcScrollDistance();
    // スクロール余白 = スクロール距離 + 画面1.5個分（末尾の余韻用）
    spacer.style.height = (scrollDistance + window.innerHeight * 1.5) + 'px';
  }

  // 線形補間
  function lerp(a, b, t) { return a + (b - a) * t; }

  function onSynopsisScroll() {
    if (!isOpen) return;

    const scrollDistance = calcScrollDistance();
    const scrolled = scrollArea.scrollTop;
    // progressは0〜1（最後の行が中央に来る時点で1）
    const progress = Math.max(0, Math.min(1, scrolled / scrollDistance));
    // 1を超えた領域は「余韻」として使う
    const extraScroll = Math.max(0, scrolled - scrollDistance);
    const extraProgress = Math.min(1, extraScroll / (window.innerHeight * 0.5));

    // --- トラック横移動 ---
    track.style.transform = `translateX(${-progress * scrollDistance}px)`;

    // --- プログレスバー ---
    progressBar.style.width = (progress * 100) + '%';

    // --- スクロールヒントをフェードアウト ---
    if (progress > 0.03) {
      hint.style.opacity = '0';
      hint.style.transition = 'opacity 0.5s ease';
    }

    // --- 背景ズーム＆パン ---
    const bgScale = lerp(1.0, 1.15, progress);
    const bgPanX  = lerp(0, -3, progress); // %
    const bgPanY  = lerp(0, -1, progress); // %
    bgImg.style.transform = `scale(${bgScale}) translate(${bgPanX}%, ${bgPanY}%)`;

    // --- 色温度変化（紺→暖色）---
    // 開始: rgba(13,27,42)  終了: rgba(42,30,20) 暖かみのある暗色
    const r1 = lerp(13, 42, progress);
    const g1 = lerp(27, 30, progress);
    const b1 = lerp(42, 20, progress);
    const edgeColor = `rgba(${Math.round(r1)},${Math.round(g1)},${Math.round(b1)},`;
    const midAlpha  = lerp(0.45, 0.35, progress);
    gradient.style.background = `linear-gradient(90deg, ${edgeColor}0.9) 0%, ${edgeColor}${midAlpha}) 25%, ${edgeColor}${midAlpha}) 75%, ${edgeColor}0.9) 100%)`;

    // --- 背景画像のopacityをprogressに応じて変化 ---
    bgImg.style.opacity = lerp(0.25, 0.45, progress);

    // --- 各行の出現制御 ---
    const lineCount = lines.length;
    lines.forEach((line, i) => {
      // 行ごとの出現タイミング（最初の行は早め、「……なら」の前に間を作る）
      let threshold;
      if (i === 0) {
        threshold = 0.01;  // 最初の行：すぐ出現
      } else if (i <= 4) {
        threshold = 0.05 + (i * 0.1);  // 通常ペース
      } else {
        // 5行目（……なら）以降は少し遅らせる → 「溜め」
        threshold = 0.05 + (4 * 0.1) + ((i - 4) * 0.13);
      }

      if (progress >= threshold) {
        line.classList.add('visible');
        line.classList.remove('dim');
      } else {
        line.classList.remove('visible', 'dim');
      }
    });

    // --- 最後の一文を中央に残す演出 ---
    // progress >= 1 以降（余韻領域）
    if (extraProgress > 0) {
      // 最後の行以外をフェードアウト
      lines.forEach((line, i) => {
        if (i < lineCount - 1) {
          line.style.opacity = Math.max(0, 1 - extraProgress * 2.5);
        } else {
          // 最後の行はそのまま
          line.style.opacity = '';
        }
      });

      // 自動クローズ
      if (extraProgress >= 0.95 && !autoCloseTimer) {
        autoCloseTimer = setTimeout(() => closeSynopsis(), 600);
      }
    } else {
      // 余韻領域でなければスタイルをリセット
      lines.forEach(line => { line.style.opacity = ''; });
      if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
        autoCloseTimer = null;
      }
    }
  }

  function openSynopsis() {
    if (isOpen) return;
    isOpen = true;

    savedScrollY = window.scrollY;

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = -savedScrollY + 'px';
    document.body.style.width = '100%';

    // 毎回全状態をリセット
    scrollArea.scrollTop = 0;
    track.style.transform = 'translateX(0)';
    progressBar.style.width = '0%';
    hint.style.opacity = '';
    hint.style.transition = '';
    bgImg.style.transform = '';
    bgImg.style.opacity = '';
    gradient.style.background = '';
    lines.forEach(l => {
      l.classList.remove('visible', 'dim');
      l.style.opacity = '';
    });
    autoCloseTimer = null;

    // openクラスを付与（visibility:visibleになる）
    overlay.classList.add('open');
    // openクラス付与後にレイアウト確定させてからsetup
    overlay.offsetHeight;
    setup();

    scrollArea.addEventListener('scroll', onSynopsisScroll);
  }

  function closeSynopsis() {
    if (!isOpen) return;
    isOpen = false;

    overlay.classList.remove('open');
    scrollArea.removeEventListener('scroll', onSynopsisScroll);

    if (autoCloseTimer) {
      clearTimeout(autoCloseTimer);
      autoCloseTimer = null;
    }

    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, savedScrollY);
  }

  openBtn.addEventListener('click', openSynopsis);
  closeBtn.addEventListener('click', closeSynopsis);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeSynopsis();
  });

  window.addEventListener('resize', () => {
    if (isOpen) setup();
  });
})();

