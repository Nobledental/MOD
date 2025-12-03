const htmlEl = document.documentElement;
const themeToggle = document.getElementById('themeToggle');
const navButtons = document.querySelectorAll('[data-target]');
const dockButtons = document.querySelectorAll('.dock-btn');
const organCards = document.querySelectorAll('.organ-card');
const reportButtons = document.querySelectorAll('.report-open-btn');
const modalOverlay = document.getElementById('reportModal');
const organModal = document.getElementById('organModal');
const copilot = document.getElementById('copilot');
const openCopilotBtn = document.getElementById('openCopilot');
const closeCopilotBtn = document.querySelector('.copilot-close');
const copilotSend = document.getElementById('copilotSend');
const copilotInput = document.getElementById('copilotInput');
const copilotChat = document.getElementById('copilotChat');
const emergencyBtn = document.getElementById('triggerEmergency');
const autoToggle = document.getElementById('autoToggle');
const emgStatus = document.getElementById('emg_status_msg');
const pairDeviceBtn = document.getElementById('pairDevice');
const deviceList = document.getElementById('device_list');
const themeButtons = document.querySelectorAll('.pill-switch button');
const dockCopilot = document.getElementById('dockCopilot');
const organAlertBadge = document.getElementById('organ_alert_badge');
const alertList = document.getElementById('alert_list');
const bloodSignal = document.getElementById('blood_signal');
const organSignal = document.getElementById('organ_alert');
const labPills = {
  cbc: document.getElementById('cbc_signal'),
  lft: document.getElementById('lft_signal'),
  kft: document.getElementById('kft_signal'),
  cardiac: document.getElementById('cardiac_signal'),
  lung: document.getElementById('lung_signal'),
  dental: document.getElementById('dental_signal'),
};

function smoothScroll(target) {
  const el = document.getElementById(target);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    navButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    dockButtons.forEach(b => b.classList.remove('active'));
    smoothScroll(target);
  });
});

dockButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-target');
    dockButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    smoothScroll(target);
  });
});

if (dockCopilot) {
  dockCopilot.addEventListener('click', () => {
    copilot.style.display = 'block';
  });
}

// Theme
function setTheme(mode) {
  htmlEl.setAttribute('data-theme', mode);
  localStorage.setItem('hf_theme', mode);
  themeButtons.forEach(btn => {
    if (btn.dataset.theme === mode) btn.classList.add('solid');
    else btn.classList.remove('solid');
  });
}

const savedTheme = localStorage.getItem('hf_theme');
if (savedTheme) setTheme(savedTheme);

themeToggle?.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme') === 'vision' ? 'matte' : 'vision';
  setTheme(current);
});

themeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const theme = btn.getAttribute('data-theme');
    setTheme(theme);
  });
});

// Vitals demo
const vitalsEl = {
  hr: document.getElementById('v_hr'),
  bp: document.getElementById('v_bp'),
  spo2: document.getElementById('v_spo2'),
  temp: document.getElementById('v_temp'),
  hrFloat: document.getElementById('hr_float'),
  ai: document.getElementById('ai_summary'),
};

function randomBetween(min, max) {
  return (Math.random() * (max - min) + min).toFixed(1);
}

function updateVitals() {
  const hr = Math.floor(Math.random() * 15) + 70;
  const bpS = Math.floor(Math.random() * 10) + 112;
  const bpD = Math.floor(Math.random() * 8) + 70;
  const spo2 = Math.floor(Math.random() * 3) + 97;
  const temp = randomBetween(36.5, 37.2);

  vitalsEl.hr.textContent = hr;
  vitalsEl.bp.textContent = `${bpS}/${bpD}`;
  vitalsEl.spo2.textContent = `${spo2}%`;
  vitalsEl.temp.textContent = `${temp}°C`;
  vitalsEl.hrFloat.textContent = hr;
  vitalsEl.ai.textContent = `All steady. HR ${hr} bpm, BP ${bpS}/${bpD}, SpO₂ ${spo2}%. Stay hydrated.`;
}

setInterval(updateVitals, 4500);
updateVitals();

// Blood & organ signals
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function hydrateStatus() {
  const hb = randomBetween(12.5, 14.8);
  const hydrationDrop = Math.random() > 0.7;
  const infectionChance = Math.random() > 0.85;

  setText('hb_value', `${hb} g/dL`);
  setText('water_value', hydrationDrop ? 'Low' : 'Good');
  setText('water_msg', hydrationDrop ? 'Looks dehydrated — drink 500ml now' : 'Sip through the day');
  setText('infection_value', infectionChance ? 'Watch' : 'Low');
  setText('infection_msg', infectionChance ? 'Mild infection markers seen' : 'No signs');
  setText('anemia_value', parseFloat(hb) < 12.8 ? 'Borderline' : 'Clear');
  setText('anemia_msg', parseFloat(hb) < 12.8 ? 'Iron support suggested' : 'Iron looks fine');

  bloodSignal.textContent = hydrationDrop ? 'Hydrate' : 'Balanced';
  bloodSignal.className = hydrationDrop ? 'pill soft warn' : 'pill soft';
}

