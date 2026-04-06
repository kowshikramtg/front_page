const devices = [
    {
        id: 1,
        name: 'Shot Blasting Machine',
        desc: 'Cleaning of small parts & surface preparation.',
        type: 'ph-cube',
        baseTemp: 45,
        baseHumidity: 30,
        baseAirflow: 500
    },
    {
        id: 2,
        name: 'Engine',
        desc: 'Precision industrial combustion engine drivetrain.',
        type: 'ph-engine',
        baseTemp: 22,
        baseHumidity: 45,
        baseAirflow: 800
    },
    {
        id: 3,
        name: 'Battery',
        desc: 'Advanced energy storage and power stabilization module.',
        type: 'ph-battery-charging',
        baseTemp: 35,
        baseHumidity: 30,
        baseAirflow: 100
    },
    {
        id: 4,
        name: 'Drying Equipment',
        desc: 'High-heat forced air drying chamber.',
        type: 'ph-wind',
        baseTemp: 120,
        baseHumidity: 10,
        baseAirflow: 950
    },
    {
        id: 5,
        name: 'Electric Motor',
        desc: 'High torque industrial motor MOT-007.',
        type: 'ph-gear',
        baseTemp: 32,
        baseHumidity: 24,
        baseAirflow: 0
    }
];

let activeDeviceId = 1;
let motorPredicted = false;

function resetMotorGraphs() {
    motorPredicted = false;
    const barRot = document.getElementById('bar-rotational-speed');
    const barTorque = document.getElementById('bar-torque');
    const barTool = document.getElementById('bar-tool-wear');
    if (barRot) barRot.style.height = '0';
    if (barTorque) barTorque.style.height = '0';
    if (barTool) barTool.style.height = '0';
}

function randomizeMotorGraphsOnInput() {
    if (motorPredicted) return;
    const barRot = document.getElementById('bar-rotational-speed');
    const barTorque = document.getElementById('bar-torque');
    const barTool = document.getElementById('bar-tool-wear');
    
    if (barRot) barRot.style.background = 'var(--accent)';
    if (barTorque) barTorque.style.background = 'var(--accent)';
    if (barTool) barTool.style.background = 'var(--accent)';
    
    if (barRot) barRot.style.height = `${Math.floor(Math.random() * 80) + 10}%`;
    if (barTorque) barTorque.style.height = `${Math.floor(Math.random() * 80) + 10}%`;
    if (barTool) barTool.style.height = `${Math.floor(Math.random() * 80) + 10}%`;

}

// DOM Elements
const scrollContainer = document.getElementById('device-scroll');
const mainTitle = document.getElementById('main-title');
const tempInput = document.getElementById('temp-input');
const humidityInput = document.getElementById('humidity-input');
const airflowInput = document.getElementById('airflow-input');

const tempVal = document.getElementById('temp-val');
const humidityVal = document.getElementById('humidity-val');
const airflowVal = document.getElementById('airflow-val');

const suggestionBox = document.getElementById('ai-suggestion-box');
const suggestionText = document.getElementById('suggestion-text');

