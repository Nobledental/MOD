/* HealthFlo — Hospitals OS card stack
   Minimal front cards + rich modal mapped to other pages
*/

const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const fmtINR = (n) => '₹' + Number(n || 0).toLocaleString('en-IN');

const PROC_MAP = {
  Cardiology: [
    ['Coronary Angiography', [12000, 24000]],
    ['Angioplasty (DES)', [120000, 210000]],
    ['Bypass Surgery (CABG)', [250000, 420000]],
  ],
  Neurology: [
    ['Stroke Package (72h)', [80000, 140000]],
    ['Brain MRI + Neuro consult', [8000, 14000]],
    ['Spine Decompression', [140000, 240000]],
  ],
  Orthopaedics: [
    ['ACL Reconstruction', [80000, 140000]],
    ['Total Knee Replacement', [180000, 260000]],
    ['Hip Replacement', [220000, 340000]],
  ],
  Oncology: [
    ['Chemotherapy Cycle', [18000, 42000]],
    ['Radiation (IMRT) 15 Fr', [120000, 220000]],
    ['Breast Conservation Surgery', [180000, 320000]],
  ],
  Gastroenterology: [
    ['Lap Cholecystectomy', [65000, 110000]],
    ['Endoscopy + Biopsy', [4500, 12000]],
    ['ERCP', [55000, 90000]],
  ],
  ENT: [
    ['Septoplasty', [45000, 90000]],
    ['Tonsillectomy', [35000, 70000]],
    ['FESS', [70000, 120000]],
  ],
  Urology: [
    ['TURP', [70000, 120000]],
    ['PCNL', [90000, 160000]],
    ['URS + Lithotripsy', [65000, 110000]],
  ],
  'General Surgery': [
    ['Hernia Repair (Lap)', [80000, 140000]],
    ['Appendectomy (Lap)', [65000, 110000]],
    ['Haemorrhoids (Stapler)', [70000, 120000]],
  ],
  Paediatrics: [
    ['Well Baby Package', [10000, 24000]],
    ['Paediatric Surgery Day Care', [60000, 120000]],
  ],
};

const LAB_HISTORY = [
  { date: '2024-07-05', title: 'CBC + Hydration check', lab: 'Apollo Diagnostics', status: 'Hydrate & recheck' },
  { date: '2024-06-26', title: 'LFT + KFT follow-up', lab: 'Fortis Lab', status: 'Stable' },
  { date: '2024-06-14', title: 'Cardiac markers', lab: 'Max Lab', status: 'Calm' },
];

const DOC_NAMES = ['Aarav', 'Vivaan', 'Anaya', 'Rohan', 'Ira', 'Kabir', 'Myra', 'Advait', 'Kiara', 'Navya'];

function toast(msg, ms = 2200) {
  const t = qs('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), ms);
}

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error('Failed to load ' + path);
  return res.json();
}

