/* HealthFlo — Hospitals OS card stack
   Loads providers.json + medicines.json + lab history into unified hospital cards
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
  {
    date: '2024-07-05',
    title: 'CBC + Hydration check',
    lab: 'Apollo Diagnostics',
    status: 'Hydrate & recheck',
  },
  {
    date: '2024-06-26',
    title: 'LFT + KFT follow-up',
    lab: 'Fortis Lab',
    status: 'Stable',
  },
  {
    date: '2024-06-14',
    title: 'Cardiac markers',
    lab: 'Max Lab',
    status: 'Calm',
  },
];

const DOC_NAMES = ['Aarav','Vivaan','Anaya','Rohan','Ira','Kabir','Myra','Advait','Kiara','Navya'];

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
  return pick(specs, 3).map((sp, idx) => ({
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

  const head = document.createElement('div');
  head.className = 'card-head';
  head.innerHTML = `
    <div>
      <h3 class="card-title">${h.name}</h3>
      <div class="meta">${h.type || 'Multi-speciality'} • ${h.address}</div>
      <div class="badges">
        <span class="badge">⭐ ${h.rating || '4.2'}</span>
        <span class="badge">${h.beds || '—'} beds</span>
        <span class="badge ${h.isCashless ? 'success' : 'warn'}">${h.isCashless ? 'Cashless ready' : 'Self-pay'}</span>
        <span class="badge">${h.specialties?.slice(0,3).join(', ')}</span>
      </div>
    </div>
    <button class="btn ghost" type="button">Share</button>
  `;
  head.querySelector('button')?.addEventListener('click', () =>
    toast(`Share link copied for ${h.name}`)
  );

  const body = document.createElement('div');
  body.className = 'card-body';

  const doctorBlock = document.createElement('div');
  doctorBlock.className = 'block';
  doctorBlock.innerHTML = '<h4>👨‍⚕️ Appointments</h4>';
  const docList = document.createElement('ul');
  buildDoctors(h.specialties).forEach((d) => {
    const li = document.createElement('li');
    li.innerHTML = `<div><strong>${d.name}</strong><br><small>${d.spec}</small></div><small>${d.slot}</small>`;
    docList.appendChild(li);
  });
  doctorBlock.appendChild(docList);
  const docBtn = document.createElement('button');
  docBtn.className = 'btn primary';
  docBtn.textContent = 'Book doctor';
  docBtn.addEventListener('click', () => toast(`Doctor booking sent to ${h.name}`));
  doctorBlock.appendChild(docBtn);

  const procBlock = document.createElement('div');
  procBlock.className = 'block';
  procBlock.innerHTML = '<h4>🏥 Procedures & surgeries</h4>';
  const procList = document.createElement('ul');
  buildProcedures(h.specialties).forEach((p) => {
    const li = document.createElement('li');
    li.innerHTML = `<div><strong>${p.name}</strong><br><small>Pre-auth & stay included</small></div><strong>${p.price}</strong>`;
    procList.appendChild(li);
  });
  procBlock.appendChild(procList);
  const procBtn = document.createElement('button');
  procBtn.className = 'btn primary';
  procBtn.textContent = 'Plan procedure';
  procBtn.addEventListener('click', () => toast(`Procedure enquiry queued for ${h.name}`));
  procBlock.appendChild(procBtn);

  const pharmBlock = document.createElement('div');
  pharmBlock.className = 'block';
  pharmBlock.innerHTML = '<h4>💊 Hospital pharmacy</h4>';
  const medList = document.createElement('ul');
  buildPharmacy(medsFlat).forEach((m) => {
    const li = document.createElement('li');
    li.innerHTML = `<div><strong>${m.name}</strong><br><small>${m.form}</small></div><strong>${m.price}</strong>`;
    medList.appendChild(li);
  });
  pharmBlock.appendChild(medList);
  const medBtn = document.createElement('button');
  medBtn.className = 'btn primary';
  medBtn.textContent = 'Order medicines';
  medBtn.addEventListener('click', () => toast(`Prescription upload started for ${h.name}`));
  pharmBlock.appendChild(medBtn);

  const labBlock = document.createElement('div');
  labBlock.className = 'block';
  labBlock.innerHTML = '<h4>🧪 Lab reports</h4>';
  const labList = document.createElement('ul');
  LAB_HISTORY.forEach((l) => {
    const li = document.createElement('li');
    li.innerHTML = `<div><strong>${l.title}</strong><br><small>${l.date} • ${l.lab}</small></div><small>${l.status}</small>`;
    labList.appendChild(li);
  });
  labBlock.appendChild(labList);
  const labBtn = document.createElement('button');
  labBtn.className = 'btn primary';
  labBtn.textContent = 'Book lab slot';
  labBtn.addEventListener('click', () => toast(`Lab booking shared with ${h.name}`));
  labBlock.appendChild(labBtn);

  body.append(doctorBlock, procBlock, pharmBlock, labBlock);

  const actions = document.createElement('div');
  actions.className = 'actions';
  ['Doctor', 'Procedure', 'Pharmacy', 'Lab'].forEach((tag) => {
    const b = document.createElement('button');
    b.className = 'btn ghost';
    b.textContent = `${tag} quick book`;
    b.addEventListener('click', () => toast(`${tag} flow opened for ${h.name}`));
    actions.appendChild(b);
  });

  card.append(head, body, actions);
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

(async function init() {
  bindTheme();
  try {
    const [providerData, medsJson] = await Promise.all([
      loadJSON('providers.json'),
      loadJSON('medicines.json'),
    ]);

    const hospitals = providerData.flatMap((p) =>
      (p.hospitals || []).map((h) => ({ ...h, state: p.state }))
    );
    const medsFlat = (medsJson.categories || []).flatMap((c) => c.medicines || []);

    renderMetrics(hospitals);
    populateStateFilter(hospitals);
    renderGrid(hospitals, medsFlat);

    ['searchInput', 'stateFilter', 'cashlessFilter'].forEach((id) => {
      qs(`#${id}`)?.addEventListener('input', () => applyFilters(hospitals, medsFlat));
      qs(`#${id}`)?.addEventListener('change', () => applyFilters(hospitals, medsFlat));
    });
  } catch (err) {
    console.error(err);
    toast('Unable to load hospitals right now.');
  }
})();
