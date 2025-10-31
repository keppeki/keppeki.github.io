
  (function(){
    const toggle = el => {
      const isBack = el.classList.toggle('is-back');
      el.setAttribute('aria-pressed', String(isBack));
      const hint = el.querySelector('.hint');
      if (hint) hint.textContent = isBack ? 'クリック／タップで表面を表示' : 'クリック／タップで裏面を表示';
    };

    document.querySelectorAll('.flyer-toggle').forEach(el => {
      el.addEventListener('click', () => toggle(el));
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle(el);
        }
      });
    });
  })();

