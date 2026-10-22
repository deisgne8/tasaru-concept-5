document.querySelectorAll('.supplier-carousel').forEach(root => {
  const slides = [...root.querySelectorAll('.supplier-carousel-slide')];
  const dots = [...root.querySelectorAll('[data-carousel-index]')];
  let current = 0;
  const show = index => {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => { slide.classList.toggle('is-active', i === current); slide.setAttribute('aria-hidden', String(i !== current)); });
    dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === current)));
  };
  root.querySelector('.supplier-carousel-prev').addEventListener('click', () => show(current - 1));
  root.querySelector('.supplier-carousel-next').addEventListener('click', () => show(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
  root.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
  });
});