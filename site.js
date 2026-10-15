(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Menu mobile */
  $$('[data-burger]').forEach(function (b) {
    var nav = document.getElementById('menu-mobile');
    if (!nav) return;
    b.addEventListener('click', function () {
      var open = nav.hidden;
      nav.hidden = !open;
      b.setAttribute('aria-expanded', String(open));
      b.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
      $('.i-open', b).hidden = open;
      $('.i-close', b).hidden = !open;
    });
  });

  /* Timeline Beranda */
  var tl = $('[data-tl]');
  if (tl) {
    var steps = $$('.tl-step', tl);
    var fill = $('.tl-fill', tl);
    var setStep = function (i) {
      steps.forEach(function (s, k) {
        s.classList.toggle('is-on', k === i);
        s.setAttribute('aria-pressed', String(k === i));
      });
      if (fill) fill.style.width = (steps.length > 1 ? (i / (steps.length - 1)) * 100 : 100) + '%';
    };
    steps.forEach(function (s, i) { s.addEventListener('click', function () { setStep(i); }); });
  }

  /* Perjalanan Kami (Tentang Kami) */
  var ST = window.DM_STAGES || [];
  var jrSteps = $$('[data-jr]');
  if (ST.length && jrSteps.length) {
    var cur = 0;
    var jrFill = $('.jr-fill');
    var panel = $('#jr-panel');
    var render = function () {
      var s = ST[cur];
      jrSteps.forEach(function (b, k) {
        b.classList.toggle('is-on', k === cur);
        b.setAttribute('aria-pressed', String(k === cur));
      });
      if (jrFill) jrFill.style.width = (cur / (ST.length - 1)) * 100 + '%';
      $('#jr-pyear').textContent = s.year;
      $('#jr-ptitle').textContent = s.title;
      $('#jr-pdesc').textContent = s.desc;
      $('#jr-pnum').textContent = cur + 1;
      var tag = $('#jr-ptag');
      tag.textContent = s.plan ? 'Rencana pengembangan' : 'Tahap yang dijalani';
      tag.classList.toggle('line', s.plan);
      panel.classList.toggle('is-plan', s.plan);
      $('#jr-prev').disabled = cur === 0;
      $('#jr-next').disabled = cur === ST.length - 1;
    };
    jrSteps.forEach(function (b) { b.addEventListener('click', function () { cur = +b.getAttribute('data-jr'); render(); }); });
    $('#jr-prev').addEventListener('click', function () { if (cur > 0) { cur--; render(); } });
    $('#jr-next').addEventListener('click', function () { if (cur < ST.length - 1) { cur++; render(); } });
    render();
  }
  $$('[data-jm]').forEach(function (li) {
    var btn = $('.jm-btn', li);
    btn.addEventListener('click', function () {
      var willOpen = !li.classList.contains('is-open');
      $$('[data-jm]').forEach(function (o) {
        o.classList.remove('is-open');
        $('.jm-btn', o).setAttribute('aria-expanded', 'false');
        $('.jm-body', o).hidden = true;
      });
      if (willOpen) {
        li.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
        $('.jm-body', li).hidden = false;
      }
    });
  });

  /* Filter artikel */
  var fbtns = $$('.f-btn[data-cat]');
  if (fbtns.length) {
    var cards = $$('#art-grid [data-cat]');
    var grid = $('#art-grid'), empty = $('#art-empty'), count = $('#f-count');
    var apply = function (cat) {
      var n = 0;
      fbtns.forEach(function (b) {
        var on = b.getAttribute('data-cat') === cat;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      cards.forEach(function (c) {
        var show = cat === 'Semua' || c.getAttribute('data-cat') === cat;
        c.hidden = !show;
        if (show) n++;
      });
      grid.hidden = n === 0;
      empty.hidden = n !== 0;
      $('#empty-cat').textContent = cat;
      count.textContent = n ? 'Menampilkan ' + n + ' artikel' : 'Tidak ada artikel';
    };
    fbtns.forEach(function (b) { b.addEventListener('click', function () { apply(b.getAttribute('data-cat')); }); });
    $('#show-all').addEventListener('click', function () { apply('Semua'); });
  }

  /* Formulir Kirim Pesan (simulasi) */
  var form = $('#kontak-form');
  if (form) {
    var F = { name: $('#f-nama'), contact: $('#f-kontak'), msg: $('#f-pesan') };
    var purpose = function () { var r = $('input[name="purpose"]:checked', form); return r ? r.value : ''; };
    var check = function (k) {
      var v = k === 'purpose' ? purpose() : String(F[k].value || '').trim();
      if (k === 'name') return !v ? 'Mohon isi nama Anda.' : (v.length < 2 ? 'Nama terlalu pendek.' : '');
      if (k === 'contact') {
        if (!v) return 'Mohon isi nomor WhatsApp atau email.';
        if (v.indexOf('@') !== -1) return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Format email belum sesuai, contoh: nama@email.com';
        return /^(\+62|62|0)8[0-9]{7,12}$/.test(v.replace(/[\s\-().]/g, '')) ? '' : 'Format nomor belum sesuai, contoh: 0812xxxxxxxx';
      }
      if (k === 'purpose') return v ? '' : 'Pilih salah satu keperluan.';
      if (k === 'msg') return !v ? 'Mohon tuliskan pesan Anda.' : (v.length < 10 ? 'Pesan minimal 10 karakter.' : '');
      return '';
    };
    var errIcon = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v6M12 16.5v.5"></path></svg>';
    var show = function (k, m) {
      var el = $('#e-' + k);
      el.hidden = !m;
      el.innerHTML = m ? errIcon + '<span></span>' : '';
      if (m) el.lastChild.textContent = m;
      if (F[k]) { F[k].classList.toggle('is-err', !!m); F[k].setAttribute('aria-invalid', String(!!m)); }
    };
    var keys = ['name', 'contact', 'purpose', 'msg'];
    var syncRadios = function () { $$('.radio', form).forEach(function (l) { l.classList.toggle('is-on', $('input', l).checked); }); };
    var touched = {};
    var onEdit = function (k) {
      $('#f-sim').hidden = true;
      if (touched[k]) show(k, check(k));
      var n = keys.filter(function (x) { return touched[x] && check(x); }).length;
      $('#f-alert').hidden = n === 0;
      $('#f-alert-t').textContent = 'Periksa kembali ' + n + ' kolom yang belum sesuai.';
    };
    ['name', 'contact', 'msg'].forEach(function (k) { F[k].addEventListener('input', function () { onEdit(k); }); });
    $$('input[name="purpose"]', form).forEach(function (r) { r.addEventListener('change', function () { syncRadios(); onEdit('purpose'); }); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = 0;
      keys.forEach(function (k) { touched[k] = true; var m = check(k); show(k, m); if (m) bad++; });
      $('#f-alert').hidden = bad === 0;
      $('#f-alert-t').textContent = 'Periksa kembali ' + bad + ' kolom yang belum sesuai.';
      if (bad) { var first = form.querySelector('.is-err') || $('input[name="purpose"]', form); if (first) first.focus(); $('#f-sim').hidden = true; return; }
      $('#f-preview').textContent = 'Halo tim Dairy Maggnesia,\nNama: ' + F.name.value.trim() + '\nKontak: ' + F.contact.value.trim() + '\nKeperluan: ' + purpose() + '\nPesan: ' + F.msg.value.trim();
      $('#f-sim').hidden = false;
    });
    $('#f-edit').addEventListener('click', function () { $('#f-sim').hidden = true; F.msg.focus(); });
    $('#f-reset').addEventListener('click', function () {
      form.reset(); syncRadios(); touched = {};
      keys.forEach(function (k) { show(k, ''); });
      $('#f-alert').hidden = true; $('#f-sim').hidden = true;
    });
  }
})();
