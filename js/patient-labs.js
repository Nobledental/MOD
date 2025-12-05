const el = id => document.getElementById(id);
    const fmt = n => `₹${Math.round(n).toLocaleString('en-IN')}`;
    const rand = (min,max) => Math.random()*(max-min)+min;

    const themeToggle = el('themeToggle');
    const labsGrid = el('labsGrid');
    const labsSkeleton = el('labsSkeleton');
    const labsEmpty = el('labsEmpty');
    const labCardTpl = el('labCardTpl');
    const testRowTpl = el('testRowTpl');
    const toast = el('toast');
    const clickSound = el('clickSound');

    const searchInput = el('searchInput');
    const cityFilter = el('cityFilter');
    const typeFilter = el('typeFilter');
    const homeToggle = el('homeToggle');
    const nearestToggle = el('nearestToggle');
    const locateBtn = el('locateBtn');
    const sortStatus = el('sortStatus');

    const visibleCount = el('visibleCount');
    const homeCount = el('homeCount');
    const radCount = el('radCount');
    const avgPrice = el('avgPrice');
    const sortMeta = el('sortMeta');
    const locationMeta = el('locationMeta');
    const homeFeeMeta = el('homeFeeMeta');
    const dashboardStatus = el('dashboardStatus');
    const dashboardSummary = el('dashboardSummary');
    const dashboardList = el('dashboardList');
    const offersStrip = el('offersStrip');
    const secondaryOffers = el('secondaryOffers');
    const bookLandingCta = el('bookLandingCta');
    const downloadLandingPdf = el('downloadLandingPdf');
    const downloadDashboardPdf = el('downloadDashboardPdf');
    const syncFromLatest = el('syncFromLatest');
    const bundleRow = el('bundleRow');
    const openFirstLab = el('openFirstLab');
    const showAllLabs = el('showAllLabs');

    const modal = el('labModal');
    const modalTitle = el('modalTitle');
    const modalLocation = el('modalLocation');
    const modalHome = el('modalHome');
    const modalDistance = el('modalDistance');
    const modalCounts = el('modalCounts');
    const modalLogo = el('modalLogo');
    const modalDirections = el('modalDirections');
    const modalCall = el('modalCall');
    const modalWA = el('modalWA');
    const modalClose = el('modalClose');
    const tabs = Array.from(document.querySelectorAll('.tabs button'));
    const panels = Array.from(document.querySelectorAll('.panel'));

    const bloodList = el('bloodList');
    const radList = el('radList');
    const bloodSearch = el('bloodSearch');
    const radSearch = el('radSearch');
    const bloodHomeToggle = el('bloodHomeToggle');
    const homeFeeText = el('homeFeeText');
    const bloodClear = el('bloodClear');
    const radClear = el('radClear');
    const bloodWA = el('bloodWA');
    const radWA = el('radWA');
    const bloodCount = el('bloodCount');
    const radCountEl = el('radCount');
    const bloodTotal = el('bloodTotal');
    const radTotal = el('radTotal');
    const bookSummary = el('bookSummary');
    const bookTotal = el('bookTotal');

    const bookDate = el('bookDate');
    const bookTime = el('bookTime');
    const bookName = el('bookName');
    const bookPhone = el('bookPhone');
    const bookCity = el('bookCity');
    const saveProfile = el('saveProfile');
    const clearProfile = el('clearProfile');
    const useProfile = el('useProfile');
    const profileName = el('profileName');
    const profilePhone = el('profilePhone');
    const profileCity = el('profileCity');
    const profileSort = el('profileSort');
    const bookConfirm = el('bookConfirm');

    const aboutTitle = el('aboutTitle');
    const aboutDesc = el('aboutDesc');
    const aboutContact = el('aboutContact');
    const reportBloodEl = el('reportBlood');
    const reportImagingEl = el('reportImaging');
    const reportTimeline = el('reportTimeline');
    const syncDashboard = el('syncDashboard');
    const reportMeta = el('reportMeta');
    const downloadPdfBtn = el('downloadPdf');

    let labs = [];
    let selections = new Map();
    let currentLab = null;
    let userLocation = null;
    let latestReportForPdf = getFallbackSnapshot();
    let lastResults = [];
    let bundlePresets = [];

    const baseBlood = [
      { name: 'Complete Blood Count', price: 480, why: 'Screens anemia, infection and platelet issues in one sweep.', unit:'g/dL', range:[12,16] },
      { name: 'Lipid Profile', price: 650, why: 'Maps cholesterol fractions to quantify heart risk.', unit:'mg/dL', range:[120,200] },
      { name: 'Liver Function Test', price: 720, why: 'Checks bilirubin and enzymes to flag liver stress early.', unit:'IU/L', range:[5,45] },
      { name: 'Kidney Function Test', price: 700, why: 'Creatinine + urea tell you how well the kidneys filter.', unit:'mg/dL', range:[0.6,1.2] },
      { name: 'HbA1c', price: 540, why: 'Average sugar of past 3 months, cornerstone for diabetes control.', unit:'%', range:[4.5,5.6] },
      { name: 'Thyroid Panel', price: 820, why: 'TSH/T3/T4 balance that controls energy, mood, and weight.', unit:'µIU/mL', range:[0.3,4.5] },
      { name: 'Vitamin D', price: 1100, why: 'Bone health, immunity, and mood regulation booster.', unit:'ng/mL', range:[30,70] },
      { name: 'Iron Studies', price: 900, why: 'Ferritin/iron/TIBC to spot deficiency or overload.', unit:'µg/dL', range:[60,170] },
      { name: 'CRP', price: 580, why: 'Inflammation flag that correlates with infection or heart risk.', unit:'mg/L', range:[0,5] },
      { name: 'Ferritin', price: 750, why: 'Iron store that dips before hemoglobin drops.', unit:'ng/mL', range:[20,250] }
    ];
    const baseRad = [
      { name: 'Chest X-Ray', price: 600, why: 'Screens lungs and heart silhouette for infections or fluid.', impression:'No active consolidation. Heart size normal.' },
      { name: 'Ultrasound Abdomen', price: 1800, why: 'Looks at liver, gall bladder, kidneys for stones or swellings.', impression:'Liver smooth, no gall stones. Kidneys normal size.' },
      { name: 'CT Brain', price: 4200, why: 'Fast stroke/bleed screening when every minute counts.', impression:'No hemorrhage. Ventricles symmetrical.' },
      { name: 'MRI Spine', price: 5500, why: 'Disc, nerve and soft-tissue clarity for back or neck pain.', impression:'Mild L4-L5 disc bulge without nerve compression.' },
      { name: 'Mammography', price: 2500, why: 'Detects early calcifications and lumps in breast tissue.', impression:'BI-RADS 2: benign-appearing calcifications.' },
      { name: 'DEXA Scan', price: 3000, why: 'Bone density score to understand fracture risk.', impression:'T-score -1.1 : Mild osteopenia, start supplements.' },
      { name: 'PET-CT', price: 11000, why: 'Whole-body metabolic scan to stage or monitor cancers.', impression:'No avid lesions beyond baseline.' },
      { name: 'USG Pelvis', price: 1600, why: 'Evaluates uterus/ovaries/prostate for structural changes.', impression:'Uterus normal size, no adnexal masses.' }
    ];

    const cityCoordinates = {
      Mumbai: { lat: 19.076, lng: 72.8777, areas: ['Andheri','Bandra','Powai','Dadar','Mulund'] },
      Delhi: { lat: 28.6139, lng: 77.209, areas: ['Saket','Dwarka','Karol Bagh','Rohini','Punjabi Bagh'] },
      Bengaluru: { lat: 12.9716, lng: 77.5946, areas: ['Koramangala','Indiranagar','Whitefield','Jayanagar','Malleshwaram'] },
      Hyderabad: { lat: 17.385, lng: 78.4867, areas: ['Jubilee Hills','Gachibowli','Begumpet','Kukatpally','Secunderabad'] },
      Chennai: { lat: 13.0827, lng: 80.2707, areas: ['Velachery','Adyar','Anna Nagar','T Nagar','OMR'] }
    };

    const cityLabPlans = [
      { city:'Mumbai', labs:[
        { name:'Metropolis SmartLab', category:'Private Lab', area:'Andheri' },
        { name:'Thyrocare Rapid', category:'Private Lab', area:'Powai' },
        { name:'HealthVista Diagnostics', category:'Private Lab', area:'Dadar' },
        { name:'Fortis Hospital Lab', category:'Hospital Lab', area:'Mulund' },
        { name:'Lilavati Hospital Pathology', category:'Hospital Lab', area:'Bandra' }
      ]},
      { city:'Delhi', labs:[
        { name:'Dr. Lal Care', category:'Private Lab', area:'Karol Bagh' },
        { name:'Max Smart Diagnostics', category:'Private Lab', area:'Saket' },
        { name:'SRL Vision Hub', category:'Private Lab', area:'Dwarka' },
        { name:'AIIMS Hospital Lab', category:'Hospital Lab', area:'Rohini' },
        { name:'Apollo Hospitals Lab Delhi', category:'Hospital Lab', area:'Jasola' }
      ]},
      { city:'Bengaluru', labs:[
        { name:'Aster Clinical Lab', category:'Private Lab', area:'Whitefield' },
        { name:'Clumax Diagnostics', category:'Private Lab', area:'Jayanagar' },
        { name:'PrimeCare Path Lab', category:'Private Lab', area:'Koramangala' },
        { name:'Manipal Hospital Diagnostics', category:'Hospital Lab', area:'Old Airport' },
        { name:'Fortis Bengaluru Lab', category:'Hospital Lab', area:'Bannerghatta' }
      ]},
      { city:'Hyderabad', labs:[
        { name:'Vijaya Diagnostic Center', category:'Private Lab', area:'Himayatnagar' },
        { name:'Medicover Labs', category:'Private Lab', area:'Madhapur' },
        { name:'Lucid Medical Diagnostics', category:'Private Lab', area:'Kukatpally' },
        { name:'Apollo Hospitals Lab Hyderabad', category:'Hospital Lab', area:'Jubilee Hills' },
        { name:'Yashoda Hospital Lab', category:'Hospital Lab', area:'Somajiguda' }
      ]},
      { city:'Chennai', labs:[
        { name:'Anderson Diagnostics', category:'Private Lab', area:'Alwarpet' },
        { name:'Aarthi Scans & Labs', category:'Private Lab', area:'T Nagar' },
        { name:'Proscans Pathology', category:'Private Lab', area:'Velachery' },
        { name:'Apollo Hospitals Lab Chennai', category:'Hospital Lab', area:'Greams Road' },
        { name:'Sri Ramachandra Hospital Lab', category:'Hospital Lab', area:'Porur' }
      ]}
    ];

    const offerData = [
      { title:'Flat 30% on home collection', tag:'HOLI30', desc:'Works for all private labs with home visit readiness.' },
      { title:'Hospital lab bundle', tag:'CARE20', desc:'Save on MRI + CBC when booking hospital diagnostics.' },
      { title:'Early bird slots', tag:'SUNRISE', desc:'6–8 AM fasting slots with priority pickup.' },
      { title:'Family pack of 4', tag:'FAM4', desc:'Auto copy reports to all linked dashboards.' }
    ];

    bundlePresets = [
      { name:'Preventive essentials (8)', desc:'CBC, LFT, KFT, lipids, HbA1c, thyroid, Vitamin D, CRP', blood:['Complete Blood Count','Lipid Profile','Liver Function Test','Kidney Function Test','HbA1c','Thyroid Panel','Vitamin D','CRP'], rad:[], home:true },
      { name:'Cardio-metabolic clarity', desc:'Lipid, HbA1c, Iron studies + CT Brain or Chest X-Ray as indicated', blood:['Lipid Profile','HbA1c','Iron Studies'], rad:['Chest X-Ray','CT Brain'], home:false },
      { name:'Bone & spine focus', desc:'Vitamin D, Ferritin + DEXA and MRI spine review', blood:['Vitamin D','Ferritin'], rad:['DEXA Scan','MRI Spine'], home:false },
      { name:'Women’s wellness', desc:'CBC, thyroid, Vitamin D + Pelvic USG & mammography pairing', blood:['Complete Blood Count','Thyroid Panel','Vitamin D'], rad:['USG Pelvis','Mammography'], home:true }
    ];

    function initTheme() {
      const saved = localStorage.getItem('hf-theme') || 'matte';
      document.documentElement.dataset.theme = saved;
      themeToggle.addEventListener('click', () => {
        const next = document.documentElement.dataset.theme === 'matte' ? 'day' : 'matte';
        document.documentElement.dataset.theme = next;
        localStorage.setItem('hf-theme', next);
      });
    }

    function buildLabs() {
      let idx = 0;
      labs = [];
      cityLabPlans.forEach(plan => {
        const coord = cityCoordinates[plan.city];
        plan.labs.forEach(lab => {
          const multiplier = rand(0.92,1.3);
          const homeVisit = lab.category === 'Private Lab' ? Math.random() > 0.25 : Math.random() > 0.6;
          const homeFee = homeVisit ? Math.round(rand(120,320)) : 0;
          const blood = baseBlood.map(t => ({ ...t, price: Math.round(t.price * multiplier) }));
          const radiology = baseRad.map(t => ({ ...t, price: Math.round(t.price * (multiplier+0.08)) }));
          const description = `${lab.category} with neon status chips, QR confirmations, and proactive WhatsApp nudges.`;
          const img = `https://images.unsplash.com/photo-1582719478173-2f2df4b95831?auto=format&fit=crop&w=900&q=80&sig=${idx}`;
          const reports = buildLabReports(blood, radiology);
          const sigTests = [blood[0], blood[1], radiology[0]].map(t => ({ name:t.name, why:t.why }));
          const lat = coord.lat + rand(-0.08,0.08);
          const lng = coord.lng + rand(-0.08,0.08);
          labs.push({
            id:`lab-${idx}`,
            name: lab.name,
            city: plan.city,
            area: lab.area || coord.areas[idx % coord.areas.length],
            category: lab.category,
            lat,
            lng,
            phone:`+91-98765${10000+idx}`,
            homeVisit,
            homeFee,
            blood,
            radiology,
            description,
            img,
            reports,
            signatureTests: sigTests
          });
          idx++;
        });
      });
    }

    function buildLabReports(blood, radiology) {
      const bloodReports = blood.slice(0,4).map(test => {
        const baseline = test.range ? rand(test.range[0]*0.9, test.range[1]*1.2) : rand(10,90);
        const status = test.range ? (baseline < test.range[0] ? 'low' : baseline > test.range[1] ? 'high' : 'normal') : 'note';
        return { name: test.name, value: Number(baseline.toFixed(1)), unit: test.unit || '', range: test.range, why: test.why, status };
      });
      const imagingReports = radiology.slice(0,3).map(test => ({
        name: test.name,
        impression: test.impression,
        status: Math.random() > 0.72 ? 'follow-up' : 'clear',
        why: test.why
      }));
      return { updated: new Date().toISOString(), bloodReports, imagingReports };
    }

    function getFallbackSnapshot() {
      return {
        updated: new Date().toISOString(),
        lab: 'HealthFlo Demo Lab',
        city: 'Mumbai',
        area: 'Andheri',
        bloodReports: baseBlood.slice(0,3).map((test, i) => ({
          name: test.name,
          value: (test.range ? test.range[0] + (i+1) * 0.8 : 12 + i).toFixed(1),
          unit: test.unit || '',
          range: test.range,
          why: test.why,
          status: i === 1 ? 'high' : 'normal'
        })),
        imagingReports: baseRad.slice(0,2).map((test, i) => ({
          name: test.name,
          impression: i === 0 ? 'Clear lungs and mediastinum.' : test.impression,
          status: i === 1 ? 'follow-up' : 'clear',
          why: test.why
        }))
      };
    }

    function haversine(lat1, lon1, lat2, lon2) {
      const R = 6371;
      const dLat = (lat2-lat1) * Math.PI/180;
      const dLon = (lon2-lon1) * Math.PI/180;
      const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    }

    function computeDistances() {
      if (!userLocation) return;
      labs.forEach(l => {
        l.distanceKm = haversine(userLocation.lat, userLocation.lng, l.lat, l.lng);
      });
    }

    function filterLabs() {
      computeDistances();
      const query = (searchInput.value || '').toLowerCase();
      const city = cityFilter.value;
      const type = typeFilter.value;
      const homeOnly = homeToggle.checked;
      let results = labs.filter(lab => {
        if (city && lab.city !== city) return false;
        if (homeOnly && !lab.homeVisit) return false;
        const haystack = [lab.name, lab.city, lab.area, ...lab.blood.map(t=>t.name), ...lab.radiology.map(t=>t.name)]
          .join(' ').toLowerCase();
        if (query && !haystack.includes(query)) return false;
        if (type === 'blood' && !lab.blood.length) return false;
        if (type === 'radiology' && !lab.radiology.length) return false;
        return true;
      });
      if (nearestToggle.checked && userLocation) {
        results.sort((a,b) => (a.distanceKm||Infinity) - (b.distanceKm||Infinity));
        sortMeta.textContent = 'Nearest';
        sortStatus.textContent = 'Sorting by distance using live or saved location.';
      } else {
        results.sort((a,b) => a.name.localeCompare(b.name));
        sortMeta.textContent = 'A–Z';
        sortStatus.textContent = 'Sorting alphabetically; enable nearest for distance order.';
      }
      renderLabs(results);
    }

    function renderLabs(list) {
      lastResults = list;
      renderSkeletonCards(false);
      labsGrid.innerHTML = '';
      labsEmpty.hidden = !!list.length;
      const homeLabs = list.filter(l=>l.homeVisit).length;
      const radLabs = list.filter(l=>l.radiology.length).length;
      const avg = list.length ? list.reduce((a,l)=>a+l.blood[0].price,0)/list.length : 0;
      visibleCount.textContent = list.length;
      homeCount.textContent = homeLabs;
      radCount.textContent = radLabs;
      avgPrice.textContent = list.length ? fmt(avg) : '₹0';
      homeFeeMeta.textContent = homeLabs ? fmt(list.filter(l=>l.homeVisit).reduce((a,l)=>a+l.homeFee,0)/homeLabs) : '₹0';
      [visibleCount, homeCount, radCount, avgPrice, homeFeeMeta].forEach(node => {
        const metric = node.closest('.metric');
        if (!metric) return;
        metric.classList.remove('animate'); metric.offsetWidth; metric.classList.add('animate');
      });
      if (!list.length) return;
      list.forEach(lab => {
        const node = labCardTpl.content.firstElementChild.cloneNode(true);
        node.querySelector('.lab-img').src = lab.img;
        node.querySelector('.lab-img').alt = lab.name;
        node.querySelector('.lab-name').textContent = lab.name;
        node.querySelector('.lab-loc').textContent = `${lab.city} · ${lab.area}`;
        const badges = node.querySelector('.badges');
        badges.innerHTML = '';
        const homeBadge = document.createElement('span');
        homeBadge.className = 'pill ' + (lab.homeVisit ? 'good' : '');
        homeBadge.textContent = lab.homeVisit ? `Home visit • ${fmt(lab.homeFee)}` : 'In-lab only';
        badges.appendChild(homeBadge);
        badges.insertAdjacentHTML('beforeend', `<span class="pill">${lab.blood.length} blood</span><span class="pill">${lab.radiology.length} radiology</span><span class="pill hot">${lab.category}</span>`);
        const hints = node.querySelector('.investigation-hints');
        hints.innerHTML = '';
        lab.signatureTests.forEach(test => {
          const chip = document.createElement('span');
          chip.className = 'hint';
          chip.textContent = test.name;
          chip.title = test.why;
          hints.appendChild(chip);
        });
        const distRow = node.querySelector('.distance-row');
        distRow.textContent = userLocation && lab.distanceKm ? `${lab.distanceKm.toFixed(1)} km away` : 'Distance pending location';
        const viewBtn = node.querySelector('[data-action="view"]');
        const bookBtn = node.querySelector('[data-action="book"]');
        const dirBtn = node.querySelector('[data-action="directions"]');
        const callBtn = node.querySelector('[data-action="call"]');
        dirBtn.href = `https://www.google.com/maps?q=${encodeURIComponent(lab.name)}@${lab.lat},${lab.lng}`;
        callBtn.href = `tel:${lab.phone}`;
        viewBtn.addEventListener('click', e => { e.stopPropagation(); openModal(lab); });
        bookBtn.addEventListener('click', e => { e.stopPropagation(); openModal(lab); setTab('book'); });
        dirBtn.addEventListener('click', e => e.stopPropagation());
        callBtn.addEventListener('click', e => e.stopPropagation());
        node.addEventListener('click', () => openModal(lab));
        labsGrid.appendChild(node);
      });
    }

    function getFirstLab() {
      return (lastResults && lastResults.length ? lastResults[0] : null) || labs[0];
    }

    function applyBundle(bundle) {
      const lab = getFirstLab();
      if (!lab) { showToast('Labs are still loading'); return; }
      const sel = getSel(lab.id);
      sel.blood.clear();
      sel.rad.clear();
      bundle.blood.forEach(name => { if (lab.blood.find(t => t.name === name)) sel.blood.add(name); });
      bundle.rad.forEach(name => { if (lab.radiology.find(t => t.name === name)) sel.rad.add(name); });
      sel.home = bundle.home && lab.homeVisit;
      openModal(lab);
      showToast(`${bundle.name} loaded in ${lab.name}`);
    }

    function renderExplainers() {
      explainerList.innerHTML = '';
      const picked = [...baseBlood.slice(0,3), ...baseRad.slice(0,2)];
      picked.forEach(item => {
        const row = document.createElement('div');
        row.className = 'insight-row shine';
        row.innerHTML = `<div><strong>${item.name}</strong><small>${item.why}</small></div><span class="status-badge neutral">Why it's done</span>`;
        explainerList.appendChild(row);
      });
    }

    function renderOfferCards(container) {
      container.innerHTML = '';
      offerData.forEach(offer => {
        const card = document.createElement('div');
        card.className = 'offer-card';
        card.innerHTML = `<h4>${offer.title}</h4><p class="offer-tag">Code ${offer.tag}</p><p class="muted">${offer.desc}</p>`;
        container.appendChild(card);
      });
    }

    function renderOffers() {
      renderOfferCards(offersStrip);
      renderOfferCards(secondaryOffers);
    }

    function renderBundles() {
      bundleRow.innerHTML = '';
      bundlePresets.forEach(bundle => {
        const card = document.createElement('div');
        card.className = 'bundle shine';
        card.innerHTML = `
          <strong>${bundle.name}</strong>
          <p class="muted">${bundle.desc}</p>
          <div class="label-row wrap">${bundle.blood.slice(0,3).map(b=>`<span class="pill">${b}</span>`).join('')} ${bundle.rad.slice(0,2).map(r=>`<span class="pill">${r}</span>`).join('')}</div>
          <span class="pill ${bundle.home ? 'good' : ''}">${bundle.home ? 'Home ready' : 'Visit lab'}</span>
        `;
        card.addEventListener('click', () => applyBundle(bundle));
        bundleRow.appendChild(card);
      });
    }

    function renderSkeletonCards(show = true) {
      labsSkeleton.innerHTML = '';
      labsSkeleton.setAttribute('aria-hidden', show ? 'false' : 'true');
      labsSkeleton.classList.toggle('skeleton', show);
      if (!show) return;
      for (let i = 0; i < 6; i++) {
        const card = document.createElement('div');
        card.className = 'skeleton-card';
        card.innerHTML = '<div class="skeleton-thumb"></div><div class="skeleton-line" style="width:70%"></div><div class="skeleton-line" style="width:40%"></div><div class="label-row"><span class="skeleton-line" style="width:60px"></span><span class="skeleton-line" style="width:80px"></span></div>';
        labsSkeleton.appendChild(card);
      }
    }

    function renderDashboardSnapshot() {
      const savedRaw = localStorage.getItem('lab-dashboard-latest');
      const saved = savedRaw ? JSON.parse(savedRaw) : getFallbackSnapshot();
      const demo = !savedRaw;
      dashboardList.innerHTML = '';
      dashboardStatus.textContent = demo ? 'Demo snapshot' : `Synced ${new Date(saved.updated).toLocaleString()}`;
      dashboardStatus.className = demo ? 'status-badge neutral' : 'status-badge good';
      dashboardSummary.textContent = `From ${saved.lab} • ${saved.city}`;
      saved.bloodReports.forEach(rep => {
        const badgeClass = rep.status === 'normal' ? 'good' : rep.status === 'high' || rep.status === 'low' ? 'warn' : 'neutral';
        const row = document.createElement('div');
        row.className = 'insight-row';
        row.innerHTML = `<div><strong>${rep.name}</strong><small>${rep.why}</small><small>Result: ${rep.value} ${rep.unit || ''}${rep.range?` (target ${rep.range[0]}-${rep.range[1]})`:''}</small></div><span class="status-badge ${badgeClass}">${rep.status}</span>`;
        dashboardList.appendChild(row);
      });
      latestReportForPdf = saved;
    }

    function getSel(id) {
      if (!selections.has(id)) selections.set(id, { blood:new Set(), rad:new Set(), home:false });
      return selections.get(id);
    }

    function renderTests(listEl, tests, selSet, query='') {
      listEl.innerHTML='';
      tests.filter(t => !query || t.name.toLowerCase().includes(query.toLowerCase()))
        .forEach(test => {
          const row = testRowTpl.content.firstElementChild.cloneNode(true);
          const cb = row.querySelector('input');
          row.querySelector('.test-name').textContent = test.name;
          row.querySelector('.test-price').textContent = fmt(test.price);
          row.querySelector('.test-why').textContent = test.why || 'Investigation added for clinical context.';
          row.querySelector('.test-range').textContent = test.range ? `Target ${test.range[0]}–${test.range[1]} ${test.unit||''}` : '';
          cb.checked = selSet.has(test.name);
          cb.addEventListener('change', () => {
            cb.checked ? selSet.add(test.name) : selSet.delete(test.name);
            updateTotals();
          });
          listEl.appendChild(row);
        });
      if (!listEl.children.length) { 
        const empty = document.createElement('div');
        empty.className='card';
        empty.textContent='No tests match this search.';
        listEl.appendChild(empty);
      }
    }

    function updateTotals() {
      if (!currentLab) return;
      const sel = getSel(currentLab.id);
      const bloodSel = currentLab.blood.filter(t => sel.blood.has(t.name));
      const radSel = currentLab.radiology.filter(t => sel.rad.has(t.name));
      const bloodFee = sel.home && currentLab.homeVisit ? currentLab.homeFee : 0;
      const bloodSum = bloodSel.reduce((a,t)=>a+t.price,0) + bloodFee;
      const radSum = radSel.reduce((a,t)=>a+t.price,0);
      bloodCount.textContent = bloodSel.length;
      radCountEl.textContent = radSel.length;
      bloodTotal.textContent = fmt(bloodSum);
      radTotal.textContent = fmt(radSum);
      const lines = [];
      if (bloodSel.length) {
        lines.push('Blood tests:');
        bloodSel.forEach(t => lines.push(`• ${t.name} — ${fmt(t.price)}`));
        if (bloodFee) lines.push(`• Home fee — ${fmt(bloodFee)}`);
      }
      if (radSel.length) {
        lines.push('Radiology:');
        radSel.forEach(t => lines.push(`• ${t.name} — ${fmt(t.price)}`));
      }
      bookSummary.textContent = lines.length ? lines.join('\n') : 'No tests selected yet.';
      bookTotal.textContent = fmt(bloodSum + radSum);
    }

    function renderReports(lab) {
      latestReportForPdf = { ...lab.reports, lab: lab.name, city: lab.city, area: lab.area };
      reportBloodEl.innerHTML = '';
      reportImagingEl.innerHTML = '';
      reportTimeline.innerHTML = '';
      reportMeta.textContent = `Generated from ${new Date(lab.reports.updated).toLocaleString()}. Sync below to push into your dashboard timeline.`;
      lab.reports.bloodReports.forEach(rep => {
        const badgeClass = rep.status === 'normal' ? 'good' : rep.status === 'high' || rep.status === 'low' ? 'warn' : 'neutral';
        const row = document.createElement('div');
        row.className = 'insight-row';
        row.innerHTML = `<div><strong>${rep.name}</strong><small>${rep.why}</small><small>Result: ${rep.value} ${rep.unit || ''}${rep.range?` (target ${rep.range[0]}-${rep.range[1]})`:''}</small></div><span class="status-badge ${badgeClass}">${rep.status}</span>`;
        reportBloodEl.appendChild(row);
      });
      lab.reports.imagingReports.forEach(rep => {
        const badgeClass = rep.status === 'clear' ? 'good' : rep.status === 'follow-up' ? 'warn' : 'neutral';
        const row = document.createElement('div');
        row.className = 'insight-row';
        row.innerHTML = `<div><strong>${rep.name}</strong><small>${rep.why}</small><small>${rep.impression}</small></div><span class="status-badge ${badgeClass}">${rep.status}</span>`;
        reportImagingEl.appendChild(row);
      });
      ['Select tests you care about', 'Sync to dashboard to track streaks', 'Use nearest-first to tighten logistics'].forEach(text => {
        const chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = text;
        reportTimeline.appendChild(chip);
      });
    }

    function openModal(lab) {
      currentLab = lab;
      const sel = getSel(lab.id);
      setTab('blood');
      modalTitle.textContent = lab.name;
      modalLocation.textContent = `${lab.city}, ${lab.area}`;
      modalHome.textContent = lab.homeVisit ? `Home visit • ${fmt(lab.homeFee)}` : 'In-lab only';
      modalDistance.textContent = lab.distanceKm ? `${lab.distanceKm.toFixed(1)} km` : 'Location pending';
      modalCounts.textContent = `${lab.blood.length} blood • ${lab.radiology.length} radiology`;
      modalLogo.textContent = lab.name.slice(0,2).toUpperCase();
      modalDirections.href = `https://www.google.com/maps?q=${encodeURIComponent(lab.name)}@${lab.lat},${lab.lng}`;
      modalCall.href = `tel:${lab.phone}`;
      modalWA.href = buildWhatsAppLink(lab, 'quick');
      homeFeeText.textContent = lab.homeVisit ? `Home fee: ${fmt(lab.homeFee)}` : 'Home collection not available';
      bloodHomeToggle.disabled = !lab.homeVisit;
      bloodHomeToggle.checked = sel.home && lab.homeVisit;
      renderTests(bloodList, lab.blood, sel.blood, bloodSearch.value);
      renderTests(radList, lab.radiology, sel.rad, radSearch.value);
      renderReports(lab);
      updateTotals();
      modal.classList.add('show');
      modal.setAttribute('aria-hidden','false');
    }

    function closeModal() {
      modal.classList.remove('show');
      modal.setAttribute('aria-hidden','true');
    }

    function setTab(tabName) {
      tabs.forEach(b => b.setAttribute('aria-selected', b.dataset.tab === tabName ? 'true':'false'));
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === tabName));
    }

    tabs.forEach(btn => btn.addEventListener('click', () => setTab(btn.dataset.tab)));
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    bloodSearch.addEventListener('input', () => renderTests(bloodList, currentLab.blood, getSel(currentLab.id).blood, bloodSearch.value));
    radSearch.addEventListener('input', () => renderTests(radList, currentLab.radiology, getSel(currentLab.id).rad, radSearch.value));
    bloodHomeToggle.addEventListener('change', () => { const sel = getSel(currentLab.id); sel.home = bloodHomeToggle.checked; updateTotals(); });
    bloodClear.addEventListener('click', () => { const sel = getSel(currentLab.id); sel.blood.clear(); sel.home=false; bloodHomeToggle.checked=false; updateTotals(); renderTests(bloodList, currentLab.blood, sel.blood, bloodSearch.value); });
    radClear.addEventListener('click', () => { const sel = getSel(currentLab.id); sel.rad.clear(); updateTotals(); renderTests(radList, currentLab.radiology, sel.rad, radSearch.value); });

    function buildWhatsAppLink(lab, context) {
      const sel = getSel(lab.id);
      const bloodSel = lab.blood.filter(t => sel.blood.has(t.name));
      const radSel = lab.radiology.filter(t => sel.rad.has(t.name));
      const bloodFee = sel.home && lab.homeVisit ? lab.homeFee : 0;
      let msg = `Lab: ${lab.name} (${lab.city}, ${lab.area})\n`;
      if (context === 'booking') {
        const mode = document.querySelector('input[name="visitMode"]:checked').value;
        msg += `Mode: ${mode === 'home' ? 'Home visit' : 'Visit lab'}\nDate: ${bookDate.value||'-'} Time: ${bookTime.value||'-'}\nName: ${bookName.value||'-'}\nPhone: ${bookPhone.value||'-'}\nCity: ${bookCity.value}\n`;
      }
      if (bloodSel.length) {
        msg += `Blood tests:\n`;
        bloodSel.forEach(t => msg += `• ${t.name} — ${fmt(t.price)}\n`);
        if (bloodFee) msg += `• Home collection fee — ${fmt(bloodFee)}\n`;
      }
      if (radSel.length) {
        msg += `Radiology:\n`;
        radSel.forEach(t => msg += `• ${t.name} — ${fmt(t.price)}\n`);
      }
      const total = bloodSel.reduce((a,t)=>a+t.price,0) + radSel.reduce((a,t)=>a+t.price,0) + bloodFee;
      msg += `Total: ${fmt(total)}`;
      return `https://wa.me/?text=${encodeURIComponent(msg)}`;
    }

    function downloadReportPDF(report, filename='lab-report.pdf') {
      if (!report) { showToast('No report to download yet'); return; }
      const lines = [];
      lines.push(`Lab report: ${report.lab || 'Lab'}`);
      lines.push(`City: ${report.city || '-'} ${report.area ? '• ' + report.area : ''}`);
      lines.push(`Updated: ${new Date(report.updated || Date.now()).toLocaleString()}`);
      lines.push('');
      lines.push('Blood markers:');
      (report.bloodReports || []).forEach(rep => {
        lines.push(`- ${rep.name}: ${rep.value || '-'} ${rep.unit || ''}`);
        if (rep.range) lines.push(`  Target: ${rep.range[0]}-${rep.range[1]}`);
        if (rep.why) lines.push(`  Why: ${rep.why}`);
      });
      lines.push('');
      lines.push('Imaging & impressions:');
      (report.imagingReports || []).forEach(rep => {
        lines.push(`- ${rep.name}: ${rep.impression || ''}`);
        if (rep.why) lines.push(`  Why: ${rep.why}`);
        if (rep.status) lines.push(`  Status: ${rep.status}`);
      });
      const blob = new Blob([lines.join('\n')], { type:'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Downloading PDF report');
    }

    bloodWA.addEventListener('click', () => { if (!currentLab) return; window.open(buildWhatsAppLink(currentLab,'blood'),'_blank'); showToast('Opened WhatsApp with blood tests'); });
    radWA.addEventListener('click', () => { if (!currentLab) return; window.open(buildWhatsAppLink(currentLab,'radiology'),'_blank'); showToast('Opened WhatsApp with radiology tests'); });
    bookConfirm.addEventListener('click', () => {
      if (!currentLab) return; window.open(buildWhatsAppLink(currentLab,'booking'),'_blank'); showToast('Booking sent via WhatsApp');
    });

    downloadPdfBtn.addEventListener('click', () => downloadReportPDF(latestReportForPdf, `${currentLab ? currentLab.name : 'lab'}-report.pdf`));
    downloadDashboardPdf.addEventListener('click', () => {
      const snapshot = JSON.parse(localStorage.getItem('lab-dashboard-latest') || 'null') || getFallbackSnapshot();
      downloadReportPDF(snapshot, 'health-map-report.pdf');
    });
    downloadLandingPdf.addEventListener('click', () => downloadReportPDF(getFallbackSnapshot(), 'demo-lab-report.pdf'));
    syncFromLatest.addEventListener('click', () => {
      const snap = getFallbackSnapshot();
      latestReportForPdf = snap;
      localStorage.setItem('lab-dashboard-latest', JSON.stringify(snap));
      renderDashboardSnapshot();
      showToast('Dummy data refreshed');
    });
    bookLandingCta.addEventListener('click', () => {
      if (!labs.length) return;
      openModal(labs[0]);
      setTab('book');
    });

    function syncReportsToDashboard(lab) {
      const payload = { ...lab.reports, lab: lab.name, city: lab.city, area: lab.area };
      latestReportForPdf = payload;
      localStorage.setItem('lab-dashboard-latest', JSON.stringify(payload));
      renderDashboardSnapshot();
      showToast('Report synced to dashboard');
    }
    syncDashboard.addEventListener('click', () => { if (currentLab) syncReportsToDashboard(currentLab); });

    function loadProfile() {
      const saved = JSON.parse(localStorage.getItem('lab-profile') || '{}');
      profileName.value = saved.name || '';
      profilePhone.value = saved.phone || '';
      profileCity.value = saved.city || '';
      profileSort.value = saved.sort || 'nearest';
    }
    function applyProfile() {
      const saved = JSON.parse(localStorage.getItem('lab-profile') || '{}');
      bookName.value = saved.name || '';
      bookPhone.value = saved.phone || '';
      if (saved.city) bookCity.value = saved.city;
      nearestToggle.checked = saved.sort !== 'az';
      filterLabs();
    }
    saveProfile.addEventListener('click', () => {
      const data = { name: profileName.value, phone: profilePhone.value, city: profileCity.value, sort: profileSort.value };
      localStorage.setItem('lab-profile', JSON.stringify(data));
      showToast('Profile saved');
    });
    clearProfile.addEventListener('click', () => { localStorage.removeItem('lab-profile'); loadProfile(); showToast('Profile cleared'); });
    useProfile.addEventListener('click', () => { applyProfile(); showToast('Profile applied to booking'); });

    function showToast(msg) {
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    }

    function requestLocation() {
      if (!navigator.geolocation) { showToast('Geolocation not supported'); return; }
      navigator.geolocation.getCurrentPosition(pos => {
        userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        localStorage.setItem('lab-location', JSON.stringify(userLocation));
        locationMeta.textContent = 'Live';
        showToast('Location updated');
        filterLabs();
      }, () => { showToast('Unable to fetch location'); });
    }

    locateBtn.addEventListener('click', requestLocation);
    nearestToggle.addEventListener('change', filterLabs);
    searchInput.addEventListener('input', filterLabs);
    cityFilter.addEventListener('change', filterLabs);
    typeFilter.addEventListener('change', filterLabs);
    homeToggle.addEventListener('change', filterLabs);
    openFirstLab.addEventListener('click', () => { const lab = getFirstLab(); if (lab) openModal(lab); else showToast('Labs are still loading'); });
    showAllLabs.addEventListener('click', () => { searchInput.value=''; cityFilter.value=''; typeFilter.value=''; homeToggle.checked=false; nearestToggle.checked=true; filterLabs(); });

    modalCall.addEventListener('click', e => { if (modalCall.href.startsWith('tel:')) return; e.preventDefault(); window.location.href = modalCall.href; });

    function initRipple() {
      document.body.addEventListener('click', e => {
        const target = e.target.closest('[data-ripple]');
        if (!target) return;
        const rect = target.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        target.appendChild(ripple);
        setTimeout(() => ripple.remove(), 500);
        clickSound.currentTime = 0; clickSound.play();
      });
    }

    function init() {
      renderSkeletonCards(true);
      initTheme();
      loadProfile();
      const savedLoc = localStorage.getItem('lab-location');
      if (savedLoc) { userLocation = JSON.parse(savedLoc); locationMeta.textContent = 'Saved'; }
      buildLabs();
      renderOffers();
      renderBundles();
      renderDashboardSnapshot();
      filterLabs();
      initRipple();
    }

    init();
