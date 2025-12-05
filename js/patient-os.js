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

// Engagement loop
const streakProgress = document.getElementById('streak_progress');
const streakValue = document.getElementById('streak_value');
const streakHint = document.getElementById('streak_hint');
const streakBadge = document.getElementById('streak_badge');
const checkinBtn = document.getElementById('checkin_btn');
const checkinMsg = document.getElementById('checkin_msg');
const ritualList = document.getElementById('ritual_list');
const ritualShuffle = document.getElementById('ritual_shuffle');
const dopamineFeed = document.getElementById('dopamine_feed');
const shareStreak = document.getElementById('share_streak');
const energyValue = document.getElementById('energy_value');
const energyHint = document.getElementById('energy_hint');
const moodValue = document.getElementById('mood_value');
const boostButton = document.getElementById('boost_button');

function setProgress(el, value) {
  if (!el) return;
  el.style.width = `${value}%`;
}

function renderStreak(progress = 72) {
  if (!streakProgress || !streakValue) return;
  setProgress(streakProgress, progress);
  streakValue.textContent = `${progress}%`;
  if (streakHint) streakHint.textContent = progress > 85 ? 'You are in the flow — 1 ritual left' : '3 rituals left today';
  if (streakBadge) streakBadge.textContent = `${Math.floor(progress / 6)} days 🔥`;
}

function shuffleRituals() {
  if (!ritualList) return;
  const items = Array.from(ritualList.querySelectorAll('li'));
  items.forEach(item => {
    const bar = item.querySelector('.mini-progress span');
    const pct = Math.floor(Math.random() * 60) + 30;
    if (bar) bar.style.width = `${pct}%`;
  });
  items.sort(() => Math.random() - 0.5).forEach(item => ritualList.appendChild(item));
}

function rotateFeed() {
  if (!dopamineFeed) return;
  const updates = [
    'Hydration up 12% after your last sip.',
    'SpO₂ steady. Keep the streak alive.',
    'Lungs need a stretch. Try box breathing.',
    'Night mode ready — prep for deep sleep.',
    'Guardian pushed a calm playlist for you.',
  ];
  const feedItem = document.createElement('div');
  feedItem.className = 'feed-item';
  feedItem.textContent = updates[Math.floor(Math.random() * updates.length)];
  dopamineFeed.prepend(feedItem);
  if (dopamineFeed.children.length > 4) dopamineFeed.lastElementChild.remove();
}

function updateEnergy() {
  if (!energyValue || !energyHint) return;
  const value = Math.floor(Math.random() * 20) + 70;
  energyValue.textContent = `${value}%`;
  energyHint.textContent = value > 85 ? 'Prime time — book your walk now' : 'Micro-boost ready';
  if (moodValue) moodValue.textContent = value > 82 ? 'Flow' : 'Calm';
}

checkinBtn?.addEventListener('click', () => {
  const next = Math.min(100, parseInt(streakValue?.textContent || '70', 10) + 8);
  renderStreak(next);
  if (checkinMsg) checkinMsg.textContent = 'Check-in logged. Dopamine drip extended by 4 hours.';
});

ritualShuffle?.addEventListener('click', shuffleRituals);
boostButton?.addEventListener('click', () => {
  updateEnergy();
  if (checkinMsg) checkinMsg.textContent = 'Focus boost applied. Mood stabilized.';
});

shareStreak?.addEventListener('click', () => {
  if (checkinMsg) checkinMsg.textContent = 'Link copied — flex your streak in family chat.';
});

renderStreak();
shuffleRituals();
updateEnergy();
setInterval(() => renderStreak(Math.floor(Math.random() * 25) + 65), 10000);
setInterval(rotateFeed, 15000);
setInterval(updateEnergy, 12000);

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