function pick(arr, n = 1) {
  const copy = [...arr];
  const out = [];
  while (out.length < Math.min(n, copy.length)) {
    const idx = Math.floor(Math.random() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function buildProcedures(specs = []) {
  const collected = [];
  specs.forEach((sp) => {
    if (PROC_MAP[sp]) collected.push(...PROC_MAP[sp]);
  });
  if (!collected.length) collected.push(['Day care package', [12000, 22000]]);
  return pick(collected, 4).map(([name, [lo, hi]]) => ({
    name,
    price: fmtINR(Math.round(lo + Math.random() * (hi - lo))),
  }));
}

function buildDoctors(specs = []) {
  return pick(specs.length ? specs : ['General Medicine'], 3).map((sp, idx) => ({
    name: `Dr. ${DOC_NAMES[idx % DOC_NAMES.length]}`,
    spec: sp,
    slot: ['09:45', '11:10', '12:40', '15:30', '17:15'][idx % 5],
  }));
}

function buildPharmacy(medsFlat) {
  return pick(medsFlat, 4).map((m) => ({
    name: m.brand,
    form: `${m.form} • ${m.strength || m.pack}`,
    price: fmtINR(m.price || m.mrp || 0),
  }));
}

function distanceFor(h) {
  if (typeof h.distance_km === 'number' && !isNaN(h.distance_km)) return Number(h.distance_km.toFixed(1));
  return Number((0.6 + Math.random() * 12).toFixed(1));
}

function renderMetrics(hospitals) {
  const states = new Set(hospitals.map((h) => h.state));
  const cashless = hospitals.filter((h) => h.isCashless).length;
  const avgRating = (hospitals.reduce((n, h) => n + (h.rating || 0), 0) / hospitals.length).toFixed(1);
  qs('#metricStates').textContent = states.size;
  qs('#metricHospitals').textContent = hospitals.length;
  qs('#metricCashless').textContent = cashless;
  qs('#metricRating').textContent = isNaN(avgRating) ? '—' : avgRating;
}

function createCard(h, medsFlat) {
  const card = document.createElement('article');
  card.className = 'hospital-card';
  const distance = distanceFor(h);
  card.innerHTML = `
    <div class="card-top">
      <h3 class="card-title">${h.name}</h3>
      <div class="card-meta">📍 ${distance} km</div>
    </div>
    <div class="card-actions">
      <button class="btn primary" type="button">View</button>
      <button class="btn emergency" type="button">Emergency</button>
    </div>
  `;

  card.addEventListener('click', () => openHospital(h, medsFlat, distance));
  const btns = card.querySelectorAll('button');
  btns[0]?.addEventListener('click', (e) => { e.stopPropagation(); openHospital(h, medsFlat, distance); });
  btns[1]?.addEventListener('click', (e) => {
    e.stopPropagation();
    toast('Connecting you to emergency desk…');
    setTimeout(() => window.open('tel:108', '_self'), 150);
  });
  return card;
}

function renderGrid(hospitals, medsFlat) {
  const grid = qs('#hospitalGrid');
  grid.innerHTML = '';
  if (!hospitals.length) {
    grid.innerHTML = '<div class="stat">No hospitals match your filters.</div>';
    return;
  }
  hospitals.forEach((h) => grid.appendChild(createCard(h, medsFlat)));
}

function applyFilters(allHospitals, medsFlat) {
  const q = qs('#searchInput').value.trim().toLowerCase();
  const state = qs('#stateFilter').value;
  const cashless = qs('#cashlessFilter').value;
  let list = allHospitals;
  if (state) list = list.filter((h) => h.state === state);
  if (cashless) list = list.filter((h) => String(!!h.isCashless) === cashless);
  if (q) {
    list = list.filter((h) => {
      const hay = [h.name, h.address, h.type, ...(h.specialties || [])].join(' ').toLowerCase();
      return hay.includes(q);
    });
  }
  renderGrid(list, medsFlat);
}

function populateStateFilter(hospitals) {
  const sel = qs('#stateFilter');
  const states = Array.from(new Set(hospitals.map((h) => h.state))).sort();
  sel.innerHTML = '<option value="">All states</option>' + states.map((s) => `<option value="${s}">${s}</option>`).join('');
}

function bindTheme() {
  const toggle = qs('#themeToggle');
  const html = document.documentElement;
  const saved = localStorage.getItem('hf_theme');
  if (saved) html.setAttribute('data-theme', saved);
  toggle?.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'vision' ? 'matte' : 'vision';
    html.setAttribute('data-theme', next);
    localStorage.setItem('hf_theme', next);
  });
}

function serviceRail(h, medsFlat) {
  const rail = qs('#serviceRail');
  rail.innerHTML = '';
  const distance = distanceFor(h);
  const cards = [
    { icon: '🩺', title: 'OPD', meta: 'Mon-Sat 9 AM - 7 PM', action: 'Book OPD', onClick: () => toast('OPD booking started') },
    { icon: '🛏️', title: 'IPD', meta: `${h.beds || 120}+ beds • Private & Shared`, action: 'Plan admission', onClick: () => toast('IPD admission team alerted') },
    { icon: '📱', title: 'Teleconsult', meta: 'Video / Audio', action: 'Start call', onClick: () => toast('Teleconsult link shared') },
    { icon: '💊', title: 'Pharmacy', meta: 'In-hospital + delivery', action: 'Map medicines', onClick: () => toast('Prescription mapped from pharmacy page') },
    { icon: '🧪', title: 'Lab', meta: 'Pathology • Radiology', action: 'Book lab', onClick: () => toast('Lab booking synced') },
    { icon: '🚑', title: 'Emergency', meta: `${distance} km • 24×7 desk`, action: 'Call ER', onClick: () => window.open('tel:108', '_self') },
  ];
  cards.forEach((c) => {
    const n = document.createElement('div');
    n.className = 'rail-card';
    n.innerHTML = `<h4>${c.icon} ${c.title}</h4><p>${c.meta}</p><button class="btn ghost" type="button">${c.action}</button>`;
    n.querySelector('button')?.addEventListener('click', c.onClick);
    rail.appendChild(n);
  });
}

function renderDoctors(h) {
  const wrap = qs('#doctorList');
  wrap.innerHTML = '';
  buildDoctors(h.specialties).forEach((d) => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.innerHTML = `<strong>${d.name}</strong><small>${d.spec}</small><small>${d.slot}</small>`;
    wrap.appendChild(chip);
  });
}

function renderProcedures(h) {
  const wrap = qs('#procedureList');
  wrap.innerHTML = '';
  buildProcedures(h.specialties).forEach((p) => {
    const li = document.createElement('div');
    li.className = 'list-item';
    li.innerHTML = `<div><strong>${p.name}</strong><br><span>Pre-auth • Stay included</span></div><strong>${p.price}</strong>`;
    wrap.appendChild(li);
  });
}

