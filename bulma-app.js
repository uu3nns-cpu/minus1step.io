// ===== 데이터 =====
const colorPalettes = {
    background: ['#667eea', '#f093fb', '#00c6ff', '#ff6b6b', '#11998e', '#ffeaa7', '#2c3e50', '#1a1a2e', '#ee0979', '#764ba2', '#0072ff', '#38ef7d', '#feca57', '#fab1a0', '#34495e', '#dfe6e9'],
    text: ['#ffffff', '#000000', '#333333', '#ffff00', '#00ff88', '#ff6b6b', '#667eea', '#2d3436', '#f5f5f5', '#1a1a1a', '#feca57', '#00c6ff', '#ee0979', '#38ef7d', '#fab1a0', '#764ba2'],
    stroke: ['#000000', '#ffffff', '#333333', '#ffff00', '#ff0000', '#00ff00', '#0000ff', '#ff6b6b', '#667eea', '#2c3e50', '#1a1a2e', '#764ba2', '#ee0979', '#38ef7d', '#fab1a0', '#feca57'],
    border: ['#ffffff', '#000000', '#667eea', '#f093fb', '#ff6b6b', '#feca57', '#00c6ff', '#38ef7d', '#764ba2', '#2c3e50', '#ffff00', '#00ff88', '#ee0979', '#fab1a0', '#1a1a2e', '#dfe6e9']
};

const presets = {
    modern: { bgColor: '#667eea', textColor: '#ffffff', gradient: true, gradientColor: '#764ba2', fontFamily: "'Noto Sans KR', sans-serif" },
    gradient: { bgColor: '#f093fb', textColor: '#ffffff', gradient: true, gradientColor: '#f5576c', fontFamily: "'Gothic A1', sans-serif" },
    minimal: { bgColor: '#ffffff', textColor: '#333333', gradient: false, fontFamily: "'Noto Sans KR', sans-serif" },
    bold: { bgColor: '#000000', textColor: '#ffff00', gradient: false, fontFamily: "'Black Han Sans', sans-serif" },
    ocean: { bgColor: '#00c6ff', textColor: '#ffffff', gradient: true, gradientColor: '#0072ff', fontFamily: "'Sunflower', sans-serif" },
    sunset: { bgColor: '#ff6b6b', textColor: '#ffffff', gradient: true, gradientColor: '#feca57', fontFamily: "'Jua', sans-serif" },
    neon: { bgColor: '#000000', textColor: '#00ff88', gradient: false, fontFamily: "'Gugi', cursive", textStroke: true, strokeColor: '#00ff88', strokeWidth: 3 },
    pastel: { bgColor: '#ffeaa7', textColor: '#2d3436', gradient: true, gradientColor: '#fab1a0', fontFamily: "'Hi Melody', cursive" },
    vintage: { bgColor: '#d4a574', textColor: '#3e2723', gradient: false, fontFamily: "'Nanum Myeongjo', serif", canvasBorder: true, borderColor: '#8d6e63', borderWidth: 30 },
    dark: { bgColor: '#1a1a2e', textColor: '#0f4c75', gradient: true, gradientColor: '#16213e', fontFamily: "'Gothic A1', sans-serif", textStroke: true, strokeColor: '#ffffff', strokeWidth: 2 },
    nature: { bgColor: '#11998e', textColor: '#ffffff', gradient: true, gradientColor: '#38ef7d', fontFamily: "'Single Day', cursive" },
    candy: { bgColor: '#ff6ec4', textColor: '#ffffff', gradient: true, gradientColor: '#7873f5', fontFamily: "'Cute Font', cursive" }
};

const ratios = { '1:1': [1000, 1000], '9:16': [1080, 1920], '3:4': [1080, 1440], '4:3': [1440, 1080], '16:9': [1920, 1080] };

const emojis = ['✨', '🔥', '💡', '🎉', '❤️', '🚀', '🌟', '👍', '💯', '🎯', '💬', '📚', '✅', '🔔', '🎨', '😀', '😊', '😍', '🥰', '😎', '🤩', '😭', '🤔', '😱'];

let currentPreset = 'modern', currentRatio = '1:1', recentColors = [];
const MAX_RECENT_COLORS = 8;

// ===== 유틸리티 =====
const debounce = (func, delay = 300) => {
    let timer;
    return (...args) => { clearTimeout(timer); timer = setTimeout(() => func(...args), delay); };
};
const $ = (id) => document.getElementById(id);
const val = (id) => $(id).value;
const setVal = (id, v) => { $(id).value = v; };

