const colorPalettes = {
    background: [
        '#667eea', '#f093fb', '#00c6ff', '#ff6b6b',
        '#11998e', '#ffeaa7', '#2c3e50', '#1a1a2e',
        '#ee0979', '#764ba2', '#0072ff', '#38ef7d',
        '#feca57', '#fab1a0', '#34495e', '#dfe6e9'
    ],
    text: [
        '#ffffff', '#000000', '#333333', '#ffff00',
        '#00ff88', '#ff6b6b', '#667eea', '#2d3436',
        '#f5f5f5', '#1a1a1a', '#feca57', '#00c6ff',
        '#ee0979', '#38ef7d', '#fab1a0', '#764ba2'
    ],
    stroke: [
        '#000000', '#ffffff', '#333333', '#ffff00',
        '#ff0000', '#00ff00', '#0000ff', '#ff6b6b',
        '#667eea', '#2c3e50', '#1a1a2e', '#764ba2',
        '#ee0979', '#38ef7d', '#fab1a0', '#feca57'
    ],
    border: [
        '#ffffff', '#000000', '#667eea', '#f093fb',
        '#ff6b6b', '#feca57', '#00c6ff', '#38ef7d',
        '#764ba2', '#2c3e50', '#ffff00', '#00ff88',
        '#ee0979', '#fab1a0', '#1a1a2e', '#dfe6e9'
    ]
};

const presets = {
    modern: {
        bgColor: '#667eea',
        textColor: '#ffffff',
        gradient: true,
        gradientColor: '#764ba2',
        fontFamily: "'Noto Sans KR', sans-serif"
    },
    gradient: {
        bgColor: '#f093fb',
        textColor: '#ffffff',
        gradient: true,
        gradientColor: '#f5576c',
        fontFamily: "'Gothic A1', sans-serif"
    },
    minimal: {
        bgColor: '#ffffff',
        textColor: '#333333',
        gradient: false,
        fontFamily: "'Noto Sans KR', sans-serif"
    },
    bold: {
        bgColor: '#000000',
        textColor: '#ffff00',
        gradient: false,
        fontFamily: "'Black Han Sans', sans-serif"
    },
    ocean: {
        bgColor: '#00c6ff',
        textColor: '#ffffff',
        gradient: true,
        gradientColor: '#0072ff',
        fontFamily: "'Sunflower', sans-serif"
    },
    sunset: {
        bgColor: '#ff6b6b',
        textColor: '#ffffff',
        gradient: true,
        gradientColor: '#feca57',
        fontFamily: "'Jua', sans-serif"
    },
    neon: {
        bgColor: '#000000',
        textColor: '#00ff88',
        gradient: false,
        fontFamily: "'Gugi', cursive",
        textStroke: true,
        strokeColor: '#00ff88',
        strokeWidth: 3
    },
    pastel: {
        bgColor: '#ffeaa7',
        textColor: '#2d3436',
        gradient: true,
        gradientColor: '#fab1a0',
        fontFamily: "'Hi Melody', cursive"
    },
    vintage: {
        bgColor: '#d4a574',
        textColor: '#3e2723',
        gradient: false,
        fontFamily: "'Nanum Myeongjo', serif",
        canvasBorder: true,
        borderColor: '#8d6e63',
        borderWidth: 30
    },
    dark: {
        bgColor: '#1a1a2e',
        textColor: '#0f4c75',
        gradient: true,
        gradientColor: '#16213e',
        fontFamily: "'Gothic A1', sans-serif",
        textStroke: true,
        strokeColor: '#ffffff',
        strokeWidth: 2
    },
    nature: {
        bgColor: '#11998e',
        textColor: '#ffffff',
        gradient: true,
        gradientColor: '#38ef7d',
        fontFamily: "'Single Day', cursive"
    },
    candy: {
        bgColor: '#ff6ec4',
        textColor: '#ffffff',
        gradient: true,
        gradientColor: '#7873f5',
        fontFamily: "'Cute Font', cursive"
    }
};