function init() {
    renderDeviceList();
    updateDashboard();

    // Event Listeners for inputs
    if (tempInput) {
        [tempInput, humidityInput, airflowInput].forEach(input => {
            input.addEventListener('input', () => {
                updateValues();
                checkAIStatus();
            });
        });
    }

    // Equipment Cards toggle
    const cards = document.querySelectorAll('.equipment-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
        });
    });

    // 3D Model Interaction Animation (Optional fade toggle)
    const machineContainer = document.getElementById('three-container');
    const heroText = document.querySelector('.hero-text');
    const typesSection = document.querySelector('.types-section');

    if (machineContainer && heroText) {
        machineContainer.addEventListener('mousedown', () => {
            // Subtle feedback or toggle logic
        });
    }

    // Motor Details Predict Button Logic
    const predictBtn = document.getElementById('motor-predict-btn');
    if (predictBtn) {
        predictBtn.addEventListener('click', () => {
            const leftRes = document.getElementById('motor-results-left');
            
            // Mock API delay look
            const originalText = predictBtn.innerText;
            predictBtn.innerText = 'PREDICTING...';
            predictBtn.style.opacity = '0.7';
            predictBtn.style.pointerEvents = 'none';
            motorPredicted = true;

            setTimeout(() => {
                predictBtn.innerText = originalText;
                predictBtn.style.opacity = '1';
                predictBtn.style.pointerEvents = 'auto';

                if (leftRes) {
                    leftRes.style.display = 'block';
                    // small delay for transition
                    setTimeout(() => leftRes.style.opacity = '1', 50);
                }
                
                // --- ML BACKEND INTEGRATION POINT ---
                // Here is where you will make your `fetch('/api/ml-predict')` call.
                // For now, this is a mock JSON response simulating your ML output.
                const mockBackendResponse = {
                    status: 'At Risk',
                    healthScore: '17.00',
                    costOfFailure: '4,00,000',
                    predictedSavings: '3,25,000',
                    graphRotSpeedPercent: 2,   // Represents height %
                    graphTorquePercent: 100,   // Represents height %
                    graphToolWearPercent: 1,   // Represents height %
                    showRecommendations: true  // e.g., only true if status is 'At Risk'
                };

                // 1. Inject Prediction Text Results
                const statusEl = document.getElementById('motor-status-text');
                const scoreEl = document.getElementById('motor-health-score');
                const costEl = document.getElementById('motor-cost-failure');
                const savingsEl = document.getElementById('motor-predicted-savings');
                const recsEl = document.getElementById('motor-action-recommendations');
                
                if (statusEl) statusEl.innerText = mockBackendResponse.status;
                if (scoreEl) scoreEl.innerText = mockBackendResponse.healthScore + ' / 100';
                if (costEl) costEl.innerText = '₹' + mockBackendResponse.costOfFailure;
                if (savingsEl) savingsEl.innerText = '₹' + mockBackendResponse.predictedSavings;
                
                // 2. Toggle Recommendations Grid
                if (recsEl) {
                    recsEl.style.display = mockBackendResponse.showRecommendations ? 'block' : 'none';
                }

                // 3. Update Final ML Graph Values
                const barRot = document.getElementById('bar-rotational-speed');
                const barTorque = document.getElementById('bar-torque');
                const barTool = document.getElementById('bar-tool-wear');
                
                if (barRot) barRot.style.height = mockBackendResponse.graphRotSpeedPercent + '%';
                if (barTorque) barTorque.style.height = mockBackendResponse.graphTorquePercent + '%';
                if (barTool) barTool.style.height = mockBackendResponse.graphToolWearPercent + '%';

            }, 800);
        });
    }

    // Attach input listeners for motor dummy graphs
    const motorInputs = [
        document.getElementById('motor-air-temp'),
        document.getElementById('motor-proc-temp'),
        document.getElementById('motor-rot-speed'),
        document.getElementById('motor-torque'),
        document.getElementById('motor-tool-wear')
    ];
    motorInputs.forEach(input => {
        if (input) {
            input.addEventListener('input', randomizeMotorGraphsOnInput);
        }
    });

    // Drift Modal Logic
    const btnModelDrift = document.getElementById('btn-model-drift');
    const driftModal = document.getElementById('drift-modal');
    const btnCloseDrift = document.getElementById('btn-close-drift');
    
    if (btnModelDrift && driftModal && btnCloseDrift) {
        btnModelDrift.addEventListener('click', () => {
            driftModal.style.display = 'flex';
            const driftStatus = document.getElementById('drift-status-banner');

            if (motorPredicted) {
                // Render Chart.js
                renderDriftChart();
                
                if (driftStatus) {
                    driftStatus.innerText = '✓ Model is Stable';
                    driftStatus.style.color = '#854d0e';
                    driftStatus.style.background = '#fef9c3';
                    driftStatus.style.borderColor = '#fde68a';
                }



            } else {
                // Destroy chart if present
                if (window.driftChartInstance) {
                    window.driftChartInstance.destroy();
                    window.driftChartInstance = null;
                }
                
                if (driftStatus) {
                    driftStatus.innerText = 'Run Prediction to view Model Drift Analysis';
                    driftStatus.style.color = '#64748b';
                    driftStatus.style.background = '#f1f5f9';
                    driftStatus.style.borderColor = '#e2e8f0';
                }
            }
        });

        btnCloseDrift.addEventListener('click', () => {
            driftModal.style.display = 'none';
        });
    }

    // --- NEW ACTION FEATURES ---
    
    // Auth Toggle
    const btnAuthToggle = document.getElementById('btn-auth-toggle');
    const authLocked = document.getElementById('auth-locked-container');
    const authUnlocked = document.getElementById('auth-unlocked-container');
    let isLoggedIn = false;
    
    if (btnAuthToggle) {
        btnAuthToggle.addEventListener('click', () => {
            isLoggedIn = !isLoggedIn;
            if (isLoggedIn) {
                btnAuthToggle.innerText = 'Logout';
                if (authLocked) authLocked.style.display = 'none';
                if (authUnlocked) authUnlocked.style.display = 'flex';
            } else {
                btnAuthToggle.innerText = 'Login';
                if (authLocked) authLocked.style.display = 'flex';
                if (authUnlocked) authUnlocked.style.display = 'none';
            }
        });
    }

    // Download PDF 
    const btnDownload = document.getElementById('btn-download');
    if (btnDownload) {
        btnDownload.addEventListener('click', () => {
            const element = document.getElementById('motor-dashboard');
            const opt = {
              margin:       0.5,
              filename:     'Motor_MOT-007_Report.pdf',
              image:        { type: 'jpeg', quality: 0.98 },
              html2canvas:  { scale: 2, useCORS: true },
              jsPDF:        { unit: 'in', format: 'letter', orientation: 'landscape' }
            };
            
            if (window.html2pdf) {
                btnDownload.innerText = 'Generating...';
                window.html2pdf().set(opt).from(element).save().then(() => {
                    btnDownload.innerHTML = '<i class="ph-bold ph-download-simple"></i> Download';
                });
            } else {
                alert('PDF generation library not loaded.');
            }
        });
    }

    // Share link
    const btnShare = document.getElementById('btn-share');
    if (btnShare) {
        btnShare.addEventListener('click', async () => {
            const shareData = {
                title: 'SmartPredict - Motor MOT-007 Analysis',
                text: 'Check out the live operational analysis and model drift for Motor MOT-007.',
                url: window.location.href,
            };
            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {}
            } else {
                navigator.clipboard.writeText(window.location.href).then(() => {
                    alert('Dashboard Link copied to clipboard!');
                });
            }
        });
    }

    // --- VIEW ROUTER LOGIC ---
    const globalViews = [
        document.getElementById('default-dashboard'),
        document.getElementById('motor-dashboard'),
        document.getElementById('view-model-ops'),
        document.getElementById('view-command-center'),
        document.getElementById('view-kalman-filter'),
        document.getElementById('view-pattern-miner'),
        document.getElementById('view-clustering-motors')
    ];

    function showView(viewId) {
        globalViews.forEach(v => {
            if (v) v.style.display = (v.id === viewId) ? 'block' : 'none';
        });
        window.scrollTo(0, 0); // scroll to top when changing views
        
        // Render charts dynamically when opened
        if (viewId === 'view-model-ops') {
            renderOpsChart();
        } else if (viewId === 'view-kalman-filter') {
            renderKalmanChart();
        }
    }

    // Back Buttons
    document.querySelectorAll('.back-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            showView('default-dashboard');
        });
    });

    // Sub-nav Interactivity
    const lnkOps = document.getElementById('link-features-ops');
    if(lnkOps) lnkOps.addEventListener('click', (e) => { e.preventDefault(); showView('view-model-ops'); });
    
    const lnkCmd = document.getElementById('link-features-command');
    if(lnkCmd) lnkCmd.addEventListener('click', (e) => { e.preventDefault(); showView('view-command-center'); });

    const lnkKalman = document.getElementById('link-features-kalman');
    if(lnkKalman) lnkKalman.addEventListener('click', (e) => { e.preventDefault(); showView('view-kalman-filter'); });

    const lnkPatterns = document.getElementById('link-features-patterns');
    if(lnkPatterns) lnkPatterns.addEventListener('click', (e) => { e.preventDefault(); showView('view-pattern-miner'); });

    // Clustering Insights: Motor link
    const lnkClusteringMotor = document.getElementById('link-clustering-motor');
    if(lnkClusteringMotor) lnkClusteringMotor.addEventListener('click', (e) => {
        e.preventDefault();
        showView('view-clustering-motors');
        const emptyState = document.getElementById('cluster-empty-state');
        const chartWrapper = document.getElementById('cluster-chart-wrapper');
        if (motorPredicted) {
            // Read values from the motor dashboard inputs
            const rotSpeed = parseFloat(document.getElementById('motor-rot-speed').value) || 1500;
            const torque   = parseFloat(document.getElementById('motor-torque').value)    || 45;
            const toolWear = parseFloat(document.getElementById('motor-tool-wear').value) || 120;
            const airTemp  = parseFloat(document.getElementById('motor-air-temp').value)  || 300;
            const procTemp = parseFloat(document.getElementById('motor-proc-temp').value) || 310;
            if(emptyState) emptyState.style.display = 'none';
            if(chartWrapper) chartWrapper.style.display = 'block';
            renderClusterChart({ rotSpeed, torque, toolWear, airTemp, procTemp });
        } else {
            // No prediction yet — show empty state, hide chart
            if(emptyState) emptyState.style.display = 'flex';
            if(chartWrapper) chartWrapper.style.display = 'none';
            if(window.clusterChartInstance) { window.clusterChartInstance.destroy(); window.clusterChartInstance = null; }
        }
    });

    // Existing device links
    const equipCards = document.querySelectorAll('.equipment-card');
    equipCards.forEach((c) => {
        c.addEventListener('click', () => {
            showView('motor-dashboard');
        });
    });

}

