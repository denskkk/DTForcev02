// DTForce - Global Mobile Enhancements
// Applies lightweight, safe improvements across all pages for small screens
(function() {
  const PHONE = '+380671916336';
  const WHATSAPP = '380671916336';

  function onReady(cb){
    if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', cb, { once: true });
    else cb();
  }

  function injectBaseStyles() {
    const css = `
      :root { --header-h: 64px; }
      html { scroll-behavior: smooth; }
      body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
      img, video { max-width: 100%; height: auto; }
      /* Prevent horizontal scroll on small devices */
      body { overflow-x: hidden; }
      /* Anchor offset for sticky headers */
      [id] { scroll-margin-top: calc(var(--header-h) + 12px); }
      /* Responsive table wrapper */
      .table-responsive { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      .table-responsive table { min-width: 600px; }
      /* Responsive embeds */
      .embed-responsive { position: relative; width: 100%; }
      .embed-responsive > iframe, .embed-responsive > video { width: 100% !important; border: 0; }
      /* Mobile call bar */
      @media (max-width: 768px) {
        body.has-mobile-callbar { padding-bottom: calc(64px + env(safe-area-inset-bottom)); }
        #mobile-callbar { position: fixed; left: 0; right: 0; bottom: 0; z-index: 60; padding-bottom: env(safe-area-inset-bottom); }
        #mobile-callbar .bar { backdrop-filter: saturate(140%) blur(8px); }
      }
    `;
    const style = document.createElement('style');
    style.setAttribute('data-mobile-styles', 'true');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  function computeHeaderHeight() {
    const header = document.querySelector('header');
    const h = header ? Math.max(header.getBoundingClientRect().height, 56) : 56;
    document.documentElement.style.setProperty('--header-h', h + 'px');
  }

  function enhanceAnchors() {
    const header = document.querySelector('header');
    const offset = () => (header ? Math.max(header.getBoundingClientRect().height, 56) : 56) + 8;

    document.querySelectorAll('a[href^="#"]').forEach(a => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      a.addEventListener('click', function(e) {
        const id = href.slice(1);
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          const top = el.getBoundingClientRect().top + window.pageYOffset - offset();
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });
  }

  function wrapTablesAndEmbeds() {
    // tables
    document.querySelectorAll('table').forEach(tbl => {
      if (!tbl.closest('.table-responsive')) {
        const wrap = document.createElement('div');
        wrap.className = 'table-responsive';
        tbl.parentNode.insertBefore(wrap, tbl);
        wrap.appendChild(tbl);
      }
    });
    // iframes (e.g., maps, youtube)
    document.querySelectorAll('iframe').forEach(frame => {
      if (!frame.closest('.embed-responsive')) {
        const wrap = document.createElement('div');
        wrap.className = 'embed-responsive';
        frame.parentNode.insertBefore(wrap, frame);
        wrap.appendChild(frame);
      }
      // make sure it can shrink
      frame.setAttribute('width', '100%');
      frame.removeAttribute('style');
    });
  }

  function lazyLoadImages() {
    document.querySelectorAll('img:not([loading])').forEach(img => {
      img.loading = 'lazy';
      img.decoding = 'async';
    });
  }

  function installMobileCallBar() {
    if (document.getElementById('mobile-callbar')) return;
    if (window.matchMedia('(min-width: 769px)').matches) return; // only phones / small tablets
    // Skip if the page already includes a fixed bottom full-width bar/menu
    const existingBottomBar = document.querySelector('[class*="fixed"][class*="bottom-0"][class*="left-0"][class*="right-0"]');
    if (existingBottomBar) return;

    const bar = document.createElement('div');
    bar.id = 'mobile-callbar';
    bar.innerHTML = `
      <div class="bar bg-gray-900/90 border-t border-gray-800">
        <div class="max-w-7xl mx-auto px-4 py-2">
          <div class="grid grid-cols-2 gap-3">
            <a href="tel:${PHONE}" class="inline-flex items-center justify-center gap-2 py-3 rounded-xl text-white bg-gradient-to-r from-red-600 to-red-700 shadow-lg shadow-red-900/20 active:translate-y-px">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
              <span class="font-semibold">Подзвонити</span>
            </a>
            <a href="https://wa.me/${WHATSAPP}" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-2 py-3 rounded-xl text-white bg-green-600 shadow-lg shadow-green-900/20 active:translate-y-px">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="h-5 w-5"><path d="M20.52 3.48A11.86 11.86 0 0012.06 0C5.5 0 .2 5.3.2 11.86a11.8 11.8 0 001.62 6L0 24l6.33-1.66a11.87 11.87 0 005.73 1.5h.01c6.55 0 11.86-5.3 11.86-11.86 0-3.17-1.24-6.15-3.41-8.42zM12.07 21.6h-.01a9.76 9.76 0 01-4.98-1.37l-.36-.21-3.76.98 1.01-3.66-.23-.38a9.76 9.76 0 01-1.5-5.16c0-5.39 4.39-9.78 9.78-9.78 2.62 0 5.08 1.02 6.93 2.86a9.72 9.72 0 012.85 6.93c0 5.39-4.39 9.79-9.78 9.79zm5.36-7.35c-.29-.15-1.72-.85-1.99-.94-.27-.1-.47-.15-.68.15-.2.29-.78.94-.95 1.13-.17.2-.35.22-.64.08-.29-.15-1.23-.45-2.34-1.43-.86-.77-1.43-1.72-1.6-2-.17-.29-.02-.45.13-.6.13-.13.29-.35.43-.52.14-.17.19-.29.29-.48.1-.2.05-.37-.02-.52-.08-.15-.68-1.64-.93-2.25-.24-.58-.48-.5-.68-.5-.17 0-.37 0-.56 0-.2 0-.52.08-.79.37-.27.29-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.27.5 1.7.64.71.22 1.36.19 1.88.12.57-.08 1.72-.7 1.97-1.37.24-.68.24-1.27.17-1.37-.06-.1-.22-.16-.5-.31z"/></svg>
              <span class="font-semibold">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>`;

    document.body.appendChild(bar);
    document.body.classList.add('has-mobile-callbar');
  }

  function fixInPageNavOnLoadHash() {
    // If arriving with a hash, adjust scroll to account for header
    if (location.hash) {
      const el = document.getElementById(location.hash.slice(1));
      if (el) {
        setTimeout(() => {
          const header = document.querySelector('header');
          const offset = (header ? Math.max(header.getBoundingClientRect().height, 56) : 56) + 8;
          const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo(0, top);
        }, 50);
      }
    }
  }

  onReady(() => {
    try {
      injectBaseStyles();
      computeHeaderHeight();
      enhanceAnchors();
      wrapTablesAndEmbeds();
      lazyLoadImages();
      installMobileCallBar();
      fixInPageNavOnLoadHash();
      // Recompute on resize (debounced)
      let t;
      window.addEventListener('resize', () => {
        clearTimeout(t);
        t = setTimeout(() => {
          computeHeaderHeight();
        }, 150);
      });
    } catch (e) {
      // fail silently to avoid breaking the page
      console && console.warn && console.warn('Mobile enhancements error:', e);
    }
  });
})();
