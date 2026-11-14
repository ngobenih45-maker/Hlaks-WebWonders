/* Hlaks Web Wonders - site script */
(function () {
  'use strict';

  var WA_NUMBER = '27750981170';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia('(pointer: coarse)').matches;

  /* ---------- WhatsApp message automation ----------
     Every element with data-wa="topic" gets a message that matches
     what the visitor clicked. Optional data-wa-detail adds a detail
     (for example the name of a project on the Our Work page). */
  var TOPICS = {
    general:   'I would like to make an enquiry about your website development services.',
    quote:     'I would like to request a quotation for a new website.',
    booking:   'I would like to book a consultation for a website project.',
    startup:   'I am interested in the Startup Package (R1,500) and would like to get started.',
    business:  'I am interested in the Business Growth package (R3,000) and would like to get started.',
    ecommerce: 'I am interested in the E-Commerce Wonder package (R5,000) and would like to get started.',
    redesign:  'I would like to redesign my existing website.',
    store:     'I would like an online store for my business.',
    support:   'I need support or maintenance for my website.',
    referral:  'I would like to register as a referrer and receive the details of the referral reward.',
    work:      'I viewed one of the projects on your Our Work page and would like a similar website.'
  };

  function pageLabel() {
    var p = location.pathname.split('/').pop() || 'index.html';
    var map = {
      'index.html': 'Home page', 'home.html': 'Home page', 'about.html': 'About page',
      'our-work.html': 'Our Work page', 'contact.html': 'Contact page'
    };
    return map[p] || 'website';
  }

  function buildMessage(topic, detail) {
    var line = TOPICS[topic] || TOPICS.general;
    var msg = 'Hello Hlaks Web Wonders, ' + line;
    if (detail) { msg += ' Project: ' + detail + '.'; }
    msg += ' Please reply with the next steps. (Sent from the ' + pageLabel() + ')';
    return msg;
  }

  function waLink(topic, detail) {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(buildMessage(topic, detail));
  }

  document.querySelectorAll('[data-wa]').forEach(function (el) {
    el.setAttribute('href', waLink(el.getAttribute('data-wa'), el.getAttribute('data-wa-detail')));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  });

  /* ---------- Header / nav ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (header) { header.classList.toggle('scrolled', window.scrollY > 20); }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  var burger = document.querySelector('.burger');
  var links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        links.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 3D tilt on cards ---------- */
  if (!coarse && !reduce) {
    document.querySelectorAll('.tilt').forEach(function (el) {
      var max = parseFloat(el.getAttribute('data-tilt')) || 8;
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;
        var y = (e.clientY - r.top) / r.height;
        el.style.transform = 'rotateX(' + ((0.5 - y) * max).toFixed(2) + 'deg) rotateY(' + ((x - 0.5) * max * 1.4).toFixed(2) + 'deg) translateZ(0)';
        el.style.setProperty('--mx', (x * 100) + '%');
        el.style.setProperty('--my', (y * 100) + '%');
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* ---------- Hero 3D scene follows pointer / scroll ---------- */
  var scene = document.querySelector('.scene');
  var stack = document.querySelector('.stack');
  if (scene && stack && !reduce) {
    if (!coarse) {
      scene.addEventListener('mousemove', function (e) {
        var r = scene.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        stack.style.transform = 'rotateX(' + (8 - y * 18).toFixed(2) + 'deg) rotateY(' + (-16 + x * 26).toFixed(2) + 'deg)';
      });
      scene.addEventListener('mouseleave', function () {
        stack.style.transform = 'rotateX(8deg) rotateY(-16deg)';
      });
    } else {
      window.addEventListener('scroll', function () {
        var s = Math.min(window.scrollY, 600) / 600;
        stack.style.transform = 'rotateX(' + (8 - s * 10) + 'deg) rotateY(' + (-16 + s * 30) + 'deg)';
      }, { passive: true });
    }
  }

  /* ---------- Animated counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function runCounter(el) {
    var end = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce) { el.textContent = end + suffix; return; }
    var start = null, dur = 1600;
    function tick(ts) {
      if (!start) { start = ts; }
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased) + suffix;
      if (p < 1) { requestAnimationFrame(tick); }
    }
    requestAnimationFrame(tick);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { runCounter(en.target); co.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { co.observe(c); });
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- Floating WhatsApp menu ---------- */
  var fab = document.querySelector('.wa-float');
  if (fab) {
    var btn = fab.querySelector('.wa-fab');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = fab.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!fab.contains(e.target)) { fab.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { fab.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* ---------- Contact form -> WhatsApp ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var SERVICE_TOPIC = {
      'Startup Package (R1,500)': 'startup',
      'Business Growth Package (R3,000)': 'business',
      'E-Commerce Wonder Package (R5,000)': 'ecommerce',
      'Website Redesign': 'redesign',
      'Online Store': 'store',
      'Website Support and Maintenance': 'support',
      'Book a Consultation': 'booking',
      'Referral Programme': 'referral'
    };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.elements['name'].value.trim();
      var phone = form.elements['phone'].value.trim();
      var service = form.elements['service'].value;
      var details = form.elements['message'].value.trim();
      if (!form.elements['consent'].checked) {
        form.elements['consent'].focus();
        return;
      }
      var topic = SERVICE_TOPIC[service] || 'quote';
      var msg = 'Hello Hlaks Web Wonders, my name is ' + name + '. ' + (TOPICS[topic] || TOPICS.quote);
      msg += ' Service selected: ' + service + '.';
      if (phone) { msg += ' My contact number: ' + phone + '.'; }
      if (details) { msg += ' Project details: ' + details; }
      msg += ' (Sent from the Contact page. I consent to my details being processed in line with POPIA.)';
      var url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(msg);
      var w = window.open(url, '_blank', 'noopener');
      if (!w) { window.location.href = url; }
    });
  }

  /* ---------- Image fallbacks (never show a broken image) ---------- */
  document.querySelectorAll('img[data-fallback]').forEach(function (img) {
    function fail() { var box = img.closest('.work-shot, .founder'); if (box) { box.classList.add('noimg'); } img.style.display = 'none'; }
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0) { fail(); }
  });

  /* ---------- Year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
