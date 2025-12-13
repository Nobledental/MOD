const htmlEl = document.documentElement;
const themeToggle = document.getElementById('themeToggle');

const navContainer = document.querySelector('.hf-nav');
const navVisible = document.getElementById('navVisible');
const navDropdown = document.getElementById('navDropdown');
const navMoreBtn = document.getElementById('navMoreBtn');

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

function rebalanceNav() {
  if (!navContainer || !navVisible || !navMoreBtn || !navDropdown) return;
  [...navDropdown.children].forEach((link) => navVisible.appendChild(link));
  const available = navContainer.clientWidth - navMoreBtn.offsetWidth - 12;
  let needsOverflow = false;
  const links = [...navVisible.children];
  for (let i = links.length - 1; i >= 0; i -= 1) {
    if (navVisible.scrollWidth > available) {
      navDropdown.prepend(links[i]);
      needsOverflow = true;
    }
  }
  navMoreBtn.style.display = needsOverflow ? 'inline-flex' : 'none';
  navContainer.classList.toggle('has-overflow', needsOverflow);
  navMoreBtn.setAttribute('aria-expanded', navContainer.classList.contains('open'));
}

if (navMoreBtn) {
  navMoreBtn.addEventListener('click', () => {
    navContainer.classList.toggle('open');
    if (navContainer.classList.contains('open')) {
      navContainer.classList.add('has-overflow');
    }
    if (navDropdown) navDropdown.classList.toggle('open');
    if (navMoreBtn.parentElement) navMoreBtn.parentElement.classList.toggle('open');
    navMoreBtn.setAttribute('aria-expanded', navContainer.classList.contains('open'));
  });

  window.addEventListener('resize', rebalanceNav);
  window.addEventListener('load', rebalanceNav);
  document.addEventListener('click', (evt) => {
    if (!navContainer.contains(evt.target)) {
      navContainer.classList.remove('open');
      if (navDropdown) navDropdown.classList.remove('open');
      if (navMoreBtn.parentElement) navMoreBtn.parentElement.classList.remove('open');
      navMoreBtn.setAttribute('aria-expanded', 'false');
    }
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

const tickerEls = {
  hr: document.getElementById('ticker_hr'),
  bp: document.getElementById('ticker_bp'),
  appt: document.getElementById('ticker_appt'),
  lab: document.getElementById('ticker_lab'),
  travel: document.getElementById('ticker_travel'),
};

const sparkEls = {
  hr: document.getElementById('spark_hr'),
  bp: document.getElementById('spark_bp'),
  spo2: document.getElementById('spark_spo2'),
  temp: document.getElementById('spark_temp'),
  badge: document.getElementById('vital_status_badge'),
  pulse: document.getElementById('vital_pulse'),
  wave: document.getElementById('vital_wave'),
};

const askAIButton = document.getElementById('ask_ai');

const organMeta = {
  vitals: {
    hr: document.getElementById('organ_vitals_hr'),
    bp: document.getElementById('organ_vitals_bp'),
    spo2: document.getElementById('organ_vitals_spo2'),
    heart: document.getElementById('heart_vitals'),
    lung: document.getElementById('lung_vitals'),
  },
  lab: {
    name: document.getElementById('organ_lab_name'),
    updated: document.getElementById('organ_lab_updated'),
  },
};

const healthReportShelf = document.getElementById('health_report_shelf');
const profileReportShelf = document.getElementById('profile_report_shelf');

const organStatusEls = {
  heart: document.getElementById('heart_status'),
  lungs: document.getElementById('lung_status'),
  liver: document.getElementById('liver_status'),
  kidney: document.getElementById('kidney_status'),
  brain: document.getElementById('brain_status'),
  dental: document.getElementById('dental_status'),
  vascular: document.getElementById('vascular_status'),
  endocrine: document.getElementById('endocrine_status'),
  immune: document.getElementById('immune_status'),
  musculoskeletal: document.getElementById('musculoskeletal_status'),
  gi: document.getElementById('gi_status'),
  pancreas: document.getElementById('pancreas_status'),
  spleen: document.getElementById('spleen_status'),
  reproductive: document.getElementById('reproductive_status'),
  skin: document.getElementById('skin_status'),
  eye: document.getElementById('eye_status'),
  ear: document.getElementById('ear_status'),
  bladder: document.getElementById('bladder_status'),
};

const organStudioEls = {
  model: document.getElementById('organ_model_viewer'),
  title: document.getElementById('organ_studio_title'),
  status: document.getElementById('organ_studio_status'),
  summary: document.getElementById('organ_studio_summary'),
  lab: document.getElementById('organ_studio_lab'),
  vitals: document.getElementById('organ_studio_vitals'),
  next: document.getElementById('organ_studio_next'),
  sync: document.getElementById('organ_studio_sync'),
};

const organSyncEls = {
  dashboard: document.getElementById('sync_dashboard_status'),
  health: document.getElementById('sync_health_status'),
  labs: document.getElementById('sync_labs_status'),
  vitals: document.getElementById('sync_vitals_status'),
  pharmacy: document.getElementById('sync_pharmacy_status'),
  hospitals: document.getElementById('sync_hospital_status'),
  pill: document.getElementById('organ_bridge_pill'),
  notice: document.getElementById('organ_bridge_notice'),
};

const organSyncLite = {
  heart: document.getElementById('sync_heart_status'),
  lung: document.getElementById('sync_lung_status'),
  filter: document.getElementById('sync_filter_status'),
  pill: document.getElementById('organ_sync_pill'),
};

const labTimelineEl = document.getElementById('lab_timeline');

const organCards = Array.from(document.querySelectorAll('.organ-card'));
let activeOrgan = organCards[0]?.dataset.organ || 'heart';

function randomBetween(min, max, fixed = 1) {
  return (Math.random() * (max - min) + min).toFixed(fixed);
}

function drawWave(canvas, points) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width = canvas.clientWidth;
  const height = canvas.height = canvas.clientHeight;
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = '#5df2d6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  points.forEach((val, idx) => {
    const x = (idx / (points.length - 1)) * width;
    const y = height - (val / 120) * height;
    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function updateVitals() {
  if (!vitalsEl.hr) return;
  const hr = Math.floor(Math.random() * 15) + 70;
  const bpS = Math.floor(Math.random() * 10) + 112;
  const bpD = Math.floor(Math.random() * 8) + 70;
  const spo2 = Math.floor(Math.random() * 3) + 97;
  const temp = randomBetween(36.5, 37.2);

  window.hfVitals = { hr, bpS, bpD, spo2, temp };

  vitalsEl.hr.textContent = hr;
  vitalsEl.bp.textContent = `${bpS}/${bpD}`;
  vitalsEl.spo2.textContent = `${spo2}%`;
  vitalsEl.temp.textContent = `${temp}°C`;
  if (sparkEls.hr) sparkEls.hr.textContent = `${hr} bpm`;
  if (sparkEls.bp) sparkEls.bp.textContent = `${bpS}/${bpD}`;
  if (sparkEls.spo2) sparkEls.spo2.textContent = `${spo2}%`;
  if (sparkEls.temp) sparkEls.temp.textContent = `${temp}°C`;
  if (tickerEls.hr) tickerEls.hr.textContent = `${hr} bpm`;
  if (tickerEls.bp) tickerEls.bp.textContent = `${bpS}/${bpD}`;
  if (tickerEls.appt) tickerEls.appt.textContent = Math.random() > 0.5 ? 'Today • 6:10 PM' : 'Tomorrow • 9:40 AM';
  if (tickerEls.lab) tickerEls.lab.textContent = `CBC • ${Math.random() > 0.5 ? 'Today' : 'Yesterday'}`;
  if (tickerEls.travel) tickerEls.travel.textContent = `Cab ETA ${Math.floor(Math.random() * 6) + 6}m`;
  if (organMeta.vitals.hr) organMeta.vitals.hr.textContent = `${hr} bpm`;
  if (organMeta.vitals.bp) organMeta.vitals.bp.textContent = `${bpS}/${bpD}`;
  if (organMeta.vitals.spo2) organMeta.vitals.spo2.textContent = `${spo2}%`;
  if (organMeta.vitals.heart) organMeta.vitals.heart.textContent = `${hr} bpm, ${bpS}/${bpD}`;
  if (organMeta.vitals.lung) organMeta.vitals.lung.textContent = `${spo2}% SpO₂, ${Math.floor(Math.random() * 4) + 14} rr`;
  if (vitalsEl.ai) {
    vitalsEl.ai.textContent = `Vitals steady. HR ${hr} bpm, BP ${bpS}/${bpD}, SpO₂ ${spo2}%. Stay hydrated.`;
  }
  if (sparkEls.pulse) {
    sparkEls.pulse.querySelectorAll('.pulse-bar').forEach((bar, idx) => {
      const heights = [hr, bpS, spo2, parseFloat(temp) * 10];
      bar.style.height = `${60 + (heights[idx] % 40)}px`;
    });
  }
  if (sparkEls.wave) {
    const points = Array.from({ length: 18 }, () => Math.floor(Math.random() * 40) + hr);
    drawWave(sparkEls.wave, points);
  }
  if (sparkEls.badge) {
    sparkEls.badge.textContent = spo2 < 96 ? 'Watch' : 'Stable';
  }
  syncLiteStatuses({ hr, spo2 });
  renderOrganStudio(activeOrgan);
  renderSyncMatrix();
}

// Engagement loop
const readinessProgress = document.getElementById('readiness_progress');
const readinessValue = document.getElementById('readiness_value');
const readinessHint = document.getElementById('readiness_hint');
const readinessBadge = document.getElementById('readiness_badge');
const checkinBtn = document.getElementById('checkin_btn');
const checkinMsg = document.getElementById('checkin_msg');
const missionList = document.getElementById('mission_list');
const missionShuffle = document.getElementById('mission_shuffle');
const coachFeed = document.getElementById('coach_feed');
const energyValue = document.getElementById('energy_value');
const energyHint = document.getElementById('energy_hint');
const moodValue = document.getElementById('mood_value');
const boostButton = document.getElementById('boost_button');
const recoveryBtn = document.getElementById('recovery_btn');
const sleepDebt = document.getElementById('sleep_debt');
const hrvSignal = document.getElementById('hrv_signal');
const restTimer = document.getElementById('rest_timer');

function setProgress(el, value) {
  if (!el) return;
  el.style.width = `${value}%`;
}

function renderReadiness(score = 72) {
  if (!readinessProgress || !readinessValue) return;
  setProgress(readinessProgress, score);
  readinessValue.textContent = `${score}%`;
  if (readinessHint) readinessHint.textContent = score > 85 ? 'You are balanced today' : 'Add water + a short walk';
  if (readinessBadge) readinessBadge.textContent = score > 80 ? 'Synced just now' : 'Needs attention';
}

function shuffleMissions() {
  if (!missionList) return;
  const items = Array.from(missionList.querySelectorAll('li'));
  items.forEach(item => {
    const bar = item.querySelector('.mini-progress span');
    const pct = Math.floor(Math.random() * 50) + 30;
    if (bar) bar.style.width = `${pct}%`;
  });
  items.sort(() => Math.random() - 0.5).forEach(item => missionList.appendChild(item));
}

function rotateFeed() {
  if (!coachFeed) return;
  const updates = [
    'Hydration up 12% after your last sip.',
    'SpO₂ steady. Consider a stretch.',
    'Sleep window looks good. Keep it.',
    'Balance movement and rest for the next hour.',
    'Save time: bundle lab pickup with your walk.',
  ];
  const feedItem = document.createElement('div');
  feedItem.className = 'feed-item';
  feedItem.textContent = updates[Math.floor(Math.random() * updates.length)];
  coachFeed.prepend(feedItem);
  if (coachFeed.children.length > 5) coachFeed.lastElementChild.remove();
}

function updateEnergy() {
  if (!energyValue || !energyHint) return;
  const value = Math.floor(Math.random() * 20) + 70;
  energyValue.textContent = `${value}%`;
  energyHint.textContent = value > 85 ? 'Best time to move' : 'Short break recommended';
  if (moodValue) moodValue.textContent = value > 82 ? 'Flow' : 'Calm';
}

function updateRecovery() {
  if (sleepDebt) sleepDebt.textContent = `${Math.floor(Math.random() * 40) - 20} min`;
  if (hrvSignal) hrvSignal.textContent = Math.random() > 0.7 ? 'Slight dip' : 'Stable';
  if (restTimer) restTimer.textContent = `${Math.floor(Math.random() * 25) + 10} min`;
}

function renderLabTimeline() {
  if (!labTimelineEl) return;
  const entries = [
    { when: 'Today', title: 'CBC balanced', note: 'HB steady, no infection signals.', state: 'good' },
    { when: 'Yesterday', title: 'LFT clear', note: 'Liver numbers in safe range.', state: 'info' },
    { when: 'Last week', title: 'Hydration dip', note: 'Added 1L reminder for the day.', state: 'warn' },
  ];
  labTimelineEl.innerHTML = '';
  entries.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="dot ${item.state}"></div>
      <div>
        <p class="muted">${item.when}</p>
        <strong>${item.title}</strong>
        <small>${item.note}</small>
      </div>`;
    labTimelineEl.appendChild(li);
  });
}

function syncLiteStatuses({ hr, spo2 }) {
  if (organSyncLite.heart) organSyncLite.heart.textContent = hr > 95 ? 'Pace calm down' : 'Calm rhythm';
  if (organSyncLite.lung) organSyncLite.lung.textContent = spo2 < 97 ? 'Breathe easy, sip water' : 'Smooth breath';
  if (organSyncLite.filter) organSyncLite.filter.textContent = hr > 100 ? 'Hydrate for kidneys' : 'Detox good';
  if (organSyncLite.pill) organSyncLite.pill.textContent = spo2 < 97 ? 'Syncing' : 'Synced';
}

checkinBtn?.addEventListener('click', () => {
  const current = parseInt(readinessValue?.textContent || '70', 10) || 70;
  const next = Math.min(100, current + 6);
  renderReadiness(next);
  if (checkinMsg) checkinMsg.textContent = 'Check-in logged. We will nudge only if balance slips.';
});

missionShuffle?.addEventListener('click', shuffleMissions);
boostButton?.addEventListener('click', () => {
  updateEnergy();
  if (checkinMsg) checkinMsg.textContent = 'Coach adjusted your next step.';
});

recoveryBtn?.addEventListener('click', () => {
  updateRecovery();
  if (checkinMsg) checkinMsg.textContent = 'Wind-down started with softer reminders.';
});

askAIButton?.addEventListener('click', () => {
  if (vitalsEl.ai) {
    vitalsEl.ai.textContent = 'AI Guardian: HR, BP, and SpO₂ look steady. Keep sipping pani and stretch for 5 minutes.';
  }
});

renderReadiness();
shuffleMissions();
updateEnergy();
updateRecovery();
renderLabTimeline();
setInterval(() => renderReadiness(Math.floor(Math.random() * 20) + 70), 10000);
setInterval(rotateFeed, 15000);
setInterval(updateEnergy, 12000);
updateVitals();
setInterval(updateVitals, 4500);

// Blood & hydration
const bloodSignal = document.getElementById('blood_signal');
function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

const organModelMap = {
  heart: '3d_models/heart.glb',
  lungs: '3d_models/lungs.glb',
  liver: '3d_models/liver.glb',
  kidney: '3d_models/kidneys.glb',
  kidneys: '3d_models/kidneys.glb',
  brain: '3d_models/brain.glb',
  eye: '3d_models/eyes.glb',
  eyes: '3d_models/eyes.glb',
  cirrhotic_liver: '3d_models/cirrhotic_liver.glb',
};

const getOrganModel = (organKey) => organModelMap[organKey] || organModelMap.heart;

function setOrganStatus(key, value, tone = 'good') {
  const el = organStatusEls[key];
  if (!el) return;
  el.textContent = value;
  el.classList.remove('good', 'warn', 'danger');
  if (tone) el.classList.add(tone);
}

const organLibrary = {
  heart: {
    title: 'Heart perfusion studio',
    summary: 'Cardiac markers steady',
    lab: 'Lipids + troponin mirrored',
    next: '10 min walk today',
    model: getOrganModel('heart'),
  },
  lungs: {
    title: 'Lung capacity studio',
    summary: 'Breath cycle relaxed',
    lab: 'Spirometry + SpO₂ live',
    next: 'Pursed lip breathing',
    model: getOrganModel('lungs'),
  },
  liver: {
    title: 'Liver metabolism studio',
    summary: 'Detox trend steady',
    lab: 'LFT mirrored',
    next: 'Low oil meals',
    model: getOrganModel('liver'),
  },
  cirrhotic_liver: {
    title: 'Cirrhotic liver studio',
    summary: 'Fibrosis staging mirrored',
    lab: 'LFT + fibrosis panel',
    next: 'Review hepatology notes',
    model: getOrganModel('cirrhotic_liver'),
  },
  kidney: {
    title: 'Renal hydration studio',
    summary: 'Hydration in watch',
    lab: 'KFT + CUE mirrored',
    next: 'Sip 500 ml water',
    model: getOrganModel('kidney'),
  },
  brain: {
    title: 'Brain & focus studio',
    summary: 'Cognitive calm',
    lab: 'Sleep + stress map',
    next: 'Screen break 10m',
    model: getOrganModel('brain'),
  },
  dental: {
    title: 'Dental & jaw studio',
    summary: 'CBCT clean',
    lab: 'Gum health mirrored',
    next: 'Floss reminder',
    model: getOrganModel('heart'),
  },
  vascular: {
    title: 'Vascular flow studio',
    summary: 'Circulation steady',
    lab: 'BP + perfusion',
    next: 'Shoulder roll x5',
    model: getOrganModel('heart'),
  },
  endocrine: {
    title: 'Endocrine balance studio',
    summary: 'Hormone rhythm balanced',
    lab: 'HbA1c + thyroid',
    next: 'Protein-rich snack',
    model: getOrganModel('liver'),
  },
  immune: {
    title: 'Immune calm studio',
    summary: 'Inflammation low',
    lab: 'CRP + WBC mirrored',
    next: 'Rest & fluids',
    model: getOrganModel('heart'),
  },
  musculoskeletal: {
    title: 'Musculoskeletal studio',
    summary: 'Mobility steady',
    lab: 'DEXA + pain diary',
    next: 'Stretch hamstrings',
    model: getOrganModel('heart'),
  },
  gi: {
    title: 'Gut & GIT studio',
    summary: 'Digestive calm',
    lab: 'CUE + abdomen sync',
    next: 'Hydrate before meals',
    model: getOrganModel('liver'),
  },
  pancreas: {
    title: 'Pancreas studio',
    summary: 'Glucose handling',
    lab: 'HbA1c mirrored',
    next: 'Walk after meals',
    model: getOrganModel('liver'),
  },
  spleen: {
    title: 'Spleen & lymph studio',
    summary: 'Immune buffering',
    lab: 'CBC linked',
    next: 'Check CBC in labs',
    model: getOrganModel('heart'),
  },
  reproductive: {
    title: 'Reproductive studio',
    summary: 'Pelvic scan steady',
    lab: 'Hormones mirrored',
    next: 'Track cycle/PSA',
    model: getOrganModel('heart'),
  },
  skin: {
    title: 'Skin barrier studio',
    summary: 'Hydration linked',
    lab: 'Allergy watch',
    next: 'Moisturise now',
    model: getOrganModel('heart'),
  },
  eye: {
    title: 'Eye strain studio',
    summary: 'Vision guarded',
    lab: 'Fundoscopy sync',
    next: '20-20-20 break',
    model: getOrganModel('eye'),
  },
  ear: {
    title: 'Ear & balance studio',
    summary: 'Hearing stable',
    lab: 'Audiogram sync',
    next: 'Volume under 60%',
    model: getOrganModel('heart'),
  },
  bladder: {
    title: 'Bladder & UTI studio',
    summary: 'Hydration linked',
    lab: 'CUE mirrored',
    next: 'Water + frequent voids',
    model: getOrganModel('kidney'),
  },
};

function setModelSource(src) {
  if (!organStudioEls.model) return;
  const fallback = organStudioEls.model.dataset.fallback;
  organStudioEls.model.src = src || fallback || organStudioEls.model.getAttribute('src');
  organStudioEls.model.addEventListener('error', () => {
    if (fallback && organStudioEls.model.src !== fallback) {
      organStudioEls.model.src = fallback;
    }
  });
}

function renderOrganStudio(organKey = activeOrgan) {
  const config = organLibrary[organKey] || organLibrary.heart;
  const status = organStatusEls[organKey]?.textContent || 'Steady';
  const state = document.getElementById(`${organKey}_state`)?.textContent || config.summary || 'Synced';
  const vitals = organMeta.vitals.heart?.textContent || '—';
  const blendedVitals = organMeta.vitals[organKey]?.textContent || vitals;

  if (organStudioEls.title) organStudioEls.title.textContent = config.title;
  if (organStudioEls.summary) organStudioEls.summary.textContent = state;
  if (organStudioEls.lab) organStudioEls.lab.textContent = config.lab || 'Labs mirrored from dashboard';
  if (organStudioEls.vitals) organStudioEls.vitals.textContent = blendedVitals || 'Vitals syncing';
  if (organStudioEls.next) organStudioEls.next.textContent = config.next || 'Follow dashboard plan';
  if (organStudioEls.sync) organStudioEls.sync.textContent = 'Dashboard · Health · Labs · Vitals · Pharmacy · Hospitals';
  if (organStudioEls.status) {
    organStudioEls.status.textContent = status;
    organStudioEls.status.className = 'pill';
    organStudioEls.status.classList.add(status.toLowerCase().includes('alert') ? 'warn' : 'good');
  }
  setModelSource(config.model);
}

function renderSyncMatrix() {
  if (!organSyncEls.dashboard && !organSyncEls.pill) return;
  const alerts = organAlertBadge ? parseInt(organAlertBadge.textContent, 10) || 0 : 0;
  if (organSyncEls.dashboard) organSyncEls.dashboard.textContent = alerts ? `${alerts} alert mirror` : 'Ready';
  if (organSyncEls.health) organSyncEls.health.textContent = readinessValue ? `${readinessValue.textContent} readiness` : 'Stable';
  if (organSyncEls.labs) organSyncEls.labs.textContent = organMeta.lab.name?.textContent || 'Awaiting sync';
  if (organSyncEls.vitals) organSyncEls.vitals.textContent = organMeta.vitals.bp?.textContent ? `BP ${organMeta.vitals.bp.textContent}` : 'Live';
  if (organSyncEls.pharmacy) organSyncEls.pharmacy.textContent = 'Meds mirrored to pharmacy';
  if (organSyncEls.hospitals) organSyncEls.hospitals.textContent = 'Consult escalation off';
  if (organSyncEls.pill) organSyncEls.pill.textContent = alerts ? 'Attention' : 'Synced';
  if (organSyncEls.notice) organSyncEls.notice.textContent = alerts ? 'Alerts mirrored to dashboard, hospitals, and pharmacy.' : 'All organ signals are mirrored to dashboard and consults.';
}

organCards.forEach(card => {
  card.addEventListener('click', () => {
    organCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    activeOrgan = card.dataset.organ;
    renderOrganStudio(activeOrgan);
  });
});

function getLabSnapshot() {
  const raw = localStorage.getItem('lab-dashboard-latest');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

function panelsFromSnapshot() {
  const snap = getLabSnapshot();
  if (snap?.latestPanels) return snap.latestPanels;
  return null;
}

function describeMarker(rep, fallback = '—') {
  if (!rep) return fallback;
  const val = rep.value !== undefined ? rep.value : rep.impression;
  const unit = rep.unit || '';
  const status = rep.status ? ` (${rep.status})` : '';
  return `${val || fallback} ${unit}`.trim() + status;
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
const labTimeline = document.getElementById('lab_timeline');

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
  const snapshotPanels = panelsFromSnapshot();
  if (snapshotPanels) Object.assign(labs, snapshotPanels);

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

function renderLabTimeline() {
  if (!labTimeline) return;
  const snap = getLabSnapshot();
  const history = snap?.history && snap.history.length ? snap.history : [
    {
      date: '2024-07-05 08:00',
      title: 'CBC + Hydration check',
      lab: 'Apollo Diagnostics',
      doctor: 'Dr. Vasudha Nene',
      status: 'Hydrate & recheck',
      markers: [
        { name: 'HB', value: '12.8 g/dL', status: 'Borderline' },
        { name: 'WBC', value: '7.9k', status: 'Watch infection' },
        { name: 'Platelets', value: '2.5 L', status: 'Normal' },
      ],
      note: 'Looks mildly dry. ORS 500 ml today, repeat CBC in 72h.',
      next: ['ORS 500ml', 'Repeat CBC in 3 days'],
    },
  ];

  labTimeline.innerHTML = '';
  history.forEach(item => {
    const card = document.createElement('div');
    card.className = 'timeline-card';
    const head = document.createElement('div');
    head.className = 'head';
    head.innerHTML = `<div><strong>${item.title}</strong><div class="meta">${item.lab || 'Synced lab'} • ${item.doctor || 'Doctor lens'} • ${item.status || ''}</div></div><span class="chip">${item.date}</span>`;
    const markers = document.createElement('div');
    markers.className = 'markers';
    (item.markers || []).forEach(m => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = `${m.name}: ${m.value} (${m.status || ''})`;
      markers.appendChild(chip);
    });
    const note = document.createElement('div');
    note.className = 'notice';
    note.textContent = item.note || 'Doctor note pending.';
    const next = document.createElement('div');
    next.className = 'next';
    (item.next || ['Prep ready']).forEach(n => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = n;
      next.appendChild(chip);
    });
    card.append(head, markers, note, next);
    labTimeline.appendChild(card);
  });
}

renderLabTimeline();
setInterval(renderLabTimeline, 12000);
setInterval(renderReportShelves, 12000);

const fallbackReports = [
  { name: 'CBC + Hydration check', lab: 'Apollo Diagnostics', doctor: 'Dr. Vasudha Nene', status: 'Ready', date: '2024-07-05 08:00', pdf: 'assets/reports/lab-report.pdf', type: 'blood', ai: 'Hydration low — repeat in 72h.' },
  { name: 'LFT + KFT follow-up', lab: 'Fortis Lab', doctor: 'Dr. Niyati Rao', status: 'Stable', date: '2024-06-26 10:00', pdf: 'assets/reports/lab-report.pdf', type: 'blood', ai: 'Values steady. Avoid fried food.' },
  { name: 'Ultrasound Abdomen', lab: 'Max Lab', doctor: 'Radiology desk', status: 'Clear', date: '2024-06-20 09:00', pdf: 'assets/reports/imaging-report.pdf', type: 'imaging', ai: 'No acute findings.' }
];

function renderReportShelves() {
  if (!healthReportShelf && !profileReportShelf) return;
  const snap = getLabSnapshot();
  const reports = snap?.reports && snap.reports.length ? snap.reports : fallbackReports;
  const shelves = [healthReportShelf, profileReportShelf].filter(Boolean);
  shelves.forEach(el => {
    el.innerHTML = '';
    reports.slice(0, 6).forEach(rep => {
      const card = document.createElement('div');
      card.className = 'report-card';
      const head = document.createElement('div');
      head.innerHTML = `<h4>${rep.name}</h4><div class="report-meta"><span>${rep.lab}</span><span>${rep.doctor || 'Doctor lens'}</span><span>${rep.status || 'Ready'}</span><span>${new Date(rep.date).toLocaleString()}</span></div>`;
      const tags = document.createElement('div');
      tags.className = 'report-tags';
      ['PDF ready', rep.type === 'imaging' ? 'Imaging' : 'Blood', 'Mirrors to dashboard'].forEach(t => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = t;
        tags.appendChild(chip);
      });
      const ai = document.createElement('div');
      ai.className = 'report-ai';
      ai.textContent = rep.ai || 'Doctor review pending.';
      const actions = document.createElement('div');
      actions.className = 'report-actions';
      const pdfBtn = document.createElement('a');
      pdfBtn.className = 'badge';
      pdfBtn.href = rep.pdf;
      pdfBtn.target = '_blank';
      pdfBtn.rel = 'noopener';
      pdfBtn.textContent = 'View PDF';
      const share = document.createElement('a');
      share.className = 'badge';
      share.href = `https://wa.me/?text=${encodeURIComponent(`Lab report: ${rep.name}\n${rep.lab}\nStatus: ${rep.status}\nPDF: ${location.origin}/${rep.pdf}`)}`;
      share.target = '_blank';
      share.rel = 'noopener';
      share.textContent = 'Share';
      actions.append(pdfBtn, share);
      card.append(head, tags, ai, actions);
      el.appendChild(card);
    });
  });
}