let currentPreset = 'modern';
let currentRatio = '1:1';
let debounceTimer = null;
let recentColors = [];
const MAX_RECENT_COLORS = 8;

// 디바운스 함수
function debounce(func, delay = 300) {
    return function(...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
}

function switchTab(tabName) {
    // Remove active class from all tabs and tab contents
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Add active class to selected tab and content
    event.target.classList.add('active');
    document.getElementById(tabName + 'Tab').classList.add('active');
}

function insertEmoji(emoji) {
    const textarea = document.getElementById('thumbnailText');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    
    // Insert emoji at cursor position
    textarea.value = text.substring(0, start) + emoji + text.substring(end);
    
    // Move cursor after emoji
    textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
    textarea.focus();
    
    // Update thumbnail
    saveSettings();
    generateThumbnail();
}

async function randomizeStyle() {
    // 랜덤 프리셋 선택
    const presetNames = Object.keys(presets);
    const randomPresetName = presetNames[Math.floor(Math.random() * presetNames.length)];
    const randomPreset = presets[randomPresetName];
    
    // 프리셋 활성화 표시
    document.querySelectorAll('.preset-btn, .preset-btn-compact').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(randomPresetName)) {
            btn.classList.add('active');
        }
    });
    
    currentPreset = randomPresetName;
    
    // 배경색과 텍스트 색상 적용
    document.getElementById('bgColor').value = randomPreset.bgColor;
    document.getElementById('bgColorText').value = randomPreset.bgColor;
    document.getElementById('textColor').value = randomPreset.textColor;
    document.getElementById('textColorText').value = randomPreset.textColor;
    
    // 폰트 적용 및 로드 대기
    if (randomPreset.fontFamily) {
        document.getElementById('fontFamily').value = randomPreset.fontFamily;
        await ensureFontLoaded(randomPreset.fontFamily);
    }
    
    // 텍스트 테두리 랜덤 토글 (두께는 프리셋 값 사용)
    const randomTextStroke = Math.random() > 0.5;
    document.getElementById('textStroke').checked = randomTextStroke || randomPreset.textStroke;
    document.getElementById('strokeControls').style.display = 
        (randomTextStroke || randomPreset.textStroke) ? 'block' : 'none';
    
    if (randomTextStroke || randomPreset.textStroke) {
        // 랜덤 테두리 색상
        const strokeColors = ['#000000', '#ffffff', '#333333', '#ffff00', '#ff0000', '#00ff00', '#0000ff'];
        const randomStrokeColor = randomPreset.strokeColor || strokeColors[Math.floor(Math.random() * strokeColors.length)];
        document.getElementById('strokeColor').value = randomStrokeColor;
        document.getElementById('strokeColorText').value = randomStrokeColor;
        
        // 테두리 두께는 프리셋 값 사용 (없으면 기본값)
        const strokeWidth = randomPreset.strokeWidth || 8;
        document.getElementById('strokeWidth').value = strokeWidth;
        document.getElementById('strokeWidthValue').textContent = strokeWidth + 'px';
    }
    
    // 캔버스 테두리 랜덤 토글 (두께는 프리셋 값 사용)
    const randomCanvasBorder = Math.random() > 0.7;
    document.getElementById('canvasBorder').checked = randomCanvasBorder || randomPreset.canvasBorder;
    document.getElementById('borderControls').style.display = 
        (randomCanvasBorder || randomPreset.canvasBorder) ? 'block' : 'none';
    
    if (randomCanvasBorder || randomPreset.canvasBorder) {
        // 랜덤 테두리 색상
        const borderColors = ['#ffffff', '#000000', '#667eea', '#f093fb', '#ff6b6b', '#feca57'];
        const randomBorderColor = randomPreset.borderColor || borderColors[Math.floor(Math.random() * borderColors.length)];
        document.getElementById('borderColor').value = randomBorderColor;
        document.getElementById('borderColorText').value = randomBorderColor;
        
        // 테두리 두께는 프리셋 값 사용 (없으면 기본값)
        const borderWidth = randomPreset.borderWidth || 20;
        document.getElementById('borderWidth').value = borderWidth;
        document.getElementById('borderWidthValue').textContent = borderWidth + 'px';
    }
    
    // 글자 크기는 유지 (변경하지 않음)
    
    saveSettings();
    generateThumbnail();
}