function renderMeds(medsFlat) {
  const wrap = qs('#medList');
  wrap.innerHTML = '';
  buildPharmacy(medsFlat).forEach((m) => {
    const li = document.createElement('div');
    li.className = 'list-item';
    li.innerHTML = `<div><strong>${m.name}</strong><br><span>${m.form}</span></div><strong>${m.price}</strong>`;
    wrap.appendChild(li);
  });
}

function renderLabs() {
  const wrap = qs('#labList');
  wrap.innerHTML = '';
  LAB_HISTORY.forEach((l) => {
    const li = document.createElement('div');
    li.className = 'list-item';
    li.innerHTML = `<div><strong>${l.title}</strong><br><span>${l.date} • ${l.lab}</span></div><span>${l.status}</span>`;
    wrap.appendChild(li);
  });
}

function gatherContext() {
  const ctx = [];
  const profile = (() => { try { return JSON.parse(localStorage.getItem('hf_profile') || 'null'); } catch { return null; } })();
  if (profile?.name) ctx.push({ title: 'Profile shared', detail: `${profile.name} • ${profile.city || 'City unknown'}` });

  const lastOrder = (() => { try { return JSON.parse(localStorage.getItem('hf-latest-order') || 'null'); } catch { return null; } })();
  if (lastOrder?.item) ctx.push({ title: 'Latest pharmacy order', detail: `${lastOrder.item} • ${lastOrder.total || ''}` });

  const labSync = (() => { try { return JSON.parse(localStorage.getItem('lab-dashboard-latest') || 'null'); } catch { return null; } })();
  if (labSync?.reports?.length) ctx.push({ title: 'Recent lab report', detail: labSync.reports[0].title || 'Report shared' });

  if (!ctx.length) ctx.push({ title: 'No synced context yet', detail: 'Bookings and records from other pages will appear here.' });
  return ctx;
}

function renderContext() {
  const wrap = qs('#contextGrid');
  wrap.innerHTML = '';
  gatherContext().forEach((c) => {
    const card = document.createElement('div');
    card.className = 'context-card';
    card.innerHTML = `<strong>${c.title}</strong><span>${c.detail}</span>`;
    wrap.appendChild(card);
  });
}

function openHospital(h, medsFlat, distance) {
  const modal = qs('#hospitalModal');
  qs('#modalTitle').textContent = h.name;
  qs('#modalCity').textContent = `${h.state || 'City'}`;
  qs('#modalDistance').textContent = `${distance} km away`;
  qs('#modalCashless').textContent = h.isCashless ? 'Cashless ready' : 'Self-pay';
  qs('#modalCashless').classList.toggle('pill', true);
  qs('#modalAddress').textContent = `${h.address || ''} • ${h.type || 'Multi-speciality'}`;

  const tagWrap = qs('#modalTags');
  tagWrap.innerHTML = '';
  (h.specialties || []).slice(0, 4).forEach((sp) => {
    const s = document.createElement('span');
    s.className = 'pill soft';
    s.textContent = sp;
    tagWrap.appendChild(s);
  });

  serviceRail(h, medsFlat);
  renderDoctors(h);
  renderProcedures(h);
  renderMeds(medsFlat);
  renderLabs();
  renderContext();

  qs('#bookDoctor').onclick = () => toast('Doctor booking mapped to appointment flow');
  qs('#bookProcedure').onclick = () => toast('Admission request sent with shared profile');
  qs('#orderMeds').onclick = () => toast('Pharmacy mapped to hospital desk');
  qs('#bookLab').onclick = () => toast('Lab / home visit shared with hospital');
  qs('#refreshContext').onclick = renderContext;
  qs('#modalShare').onclick = async () => {
    const url = location.href.split('#')[0] + `#${h.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast('Share link copied');
    } catch {
      toast('Copy failed. Use Ctrl/Cmd+C');
    }
  };
  qs('#modalClose').onclick = closeHospital;

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
}

function closeHospital() {
  const modal = qs('#hospitalModal');
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
}

(async function init() {
  bindTheme();
  try {
    const [providerData, medsJson] = await Promise.all([
      loadJSON('providers.json'),
      loadJSON('medicines.json'),
    ]);

    const hospitals = providerData.flatMap((p) => (p.hospitals || []).map((h) => ({ ...h, state: p.state })));
    const medsFlat = (medsJson.categories || []).flatMap((c) => c.medicines || []);

    renderMetrics(hospitals);
    populateStateFilter(hospitals);
    renderGrid(hospitals, medsFlat);

    ['searchInput', 'stateFilter', 'cashlessFilter'].forEach((id) => {
      qs(`#${id}`)?.addEventListener('input', () => applyFilters(hospitals, medsFlat));
      qs(`#${id}`)?.addEventListener('change', () => applyFilters(hospitals, medsFlat));
    });

    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeHospital(); });
    qs('#hospitalModal')?.addEventListener('click', (e) => { if (e.target.id === 'hospitalModal') closeHospital(); });
  } catch (err) {
    console.error(err);
    toast('Unable to load hospitals right now.');
  }
})();
