// Simple typewriter for terminal-like sections
(function () {
  const isMobile = (typeof window !== 'undefined') && (
    window.matchMedia('(max-width: 600px)').matches || (navigator.maxTouchPoints || 0) > 0
  );
  const SPEED = isMobile ? 14 : 28; // ms per char
  const PAUSE_AFTER = isMobile ? 120 : 250; // ms after command completes

  function typeInto(el, text) {
    return new Promise((resolve) => {
      let i = 0;
      const tick = () => {
        el.textContent = text.slice(0, i++);
        if (i <= text.length) {
          setTimeout(tick, SPEED);
        } else {
          resolve();
        }
      };
      tick();
    });
  }

  async function boot() {
    const lines = Array.from(document.querySelectorAll('.line'));
    for (const line of lines) {
      const ps1 = line.querySelector('.ps1');
      if (!ps1) continue;
      const ps1Text = ps1.textContent;
      const full = line.textContent;
      const cmd = full.replace(ps1Text, '').trim();

      // rewrite line with typed container + cursor
      line.innerHTML = '';
      const ps1Clone = ps1.cloneNode(true);
      const typed = document.createElement('span');
      typed.className = 'typed';
      const cursor = document.createElement('span');
      cursor.className = 'cursor';
      cursor.textContent = '█';
      line.appendChild(ps1Clone);
      line.appendChild(document.createTextNode(' '));
      line.appendChild(typed);
      line.appendChild(cursor);

      await typeInto(typed, cmd);
      await new Promise((r) => setTimeout(r, PAUSE_AFTER));

      // reveal associated content under this section
      const section = line.closest('section');
      if (section) {
        const toReveal = section.querySelectorAll('.revealable');
        toReveal.forEach((el) => el.classList.add('reveal'));
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

// Pause animations during active scrolling to reduce jank
(function () {
  let scrollTimer;
  const root = document.documentElement;
  window.addEventListener(
    'scroll',
    () => {
      root.classList.add('is-scrolling');
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        root.classList.remove('is-scrolling');
      }, 150);
    },
    { passive: true }
  );
})();
