const guidelineMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('#how-localization-works .localization-card').forEach(card => { card.tabIndex = 0; });
const contactGuidelines = [...document.querySelectorAll('main > .contact')].map((section, index) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'scroll-guideline');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  const path = document.createElementNS(svg.namespaceURI, 'path');
  const mask = document.createElementNS(svg.namespaceURI, 'mask');
  mask.id = `inner-guideline-clearance-${index}`;
  mask.setAttribute('maskUnits', 'userSpaceOnUse');
  const defs = document.createElementNS(svg.namespaceURI, 'defs');
  defs.append(mask);
  svg.append(defs, path);
  path.setAttribute('mask', `url(#${mask.id})`);
  section.append(svg);
  section.classList.add('has-scroll-guideline');
  return { section, svg, path, mask, length: 0 };
});
const mediaContactLines = [...document.querySelectorAll('.media-contact-brand')];
let contactLineFrame = 0;
function drawContactLines() {
  contactLineFrame = 0;
  const progressFor = section => {
    const bounds = section.getBoundingClientRect();
    return guidelineMotion.matches ? 1 : Math.max(0, Math.min(1, (innerHeight * .8 - bounds.top) / bounds.height));
  };
  contactGuidelines.forEach(({ section, path, length }) => {
    path.style.strokeDashoffset = String(length * (1 - progressFor(section)));
  });
  mediaContactLines.forEach(section => {
    section.style.setProperty('--line-hidden', `${(1 - progressFor(section)) * 100}%`);
  });
}
function queueContactLines() {
  if (!contactLineFrame) contactLineFrame = requestAnimationFrame(drawContactLines);
}
function layoutContactLines() {
  contactGuidelines.forEach(item => {
    const { section, svg, path, mask } = item;
    const width = section.clientWidth, height = section.offsetHeight;
    const centre = width / 2, gutter = innerWidth <= 780 ? 8 : 24;
    const side = width - gutter, radius = innerWidth <= 780 ? 20 : 36;
    const bounds = section.getBoundingClientRect();
    const obstacles = [...section.querySelectorAll('h2,h3,p,a,button,img')];
    const firstTop = Math.min(...obstacles.map(node => node.getBoundingClientRect().top - bounds.top));
    const turn = Math.max(radius + 4, Math.min(90, firstTop - 20));
    const lowerTurn = height - radius - 8;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    mask.setAttribute('x', '0'); mask.setAttribute('y', '0');
    mask.setAttribute('width', width); mask.setAttribute('height', height);
    path.setAttribute('d', `M${centre} 0 V${turn - radius} Q${centre} ${turn} ${centre + radius} ${turn} H${side - radius} Q${side} ${turn} ${side} ${turn + radius} V${lowerTurn - radius} Q${side} ${lowerTurn} ${side - radius} ${lowerTurn} H${centre + radius} Q${centre} ${lowerTurn} ${centre} ${lowerTurn + radius} V${height}`);
    mask.replaceChildren();
    const clear = document.createElementNS(svg.namespaceURI, 'rect');
    clear.setAttribute('width', width); clear.setAttribute('height', height); clear.setAttribute('fill', 'white');
    mask.append(clear);
    obstacles.forEach(node => {
      const rect = node.getBoundingClientRect();
      const exclusion = document.createElementNS(svg.namespaceURI, 'rect');
      exclusion.setAttribute('x', rect.left - bounds.left - 12);
      exclusion.setAttribute('y', rect.top - bounds.top - 12);
      exclusion.setAttribute('width', rect.width + 24);
      exclusion.setAttribute('height', rect.height + 24);
      exclusion.setAttribute('fill', 'black');
      mask.append(exclusion);
    });
    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    item.length = length;
  });
  queueContactLines();
}
window.addEventListener('scroll', queueContactLines, { passive: true });
window.addEventListener('resize', layoutContactLines);
guidelineMotion.addEventListener('change', queueContactLines);
if (contactGuidelines.length) {
  const lineResize = new ResizeObserver(layoutContactLines);
  contactGuidelines.forEach(({ section }) => lineResize.observe(section));
  document.fonts.ready.then(layoutContactLines);
}
layoutContactLines();
const foundationSection = document.querySelector('.about-foundations');
const foundationControls = foundationSection?.querySelector('.foundation-controls');
const foundationPoints = [...document.querySelectorAll('[data-foundation-point]')];
let foundationManualScrollY = null;
let foundationProgressFrame = 0;
function selectFoundation(point) {
  foundationPoints.forEach(button => button.setAttribute('aria-pressed', String(button === point)));
  document.querySelectorAll('[data-foundation-image]').forEach(image => image.classList.toggle('is-active', image.dataset.foundationImage === point.dataset.foundationPoint));
  const detail = foundationControls?.querySelector('.foundation-orbit-detail');
  if (detail) detail.textContent = point.querySelector('.foundation-point-description').textContent;
}
function chooseFoundation(point, index) {
  foundationManualScrollY = scrollY;
  foundationControls.classList.add('is-manual');
  foundationControls.style.setProperty('--foundation-progress', `${((index + 1) / foundationPoints.length) * 100}%`);
  selectFoundation(point);
}
foundationPoints.forEach((point, index) => {
  point.addEventListener('click', () => chooseFoundation(point, index));
  point.addEventListener('keydown', event => {
    if (!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? foundationPoints.length - 1 : (index + (['ArrowDown','ArrowRight'].includes(event.key) ? 1 : -1) + foundationPoints.length) % foundationPoints.length;
    foundationPoints[next].focus(); chooseFoundation(foundationPoints[next], next);
  });
});
if (foundationSection && foundationPoints.length) {
  function drawFoundationProgress() {
    foundationProgressFrame = 0;
    if (guidelineMotion.matches) return;
    if (foundationManualScrollY !== null) {
      if (Math.abs(scrollY - foundationManualScrollY) < 24) return;
      foundationManualScrollY = null;
      foundationControls.classList.remove('is-manual');
    }
    const bounds = foundationSection.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (innerHeight * .8 - bounds.top) / (bounds.height + innerHeight * .4)));
    foundationControls.style.setProperty('--foundation-progress', `${progress * 100}%`);
    selectFoundation(foundationPoints[Math.min(foundationPoints.length - 1, Math.floor(progress * foundationPoints.length))]);
  }
  function queueFoundationProgress() {
    if (!foundationProgressFrame) foundationProgressFrame = requestAnimationFrame(drawFoundationProgress);
  }
  window.addEventListener('scroll', queueFoundationProgress, { passive: true });
  window.addEventListener('resize', queueFoundationProgress);
  guidelineMotion.addEventListener('change', () => {
    if (guidelineMotion.matches) {
      const index = foundationPoints.findIndex(point => point.getAttribute('aria-pressed') === 'true');
      foundationControls.style.setProperty('--foundation-progress', `${((index + 1) / foundationPoints.length) * 100}%`);
    } else queueFoundationProgress();
  });
  if (guidelineMotion.matches) foundationControls.style.setProperty('--foundation-progress', `${100 / foundationPoints.length}%`);
  else queueFoundationProgress();
}
const header=document.querySelector('[data-header]');
const menu=document.querySelector('[data-menu-toggle]');
const nav=document.querySelector('[data-nav]');
menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open);});
window.addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>32),{passive:true});
const dialog=document.querySelector('[data-contact-dialog]');
document.querySelectorAll('[data-contact-open]').forEach(button=>button.addEventListener('click',()=>dialog.showModal()));
document.querySelector('[data-contact-close]').addEventListener('click',()=>dialog.close());
document.querySelector('[data-contact-form]').addEventListener('submit',event=>{event.preventDefault();document.querySelector('[data-contact-status]').textContent='Details pass validation. Nothing has been sent: this form is not connected to the enquiry mailbox yet.';});
const search=document.querySelector('[data-search-dialog]');
const searchOpen=document.querySelector('[data-search-open]');
const searchInput=document.querySelector('[data-search-input]');
const searchStatus=document.querySelector('[data-search-status]');
searchOpen.addEventListener('click',()=>{
  if(search.open){search.close();return;}
  search.show();
  searchOpen.setAttribute('aria-expanded','true');
  searchOpen.setAttribute('aria-label','Close search');
  window.setTimeout(()=>searchInput.focus(),50);
});
search.addEventListener('close',()=>{
  searchOpen.setAttribute('aria-expanded','false');
  searchOpen.setAttribute('aria-label','Search website');
});
search.querySelector('form').addEventListener('submit',event=>{if(event.submitter?.value==='cancel')return;event.preventDefault();const q=document.querySelector('[data-search-input]').value.trim().toLowerCase();const section=[...document.querySelectorAll('main section')].find(s=>q&&s.textContent.toLowerCase().includes(q));if(section){search.close();section.scrollIntoView({behavior:guidelineMotion.matches?'auto':'smooth'});}else document.querySelector('[data-search-status]').textContent='No matching section found.';});

