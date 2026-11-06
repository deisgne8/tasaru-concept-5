// Trace the path from its right-hand start to its left-hand end, once on entry.
(() => {
  const section = document.querySelector('.ceo-message');
  const path = section?.querySelector('.ceo-brand-line path');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!path || !('IntersectionObserver' in window) || motion.matches) return;

  // Use real SVG lengths and scale the stroke explicitly while drawing.
  // This avoids normalized dashes being clipped by non-scaling-stroke.
  const length = path.getTotalLength() + 1;
  section.style.setProperty('--ceo-line-length', length);
  const sizeStroke = () => {
    const width = section.getBoundingClientRect().width;
    if (width) section.style.setProperty('--ceo-line-stroke', `${1.5 * 985 / width}px`);
  };
  sizeStroke();
  const resizeObserver = new ResizeObserver(sizeStroke);
  resizeObserver.observe(section);

  let contactFrame;
  const revealAtContact = () => {
    const portrait = section.querySelector('.ceo-portrait');
    const sectionBounds = section.getBoundingClientRect();
    const portraitBounds = portrait.getBoundingClientRect();
    // The final path segment runs leftward from the curve to x=0.
    // Its remaining dash length equals the tip's x position in SVG units.
    const contactX = (portraitBounds.right - sectionBounds.left) / sectionBounds.width * 985;
    const remaining = parseFloat(getComputedStyle(path).strokeDashoffset);
    if (remaining <= contactX || motion.matches) {
      section.classList.add('ceo-line-reached-portrait');
      return;
    }
    contactFrame = requestAnimationFrame(revealAtContact);
  };
  const finishLine = () => {
    cancelAnimationFrame(contactFrame);
    section.classList.add('ceo-line-complete');
    resizeObserver.disconnect();
  };
  path.addEventListener('animationend', (event) => {
    if (event.animationName === 'ceo-line-draw') finishLine();
  }, { once: true });
  motion.addEventListener('change', (event) => {
    if (event.matches) finishLine();
  });
  section.classList.add('ceo-line-ready');
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some(entry => entry.isIntersecting)) return;
    section.classList.add('ceo-line-drawn');
    contactFrame = requestAnimationFrame(revealAtContact);
    observer.disconnect();
  }, { threshold: 0.25 });
  observer.observe(section);
})();
