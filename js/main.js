/* =============================================
   RIO VET — JavaScript
   Hospital Veterinário e Pet Shop
   ============================================= */
(function(){
  'use strict';

  /* --- DOM references --- */
  const header = document.querySelector('.header');
  const burger = document.querySelector('.header__burger');
  const menuPanel = document.querySelector('.mobile-menu');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  const mobileClose = document.getElementById('mobileClose');
  const backToTop = document.getElementById('backToTop');
  const strip1 = document.getElementById('stripContent1');
  const strip2 = document.getElementById('stripContent2');

  /* --- Header scroll shadow --- */
  function onScroll(){
    const y = window.scrollY;
    if(y > 20){ header.classList.add('header--scrolled'); }
    else { header.classList.remove('header--scrolled'); }
    if(backToTop){
      if(y > 400){ backToTop.classList.add('visible'); }
      else { backToTop.classList.remove('visible'); }
    }
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  /* --- Mobile menu toggle --- */
  function closeMenu(){
    burger.classList.remove('active');
    menuPanel.classList.remove('active');
    menuPanel.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    burger.setAttribute('aria-expanded','false');
  }
  function openMenu(){
    burger.classList.add('active');
    menuPanel.classList.add('active');
    menuPanel.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    burger.setAttribute('aria-expanded','true');
  }
  if(burger && menuPanel){
    burger.addEventListener('click', function(){
      if(menuPanel.classList.contains('active')){ closeMenu(); }
      else { openMenu(); }
    });
    if(mobileBackdrop){
      mobileBackdrop.addEventListener('click', closeMenu);
    }
    if(mobileClose){
      mobileClose.addEventListener('click', closeMenu);
    }
    // Close on link click
    menuPanel.querySelectorAll('.mobile-menu__link').forEach(function(link){
      link.addEventListener('click', closeMenu);
    });
  }

  /* --- Smooth scroll --- */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var id = this.getAttribute('href');
      if(!id || id === '#') return;
      var target = document.querySelector(id);
      if(target){
        e.preventDefault();
        var offset = header.offsetHeight + 16;
        var top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({top:top, behavior:'smooth'});
      }
    });
  });

  /* --- Back to top --- */
  if(backToTop){
    backToTop.addEventListener('click', function(e){
      e.preventDefault();
      window.scrollTo({top:0, behavior:'smooth'});
    });
  }

  /* --- Scrolling strip content --- */
  var stripItems = [
    {text:'Urgências 24h', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'},
    {text:'Cirurgia com Transparência', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'},
    {text:'Atendimento Domiciliar', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>'},
    {text:'Espaço Felino', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>'},
    {text:'Anestesia Inalatória', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/></svg>'},
    {text:'Programa 60+', icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>'}
  ];

  function buildStripHTML(){
    var html = '';
    stripItems.forEach(function(item){
      html += '<span class="strip__item">' + item.icon + ' ' + item.text + '</span>';
    });
    return html;
  }

  if(strip1 && strip2){
    var content = buildStripHTML();
    // Duplicate for seamless loop
    strip1.innerHTML = content + content + content;
    strip2.innerHTML = content + content + content;
  }

  /* --- Intersection Observer: reveal on scroll --- */
  if('IntersectionObserver' in window){
    var revealEls = document.querySelectorAll('.anim-item');
    var revealObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('reveal','is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -40px 0px'});

    revealEls.forEach(function(el){ revealObserver.observe(el); });
  } else {
    // Fallback: show everything
    document.querySelectorAll('.anim-item').forEach(function(el){
      el.classList.add('reveal','is-visible');
    });
  }

  /* --- Count-up animation --- */
  function animateCount(el){
    var target = parseInt(el.getAttribute('data-target'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    var duration = 2000;
    var start = 0;
    var startTime = null;

    function step(timestamp){
      if(!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(eased * target);
      el.textContent = prefix + current.toLocaleString('pt-BR') + suffix;
      if(progress < 1){
        requestAnimationFrame(step);
      } else {
        el.textContent = prefix + target.toLocaleString('pt-BR') + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  var countEls = document.querySelectorAll('[data-target]');
  if(countEls.length && 'IntersectionObserver' in window){
    var countObserver = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, {threshold:0.5});
    countEls.forEach(function(el){ countObserver.observe(el); });
  }

  /* --- FAQ Accordion --- */
  var faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(function(item){
    var btn = item.querySelector('.faq__question');
    if(!btn) return;
    btn.addEventListener('click', function(){
      var isActive = item.classList.contains('active');
      // Close all
      faqItems.forEach(function(fi){
        fi.classList.remove('active');
        fi.querySelector('.faq__question').setAttribute('aria-expanded','false');
      });
      // Toggle current
      if(!isActive){
        item.classList.add('active');
        btn.setAttribute('aria-expanded','true');
      }
    });
  });

  /* --- WhatsApp Floating Button --- */
  var waFloat = document.createElement('a');
  waFloat.href = 'https://wa.me/5521965959055?text=Ol%C3%A1!%20Vim%20pelo%20site%20e%20gostaria%20de%20saber%20mais%20sobre%20os%20servi%C3%A7os%20da%20Rio%20Vet.';
  waFloat.target = '_blank';
  waFloat.rel = 'noopener noreferrer';
  waFloat.className = 'whatsapp-float';
  waFloat.setAttribute('aria-label','Falar no WhatsApp');
  waFloat.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><use href="#whatsapp-icon"/></svg>';
  document.body.appendChild(waFloat);

  /* --- Open Now Status --- */
  function updateOpenStatus(){
    var label = document.querySelector('.open-badge');
    if(!label){
      // Create badge dynamically if not in HTML
      label = document.createElement('span');
      label.className = 'open-badge';
      var headerActions = document.querySelector('.header__actions');
      if(headerActions){ headerActions.insertBefore(label, headerActions.firstChild); }
      else { return; }
    }
    var now = new Date();
    var hour = now.getHours();
    var day = now.getDay(); // 0=Sun, 6=Sat
    var open = false;
    if(day >= 1 && day <= 5){ open = (hour >= 8 && hour < 21); }
    else if(day === 0 || day === 6){ open = (hour >= 8 && hour < 19); }
    if(open){
      label.innerHTML = '<span class="open-dot"></span> Aberto agora';
      label.style.background = 'rgba(74,222,128,.12)';
      label.style.color = '#16a34a';
      label.style.borderColor = 'rgba(74,222,128,.2)';
    } else {
      label.innerHTML = '<span class="open-dot" style="background:#f87171"></span> Fechado agora';
      label.style.background = 'rgba(248,113,113,.12)';
      label.style.color = '#dc2626';
      label.style.borderColor = 'rgba(248,113,113,.2)';
    }
  }
  updateOpenStatus();

})();
