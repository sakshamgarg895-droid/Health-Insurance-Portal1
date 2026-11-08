const demoPolicy = {
  number: 'HS-2026-1042',
  plan: 'Family Floater',
  coverage: 1000000,
  premium: 1299,
  start: '2026-01-01',
  expiry: '2026-12-31',
  status: 'Active',
  members: 'Self, spouse and up to two children',
  waiting: '30–90 days (sample)',
  deductible: 10000
};

function readPolicies() {
  try {
    const policies = JSON.parse(localStorage.getItem('hs-policies') || 'null');
    return Array.isArray(policies) && policies.length ? policies : [demoPolicy];
  } catch {
    return [demoPolicy];
  }
}

function formatPolicyCurrency(value) {
  return `₹${Number(value || 0).toLocaleString('en-IN')}`;
}

function showPolicyDetails(policy, row, button) {
  const existing = row.nextElementSibling;
  if (existing?.classList.contains('policy-detail-row')) {
    existing.remove();
    button.textContent = 'View';
    button.setAttribute('aria-expanded', 'false');
    return;
  }
  document.querySelectorAll('.policy-detail-row').forEach(item => item.remove());
  document.querySelectorAll('.policy-view').forEach(item => {
    item.textContent = 'View';
    item.setAttribute('aria-expanded', 'false');
  });
  const detailRow = document.createElement('tr');
  detailRow.className = 'policy-detail-row';
  const cell = document.createElement('td');
  cell.colSpan = 8;
  const panel = document.createElement('div');
  panel.className = 'policy-detail-panel';
  const heading = document.createElement('h3');
  heading.textContent = `${policy.plan} details`;
  panel.append(heading);
  const details = [
    ['Covered members', policy.members || 'Not specified'],
    ['Waiting period', policy.waiting || 'Check policy wording'],
    ['Deductible', formatPolicyCurrency(policy.deductible)],
    ['Policy status', policy.status || 'Active']
  ];
  const grid = document.createElement('div');
  grid.className = 'policy-detail-grid';
  details.forEach(([label, value]) => {
    const item = document.createElement('p');
    const strong = document.createElement('strong');
    strong.textContent = `${label}: `;
    item.append(strong, document.createTextNode(String(value)));
    grid.append(item);
  });
  panel.append(grid);
  const note = document.createElement('p');
  note.className = 'muted';
  note.textContent = 'Sample policy details only. Refer to your official policy documents for real coverage and terms.';
  panel.append(note);
  cell.append(panel);
  detailRow.append(cell);
  row.after(detailRow);
  button.textContent = 'Hide';
  button.setAttribute('aria-expanded', 'true');
}

function renderPolicies() {
  const body = document.querySelector('#policyRows');
  if (!body) return;
  const fragment = document.createDocumentFragment();
  readPolicies().forEach(policy => {
    const row = document.createElement('tr');
    const start = new Date(`${policy.start}T00:00:00`);
    const expiry = new Date(`${policy.expiry}T00:00:00`);
    const values = [
      policy.number,
      policy.plan,
      formatPolicyCurrency(policy.coverage),
      `${formatPolicyCurrency(policy.premium)}/mo`,
      Number.isNaN(start.valueOf()) ? policy.start : start.toLocaleDateString('en-IN'),
      Number.isNaN(expiry.valueOf()) ? policy.expiry : expiry.toLocaleDateString('en-IN')
    ];
    values.forEach(value => {
      const cell = document.createElement('td');
      cell.textContent = value || '—';
      row.append(cell);
    });
    const statusCell = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = `badge ${policy.status === 'Active' ? 'success' : 'warning'}`;
    badge.textContent = policy.status || 'Active';
    statusCell.append(badge);
    row.append(statusCell);
    const actions = document.createElement('td');
    const view = document.createElement('button');
    view.type = 'button';
    view.className = 'btn btn-secondary policy-view';
    view.textContent = 'View';
    view.setAttribute('aria-expanded', 'false');
    view.addEventListener('click', () => showPolicyDetails(policy, row, view));
    const download = document.createElement('button');
    download.type = 'button';
    download.className = 'btn btn-secondary';
    download.textContent = 'Download';
    download.addEventListener('click', () => downloadDemo(
      `HealthSecure-Policy-${policy.number}.txt`,
      `HealthSecure sample policy\nPolicy number: ${policy.number}\nPlan: ${policy.plan}\nCoverage: ${formatPolicyCurrency(policy.coverage)}\nMonthly premium: ${formatPolicyCurrency(policy.premium)}\nStart: ${policy.start}\nExpiry: ${policy.expiry}\nStatus: ${policy.status}\nThis is a demo summary, not an insurance contract.`
    ));
    const renew = document.createElement('a');
    renew.className = 'btn btn-primary';
    renew.href = 'calculator.html';
    renew.textContent = 'Renew';
    actions.append(view, document.createTextNode(' '), download, document.createTextNode(' '), renew);
    row.append(actions);
    fragment.append(row);
  });
  body.replaceChildren(fragment);
}

document.addEventListener('DOMContentLoaded', renderPolicies);
window.addEventListener('storage', event => {
  if (event.key === 'hs-policies') renderPolicies();
});