window.driftChartInstance = null;
window.opsDriftChartInstance = null;
window.kalmanChartInstance = null;

function renderOpsChart() {
    const ctx = document.getElementById('opsDriftChart');
    if (!ctx) return;
    
    if (window.opsDriftChartInstance) {
        window.opsDriftChartInstance.destroy();
    }
    
    const labels = ['0', '3.8', '7.7', '11.5', '16.0', '20.5', '24.0', '28.2', '31.5', '35.9', '40.0', '43.6', '47.5', '51.3', '55.0', '59.0', '63.0', '66.7', '70.5', '74.4', '78.1', '82.1', '86.0', '89.7', '94.0', '97.5', '100.0'];
    const trainingData = [12, 18, 24, 11, 26, 35, 18, 16, 18, 19, 17, 26, 14, 23, 19, 25, 16, 28, 17, 15, 27, 14, 15, 23, 20, 26, 11];
    const liveData = [13, 27, 18, 10, 19, 21, 18, 26, 26, 13, 22, 31, 25, 12, 22, 18, 33, 17, 21, 30, 14, 21, 12, 19, 29, 23, 19];

    window.opsDriftChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Training Data', data: trainingData, borderColor: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderWidth: 1.5, fill: 'start', tension: 0.4, pointRadius: 0 },
                { label: 'Live Data', data: liveData, borderColor: '#ea580c', backgroundColor: 'rgba(234, 88, 12, 0.15)', borderWidth: 1.5, fill: 'start', tension: 0.4, pointRadius: 0 }



            ]
        },

        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, max: 40, ticks: { stepSize: 9 } },
                x: { grid: { display: true, color: '#f1f5f9' }, ticks: { maxTicksLimit: 12 } }
            }
        }
    });
}

