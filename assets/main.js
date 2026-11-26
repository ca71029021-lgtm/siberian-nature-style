/* PHASE 7 prototype — interactions */
(function () {
  var hdr = document.getElementById('hdr');
  function onScroll() {
    if (!hdr) return;
    if (window.scrollY > 40) hdr.classList.add('solid');
    else hdr.classList.remove('solid');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var burger = document.getElementById('burger');
  var mmenu = document.getElementById('mmenu');
  var mclose = document.getElementById('mclose');
  if (burger && mmenu) {
    function menuItems() {
      return Array.from(mmenu.querySelectorAll('button:not([disabled]), a[href]'));
    }
    function openMenu() {
      mmenu.inert = false;
      mmenu.setAttribute('aria-hidden', 'false');
      burger.setAttribute('aria-expanded', 'true');
      mmenu.classList.add('open');
      document.body.style.overflow = 'hidden';
      (mclose || menuItems()[0]).focus();
    }
    function closeMenu(restoreFocus) {
      mmenu.classList.remove('open');
      mmenu.setAttribute('aria-hidden', 'true');
      mmenu.inert = true;
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (restoreFocus) burger.focus();
    }
    closeMenu(false);
    burger.addEventListener('click', function () {
      if (mmenu.classList.contains('open')) closeMenu(true);
      else openMenu();
    });
    if (mclose) mclose.addEventListener('click', function () { closeMenu(true); });
    mmenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { closeMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (!mmenu.classList.contains('open')) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        closeMenu(true);
      }
      if (e.key === 'Tab') {
        var items = menuItems();
        var first = items[0];
        var last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        } else if (!mmenu.contains(document.activeElement)) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  }

  /* предзаполнение изделия из ?product=ID и темы из ?topic= */
  var fp = document.getElementById('fProduct');
  var qs = new URLSearchParams(location.search);
  if (fp) {
    var pr = qs.get('product');
    if (pr) fp.value = pr;
  }
  if (qs.get('topic') === 'cooperation') {
    var ta = document.querySelector('form textarea');
    if (ta && !ta.value) ta.value = 'Сотрудничество для профессионалов. Тип объекта, изделия, размеры: ';
  }

  /* отправка заявки через WhatsApp с готовым сообщением */
  window.protoSubmit = function (e) {
    e.preventDefault();
    var f = e.target;
    function val(sel) { var el = f.querySelector(sel); return el ? el.value.trim() : ''; }
    var lines = ['Здравствуйте! Заявка с сайта Siberian Nature Style.'];
    var name = val('input[placeholder="Как к вам обращаться"]');
    var tel = val('input[type="tel"]');
    var mail = val('input[type="email"]');
    var prod = val('#fProduct');
    var msg = val('textarea');
    if (name) lines.push('Имя: ' + name);
    if (tel) lines.push('Телефон: ' + tel);
    if (mail) lines.push('E-mail: ' + mail);
    if (prod) lines.push('Изделие: ' + prod);
    if (msg) lines.push('Сообщение: ' + msg);
    var url = 'https://wa.me/79236650092?text=' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank', 'noopener');
    return false;
  };
})();
