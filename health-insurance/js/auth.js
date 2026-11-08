function readDemoUsers() {
  try {
    const users = JSON.parse(localStorage.getItem('hs-users') || '[]');
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

function validateSignup(event) {
  event.preventDefault();
  const name = document.querySelector('#fullName').value.trim();
  const email = document.querySelector('#email').value.trim().toLowerCase();
  const phone = document.querySelector('#phone').value.trim();
  const password = document.querySelector('#password').value;
  const confirm = document.querySelector('#confirmPassword').value;
  if (password !== confirm) return toast('Passwords do not match.');

  const users = readDemoUsers();
  if (users.some(user => (user.email || '').toLowerCase() === email)) {
    return toast('An account with this email already exists. Please log in.');
  }

  const user = { id: `USR-${Date.now().toString().slice(-7)}`, name, email, phone, role: 'User', status: 'Active' };
  users.push(user);
  try {
    localStorage.setItem('hs-users', JSON.stringify(users));
    localStorage.setItem('hs-user', JSON.stringify(user));
    localStorage.setItem('hs-logged-in', 'true');
    localStorage.setItem('hs-session-role', 'User');
  } catch {
    return toast('Could not save the demo account in this browser.');
  }
  toast('Demo account created.');
  setTimeout(() => location.href = 'dashboard.html', 500);
}

function validateLogin(event) {
  event.preventDefault();
  const email = document.querySelector('#email').value.trim().toLowerCase();
  const user = readDemoUsers().find(item => (item.email || '').toLowerCase() === email && item.status !== 'Disabled');
  if (user) localStorage.setItem('hs-user', JSON.stringify(user));
  else localStorage.setItem('hs-user', JSON.stringify({ name: 'Demo User', email, role: 'User' }));
  localStorage.setItem('hs-logged-in', 'true');
  localStorage.setItem('hs-session-role', 'User');
  toast('Demo login successful.');
  setTimeout(() => location.href = 'dashboard.html', 500);
}

function logoutDemo() {
  localStorage.removeItem('hs-logged-in');
  localStorage.removeItem('hs-session-role');
  location.href = 'index.html';
}
