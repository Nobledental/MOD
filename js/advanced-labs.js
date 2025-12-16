(function () {
  const STORAGE_KEY = 'advancedLabsDataV1';
  const DEFAULT_LABS = [
    {
      id: 1,
      name: 'Complete Blood Count (CBC)',
      date: '2025-12-10',
      lab: 'Quest Diagnostics',
      category: 'cbc',
      status: 'normal',
      color: '#10b981',
      tests: [
        { name: 'Hemoglobin', value: 14.2, unit: 'g/dL', min: 13.5, max: 17.5, color: '#10b981', status: 'normal', history: [13.8, 14.0, 14.1, 14.2] },
        { name: 'WBC', value: 7.2, unit: 'K/uL', min: 4.5, max: 11.0, color: '#10b981', status: 'normal', history: [6.8, 7.0, 7.5, 7.2] },
        { name: 'Platelets', value: 245, unit: 'K/uL', min: 150, max: 400, color: '#10b981', status: 'normal', history: [230, 240, 250, 245] },
        { name: 'RBC', value: 5.1, unit: 'M/uL', min: 4.5, max: 5.5, color: '#10b981', status: 'normal', history: [5.0, 5.1, 5.2, 5.1] }
      ],
      ai: 'All blood cell counts are within optimal ranges. Oxygen carrying capacity is excellent. No signs of infection or anemia.'
    },
    {
      id: 2,
      name: 'Comprehensive Metabolic Panel',
      date: '2025-12-08',
      lab: 'LabCorp',
      category: 'metabolic',
      status: 'normal',
      color: '#3b82f6',
      tests: [
        { name: 'Glucose', value: 92, unit: 'mg/dL', min: 70, max: 100, color: '#10b981', status: 'normal', history: [88, 95, 90, 92] },
        { name: 'Calcium', value: 9.4, unit: 'mg/dL', min: 8.5, max: 10.5, color: '#10b981', status: 'normal', history: [9.2, 9.3, 9.4, 9.4] },
        { name: 'Sodium', value: 140, unit: 'mmol/L', min: 136, max: 145, color: '#10b981', status: 'normal', history: [138, 139, 141, 140] },
        { name: 'Potassium', value: 4.2, unit: 'mmol/L', min: 3.5, max: 5.0, color: '#10b981', status: 'normal', history: [4.0, 4.1, 4.3, 4.2] },
        { name: 'Creatinine', value: 0.9, unit: 'mg/dL', min: 0.6, max: 1.3, color: '#10b981', status: 'normal', history: [1.0, 0.9, 0.9, 0.9] }
      ],
      ai: 'Electrolyte balance and kidney function markers are stable. Fasting glucose indicates good metabolic health.'
    },
    {
      id: 3,
      name: 'Lipid Panel',
      date: '2025-12-05',
      lab: 'Quest Diagnostics',
      category: 'lipid',
      status: 'abnormal',
      color: '#f59e0b',
      tests: [
        { name: 'Total Cholesterol', value: 198, unit: 'mg/dL', min: 100, max: 200, color: '#f59e0b', status: 'borderline', history: [180, 185, 195, 198] },
        { name: 'LDL Direct', value: 115, unit: 'mg/dL', min: 0, max: 100, color: '#ef4444', status: 'high', history: [95, 105, 110, 115] },
        { name: 'HDL', value: 58, unit: 'mg/dL', min: 40, max: 100, color: '#10b981', status: 'good', history: [55, 56, 57, 58] },
        { name: 'Triglycerides', value: 125, unit: 'mg/dL', min: 0, max: 150, color: '#10b981', status: 'normal', history: [110, 120, 130, 125] },
        { name: 'ApoB', value: 96, unit: 'mg/dL', min: 60, max: 90, color: '#f59e0b', status: 'borderline', history: [88, 92, 95, 96] }
      ],
      ai: 'LDL cholesterol is elevated above the optimal <100 mg/dL target. Recommend increasing dietary fiber and reducing saturated fats.'
    },
    {
      id: 4,
      name: 'Thyroid Function (TSH)',
      date: '2025-11-28',
      lab: 'LabCorp',
      category: 'hormones',
      status: 'normal',
      color: '#8b5cf6',
      tests: [
        { name: 'TSH', value: 2.1, unit: 'uIU/mL', min: 0.4, max: 4.0, color: '#10b981', status: 'optimal', history: [1.8, 2.0, 2.2, 2.1] },
        { name: 'T4 Free', value: 1.3, unit: 'ng/dL', min: 0.8, max: 1.8, color: '#10b981', status: 'normal', history: [1.2, 1.3, 1.3, 1.3] },
        { name: 'T3 Free', value: 3.1, unit: 'pg/mL', min: 2.3, max: 4.2, color: '#10b981', status: 'normal', history: [3.0, 3.0, 3.1, 3.1] }
      ],
      ai: 'Thyroid function is euthyroid (balanced). TSH levels are ideal for metabolic regulation.'
    },
    {
      id: 5,
      name: 'Vitamin & Minerals',
      date: '2025-11-15',
      lab: 'Home Collection',
      category: 'nutrition',
      status: 'abnormal',
      color: '#ef4444',
      tests: [
        { name: 'Vitamin D', value: 22, unit: 'ng/mL', min: 30, max: 100, color: '#ef4444', status: 'low', history: [18, 20, 21, 22] },
        { name: 'Vitamin B12', value: 320, unit: 'pg/mL', min: 200, max: 900, color: '#10b981', status: 'normal', history: [280, 300, 310, 320] },
        { name: 'Ferritin', value: 45, unit: 'ng/mL', min: 24, max: 336, color: '#10b981', status: 'normal', history: [40, 42, 44, 45] },
        { name: 'Magnesium', value: 1.9, unit: 'mg/dL', min: 1.7, max: 2.2, color: '#10b981', status: 'normal', history: [1.8, 1.9, 1.9, 1.9] }
      ],
      ai: 'Vitamin D remains low; consider supplementation and sunlight exposure. Other micronutrients look stable.'
    },
    {
      id: 6,
      name: 'Diabetes Monitoring',
      date: '2025-11-02',
      lab: 'AI Remote',
      category: 'metabolic',
      status: 'abnormal',
      color: '#f97316',
      tests: [
        { name: 'HbA1c', value: 6.2, unit: '%', min: 4.0, max: 5.6, color: '#f97316', status: 'elevated', history: [6.4, 6.3, 6.3, 6.2] },
        { name: 'Fasting Glucose', value: 104, unit: 'mg/dL', min: 70, max: 99, color: '#f59e0b', status: 'borderline', history: [110, 108, 105, 104] },
        { name: 'Insulin', value: 12, unit: 'µIU/mL', min: 2, max: 20, color: '#10b981', status: 'normal', history: [14, 13, 12, 12] }
      ],
      ai: 'Glycemic control is trending down but remains above goal. Reinforce nutrition plan and activity; consider CGM follow-up.'
    }
  ];

  function loadLabs() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (err) {
      console.warn('Could not load labs from storage', err);
    }
    return DEFAULT_LABS;
  }

  function saveLabs(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn('Could not save labs', err);
    }
  }

  function clampPercent(val) {
    if (val < 5) return 5;
    if (val > 95) return 95;
    return val;
  }

  function buildLayout(id, pageLabel) {
    return `
      <div class="advanced-labs-shell">
        <div class="browser-bar">
          <div class="window-controls">
            <div class="window-dot" style="background: #ef4444;"></div>
            <div class="window-dot" style="background: #f59e0b;"></div>
            <div class="window-dot" style="background: #10b981;"></div>
          </div>
          <div class="branding-right">
            HealthFlo <span>CLINICAL V3</span>
            <div style="padding: 4px 10px; background: rgba(255,255,255,0.05); border-radius: 20px; font-size: 11px; color: var(--text-muted);">
              <i class="ph-bold ph-shield-check"></i> Synced to ${pageLabel}
            </div>
          </div>
        </div>

        <div class="main-content">
          <div class="header-section">
            <div class="page-title">
              <h2>Diagnostics</h2>
              <h1>Lab <span>Results</span></h1>
            </div>
            <div class="header-actions" style="display:flex; gap:10px; flex-wrap:wrap;">
              <button class="primary" data-export="${id}"><i class="ph-bold ph-download-simple"></i> Export PDF</button>
              <a href="patient-labs.html" class="primary" style="text-decoration:none; display:inline-flex; align-items:center; gap:8px; background: rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.08);">
                <i class="ph-bold ph-flask"></i> Open Labs Hub
              </a>
            </div>
          </div>

          <div class="upload-zone" id="${id}-upload-zone">
            <div class="upload-progress-overlay" id="${id}-upload-overlay">
              <div class="scan-line"></div>
              <div class="loading-spinner"></div>
              <div class="status-text" id="${id}-upload-status">Scanning Document...</div>
            </div>

            <div class="upload-icon">
              <i class="ph-bold ph-upload-simple"></i>
            </div>
            <h3 style="font-size: 18px; margin: 0 0 8px 0;">Upload Lab Reports</h3>
            <p style="opacity: 0.6; margin: 0 0 14px 0;">Drag and drop PDF, JPG, or PNG files here</p>
            <button class="primary" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1);" data-file-trigger="${id}">
              <i class="ph-bold ph-paperclip"></i> Browse Files
            </button>
            <input type="file" id="${id}-file-input" accept=".pdf,.jpg,.jpeg,.png" style="display: none;" multiple>
            <p style="font-size: 11px; opacity: 0.5; margin-top: 12px;">
              <i class="ph-fill ph-cpu"></i> AI-Powered OCR & Analysis Active
            </p>
          </div>

          <div class="section-title">
            <i class="ph-fill ph-funnel"></i> My Lab Results
            <div class="search-box">
              <i class="ph ph-magnifying-glass search-icon"></i>
              <input type="text" id="${id}-search" placeholder="Search tests (e.g. 'Glucose')...">
            </div>
          </div>

          <div class="filter-bar" id="${id}-filters">
            <button class="filter-btn active" data-filter="all">All Tests</button>
            <button class="filter-btn" data-filter="cbc">Blood Count</button>
            <button class="filter-btn" data-filter="metabolic">Metabolic</button>
            <button class="filter-btn" data-filter="lipid">Lipid Panel</button>
            <button class="filter-btn" data-filter="hormones">Hormones</button>
            <button class="filter-btn" data-filter="nutrition">Nutrition</button>
          </div>

          <div class="results-grid" id="${id}-results"></div>
        </div>
      </div>

      <div class="modal-overlay" id="${id}-modal">
        <div class="modal-content">
          <div class="modal-header">
            <div>
              <h3 style="margin: 0; font-size: 18px;" id="${id}-modal-title">Test Details</h3>
              <p style="margin: 4px 0 0 0; opacity: 0.6; font-size: 12px;">Deep Learning Analysis</p>
            </div>
            <button class="close-btn" data-close="${id}">
              <i class="ph-bold ph-x"></i>
            </button>
          </div>
          <div class="modal-body" id="${id}-modal-content"></div>
        </div>
      </div>
    `;
  }

  function computeMarker(test) {
    const span = test.max - test.min || 1;
    const offset = test.value - test.min;
    const percent = 20 + (offset / span) * 60;
    return clampPercent(percent);
  }

  function renderResults(state) {
    const grid = state.refs.results;
    grid.innerHTML = '';
    if (!state.data.length) {
      grid.innerHTML = `<div style="text-align:center; grid-column: 1/-1; padding: 40px; opacity: 0.6;">No results found for your search.</div>`;
      return;
    }

    state.data.forEach((result, index) => {
      const card = document.createElement('div');
      card.className = 'result-card';
      if (index === 0 && result.isNew) card.classList.add('new-item-animate');
      card.style.setProperty('--result-color', result.color);
      card.onclick = () => showDetail(state, result);

      const testItemsHtml = result.tests.slice(0, 3).map(test => {
        const percent = computeMarker(test);
        return `
          <div class="test-item" style="--test-color: ${test.color};">
            <div style="flex: 1; padding-right: 10px;">
              <div style="display: flex; justify-content: space-between; gap: 10px;">
                <div class="test-name">${test.name}</div>
                <div class="test-value" style="font-size: 13px;">${test.value} <small style="font-size: 10px; opacity: 0.7;">${test.unit}</small></div>
              </div>
              <div class="range-visual-container">
                <div class="range-bar-track">
                  <div class="range-bar-gradient"></div>
                  <div class="range-marker-line" style="left: ${percent}%;"></div>
                </div>
                <div class="range-labels">
                  <span>${test.min}</span>
                  <span>${test.max}</span>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');

      card.innerHTML = `
        <div class="result-header">
          <div class="result-title">
            <h3>${result.name}</h3>
            <p>${result.lab} • ${new Date(result.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
          </div>
          <span class="result-badge ${result.status}">${result.status === 'normal' ? 'Normal' : 'Review'}</span>
        </div>
        <div class="test-items">
          ${testItemsHtml}
          ${result.tests.length > 3 ? `<p style="font-size: 11px; opacity: 0.6; text-align: center; margin: 6px 0 0 0;">+${result.tests.length - 3} more tests</p>` : ''}
        </div>
        <div class="ai-analysis">
          <div class="ai-header">
            <div class="ai-icon"><i class="ph-fill ph-robot"></i></div>
            <strong style="font-size: 13px;">AI Analysis</strong>
          </div>
          <p style="font-size: 13px; line-height: 1.5; margin: 0; opacity: 0.9;">${result.ai}</p>
        </div>
      `;

      grid.appendChild(card);
    });
  }

  function setupFilters(state) {
    state.refs.filters.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.refs.filters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        const source = loadLabs();
        if (cat === 'all') state.data = [...source];
        else state.data = source.filter(item => item.category === cat);
        renderResults(state);
      });
    });
  }

  function setupSearch(state) {
    state.refs.search.addEventListener('input', e => {
      const term = e.target.value.toLowerCase();
      const source = loadLabs();
      state.data = source.filter(item => {
        const mainMatch = item.name.toLowerCase().includes(term);
        const aiMatch = item.ai.toLowerCase().includes(term);
        const testMatch = item.tests.some(t => t.name.toLowerCase().includes(term));
        return mainMatch || aiMatch || testMatch;
      });
      renderResults(state);
    });
  }

  function setupUpload(state) {
    const { zone, input, overlay, status } = state.refs;
    const startSimulation = () => {
      overlay.classList.add('active');
      status.innerText = 'Scanning Document...';
      setTimeout(() => {
        status.innerText = 'Extracting Values...';
        setTimeout(() => {
          status.innerText = 'Analyzing with AI Models...';
          setTimeout(() => {
            overlay.classList.remove('active');
            addMockResult(state);
          }, 1500);
        }, 1400);
      }, 1400);
    };

    zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragging'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('dragging'));
    zone.addEventListener('drop', e => { e.preventDefault(); zone.classList.remove('dragging'); if (e.dataTransfer.files.length) startSimulation(); });
    input.addEventListener('change', () => { if (input.files.length) startSimulation(); });
    zone.addEventListener('click', e => {
      if (e.target === zone || e.target.closest('.upload-icon')) input.click();
    });
    state.container.querySelector(`[data-file-trigger="${state.id}"]`).addEventListener('click', () => input.click());
    state.container.querySelector(`[data-export="${state.id}"]`).addEventListener('click', () => alert('Generating PDF Report for download...'));
  }

  function addMockResult(state) {
    const newResult = {
      id: Date.now(),
      name: 'Urinalysis (Complete)',
      date: new Date().toISOString(),
      lab: 'AI Scan (Uploaded)',
      category: 'metabolic',
      status: 'normal',
      color: '#10b981',
      isNew: true,
      tests: [
        { name: 'pH', value: 6.0, unit: 'pH', min: 5.0, max: 7.5, color: '#10b981', status: 'normal', history: [5.5, 6.0] },
        { name: 'Specific Gravity', value: 1.015, unit: '', min: 1.005, max: 1.030, color: '#10b981', status: 'normal', history: [1.010, 1.015] },
        { name: 'Protein', value: 0, unit: 'mg/dL', min: 0, max: 10, color: '#10b981', status: 'normal', history: [0, 0] },
        { name: 'Ketones', value: 0, unit: 'mg/dL', min: 0, max: 5, color: '#10b981', status: 'normal', history: [0, 0] }
      ],
      ai: 'Urinalysis parameters are within normal limits. Adequate hydration indicated by specific gravity.'
    };

    const latest = [newResult, ...loadLabs().map(item => ({ ...item, isNew: false }))];
    saveLabs(latest);
    state.data = [...latest];
    renderResults(state);
  }

  function showDetail(state, result) {
    const modal = state.refs.modal;
    const title = state.refs.modalTitle;
    const content = state.refs.modalContent;
    title.innerText = result.name;

    const chartTest = result.tests.find(t => t.status !== 'normal') || result.tests[0];
    content.innerHTML = `
      <div style="display: flex; gap: 18px; margin-bottom: 14px; flex-wrap: wrap;">
        <div><p style="font-size: 12px; opacity: 0.6; margin: 0;">Date</p><strong>${new Date(result.date).toLocaleDateString()}</strong></div>
        <div><p style="font-size: 12px; opacity: 0.6; margin: 0;">Lab</p><strong>${result.lab}</strong></div>
        <div><p style="font-size: 12px; opacity: 0.6; margin: 0;">Status</p><strong style="color: ${result.color};">${result.status.toUpperCase()}</strong></div>
      </div>
      <div class="chart-wrapper">
        <canvas id="${state.id}-chart"></canvas>
      </div>
      <p style="text-align: center; font-size: 12px; opacity: 0.6; margin-top: 8px;">Historical Trend: ${chartTest.name}</p>
      <div style="margin-top: 16px; background: rgba(0,0,0,0.2); padding: 16px; border-radius: 12px;">
        <h4 style="margin: 0 0 12px 0; font-size: 14px;">Detailed Results</h4>
        ${result.tests.map(test => {
          const percent = computeMarker(test);
          return `
            <div style="margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                <strong>${test.name}</strong>
                <span style="color:${test.color}">${test.value} ${test.unit}</span>
              </div>
              <div class="range-visual-container" style="height: 12px;">
                <div class="range-bar-track" style="height: 8px;">
                  <div class="range-bar-gradient"></div>
                  <div class="range-marker-line" style="left: ${percent}%;"></div>
                </div>
                <div class="range-labels">
                  <span>${test.min}</span>
                  <span style="color: ${test.color}">${test.status.toUpperCase()}</span>
                  <span>${test.max}</span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <div style="margin-top: 14px; background: linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.05)); padding: 16px; border-radius: 12px; border: 1px solid rgba(139,92,246,0.2);">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
          <div style="width: 32px; height: 32px; border-radius: 10px; background: var(--color-purple, #8b5cf6); display: flex; align-items: center; justify-content: center;">
            <i class="ph-fill ph-robot" style="font-size: 16px;"></i>
          </div>
          <strong>AI Health Recommendation</strong>
        </div>
        <p style="line-height: 1.6; margin: 0;">${result.ai}</p>
      </div>
    `;

    modal.classList.add('active');
    renderChart(state, chartTest);
  }

  function renderChart(state, testData) {
    const canvas = document.getElementById(`${state.id}-chart`);
    if (!canvas || typeof Chart === 'undefined') return;
    if (state.chart) state.chart.destroy();
    const labels = ['3 Months Ago', '2 Months Ago', '1 Month Ago', 'Current'];
    state.chart = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: `${testData.name} (${testData.unit})`,
            data: testData.history,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#1d4ed8'
          },
          {
            label: 'Max Limit',
            data: Array(labels.length).fill(testData.max),
            borderColor: 'rgba(239, 68, 68, 0.5)',
            borderWidth: 1,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false
          },
          {
            label: 'Min Limit',
            data: Array(labels.length).fill(testData.min),
            borderColor: 'rgba(239, 68, 68, 0.5)',
            borderWidth: 1,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#94a3b8' } } },
        scales: {
          y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#94a3b8' } },
          x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
        }
      }
    });
  }

  function bindModalClose(state) {
    state.refs.modal.addEventListener('click', e => {
      if (e.target.classList.contains('modal-overlay')) state.refs.modal.classList.remove('active');
    });
    state.container.querySelector(`[data-close="${state.id}"]`).addEventListener('click', () => state.refs.modal.classList.remove('active'));
  }

  function initAdvancedLabs(container) {
    const id = `labs-${Math.random().toString(36).slice(2, 8)}`;
    const pageLabel = container.dataset.page || 'dashboard';
    container.innerHTML = buildLayout(id, pageLabel);

    const refs = {
      results: container.querySelector(`#${id}-results`),
      filters: container.querySelector(`#${id}-filters`),
      search: container.querySelector(`#${id}-search`),
      zone: container.querySelector(`#${id}-upload-zone`),
      input: container.querySelector(`#${id}-file-input`),
      overlay: container.querySelector(`#${id}-upload-overlay`),
      status: container.querySelector(`#${id}-upload-status`),
      modal: container.querySelector(`#${id}-modal`),
      modalTitle: container.querySelector(`#${id}-modal-title`),
      modalContent: container.querySelector(`#${id}-modal-content`)
    };

    const state = { id, refs, container, data: [...loadLabs()], chart: null };
    renderResults(state);
    setupFilters(state);
    setupSearch(state);
    setupUpload(state);
    bindModalClose(state);
    container.dataset.labsLoaded = 'true';
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.advanced-labs').forEach(el => initAdvancedLabs(el));
  });

  window.AdvancedLabs = { init: initAdvancedLabs, reset: () => saveLabs(DEFAULT_LABS) };
})();
