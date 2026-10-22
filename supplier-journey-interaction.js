(() => {
 const section = document.querySelector('.supplier-journey');
 if (!section) return;
 const cards = [...section.querySelectorAll('.supplier-journey-step')];
 const sources = ['assets/inner-polished/network-preview@2x.webp','assets/inner-polished/location-hub-preview@2x.webp','assets/inner-polished/about-production@2x.webp'];
 const backgrounds = document.createElement('div');
 backgrounds.className = 'journey-backgrounds';
 backgrounds.setAttribute('aria-hidden','true');
 const images = sources.map(src => { const image = new Image(); image.src = src; image.alt = ''; image.decoding = 'async'; backgrounds.append(image); return image; });
 section.prepend(backgrounds);
 let activeIndex = 0;
 function activate(index) {
  activeIndex = index;
  cards.forEach((card,i) => { card.classList.toggle('is-active',i===index); card.setAttribute('aria-pressed',String(i===index)); });
  images.forEach((image,i) => image.classList.toggle('is-active',i===index));
 }
 cards.forEach((card,index) => {
  card.tabIndex = 0;
  card.setAttribute('role','button');
  card.setAttribute('aria-label',card.querySelector('h3').textContent);
  card.addEventListener('pointerenter',event => { if(event.pointerType !== 'touch') activate(index); });
  card.addEventListener('focus',() => activate(index));
  card.addEventListener('click',() => activate(index));
  card.addEventListener('keydown',event => {
   if(event.key==='Enter'||event.key===' ') { event.preventDefault(); activate(index); }
   if(event.key==='ArrowDown'||event.key==='ArrowUp') { event.preventDefault(); cards[(index+(event.key==='ArrowDown'?1:cards.length-1))%cards.length].focus(); }
  });
 });
 const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
 let timer;
 let inView = false;
 let hovered = false;
 let focused = false;
 let paused = false;
 const toggle = document.createElement('button');
 toggle.type = 'button';
 toggle.className = 'journey-autoplay-toggle';
 toggle.textContent = 'Pause carousel';
 // Autoplay control is not displayed.
 function schedule() {
  clearTimeout(timer);
  if (paused || hovered || focused || !inView || document.hidden || motion.matches) return;
  timer = setTimeout(() => { activate((activeIndex + 1) % cards.length); schedule(); }, 4500);
 }
 toggle.addEventListener('click', () => {
  paused = !paused;
  toggle.textContent = paused ? 'Play carousel' : 'Pause carousel';
  schedule();
 });
 section.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') { hovered = true; schedule(); } });
 section.addEventListener('pointerleave', () => { hovered = false; schedule(); });
 section.addEventListener('focusin', () => { focused = true; schedule(); });
 section.addEventListener('focusout', event => { if (!section.contains(event.relatedTarget)) { focused = false; schedule(); } });
 document.addEventListener('visibilitychange', schedule);
 motion.addEventListener('change', () => { toggle.hidden = motion.matches; schedule(); });
 new IntersectionObserver(entries => { inView = entries[0].isIntersecting; schedule(); }, { threshold: .2 }).observe(section);
 toggle.hidden = motion.matches;
 activate(0);
})();
