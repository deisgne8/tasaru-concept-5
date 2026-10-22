(() => {
  const pageUrl = new URL(window.location.href);
  pageUrl.hash = '';
  const url = encodeURIComponent(pageUrl.href);
  const title = encodeURIComponent(document.querySelector('h1')?.textContent.trim() || document.title);
  const destinations = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    x: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
    whatsapp: `https://wa.me/?text=${title}%20${url}`
  };
  document.querySelectorAll('[data-media-share]').forEach(link => {
    link.href = destinations[link.dataset.mediaShare];
  });
  const copyButton = document.querySelector('[data-media-copy]');
  const status = document.querySelector('.media-share-status');
  copyButton?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(pageUrl.href);
      status.textContent = 'Link copied.';
    } catch {
      status.textContent = 'Copy this link from your browser address bar.';
    }
  });
})();