function renderKalmanChart() {
    const ctx = document.getElementById('kalmanChart');
    if (!ctx) return;
    if (window.kalmanChartInstance) window.kalmanChartInstance.destroy();
    
    const labels = []; const rawData = []; const maData = []; const kalmanData = [];
    
    for(let i=0; i<=100; i++) {
        labels.push(`${i}s`);
        let base = i * 0.3 + 50;
        let noise = (Math.random() - 0.5) * 20; 
        let raw = base + noise;
        rawData.push(raw);
        let ma = raw;
        if(i > 0 && maData[i-1]) ma = maData[i-1] * 0.8 + raw * 0.2;
        maData.push(ma - 5);
        kalmanData.push(base); 
    }

    window.kalmanChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                { label: 'Raw Noisy Signal', data: rawData, borderColor: 'rgba(180, 120, 20, 0.15)', borderWidth: 1.2, tension: 0.1, pointRadius: 0 },
                { label: 'Moving Average (Lagging)', data: maData, borderColor: '#fbbf24', borderWidth: 1.5, tension: 0.4, pointRadius: 0 },
                { label: 'Kalman Filter (More Accurate)', data: kalmanData, borderColor: '#f59e0b', borderWidth: 2, tension: 0.3, pointRadius: 0 }



            ]

        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { min: 45, max: 105, ticks: { stepSize: 15 } },
                x: { 
                    grid: { display: true, color: '#f1f5f9' },
                    ticks: { callback: function(val, index) {
                        return index % 5 === 0 ? this.getLabelForValue(val) : '';
                    } }
                }
            }
        }
    });
}

