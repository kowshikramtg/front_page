const devices = [
    {
        id: 1,
        name: 'Shot Blasting Machine',
        desc: 'Cleaning of small parts & surface preparation.',
        type: 'ph-cube',
        modelPath: 'model-optimized.glb',
        sensors: [
            { id: 'sb-temp', label: 'Temperature', unit: '°C', base: 45, noise: 5, min: 0, max: 150 },
            { id: 'sb-humidity', label: 'Humidity', unit: '%', base: 30, noise: 2, min: 0, max: 100 },
            { id: 'sb-airflow', label: 'Air Flow', unit: 'cfm', base: 500, noise: 40, min: 100, max: 1000 }
        ]
    },
    {
        id: 2,
        name: 'Engine',
        desc: 'Precision industrial combustion engine drivetrain.',
        type: 'ph-engine',
        modelPath: 'engine.glb',
        sensors: [
            { id: 'eng-oil-press', label: 'Oil Pressure', unit: 'psi', base: 42, noise: 4, min: 0, max: 100 },
            { id: 'eng-coolant-temp', label: 'Coolant Temp', unit: '°C', base: 85, noise: 3, min: 0, max: 120 },
            { id: 'eng-speed', label: 'Engine Speed', unit: 'RPM', base: 2400, noise: 120, min: 0, max: 6000 },
            { id: 'eng-fuel-flow', label: 'Fuel Flow', unit: 'l/h', base: 12, noise: 1.5, min: 0, max: 50 }
        ]
    },
    {
        id: 3,
        name: 'Battery',
        desc: 'Advanced energy storage and power stabilization module.',
        type: 'ph-battery-charging',
        modelPath: 'battery-optimized.glb',
        sensors: [
            { id: 'bat-voltage', label: 'Voltage', unit: 'V', base: 400, noise: 5, min: 300, max: 500 },
            { id: 'bat-current', label: 'Current', unit: 'A', base: 150, noise: 10, min: 0, max: 400 },
            { id: 'bat-soc', label: 'State of Charge', unit: '%', base: 82, noise: 0.5, min: 0, max: 100 },
            { id: 'bat-temp', label: 'Module Temp', unit: '°C', base: 35, noise: 2, min: 0, max: 80 }
        ]
    },
    {
        id: 4,
        name: 'Drying Equipment',
        desc: 'High-heat forced air drying chamber.',
        type: 'ph-wind',
        modelPath: 'model-optimized.glb',
        sensors: [
            { id: 'dry-chamb-temp', label: 'Chamber Temp', unit: '°C', base: 115, noise: 4, min: 0, max: 200 },
            { id: 'dry-humidity', label: 'Relative Humidity', unit: '%', base: 12, noise: 1, min: 0, max: 100 },
            { id: 'dry-air-vel', label: 'Air Velocity', unit: 'm/h', base: 850, noise: 30, min: 0, max: 2000 }
        ]
    },
    {
        id: 5,
        name: 'Electric Motor',
        desc: 'High torque industrial motor MOT-007.',
        type: 'ph-gear',
        modelPath: 'motor.glb',
        sensors: [
            { id: 'mot-air-temp', label: 'Air Temperature', unit: 'K', base: 300, noise: 4, min: 290, max: 315 },
            { id: 'mot-proc-temp', label: 'Process Temperature', unit: 'K', base: 310, noise: 5, min: 298, max: 328 },
            { id: 'mot-rot-speed', label: 'Rotational Speed', unit: 'RPM', base: 1500, noise: 80, min: 1200, max: 1800 },
            { id: 'mot-torque', label: 'Torque', unit: 'Nm', base: 45, noise: 8, min: 25, max: 72 },
            { id: 'mot-tool-wear', label: 'Tool Wear', unit: 'min', base: 120, noise: 3, min: 100, max: 250 }
        ]
    }
];

let activeDeviceId = 5; // Start with Electric Motor for the UX demo
let motorPredicted = false;

// ====== INITIALIZATION ======

