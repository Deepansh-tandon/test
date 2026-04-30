/* ── CURSOR ── */
const dot  = document.getElementById('dot');
const ring = document.getElementById('ring');
let mx=0,my=0,rx=0,ry=0;
const isPointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

if(isPointer){
  document.addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    dot.style.left=mx+'px';dot.style.top=my+'px';
    const hero=document.querySelector('.hero');
    const hr=hero.getBoundingClientRect();
    if(e.clientY>hr.top&&e.clientY<hr.bottom){
      const px=((e.clientX-hr.left)/hr.width*100).toFixed(1)+'%';
      const py=((e.clientY-hr.top)/hr.height*100).toFixed(1)+'%';
      document.getElementById('spotlight').style.background=
        `radial-gradient(600px circle at ${px} ${py},rgba(255,255,255,.045),transparent 60%)`;
    }
  });
  (function animRing(){
    rx+=(mx-rx)*.12;ry+=(my-ry)*.12;
    ring.style.left=rx+'px';ring.style.top=ry+'px';
    requestAnimationFrame(animRing);
  })();
  document.querySelectorAll('a,button,.step-card,.rc,.sv-pill').forEach(el=>{
    el.addEventListener('mouseenter',()=>ring.classList.add('hovered'));
    el.addEventListener('mouseleave',()=>ring.classList.remove('hovered'));
  });
}

/* ── SCROLL PROGRESS ── */
const scrollBar=document.getElementById('scrollBar');
const mainNav=document.getElementById('mainNav');
window.addEventListener('scroll',()=>{
  const pct=(window.scrollY/(document.body.scrollHeight-window.innerHeight))*100;
  scrollBar.style.width=pct+'%';
  mainNav.classList.toggle('scrolled',window.scrollY>80);
},{ passive:true });

/* ── PARALLAX HERO GRID ── */
const heroGrid=document.getElementById('heroGrid');
window.addEventListener('scroll',()=>{
  heroGrid.style.transform=`translate3d(0,${window.scrollY*.15}px,0)`;
},{passive:true});

/* ── WORD SPLIT on H2s ── */
document.querySelectorAll('.sec h2,.pv-sec h2,.cta-sec h2').forEach(h2=>{
  const html=h2.innerHTML;
  const parts=html.split(/(<br\s*\/?>|\n)/gi);
  let out='';let wi=0;
  parts.forEach(part=>{
    if(/^<br/i.test(part)){out+='<br>';return;}
    part.split(/\s+/).filter(Boolean).forEach(word=>{
      out+=`<span class="h2-word"><span class="h2-word-inner" style="--wi:${wi}">${word}</span></span> `;
      wi++;
    });
  });
  h2.innerHTML=out;
});

/* ── INTERSECTION OBSERVER ── */
const io=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    const el=entry.target;
    if(el.classList.contains('reveal'))el.classList.add('visible');
    if(el.dataset.count!==undefined)animateCount(el);
    if(el.classList.contains('bc-fill')||el.classList.contains('rc-top-fill')||el.classList.contains('bar-fill-anim')){
      const w=el.dataset.width||'0';
      setTimeout(()=>{el.style.width=w+'%';},200);
    }
    if(el.classList.contains('step-card'))el.classList.add('visible-card');
    if(el.classList.contains('bc-fill')){
      const after=el.closest('.bc-track')?.previousElementSibling?.querySelector('.bc-after');
      if(after&&after.dataset.count)animateCount(after);
    }
    if(el.tagName==='H2'&&el.querySelector('.h2-word-inner'))el.classList.add('split-visible');
    if(el.id==='tlTrack'){
      const steps=document.querySelectorAll('.tl-step');
      const fill=document.getElementById('tlFill');
      steps.forEach((s,i)=>{setTimeout(()=>{s.classList.add('lit');},i*180);});
      if(fill)setTimeout(()=>{fill.style.width='100%';},0);
    }
    io.unobserve(el);
  });
},{threshold:0.15});

document.querySelectorAll(
  '.reveal,[data-count],.bc-fill,.rc-top-fill,.bar-fill-anim,.step-card,h2,#tlTrack'
).forEach(el=>io.observe(el));

/* ── COUNT UP ── */
function animateCount(el){
  const target=parseFloat(el.dataset.count);
  const dec=parseInt(el.dataset.decimals||0);
  const prefix=el.dataset.prefix||'';
  const suffix=el.dataset.suffix||'';
  const dur=1800;
  const start=performance.now();
  function tick(now){
    const t=Math.min((now-start)/dur,1);
    const ease=t===1?1:1-Math.pow(2,-10*t);
    const val=(target*ease).toFixed(dec);
    el.textContent=prefix+val+suffix;
    if(t<1)requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

window.addEventListener('load',()=>{
  document.querySelectorAll('.stat-strip [data-count]').forEach(animateCount);
});

/* ── DUEL COUNTER ── */
(function(){
  const counter=document.getElementById('duelCounter');
  if(!counter)return;
  let done=false;
  const io=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting||done)return;
      done=true;
      const from=47,to=0,dur=1400;
      const s=performance.now();
      (function tick(now){
        const t=Math.min((now-s)/dur,1);
        const ease=t===1?1:1-Math.pow(2,-10*t);
        counter.textContent=Math.round(from+(to-from)*ease)+'%';
        if(t<1)requestAnimationFrame(tick);
        else counter.textContent='0%';
      })(s);
      io.unobserve(counter);
    });
  },{threshold:0.5});
  io.observe(counter);
})();

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.btn-primary,.cta-btn').forEach(btn=>{
  btn.addEventListener('pointermove',e=>{
    const r=btn.getBoundingClientRect();
    const x=(e.clientX-(r.left+r.width/2))*.22;
    const y=(e.clientY-(r.top+r.height/2))*.22;
    btn.style.transform=`translate(${x}px,${y}px)`;
  });
  btn.addEventListener('pointerleave',()=>{btn.style.transform='';});
});
