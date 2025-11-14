// ===== 프리셋 관리 =====
async function applyPreset(presetName) {
    document.querySelectorAll('.preset-btn, .preset-btn-compact').forEach(btn => btn.classList.remove('active'));
    event.target.closest('.preset-btn, .preset-btn-compact').classList.add('active');
    
    const preset = presets[presetName];
    if (!preset) return;
    
    currentPreset = presetName;
    
    setVal('bgColor', preset.bgColor); 
    setVal('bgColorText', preset.bgColor);
    setVal('textColor', preset.textColor); 
    setVal('textColorText', preset.textColor);
    
    if (preset.fontFamily) {
        const fontWeight = preset.fontWeight || '700';
        setVal('fontFamily', preset.fontFamily);
        
        const sel = $('fontFamily');
        for (let i = 0; i < sel.options.length; i++) {
            if (sel.options[i].value === preset.fontFamily) {
                sel.selectedIndex = i;
                sel.options[i].setAttribute('data-weight', fontWeight);
                break;
            }
        }
        
        await ensureFontLoaded(preset.fontFamily, fontWeight);
    }
    
    applyBorderSettings(preset);
    await generateThumbnail();
    debouncedSave();
}

function applyBorderSettings(preset) {
    const hasTextStroke = preset.textStroke || false;
    $('textStroke').checked = hasTextStroke;
    $('strokeControls').style.display = hasTextStroke ? 'block' : 'none';
    if (hasTextStroke) {
        setVal('strokeColor', preset.strokeColor || '#000000'); 
        setVal('strokeColorText', preset.strokeColor || '#000000');
        setVal('strokeWidth', preset.strokeWidth || 8); 
        $('strokeWidthValue').textContent = (preset.strokeWidth || 8) + 'px';
    }
    
    const hasCanvasBorder = preset.canvasBorder || false;
    $('canvasBorder').checked = hasCanvasBorder;
    $('borderControls').style.display = hasCanvasBorder ? 'block' : 'none';
    if (hasCanvasBorder) {
        setVal('borderColor', preset.borderColor || '#ffffff'); 
        setVal('borderColorText', preset.borderColor || '#ffffff');
        setVal('borderWidth', preset.borderWidth || 20); 
        $('borderWidthValue').textContent = (preset.borderWidth || 20) + 'px';
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
    setVal('bgColor', randomPreset.bgColor); 
    setVal('bgColorText', randomPreset.bgColor);
    setVal('textColor', randomPreset.textColor); 
    setVal('textColorText', randomPreset.textColor);
    
    if (randomPreset.fontFamily) { 
        setVal('fontFamily', randomPreset.fontFamily); 
        const fontWeight = randomPreset.fontWeight || '700';
        await ensureFontLoaded(randomPreset.fontFamily, fontWeight); 
    }
    
    const randomTextStroke = Math.random() > 0.5 || randomPreset.textStroke;
    $('textStroke').checked = randomTextStroke;
    $('strokeControls').style.display = randomTextStroke ? 'block' : 'none';
    if (randomTextStroke) {
        const strokeColors = ['#000000', '#ffffff', '#333333', '#ffff00', '#ff0000', '#00ff00', '#0000ff'];
        const randomStrokeColor = randomPreset.strokeColor || strokeColors[Math.floor(Math.random() * strokeColors.length)];
        setVal('strokeColor', randomStrokeColor); 
        setVal('strokeColorText', randomStrokeColor);
        const strokeWidth = randomPreset.strokeWidth || 8;
        setVal('strokeWidth', strokeWidth); 
        $('strokeWidthValue').textContent = strokeWidth + 'px';
    }
    
    const randomCanvasBorder = Math.random() > 0.7 || randomPreset.canvasBorder;
    $('canvasBorder').checked = randomCanvasBorder;
    $('borderControls').style.display = randomCanvasBorder ? 'block' : 'none';
    if (randomCanvasBorder) {
        const borderColors = ['#ffffff', '#000000', '#667eea', '#f093fb', '#ff6b6b', '#feca57'];
        const randomBorderColor = randomPreset.borderColor || borderColors[Math.floor(Math.random() * borderColors.length)];
        setVal('borderColor', randomBorderColor); 
        setVal('borderColorText', randomBorderColor);
        const borderWidth = randomPreset.borderWidth || 20;
        setVal('borderWidth', borderWidth); 
        $('borderWidthValue').textContent = borderWidth + 'px';
    }
    
    await generateThumbnail(); 
    debouncedSave();
}

async function changeRatio(ratio) {
    currentRatio = ratio;
    const canvas = $('canvas');
    const [width, height] = ratios[ratio];
    canvas.width = width;
    canvas.height = height;
    document.querySelectorAll('.ratio-button').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });
    event.target.classList.add('active');
    event.target.setAttribute('aria-pressed', 'true');
    await generateThumbnail(); 
    debouncedSave();
}
