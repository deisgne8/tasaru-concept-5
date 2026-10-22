(() => {
 const form = document.querySelector('[data-email-enquiry]');
 if (!form) return;
 form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const body = `Name: ${data.get('name')}\r\nEmail: ${data.get('email')}\r\nOrganization: ${data.get('company') || 'Not provided'}\r\nContact number: ${data.get('phone') || 'Not provided'}\r\nCategory: ${data.get('category')}\r\n\r\n${data.get('message')}`;
  window.location.href = `mailto:info@tasarusupplierhub.sa?subject=${encodeURIComponent('TSH enquiry: ' + data.get('category'))}&body=${encodeURIComponent(body)}`;
  form.querySelector('.enquiry-status').textContent = 'Send the draft in your email app to complete your enquiry. If it did not open, email info@tasarusupplierhub.sa directly.';
 });
})();