function init() {
    renderDeviceList();
    
    // Set initial device
    const initialDev = devices.find(d => d.id === activeDeviceId);
    if (initialDev) selectDevice(activeDeviceId);

    // Global listeners
    initModeToggle();
    initAuthToggle();
    initSubNav();
}

function initAuthToggle() {
    const btnAuthToggle = document.getElementById('btn-auth-toggle');
    const authLocked = document.getElementById('auth-locked-container');
    const authUnlocked = document.getElementById('auth-unlocked-container');
    let isLoggedIn = false;
    if (btnAuthToggle) {
        btnAuthToggle.addEventListener('click', () => {
            isLoggedIn = !isLoggedIn;
            btnAuthToggle.innerText = isLoggedIn ? 'Logout' : 'Login';
            if (authLocked) authLocked.style.display = isLoggedIn ? 'none' : 'flex';
            if (authUnlocked) authUnlocked.style.display = isLoggedIn ? 'flex' : 'none';
        });
    }
}

function initSubNav() {
    // Back Buttons
    document.querySelectorAll('.back-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // In the unified UX, the "Home" is just the current machine dashboard
            // But we can hide sub-views if we are in one.
            hideSubViews();
        });
    });
}

function hideSubViews() {
     const subViews = ['view-model-ops', 'view-command-center', 'view-kalman-filter', 'view-pattern-miner', 'view-clustering-motors'];
     subViews.forEach(id => {
         const el = document.getElementById(id);
         if (el) el.style.display = 'none';
     });
     const dash = document.getElementById('motor-dashboard');
     if (dash) dash.style.display = 'block';
}

// ====== DEVICE SELECTION & UX ======

function renderDeviceList() {
    const scrollContainer = document.getElementById('device-scroll');
    if (!scrollContainer) return;
    scrollContainer.innerHTML = '';
    devices.forEach(dw => {
        const div = document.createElement('div');
        div.className = `device-card ${dw.id === activeDeviceId ? 'active' : ''}`;
        div.onclick = () => selectDevice(dw.id);
        div.innerHTML = `
            <div class="card-img-mock"><i class="ph ${dw.type}"></i></div>
            <div class="card-header"><h4>${dw.name}</h4><div class="status-dot"></div></div>
        `;
        scrollContainer.appendChild(div);
    });
}

function selectDevice(id) {
    activeDeviceId = id;
    renderDeviceList();
    const dev = devices.find(d => d.id === id);
    if (!dev) return;

    // Update Titles
    const dashTitle = document.querySelector('#motor-dashboard h1');
    if (dashTitle) dashTitle.innerText = dev.name;

    const motorDashboard = document.getElementById('motor-dashboard');
    
    // Trigger Space Warp Transition
    if (window.triggerSpaceWarp) {
        if (motorDashboard) motorDashboard.style.opacity = '0';
        window.triggerSpaceWarp(dev.modelPath, () => {
            if (motorDashboard) {
                motorDashboard.style.display = 'block';
                motorDashboard.style.opacity = '1';
                motorDashboard.classList.add('speed-zoom-in');
                setTimeout(() => motorDashboard.classList.remove('speed-zoom-in'), 800);
            }
            initDeviceState(dev);
            renderDeviceUI(dev);
        });
    } else {
        if (motorDashboard) motorDashboard.style.display = 'block';
        initDeviceState(dev);
        renderDeviceUI(dev);
    }

    // Reset Results UI
    const leftRes = document.getElementById('motor-results-left');
    if (leftRes) { leftRes.style.display = 'none'; leftRes.style.opacity = '0'; }
}

// ====== DYNAMIC UI RENDERING ======