renderReportShelves();

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
  const labSnap = getLabSnapshot();
  const bloodReports = labSnap?.bloodReports || [];
  const imagingReports = labSnap?.imagingReports || [];

  const findReport = (needle) => bloodReports.find(rep => rep.name?.toLowerCase().includes(needle));
  const kidneyRep = findReport('kidney');
  const liverRep = findReport('liver');
  const hba1cRep = findReport('hba1c');
  const lipidRep = findReport('lipid');
  const thyroidRep = findReport('thyroid');
  const cbcRep = findReport('complete blood count');
  const crpRep = findReport('crp');
  const abdomenImg = imagingReports.find(rep => rep.name?.toLowerCase().includes('abdomen'));
  const lungImg = imagingReports.find(rep => rep.name?.toLowerCase().includes('chest'));
  const pelvisImg = imagingReports.find(rep => rep.name?.toLowerCase().includes('pelvis') || rep.name?.toLowerCase().includes('prostate'));

  const vitals = window.hfVitals || {};
  const bpHigh = vitals.bpS && vitals.bpS > 125;

  if (hydrationLow || (kidneyRep && kidneyRep.status && kidneyRep.status !== 'normal')) {
    setOrganStatus('kidney', hydrationLow ? 'Dry' : 'Load', hydrationLow ? 'warn' : 'warn');
    alerts.push({ type: 'warn', message: 'Hydration low — kidneys need water support.' });
  } else {
    setOrganStatus('kidney', 'Hydrated', 'good');
  }
  setText('kidney_markers', describeMarker(kidneyRep, 'No recent KFT'));

  if (lungTight || (lungImg && lungImg.status !== 'clear')) {
    setOrganStatus('lungs', 'Tight', 'danger');
    alerts.push({ type: 'danger', message: 'Spirometry tight. Practice pursed lip breathing.' });
  } else {
    setOrganStatus('lungs', 'Free', 'good');
  }
  setText('lung_vitals', organMeta.vitals.lung?.textContent || 'Synced');

  if (liverRep && liverRep.status && liverRep.status !== 'normal') {
    setOrganStatus('liver', 'Loaded', 'warn');
    alerts.push({ type: 'warn', message: 'LFT slightly up — avoid fried food and repeat.' });
  } else {
    setOrganStatus('liver', 'Healthy', 'good');
  }
  setText('liver_markers', describeMarker(liverRep, 'No recent LFT'));

  if (crpRep && crpRep.status && crpRep.status !== 'normal') {
    setOrganStatus('immune', 'Alert', 'warn');
    setOrganStatus('spleen', 'Overworking', 'warn');
    alerts.push({ type: 'warn', message: 'Inflammation up — rest and hydrate.' });
  } else {
    setOrganStatus('immune', 'Calm', 'good');
    setOrganStatus('spleen', 'Clear', 'good');
  }
  setText('immune_state', describeMarker(crpRep, 'CRP calm'));
  setText('spleen_state', describeMarker(cbcRep, 'CBC balanced'));

  if (hba1cRep && hba1cRep.status && hba1cRep.status !== 'normal') {
    setOrganStatus('endocrine', 'Glucose load', 'warn');
    setOrganStatus('pancreas', 'Glucose load', 'warn');
  } else if (thyroidRep && thyroidRep.status && thyroidRep.status !== 'normal') {
    setOrganStatus('endocrine', 'Thyroid watch', 'warn');
    setOrganStatus('pancreas', 'Balance', 'good');
  } else {
    setOrganStatus('endocrine', 'Balanced', 'good');
    setOrganStatus('pancreas', 'Steady', 'good');
  }
  setText('endocrine_state', `${describeMarker(hba1cRep, 'HbA1c pending')} • ${describeMarker(thyroidRep, 'Thyroid steady')}`);
  setText('pancreas_state', describeMarker(hba1cRep, 'Digestive enzymes steady'));

  if (lipidRep && lipidRep.status && lipidRep.status !== 'normal') {
    setOrganStatus('heart', 'Elevated risk', 'warn');
    alerts.push({ type: 'warn', message: 'Lipids up — move 15 minutes today.' });
  } else {
    setOrganStatus('heart', 'Good', 'good');
  }
  setText('heart_vitals', organMeta.vitals.heart?.textContent || 'Synced');

  if (bpHigh) {
    setOrganStatus('vascular', 'Elevated', 'warn');
    alerts.push({ type: 'warn', message: 'BP trending high — relax shoulders and breathe out.' });
  } else {
    setOrganStatus('vascular', 'Open', 'good');
  }
  setText('vascular_state', vitals.bpS ? `${vitals.bpS}/${vitals.bpD}` : 'Syncing...');

  if (abdomenImg && abdomenImg.status === 'follow-up') {
    setOrganStatus('gi', 'Follow-up', 'warn');
    alerts.push({ type: 'warn', message: 'Abdomen imaging flagged for review.' });
  } else {
    setOrganStatus('gi', 'Smooth', 'good');
  }
  setText('gi_state', describeMarker(abdomenImg, 'Hydration + nutrition synced'));

  if (pelvisImg && pelvisImg.status === 'follow-up') {
    setOrganStatus('reproductive', 'Review', 'warn');
  } else {
    setOrganStatus('reproductive', 'Clear', 'good');
  }
  setText('reproductive_state', describeMarker(pelvisImg, 'No scan alerts'));

  setOrganStatus('brain', 'Calm', 'good');
  setText('brain_state', 'Balanced focus');

  setOrganStatus('dental', 'Bright', 'good');
  setText('dental_state', 'CBCT clear');

  if (hydrationLow) {
    setOrganStatus('skin', 'Dry', 'warn');
    setOrganStatus('eye', 'Tired', 'warn');
    setOrganStatus('bladder', 'Concentrated', 'warn');
  } else {
    setOrganStatus('skin', 'Calm', 'good');
    setOrganStatus('eye', 'Focused', 'good');
    setOrganStatus('bladder', 'Clear', 'good');
  }
  setText('skin_state', hydrationLow ? 'Moisturise + hydrate' : 'Barrier intact');
  setText('eye_state', 'Blue light guard on');
  setOrganStatus('ear', 'Clear', 'good');
  setText('ear_state', 'No vertigo signals');
  setOrganStatus('musculoskeletal', 'Supple', 'good');
  setText('msk_state', 'Dexa + mobility stable');
  setText('bladder_state', hydrationLow ? 'Hydration low — increase intake' : 'Hydration adequate');

  if (labSnap) {
    if (organMeta.lab.name) organMeta.lab.name.textContent = labSnap.lab || 'Synced lab';
    if (organMeta.lab.updated) organMeta.lab.updated.textContent = `Updated ${new Date(labSnap.updated || Date.now()).toLocaleString()}`;
    setText('sync_creatinine', describeMarker(findReport('creatinine'), '—'));
    setText('sync_urea', describeMarker(findReport('urea'), '—'));
    setText('sync_lft', describeMarker(liverRep, '—'));
    setText('sync_crp', describeMarker(crpRep, '—'));
    setText('sync_metabolic', describeMarker(hba1cRep || lipidRep, '—'));
    setText('sync_thyroid', describeMarker(thyroidRep, '—'));
    setText('sync_cbc', describeMarker(cbcRep, '—'));
    setText('sync_imaging', describeMarker(lungImg || abdomenImg || pelvisImg, 'All clear'));
  } else {
    if (organMeta.lab.name) organMeta.lab.name.textContent = 'No lab synced';
    if (organMeta.lab.updated) organMeta.lab.updated.textContent = 'Use Labs → Sync to push reports here.';
  }

  renderAlerts(alerts);
  renderOrganStudio(activeOrgan);
  renderSyncMatrix();
}

