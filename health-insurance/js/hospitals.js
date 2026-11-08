(() => {
  const grid = document.querySelector('#hospitalGrid');
  if (!grid) return;
  let cards = [...grid.querySelectorAll('.hospital-card')];

  const filters = {
    name: document.querySelector('#hs'),
    city: document.querySelector('#hc'),
    specialty: document.querySelector('#hsp'),
    cashless: document.querySelector('#cash')
  };
  const sampleDetails = {
    'citycare multispeciality hospital': {
      phone: '0141-555-0101', hours: 'Emergency: 24 hours; outpatient: 8:00 am–8:00 pm',
      services: 'Emergency care, diagnostics, pharmacy, inpatient care',
      consultation: '₹500–₹900', discount: '10% off select diagnostic packages',
      features: '24-hour emergency, pharmacy, imaging, ambulance, cafeteria'
    },
    'lifespring hospital': {
      phone: '011-555-0102', hours: 'Emergency: 24 hours; outpatient: 9:00 am–7:00 pm',
      services: 'Oncology, neurology, imaging, inpatient care',
      consultation: '₹700–₹1,200', discount: 'Sample 5% off select health checkups',
      features: 'Oncology day care, imaging, pharmacy, 24-hour emergency'
    },
    'wellness heart institute': {
      phone: '022-555-0103', hours: 'Emergency: 24 hours; outpatient: 8:00 am–6:00 pm',
      services: 'Cardiology, cardiac diagnostics, critical care',
      consultation: '₹800–₹1,500', discount: 'Sample 10% off select cardiac screening packages',
      features: 'Cardiac diagnostics, critical care, pharmacy, ambulance'
    },
    'green valley medical center': {
      phone: '020-555-0104', hours: 'Outpatient: 9:00 am–6:00 pm; emergency availability varies',
      services: 'Maternity, pediatrics, diagnostics, outpatient care',
      consultation: '₹400–₹800', discount: 'Sample 5% off select maternity packages',
      features: 'Maternity care, pediatrics, diagnostics, family waiting area'
    },
    'sunrise super specialty': {
      phone: '040-555-0105', hours: 'Emergency: 24 hours; outpatient: 8:00 am–8:00 pm',
      services: 'Orthopedics, oncology, imaging, inpatient care',
      consultation: '₹600–₹1,100', discount: 'Sample 10% off select diagnostic packages',
      features: 'Orthopedics, imaging, oncology day care, 24-hour emergency'
    },
    'careplus hospital': {
      phone: '033-555-0106', hours: 'Emergency: 24 hours; outpatient: 9:00 am–7:00 pm',
      services: 'General medicine, surgery, diagnostics, pharmacy',
      consultation: '₹350–₹700', discount: 'Sample 5% off select annual health checkups',
      features: 'General medicine, diagnostics, pharmacy, 24-hour emergency'
    }
  };

  function readCustomHospitals() {
    try {
      const hospitals = JSON.parse(localStorage.getItem('hs-hospitals') || '[]');
      return Array.isArray(hospitals) ? hospitals : [];
    } catch {
      return [];
    }
  }

  function renderCustomHospitals() {
    grid.querySelectorAll('[data-custom-hospital="true"]').forEach(card => card.remove());
    readCustomHospitals().forEach(hospital => {
      const card = document.createElement('article');
      card.className = 'card hospital-card';
      card.dataset.customHospital = 'true';
      card.dataset.name = hospital.name.toLowerCase();
      card.dataset.city = hospital.city.toLowerCase();
      card.dataset.speciality = hospital.specialties.toLowerCase();
      card.dataset.phone = hospital.phone || '';
      card.dataset.hours = hospital.hours || '';
      card.dataset.services = hospital.specialties || '';
      card.dataset.consultation = hospital.consultation || '';
      card.dataset.discount = hospital.discount || '';
      card.dataset.features = hospital.features || '';

      const icon = document.createElement('div');
      icon.className = 'hospital-icon';
      icon.textContent = '✚';
      card.append(icon);
      const title = document.createElement('h3');
      title.textContent = hospital.name;
      card.append(title);
      const address = document.createElement('p');
      address.className = 'muted';
      address.textContent = hospital.address;
      card.append(address);
      const chips = document.createElement('div');
      chips.className = 'chips';
      [hospital.city, hospital.specialties].forEach(text => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = text;
        chips.append(chip);
      });
      card.append(chips);
      const network = document.createElement('span');
      network.className = `badge ${hospital.network === 'Cashless Available' ? 'success' : 'warning'}`;
      network.textContent = hospital.network || 'Reimbursement';
      card.append(network);
      const details = document.createElement('button');
      details.type = 'button';
      details.className = 'btn btn-secondary hospital-detail';
      details.textContent = 'View Details';
      card.append(details);
      grid.append(card);
    });
    cards = [...grid.querySelectorAll('.hospital-card')];
    filterHospitals();
  }

  function filterHospitals() {
    const name = filters.name.value.trim().toLowerCase();
    const city = filters.city.value.trim().toLowerCase();
    const specialty = filters.specialty.value.trim().toLowerCase();
    const cashless = filters.cashless.value === 'yes';
    cards.forEach(card => {
      const matches = (!name || card.dataset.name.includes(name)) &&
        (!city || card.dataset.city.includes(city)) &&
        (!specialty || card.dataset.speciality.includes(specialty)) &&
        (!cashless || card.querySelector('.badge').textContent.includes('Cashless'));
      card.hidden = !matches;
    });
  }

  Object.values(filters).forEach(input => {
    input.addEventListener('input', filterHospitals);
    input.addEventListener('change', filterHospitals);
  });

  const dialog = document.createElement('dialog');
  dialog.className = 'hospital-dialog card';
  dialog.setAttribute('aria-labelledby', 'hospitalDialogTitle');
  dialog.innerHTML = '<button class="hospital-dialog-close" type="button" aria-label="Close details">×</button><div class="hospital-icon"><i class="fa-solid fa-hospital"></i></div><h2 id="hospitalDialogTitle"></h2><p class="hospital-dialog-location"></p><p><strong>Specialties:</strong> <span class="hospital-dialog-specialties"></span></p><p><strong>Network access:</strong> <span class="hospital-dialog-network"></span></p><p><strong>Sample consultation price:</strong> <span class="hospital-dialog-price"></span></p><p><strong>Sample discount:</strong> <span class="hospital-dialog-discount"></span></p><p><strong>Sample phone:</strong> <span class="hospital-dialog-phone"></span></p><p><strong>Hours:</strong> <span class="hospital-dialog-hours"></span></p><p><strong>Services:</strong> <span class="hospital-dialog-services"></span></p><p><strong>Facility features:</strong> <span class="hospital-dialog-features"></span></p><p class="muted">All prices, discounts, phone numbers and hours are fictional examples, not offers. Confirm current prices, availability, services and cashless eligibility with the hospital and insurer before visiting.</p>';
  document.body.append(dialog);

  dialog.querySelector('.hospital-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) dialog.close();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialog.open) dialog.close();
  });

  document.addEventListener('click', event => {
      const button = event.target.closest('.hospital-detail');
      if (!button) return;
      const card = button.closest('.hospital-card');
      dialog.querySelector('#hospitalDialogTitle').textContent = card.querySelector('h3').textContent;
      dialog.querySelector('.hospital-dialog-location').textContent = card.querySelector('.muted').textContent;
      dialog.querySelector('.hospital-dialog-specialties').textContent = card.dataset.speciality
        .split(',').map(item => item.trim()).map(item => item.replace(/\b\w/g, c => c.toUpperCase())).join(', ');
      dialog.querySelector('.hospital-dialog-network').textContent = card.querySelector('.badge').textContent;
      const details = sampleDetails[card.dataset.name] || {};
      dialog.querySelector('.hospital-dialog-phone').textContent = card.dataset.phone || details.phone || 'Not listed';
      dialog.querySelector('.hospital-dialog-hours').textContent = card.dataset.hours || details.hours || 'Confirm with the hospital';
      dialog.querySelector('.hospital-dialog-services').textContent = card.dataset.services || details.services || card.dataset.speciality;
      dialog.querySelector('.hospital-dialog-price').textContent = card.dataset.consultation || details.consultation || 'Confirm with the hospital';
      dialog.querySelector('.hospital-dialog-discount').textContent = card.dataset.discount || details.discount || 'No sample offer listed';
      dialog.querySelector('.hospital-dialog-features').textContent = card.dataset.features || details.features || 'Confirm with the hospital';
      dialog.showModal();
  });

  renderCustomHospitals();
  window.addEventListener('storage', event => {
    if (event.key === 'hs-hospitals') renderCustomHospitals();
  });
})();