function renderDriftChart() {
    const canvas = document.getElementById('driftChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    if (window.driftChartInstance) {
        window.driftChartInstance.destroy();
    }
    
    // Explicitly crafted array to mirror the exact distribution shape in the reference image (organic model drift) instead of raw RNG noise.
    const labels = ['0', '2.6', '7.7', '12.8', '17.1', '20.5', '24.0', '28.2', '31.5', '35.9', '40.0', '43.6', '47.5', '51.3', '55.0', '59.0', '63.0', '66.7', '70.5', '74.4', '78.1', '82.1', '86.0', '89.7', '94.0', '97.5', '100.0'];
    const trainingData = [12, 18, 24, 11, 26, 35, 18, 16, 18, 19, 17, 26, 14, 23, 19, 25, 16, 28, 17, 15, 27, 14, 15, 23, 20, 26, 11];
    const liveData = [13, 27, 18, 10, 19, 21, 18, 26, 26, 13, 22, 31, 25, 12, 22, 18, 33, 17, 21, 30, 14, 21, 12, 19, 29, 23, 19];

    window.driftChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Training Data',
                    data: trainingData,
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)', 
                    borderWidth: 1.5,
                    fill: 'start',
                    tension: 0.4, 
                    pointRadius: 0,
                    pointHoverRadius: 4
                },
                {
                    label: 'Live Data',
                    data: liveData,
                    borderColor: '#ea580c',
                    backgroundColor: 'rgba(234, 88, 12, 0.1)', 
                    borderWidth: 1.5,
                    fill: 'start',
                    tension: 0.4,
                    pointRadius: 0,

                    backgroundColor: 'rgba(244, 169, 168, 0.1)', 
                    borderWidth: 1.5,
                    fill: 'start',
                    tension: 0.4,
                    pointRadius: 0,


                    pointHoverRadius: 4
                }

            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: { enabled: true }
            },
            scales: {
                x: {
                    grid: { display: true, color: '#f1f5f9' }, // Show vertical tracks
                    ticks: { 
                        color: '#94a3b8', 
                        font: { size: 10 },
                        maxRotation: 0,
                        autoSkipPadding: 10
                    },
                    border: { display: false }
                },
                y: {
                    min: 0, max: 36,
                    grid: { display: true, color: '#f1f5f9' }, // Show horizontal tracks
                    ticks: { stepSize: 9, color: '#94a3b8', font: { size: 10 } },
                    border: { display: false }
                }
            }
        }
    });
}

function renderDeviceList() {
    if (!scrollContainer) return;
    scrollContainer.innerHTML = '';
    devices.forEach(dw => {
        const div = document.createElement('div');
        div.className = `device-card ${dw.id === activeDeviceId ? 'active' : ''}`;
        div.onclick = () => selectDevice(dw.id);

        div.innerHTML = `
            <div class="card-img-mock">
                <i class="ph ${dw.type}"></i>
            </div>
            <div class="card-header">
                <h4>${dw.name}</h4>
                <div class="status-dot"></div>
            </div>
        `;
        scrollContainer.appendChild(div);
    });
}

function selectDevice(id) {
    activeDeviceId = id;
    renderDeviceList();
    const dev = devices.find(d => d.id === id);
    if (mainTitle) mainTitle.innerText = dev.name;

    const defaultDashboard = document.getElementById('default-dashboard');
    const motorDashboard = document.getElementById('motor-dashboard');
    
    if (id === 5) {
        if (defaultDashboard) defaultDashboard.style.display = 'none';
        
        // TRIGGER SPACE WARP
        if (window.triggerSpaceWarp) {
            // Hide motor dashboard initially to allow warp to finish
            if (motorDashboard) motorDashboard.style.display = 'none';
            
            window.triggerSpaceWarp('motor.glb', () => {
                if (motorDashboard) {
                    motorDashboard.style.display = 'block';
                    motorDashboard.classList.add('speed-zoom-in');
                    setTimeout(() => motorDashboard.classList.remove('speed-zoom-in'), 800);
                }
                resetMotorGraphs();
            });
        } else {
            // Fallback if three-app.js not loaded properly
            if (motorDashboard) motorDashboard.style.display = 'block';
            resetMotorGraphs();
        }
        
        // Reset results on revisit
        const leftRes = document.getElementById('motor-results-left');
        if (leftRes) leftRes.style.display = 'none';
        const predictBtn = document.getElementById('motor-predict-btn');
        if (predictBtn) {
            predictBtn.innerText = 'PREDICT HEALTH';
            predictBtn.style.opacity = '1';
            predictBtn.style.pointerEvents = 'auto';
        }
    } else {
        if (defaultDashboard) defaultDashboard.style.display = 'block';
        if (motorDashboard) motorDashboard.style.display = 'none';
    }

    // Trigger 3D Model Switch
    if (id !== 5 && window.loadMachineModel) {
        let modelPath = 'model-optimized.glb';
        if (id === 2) modelPath = 'engine.glb';
        if (id === 3) modelPath = 'battery-optimized.glb';
        window.loadMachineModel(modelPath);
    }
    
    // Safety check just in case the renderer fails or needs stopping
    const machineContainer = document.getElementById('three-container');
    if (id === 5) {
        if (machineContainer) machineContainer.style.display = 'none';
    } else {
        if (machineContainer) machineContainer.style.display = 'block';
    }

    // Reset inputs based on device base values
    if (tempInput) {
        tempInput.value = dev.baseTemp;
        humidityInput.value = dev.baseHumidity;
        airflowInput.value = dev.baseAirflow;

        updateValues();
        checkAIStatus();
    }
}

