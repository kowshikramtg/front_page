// ====== INITIALIZATION ======

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

    // Motor Details Predict Button Logic
    const predictBtn = document.getElementById('motor-predict-btn');
    if (predictBtn) {
        predictBtn.addEventListener('click', () => {
            const leftRes = document.getElementById('motor-results-left');

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
                    setTimeout(() => leftRes.style.opacity = '1', 50);
                }
            }, 800);
        });
    }

    // Initial device
    const initialDev = devices.find(d => d.id === activeDeviceId);
    if (initialDev) selectDevice(activeDeviceId);

    initModeToggle();
    initAuthToggle();
    initSubNav();
    initAiChatbot(); // ✅ included
}

// ====== AUTH TOGGLE ======

function initAuthToggle() {
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

    // Download
    const btnDownload = document.getElementById('btn-download');
    if (btnDownload) {
        btnDownload.addEventListener('click', () => {
            window.location.href = '/account?report=MOT-007';
        });
    }

    // Share
    const btnShare = document.getElementById('btn-share');
    if (btnShare) {
        btnShare.addEventListener('click', async () => {
            const shareData = {
                title: 'SmartPredict - Motor MOT-007 Analysis',
                text: 'Check out this dashboard',
                url: window.location.href,
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch {}
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        });
    }
}

// ====== AI CHATBOT ======

function initAiChatbot() {
    const btnExpertAi = document.getElementById('btn-expert-ai');
    const aiChatModal = document.getElementById('ai-chat-modal');
    const btnCloseChat = document.getElementById('btn-close-chat');
    const chatInput = document.getElementById('chat-input');
    const btnSendChat = document.getElementById('btn-send-chat');
    const chatMessages = document.getElementById('chat-messages');
    const btnUploadPdf = document.getElementById('btn-upload-pdf');
    const hiddenPdfUpload = document.getElementById('hidden-pdf-upload');

    if (!btnExpertAi || !aiChatModal) return;

    btnExpertAi.addEventListener('click', () => {
        aiChatModal.style.display = 'flex';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    btnCloseChat.addEventListener('click', () => {
        aiChatModal.style.display = 'none';
    });

    function addMessage(text, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.textContent = text;
        msgDiv.style.padding = '0.6rem';
        msgDiv.style.marginBottom = '0.5rem';
        msgDiv.style.borderRadius = '10px';

        if (isUser) {
            msgDiv.style.background = '#4f46e5';
            msgDiv.style.color = 'white';
            msgDiv.style.alignSelf = 'flex-end';
        } else {
            msgDiv.style.background = '#f1f5f9';
        }

        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function simulateAiReply(text) {
        setTimeout(() => {
            addMessage("AI Response: Based on your input → " + text, false);
        }, 1200);
    }

    btnSendChat.addEventListener('click', () => {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, true);
        chatInput.value = '';
        simulateAiReply(text);
    });

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') btnSendChat.click();
    });

    btnUploadPdf.addEventListener('click', () => {
        hiddenPdfUpload.click();
    });

    hiddenPdfUpload.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const fileName = e.target.files[0].name;
            addMessage("Uploaded: " + fileName, true);
            simulateAiReply(fileName);
        }
    });
}

// ====== ENTRY POINT ======

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}