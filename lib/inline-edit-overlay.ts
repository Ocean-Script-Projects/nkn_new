/**
 * Overlay script injected by the admin into the same-origin preview iframe.
 *
 * It never ships to the public site — `ContentEditor` appends it to the iframe
 * document at runtime.
 *
 * Two rules keep it from breaking the page it edits:
 *
 * 1. It never inserts or removes nodes inside React's tree. Marking is done with
 *    a `data-nkn-ed` attribute and a stylesheet in <head>; wrapping text in
 *    <span>s used to restructure hydrated DOM, which React reported as a
 *    hydration mismatch and then undid by regenerating the subtree.
 * 2. It waits for the page to settle (hydration finished) before touching
 *    anything, because `iframe.onload` fires well before React has hydrated.
 */
export const INLINE_EDIT_OVERLAY = String.raw`
(function () {
  var cfg = window.__NKN_INLINE__ || {};
  var index = cfg.index || {};            // normalizedText -> [{ key, index? }]
  var origin = cfg.origin || location.origin;
  if (window.__nknInlineActive) return;
  window.__nknInlineActive = true;

  var style = document.createElement('style');
  style.setAttribute('data-nkn-style', '');
  style.textContent =
    '[data-nkn-ed]{outline:1px dashed rgba(37,99,235,.55);outline-offset:2px;border-radius:2px;cursor:text}' +
    '[data-nkn-ed]:hover{background:rgba(37,99,235,.10)}' +
    '[data-nkn-ed="amb"]{outline-color:rgba(217,119,6,.65)}' +
    '[data-nkn-ed="amb"]:hover{background:rgba(217,119,6,.12)}' +
    '[data-nkn-editing]{background:rgba(37,99,235,.07)!important;outline:2px solid rgba(37,99,235,.75)!important}' +
    '#nkn-pencil{position:fixed;z-index:2147483000;display:none;align-items:center;justify-content:center;' +
    'width:22px;height:22px;padding:0;margin:0;border:1px solid rgba(37,99,235,.35);border-radius:6px;' +
    'background:#fff;color:#2563eb;font:13px/1 system-ui,sans-serif;cursor:pointer;' +
    'box-shadow:0 2px 8px rgba(0,0,0,.18)}' +
    '#nkn-pencil:hover{background:#2563eb;color:#fff}';
  document.head.appendChild(style);

  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }

  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1, INPUT: 1, SELECT: 1, OPTION: 1, CODE: 1, HTML: 1, HEAD: 1, BODY: 1 };

  /**
   * Direct text-node children of el whose text maps to a translation key.
   * Headings are often built as {t('title')} <span>{t('titleItalic')}</span> {t('titleEnd')},
   * so the interesting text frequently sits in bare text nodes beside elements —
   * collecting per node (instead of requiring a clean leaf element) makes those editable.
   */
  function collect(el) {
    var entries = [];
    for (var n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType !== 3) continue;
      var v = norm(n.nodeValue);
      if (v.length < 2) continue;
      if (v.indexOf('{') !== -1 && v.indexOf('}') !== -1) continue; // interpolated
      var cands = index[v];
      if (cands && cands.length) entries.push({ node: n, orig: n.nodeValue, cands: cands });
    }
    return entries;
  }

  var entriesFor = new WeakMap();

  function scan() {
    var els = document.body.querySelectorAll('*');
    var marked = 0;
    for (var i = 0; i < els.length; i++) {
      var el = els[i];
      if (SKIP[el.tagName] || el.isContentEditable || el.hasAttribute('data-nkn-ed')) continue;
      if (el.closest('[data-nkn-skip]')) continue;
      var entries = collect(el);
      if (!entries.length) continue;
      var ambiguous = false;
      for (var j = 0; j < entries.length; j++) if (entries[j].cands.length > 1) ambiguous = true;
      entriesFor.set(el, entries);
      el.setAttribute('data-nkn-ed', ambiguous ? 'amb' : 'one');
      // Clicking a link has to navigate, so its text gets a pencil handle instead.
      if (el.closest('a,button')) el.setAttribute('data-nkn-link', '');
      marked++;
    }
    return marked;
  }

  var editing = null;
  var pencilTarget = null;
  var hideTimer = null;

  var pencil = document.createElement('button');
  pencil.id = 'nkn-pencil';
  pencil.type = 'button';
  pencil.title = 'Редактировать текст';
  pencil.textContent = '\u270E';
  pencil.addEventListener('mousedown', function (ev) { ev.preventDefault(); ev.stopPropagation(); }, true);
  pencil.addEventListener('click', function (ev) {
    ev.preventDefault();
    ev.stopPropagation();
    if (pencilTarget) beginEdit(pencilTarget, null);
    hidePencil();
  }, true);
  pencil.addEventListener('mouseenter', function () { clearTimeout(hideTimer); });
  pencil.addEventListener('mouseleave', scheduleHide);
  document.body.appendChild(pencil);

  function showPencil(el) {
    clearTimeout(hideTimer);
    pencilTarget = el;
    var r = el.getBoundingClientRect();
    pencil.style.display = 'flex';
    pencil.style.left = Math.max(2, r.right - 4) + 'px';
    pencil.style.top = Math.max(2, r.top - 10) + 'px';
  }

  function hidePencil() {
    pencil.style.display = 'none';
    pencilTarget = null;
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hidePencil, 220);
  }

  document.addEventListener('mouseover', function (ev) {
    if (editing) return;
    var el = ev.target && ev.target.closest ? ev.target.closest('[data-nkn-link]') : null;
    if (el) showPencil(el);
    else if (ev.target !== pencil) scheduleHide();
  }, true);

  window.addEventListener('scroll', hidePencil, true);

  function beginEdit(el, ev) {
    if (editing) return;
    var entries = entriesFor.get(el);
    if (!entries || !entries.length) return;
    // re-read current text: the page may have re-rendered since the scan
    for (var i = 0; i < entries.length; i++) entries[i].orig = entries[i].node.nodeValue;
    editing = { el: el, entries: entries };
    hidePencil();
    el.setAttribute('contenteditable', 'true');
    el.setAttribute('data-nkn-editing', '');
    el.focus();
    var sel = getSelection();
    sel.removeAllRanges();
    var caret = null;
    if (ev && document.caretRangeFromPoint) {
      try { caret = document.caretRangeFromPoint(ev.clientX, ev.clientY); } catch (e) { caret = null; }
    }
    if (caret && el.contains(caret.startContainer)) {
      sel.addRange(caret);
    } else {
      var r = document.createRange();
      r.selectNodeContents(entries.length === 1 ? entries[0].node : el);
      sel.addRange(r);
    }
  }

  function finish(el) {
    el.removeAttribute('contenteditable');
    el.removeAttribute('data-nkn-editing');
    if (document.activeElement === el && el.blur) el.blur();
  }

  function commit() {
    if (!editing) return;
    var e = editing;
    editing = null;
    finish(e.el);
    // One element can hold several editable text nodes; report each that changed.
    for (var i = 0; i < e.entries.length; i++) {
      var it = e.entries[i];
      if (!it.node.isConnected) continue; // the browser merged nodes while typing
      var val = it.node.nodeValue;
      if (norm(val) === norm(it.orig)) continue;
      if (it.cands.length > 1) {
        parent.postMessage({ source: 'nkn-inline', type: 'edit', candidates: it.cands, value: val }, origin);
      } else {
        parent.postMessage(
          { source: 'nkn-inline', type: 'edit', target: it.cands[0], value: val },
          origin,
        );
      }
    }
  }

  function cancel() {
    if (!editing) return;
    for (var i = 0; i < editing.entries.length; i++) {
      var it = editing.entries[i];
      if (it.node.isConnected) it.node.nodeValue = it.orig;
    }
    finish(editing.el);
    editing = null;
  }

  function markedAt(ev) {
    return ev.target && ev.target.closest ? ev.target.closest('[data-nkn-ed]') : null;
  }

  /**
   * Inside a link, a single click has to navigate — the preview is meant to be
   * walked through. Editing link text is a double-click there; everywhere else a
   * single click is enough.
   */
  document.addEventListener('click', function (ev) {
    if (ev.metaKey || ev.ctrlKey) return;
    var el = markedAt(ev);
    if (!el || editing) return;
    if (el.closest('a,button')) return; // let the navigation happen
    ev.preventDefault();
    ev.stopPropagation();
    beginEdit(el, ev);
  }, true);

  document.addEventListener('dblclick', function (ev) {
    var el = markedAt(ev);
    if (!el || editing) return;
    ev.preventDefault();
    ev.stopPropagation();
    beginEdit(el, ev);
  }, true);

  document.addEventListener('keydown', function (ev) {
    if (!editing) return;
    if (ev.key === 'Enter' && !ev.shiftKey) { ev.preventDefault(); commit(); }
    else if (ev.key === 'Escape') { ev.preventDefault(); cancel(); }
  }, true);

  // Commit on any of: Enter, clicking away, losing focus. Relying on blur alone
  // drops edits when focus never landed on the element in the first place.
  document.addEventListener('mousedown', function (ev) {
    if (editing && !editing.el.contains(ev.target)) commit();
  }, true);

  document.addEventListener('blur', function (ev) {
    if (editing && ev.target === editing.el) commit();
  }, true);

  document.addEventListener('submit', function (ev) { if (editing) ev.preventDefault(); }, true);

  /**
   * Run only once the page has stopped changing. The load event fires before React
   * hydrates, and marking mid-hydration is what React reports as a mismatch.
   */
  var rescanTimer = null;

  function rescan() {
    if (editing) return; // never re-mark while the user is typing
    var count = scan();
    parent.postMessage(
      { source: 'nkn-inline', type: 'ready', count: document.querySelectorAll('[data-nkn-ed]').length },
      origin,
    );
    return count;
  }

  /**
   * The first pass waits for the DOM to stop changing (hydration), then the same
   * observer stays connected: the preview navigates client-side, so there is no
   * second load event to hook — new pages are picked up here.
   *
   * Only childList/characterData are observed, so writing the data-nkn-ed
   * attribute in scan() cannot retrigger this.
   */
  function watch() {
    function bump() {
      clearTimeout(rescanTimer);
      rescanTimer = setTimeout(rescan, 300);
    }
    try {
      new MutationObserver(bump).observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    } catch (e) { /* observer unavailable — the initial timer below still runs */ }
    bump();
  }

  watch();
})();
`;