// ===== 폰트 로드 =====
async function ensureFontLoaded(fontFamily) {
    const fontName = fontFamily.match(/'([^']+)'/)?.[1] || fontFamily.split(',')[0].trim();
    const sel = $('fontFamily');
    const fontWeight = sel.options[sel.selectedIndex].getAttribute('data-weight') || '400';
    try {
        await document.fonts.load(`${fontWeight} 16px "${fontName}"`);
        console.log(`Font loaded: ${fontName} ${fontWeight}`);
    } catch (e) {
        console.warn(`Font loading failed:`, e);
        await new Promise(r => setTimeout(r, 100));
    }
}

// ===== 색상 관리 =====
function setupColorInput(colorId, textId) {
    const c = $(colorId), t = $(textId);
    c.addEventListener('input', (e) => { t.value = e.target.value; addToRecentColors(e.target.value); saveSettings(); generateThumbnail(); });
    t.addEventListener('input', (e) => { if (/^#[0-9A-F]{6}$/i.test(e.target.value)) { c.value = e.target.value; addToRecentColors(e.target.value); generateThumbnail(); } });
}

function createColorPalette(paletteId, targetColorId, targetTextId, colors) {
    const palette = $(paletteId);
    colors.forEach(color => {
        const s = document.createElement('div');
        s.className = 'color-swatch';
        s.style.background = color;
        s.onclick = () => { setVal(targetColorId, color); setVal(targetTextId, color); generateThumbnail(); };
        palette.appendChild(s);
    });
}

function initColorPalettes() {
    createColorPalette('bgPalette', 'bgColor', 'bgColorText', colorPalettes.background);
    createColorPalette('textPalette', 'textColor', 'textColorText', colorPalettes.text);
    createColorPalette('strokePalette', 'strokeColor', 'strokeColorText', colorPalettes.stroke);
    createColorPalette('borderPalette', 'borderColor', 'borderColorText', colorPalettes.border);
}

function addToRecentColors(color) {
    recentColors = recentColors.filter(c => c !== color);
    recentColors.unshift(color);
    if (recentColors.length > MAX_RECENT_COLORS) recentColors = recentColors.slice(0, MAX_RECENT_COLORS);
    localStorage.setItem('recentColors', JSON.stringify(recentColors));
    updateRecentColorsUI();
}

function updateRecentColorsUI() {
    const container = $('recentColors');
    container.innerHTML = '';
    if (recentColors.length === 0) {
        const p = document.createElement('p');
        p.className = 'help has-text-white';
        p.style.cssText = 'text-align: center; width: 100%';
        p.textContent = '사용한 색상이 여기에 표시됩니다';
        container.appendChild(p);
        return;
    }
    recentColors.forEach(color => {
        const s = document.createElement('div');
        s.className = 'recent-color-swatch';
        s.style.background = color;
        s.setAttribute('tabindex', '0');
        s.setAttribute('role', 'button');
        s.onclick = () => { setVal('bgColor', color); setVal('bgColorText', color); saveSettings(); generateThumbnail(); };
        s.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); s.click(); } });
        container.appendChild(s);
    });
}

function loadRecentColors() {
    const saved = localStorage.getItem('recentColors');
    if (saved) try { recentColors = JSON.parse(saved); } catch (e) { recentColors = []; }
}

// ===== UI 컨트롤 =====
function switchTab(tabName) {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');
    $(tabName + 'Tab').classList.add('active');
}

function insertEmoji(emoji) {
    const t = $('thumbnailText'), start = t.selectionStart, end = t.selectionEnd;
    t.value = t.value.substring(0, start) + emoji + t.value.substring(end);
    t.selectionStart = t.selectionEnd = start + emoji.length;
    t.focus();
    saveSettings();
    generateThumbnail();
}

function updateTextCounter() {
    const t = $('thumbnailText'), c = $('textCounter'), len = t.value.length, max = t.getAttribute('maxlength');
    c.textContent = `${len} / ${max}자`;
    c.style.color = len >= max * 0.9 ? '#ffcc00' : 'rgba(255, 255, 255, 0.8)';
}

function setupSlider(sliderId, valueId, unit = 'px') {
    $(sliderId).addEventListener('input', (e) => { $(valueId).textContent = e.target.value + unit; saveSettings(); generateThumbnail(); });
}

// ===== 프리셋 =====
async function applyPreset(presetName) {
    document.querySelectorAll('.preset-btn, .preset-btn-compact').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.preset-btn, .preset-btn-compact').classList.add('active');
    const preset = presets[presetName];
    currentPreset = presetName;
    setVal('bgColor', preset.bgColor); setVal('bgColorText', preset.bgColor);
    setVal('textColor', preset.textColor); setVal('textColorText', preset.textColor);
    if (preset.fontFamily) { setVal('fontFamily', preset.fontFamily); await ensureFontLoaded(preset.fontFamily); }
    applyBorderSettings(preset);
    saveSettings(); generateThumbnail();
}

