const demoUsers = [
  { id: 'DEMO-1', name: 'Aarav Sharma', email: 'aarav@example.com', phone: '—', role: 'User', status: 'Active' },
  { id: 'DEMO-2', name: 'Meera Patel', email: 'meera@example.com', phone: '—', role: 'User', status: 'Active' },
  { id: 'DEMO-3', name: 'Kabir Singh', email: 'kabir@example.com', phone: '—', role: 'User', status: 'Active' }
];
const claimStatuses = ['Submitted', 'Documents Verified', 'Under Review', 'Approved', 'Payment Processed'];

function getAdminUsers() {
  try {
    const users = JSON.parse(localStorage.getItem('hs-users') || 'null');
    if (Array.isArray(users)) return users;
  } catch { /* Restore sample list if browser storage is invalid. */ }
  localStorage.setItem('hs-users', JSON.stringify(demoUsers));
  return [...demoUsers];
}

function renderAdminUsers() {
  const table = document.querySelector('#adminUsers');
  if (!table) return;
  const users = getAdminUsers();
  const fragment = document.createDocumentFragment();
  users.forEach(user => {
    const row = document.createElement('tr');
    [user.id, user.name, user.email, user.phone || '—', user.role || 'User'].forEach(value => {
      const cell = document.createElement('td');
      cell.textContent = value || '—';
      row.append(cell);
    });
    const statusCell = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = `badge ${user.status === 'Disabled' ? 'danger' : 'success'}`;
    badge.textContent = user.status || 'Active';
    statusCell.append(badge);
    row.append(statusCell);
    const actions = document.createElement('td');
    const edit = document.createElement('button');
    edit.className = 'btn btn-secondary';
    edit.type = 'button';
    edit.textContent = 'Edit';
    edit.addEventListener('click', () => {
      const form = document.querySelector('#adminUserForm');
      form.elements.userId.value = user.id;
      form.elements.name.value = user.name;
      form.elements.email.value = user.email;
      form.elements.phone.value = user.phone === '—' ? '' : user.phone || '';
      form.elements.role.value = user.role || 'User';
      form.elements.status.value = user.status || 'Active';
      document.querySelector('#adminUserSubmit').textContent = 'Save Changes';
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    const toggle = document.createElement('button');
    toggle.className = 'btn btn-secondary';
    toggle.type = 'button';
    toggle.textContent = user.status === 'Disabled' ? 'Enable' : 'Disable';
    toggle.addEventListener('click', () => {
      user.status = user.status === 'Disabled' ? 'Active' : 'Disabled';
      localStorage.setItem('hs-users', JSON.stringify(users));
      renderAdminUsers();
    });
    actions.append(edit, document.createTextNode(' '), toggle);
    row.append(actions);
    fragment.append(row);
  });
  table.replaceChildren(fragment);
  const total = document.querySelector('#adminUserCount');
  if (total) total.textContent = users.length.toLocaleString('en-IN');
  renderAdminReports();
}

function renderAdminClaims() {
  const body = document.querySelector('#adminClaims');
  if (!body) return;
  let claims = [];
  try {
    const value = JSON.parse(localStorage.getItem('hs-claims') || '[]');
    if (Array.isArray(value)) claims = value;
  } catch { /* Show the empty state when saved demo data is unreadable. */ }
  const fragment = document.createDocumentFragment();
  if (!claims.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 5;
    cell.textContent = 'No claims have been submitted in this browser.';
    row.append(cell);
    fragment.append(row);
  } else {
    claims.slice().reverse().forEach(claim => {
      const row = document.createElement('tr');
      [claim.id, claim.policy, claim.hospital, `₹${Number(claim.amount || 0).toLocaleString('en-IN')}`]
        .forEach(value => {
          const cell = document.createElement('td');
          cell.textContent = value || '—';
          row.append(cell);
        });
      const cell = document.createElement('td');
      const select = document.createElement('select');
      select.className = 'admin-claim-status';
      select.setAttribute('aria-label', `Update demo status for ${claim.id}`);
      claimStatuses.forEach(status => {
        const option = document.createElement('option');
        option.value = status;
        option.textContent = status;
        select.append(option);
      });
      select.value = claimStatuses.includes(claim.status) ? claim.status : 'Submitted';
      select.addEventListener('change', () => {
        const all = JSON.parse(localStorage.getItem('hs-claims') || '[]');
        const target = all.find(item => item.id === claim.id);
        if (!target) return;
        target.status = select.value;
        target.updatedAt = new Date().toISOString();
        localStorage.setItem('hs-claims', JSON.stringify(all));
        const notice = document.querySelector('#adminClaimStatus');
        if (notice) notice.textContent = `${claim.id} status updated to ${select.value}. It will appear on the user Claims page in this browser.`;
        renderAdminClaims();
        renderAdminStats();
      });
      cell.append(select);
      row.append(cell);
      fragment.append(row);
    });
  }
  body.replaceChildren(fragment);
  renderAdminReports();
}

function renderAdminStats() {
  let claims = [];
  try { claims = JSON.parse(localStorage.getItem('hs-claims') || '[]'); } catch { /* Empty state. */ }
  if (!Array.isArray(claims)) claims = [];
  const pending = claims.filter(claim => !['Approved', 'Payment Processed'].includes(claim.status)).length;
  const approved = claims.filter(claim => ['Approved', 'Payment Processed'].includes(claim.status)).length;
  const pendingNode = document.querySelector('#adminPendingClaims');
  const approvedNode = document.querySelector('#adminApprovedClaims');
  if (pendingNode) pendingNode.textContent = String(pending);
  if (approvedNode) approvedNode.textContent = String(approved);
  const revenueNode = document.querySelector('#adminRevenue');
  if (revenueNode) {
    const total = readAdminPayments().filter(payment => payment.status === 'Paid')
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    revenueNode.textContent = `₹${total.toLocaleString('en-IN')}`;
  }
}

function readAdminHospitals() {
  try {
    const hospitals = JSON.parse(localStorage.getItem('hs-hospitals') || '[]');
    return Array.isArray(hospitals) ? hospitals : [];
  } catch {
    return [];
  }
}

function renderAdminHospitals() {
  const body = document.querySelector('#adminHospitals');
  if (!body) return;
  const hospitals = readAdminHospitals();
  const fragment = document.createDocumentFragment();
  if (!hospitals.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 4;
    cell.textContent = 'No added hospitals yet.';
    row.append(cell);
    fragment.append(row);
  }
  hospitals.forEach(hospital => {
    const row = document.createElement('tr');
    [hospital.name, hospital.city, hospital.network].forEach(value => {
      const cell = document.createElement('td');
      cell.textContent = value || '—';
      row.append(cell);
    });
    const actionCell = document.createElement('td');
    const remove = document.createElement('button');
    remove.className = 'btn btn-secondary';
    remove.type = 'button';
    remove.textContent = 'Remove';
    remove.addEventListener('click', () => {
      const remaining = readAdminHospitals().filter(item => item.id !== hospital.id);
      localStorage.setItem('hs-hospitals', JSON.stringify(remaining));
      renderAdminHospitals();
      const status = document.querySelector('#hospitalAdminStatus');
      if (status) status.textContent = `${hospital.name} removed from the sample directory.`;
    });
    actionCell.append(remove);
    row.append(actionCell);
    fragment.append(row);
  });
  body.replaceChildren(fragment);
  renderAdminReports();
}

function addAdminHospital(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const record = Object.fromEntries(new FormData(form).entries());
  record.id = `HSP-${Date.now().toString().slice(-8)}`;
  record.specialties = record.specialties.split(',').map(item => item.trim()).filter(Boolean).join(', ');
  try {
    const hospitals = readAdminHospitals();
    if (hospitals.some(item => item.name.toLowerCase() === record.name.trim().toLowerCase() && item.city.toLowerCase() === record.city.trim().toLowerCase())) {
      document.querySelector('#hospitalAdminStatus').textContent = 'This hospital is already in the added directory.';
      return;
    }
    record.name = record.name.trim();
    record.address = record.address.trim();
    record.city = record.city.trim();
    record.specialties = record.specialties.trim();
    record.network = record.network || 'Reimbursement';
    hospitals.push(record);
    localStorage.setItem('hs-hospitals', JSON.stringify(hospitals));
    form.reset();
    document.querySelector('#hospitalAdminStatus').textContent = `${record.name} added. It is now available on the Hospitals page in this browser.`;
    renderAdminHospitals();
  } catch {
    document.querySelector('#hospitalAdminStatus').textContent = 'Could not save this hospital in browser storage.';
  }
}

function readAdminPayments() {
  try {
    const payments = JSON.parse(localStorage.getItem('hs-payments') || '[]');
    return Array.isArray(payments) ? payments : [];
  } catch {
    return [];
  }
}

function renderAdminPayments() {
  const body = document.querySelector('#adminPayments');
  if (!body) return;
  const payments = readAdminPayments();
  const fragment = document.createDocumentFragment();
  if (!payments.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 7;
    cell.textContent = 'No payment records added yet.';
    row.append(cell);
    fragment.append(row);
  }
  payments.slice().reverse().forEach(payment => {
    const row = document.createElement('tr');
    [payment.id, payment.policy, `₹${Number(payment.amount || 0).toLocaleString('en-IN')}`, payment.date, payment.method, payment.status]
      .forEach(value => {
        const cell = document.createElement('td');
        cell.textContent = value || '—';
        row.append(cell);
      });
    const actionCell = document.createElement('td');
    const remove = document.createElement('button');
    remove.className = 'btn btn-secondary';
    remove.type = 'button';
    remove.textContent = 'Remove';
    remove.addEventListener('click', () => {
      localStorage.setItem('hs-payments', JSON.stringify(readAdminPayments().filter(item => item.id !== payment.id)));
      renderAdminPayments();
      renderAdminStats();
    });
    actionCell.append(remove);
    row.append(actionCell);
    fragment.append(row);
  });
  body.replaceChildren(fragment);
  renderAdminReports();
}

function getAdminReportSnapshot() {
  const users = getAdminUsers();
  const hospitals = readAdminHospitals();
  let claims = [];
  try {
    const value = JSON.parse(localStorage.getItem('hs-claims') || '[]');
    if (Array.isArray(value)) claims = value;
  } catch { /* Use the empty report. */ }
  const payments = readAdminPayments();
  const claimCounts = Object.fromEntries(claimStatuses.map(status => [status, 0]));
  claims.forEach(claim => {
    const status = claimStatuses.includes(claim.status) ? claim.status : 'Submitted';
    claimCounts[status]++;
  });
  const paymentStatuses = ['Paid', 'Pending', 'Failed'];
  const paymentTotals = Object.fromEntries(paymentStatuses.map(status => [status, { count: 0, amount: 0 }]));
  payments.forEach(payment => {
    const status = paymentStatuses.includes(payment.status) ? payment.status : 'Pending';
    paymentTotals[status].count++;
    paymentTotals[status].amount += Number(payment.amount || 0);
  });
  return { users, hospitals, claims, payments, claimCounts, paymentTotals };
}

function renderAdminReports() {
  if (!document.querySelector('#reports')) return;
  const report = getAdminReportSnapshot();
  const setText = (selector, value) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = value;
  };
  setText('#reportUsers', report.users.length.toLocaleString('en-IN'));
  setText('#reportHospitals', report.hospitals.length.toLocaleString('en-IN'));
  setText('#reportClaims', report.claims.length.toLocaleString('en-IN'));
  const totalPaid = report.paymentTotals.Paid.amount;
  setText('#reportPayments', `₹${totalPaid.toLocaleString('en-IN')}`);

  const claimRows = document.querySelector('#reportClaimRows');
  if (claimRows) {
    claimRows.replaceChildren(...claimStatuses.map(status => {
      const row = document.createElement('tr');
      const name = document.createElement('td');
      const count = document.createElement('td');
      name.textContent = status;
      count.textContent = String(report.claimCounts[status]);
      row.append(name, count);
      return row;
    }));
  }
  const paymentRows = document.querySelector('#reportPaymentRows');
  if (paymentRows) {
    paymentRows.replaceChildren(...['Paid', 'Pending', 'Failed'].map(status => {
      const row = document.createElement('tr');
      const name = document.createElement('td');
      const count = document.createElement('td');
      const amount = document.createElement('td');
      name.textContent = status;
      count.textContent = String(report.paymentTotals[status].count);
      amount.textContent = `₹${report.paymentTotals[status].amount.toLocaleString('en-IN')}`;
      row.append(name, count, amount);
      return row;
    }));
  }
}

function downloadAdminReport() {
  const report = getAdminReportSnapshot();
  const rows = [
    ['HealthSecure demo report'],
    ['Generated at', new Date().toLocaleString('en-IN')],
    [],
    ['Summary', 'Count / total'],
    ['Users', report.users.length],
    ['Added hospitals', report.hospitals.length],
    ['Claims', report.claims.length],
    ['Paid payment amount', report.paymentTotals.Paid.amount],
    [],
    ['Claims by status', 'Count'],
    ...claimStatuses.map(status => [status, report.claimCounts[status]]),
    [],
    ['Payments by status', 'Count', 'Total amount'],
    ...['Paid', 'Pending', 'Failed'].map(status => [status, report.paymentTotals[status].count, report.paymentTotals[status].amount])
  ];
  const csv = rows.map(row => row.map(value => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')).join('\r\n');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  link.download = `healthsecure-report-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
  const message = document.querySelector('#reportStatus');
  if (message) message.textContent = 'CSV report downloaded. It contains summary totals and no user contact details.';
}

function loadPortalSettings() {
  let settings = {};
  try { settings = JSON.parse(localStorage.getItem('hs-portal-settings') || '{}'); } catch { /* Use defaults. */ }
  const form = document.querySelector('#portalSettingsForm');
  if (!form) return;
  form.elements.portalName.value = settings.portalName || 'HealthSecure';
  form.elements.supportEmail.value = settings.supportEmail || 'support@healthsecure.demo';
  form.elements.theme.value = localStorage.getItem('hs-theme') || settings.theme || 'light';
}

function savePortalSettings(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const settings = {
    portalName: form.elements.portalName.value.trim(),
    supportEmail: form.elements.supportEmail.value.trim(),
    theme: form.elements.theme.value
  };
  try {
    localStorage.setItem('hs-portal-settings', JSON.stringify(settings));
    localStorage.setItem('hs-theme', settings.theme);
    document.body.classList.toggle('dark', settings.theme === 'dark');
    applyPortalSettings();
    document.querySelector('#portalSettingsStatus').textContent = 'Settings saved and applied to this browser’s HealthSecure pages.';
  } catch {
    document.querySelector('#portalSettingsStatus').textContent = 'Could not save settings in browser storage.';
  }
}

function restorePortalSettings() {
  localStorage.removeItem('hs-portal-settings');
  localStorage.setItem('hs-theme', 'light');
  document.body.classList.remove('dark');
  loadPortalSettings();
  applyPortalSettings();
  document.querySelector('#portalSettingsStatus').textContent = 'Default settings restored.';
}

function addAdminPayment(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const amount = Number(form.elements.amount.value);
  const message = document.querySelector('#paymentAdminStatus');
  if (!Number.isFinite(amount) || amount <= 0) {
    message.textContent = 'Enter an amount greater than zero.';
    return;
  }
  const payment = {
    id: `TXN-${Date.now().toString().slice(-8)}`,
    policy: form.elements.policy.value.trim(),
    amount,
    date: form.elements.date.value,
    method: form.elements.method.value,
    status: form.elements.status.value
  };
  try {
    const payments = readAdminPayments();
    payments.push(payment);
    localStorage.setItem('hs-payments', JSON.stringify(payments));
    form.reset();
    message.textContent = `${payment.id} added to the demo ledger. No money was collected.`;
    renderAdminPayments();
    renderAdminStats();
  } catch {
    message.textContent = 'Could not save this payment record in browser storage.';
  }
}

function saveAdminUser(event) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const users = getAdminUsers();
  const id = form.elements.userId.value || `USR-${Date.now().toString().slice(-7)}`;
  const existing = users.find(user => String(user.id) === String(id));
  const record = {
    id,
    name: form.elements.name.value.trim(),
    email: form.elements.email.value.trim().toLowerCase(),
    phone: form.elements.phone.value.trim(),
    role: form.elements.role.value,
    status: form.elements.status.value
  };
  if (users.some(user => (user.email || '').toLowerCase() === record.email && String(user.id) !== String(id))) {
    const status = document.querySelector('#adminUserStatus');
    status.textContent = 'That email is already in the user list.';
    return;
  }
  if (existing) Object.assign(existing, record);
  else users.push(record);
  localStorage.setItem('hs-users', JSON.stringify(users));
  form.reset();
  form.elements.userId.value = '';
  document.querySelector('#adminUserSubmit').textContent = 'Add User';
  document.querySelector('#adminUserStatus').textContent = existing ? 'User updated.' : 'User added.';
  renderAdminUsers();
}

document.addEventListener('DOMContentLoaded', () => {
  renderAdminUsers();
  renderAdminClaims();
  renderAdminStats();
  renderAdminHospitals();
  renderAdminPayments();
  loadPortalSettings();
  const form = document.querySelector('#adminUserForm');
  if (form) form.addEventListener('submit', saveAdminUser);
  const hospitalForm = document.querySelector('#hospitalForm');
  if (hospitalForm) hospitalForm.addEventListener('submit', addAdminHospital);
  const paymentForm = document.querySelector('#paymentForm');
  if (paymentForm) paymentForm.addEventListener('submit', addAdminPayment);
  document.querySelector('#downloadAdminReport')?.addEventListener('click', downloadAdminReport);
  const settingsForm = document.querySelector('#portalSettingsForm');
  if (settingsForm) settingsForm.addEventListener('submit', savePortalSettings);
  document.querySelector('#resetPortalSettings')?.addEventListener('click', restorePortalSettings);
  document.querySelector('#adminUserCancel')?.addEventListener('click', () => {
    const form = document.querySelector('#adminUserForm');
    form.reset();
    form.elements.userId.value = '';
    document.querySelector('#adminUserSubmit').textContent = 'Add User';
  });
});

window.addEventListener('storage', event => {
  if (event.key === 'hs-users') renderAdminUsers();
  if (event.key === 'hs-claims') {
    renderAdminClaims();
    renderAdminStats();
  }
  if (event.key === 'hs-hospitals') renderAdminHospitals();
  if (event.key === 'hs-portal-settings') applyPortalSettings();
  if (event.key === 'hs-payments') {
    renderAdminPayments();
    renderAdminStats();
  }
  if (['hs-users', 'hs-claims', 'hs-hospitals', 'hs-payments'].includes(event.key)) renderAdminReports();
});
