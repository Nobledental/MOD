/* HealthFlo Pharmacy OS — dual dashboards */
document.addEventListener('DOMContentLoaded', () => {
  const qs = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => Array.from(r.querySelectorAll(s));
  const toast = (msg) => {
    const t = qs('#toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 1800);
  };

  const meds = [
    { id:'m-azicip', brand:'Azicip 500', generic:'Azithromycin', form:'Tablet', use:'Antibiotic', price:180, mrp:220, discount:18, rx:true, pharmacies:['apollo','fortis','healthflo'] },
    { id:'m-azee', brand:'Azee 500', generic:'Azithromycin', form:'Tablet', use:'Antibiotic', price:175, mrp:210, discount:16, rx:true, pharmacies:['max','healthflo'] },
    { id:'m-dolo', brand:'Dolo 650', generic:'Paracetamol', form:'Tablet', use:'Pain Relief', price:28, mrp:34, discount:12, rx:false, pharmacies:['apollo','healthflo'] },
    { id:'m-atorva', brand:'Atorva 10', generic:'Atorvastatin', form:'Tablet', use:'Heart', price:82, mrp:99, discount:17, rx:true, pharmacies:['fortis','kokilaben','healthflo'] },
    { id:'m-glycomet', brand:'Glycomet SR 500', generic:'Metformin', form:'Tablet', use:'Diabetes', price:42, mrp:55, discount:14, rx:true, pharmacies:['apollo','healthflo'] },
    { id:'m-shelcal', brand:'Shelcal 500', generic:'Calcium + D3', form:'Tablet', use:'Supplement', price:118, mrp:140, discount:16, rx:false, pharmacies:['max','healthflo'] },
    { id:'m-cetz', brand:'Cetirizine 10', generic:'Cetirizine', form:'Tablet', use:'Allergy', price:20, mrp:24, discount:8, rx:false, pharmacies:['apollo','fortis','healthflo'] },
    { id:'m-foracort', brand:'Foracort Inhaler 200', generic:'Formoterol+Budesonide', form:'Inhaler', use:'Asthma', price:440, mrp:520, discount:15, rx:true, pharmacies:['fortis','healthflo'] },
    { id:'m-metrogyl', brand:'Metrogyl 400', generic:'Metronidazole', form:'Tablet', use:'Antibiotic', price:36, mrp:44, discount:15, rx:true, pharmacies:['max','healthflo'] }
  ];

  const pharmacies = [
    { id:'healthflo', name:'HealthFlo Buffer Pharmacy', city:'Virtual buffer', area:'Network', fulfilment:['delivery','pickup'], distance:0.4, eta:'18-25 min', delivery:true, buffer:true, live:true, offer:'Routes orders as safety buffer', meds:meds.map(m=>m.id) },
    { id:'apollo', name:'Apollo Hospitals Pharmacy', city:'Delhi', area:'Saket', fulfilment:['delivery','pickup'], distance:2.1, eta:'30-40 min', delivery:true, buffer:false, live:true, offer:'Cold-chain ready', meds:['m-dolo','m-azicip','m-glycomet','m-cetz'] },
    { id:'fortis', name:'Fortis Hospital Pharmacy', city:'Noida', area:'Sec 62', fulfilment:['delivery','pickup'], distance:6.2, eta:'45-55 min', delivery:true, buffer:false, live:false, offer:'Tele-consult on Rx', meds:['m-azicip','m-atorva','m-foracort','m-cetz'] },
    { id:'max', name:'Max Hospital Pharmacy', city:'Delhi', area:'Vaishali', fulfilment:['pickup'], distance:10.4, eta:'Ready in 15', delivery:false, buffer:false, live:false, offer:'Pick-up express', meds:['m-azee','m-shelcal','m-metrogyl'] },
    { id:'kokilaben', name:'Kokilaben Hospital Pharmacy', city:'Mumbai', area:'Andheri', fulfilment:['delivery','pickup'], distance:1.8, eta:'35-45 min', delivery:true, buffer:false, live:true, offer:'Pack tracking', meds:['m-atorva'] }
  ];

  const elMeds = qs('#medsGrid');
  const elStores = qs('#storeGrid');
  const statSubs = qs('#statSubs');
  const statOrders = qs('#statOrders');
  const statBuffer = qs('#statBuffer');
  const kMeds = qs('#kMeds');
  const kPharm = qs('#kPharm');
  const kLive = qs('#kLive');
  const liveStatus = qs('#liveStatus');
  const liveEta = qs('#liveEta');
  const trackProgress = qs('#trackProgress');

  const searchMeds = qs('#searchMeds');
  const therapeuticFilter = qs('#therapeuticFilter');
  const priceRange = qs('#priceRange');
  const priceValue = qs('#priceValue');
  const discountFilter = qs('#discountFilter');
  const autoLoadFromStores = qs('#autoLoadFromStores');

  const searchLocation = qs('#searchLocation');
  const fulfilmentFilter = qs('#fulfilmentFilter');
  const includeBuffer = qs('#includeBuffer');
  const sortNearest = qs('#sortNearest');
  const filterDelivery = qs('#filterDelivery');

  const themeToggle = qs('#themeToggle');
  themeToggle?.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', cur);
  });

  const activeOrders = [];

  function applyMedsFilter() {
    const q = (searchMeds.value || '').toLowerCase();
    const use = therapeuticFilter.value;
    const priceCap = Number(priceRange.value || 800);
    const disc = discountFilter.value ? Number(discountFilter.value) : 0;

    let list = meds.filter(m => {
      const hay = `${m.brand} ${m.generic} ${m.use}`.toLowerCase();
      if (q && !hay.includes(q)) return false;
      if (use && m.use !== use) return false;
      if (m.price > priceCap) return false;
      if (disc && m.discount < disc) return false;
      return true;
    });

    if (autoLoadFromStores.checked) {
      const visibleStores = filterStores();
      const ids = new Set(visibleStores.flatMap(s => s.meds));
      list = list.filter(m => m.pharmacies.some(p => ids.has(m.id)) || ids.has(m.id));
    }

    renderMeds(list.slice(0, 9));
    priceValue.textContent = `Up to ₹${priceCap}`;
  }

  function renderMeds(list) {
    elMeds.innerHTML = '';
    list.forEach(m => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <div class="badges">${m.rx ? '<span class="badge">Rx</span>' : '<span class="badge">OTC</span>'}<span class="badge">${m.use}</span></div>
        <h3 class="title">${m.brand}</h3>
        <p class="sub">${m.generic} • ${m.form}</p>
        <div class="price-line"><strong>₹${m.price}</strong><span class="muted"><s>₹${m.mrp}</s></span><span class="badge">${m.discount}% OFF</span></div>
        <p class="muted">Available at: ${m.pharmacies.map(id => pharmacyName(id)).join(', ')}</p>
        <div class="badges">
          <button class="pill outline" data-med="${m.id}">View substitutes</button>
          <button class="pill solid" data-cart="${m.id}">Add & track</button>
        </div>
      `;
      card.querySelector('[data-med]')?.addEventListener('click', () => showSubstitutes(m));
      card.querySelector('[data-cart]')?.addEventListener('click', () => placeOrder(m));
      elMeds.appendChild(card);
    });
    kMeds.textContent = list.length.toString();
  }

  function pharmacyName(id) {
    return pharmacies.find(p => p.id === id)?.name || id;
  }

  function filterStores() {
    const needle = (searchLocation.value || '').toLowerCase();
    const fulfil = fulfilmentFilter.value;
    const deliveryOnly = filterDelivery.classList.contains('active');
    let list = pharmacies.filter(p => {
      const hay = `${p.name} ${p.city} ${p.area}`.toLowerCase();
      if (needle && !hay.includes(needle)) return false;
      if (fulfil && !p.fulfilment.includes(fulfil)) return false;
      if (deliveryOnly && !p.delivery) return false;
      if (!includeBuffer.checked && p.buffer) return false;
      return true;
    });
    if (sortNearest.classList.contains('active')) {
      list = list.slice().sort((a,b) => a.distance - b.distance);
    }
    renderStores(list);
    return list;
  }

  function renderStores(list) {
    elStores.innerHTML = '';
    list.forEach(p => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <div class="badges">${p.buffer ? '<span class="badge">HealthFlo buffer</span>' : ''}${p.delivery ? '<span class="badge">Delivery</span>' : '<span class="badge">Pick-up</span>'}</div>
        <h3 class="title">${p.name}</h3>
        <p class="sub">${p.area}, ${p.city}</p>
        <p class="muted">Fulfilment: ${p.fulfilment.join(' / ')} • ETA ${p.eta}</p>
        <div class="price-line"><strong>${p.distance} km</strong><span class="muted">away</span></div>
        <p class="muted">${p.offer}</p>
        <div class="badges">
          <button class="pill outline" data-open="${p.id}">Inventory</button>
          <button class="pill solid" data-route="${p.id}">Route via ${p.buffer ? 'Buffer' : 'Store'}</button>
        </div>
      `;
      card.querySelector('[data-open]')?.addEventListener('click', () => highlightInventory(p));
      card.querySelector('[data-route]')?.addEventListener('click', () => startLive(p));
      elStores.appendChild(card);
    });
    kPharm.textContent = list.length.toString();
    kLive.textContent = list.filter(p => p.live).length.toString();
  }

  function showSubstitutes(med) {
    const subs = meds.filter(m => m.generic === med.generic && m.id !== med.id);
    statSubs.textContent = subs.length.toString();
    toast(subs.length ? `Found ${subs.length} substitutes for ${med.brand}` : 'No close substitutes available');
  }

  function placeOrder(med) {
    const order = { id:`HF-${Math.random().toString(36).slice(2,6).toUpperCase()}`, med, status:'Preparing', eta:18 };
    activeOrders.unshift(order);
    statOrders.textContent = activeOrders.length.toString();
    statBuffer.textContent = '100%';
    startLive(pharmacies.find(p => med.pharmacies.includes(p.id)) || pharmacies[0]);
    toast(`${med.brand} added — tracking live`);
  }

  function highlightInventory(store) {
    toast(`${store.name}: ${store.meds.length} medicines ready`);
    if (autoLoadFromStores.checked) applyMedsFilter();
  }

  function startLive(store) {
    liveStatus.textContent = `${store.name} — rider assigned`;
    liveEta.textContent = `ETA ${store.eta}`;
    trackProgress.style.width = '18%';
    let progress = 18;
    const timer = setInterval(() => {
      progress = Math.min(100, progress + Math.random()*18);
      trackProgress.style.width = `${progress}%`;
      if (progress >= 100) {
        liveStatus.textContent = `${store.name} — Delivered`;
        liveEta.textContent = 'Arrived';
        clearInterval(timer);
      }
    }, 1200);
  }

  function initHandlers() {
    [searchMeds, therapeuticFilter, discountFilter].forEach(el => el?.addEventListener('input', applyMedsFilter));
    priceRange?.addEventListener('input', applyMedsFilter);
    autoLoadFromStores?.addEventListener('change', applyMedsFilter);
    [searchLocation, fulfilmentFilter].forEach(el => el?.addEventListener('input', filterStores));
    includeBuffer?.addEventListener('change', filterStores);
    sortNearest?.addEventListener('click', () => { sortNearest.classList.toggle('active'); filterStores(); });
    filterDelivery?.addEventListener('click', () => { filterDelivery.classList.toggle('active'); filterStores(); });

    qs('#ctaOrder')?.addEventListener('click', () => toast('Opening quick order…'));
    qs('#ctaLocate')?.addEventListener('click', () => { sortNearest.classList.add('active'); filterStores(); toast('Using nearest sort'); });
    qs('#ctaWhatsApp')?.addEventListener('click', () => toast('WhatsApp concierge template prepared'));
    qs('#syncHealth')?.addEventListener('click', () => toast('Synced to patient-health.html'));
    qs('#openTracker')?.addEventListener('click', () => toast('Live tracker opened'));
  }

  function initStats() {
    statSubs.textContent = '0';
    statOrders.textContent = activeOrders.length.toString();
    statBuffer.textContent = '100%';
  }

  initHandlers();
  filterStores();
  applyMedsFilter();
  initStats();
});
