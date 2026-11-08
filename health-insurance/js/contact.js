(() => {
  const form = document.querySelector('#contactForm');
  const status = document.querySelector('#contactStatus');
  if (!form || !status) return;

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    status.textContent = 'Sending…';

    const payload = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch('http://localhost:8080/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('The message could not be saved. Check the fields and try again.');
      const result = await response.json();
      form.reset();
      status.textContent = result.message;
    } catch (error) {
      status.textContent = error instanceof TypeError
        ? 'Could not reach the API. Start the backend and try again.'
        : error.message;
    } finally {
      submit.disabled = false;
    }
  });
})();
