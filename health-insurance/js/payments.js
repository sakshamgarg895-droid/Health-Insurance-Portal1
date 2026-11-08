const samplePaymentHistory = [
  { id: 'TXN-884021', policy: 'HS-2026-1042', amount: 1299, date: '2026-08-05', method: 'UPI', status: 'Paid' },
  { id: 'TXN-771204', policy: 'HS-2026-1042', amount: 1299, date: '2026-07-05', method: 'Card', status: 'Paid' }
];

function getPayments() {
  try {
    const payments = JSON.parse(localStorage.getItem('hs-payments') || '[]');
    const saved = Array.isArray(payments) ? payments : [];
    const savedIds = new Set(saved.map(payment => payment.id));
    return [...saved, ...samplePaymentHistory.filter(payment => !savedIds.has(payment.id))];
  } catch {
    return samplePaymentHistory;
  }
}

function renderPayments() {
  const body = document.querySelector('#paymentRows');
  if (!body) return;
  const payments = getPayments();
  const fragment = document.createDocumentFragment();
  payments.slice().reverse().forEach(payment => {
    const row = document.createElement('tr');
    [payment.id, payment.policy, `₹${Number(payment.amount).toLocaleString('en-IN')}`, payment.date, payment.method]
      .forEach((value, index) => {
        const cell = document.createElement('td');
        if (index === 3 && payment.date) {
          const date = new Date(`${payment.date}T00:00:00`);
          cell.textContent = Number.isNaN(date.valueOf()) ? payment.date : date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
        } else cell.textContent = value || '—';
        row.append(cell);
      });
    const statusCell = document.createElement('td');
    const badge = document.createElement('span');
    badge.className = `badge ${payment.status === 'Paid' ? 'success' : payment.status === 'Pending' ? 'warning' : 'danger'}`;
    badge.textContent = payment.status || 'Pending';
    statusCell.append(badge);
    row.append(statusCell);
    const receiptCell = document.createElement('td');
    const receipt = document.createElement('button');
    receipt.type = 'button';
    receipt.className = 'btn btn-secondary';
    receipt.textContent = 'Download Receipt';
    receipt.disabled = payment.status !== 'Paid';
    receipt.addEventListener('click', () => downloadDemo(
      `Receipt-${payment.id}.txt`,
      `Transaction ${payment.id}\nPolicy ${payment.policy}\nAmount ₹${Number(payment.amount).toLocaleString('en-IN')}\nDate ${payment.date}\nMethod ${payment.method}\nStatus ${payment.status}\nDemo record only; no payment was processed.`
    ));
    receiptCell.append(receipt);
    row.append(receiptCell);
    fragment.append(row);
  });
  body.replaceChildren(fragment);
}

document.addEventListener('DOMContentLoaded', renderPayments);
window.addEventListener('storage', event => {
  if (event.key === 'hs-payments') renderPayments();
});
