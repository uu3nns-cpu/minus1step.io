// ===== 썸네일 생성 =====
function wrapText(ctx, text, maxWidth, fontString) {
    // 폰트 명시적 설정
    ctx.font = fontString;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';
    
    const paragraphs = text.split('\n');
    const lines = [];
    
    paragraphs.forEach(p => {
        if (!p.trim()) { 
            lines.push(''); 
            return; 
        }
        let currentLine = '';
        const chars = Array.from(p);
        
        for (let i = 0; i < chars.length; i++) {
            const testLine = currentLine + chars[i];
            
            // 각 측정 전에 폰트 재설정
            ctx.font = fontString;
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine !== '') {
                lines.push(currentLine);
                currentLine = chars[i];
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) lines.push(currentLine);
    });
    return lines;
}

async function generateThumbnail() {
    const canvas = $('canvas');
    const ctx = canvas.getContext('2d');
    const text = val('thumbnailText').trim();
    
    if (!text) { 
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        return; 
    }
    
    const bgColor = val('bgColor');
    const textColor = val('textColor');
    const preset = presets[currentPreset];
    const fontFamily = val('fontFamily');
    const fontSizeScale = parseInt(val('fontSizeScale')) / 100;
    const hasStroke = $('textStroke').checked;
    const strokeColor = val('strokeColor');
    const strokeWidth = parseInt(val('strokeWidth'));
    const hasBorder = $('canvasBorder').checked;
    const borderColor = val('borderColor');
    const borderWidth = parseInt(val('borderWidth'));
    
    // Fix: Add null check before accessing sel.options
    const sel = $('fontFamily');
    let fontWeight = '700'; // Default weight
    
    if (sel && sel.options && sel.options[sel.selectedIndex]) {
        fontWeight = sel.options[sel.selectedIndex].getAttribute('data-weight') || '700';
    }
    
    if (preset && preset.fontWeight) {
        fontWeight = preset.fontWeight;
    }
    
    // 폰트 로드 대기 - 중요!
    await ensureFontLoaded(fontFamily, fontWeight);
    
    // 폰트가 실제로 사용 가능할 때까지 추가 대기
    const fontName = fontFamily.match(/'([^']+)'/)?.[1] || fontFamily.split(',')[0].trim();
    let retryCount = 0;
    const maxRetries = 5;
    
    while (retryCount < maxRetries) {
        const fontString = `${fontWeight} 48px "${fontName}"`;
        const testChar = text[0];
        
        ctx.font = fontString;
        const testWidth = ctx.measureText(testChar).width;
        
        ctx.font = `${fontWeight} 48px sans-serif`;
        const fallbackWidth = ctx.measureText(testChar).width;
        
        // 폰트가 제대로 로드되었는지 확인
        if (Math.abs(testWidth - fallbackWidth) > 0.5) {
            console.log(`✓ 폰트 적용 확인 (${retryCount + 1}/${maxRetries})`);
            break;
        }
        
        console.log(`⏳ 폰트 로딩 대기 중... (${retryCount + 1}/${maxRetries})`);
        await new Promise(r => setTimeout(r, 100));
        retryCount++;
    }
    
    // 컨텍스트 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 배경 그리기
    if (preset && preset.gradient) {
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, bgColor);
        gradient.addColorStop(1, preset.gradientColor);
        ctx.fillStyle = gradient;
    } else {
        ctx.fillStyle = bgColor;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    if (hasBorder) {
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = borderWidth;
        ctx.strokeRect(borderWidth / 2, borderWidth / 2, canvas.width - borderWidth, canvas.height - borderWidth);
    }
    
    const baseFontSize = Math.min(canvas.width, canvas.height) * 0.15;
    const fontSize = baseFontSize * fontSizeScale;
    const fontString = `${fontWeight} ${fontSize}px ${fontFamily}`;
    
    // 폰트 설정 및 텍스트 정렬 설정
    ctx.font = fontString;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 텍스트 렌더링 품질 향상
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // 폰트 설정을 명시적으로 강제 적용
    ctx.textRendering = 'optimizeLegibility';
    
    const maxWidth = canvas.width * 0.95;
    const lines = wrapText(ctx, text, maxWidth, fontString);
    const lineHeight = fontSize * 1.3;
    const totalHeight = lines.length * lineHeight;
    const startY = (canvas.height - totalHeight) / 2 + lineHeight / 2;
    
    if (hasStroke) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
    }
    
    ctx.fillStyle = textColor;
    
    // 각 줄을 그릴 때마다 폰트 재설정
    lines.forEach((line, index) => {
        const y = startY + index * lineHeight;
        
        // 폰트 설정 명시적으로 재적용 (매우 중요!)
        ctx.save(); // 상태 저장
        
        ctx.font = fontString;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = textColor;
        
        // 텍스트 그리기 전 폰트 적용 확인
        const actualFont = ctx.font;
        if (!actualFont.includes(fontName)) {
            console.warn(`⚠️ 폰트 미적용: ${actualFont}`);
        }
        
        if (hasStroke) {
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = strokeWidth;
            ctx.lineJoin = 'round';
            ctx.miterLimit = 2;
            ctx.strokeText(line, canvas.width / 2, y);
        }
        
        ctx.fillText(line, canvas.width / 2, y);
        
        ctx.restore(); // 상태 복원
    });
}

function downloadThumbnail() {
    const canvas = $('canvas');
    const btn = document.querySelector('.button.is-primary');
    const txt = $('downloadText');
    btn.disabled = true;
    btn.classList.add('is-loading');
    const originalText = txt.innerHTML;
    txt.innerHTML = '다운로드 중...';
    
    setTimeout(() => {
        try {
            const link = document.createElement('a');
            const text = val('thumbnailText').trim();
            link.download = text ? `${text.substring(0, 30).replace(/[^\w\s-]/g, '_')}_thumbnail.png` : 'thumbnail.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            txt.innerHTML = '완료!';
            setTimeout(() => { 
                txt.innerHTML = originalText; 
                btn.disabled = false; 
                btn.classList.remove('is-loading'); 
            }, 2000);
        } catch (e) {
            txt.innerHTML = '실패';
            console.error('Download failed:', e);
            setTimeout(() => { 
                txt.innerHTML = originalText; 
                btn.disabled = false; 
                btn.classList.remove('is-loading'); 
            }, 2000);
        }
    }, 300);
}
