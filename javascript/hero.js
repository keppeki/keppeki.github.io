
(function () {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const onScroll = () => {
        // ページが最上端（ほぼ0px）の時はオーバーレイなし
        const atTop = window.scrollY <= 1;
        hero.classList.toggle('overlay-visible', !atTop);
    };

    // 初期状態＆スクロール時に反映
    window.addEventListener('load', onScroll, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
})();