function initColorPalettes() {
    const bgPalette = document.getElementById('bgPalette');
    const textPalette = document.getElementById('textPalette');
    const strokePalette = document.getElementById('strokePalette');
    const borderPalette = document.getElementById('borderPalette');

    colorPalettes.background.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.background = color;
        swatch.onclick = () => {
            document.getElementById('bgColor').value = color;
            document.getElementById('bgColorText').value = color;
            generateThumbnail();
        };
        bgPalette.appendChild(swatch);
    });

    colorPalettes.text.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.background = color;
        swatch.onclick = () => {
            document.getElementById('textColor').value = color;
            document.getElementById('textColorText').value = color;
            generateThumbnail();
        };
        textPalette.appendChild(swatch);
    });

    colorPalettes.stroke.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.background = color;
        swatch.onclick = () => {
            document.getElementById('strokeColor').value = color;
            document.getElementById('strokeColorText').value = color;
            generateThumbnail();
        };
        strokePalette.appendChild(swatch);
    });

    colorPalettes.border.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'color-swatch';
        swatch.style.background = color;
        swatch.onclick = () => {
            document.getElementById('borderColor').value = color;
            document.getElementById('borderColorText').value = color;
            generateThumbnail();
        };
        borderPalette.appendChild(swatch);
    });
}

document.getElementById('bgColor').addEventListener('input', (e) => {
    const color = e.target.value;
    document.getElementById('bgColorText').value = color;
    addToRecentColors(color);
    saveSettings();
    generateThumbnail();
});

document.getElementById('bgColorText').addEventListener('input', (e) => {
    const color = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(color)) {
        document.getElementById('bgColor').value = color;
        addToRecentColors(color);
        generateThumbnail();
    }
});

document.getElementById('textColor').addEventListener('input', (e) => {
    const color = e.target.value;
    document.getElementById('textColorText').value = color;
    addToRecentColors(color);
    saveSettings();
    generateThumbnail();
});

document.getElementById('textColorText').addEventListener('input', (e) => {
    const color = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(color)) {
        document.getElementById('textColor').value = color;
        addToRecentColors(color);
        generateThumbnail();
    }
});

document.getElementById('strokeColor').addEventListener('input', (e) => {
    const color = e.target.value;
    document.getElementById('strokeColorText').value = color;
    addToRecentColors(color);
    saveSettings();
    generateThumbnail();
});

document.getElementById('strokeColorText').addEventListener('input', (e) => {
    const color = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(color)) {
        document.getElementById('strokeColor').value = color;
        addToRecentColors(color);
        generateThumbnail();
    }
});

document.getElementById('borderColor').addEventListener('input', (e) => {
    const color = e.target.value;
    document.getElementById('borderColorText').value = color;
    addToRecentColors(color);
    saveSettings();
    generateThumbnail();
});

document.getElementById('borderColorText').addEventListener('input', (e) => {
    const color = e.target.value;
    if (/^#[0-9A-F]{6}$/i.test(color)) {
        document.getElementById('borderColor').value = color;
        addToRecentColors(color);
        generateThumbnail();
    }
});

document.getElementById('textStroke').addEventListener('change', (e) => {
    document.getElementById('strokeControls').style.display = e.target.checked ? 'block' : 'none';
    saveSettings();
    generateThumbnail();
});

document.getElementById('strokeWidth').addEventListener('input', (e) => {
    document.getElementById('strokeWidthValue').textContent = e.target.value + 'px';
    saveSettings();
    generateThumbnail();
});

