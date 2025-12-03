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
}

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
  setText('hb_value', `${randomBetween(12.5, 14.2)} g/dL`);
  setText('water_value', 'Good');
  setText('water_msg', 'Sip through the day');
  setText('infection_value', 'Low');
  setText('infection_msg', 'No signs');
  setText('anemia_value', 'Clear');
  setText('anemia_msg', 'Iron looks fine');
}

hydrateStatus();
setInterval(hydrateStatus, 12000);

const organHints = {
  heart: 'Cardiac markers calm. Keep walks going.',
  lungs: 'Breathing smooth. Keep posture upright.',
  liver: 'LFT fine. Stay light on oil.',
  kidney: 'Filters hydrated. Keep water intake.',
  dental: '3D CBCT clear. Brush twice daily.',
  brain: 'Calm. Take screen breaks.',
};

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
