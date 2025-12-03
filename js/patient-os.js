const htmlEl = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

function setTheme(mode) {
  htmlEl.setAttribute('data-theme', mode);
  localStorage.setItem('hf_theme', mode);
}

const savedTheme = localStorage.getItem('hf_theme');
if (savedTheme) setTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = htmlEl.getAttribute('data-theme') === 'vision' ? 'matte' : 'vision';
    setTheme(next);
  });
}

// Live vitals demo
const vitalsEl = {
  hr: document.getElementById('v_hr'),
  bp: document.getElementById('v_bp'),
  spo2: document.getElementById('v_spo2'),
  temp: document.getElementById('v_temp'),
  ai: document.getElementById('ai_summary'),
};

function randomBetween(min, max, fixed = 1) {
  return (Math.random() * (max - min) + min).toFixed(fixed);
}

function updateVitals() {
  if (!vitalsEl.hr) return;
  const hr = Math.floor(Math.random() * 15) + 70;
  const bpS = Math.floor(Math.random() * 10) + 112;
  const bpD = Math.floor(Math.random() * 8) + 70;
  const spo2 = Math.floor(Math.random() * 3) + 97;
  const temp = randomBetween(36.5, 37.2);

  vitalsEl.hr.textContent = hr;
  vitalsEl.bp.textContent = `${bpS}/${bpD}`;
  vitalsEl.spo2.textContent = `${spo2}%`;
  vitalsEl.temp.textContent = `${temp}°C`;
  if (vitalsEl.ai) {
    vitalsEl.ai.textContent = `Vitals steady. HR ${hr} bpm, BP ${bpS}/${bpD}, SpO₂ ${spo2}%. Stay hydrated.`;
  }
}

updateVitals();
setInterval(updateVitals, 4500);

// Blood & hydration
const bloodSignal = document.getElementById('blood_signal');
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
  setText('water_msg', hydrationDrop ? 'Looks dehydrated — drink 500ml now' : 'Keep sipping');
  setText('infection_value', infectionChance ? 'Watch' : 'Low');
  setText('infection_msg', infectionChance ? 'Mild infection markers seen' : 'No signals');
  setText('anemia_value', parseFloat(hb) < 12.8 ? 'Borderline' : 'Clear');
  setText('anemia_msg', parseFloat(hb) < 12.8 ? 'Iron support suggested' : 'Iron looks fine');

  if (bloodSignal) {
    bloodSignal.textContent = hydrationDrop ? 'Hydrate' : 'Balanced';
    bloodSignal.className = hydrationDrop ? 'notice warn' : 'notice';
  }
}

hydrateStatus();
setInterval(hydrateStatus, 12000);

// Lab intelligence across pages
const labPills = {
  cbc: document.getElementById('cbc_signal'),
  lft: document.getElementById('lft_signal'),
  kft: document.getElementById('kft_signal'),
  cardiac: document.getElementById('cardiac_signal'),
  lung: document.getElementById('lung_signal'),
  dental: document.getElementById('dental_signal'),
};

function updateLabIntelligence() {
  if (!labPills.cbc && !labPills.lft) return;
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
  setText('lab_spo2', `${Math.floor(Math.random() * 3) + 97}%`);
  setText('lab_resp', Math.floor(Math.random() * 4) + 14);

  if (labPills.cbc) labPills.cbc.textContent = labs.wbc > 7.5 ? 'Watch' : 'Normal';
  if (labPills.lft) labPills.lft.textContent = labs.sgot > 35 ? 'Monitor' : 'Good';
  if (labPills.kft) labPills.kft.textContent = labs.creatinine > 1.1 ? 'Hydrate' : 'Hydrated';
  if (labPills.cardiac) labPills.cardiac.textContent = labs.crp.includes('High') ? 'Alert' : 'Calm';
  if (labPills.lung) labPills.lung.textContent = labs.spirometry.includes('restriction') ? 'Tight' : 'Free';
  if (labPills.dental) labPills.dental.textContent = 'Bright';

  setText('lab_cbc_ai', labs.wbc > 7.5 ? 'Slightly raised WBC, keep an eye.' : 'Blood looks balanced. No infection seen.');
  setText('lab_lft_ai', labs.sgot > 35 ? 'LFT mildly elevated, avoid oil and repeat.' : 'Liver values inside normal range.');
  setText('lab_kft_ai', labs.creatinine > 1.1 ? 'Kidney load up — hydrate well.' : 'Kidney filters are working well.');
  setText('lab_cardiac_ai', labs.crp.includes('High') ? 'Inflammation noted, rest and recheck.' : 'Heart stress markers are low.');
  setText('lab_lung_ai', labs.spirometry.includes('restriction') ? 'Lungs feel tight, sit upright and breathe slow.' : 'Breathing looks smooth.');
  setText('lab_dental_ai', '3D CBCT shows gums and teeth are clear.');
}