document.getElementById('canvasBorder').addEventListener('change', (e) => {
    document.getElementById('borderControls').style.display = e.target.checked ? 'block' : 'none';
    saveSettings();
    generateThumbnail();
});

document.getElementById('borderWidth').addEventListener('input', (e) => {
    document.getElementById('borderWidthValue').textContent = e.target.value + 'px';
    saveSettings();
    generateThumbnail();
});

document.getElementById('fontSizeScale').addEventListener('input', (e) => {
    document.getElementById('fontSizeValue').textContent = e.target.value + '%';
    saveSettings();
    generateThumbnail();
});

// 글자수 카운터 업데이트
function updateTextCounter() {
    const textarea = document.getElementById('thumbnailText');
    const counter = document.getElementById('textCounter');
    const length = textarea.value.length;
    const maxLength = textarea.getAttribute('maxlength');
    counter.textContent = `${length} / ${maxLength}자`;
    
    // 90% 이상일 때 경고 색상
    if (length >= maxLength * 0.9) {
        counter.style.color = '#ffcc00';
    } else {
        counter.style.color = 'rgba(255, 255, 255, 0.8)';
    }
}

// 모든 입력 필드에 자동 저장 추가 (디바운스 적용)
const debouncedGenerate = debounce(() => {
    saveSettings();
    generateThumbnail();
}, 300);

document.getElementById('thumbnailText').addEventListener('input', () => {
    updateTextCounter();
    debouncedGenerate();
});

document.getElementById('fontFamily').addEventListener('change', async () => {
    const selectElement = document.getElementById('fontFamily');
    const fontFamily = selectElement.value;
    
    // 폰트가 로드될 때까지 대기
    await ensureFontLoaded(fontFamily);
    
    saveSettings();
    generateThumbnail();
});

// 폰트 로드 보장 함수
async function ensureFontLoaded(fontFamily) {
    // 폰트 패밀리 이름 추출 (따옴표 제거)
    const fontName = fontFamily.match(/'([^']+)'/)?.[1] || fontFamily.split(',')[0].trim();
    
    // 선택된 옵션의 font-weight 가져오기
    const selectElement = document.getElementById('fontFamily');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const fontWeight = selectedOption.getAttribute('data-weight') || '400';
    
    try {
        // Font Loading API 사용
        await document.fonts.load(`${fontWeight} 16px "${fontName}"`);
        console.log(`Font loaded: ${fontName} ${fontWeight}`);
    } catch (error) {
        console.warn(`Font loading failed for ${fontName}:`, error);
        // 폰트 로드 실패 시 짧은 대기 시간 후 진행
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

async function applyPreset(presetName) {
    document.querySelectorAll('.preset-btn, .preset-btn-compact').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.preset-btn, .preset-btn-compact').classList.add('active');
    
    const preset = presets[presetName];
    currentPreset = presetName;
    
    // 배경색과 텍스트 색상
    document.getElementById('bgColor').value = preset.bgColor;
    document.getElementById('bgColorText').value = preset.bgColor;
    document.getElementById('textColor').value = preset.textColor;
    document.getElementById('textColorText').value = preset.textColor;
    
    // 폰트 적용 및 로드 대기
    if (preset.fontFamily) {
        document.getElementById('fontFamily').value = preset.fontFamily;
        await ensureFontLoaded(preset.fontFamily);
    }
    
    // 텍스트 테두리 설정
    if (preset.textStroke) {
        document.getElementById('textStroke').checked = true;
        document.getElementById('strokeControls').style.display = 'block';
        if (preset.strokeColor) {
            document.getElementById('strokeColor').value = preset.strokeColor;
            document.getElementById('strokeColorText').value = preset.strokeColor;
        }
        if (preset.strokeWidth) {
            document.getElementById('strokeWidth').value = preset.strokeWidth;
            document.getElementById('strokeWidthValue').textContent = preset.strokeWidth + 'px';
        }
    } else {
        document.getElementById('textStroke').checked = false;
        document.getElementById('strokeControls').style.display = 'none';
    }
    
    // 캔버스 테두리 설정
    if (preset.canvasBorder) {
        document.getElementById('canvasBorder').checked = true;
        document.getElementById('borderControls').style.display = 'block';
        if (preset.borderColor) {
            document.getElementById('borderColor').value = preset.borderColor;
            document.getElementById('borderColorText').value = preset.borderColor;
        }
        if (preset.borderWidth) {
            document.getElementById('borderWidth').value = preset.borderWidth;
            document.getElementById('borderWidthValue').textContent = preset.borderWidth + 'px';
        }
    } else {
        document.getElementById('canvasBorder').checked = false;
        document.getElementById('borderControls').style.display = 'none';
    }
    
    saveSettings();
    generateThumbnail();
}

function changeRatio(ratio) {
    currentRatio = ratio;
    const canvas = document.getElementById('canvas');
    
    switch(ratio) {
        case '1:1':
            canvas.width = 1000;
            canvas.height = 1000;
            break;
        case '9:16':
            canvas.width = 1080;
            canvas.height = 1920;
            break;
        case '3:4':
            canvas.width = 1080;
            canvas.height = 1440;
            break;
        case '4:3':
            canvas.width = 1440;
            canvas.height = 1080;
            break;
        case '16:9':
            canvas.width = 1920;
            canvas.height = 1080;
            break;
    }
    
    // 접근성: aria-pressed 업데이트
    document.querySelectorAll('.ratio-button').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });
    event.target.classList.add('active');
    event.target.setAttribute('aria-pressed', 'true');
    
    saveSettings();
    generateThumbnail();
}

