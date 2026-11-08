const CLAIM_STAGES = ['Submitted', 'Documents Verified', 'Under Review', 'Approved', 'Payment Processed'];

function readClaims() {
  try {
    const claims = JSON.parse(localStorage.getItem('hs-claims') || '[]');
    return Array.isArray(claims) ? claims : [];
  } catch {
    return [];
  }
}

function renderClaimTimeline(claim) {
  const timeline = document.querySelector('#claimTimeline');
  const message = document.querySelector('#claimTrackingMessage');
  if (!timeline) return;
  const stage = Math.max(0, CLAIM_STAGES.indexOf(claim?.status || 'Submitted'));
  timeline.querySelectorAll('.step').forEach((step, index) => {
    step.classList.toggle('done', !!claim && index <= stage);
    step.classList.toggle('current', !!claim && index === stage);
    step.setAttribute('aria-current', claim && index === stage ? 'step' : 'false');
  });
  if (message) {
    message.textContent = claim
      ? `Tracking ${claim.id}: ${claim.status || 'Submitted'}. Status changes are simulated for this demo.`
      : 'Select a submitted claim below to view its current status.';
  }
}

function toggleInlineTracking(claim, row, button) {
  const existing = row.nextElementSibling;
  if (existing?.classList.contains('claim-details-row')) {
    existing.remove();
    button.textContent = 'Track';
    button.setAttribute('aria-expanded', 'false');
    return;
  }

  document.querySelectorAll('.claim-details-row').forEach(item => item.remove());
  document.querySelectorAll('.claim-track').forEach(item => {
    item.textContent = 'Track';
    item.setAttribute('aria-expanded', 'false');
  });

  const currentStatus = claim.status || 'Submitted';
  const currentStage = Math.max(0, CLAIM_STAGES.indexOf(currentStatus));
  const detailsRow = document.createElement('tr');
  detailsRow.className = 'claim-details-row';
  const cell = document.createElement('td');
  cell.colSpan = 6;
  const panel = document.createElement('div');
  panel.className = 'claim-track-details';

  const title = document.createElement('h3');
  title.textContent = `Claim ${claim.id} tracking`;
  panel.append(title);
  const statusLine = document.createElement('p');
  statusLine.className = 'claim-current-status';
  statusLine.textContent = `Current status: ${currentStatus}`;
  panel.append(statusLine);

  const progress = document.createElement('ol');
  progress.className = 'claim-progress';
  CLAIM_STAGES.forEach((stage, index) => {
    const item = document.createElement('li');
    item.textContent = stage;
    if (index < currentStage) item.classList.add('complete');
    if (index === currentStage) {
      item.classList.add('active');
      item.setAttribute('aria-current', 'step');
    }
    progress.append(item);
  });
  panel.append(progress);

  const submitted = document.createElement('p');
  submitted.className = 'muted';
  const date = claim.submittedAt ? new Date(claim.submittedAt) : null;
  submitted.textContent = `Submitted: ${date && !Number.isNaN(date.valueOf()) ? date.toLocaleString() : 'Date unavailable'}`;
  panel.append(submitted);
  const note = document.createElement('p');
  note.className = 'notice';
  note.textContent = 'This demo keeps claims in this browser. Later review stages require a real claims service.';
  panel.append(note);

  cell.append(panel);
  detailsRow.append(cell);
  row.after(detailsRow);
  button.textContent = 'Hide tracking';
  button.setAttribute('aria-expanded', 'true');
  detailsRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function renderClaims(selectedId) {
  const body = document.querySelector('#claimRows');
  if (!body) return;
  const claims = readClaims();
  const chosen = claims.find(claim => claim.id === selectedId) || claims[0] || null;
  const rows = document.createDocumentFragment();

  if (!claims.length) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 6;
    cell.textContent = 'No claims submitted yet.';
    row.append(cell);
    rows.append(row);
  } else {
    claims.slice().reverse().forEach(claim => {
      const row = document.createElement('tr');
      [claim.id, claim.policy, claim.hospital, `₹${Number(claim.amount).toLocaleString('en-IN')}`]
        .forEach(value => {
          const cell = document.createElement('td');
          cell.textContent = value || '—';
          row.append(cell);
        });
      const statusCell = document.createElement('td');
      const badge = document.createElement('span');
      badge.className = 'badge info';
      badge.textContent = claim.status || 'Submitted';
      statusCell.append(badge);
      row.append(statusCell);
      const actionCell = document.createElement('td');
      const track = document.createElement('button');
      track.type = 'button';
      track.className = 'btn btn-secondary claim-track';
      track.textContent = 'Track';
      track.setAttribute('aria-label', `Track claim ${claim.id}`);
      track.setAttribute('aria-expanded', 'false');
      track.addEventListener('click', () => {
        renderClaimTimeline(claim);
        document.querySelectorAll('#claimRows tr').forEach(item => item.classList.remove('claim-selected'));
        row.classList.add('claim-selected');
        toggleInlineTracking(claim, row, track);
      });
      actionCell.append(track);
      row.append(actionCell);
      if (chosen && claim.id === chosen.id) row.classList.add('claim-selected');
      rows.append(row);
    });
  }

  body.replaceChildren(rows);
  renderClaimTimeline(chosen);
  const counter = document.querySelector('#claimCount');
  if (counter) counter.textContent = String(claims.length);
}

function submitClaim(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const status = document.querySelector('#claimFormStatus');
  if (!form.reportValidity()) return;

  const admission = form.elements.admissionDate.value;
  const discharge = form.elements.dischargeDate.value;
  const amount = Number(form.elements.claimAmount.value);
  if (amount <= 0 || !Number.isFinite(amount)) {
    status.textContent = 'Enter a claim amount greater than zero.';
    return;
  }
  if (discharge < admission) {
    status.textContent = 'Discharge date must be on or after the admission date.';
    return;
  }

  const claim = {
    id: `CLM-${Date.now().toString().slice(-8)}`,
    policy: form.elements.policyNumber.value.trim(),
    hospital: form.elements.hospitalName.value.trim(),
    treatment: form.elements.treatmentType.value.trim(),
    amount,
    admissionDate: admission,
    dischargeDate: discharge,
    description: form.elements.description.value.trim(),
    documents: [...form.elements.documents.files].map(file => file.name),
    status: 'Submitted',
    submittedAt: new Date().toISOString()
  };

  try {
    const claims = readClaims();
    claims.push(claim);
    localStorage.setItem('hs-claims', JSON.stringify(claims));
    form.reset();
    status.textContent = 'Claim saved in this browser and added to tracking.';
    renderClaims(claim.id);
  } catch {
    status.textContent = 'Could not save this claim in browser storage. Check available storage and try again.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  renderClaims();
  const form = document.querySelector('#claimForm');
  if (form) form.addEventListener('submit', submitClaim);
});

window.addEventListener('storage', event => {
  if (event.key === 'hs-claims') renderClaims();
});