const refreshLabSync = document.getElementById('refresh_lab_sync');
refreshLabSync?.addEventListener('click', evaluateOrgans);

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

// Insurance reimbursement desk
const claimForm = document.getElementById('hf_reimburse_form');
const statusList = document.getElementById('claim_status_list');
const claimNotice = document.getElementById('claim_notice');
const claimIntimationId = document.getElementById('claim_intimation_id');
const approvalBadge = document.getElementById('approval_badge');
const expectedAmountEl = document.getElementById('expected_amount');
const approvalProbabilityEl = document.getElementById('approval_probability');
const nextActionEl = document.getElementById('next_action');
const guidanceList = document.getElementById('guidance_list');
const guidanceFeed = document.getElementById('guidance_feed');
const guidanceRefresh = document.getElementById('refresh_guidance');
const supportToggle = document.getElementById('hfSupportToggle');
const uploadInput = document.getElementById('record_upload');
const uploadHint = document.getElementById('upload_hint');
const hospitalSelect = document.getElementById('hospital_select');
const hospitalFillButtons = document.querySelectorAll('[data-hospital-fill]');
const coverageForm = document.getElementById('coverage_form');
const coverageBaseDocs = document.getElementById('coverage_base_docs');
const coverageFullDocs = document.getElementById('coverage_full_docs');
const coverageAccuracy = document.getElementById('coverage_accuracy');
const coverageAccuracyHint = document.getElementById('coverage_accuracy_hint');
const coverageAmount = document.getElementById('coverage_amount');
const coverageNotification = document.getElementById('coverage_notification');
const coverageMeta = document.getElementById('coverage_meta');
const coverageEta = document.getElementById('coverage_eta');