// Gentle section entrance, once per visit, with reduced-motion support.
const sectionMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!sectionMotion.matches && 'IntersectionObserver' in window) {
  const sections = [...document.querySelectorAll('main > section:not(.inner-hero)')];
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('section-entered');
      sectionObserver.unobserve(entry.target);
    });
  }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });
  sections.forEach(section => {
    // Keep decorative backgrounds still; animate content rather than the section box.
    const content = [...section.children].filter(node => !node.matches('img,.foundation-images,.section-backdrop,svg'));
    content.forEach((node,index) => {
      node.classList.add('section-reveal-content');
      node.style.setProperty('--section-reveal-delay',`${Math.min(index,3)*70}ms`);
    });
    sectionObserver.observe(section);
  });
  sectionMotion.addEventListener('change', event => {
    if (event.matches) { sections.forEach(section=>section.classList.add('section-entered')); sectionObserver.disconnect(); }
  });
}

const contextStory = document.querySelector('.context-story');
if (contextStory) {
  const backgrounds = [...contextStory.querySelectorAll('.context-story-bg')];
  const cards = [...contextStory.querySelectorAll('[data-context-card]')];
  const navigation = [...contextStory.querySelectorAll('[data-context-nav]')];
  const count = contextStory.querySelector('.context-story-count');
  const scene = contextStory.querySelector('.context-story-scene');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeIndex = -1;
  let frame = 0;
  let wheelTransition = false;
  let wheelReleaseTimer = 0;

  function setContextStage(index) {
    if (index === activeIndex) return;
    activeIndex = index;
    backgrounds.forEach((image, imageIndex) => image.classList.toggle('is-active', imageIndex === index));
    cards.forEach((card, cardIndex) => {
      const active = cardIndex === index;
      card.classList.toggle('is-active', active);
      card.classList.toggle('is-before', cardIndex === index - 1);
      card.classList.toggle('is-after', cardIndex === index + 1);
      card.setAttribute('aria-hidden', String(!active));
    });
    navigation.forEach((button, buttonIndex) => button.setAttribute('aria-pressed', String(buttonIndex === index)));
    count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
  }

  function drawContextStage() {
    frame = 0;
    const rect = contextStory.getBoundingClientRect();
    const travel = Math.max(1, contextStory.offsetHeight - innerHeight);
    const progress = Math.max(0, Math.min(1, -rect.top / travel));
    setContextStage(Math.min(cards.length - 1, Math.floor(progress * cards.length)));
  }
  function queueContextStage() { if (!frame) frame = requestAnimationFrame(drawContextStage); }

  window.addEventListener('wheel', event => {
    if (event.ctrlKey || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    const rect = contextStory.getBoundingClientRect();
    const sceneRect = scene.getBoundingClientRect();
    if (sceneRect.top > 1 || rect.bottom <= innerHeight) return;

    if (wheelTransition) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }

    const travel = Math.max(1, contextStory.offsetHeight - innerHeight);
    const progress = Math.max(0, Math.min(1, -rect.top / travel));
    const current = Math.min(cards.length - 1, Math.floor(progress * cards.length));
    const next = current + (event.deltaY > 0 ? 1 : -1);
    if (next < 0) return;

    event.preventDefault();
    event.stopImmediatePropagation();
    wheelTransition = true;
    const start = scrollY + rect.top;
    const target = next >= cards.length
      ? scrollY + rect.bottom - innerHeight + 1
      : start + travel * ((next + .5) / cards.length);
    const release = () => {
      window.clearTimeout(wheelReleaseTimer);
      wheelReleaseTimer = window.setTimeout(() => { wheelTransition = false; }, 380);
    };
    wheelReleaseTimer = window.setTimeout(() => { wheelTransition = false; }, 1400);

    if (window.siteLenis) {
      window.siteLenis.scrollTo(target, {
        duration: .65,
        easing: t => 1 - Math.pow(1 - t, 3),
        immediate: reducedMotion.matches,
        onComplete: release
      });
    } else {
      window.scrollTo({ top: target, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      window.setTimeout(release, reducedMotion.matches ? 0 : 650);
    }
  }, { passive: false, capture: true });

  navigation.forEach((button, index) => button.addEventListener('click', () => {
    const start = scrollY + contextStory.getBoundingClientRect().top;
    const travel = Math.max(1, contextStory.offsetHeight - innerHeight);
    window.scrollTo({ top: start + travel * ((index + .5) / cards.length), behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  }));
  window.addEventListener('scroll', queueContextStage, { passive: true });
  window.addEventListener('resize', queueContextStage);
  queueContextStage();
}

// Move the foundation photo stack together so image switching stays seamless.
const foundationParallax = document.querySelector('.about-foundations > .foundation-images');
if (foundationParallax) {
  const foundationSection = foundationParallax.parentElement;
  const foundationMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let foundationFrame = 0;
  function drawFoundationParallax() {
    foundationFrame = 0;
    if (foundationMotion.matches) { foundationParallax.style.setProperty('--foundation-parallax-y','0px'); return; }
    const rect = foundationSection.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > innerHeight) return;
    const offset = Math.max(-48,Math.min(48,(innerHeight/2-rect.top-rect.height/2)*.12));
    foundationParallax.style.setProperty('--foundation-parallax-y',`${offset}px`);
  }
  function queueFoundationParallax() { if (!foundationFrame) foundationFrame=requestAnimationFrame(drawFoundationParallax); }
  window.addEventListener('scroll',queueFoundationParallax,{passive:true});
  window.addEventListener('resize',queueFoundationParallax,{passive:true});
  foundationMotion.addEventListener('change',queueFoundationParallax);
  new IntersectionObserver(queueFoundationParallax).observe(foundationSection);
  queueFoundationParallax();
}

// Location infrastructure background parallax.
const locationParallax = document.querySelector('.location-connections > img');
if (locationParallax) {
  const section = locationParallax.parentElement;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0;
  function draw() {
    frame = 0;
    if (motion.matches) { locationParallax.style.setProperty('--location-parallax-y','0px'); return; }
    const rect = section.getBoundingClientRect();
    if (rect.bottom<0 || rect.top>innerHeight) return;
    const offset = Math.max(-48,Math.min(48,(innerHeight/2-rect.top-rect.height/2)*.12));
    locationParallax.style.setProperty('--location-parallax-y',`${offset}px`);
  }
  function queue() { if (!frame) frame=requestAnimationFrame(draw); }
  window.addEventListener('scroll',queue,{passive:true});
  window.addEventListener('resize',queue,{passive:true});
  motion.addEventListener('change',queue);
  new IntersectionObserver(queue).observe(section);
  queue();
}

// Suppliers page: pin the three-card connection sequence and activate it with scroll progress.
const supplierSequence = document.querySelector('[data-supplier-connection]');
if (supplierSequence) {
  const section = supplierSequence.closest('.supplier-connection-section');
  const cards = [...supplierSequence.querySelectorAll('article')];
  const svg = supplierSequence.querySelector('.supplier-brand-connections');
  if (section && svg && cards.length) {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pinViewport = window.matchMedia('(min-width: 781px)');
    const paths = Array.from({ length: cards.length + 1 }, () => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('pathLength', '1');
      svg.append(path);
      return path;
    });
    const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
    let laidOut = false;
    let frame = 0;

    function layoutSupplierConnections() {
      const box = supplierSequence.getBoundingClientRect();
      const vertical = !pinViewport.matches;
      const pad = vertical ? 24 : Math.max(24, box.left);
      svg.setAttribute('viewBox', vertical
        ? `0 -${pad} ${box.width} ${box.height + pad * 2}`
        : `-${pad} 0 ${box.width + pad * 2} ${box.height}`);
      svg.style.width = vertical ? '100%' : `calc(100% + ${pad * 2}px)`;
      svg.style.height = vertical ? `calc(100% + ${pad * 2}px)` : '100%';
      svg.style.left = vertical ? '0' : `-${pad}px`;
      svg.style.top = vertical ? `-${pad}px` : '0';
      const rects = cards.map(card => card.getBoundingClientRect());
      paths.forEach((path, index) => {
        if (index === 0 || index === cards.length) {
          const card = rects[index === 0 ? 0 : cards.length - 1];
          if (vertical) {
            const x = card.left - box.left + card.width * .42;
            path.setAttribute('d', index === 0
              ? `M${x} -${pad} V${card.top - box.top}`
              : `M${x} ${card.bottom - box.top} V${box.height + pad}`);
          } else {
            const y = card.top - box.top + card.height * .45;
            path.setAttribute('d', index === 0
              ? `M-${pad} ${y} H${card.left - box.left}`
              : `M${card.right - box.left} ${y} H${box.width + pad}`);
          }
          return;
        }
        const previous = rects[index - 1];
        const next = rects[index];
        if (vertical) {
          const y1 = previous.bottom - box.top;
          const y2 = next.top - box.top;
          const x1 = previous.left - box.left + previous.width * (index % 2 ? .42 : .58);
          const x2 = next.left - box.left + next.width * (index % 2 ? .58 : .42);
          const mid = (y1 + y2) / 2;
          const radius = Math.min(10, (y2 - y1) / 4, Math.abs(x2 - x1) / 4);
          const direction = x2 > x1 ? 1 : -1;
          path.setAttribute('d', `M${x1} ${y1} V${mid-radius} Q${x1} ${mid} ${x1+direction*radius} ${mid} H${x2-direction*radius} Q${x2} ${mid} ${x2} ${mid+radius} V${y2}`);
        } else {
          const x1 = previous.right - box.left;
          const x2 = next.left - box.left;
          const y1 = previous.top - box.top + previous.height * (index % 2 ? .45 : .85);
          const y2 = next.top - box.top + next.height * (index % 2 ? .85 : .45);
          const mid = (x1 + x2) / 2;
          const radius = Math.min(18, (x2 - x1) / 4, Math.abs(y2 - y1) / 4);
          const direction = y2 > y1 ? 1 : -1;
          path.setAttribute('d', `M${x1} ${y1} H${mid-radius} Q${mid} ${y1} ${mid} ${y1+direction*radius} V${y2-direction*radius} Q${mid} ${y2} ${mid+radius} ${y2} H${x2}`);
        }
      });
      laidOut = true;
    }

    function drawSupplierProgress() {
      frame = 0;
      if (!laidOut) layoutSupplierConnections();
      const pinned = section.classList.contains('scroll-sequence-pinned');
      const bounds = (pinned ? section : supplierSequence).getBoundingClientRect();
      const start = innerHeight * .82;
      const end = innerHeight * .28;
      const progress = pinned
        ? clamp(-bounds.top / Math.max(1, bounds.height - innerHeight))
        : clamp((start - bounds.top) / (bounds.height + start - end));
      const scaledProgress = progress * paths.length;
      paths.forEach((path, index) => {
        const pathProgress = clamp(scaledProgress - index);
        path.style.strokeDashoffset = String(1 - pathProgress);
        path.classList.toggle('is-connected', pathProgress >= .999);
      });
      cards.forEach((card, index) => {
        const cardProgress = clamp(progress * cards.length - index);
        card.style.setProperty('--signal-progress', `${cardProgress * 100}%`);
        card.classList.toggle('signal-active', cardProgress >= 1);
      });
    }

    function queueSupplierProgress() {
      if (!frame) frame = requestAnimationFrame(drawSupplierProgress);
    }
    function queueSupplierLayout() {
      laidOut = false;
      queueSupplierProgress();
    }
    function syncSupplierStage() {
      section.classList.toggle('scroll-sequence-pinned', !motion.matches && pinViewport.matches);
      queueSupplierLayout();
    }

    new ResizeObserver(queueSupplierLayout).observe(supplierSequence);
    document.fonts.ready.then(queueSupplierLayout);
    window.addEventListener('scroll', queueSupplierProgress, { passive: true });
    window.addEventListener('resize', queueSupplierLayout);
    motion.addEventListener('change', syncSupplierStage);
    pinViewport.addEventListener('change', syncSupplierStage);
    syncSupplierStage();
  }
}