function applyBorderSettings(preset) {
    const hasTextStroke = preset.textStroke || false;
    $('textStroke').checked = hasTextStroke;
    $('strokeControls').style.display = hasTextStroke ? 'block' : 'none';
    if (hasTextStroke) {
        setVal('strokeColor', preset.strokeColor || '#000000'); setVal('strokeColorText', preset.strokeColor || '#000000');
        setVal('strokeWidth', preset.strokeWidth || 8); $('strokeWidthValue').textContent = (preset.strokeWidth || 8) + 'px';
    }
    const hasCanvasBorder = preset.canvasBorder || false;
    $('canvasBorder').checked = hasCanvasBorder;
    $('borderControls').style.display = hasCanvasBorder ? 'block' : 'none';
    if (hasCanvasBorder) {
        setVal('borderColor', preset.borderColor || '#ffffff'); setVal('borderColorText', preset.borderColor || '#ffffff');
        setVal('borderWidth', preset.borderWidth || 20); $('borderWidthValue').textContent = (preset.borderWidth || 20) + 'px';
    }
}

async function randomizeStyle() {
    const presetNames = Object.keys(presets);
    const randomPresetName = presetNames[Math.floor(Math.random() * presetNames.length)];
    const randomPreset = presets[randomPresetName];
    document.querySelectorAll('.preset-btn, .preset-btn-compact').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(randomPresetName)) btn.classList.add('active');
    });
    currentPreset = randomPresetName;
    setVal('bgColor', randomPreset.bgColor); setVal('bgColorText', randomPreset.bgColor);
    setVal('textColor', randomPreset.textColor); setVal('textColorText', randomPreset.textColor);
    if (randomPreset.fontFamily) { setVal('fontFamily', randomPreset.fontFamily); await ensureFontLoaded(randomPreset.fontFamily); }
    const randomTextStroke = Math.random() > 0.5 || randomPreset.textStroke;
    $('textStroke').checked = randomTextStroke;
    $('strokeControls').style.display = randomTextStroke ? 'block' : 'none';
    if (randomTextStroke) {
        const strokeColors = ['#000000', '#ffffff', '#333333', '#ffff00', '#ff0000', '#00ff00', '#0000ff'];
        const randomStrokeColor = randomPreset.strokeColor || strokeColors[Math.floor(Math.random() * strokeColors.length)];
        setVal('strokeColor', randomStrokeColor); setVal('strokeColorText', randomStrokeColor);
        const strokeWidth = randomPreset.strokeWidth || 8;
        setVal('strokeWidth', strokeWidth); $('strokeWidthValue').textContent = strokeWidth + 'px';
    }
    const randomCanvasBorder = Math.random() > 0.7 || randomPreset.canvasBorder;
    $('canvasBorder').checked = randomCanvasBorder;
    $('borderControls').style.display = randomCanvasBorder ? 'block' : 'none';
    if (randomCanvasBorder) {
        const borderColors = ['#ffffff', '#000000', '#667eea', '#f093fb', '#ff6b6b', '#feca57'];
        const randomBorderColor = randomPreset.borderColor || borderColors[Math.floor(Math.random() * borderColors.length)];
        setVal('borderColor', randomBorderColor); setVal('borderColorText', randomBorderColor);
        const borderWidth = randomPreset.borderWidth || 20;
        setVal('borderWidth', borderWidth); $('borderWidthValue').textContent = borderWidth + 'px';
    }
    saveSettings(); generateThumbnail();
}

function changeRatio(ratio) {
    currentRatio = ratio;
    const canvas = $('canvas'), [width, height] = ratios[ratio];
    canvas.width = width; canvas.height = height;
    document.querySelectorAll('.ratio-button').forEach(btn => {
        btn.classList.remove('active'); btn.setAttribute('aria-pressed', 'false');
    });
    event.target.classList.add('active'); event.target.setAttribute('aria-pressed', 'true');
    saveSettings(); generateThumbnail();
}

// ===== 썸네일 생성 (폰트 문제 수정) =====
function wrapText(ctx, text, maxWidth, fontString) {
    ctx.font = fontString;
    const paragraphs = text.split('\n'), lines = [];
    paragraphs.forEach(p => {
        if (!p.trim()) { lines.push(''); return; }
        let currentLine = '';
        const chars = Array.from(p);
        for (let i = 0; i < chars.length; i++) {
            const testLine = currentLine + chars[i];
            if (ctx.measureText(testLine).width > maxWidth && currentLine !== '') {
                lines.push(currentLine);
                currentLine = chars[i];
            } else currentLine = testLine;
        }
        if (currentLine) lines.push(currentLine);
    });
    return lines;
}