function generateIntimation() {
  return `HF-${Math.floor(Math.random() * 90000) + 10000}`;
}

function renderStatusItems(items = []) {
  if (!statusList) return;
  statusList.innerHTML = '';
  items.forEach(item => {
    const row = document.createElement('div');
    row.className = 'item';
    const text = document.createElement('div');
    text.innerHTML = `<strong>${item.title}</strong><div class="meta">${item.meta}</div>`;
    const badge = document.createElement('span');
    badge.className = `badge ${item.tone || ''}`;
    badge.textContent = item.badge;
    row.append(text, badge);
    statusList.appendChild(row);
  });
}

function setEstimator(amount, probability, next) {
  if (expectedAmountEl) expectedAmountEl.textContent = amount;
  if (approvalProbabilityEl) approvalProbabilityEl.textContent = probability;
  if (nextActionEl) nextActionEl.textContent = next;
  if (approvalBadge) approvalBadge.textContent = probability.includes('%') ? 'In review' : 'Pending';
}

function pushGuidance(items = []) {
  if (!guidanceList) return;
  guidanceList.innerHTML = '';
  items.forEach(msg => {
    const li = document.createElement('li');
    li.textContent = msg;
    guidanceList.appendChild(li);
  });
}

function hydrateReimbursement(payload) {
  const intimation = generateIntimation();
  if (claimIntimationId) claimIntimationId.textContent = `Intimation: ${intimation}`;
  const baseAmount = Math.floor(Math.random() * 40000) + 60000;
  const probability = `${Math.floor(Math.random() * 18) + 78}%`;
  renderStatusItems([
    {
      title: `Claim filed for ${payload.hospital}`,
      meta: `${payload.area} · ${payload.type} · Linked via ${payload.sync}`,
      badge: 'Filed',
      tone: 'success',
    },
    {
      title: 'Claim intimation shared with insurer/TPA',
      meta: `Number ${intimation} · Awaiting document check`,
      badge: 'Intimated',
    },
    {
      title: 'Document guidance issued',
      meta: 'Upload discharge summary, itemized bills, prescriptions. Corrections auto-highlighted.',
      badge: 'Notify',
      tone: 'warn',
    },
    {
      title: 'Dispatch approval window',
      meta: 'HealthFlo predicts approval with expected settlement shared below.',
      badge: 'Review',
    },
    {
      title: 'Insurer follow-up in progress',
      meta: 'Settlement / query / rejection will be mirrored to dashboard + family.',
      badge: 'Chasing',
      tone: 'success',
    },
  ]);

  const next = payload.sync.includes('Outside') ? 'Upload external bills' : 'Awaiting insurer query response';
  setEstimator(`₹${baseAmount.toLocaleString('en-IN')}`, probability, next);
  if (claimNotice) {
    claimNotice.textContent = 'HealthFlo is updating intimations, document corrections, dispatch approval, and insurer queries in real time.';
  }
  pushGuidance([
    'Upload PDFs or images of bills and lab/OT charges.',
    `Verify admission address: ${payload.address}`,
    'Respond to insurer queries within 4 hours for faster settlement.',
    'Share QR / User ID at hospital, labs, and pharmacies for auto-sync.',
  ]);
}

