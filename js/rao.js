/* ============================================================
   RAO & CO HVAC - Interactions
   ============================================================ */
(function(){
  'use strict';
  const doc = document;
  const $ = (s,c=doc)=>c.querySelector(s);
  const $$ = (s,c=doc)=>Array.from(c.querySelectorAll(s));
  const reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* ---------- Preloader (robust: setTimeout + CSS only, no rAF) ---------- */
  const preloader = $('.preloader');
  function hidePreloader(){
    if(!preloader || preloader.dataset.done) return;
    preloader.dataset.done = '1';
    const bar = $('.pl-bar span'); if(bar) bar.style.width='100%';
    setTimeout(()=>{
      preloader.style.opacity='0';
      setTimeout(()=>{ preloader.style.display='none'; },520);
    },400);
  }
  window.addEventListener('load', hidePreloader);
  document.addEventListener('DOMContentLoaded', ()=>setTimeout(hidePreloader,1400));
  // hard failsafe - fires even if load never resolves or tab is backgrounded
  setTimeout(hidePreloader, 2600);
  // Hero entrance is pure CSS (.hero .anim) - no JS animation needed.

  /* ---------- Scroll progress bar ---------- */
  const prog = $('.scroll-prog');
  function onScrollProg(){
    const h = doc.documentElement;
    const p = h.scrollTop/(h.scrollHeight-h.clientHeight);
    if(prog) prog.style.width = (p*100)+'%';
  }

  /* ---------- Sticky header ---------- */
  const header = $('.site-header');
  function onScrollHeader(){
    if(!header) return;
    if(window.scrollY>60) header.classList.add('stuck');
    else header.classList.remove('stuck');
  }

  /* ---------- Back to top ---------- */
  const toTop = $('.to-top');
  function onScrollTop(){
    if(!toTop) return;
    toTop.classList.toggle('show', window.scrollY>500);
  }
  if(toTop) toTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

  window.addEventListener('scroll',()=>{onScrollProg();onScrollHeader();onScrollTop();},{passive:true});
  onScrollHeader();

  /* ---------- Mobile nav ---------- */
  const burger = $('.burger'), mnav = $('.mobile-nav'), overlay = $('.overlay'), mclose = $('.mn-close');
  function openNav(){ mnav&&mnav.classList.add('open'); overlay&&overlay.classList.add('show'); doc.body.style.overflow='hidden'; }
  function closeNav(){ mnav&&mnav.classList.remove('open'); overlay&&overlay.classList.remove('show'); doc.body.style.overflow=''; }
  burger&&burger.addEventListener('click',openNav);
  mclose&&mclose.addEventListener('click',closeNav);
  overlay&&overlay.addEventListener('click',closeNav);
  $$('.mn-toggle').forEach(t=>{
    t.addEventListener('click',e=>{
      e.preventDefault();
      const sub = t.nextElementSibling;
      t.classList.toggle('active');
      if(sub) sub.style.maxHeight = sub.style.maxHeight ? '' : sub.scrollHeight+'px';
    });
  });
  $$('.mobile-nav a:not(.mn-toggle)').forEach(a=>a.addEventListener('click',closeNav));

  /* ---------- Custom cursor ---------- */
  const dot = $('.cursor-dot'), ring = $('.cursor-ring');
  if(dot && ring && !('ontouchstart' in window)){
    let rx=0,ry=0,mx=0,my=0;
    window.addEventListener('mousemove',e=>{
      mx=e.clientX;my=e.clientY;
      dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`;
    });
    (function loop(){
      rx+=(mx-rx)*0.18; ry+=(my-ry)*0.18;
      ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();
    $$('a,button,.svc-card,.proj-card,.ind-card,input,textarea').forEach(el=>{
      el.addEventListener('mouseenter',()=>ring.classList.add('hover'));
      el.addEventListener('mouseleave',()=>ring.classList.remove('hover'));
    });
  }

  /* ---------- Scroll reveal (robust - no blank sections) ---------- */
  const revEls = $$('.reveal,.in-view-trigger,.split-lines');
  function reveal(el){ el.classList.add('in-view'); }
  if(reduce || !('IntersectionObserver' in window)){
    // Reduced-motion or unsupported: show everything immediately.
    revEls.forEach(reveal);
  } else {
    // threshold:0 → an element reveals the instant its first pixel enters the
    // viewport. This is essential for blocks taller than the screen, which can
    // never reach a fractional threshold and would otherwise stay blank.
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(en=>{
        if(en.isIntersecting){ reveal(en.target); io.unobserve(en.target); }
      });
    },{threshold:0, rootMargin:'0px 0px -40px 0px'});
    revEls.forEach(el=>io.observe(el));
    // Backup sweep - reveals anything already in/near the viewport on load and
    // catches fast scroll jumps the observer might skip.
    function sweep(){
      const vh = window.innerHeight;
      revEls.forEach(el=>{
        if(el.classList.contains('in-view')) return;
        const r = el.getBoundingClientRect();
        if(r.top < vh*0.98 && r.bottom > 0){ reveal(el); io.unobserve(el); }
      });
    }
    window.addEventListener('scroll', sweep, {passive:true});
    window.addEventListener('load', sweep);
    sweep();
    // Absolute failsafe: content can never remain permanently hidden.
    setTimeout(()=>revEls.forEach(reveal), 4500);
  }

  /* ---------- Counters ---------- */
  const counters = $$('[data-count]');
  const cio = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(!en.isIntersecting) return;
      const el = en.target;
      const target = parseFloat(el.dataset.count);
      const dec = (el.dataset.count.indexOf('.')>-1)?1:0;
      const dur = 1800; const start = performance.now();
      function tick(now){
        const p = Math.min((now-start)/dur,1);
        const eased = 1-Math.pow(1-p,3);
        el.textContent = (target*eased).toFixed(dec);
        if(p<1) requestAnimationFrame(tick);
        else el.textContent = target.toFixed(dec);
      }
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  },{threshold:0.5});
  counters.forEach(c=>cio.observe(c));

  /* ---------- FAQ accordion ---------- */
  // open any faq-item pre-marked .open
  $$('.faq-item.open .faq-a').forEach(a=>{ a.style.maxHeight = a.scrollHeight+'px'; });
  $$('.faq-q').forEach(q=>{
    q.addEventListener('click',()=>{
      const item = q.closest('.faq-item');
      const ans = item.querySelector('.faq-a');
      const isOpen = item.classList.contains('open');
      $$('.faq-item').forEach(i=>{
        i.classList.remove('open');
        const a=i.querySelector('.faq-a'); if(a) a.style.maxHeight='';
      });
      if(!isOpen){
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight+'px';
      }
    });
  });

  /* ---------- Services accordion (expand image) ---------- */
  $$('.svc-row').forEach(row=>{
    row.addEventListener('click',()=>{
      const link = row.dataset.href;
      if(link) window.location.href = link;
    });
  });

  /* ---------- Testimonials slider ---------- */
  const tcards = $$('.testi-card');
  if(tcards.length){
    let ti=0, timer;
    function show(i){
      tcards.forEach((c,idx)=>c.classList.toggle('active',idx===i));
      ti=i;
    }
    function next(){ show((ti+1)%tcards.length); }
    function prev(){ show((ti-1+tcards.length)%tcards.length); }
    function auto(){ clearInterval(timer); timer=setInterval(next,6000); }
    $('.testi-next')&&$('.testi-next').addEventListener('click',()=>{next();auto();});
    $('.testi-prev')&&$('.testi-prev').addEventListener('click',()=>{prev();auto();});
    show(0); auto();
  }

  /* ---------- Product explorer filters ---------- */
  const pfWrap = $('.product-explorer');
  if(pfWrap){
    const chips = $$('.pf-chip', pfWrap);
    const cards = $$('.pcard', pfWrap);
    const countEl = $('.pf-count', pfWrap);
    const emptyEl = $('.pf-empty', pfWrap);
    const state = {brand:'all', type:'all', size:'all'};
    function apply(){
      let n=0;
      cards.forEach(c=>{
        const ok = (state.brand==='all'||c.dataset.brand===state.brand)
                && (state.type ==='all'||c.dataset.type ===state.type)
                && (state.size ==='all'||c.dataset.size ===state.size);
        c.style.display = ok ? '' : 'none';
        if(ok) n++;
      });
      if(countEl) countEl.textContent = n + (n===1?' product':' products');
      if(emptyEl) emptyEl.style.display = n ? 'none' : 'block';
    }
    chips.forEach(ch=>ch.addEventListener('click',()=>{
      const g = ch.dataset.group;
      $$('.pf-chip[data-group="'+g+'"]', pfWrap).forEach(x=>x.classList.remove('active'));
      ch.classList.add('active');
      state[g] = ch.dataset.val;
      apply();
    }));
    apply();
  }

  /* ---------- Clients sector filter ---------- */
  const csWrap = $('.client-sectors');
  const cGrid = $('.client-grid');
  if(csWrap && cGrid){
    const cells = $$('.client-cell', cGrid);
    const cEmpty = $('.client-empty');
    const btns = $$('.cs', csWrap);
    btns.forEach(btn=>btn.addEventListener('click',()=>{
      btns.forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const s = btn.dataset.sector;
      let n=0;
      cells.forEach(c=>{
        const ok = (s==='all' || c.dataset.sector===s);
        c.style.display = ok ? '' : 'none';
        if(ok) n++;
      });
      if(cEmpty) cEmpty.style.display = n ? 'none' : 'block';
    }));
  }

  /* ---------- Smooth anchor scroll ---------- */
  $$('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const id=a.getAttribute('href');
      if(id.length<2) return;
      const t=$(id);
      if(t){ e.preventDefault(); window.scrollTo({top:t.offsetTop-90,behavior:'smooth'}); }
    });
  });

  /* ---------- Contact form (front-end only demo) ---------- */
  const cform = $('#contactForm');
  if(cform){
    cform.addEventListener('submit',e=>{
      e.preventDefault();
      const btn = cform.querySelector('[type=submit]');
      const orig = btn.innerHTML;
      btn.innerHTML='Sending...';
      setTimeout(()=>{
        btn.innerHTML='<i class="fa-solid fa-check"></i> Message Sent';
        cform.reset();
        setTimeout(()=>btn.innerHTML=orig,3000);
      },900);
    });
  }
})();