function generateThumbnail() {
    const canvas = $('canvas'), ctx = canvas.getContext('2d'), text = val('thumbnailText').trim();
    if (!text) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
    const bgColor = val('bgColor'), textColor = val('textColor'), preset = presets[currentPreset], fontFamily = val('fontFamily');
    const fontSizeScale = parseInt(val('fontSizeScale')) / 100, hasStroke = $('textStroke').checked, strokeColor = val('strokeColor');
    const strokeWidth = parseInt(val('strokeWidth')), hasBorder = $('canvasBorder').checked, borderColor = val('borderColor');
    const borderWidth = parseInt(val('borderWidth')), sel = $('fontFamily');
    const fontWeight = sel.options[sel.selectedIndex].getAttribute('data-weight') || '700';
    if (preset.gradient) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, bgColor); gradient.addColorStop(1, preset.gradientColor);
        ctx.fillStyle = gradient;
    } else ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (hasBorder) {
        ctx.strokeStyle = borderColor; ctx.lineWidth = borderWidth;
        ctx.strokeRect(borderWidth / 2, borderWidth / 2, canvas.width - borderWidth, canvas.height - borderWidth);
    }
    const baseFontSize = Math.min(canvas.width, canvas.height) * 0.15, fontSize = baseFontSize * fontSizeScale;
    const fontString = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.font = fontString; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    const maxWidth = canvas.width * 0.95, lines = wrapText(ctx, text, maxWidth, fontString);
    const lineHeight = fontSize * 1.3, totalHeight = lines.length * lineHeight;
    const startY = (canvas.height - totalHeight) / 2 + lineHeight / 2;
    if (hasStroke) { ctx.strokeStyle = strokeColor; ctx.lineWidth = strokeWidth; ctx.lineJoin = 'round'; ctx.miterLimit = 2; }
    ctx.fillStyle = textColor;
    lines.forEach((line, index) => {
        const y = startY + index * lineHeight;
        if (hasStroke) ctx.strokeText(line, canvas.width / 2, y);
        ctx.fillText(line, canvas.width / 2, y);
    });
}

// ===== 다운로드 =====
function downloadThumbnail() {
    const canvas = $('canvas'), btn = document.querySelector('.button.is-primary'), txt = $('downloadText');
    btn.disabled = true; btn.classList.add('is-loading');
    const originalText = txt.innerHTML;
    txt.innerHTML = '다운로드 중...';
    setTimeout(() => {
        try {
            const link = document.createElement('a'), text = val('thumbnailText').trim();
            link.download = text ? `${text.substring(0, 30).replace(/[^\w\s-]/g, '_')}_thumbnail.png` : 'thumbnail.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            txt.innerHTML = '완료!';
            setTimeout(() => { txt.innerHTML = originalText; btn.disabled = false; btn.classList.remove('is-loading'); }, 2000);
        } catch (e) {
            txt.innerHTML = '실패';
            console.error('Download failed:', e);
            setTimeout(() => { txt.innerHTML = originalText; btn.disabled = false; btn.classList.remove('is-loading'); }, 2000);
        }
    }, 300);
}

// ===== 설정 저장/불러오기 =====
function saveSettings() {
    localStorage.setItem('thumbnailSettings', JSON.stringify({
        preset: currentPreset, ratio: currentRatio, text: val('thumbnailText'), bgColor: val('bgColor'), textColor: val('textColor'),
        fontFamily: val('fontFamily'), fontSize: val('fontSizeScale'), hasStroke: $('textStroke').checked, strokeColor: val('strokeColor'),
        strokeWidth: val('strokeWidth'), hasBorder: $('canvasBorder').checked, borderColor: val('borderColor'), borderWidth: val('borderWidth')
    }));
}