function renderDeviceUI(dev) {
    const manualContainer = document.getElementById('motor-manual-inputs');
    const autoContainer = document.getElementById('motor-auto-inputs');
    const rightCol = document.getElementById('motor-results-right');
    if (!manualContainer || !autoContainer) return;

    // 1. Render Manual Inputs
    let manualHTML = `<div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">`;
    dev.sensors.forEach(s => {
        manualHTML += `
            <div class="input-field" style="display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
                <label style="flex: 0 0 160px; font-size: 0.75rem; font-weight: 800; color: var(--text-primary); text-transform: uppercase;">${s.label} (${s.unit})</label>
                <input type="number" id="input-${s.id}" value="${s.base}">
            </div>
        `;
    });
    manualHTML += `</div><button id="motor-predict-btn" class="btn-pill" style="width: 100%; padding: 1.2rem;">Predict Health</button>`;
    manualContainer.innerHTML = manualHTML;

    // 2. Render Auto Waveforms
    let autoHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <span style="font-size: 0.8rem; font-weight: 600; color: var(--text-secondary);">Live sensor feed — ${dev.sensors.length} channels active</span>
            <span class="live-badge"><span class="live-dot"></span>LIVE</span>
        </div>
        <div class="auto-sensor-section">
    `;
    dev.sensors.forEach(s => {
        autoHTML += `
            <div class="sensor-waveform-card">
                <div class="sensor-waveform-header">
                    <span class="sensor-waveform-label">${s.label}</span>
                    <span><span class="sensor-waveform-live-val" id="sv-${s.id}">${s.base}</span><span class="sensor-waveform-unit">${s.unit}</span></span>
                </div>
                <div class="sensor-canvas-wrap"><canvas id="sc-${s.id}"></canvas></div>
            </div>
        `;
    });
    autoHTML += `</div>`;
    autoContainer.innerHTML = autoHTML;

    // 3. Render Right-Col Bar Charts (Manual Mode telemetry)
    if (rightCol) {
        let barsHTML = `
            <div class="card-section" style="padding: 1.5rem; flex-grow: 1;">
                <h3 class="section-title" style="text-align: center; margin-bottom: 1.5rem; font-size: 1.1rem; color: var(--text-primary);">Live Operational Data</h3>
                <div style="display: flex; align-items: flex-end; justify-content: space-around; height: 180px; padding: 0 1rem; position: relative;">
                    <div style="position: absolute; left: 0; top: 0; bottom: 20px; width: 100%; display: flex; flex-direction: column; justify-content: space-between; border-left: 1px solid var(--border-color); padding-left: 5px;">
                        <span style="font-size: 0.7rem; color: #94a3b8;">100%-</span><span style=\"font-size: 0.7rem; color: #94a3b8;\">80%-</span><span style=\"font-size: 0.7rem; color: #94a3b8;\">60%-</span><span style=\"font-size: 0.7rem; color: #94a3b8;\">40%-</span><span style=\"font-size: 0.7rem; color: #94a3b8;\">20%-</span><span style=\"font-size: 0.7rem; color: #94a3b8;\">0%-</span>
                    </div>
        `;
        dev.sensors.slice(0, 4).forEach(s => {
            barsHTML += `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; z-index: 1;">
                    <div id="bar-${s.id}" style="width: 60px; height: 10%; background: #fbbf24; transition: height 0.5s ease; border-radius: 2px 2px 0 0;"></div>
                    <div style="font-size: 0.65rem; color: var(--text-secondary); margin-top: 10px; text-transform: uppercase; width: 60px; text-align: center;">${s.label}</div>
                </div>
            `;
        });
        barsHTML += `<div style="position: absolute; bottom: 25px; left: 0; width: 100%; border-top: 1px solid var(--border-color);"></div></div></div>`;
        
        // LSTM Score Placeholder
        barsHTML += `
            <div class="card-section" style="padding: 1.5rem; text-align: center;">
                <h3 class="section-title" style="margin-bottom: 0.5rem; font-size: 1.1rem; color: var(--text-primary);">LSTM Anomaly Score</h3>
                <p style="font-size: 0.85rem; color: var(--text-secondary);">Run prediction for anomaly score.</p>
            </div>
        `;
        rightCol.innerHTML = barsHTML;
    }

    // 4. Re-attach Predict Button Listener
    const predictBtn = document.getElementById('motor-predict-btn');
    if (predictBtn) {
        predictBtn.addEventListener('click', () => handleManualPredict(dev));
    }
}

function handleManualPredict(dev) {
    const predictBtn = document.getElementById('motor-predict-btn');
    const leftRes = document.getElementById('motor-results-left');
    if (!predictBtn) return;

    const originalText = predictBtn.innerText;
    predictBtn.innerText = 'PREDICTING...';
    predictBtn.style.opacity = '0.7';
    predictBtn.style.pointerEvents = 'none';

    setTimeout(() => {
        predictBtn.innerText = originalText;
        predictBtn.style.opacity = '1';
        predictBtn.style.pointerEvents = 'auto';

        if (leftRes) {
            leftRes.style.display = 'block';
            setTimeout(() => leftRes.style.opacity = '1', 50);
        }

        let totalDeviation = 0;
        dev.sensors.forEach(s => {
            const inputVal = parseFloat(document.getElementById(`input-${s.id}`).value) || s.base;
            totalDeviation += Math.abs(inputVal - s.base) / s.base;
        });

        const avgDev = totalDeviation / dev.sensors.length;
        let score = Math.max(10, 100 - (avgDev * 200));
        score += (Math.random() - 0.5) * 5;
        score = Math.min(100, score);

        const healthy = score >= 65;
        updatePredictionDisplay(healthy ? 'Healthy' : 'At Risk', score, healthy);
    }, 800);
}

function updatePredictionDisplay(status, score, healthy) {
    const statusEl = document.getElementById('motor-status-text');
    const scoreEl = document.getElementById('motor-health-score');
    const costEl = document.getElementById('motor-cost-failure');
    const savingsEl = document.getElementById('motor-predicted-savings');
    const recsEl = document.getElementById('motor-action-recommendations');

    if (statusEl) { statusEl.innerText = status; statusEl.style.color = healthy ? '#d97706' : '#dc2626'; }
    if (scoreEl) scoreEl.innerText = score.toFixed(2) + ' / 100';
    
    // Mock Business Impact
    const cost = healthy ? Math.round(score * 1200 + 50000) : Math.round((100 - score) * 5000 + 70000);
    const savings = Math.round(cost * 0.65);
    
    if (costEl) costEl.innerText = '₹' + cost.toLocaleString('en-IN');
    if (savingsEl) savingsEl.innerText = '₹' + savings.toLocaleString('en-IN');
    if (recsEl) recsEl.style.display = healthy ? 'none' : 'block';
}

/* =====================================================
   AUTOMATIC SENSOR MODE — Chart.js Waveform Engine
   ===================================================== */

const MAX_POINTS = 60;
let autoModeInterval = null;
let autoModeActive = false;
let sensorState = [];

function initDeviceState(dev) {
    autoModeActive = false;
    if (autoModeInterval) clearInterval(autoModeInterval);
    autoModeInterval = null;

    sensorState = dev.sensors.map(s => {
        const history = [];
        let val = s.base;
        for (let i = 0; i < MAX_POINTS; i++) {
            val = val * 0.95 + s.base * 0.05 + (Math.random() - 0.5) * s.noise * 1.5;
            val = Math.max(s.min, Math.min(s.max, val));
            history.push(parseFloat(val.toFixed(2)));
        }
        return { 
            id: `sc-${s.id}`, valId: `sv-${s.id}`, label: s.label, unit: s.unit, 
            base: s.base, noise: s.noise, min: s.min, max: s.max, 
            color: '#f59e0b', current: val, history, chart: null 
        };
    });
}

function createSensorChart(sensor) {
    const canvas = document.getElementById(sensor.id);
    if (!canvas) return null;
    const ctx2d = canvas.getContext('2d');
    const gradient = ctx2d.createLinearGradient(0, 0, 0, 120);
    gradient.addColorStop(0, sensor.color + '55');
    gradient.addColorStop(0.6, sensor.color + '18');
    gradient.addColorStop(1, sensor.color + '00');

    return new Chart(canvas, {
        type: 'line',
        data: {
            labels: sensor.history.map((_, i) => i),
            datasets: [{
                data: [...sensor.history],
                borderColor: sensor.color,
                backgroundColor: gradient,
                borderWidth: 2, fill: true, tension: 0.4, pointRadius: 0
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false, animation: false,
            plugins: { legend: { display: false } },
            scales: {
                x: { display: false },
                y: { display: true, position: 'right', grid: { display: false }, ticks: { color: '#b45309', font: { size: 9 } } }
            }
        }
    });
}

function tickSensors() {
    sensorState.forEach(sensor => {
        let next = sensor.current * 0.94 + sensor.base * 0.06 + (Math.random() - 0.5) * sensor.noise * 1.4;
        next = Math.max(sensor.min, Math.min(sensor.max, next));
        sensor.current = next;
        const valEl = document.getElementById(sensor.valId);
        if (valEl) valEl.textContent = next.toFixed(0);
        if (sensor.chart) {
            sensor.chart.data.datasets[0].data.push(parseFloat(next.toFixed(2)));
            sensor.chart.data.datasets[0].data.shift();
            sensor.chart.update('none');
        }
    });
    runAutoPrediction();
}

function runAutoPrediction() {
    if (!sensorState.length) return;
    let totalDeviation = 0;
    sensorState.forEach(s => { totalDeviation += Math.abs(s.current - s.base) / s.base; });
    const avgDev = totalDeviation / sensorState.length;
    let score = Math.max(10, 100 - (avgDev * 200));
    score = Math.min(100, score + (Math.random() - 0.5) * 5);
    updatePredictionDisplay(score >= 65 ? 'Healthy' : 'At Risk', score, score >= 65);
}

function initModeToggle() {
    const btnManual = document.getElementById('btn-mode-manual');
    const btnAuto   = document.getElementById('btn-mode-auto');
    const manualDiv = document.getElementById('motor-manual-inputs');
    const autoDiv   = document.getElementById('motor-auto-inputs');
    const resultsDiv = document.getElementById('motor-results-left');

    if (!btnManual || !btnAuto) return;

    btnManual.addEventListener('click', () => {
        if (!autoModeActive) return;
        autoModeActive = false;
        if (autoModeInterval) clearInterval(autoModeInterval);
        sensorState.forEach(s => { if (s.chart) { s.chart.destroy(); s.chart = null; } });
        btnManual.classList.add('active'); btnAuto.classList.remove('active');
        if (manualDiv) manualDiv.style.display = ''; if (autoDiv) autoDiv.style.display = 'none';
        const motorGrid = document.querySelector('.motor-grid'); if (motorGrid) motorGrid.style.gridTemplateColumns = '1fr 1fr';
        const rightCol = document.getElementById('motor-results-right'); if (rightCol) rightCol.style.display = '';
        if (resultsDiv) { resultsDiv.style.display = 'none'; resultsDiv.style.opacity = '0'; }
    });

    btnAuto.addEventListener('click', () => {
        if (autoModeActive) return;
        autoModeActive = true;
        btnAuto.classList.add('active'); btnManual.classList.remove('active');
        if (manualDiv) manualDiv.style.display = 'none'; if (autoDiv) autoDiv.style.display = '';
        const motorGrid = document.querySelector('.motor-grid'); if (motorGrid) motorGrid.style.gridTemplateColumns = '1fr';
        const rightCol = document.getElementById('motor-results-right'); if (rightCol) rightCol.style.display = 'none';
        if (resultsDiv) { resultsDiv.style.display = 'block'; resultsDiv.style.opacity = '1'; }
        requestAnimationFrame(() => {
            sensorState.forEach(s => { s.chart = createSensorChart(s); });
            autoModeInterval = setInterval(tickSensors, 800); 
        });
    });
}

// ====== ENTRY POINT ======
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
