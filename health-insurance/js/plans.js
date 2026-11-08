(() => {
  const container = document.querySelector('#planCards');
  const status = document.querySelector('#planApiStatus');
  if (!container) return;

  const money = value => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0
  }).format(value || 0);
  const label = value => (value || '').toLowerCase().replaceAll('_', ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase());
  const make = (tag, className, content) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (content !== undefined) element.textContent = content;
    return element;
  };

  function render(plans) {
    const fragment = document.createDocumentFragment();
    plans.forEach(plan => {
      const card = make('article', 'card');
      card.append(make('div', 'plan-icon', '♥'));
      card.append(make('h3', '', plan.planName));
      const company = make('p', 'muted', plan.company?.name || 'Insurance provider');
      card.append(company);
      const price = make('div', 'price');
      price.append(document.createTextNode(money(plan.basePremium)));
      price.append(make('small', '', '/year (sample)'));
      card.append(price);
      const chips = make('div', 'chips');
      chips.append(make('span', 'chip', `Coverage ${money(plan.coverageAmount)}`));
      chips.append(make('span', 'chip', `Waiting period ${plan.waitingPeriodMonths} months`));
      card.append(chips);
      const details = make('p', 'muted', plan.description || label(plan.category));
      card.append(details);
      const features = make('ul', 'feature-list');
      (plan.benefits || []).slice(0, 3).forEach(benefit => {
        const item = make('li');
        item.append(make('i', 'fa-solid fa-check'));
        item.append(document.createTextNode(` ${benefit.title}`));
        features.append(item);
      });
      card.append(features);
      const actions = make('div', 'actions');
      const quote = make('a', 'btn btn-primary', 'Get a quote');
      quote.href = `calculator.html?plan=${encodeURIComponent(plan.id)}`;
      actions.append(quote);
      card.append(actions);
      fragment.append(card);
    });
    container.replaceChildren(fragment);
  }

  fetch('http://localhost:8080/api/plans', { headers: { Accept: 'application/json' } })
    .then(response => {
      if (!response.ok) throw new Error('Plan service is unavailable');
      return response.json();
    })
    .then(plans => {
      if (!Array.isArray(plans) || plans.length === 0) {
        status.textContent = 'The API is connected, but there are no active plans yet. Showing sample plans.';
        return;
      }
      render(plans);
      status.textContent = 'Plans loaded from the HealthSecure API. Prices and details are sample data.';
    })
    .catch(() => {
      status.textContent = 'Showing sample plans. Start the API to load plans from the database.';
    });
})();
