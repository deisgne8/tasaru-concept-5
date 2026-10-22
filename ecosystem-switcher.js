(() => {
  const root = document.querySelector('[data-ecosystem-switcher]');
  if (!root) return;
  const places = [
    ['King Abdullah Economic City', 'The wider city setting for a connected automotive ecosystem.', 'kaec.html', 'Discover Location'],
    ['King Salman Automotive Cluster', 'An automotive focus connecting the city to its manufacturing ecosystem.', 'king-salman-automotive-cluster.html', 'Discover the cluster'],
    ['MASARAT Mobility Park™', 'The automotive and mobility destination that is home to TSH.', 'masarat-mobility-park.html', 'Discover the park'],
    ['TASARU Supplier Hub', 'Global expertise. Critical capabilities. A dedicated platform for automotive manufacturing in Saudi Arabia.', 'tasaru-supplier-hub.html', 'Discover the hub']
  ];
  const buttons = [...root.querySelectorAll('[data-place-select]')];
  const slides = [...root.querySelectorAll('[data-place-slide]')];
  const copy = root.querySelector('.ecosystem-panel-copy');
  const title = root.querySelector('[data-place-title]');
  const description = root.querySelector('[data-place-description]');
  const link = root.querySelector('[data-place-link]');
  let active = 0;
  let timer;
  function select(index) {
    if (index === active) return;
    active = index;
    clearTimeout(timer);
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    copy.classList.add('is-changing');
    timer = setTimeout(() => {
      const place = places[index];
      title.textContent = place[0];
      description.textContent = place[1];
      link.href = place[2];
      link.textContent = place[3];
      copy.classList.remove('is-changing');
    }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180);
  }
  buttons.forEach((button, index) => {
    button.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') select(index); });
    button.addEventListener('focus', () => select(index));
    button.addEventListener('click', () => select(index));
  });
})();