hydrateStatus();
setInterval(hydrateStatus, 12000);

function updateLabIntelligence() {
  const labs = {
    rbc: randomBetween(4.4, 5.1),
    wbc: randomBetween(5.5, 7.8),
    platelets: randomBetween(2.1, 3.2),
    sgot: randomBetween(22, 38),
    sgpt: randomBetween(20, 42),
    bilirubin: randomBetween(0.7, 1.3),
    creatinine: randomBetween(0.8, 1.2),
    urea: randomBetween(18, 32),
    sodium: randomBetween(136, 144),
    troponin: 'Normal',
    crp: Math.random() > 0.85 ? 'Mildly High' : 'Low',
    bnp: 'Normal',
    spirometry: Math.random() > 0.9 ? 'Mild restriction' : 'Normal',
  };

  setText('lab_rbc', labs.rbc);
  setText('lab_wbc', labs.wbc);
  setText('lab_platelets', labs.platelets);
  setText('lab_sgot', labs.sgot);
  setText('lab_sgpt', labs.sgpt);
  setText('lab_bilirubin', labs.bilirubin);
  setText('lab_creatinine', labs.creatinine);
  setText('lab_urea', labs.urea);
  setText('lab_sodium', labs.sodium);
  setText('lab_troponin', labs.troponin);
  setText('lab_crp', labs.crp);
  setText('lab_bnp', labs.bnp);
  setText('lab_spirometry', labs.spirometry);

  labPills.cbc.textContent = labs.wbc > 7.5 ? 'Watch' : 'Normal';
  labPills.lft.textContent = labs.sgot > 35 ? 'Monitor' : 'Good';
  labPills.kft.textContent = labs.creatinine > 1.1 ? 'Hydrate' : 'Hydrated';
  labPills.cardiac.textContent = labs.crp.includes('High') ? 'Alert' : 'Calm';
  labPills.lung.textContent = labs.spirometry.includes('restriction') ? 'Tight' : 'Free';
  labPills.dental.textContent = 'Bright';

  setText('lab_cbc_ai', labs.wbc > 7.5 ? 'Slightly raised WBC, keep an eye.' : 'Blood looks balanced. No infection seen.');
  setText('lab_lft_ai', labs.sgot > 35 ? 'LFT mildly elevated, avoid oil and repeat.' : 'Liver values stay inside normal range.');
  setText('lab_kft_ai', labs.creatinine > 1.1 ? 'Kidney load up — hydrate well.' : 'Kidney filters are working well. Keep water handy.');
  setText('lab_cardiac_ai', labs.crp.includes('High') ? 'Inflammation noted, rest and recheck.' : 'Heart stress markers are low and steady.');
  setText('lab_lung_ai', labs.spirometry.includes('restriction') ? 'Lungs feel tight, sit upright and breathe slow.' : 'Breathing looks smooth. SpO₂ steady.');
}

updateLabIntelligence();
setInterval(updateLabIntelligence, 15000);

const organHints = {
  heart: 'Cardiac markers calm. Keep walks going.',
  lungs: 'Breathing smooth. Keep posture upright.',
  liver: 'LFT fine. Stay light on oil.',
  kidney: 'Filters hydrated. Keep water intake.',
  dental: '3D CBCT clear. Brush twice daily.',
  brain: 'Calm. Take screen breaks.',
};

function renderAlerts(entries = []) {
  if (!alertList || !organAlertBadge) return;
  alertList.innerHTML = '';
  if (!entries.length) {
    alertList.innerHTML = '<div class="alert-item success">All systems green. You will be notified if vitals cross thresholds.</div>';
    organAlertBadge.textContent = '0 alerts';
    organSignal.textContent = 'All clear';
    return;
  }

  entries.forEach(alert => {
    const item = document.createElement('div');
    item.className = `alert-item ${alert.type}`;
    item.textContent = alert.message;
    alertList.appendChild(item);
  });
  organAlertBadge.textContent = `${entries.length} alert${entries.length > 1 ? 's' : ''}`;
  organSignal.textContent = entries.length ? 'Action needed' : 'All clear';
}

function evaluateOrgans() {
  const alerts = [];
  const hydrationLow = bloodSignal?.textContent === 'Hydrate';
  const lungTight = labPills.lung?.textContent === 'Tight';

  if (hydrationLow) {
    setText('kidney_status', 'Dry');
    alerts.push({ type: 'warn', message: 'Hydration low — kidneys need water support.' });
  } else {
    setText('kidney_status', 'Hydrated');
  }

  if (lungTight) {
    setText('lung_status', 'Tight');
    alerts.push({ type: 'danger', message: 'Spirometry tight. Practice pursed lip breathing.' });
  } else {
    setText('lung_status', 'Free');
  }

  renderAlerts(alerts);
}