updateLabIntelligence();
setInterval(updateLabIntelligence, 15000);

// Radiology + imaging live status
const radiologyRows = document.querySelectorAll('[data-rad-study]');

function updateRadiologyBoard() {
  if (!radiologyRows.length) return;
  const statusPool = [
    { label: 'Ready', tone: 'notice success', eta: 'Today' },
    { label: 'Reporting', tone: 'notice warn', eta: 'In progress' },
    { label: 'Pending upload', tone: 'notice', eta: 'Awaiting' },
    { label: 'Scheduled', tone: 'notice', eta: 'Tomorrow' },
  ];

  radiologyRows.forEach(row => {
    const statusEl = row.querySelector('[data-rad-status]');
    const etaEl = row.querySelector('[data-rad-eta]');
    if (!statusEl || !etaEl) return;
    const status = statusPool[Math.floor(Math.random() * statusPool.length)];
    statusEl.textContent = status.label;
    statusEl.className = `chip ${status.tone}`;
    etaEl.textContent = status.eta;
  });
}

updateRadiologyBoard();
setInterval(updateRadiologyBoard, 12000);

// Organ alerts mirrored across pages
const organAlertBadge = document.getElementById('organ_alert_badge');
const alertList = document.getElementById('alert_list');
const organSignal = document.getElementById('organ_alert');

function renderAlerts(entries = []) {
  if (!alertList || !organAlertBadge) return;
  alertList.innerHTML = '';
  if (!entries.length) {
    alertList.innerHTML = '<div class="notice success">All systems green. You will be notified if vitals cross thresholds.</div>';
    organAlertBadge.textContent = '0 alerts';
    if (organSignal) organSignal.textContent = 'All clear';
    return;
  }

  entries.forEach(alert => {
    const item = document.createElement('div');
    item.className = `notice ${alert.type}`;
    item.textContent = alert.message;
    alertList.appendChild(item);
  });
  organAlertBadge.textContent = `${entries.length} alert${entries.length > 1 ? 's' : ''}`;
  if (organSignal) organSignal.textContent = 'Action needed';
}

function evaluateOrgans() {
  if (!organAlertBadge) return;
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

evaluateOrgans();
setInterval(evaluateOrgans, 14000);

// Device pairing demo
const pairDeviceBtn = document.getElementById('pairDevice');
const deviceList = document.getElementById('device_list');
if (pairDeviceBtn && deviceList) {
  pairDeviceBtn.addEventListener('click', () => {
    const el = document.createElement('div');
    el.className = 'stat';
    el.textContent = 'New device • Connecting…';
    deviceList.appendChild(el);
    setTimeout(() => { el.textContent = 'New device • Connected'; }, 1200);
  });
}

// Emergency controls
const emergencyBtn = document.getElementById('triggerEmergency');
const autoToggle = document.getElementById('autoToggle');
const emgStatus = document.getElementById('emg_status_msg');
const liveLocation = document.getElementById('live_location_status');
const familyToggle = document.getElementById('familyMirror');
const familyMsg = document.getElementById('family_status_msg');

emergencyBtn?.addEventListener('click', () => {
  if (emgStatus) emgStatus.textContent = 'Ambulance triggered. Location shared with nearest hospital and family.';
  emergencyBtn.textContent = 'Sent';
  if (liveLocation) liveLocation.textContent = 'Live location streaming to EMS + family.';
});

autoToggle?.addEventListener('click', () => {
  const isOn = autoToggle.textContent.includes('ON');
  autoToggle.textContent = `Auto trigger: ${isOn ? 'OFF' : 'ON'}`;
  if (emgStatus) emgStatus.textContent = isOn ? 'Manual mode active.' : 'Auto trigger armed for falls or vital changes.';
});

familyToggle?.addEventListener('click', () => {
  const sharing = familyToggle.dataset.state === 'on';
  familyToggle.dataset.state = sharing ? 'off' : 'on';
  familyToggle.textContent = sharing ? 'Share live view with family' : 'Family live view ON';
  if (familyMsg) familyMsg.textContent = sharing ? 'Family access paused.' : 'Family can now see live vitals + organ alerts.';
});
