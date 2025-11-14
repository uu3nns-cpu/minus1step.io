// ===== 설정 저장/불러오기 =====
async function loadSettings() {
    const saved = localStorage.getItem('thumbnailSettings');
    if (!saved) return;
    
    try {
        const s = JSON.parse(saved);
        
        if (s.ratio) {
            currentRatio = s.ratio;
            const canvas = $('canvas');
            const [width, height] = ratios[s.ratio];
            canvas.width = width;
            canvas.height = height;
            document.querySelectorAll('.ratio-button').forEach(btn => {
                btn.classList.toggle('active', btn.textContent === s.ratio);
            });
        }
        
        if (s.preset) {
            currentPreset = s.preset;
            document.querySelectorAll('.preset-btn, .preset-btn-compact').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('onclick').includes(s.preset));
            });
        }
        
        if (s.text) setVal('thumbnailText', s.text);
        if (s.bgColor) { 
            setVal('bgColor', s.bgColor); 
            setVal('bgColorText', s.bgColor); 
        }
        if (s.textColor) { 
            setVal('textColor', s.textColor); 
            setVal('textColorText', s.textColor); 
        }
        
        if (s.fontFamily) { 
            setVal('fontFamily', s.fontFamily); 
            const preset = presets[currentPreset];
            const fontWeight = (preset && preset.fontWeight) || '700';
            await ensureFontLoaded(s.fontFamily, fontWeight); 
        }
        
        if (s.fontSize) { 
            setVal('fontSizeScale', s.fontSize); 
            $('fontSizeValue').textContent = s.fontSize + '%'; 
        }
        
        if (s.hasStroke) {
            $('textStroke').checked = true;
            $('strokeControls').style.display = 'block';
            if (s.strokeColor) { 
                setVal('strokeColor', s.strokeColor); 
                setVal('strokeColorText', s.strokeColor); 
            }
            if (s.strokeWidth) { 
                setVal('strokeWidth', s.strokeWidth); 
                $('strokeWidthValue').textContent = s.strokeWidth + 'px'; 
            }
        }
        
        if (s.hasBorder) {
            $('canvasBorder').checked = true;
            $('borderControls').style.display = 'block';
            if (s.borderColor) { 
                setVal('borderColor', s.borderColor); 
                setVal('borderColorText', s.borderColor); 
            }
            if (s.borderWidth) { 
                setVal('borderWidth', s.borderWidth); 
                $('borderWidthValue').textContent = s.borderWidth + 'px'; 
            }
        }
    } catch (e) { 
        console.error('설정 불러오기 실패:', e); 
    }
}

async function resetSettings() {
    if (!confirm('모든 설정을 초기화하시겠습니까?')) return;
    
    localStorage.removeItem('thumbnailSettings');
    
    currentPreset = 'modern'; 
    currentRatio = '1:1';
    
    const canvas = $('canvas');
    canvas.width = 800; 
    canvas.height = 800;
    
    setVal('thumbnailText', '블로그 썸네일 생성기'); 
    setVal('bgColor', '#667eea'); 
    setVal('bgColorText', '#667eea');
    setVal('textColor', '#ffffff'); 
    setVal('textColorText', '#ffffff'); 
    setVal('fontFamily', "'Noto Sans KR', sans-serif");
    setVal('fontSizeScale', 100); 
    $('fontSizeValue').textContent = '100%';
    
    $('textStroke').checked = false; 
    $('strokeControls').style.display = 'none';
    $('canvasBorder').checked = false; 
    $('borderControls').style.display = 'none';
    
    document.querySelectorAll('.ratio-button').forEach((btn, i) => {
        btn.classList.toggle('active', i === 0); 
        btn.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
    });
    
    document.querySelectorAll('.preset-btn, .preset-btn-compact').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes('modern'));
    });
    
    updateTextCounter(); 
    await generateThumbnail();
    
    alert('설정이 초기화되었습니다!');
}
