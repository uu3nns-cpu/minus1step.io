        getElement('strokeControls').style.display = e.target.checked ? 'block' : 'none';
        saveSettings();
        generateThumbnail();
    });
    
    getElement('canvasBorder').addEventListener('change', (e) => {
        getElement('borderControls').style.display = e.target.checked ? 'block' : 'none';
        saveSettings();
        generateThumbnail();
    });
}

// ===== 이모지 생성 =====
function initEmojis() {
    const container = document.querySelector('.emoji-picker');
    container.innerHTML = '';
    emojis.forEach(emoji => {
        const btn = document.createElement('button');
        btn.className = 'emoji-btn';
        btn.textContent = emoji;
        btn.onclick = () => insertEmoji(emoji);
        container.appendChild(btn);
    });
}

// ===== 초기화 =====
window.addEventListener('load', async () => {
    initColorPalettes();
    initEmojis();
    loadRecentColors();
    await loadSettings();
    updateTextCounter();
    updateRecentColorsUI();
    generateThumbnail();
    setupEventListeners();
    setupKeyboardNavigation();
});
