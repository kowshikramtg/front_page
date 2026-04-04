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
        name: 'Open Painting Area',
        desc: 'Separation of ceramic materials.',
        type: 'ph-paint-brush-broad',
        baseTemp: 22,
        baseHumidity: 45,
        baseAirflow: 800
    },
    {
        id: 3,
        name: 'Crusher Walk-through',
        desc: 'Heavy duty rock crushing equipment.',
        type: 'ph-intersect',
        baseTemp: 80,
        baseHumidity: 20,
        baseAirflow: 200
    },
    {
        id: 4,
        name: 'Drying Equipment',
        desc: 'High-heat forced air drying chamber.',
        type: 'ph-wind',
        baseTemp: 120,
        baseHumidity: 10,
        baseAirflow: 950
    }
];

let activeDeviceId = 1;

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

window.addEventListener('DOMContentLoaded', init);
