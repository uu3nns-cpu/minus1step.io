// ===== 이벤트 리스너 설정 =====
function setupEventListeners() {
    setupColorInput('bgColor', 'bgColorText'); 
    setupColorInput('textColor', 'textColorText');
    setupColorInput('strokeColor', 'strokeColorText'); 
    setupColorInput('borderColor', 'borderColorText');
    
    setupSlider('fontSizeScale', 'fontSizeValue', '%'); 
    setupSlider('strokeWidth', 'strokeWidthValue', 'px');
    setupSlider('borderWidth', 'borderWidthValue', 'px');
    
    const debouncedGenerate = debounce(async () => { 
        await generateThumbnail(); 
        debouncedSave();
    }, 500);
    
    $('thumbnailText').addEventListener('input', () => { 
        updateTextCounter(); 
        debouncedGenerate(); 
    });
    
    $('fontFamily').addEventListener('change', async () => {
        const sel = $('fontFamily');
        const fontFamily = val('fontFamily');
        let fontWeight = '700';
        
        if (sel && sel.options && sel.options[sel.selectedIndex]) {
            fontWeight = sel.options[sel.selectedIndex].getAttribute('data-weight') || '700';
        }
        
        console.log(`폰트 변경: ${fontFamily} (weight: ${fontWeight})`);
        await ensureFontLoaded(fontFamily, fontWeight);
        await generateThumbnail();
        debouncedSave();
    });
    
    $('textStroke').addEventListener('change', async (e) => { 
        $('strokeControls').style.display = e.target.checked ? 'block' : 'none'; 
        await generateThumbnail(); 
        debouncedSave();
    });
    
    $('canvasBorder').addEventListener('change', async (e) => { 
        $('borderControls').style.display = e.target.checked ? 'block' : 'none'; 
        await generateThumbnail();
        debouncedSave();
    });
}

// ===== 초기화 =====
window.addEventListener('load', async () => {
    try {
        // 1. UI 초기화
        initColorPalettes(); 
        initEmojis();
        updateTextCounter();
        setupEventListeners(); 
        setupKeyboardNavigation();
        
        // 2. 모든 폰트가 로드될 때까지 대기
        console.log('폰트 로딩 시작...');
        await document.fonts.ready;
        console.log('폰트 로딩 완료!');
        
        // 3. 설정 로드 및 썸네일 생성
        await loadSettings();
        
        // 4. 추가 대기 후 썸네일 생성 (폰트 완전 적용 보장)
        await new Promise(resolve => setTimeout(resolve, 200));
        await generateThumbnail();
        
        console.log('초기화 완료!');
    } catch (error) {
        console.error('초기화 중 오류:', error);
        // 오류가 있어도 기본 썸네일은 생성
        await generateThumbnail();
    }
});