function setHospitalFields(name, area, address) {
  const hospitalName = document.getElementById('hospital_name');
  const hospitalArea = document.getElementById('hospital_area');
  const hospitalAddress = document.getElementById('hospital_address');
  if (hospitalName) hospitalName.value = name || '';
  if (hospitalArea) hospitalArea.value = area || '';
  if (hospitalAddress) hospitalAddress.value = address || '';
}

function computeCoverageEstimate() {
  const baseCount = coverageBaseDocs?.files?.length || 0;
  const fullCount = coverageFullDocs?.files?.length || 0;
  const admissionType = document.getElementById('coverage_admission')?.value || 'IP admission';
  let accuracy = baseCount ? 70 : 40;
  let hint = 'Upload hospitalization bills for a quick 70% analysis.';
  if (baseCount && fullCount) {
    accuracy = 95;
    hint = 'Full dossier received — we will run a 95% accuracy estimate.';
  }
  const projected = Math.max(65000, (baseCount + fullCount) * 18000 + 60000);
  const eta = 'ETA: 30 min';

  if (coverageAccuracy) coverageAccuracy.textContent = `${accuracy}%`;
  if (coverageAccuracyHint) coverageAccuracyHint.textContent = hint;
  if (coverageAmount) coverageAmount.textContent = `₹${projected.toLocaleString('en-IN')}`;
  if (coverageNotification) coverageNotification.textContent = 'You will get an in-app + SMS notification';
  if (coverageMeta) coverageMeta.textContent = `${eta} · Includes ${admissionType} benefits and exclusions.`;
  if (coverageEta) coverageEta.textContent = eta;
}