organCards.forEach(card => {
  card.addEventListener('click', () => {
    organModal.classList.remove('hidden');
    const key = card.dataset.organ;
    document.getElementById('organTitle').textContent = `${key.charAt(0).toUpperCase() + key.slice(1)} details`;
    document.getElementById('organStatus').textContent = card.querySelector('.organ-status')?.textContent || 'Normal';
    document.getElementById('organAI').textContent = organHints[key] || 'Looks fine.';
    document.getElementById('organRisk').textContent = 'Low';
  });
});

evaluateOrgans();
setInterval(evaluateOrgans, 14000);

// Reports
reportButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modalOverlay.classList.remove('hidden');
    document.getElementById('modalTitle').textContent = btn.closest('.report-card')?.querySelector('h3')?.textContent || 'Report';
    document.getElementById('modalDate').textContent = 'Date: Feb 2025';
    document.getElementById('modalImage').src = 'https://images.unsplash.com/photo-1582719478248-54e9f2af25f0?auto=format&fit=crop&w=900&q=80';
  });
});

function closeModals() {
  modalOverlay.classList.add('hidden');
  organModal.classList.add('hidden');
}

document.querySelectorAll('.modal-close').forEach(btn => btn.addEventListener('click', closeModals));
modalOverlay?.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModals(); });
organModal?.addEventListener('click', (e) => { if (e.target === organModal) closeModals(); });

// Copilot
function sendCopilot(message, from = 'user') {
  const div = document.createElement('div');
  div.className = from === 'user' ? 'msg-user' : 'msg-ai';
  div.textContent = message;
  copilotChat.appendChild(div);
  copilotChat.scrollTop = copilotChat.scrollHeight;
}

copilotSend?.addEventListener('click', () => {
  const msg = copilotInput.value.trim();
  if (!msg) return;
  sendCopilot(msg, 'user');
  copilotInput.value = '';
  setTimeout(() => sendCopilot('Noted. I will keep you updated and can book if needed.'), 500);
});

copilotInput?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') copilotSend.click();
});

openCopilotBtn?.addEventListener('click', () => {
  copilot.style.display = 'block';
});

closeCopilotBtn?.addEventListener('click', () => {
  copilot.style.display = 'none';
});

// Emergency
emergencyBtn?.addEventListener('click', () => {
  emgStatus.textContent = 'Ambulance triggered. Location shared with nearest hospital and family.';
  emergencyBtn.textContent = 'Sent';
});

autoToggle?.addEventListener('click', () => {
  const isOn = autoToggle.textContent.includes('ON');
  autoToggle.textContent = `Auto trigger: ${isOn ? 'OFF' : 'ON'}`;
  emgStatus.textContent = isOn ? 'Manual mode active.' : 'Auto trigger armed for falls or vital changes.';
});

// Devices
pairDeviceBtn?.addEventListener('click', () => {
  const el = document.createElement('div');
  el.className = 'device-item';
  el.textContent = 'New device • Connecting…';
  deviceList.appendChild(el);
  setTimeout(() => {
    el.textContent = 'New device • Connected';
  }, 1200);
});

// ECG mini demo
const ecgCanvas = document.getElementById('ecg_mini');
if (ecgCanvas) {
  const ctx = ecgCanvas.getContext('2d');
  function drawEcg() {
    const w = ecgCanvas.width;
    const h = ecgCanvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#5df2d6';
    ctx.beginPath();
    for (let x = 0; x < w; x += 10) {
      const y = h / 2 + Math.sin((x + Date.now() / 40) / 8) * 18;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  setInterval(drawEcg, 120);
  ecgCanvas.width = ecgCanvas.offsetWidth;
  ecgCanvas.height = ecgCanvas.offsetHeight;
}

// Demo chart placeholder
const organTrend = document.getElementById('organTrendChart');
if (organTrend) {
  const ctx = organTrend.getContext('2d');
  function drawTrend() {
    const w = organTrend.width;
    const h = organTrend.height;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#5f8bff';
    ctx.beginPath();
    for (let x = 0; x <= w; x += 12) {
      const y = h / 2 + Math.sin((x + Date.now() / 80) / 8) * 16;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  organTrend.width = organTrend.offsetWidth;
  organTrend.height = organTrend.offsetHeight;
  setInterval(drawTrend, 160);
}

// Pill mode buttons
const modePills = document.querySelectorAll('.pill-switch .pill');
modePills.forEach(pill => pill.addEventListener('click', () => setTheme(pill.dataset.theme)));