function updateValues() {
    if (!tempVal) return;
    tempVal.innerText = tempInput.value;
    humidityVal.innerText = humidityInput.value;
    airflowVal.innerText = airflowInput.value;
}

function updateDashboard() {
    updateValues();
    checkAIStatus();
}

function checkAIStatus() {
    if (!tempInput) return;
    const temp = parseInt(tempInput.value);
    const hud = parseInt(humidityInput.value);
    const dev = devices.find(d => d.id === activeDeviceId);

    let danger = false;
    let reason = [];

    // Simple mock logic for thresholds
    if (temp > dev.baseTemp * 1.5) {
        danger = true;
        reason.push(`Temperature is ${temp}°C, exceeding safe threshold. Increase cooling systems.`);
    }

    if (hud > 80) {
        danger = true;
        reason.push(`Humidity is critically high (${hud}%). Activate dehumidifiers.`);
    }

    if (danger) {
        suggestionBox.classList.remove('hidden');
        suggestionText.innerText = reason.join(" ");
        const activeCardDot = document.querySelector('.device-card.active .status-dot');
        if (activeCardDot) activeCardDot.classList.add('danger');
    } else {
        suggestionBox.classList.add('hidden');
        const activeCardDot = document.querySelector('.device-card.active .status-dot');
        if (activeCardDot) activeCardDot.classList.remove('danger');
    }
}

// ====== CLUSTERING PAGE LOGIC ======

window.clusterChartInstance = null;

function renderClusterChart({ rotSpeed, torque, toolWear, airTemp, procTemp }) {
    function gauss(mean, std) {
        const u = 1 - Math.random();
        const v = Math.random();
        return mean + std * Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    }

    const baseSpeed  = Math.max(rotSpeed, 100);
    const baseTorque = Math.max(torque, 5);

    // Cluster 0 — Standard Operation: moderate speed, lower torque
    const cluster0 = Array.from({length: 22}, () => ({
        x: parseFloat(gauss(baseSpeed * 0.75, baseSpeed * 0.06).toFixed(1)),
        y: parseFloat(gauss(baseTorque * 0.65, baseTorque * 0.08).toFixed(1))
    }));

    // Cluster 1 — High Stress: higher speed & torque
    const cluster1 = Array.from({length: 18}, () => ({
        x: parseFloat(gauss(baseSpeed * 1.1, baseSpeed * 0.05).toFixed(1)),
        y: parseFloat(gauss(baseTorque * 1.2, baseTorque * 0.09).toFixed(1))
    }));

    // Cluster 2 — Failure Prone: lower speed, high torque stress (anchored to user's actual point)
    const cluster2 = Array.from({length: 14}, () => ({
        x: parseFloat(gauss(baseSpeed * 0.6, baseSpeed * 0.07).toFixed(1)),
        y: parseFloat(gauss(baseTorque * 1.45, baseTorque * 0.1).toFixed(1))
    }));

    // Add the user's actual motor reading as a highlighted point in cluster 2 (failure-prone zone)
    cluster2.push({ x: rotSpeed, y: torque });

    const ctx = document.getElementById('clusterScatterChart');
    if (!ctx) return;

    if (window.clusterChartInstance) {
        window.clusterChartInstance.destroy();
    }

    window.clusterChartInstance = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Cluster 0: Standard',
                    data: cluster0,
                    backgroundColor: 'rgba(163, 177, 138, 0.75)',
                    borderColor: '#a3b18a',
                    borderWidth: 1,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'Cluster 1: High Stress',
                    data: cluster1,
                    backgroundColor: 'rgba(233, 196, 106, 0.8)',
                    borderColor: '#e9c46a',
                    borderWidth: 1,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },

                {
                    label: 'Cluster 2: Failure Prone',
                    data: cluster2,
                    backgroundColor: 'rgba(244, 169, 168, 0.75)',
                    borderColor: '#f4a9a8',
                    borderWidth: 1,
                    pointRadius: 6,
                    pointHoverRadius: 8
                },
                {
                    label: 'MOT-007 (Your Motor)',
                    data: [{ x: rotSpeed, y: torque }],
                    backgroundColor: '#3f3f46',
                    borderColor: '#e9c46a',
                    borderWidth: 2,
                    pointRadius: 9,
                    pointHoverRadius: 12,
                    pointStyle: 'star'
                }

            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const ds = context.dataset.label;
                            return `${ds} — Speed: ${context.parsed.x} RPM, Torque: ${context.parsed.y} Nm`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: 'Rotational Speed (RPM)', font: { size: 11, weight: '600' }, color: '#64748b' },
                    grid: { color: '#f1f5f9' },
                    ticks: { color: '#94a3b8', font: { size: 10 } }
                },
                y: {
                    title: { display: true, text: 'Torque (Nm)', font: { size: 11, weight: '600' }, color: '#64748b' },
                    grid: { color: '#f1f5f9' },
                    ticks: { color: '#94a3b8', font: { size: 10 } }
                }
            }
        }
    });
}