function saveSettings() {
    const settings = {
        preset: currentPreset,
        ratio: currentRatio,
        text: document.getElementById('thumbnailText').value,
        bgColor: document.getElementById('bgColor').value,
        textColor: document.getElementById('textColor').value,
        fontFamily: document.getElementById('fontFamily').value,
        fontSize: document.getElementById('fontSizeScale').value,
        hasStroke: document.getElementById('textStroke').checked,
        strokeColor: document.getElementById('strokeColor').value,
        strokeWidth: document.getElementById('strokeWidth').value,
        hasBorder: document.getElementById('canvasBorder').checked,
        borderColor: document.getElementById('borderColor').value,
        borderWidth: document.getElementById('borderWidth').value
    };
    localStorage.setItem('thumbnailSettings', JSON.stringify(settings));
}

async function loadSettings() {
    const saved = localStorage.getItem('thumbnailSettings');
    if (!saved) return;
    
    try {
        const settings = JSON.parse(saved);
        
        // 비율 적용
        if (settings.ratio) {
            currentRatio = settings.ratio;
            const canvas = document.getElementById('canvas');
            switch(settings.ratio) {
                case '1:1':
                    canvas.width = 1000;
                    canvas.height = 1000;
                    break;
                case '9:16':
                    canvas.width = 1080;
                    canvas.height = 1920;
                    break;
                case '3:4':
                    canvas.width = 1080;
                    canvas.height = 1440;
                    break;
                case '4:3':
                    canvas.width = 1440;
                    canvas.height = 1080;
                    break;
                case '16:9':
                    canvas.width = 1920;
                    canvas.height = 1080;
                    break;
            }
            document.querySelectorAll('.ratio-button').forEach(btn => {
                if (btn.textContent === settings.ratio) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
        
        // 프리셋 적용
        if (settings.preset) {
            currentPreset = settings.preset;
            document.querySelectorAll('.preset-btn, .preset-btn-compact').forEach(btn => {
                if (btn.getAttribute('onclick').includes(settings.preset)) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
        
        // 텍스트
        if (settings.text) {
            document.getElementById('thumbnailText').value = settings.text;
        }
        
        // 색상
        if (settings.bgColor) {
            document.getElementById('bgColor').value = settings.bgColor;
            document.getElementById('bgColorText').value = settings.bgColor;
        }
        if (settings.textColor) {
            document.getElementById('textColor').value = settings.textColor;
            document.getElementById('textColorText').value = settings.textColor;
        }
        
        // 폰트
        if (settings.fontFamily) {
            document.getElementById('fontFamily').value = settings.fontFamily;
            await ensureFontLoaded(settings.fontFamily);
        }
        if (settings.fontSize) {
            document.getElementById('fontSizeScale').value = settings.fontSize;
            document.getElementById('fontSizeValue').textContent = settings.fontSize + '%';
        }
        
        // 텍스트 테두리
        if (settings.hasStroke) {
            document.getElementById('textStroke').checked = settings.hasStroke;
            document.getElementById('strokeControls').style.display = 'block';
            if (settings.strokeColor) {
                document.getElementById('strokeColor').value = settings.strokeColor;
                document.getElementById('strokeColorText').value = settings.strokeColor;
            }
            if (settings.strokeWidth) {
                document.getElementById('strokeWidth').value = settings.strokeWidth;
                document.getElementById('strokeWidthValue').textContent = settings.strokeWidth + 'px';
            }
        }
        
        // 캔버스 테두리
        if (settings.hasBorder) {
            document.getElementById('canvasBorder').checked = settings.hasBorder;
            document.getElementById('borderControls').style.display = 'block';
            if (settings.borderColor) {
                document.getElementById('borderColor').value = settings.borderColor;
                document.getElementById('borderColorText').value = settings.borderColor;
            }
            if (settings.borderWidth) {
                document.getElementById('borderWidth').value = settings.borderWidth;
                document.getElementById('borderWidthValue').textContent = settings.borderWidth + 'px';
            }
        }
    } catch (e) {
        console.error('설정 불러오기 실패:', e);
    }
}

function wrapText(ctx, text, maxWidth) {
    // 먼저 엔터로 줄바꿈 처리
    const paragraphs = text.split('\n');
    const lines = [];
    
    paragraphs.forEach(paragraph => {
        if (!paragraph.trim()) {
            lines.push('');
            return;
        }
        
        // 문자 단위로 처리하여 한글/영문 혼합 텍스트 올바르게 처리
        let currentLine = '';
        let testLine = '';
        const chars = Array.from(paragraph); // 이모지 등 유니코드 올바르게 처리
        
        for (let i = 0; i < chars.length; i++) {
            testLine = currentLine + chars[i];
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && currentLine !== '') {
                lines.push(currentLine);
                currentLine = chars[i];
            } else {
                currentLine = testLine;
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }
    });
    
    return lines;
}

function generateThumbnail() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const text = document.getElementById('thumbnailText').value.trim();
    
    if (!text) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
    }

    const bgColor = document.getElementById('bgColor').value;
    const textColor = document.getElementById('textColor').value;
    const preset = presets[currentPreset];
    const fontFamily = document.getElementById('fontFamily').value;
    const fontSizeScale = parseInt(document.getElementById('fontSizeScale').value) / 100;
    const hasStroke = document.getElementById('textStroke').checked;
    const strokeColor = document.getElementById('strokeColor').value;
    const strokeWidth = parseInt(document.getElementById('strokeWidth').value);
    const hasBorder = document.getElementById('canvasBorder').checked;
    const borderColor = document.getElementById('borderColor').value;
    const borderWidth = parseInt(document.getElementById('borderWidth').value);

    // Get font weight from selected option
    const selectElement = document.getElementById('fontFamily');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const fontWeight = selectedOption.getAttribute('data-weight') || '700';

    // 배경 그리기
    if (preset.gradient) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, bgColor);
        gradient.addColorStop(1, preset.gradientColor);
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = bgColor;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 캔버스 테두리 그리기
    if (hasBorder) {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;
        ctx.strokeRect(borderWidth / 2, borderWidth / 2, canvas.width - borderWidth, canvas.height - borderWidth);
    }

    // 텍스트 설정 - 캔버스 크기에 맞춰 조정 (여백을 최소화)
    const baseFontSize = Math.min(canvas.width, canvas.height) * 0.15;
    const fontSize = baseFontSize * fontSizeScale;
    
    // 폰트 설정 (한 번만 설정하고 고정)
    const fontString = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.font = fontString;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 텍스트를 줄바꿈 처리 (최대화 시 0.95로 여백 최소화)
    const maxWidth = canvas.width * 0.95;
    const lines = wrapText(ctx, text, maxWidth);
    const lineHeight = fontSize * 1.3;
    const totalHeight = lines.length * lineHeight;
    const startY = (canvas.height - totalHeight) / 2 + lineHeight / 2;

    // 텍스트 그리기
    lines.forEach((line, index) => {
        const y = startY + index * lineHeight;
        
        // 폰트 설정 강제 재적용 (캔버스 상태 변경 방지)
        ctx.save();
        ctx.font = fontString;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // 테두리 그리기
        if (hasStroke) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.lineJoin = 'round';
            ctx.miterLimit = 2;
            ctx.strokeText(line, canvas.width / 2, y);
        }
        
        // 텍스트 그리기
        ctx.fillStyle = textColor;
        ctx.fillText(line, canvas.width / 2, y);
        
        ctx.restore();
    });
}

function downloadThumbnail() {
    const canvas = document.getElementById('canvas');
    const downloadBtn = document.querySelector('.button.is-primary');
    const downloadText = document.getElementById('downloadText');
    
    // 버튼 비활성화 및 피드백
    downloadBtn.disabled = true;
    downloadBtn.classList.add('is-loading');
    const originalText = downloadText.innerHTML;
    downloadText.innerHTML = '다운로드 중...';
    
    // 약간의 딩레이로 사용자 피드백 개선
    setTimeout(() => {
        try {
            const link = document.createElement('a');
            const text = document.getElementById('thumbnailText').value.trim();
            const filename = text ? `${text.substring(0, 30).replace(/[^\w\s-]/g, '_')}_thumbnail.png` : 'thumbnail.png';
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
            
            // 성공 피드백
            downloadText.innerHTML = '완료!';
            
            setTimeout(() => {
                downloadText.innerHTML = originalText;
                downloadBtn.disabled = false;
                downloadBtn.classList.remove('is-loading');
            }, 2000);
        } catch (error) {
            // 오류 피드백
            downloadText.innerHTML = '실패';
            console.error('Download failed:', error);
            
            setTimeout(() => {
                downloadText.innerHTML = originalText;
                downloadBtn.disabled = false;
                downloadBtn.classList.remove('is-loading');
            }, 2000);
        }
    }, 300);
}

// 초기화
window.addEventListener('load', async () => {
    initColorPalettes();
    loadRecentColors();
    await loadSettings();
    updateTextCounter(); // 초기 글자수 표시
    updateRecentColorsUI();
    generateThumbnail();
    
    // 키보드 네비게이션 개선
    setupKeyboardNavigation();
});

// 최근 색상 로드
function loadRecentColors() {
    const saved = localStorage.getItem('recentColors');
    if (saved) {
        try {
            recentColors = JSON.parse(saved);
        } catch (e) {
            console.error('최근 색상 불러오기 실패:', e);
            recentColors = [];
        }
    }
}

// 키보드 네비게이션 설정
function setupKeyboardNavigation() {
    // Ctrl/Cmd + S로 다운로드
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            downloadThumbnail();
        }
        
        // Ctrl/Cmd + R로 랜덤 스타일
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            randomizeStyle();
        }
    });
    
    // 색상 팔레트 키보드 접근성
    document.querySelectorAll('.color-swatch').forEach(swatch => {
        swatch.setAttribute('tabindex', '0');
        swatch.setAttribute('role', 'button');
        swatch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                swatch.click();
            }
        });
    });
    
    // 이모지 버튼 키보드 접근성
    document.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.setAttribute('tabindex', '0');
        btn.setAttribute('role', 'button');
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });
}

