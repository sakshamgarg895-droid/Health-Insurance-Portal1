function refreshUserDashboard() {
  let user = { name: 'Demo User', email: '', role: 'User' };
  try {
    const stored = JSON.parse(localStorage.getItem('hs-user') || 'null');
    if (stored && typeof stored === 'object') user = { ...user, ...stored };
  } catch { /* Keep the demo profile. */ }
  document.querySelectorAll('.user-name').forEach(node => node.textContent = user.name || 'Demo User');

  let claims = [];
  try {
    const stored = JSON.parse(localStorage.getItem('hs-claims') || '[]');
    if (Array.isArray(stored)) claims = stored;
  } catch { /* Keep the empty overview. */ }
  const count = document.querySelector('#claimCount');
  if (count) count.textContent = String(claims.length);

  const chartNode = document.querySelector('#claimsChart');
  if (chartNode && window.Chart) {
    const chart = Chart.getChart(chartNode);
    if (chart) chart.destroy();
    const labels = ['Submitted', 'Documents Verified', 'Under Review', 'Approved', 'Payment Processed'];
    const counts = labels.map(
      status => claims.filter(claim => claim.status === status).length
    );
    new Chart(chartNode, {
      type: 'doughnut',
      data: { labels, datasets: [{ data: counts, backgroundColor: ['#287be3', '#62a0ee', '#e1a82b', '#16845b', '#0b9389'] }] },
      options: { plugins: { legend: { position: 'bottom' } } }
    });
  }
}

document.addEventListener('DOMContentLoaded', refreshUserDashboard);
window.addEventListener('storage', event => {
  if (event.key === 'hs-user' || event.key === 'hs-claims') refreshUserDashboard();
});
