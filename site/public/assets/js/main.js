/* עו״ד פנחס רצון — site behaviour. No dependencies. */
(function () {
  'use strict';

  var root = document.documentElement;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) {} },
  };

  /* ---------------------------------------------------------- mobile nav */

  var burger = document.getElementById('burger');
  var nav = document.getElementById('primaryNav');
  var backdrop = null;

  function closeNav() {
    if (!nav || !nav.classList.contains('open')) return;
    nav.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'פתיחת תפריט');
    document.body.style.overflow = '';
    if (backdrop) { backdrop.remove(); backdrop = null; }
    burger.focus();
  }

  function openNav() {
    nav.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'סגירת תפריט');
    document.body.style.overflow = 'hidden';
    backdrop = document.createElement('button');
    backdrop.className = 'nav-backdrop';
    backdrop.setAttribute('aria-label', 'סגירת תפריט');
    backdrop.addEventListener('click', closeNav);
    document.body.appendChild(backdrop);
    // Focus the drawer itself, not its first link — a programmatic focus on
    // the link paints a stray focus ring the moment the menu opens.
    nav.setAttribute('tabindex', '-1');
    nav.focus({ preventScroll: true });
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.contains('open') ? closeNav() : openNav();
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && window.innerWidth <= 860) closeNav();
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('.sub-toggle'), function (btn) {
    btn.addEventListener('click', function () {
      var sub = btn.parentNode.querySelector('.sub');
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      btn.setAttribute('aria-label', open ? 'הצגת תחומי העיסוק' : 'הסתרת תחומי העיסוק');
      if (sub) sub.classList.toggle('open', !open);
    });
  });

  /* ---------------------------------------------------------- a11y panel */

  var a11yBtn = document.getElementById('a11yBtn');
  var a11yPanel = document.getElementById('a11yPanel');
  var FONT_STEPS = [1, 1.15, 1.3, 1.45];

  function applyFont(scale) {
    root.style.setProperty('--fs', String(scale));
    store.set('a11y-fs', String(scale));
  }
  function currentFont() { return parseFloat(store.get('a11y-fs') || '1') || 1; }
  function stepFont(dir) {
    var i = FONT_STEPS.indexOf(currentFont());
    if (i === -1) i = 0;
    applyFont(FONT_STEPS[Math.min(FONT_STEPS.length - 1, Math.max(0, i + dir))]);
  }
  function toggleFlag(attr, key) {
    if (root.getAttribute(attr) === '1') { root.removeAttribute(attr); store.del(key); }
    else { root.setAttribute(attr, '1'); store.set(key, '1'); }
  }
  function toggleMotion() {
    if (root.getAttribute('data-motion') === '0') { root.removeAttribute('data-motion'); store.del('a11y-motion'); }
    else {
      root.setAttribute('data-motion', '0');
      store.set('a11y-motion', '0');
    }
  }
  function resetA11y() {
    root.style.removeProperty('--fs');
    root.removeAttribute('data-contrast');
    root.removeAttribute('data-links');
    root.removeAttribute('data-motion');
    ['a11y-fs', 'a11y-contrast', 'a11y-links', 'a11y-motion'].forEach(store.del);
  }

  (function restore() {
    var fs = store.get('a11y-fs');
    if (fs) root.style.setProperty('--fs', fs);
    if (store.get('a11y-contrast')) root.setAttribute('data-contrast', '1');
    if (store.get('a11y-links')) root.setAttribute('data-links', '1');
    if (store.get('a11y-motion')) root.setAttribute('data-motion', '0');
  })();

  function closeA11y() {
    if (!a11yPanel || a11yPanel.hidden) return;
    a11yPanel.hidden = true;
    a11yBtn.setAttribute('aria-expanded', 'false');
  }

  if (a11yBtn && a11yPanel) {
    a11yBtn.addEventListener('click', function () {
      var open = !a11yPanel.hidden;
      a11yPanel.hidden = open;
      a11yBtn.setAttribute('aria-expanded', String(!open));
      if (!open) { var f = a11yPanel.querySelector('button'); if (f) f.focus(); }
    });
    a11yPanel.addEventListener('click', function (e) {
      var action = e.target.getAttribute && e.target.getAttribute('data-a11y');
      if (!action) return;
      if (action === 'font-up') stepFont(1);
      else if (action === 'font-down') stepFont(-1);
      else if (action === 'contrast') toggleFlag('data-contrast', 'a11y-contrast');
      else if (action === 'links') toggleFlag('data-links', 'a11y-links');
      else if (action === 'motion') toggleMotion();
      else if (action === 'reset') resetA11y();
    });
    document.addEventListener('click', function (e) {
      if (a11yPanel.hidden) return;
      if (!a11yPanel.contains(e.target) && e.target !== a11yBtn && !a11yBtn.contains(e.target)) closeA11y();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeNav(); closeA11y(); }
  });

  /* ------------------------------------------------------- form messages */

  Array.prototype.forEach.call(document.querySelectorAll('.form'), function (form) {
    var MSG = {
      name: 'יש להזין שם מלא.',
      phone: 'יש להזין מספר טלפון תקין, למשל 054-1234567.',
    };

    function fieldError(input, text) {
      var wrap = input.closest('.field');
      if (!wrap) return;
      var err = wrap.querySelector('.err');
      if (!text) {
        if (err) err.remove();
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
        return;
      }
      if (!err) {
        err = document.createElement('p');
        err.className = 'err';
        err.id = input.id + '-err';
        err.setAttribute('role', 'alert');
        wrap.appendChild(err);
      }
      err.textContent = text;
      input.setAttribute('aria-invalid', 'true');
      input.setAttribute('aria-describedby', err.id);
    }

    form.addEventListener('submit', function (e) {
      var bad = null;
      Array.prototype.forEach.call(form.querySelectorAll('input[required]'), function (input) {
        var ok = input.checkValidity() && input.value.trim() !== '';
        fieldError(input, ok ? '' : MSG[input.name === 'phone' ? 'phone' : 'name']);
        if (!ok && !bad) bad = input;
      });
      if (bad) { e.preventDefault(); bad.focus(); }
    });

    form.addEventListener('input', function (e) {
      if (e.target.getAttribute('aria-invalid') === 'true' && e.target.checkValidity()) fieldError(e.target, '');
    });
  });

  /* ------------------------------------------------------- lead dialog */
  /* "השארת פרטים" opens the form in place; without JS (or without <dialog>
     support) the link keeps its default trip to the contact page. */

  var leadDialog = document.querySelector('.lead-dialog');
  if (leadDialog && typeof leadDialog.showModal === 'function') {
    Array.prototype.forEach.call(document.querySelectorAll('.closing-cta'), function (cta) {
      cta.addEventListener('click', function (e) {
        e.preventDefault();
        leadDialog.showModal();
      });
    });
    leadDialog.addEventListener('click', function (e) {
      if (e.target === leadDialog) leadDialog.close();
    });
    var dlgClose = leadDialog.querySelector('.dlg-close');
    if (dlgClose) dlgClose.addEventListener('click', function () { leadDialog.close(); });
  }
})();