claimForm?.addEventListener('submit', event => {
  event.preventDefault();
  const payload = {
    hospital: document.getElementById('hospital_name')?.value || 'Hospital',
    area: document.getElementById('hospital_area')?.value || 'Area',
    address: document.getElementById('hospital_address')?.value || 'Address',
    type: document.getElementById('claim_type')?.value || 'Reimbursement',
    sync: document.getElementById('sync_source')?.value || 'Admission booked in HealthFlo',
  };

  hydrateReimbursement(payload);
});

hospitalSelect?.addEventListener('change', event => {
  const name = event.target.value;
  if (!name) return;
  const presets = {
    'Apollo Bannerghatta': { area: 'Bannerghatta', address: '15th Cross, Bengaluru 560076' },
    'Fortis MG Road': { area: 'MG Road', address: 'Ward 2, Bengaluru 560001' },
    'Rainbow Hospitals': { area: 'Kondapur', address: 'Plot 22, Hyderabad' },
    'Medicover Hitech City': { area: 'Hitech City', address: 'Plot 44, Hyderabad 500081' },
    'Manipal Yeshwanthpur': { area: 'Yeshwanthpur', address: 'Ring Road, Bengaluru 560022' },
  };
  const preset = presets[name] || {};
  setHospitalFields(name, preset.area, preset.address);
});

hospitalFillButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    try {
      const details = JSON.parse(btn.dataset.hospitalFill || '{}');
      setHospitalFields(details.name, details.area, details.address);
    } catch (err) {
      console.error('Unable to parse hospital details', err);
    }
  });
});

supportToggle?.addEventListener('click', () => {
  const isOn = supportToggle.textContent.includes('ON');
  supportToggle.textContent = `HealthFlo team support: ${isOn ? 'OFF' : 'ON'}`;
  if (claimNotice) claimNotice.textContent = isOn ? 'You are managing this claim manually.' : 'HealthFlo team actively managing reimbursement + follow-ups.';
});

guidanceRefresh?.addEventListener('click', () => {
  const tips = [
    'Attach pharmacy bills incurred outside HealthFlo to boost approval.',
    'Upload recent lab PDFs; we auto-tag Hb, LFT, KFT, and radiology codes.',
    'Confirm discharge date and attending doctor signature.',
    'Share live location for courier pickup of physical documents.',
  ];
  pushGuidance(tips.sort(() => 0.5 - Math.random()).slice(0, 3));
  if (guidanceFeed) guidanceFeed.textContent = 'Guidance refreshed from HealthFlo desk.';
});

uploadInput?.addEventListener('change', () => {
  const count = uploadInput.files?.length || 0;
  if (uploadHint) uploadHint.textContent = count ? `${count} document(s) staged for HealthFlo review.` : 'Add discharge summary, bills, lab reports, prescriptions.';
  setEstimator(`₹${(count * 12000 + 60000).toLocaleString('en-IN')}`, `${85 + Math.min(count, 3)}%`, count ? 'HealthFlo verifying uploads' : 'Add records');
});

coverageBaseDocs?.addEventListener('change', computeCoverageEstimate);
coverageFullDocs?.addEventListener('change', computeCoverageEstimate);

coverageForm?.addEventListener('submit', event => {
  event.preventDefault();
  computeCoverageEstimate();
  if (coverageNotification) coverageNotification.textContent = 'Results will be pushed in 30 minutes.';
});

// Seed default view if the desk is present
if (claimForm && !statusList?.children.length) {
  hydrateReimbursement({
    hospital: 'Rainbow Hospitals',
    area: 'Kondapur',
    address: 'Plot 22, Hyderabad',
    type: 'Reimbursement',
    sync: 'Admission booked in HealthFlo',
  });
}

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