window.addEventListener('DOMContentLoaded', init);

/* =====================================================
   AUTOMATIC SENSOR MODE — Chart.js Waveform Engine
   ===================================================== */

const SENSOR_CONFIG = [
    { id: 'sc-air-temp',  valId: 'sv-air-temp',  label: 'Air Temp',      base: 300,  noise: 4,   min: 290,  max: 315,  color: '#f59e0b', unit: 'K'   },
    { id: 'sc-proc-temp', valId: 'sv-proc-temp', label: 'Process Temp',  base: 310,  noise: 5,   min: 298,  max: 328,  color: '#ea580c', unit: 'K'   },
    { id: 'sc-rot-speed', valId: 'sv-rot-speed', label: 'Rot. Speed',    base: 1500, noise: 80,  min: 1200, max: 1800, color: '#d97706', unit: 'RPM' },
    { id: 'sc-torque',    valId: 'sv-torque',    label: 'Torque',        base: 45,   noise: 8,   min: 25,   max: 72,   color: '#b45309', unit: 'Nm'  },
    { id: 'sc-tool-wear', valId: 'sv-tool-wear', label: 'Tool Wear',     base: 120,  noise: 3,   min: 100,  max: 250,  color: '#92400e', unit: 'min' },
];

const MAX_POINTS = 60;
let autoModeInterval = null;
let autoModeActive = false;

// Build initial warm-up history for each sensor
const sensorState = SENSOR_CONFIG.map(cfg => {
    const history = [];
    let val = cfg.base;
    for (let i = 0; i < MAX_POINTS; i++) {
        val = val * 0.95 + cfg.base * 0.05 + (Math.random() - 0.5) * cfg.noise * 1.5;
        val = Math.max(cfg.min, Math.min(cfg.max, val));
        history.push(parseFloat(val.toFixed(2)));
    }
    return { ...cfg, current: val, history, chart: null };
});

// ── Create Chart.js instance for a sensor ─────────────────────────────────────
function createSensorChart(sensor) {
    const canvas = document.getElementById(sensor.id);
    if (!canvas) return null;

    // Build gradient using the canvas context
    const ctx2d = canvas.getContext('2d');
    const gradient = ctx2d.createLinearGradient(0, 0, 0, 120);
    gradient.addColorStop(0, sensor.color + '55');
    gradient.addColorStop(0.6, sensor.color + '18');
    gradient.addColorStop(1, sensor.color + '00');

    const labels = sensor.history.map((_, i) => i);

    return new Chart(canvas, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: [...sensor.history],
                borderColor: sensor.color,
                backgroundColor: gradient,
                borderWidth: 2.2,
                fill: true,
                tension: 0.42,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: sensor.color,
                pointHoverBorderColor: '#fff',
                pointHoverBorderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: { display: false },
                tooltip: {
                    enabled: true,
                    backgroundColor: '#451a03',
                    titleColor: '#fde68a',
                    bodyColor: '#fff',
                    padding: 10,
                    cornerRadius: 8,
                    callbacks: {
                        title: () => sensor.label,
                        label: ctx => `${ctx.parsed.y.toFixed(2)} ${sensor.unit}`
                    }
                }
            },
            scales: {
                x: {
                    display: false,
                    grid: { display: false }
                },
                y: {
                    display: true,
                    position: 'right',
                    grid: { color: 'rgba(180,120,20,0.07)', drawBorder: false },
                    ticks: {
                        color: '#b45309',
                        font: { size: 9, weight: '600' },
                        maxTicksLimit: 4,
                        callback: v => v.toFixed(0)
                    },
                    border: { display: false }
                }
            }
        }
    });
}

// ── Tick: advance sensor values, update Chart.js data ─────────────────────────
function tickSensors() {
    sensorState.forEach(sensor => {
        // Realistic drift + noise with mean-reversion toward base
        let next = sensor.current * 0.94 + sensor.base * 0.06
                 + (Math.random() - 0.5) * sensor.noise * 1.4;
        next = Math.max(sensor.min, Math.min(sensor.max, next));
        sensor.current = next;

        // Update live value badge
        const valEl = document.getElementById(sensor.valId);
        if (valEl) valEl.textContent = next.toFixed(0);

        // Push to Chart.js data (shift oldest off)
        if (sensor.chart) {
            sensor.chart.data.labels.push(sensor.chart.data.labels.length);
            sensor.chart.data.labels.shift();
            sensor.chart.data.datasets[0].data.push(parseFloat(next.toFixed(2)));
            sensor.chart.data.datasets[0].data.shift();
            sensor.chart.update('none'); // no animation for smooth scrolling feel
        }
    });

    runAutoPrediction();
}

