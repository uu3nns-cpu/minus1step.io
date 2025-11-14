// ===== UI 컨트롤 =====
function switchTab(tabName) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');
    $(tabName + 'Tab').classList.add('active');
}

async function insertEmoji(emoji) {
    const t = $('thumbnailText');
    const start = t.selectionStart;
    const end = t.selectionEnd;
    t.value = t.value.substring(0, start) + emoji + t.value.substring(end);
    t.selectionStart = t.selectionEnd = start + emoji.length;
    t.focus();
    updateTextCounter();
    await generateThumbnail();
    debouncedSave();
}

function updateTextCounter() {
    const t = $('thumbnailText');
    const c = $('textCounter');
    const len = t.value.length;
    const max = t.getAttribute('maxlength');
    c.textContent = `${len} / ${max}자`;
    c.style.color = len >= max * 0.9 ? '#ffcc00' : 'rgba(255, 255, 255, 0.8)';
}

function setupSlider(sliderId, valueId, unit = 'px') {
    $(sliderId).addEventListener('input', async (e) => { 
        $(valueId).textContent = e.target.value + unit; 
        await generateThumbnail(); 
        debouncedSave();
    });
}

function initEmojis() {
    const container = document.querySelector('.emoji-picker');
    container.innerHTML = '';
    emojis.forEach(emoji => {
        const btn = document.createElement('button');
        btn.className = 'emoji-btn';
        btn.textContent = emoji;
        btn.onclick = async () => await insertEmoji(emoji);
        container.appendChild(btn);
    });
}

function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') { 
            e.preventDefault(); 
            downloadThumbnail(); 
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') { 
            e.preventDefault(); 
            randomizeStyle(); 
        }
    });
    document.querySelectorAll('.color-swatch, .emoji-btn').forEach(el => {
        el.setAttribute('tabindex', '0');
        el.setAttribute('role', 'button');
        el.addEventListener('keydown', (e) => { 
            if (e.key === 'Enter' || e.key === ' ') { 
                e.preventDefault(); 
                el.click(); 
            } 
        });
    });
}