// 최근 색상에 추가
function addToRecentColors(color) {
    // 이미 있으면 제거하고 맨 앞에 추가
    recentColors = recentColors.filter(c => c !== color);
    recentColors.unshift(color);
    
    // 최대 개수 제한
    if (recentColors.length > MAX_RECENT_COLORS) {
        recentColors = recentColors.slice(0, MAX_RECENT_COLORS);
    }
    
    // localStorage에 저장
    localStorage.setItem('recentColors', JSON.stringify(recentColors));
    
    // UI 업데이트
    updateRecentColorsUI();
}

// 최근 색상 UI 업데이트
function updateRecentColorsUI() {
    const container = document.getElementById('recentColors');
    container.innerHTML = '';
    
    if (recentColors.length === 0) {
        const helpText = document.createElement('p');
        helpText.className = 'help has-text-white';
        helpText.style.textAlign = 'center';
        helpText.style.width = '100%';
        helpText.textContent = '사용한 색상이 여기에 표시됩니다';
        container.appendChild(helpText);
        return;
    }
    
    recentColors.forEach(color => {
        const swatch = document.createElement('div');
        swatch.className = 'recent-color-swatch';
        swatch.style.background = color;
        swatch.setAttribute('tabindex', '0');
        swatch.setAttribute('role', 'button');
        swatch.setAttribute('aria-label', `최근 사용 색상 ${color}`);
        
        swatch.onclick = () => {
            // 현재 활성화된 탭에 따라 적절한 색상 입력에 적용
            const activeTab = document.querySelector('.tab-content.active');
            if (activeTab && activeTab.id === 'advancedTab') {
                // 고급 탭에서는 배경색에 적용
                document.getElementById('bgColor').value = color;
                document.getElementById('bgColorText').value = color;
            } else {
                // 기본 탭에서도 배경색에 적용
                document.getElementById('bgColor').value = color;
                document.getElementById('bgColorText').value = color;
            }
            saveSettings();
            generateThumbnail();
        };
        
        swatch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                swatch.click();
            }
        });
        
        container.appendChild(swatch);
    });
}