// ── Continuous prediction → drives existing right-column prediction panel ─────
function runAutoPrediction() {
    const airTemp  = sensorState[0].current;
    const procTemp = sensorState[1].current;
    const rotSpeed = sensorState[2].current;
    const torque   = sensorState[3].current;
    const toolWear = sensorState[4].current;

    const tempDiff = procTemp - airTemp;
    let score = 100;
    if (torque > 60)       score -= 26;
    else if (torque > 50)  score -= 14;
    else if (torque > 45)  score -= 8;
    if (rotSpeed < 1350)   score -= 18;
    else if (rotSpeed > 1700) score -= 10;
    if (toolWear > 200)    score -= 22;
    else if (toolWear > 160) score -= 12;
    if (tempDiff > 14)     score -= 16;
    else if (tempDiff > 10) score -= 8;
    // tiny live wobble so the number feels alive
    score += (Math.random() - 0.5) * 5;
    score = Math.max(5, Math.min(100, score));

    const healthy = score >= 65;
    const statusLabel = healthy ? 'Healthy' : 'At Risk';

    // Cost model matching the reference image values
    const costFailure = healthy
        ? Math.round(score * 1400 + 60000)
        : Math.round((100 - score) * 5800 + 80000);
    const savings = Math.round(costFailure * (healthy ? 0.72 : 0.60));

    // ── Update right-column panel (same IDs as manual mode) ──────────────────
    const motorResultsDiv = document.getElementById('motor-results-left');
    if (motorResultsDiv) {
        motorResultsDiv.style.display = '';
        motorResultsDiv.style.opacity = '1';
    }

    const statusEl = document.getElementById('motor-status-text');
    if (statusEl) {
        statusEl.textContent = statusLabel;
        statusEl.style.color = healthy ? '#d97706' : '#dc2626';
    }

    const healthEl = document.getElementById('motor-health-score');
    if (healthEl) healthEl.textContent = score.toFixed(2) + ' / 100';

    const costEl = document.getElementById('motor-cost-failure');
    if (costEl) costEl.textContent = '₹' + costFailure.toLocaleString('en-IN');

    const savingsEl = document.getElementById('motor-predicted-savings');
    if (savingsEl) savingsEl.textContent = '₹' + savings.toLocaleString('en-IN');

    // Also show recommendations section
    const recDiv = document.getElementById('motor-action-recommendations');
    if (recDiv) recDiv.style.display = '';
}

// ── Mode toggle wiring ─────────────────────────────────────────────────────────
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
        clearInterval(autoModeInterval);
        autoModeInterval = null;

        // Destroy Chart.js instances so canvases are clean on re-enter
        sensorState.forEach(s => {
            if (s.chart) { s.chart.destroy(); s.chart = null; }
        });

        btnManual.classList.add('active');
        btnAuto.classList.remove('active');
        manualDiv.style.display = '';
        autoDiv.style.display = 'none';

        // Restore right panel and grid for manual mode
        const motorGrid = document.querySelector('.motor-grid');
        if (motorGrid) motorGrid.style.gridTemplateColumns = '1fr 1fr';
        const rightCol = document.getElementById('motor-results-right');
        if (rightCol) rightCol.style.display = '';

        // Hide left results panel until manual predict is clicked
        if (resultsDiv) { resultsDiv.style.display = 'none'; resultsDiv.style.opacity = '0'; }
    });

    btnAuto.addEventListener('click', () => {
        if (autoModeActive) return;
        autoModeActive = true;

        btnAuto.classList.add('active');
        btnManual.classList.remove('active');
        manualDiv.style.display = 'none';
        autoDiv.style.display = '';

        // Hide right panel and set full width for sensor graphs in auto mode
        const motorGrid = document.querySelector('.motor-grid');
        if (motorGrid) motorGrid.style.gridTemplateColumns = '1fr';
        const rightCol = document.getElementById('motor-results-right');
        if (rightCol) rightCol.style.display = 'none';

        // Create Chart.js instances on the next frame (canvases now visible)
        requestAnimationFrame(() => {
            sensorState.forEach(s => { s.chart = createSensorChart(s); });
            tickSensors();                                   // immediate first tick
            autoModeInterval = setInterval(tickSensors, 800); // ~1.25 fps feels natural
        });
    });
}

document.addEventListener('DOMContentLoaded', initModeToggle);



