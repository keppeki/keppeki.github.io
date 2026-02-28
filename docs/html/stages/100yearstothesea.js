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