// 설정 초기화
function resetSettings() {
    if (!confirm('모든 설정을 초기화하시겠습니까?')) {
        return;
    }
    
    // localStorage 초기화
    localStorage.removeItem('thumbnailSettings');
    localStorage.removeItem('recentColors');
    
    // 기본값으로 복원
    currentPreset = 'modern';
    currentRatio = '1:1';
    recentColors = [];
    
    // 캔버스 크기 복원
    const canvas = document.getElementById('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    
    // UI 복원
    document.getElementById('thumbnailText').value = '블로그 썸네일 생성기';
    document.getElementById('bgColor').value = '#667eea';
    document.getElementById('bgColorText').value = '#667eea';
    document.getElementById('textColor').value = '#ffffff';
    document.getElementById('textColorText').value = '#ffffff';
    document.getElementById('fontFamily').value = "'Noto Sans KR', sans-serif";
    document.getElementById('fontSizeScale').value = 100;
    document.getElementById('fontSizeValue').textContent = '100%';
    document.getElementById('textStroke').checked = false;
    document.getElementById('strokeControls').style.display = 'none';
    document.getElementById('canvasBorder').checked = false;
    document.getElementById('borderControls').style.display = 'none';
    
    // 비율 버튼 초기화
    document.querySelectorAll('.ratio-button').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });
    document.querySelector('.ratio-button').classList.add('active');
    document.querySelector('.ratio-button').setAttribute('aria-pressed', 'true');
    
    // 프리셋 버튼 초기화
    document.querySelectorAll('.preset-btn, .preset-btn-compact').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('[onclick*="modern"]').classList.add('active');
    
    updateTextCounter();
    updateRecentColorsUI();
    generateThumbnail();
    
    // 성공 메시지
    alert('설정이 초기화되었습니다!');
}