async function loadSettings() {
    const saved = localStorage.getItem('thumbnailSettings');
    if (!saved) return;
    try {
        const s = JSON.parse(saved);
        if (s.ratio) {
            currentRatio = s.ratio;
            const canvas = $('canvas'), [width, height] = ratios[s.ratio];
            canvas.width = width; canvas.height = height;
            document.querySelectorAll('.ratio-button').forEach(btn => btn.classList.toggle('active', btn.textContent === s.ratio));
        }
        if (s.preset) {
            currentPreset = s.preset;
            document.querySelectorAll('.preset-btn, .preset-btn-compact').forEach(btn => btn.classList.toggle('active', btn.getAttribute('onclick').includes(s.preset)));
        }
        if (s.text) setVal('thumbnailText', s.text);
        if (s.bgColor) { setVal('bgColor', s.bgColor); setVal('bgColorText', s.bgColor); }
        if (s.textColor) { setVal('textColor', s.textColor); setVal('textColorText', s.textColor); }
        if (s.fontFamily) { setVal('fontFamily', s.fontFamily); await ensureFontLoaded(s.fontFamily); }
        if (s.fontSize) { setVal('fontSizeScale', s.fontSize); $('fontSizeValue').textContent = s.fontSize + '%'; }
        if (s.hasStroke) {
            $('textStroke').checked = true; $('strokeControls').style.display = 'block';
            if (s.strokeColor) { setVal('strokeColor', s.strokeColor); setVal('strokeColorText', s.strokeColor); }
            if (s.strokeWidth) { setVal('strokeWidth', s.strokeWidth); $('strokeWidthValue').textContent = s.strokeWidth + 'px'; }
        }
        if (s.hasBorder) {
            $('canvasBorder').checked = true; $('borderControls').style.display = 'block';
            if (s.borderColor) { setVal('borderColor', s.borderColor); setVal('borderColorText', s.borderColor); }
            if (s.borderWidth) { setVal('borderWidth', s.borderWidth); $('borderWidthValue').textContent = s.borderWidth + 'px'; }
        }
    } catch (e) { console.error('설정 불러오기 실패:', e); }
}

function resetSettings() {
    if (!confirm('모든 설정을 초기화하시겠습니까?')) return;
    localStorage.removeItem('thumbnailSettings'); localStorage.removeItem('recentColors');
    currentPreset = 'modern'; currentRatio = '1:1'; recentColors = [];
    const canvas = $('canvas');
    canvas.width = 1000; canvas.height = 1000;
    setVal('thumbnailText', '블로그 썸네일 생성기'); setVal('bgColor', '#667eea'); setVal('bgColorText', '#667eea');
    setVal('textColor', '#ffffff'); setVal('textColorText', '#ffffff'); setVal('fontFamily', "'Noto Sans KR', sans-serif");
    setVal('fontSizeScale', 100); $('fontSizeValue').textContent = '100%';
    $('textStroke').checked = false; $('strokeControls').style.display = 'none';
    $('canvasBorder').checked = false; $('borderControls').style.display = 'none';
    document.querySelectorAll('.ratio-button').forEach((btn, i) => {
        btn.classList.toggle('active', i === 0); btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    });
    document.querySelectorAll('.preset-btn, .preset-btn-compact').forEach(btn => btn.classList.toggle('active', btn.getAttribute('onclick').includes('modern')));
    updateTextCounter(); updateRecentColorsUI(); generateThumbnail();
    alert('설정이 초기화되었습니다!');
}

// ===== 키보드 네비게이션 =====
function setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); downloadThumbnail(); }
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') { e.preventDefault(); randomizeStyle(); }
    });
    document.querySelectorAll('.color-swatch, .emoji-btn').forEach(el => {
        el.setAttribute('tabindex', '0'); el.setAttribute('role', 'button');
        el.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); } });
    });
}

// ===== 이벤트 리스너 설정 =====
function setupEventListeners() {
    setupColorInput('bgColor', 'bgColorText'); setupColorInput('textColor', 'textColorText');
    setupColorInput('strokeColor', 'strokeColorText'); setupColorInput('borderColor', 'borderColorText');
    setupSlider('fontSizeScale', 'fontSizeValue', '%'); setupSlider('strokeWidth', 'strokeWidthValue', 'px');
    setupSlider('borderWidth', 'borderWidthValue', 'px');
    const debouncedGenerate = debounce(() => { saveSettings(); generateThumbnail(); }, 300);
    $('thumbnailText').addEventListener('input', () => { updateTextCounter(); debouncedGenerate(); });
    $('fontFamily').addEventListener('change', async () => { await ensureFontLoaded(val('fontFamily')); saveSettings(); generateThumbnail(); });
    $('textStroke').addEventListener('change', (e) => { $('strokeControls').style.display = e.target.checked ? 'block' : 'none'; saveSettings(); generateThumbnail(); });
    $('canvasBorder').addEventListener('change', (e) => { $('borderControls').style.display = e.target.checked ? 'block' : 'none'; saveSettings(); generateThumbnail(); });
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
    initColorPalettes(); initEmojis(); loadRecentColors(); await loadSettings();
    updateTextCounter(); updateRecentColorsUI(); generateThumbnail();
    setupEventListeners(); setupKeyboardNavigation();
});
