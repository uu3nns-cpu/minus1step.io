// ===== 유틸리티 함수 =====
const debounce = (func, delay = 800) => {
    let timer;
    return (...args) => { 
        clearTimeout(timer); 
        timer = setTimeout(() => func(...args), delay); 
    };
};

const $ = (id) => document.getElementById(id);
const val = (id) => $(id).value;
const setVal = (id, v) => { $(id).value = v; };

// ===== 일시저장 개선 =====
function debouncedSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        try {
            localStorage.setItem('thumbnailSettings', JSON.stringify({
                preset: currentPreset, 
                ratio: currentRatio, 
                text: val('thumbnailText'), 
                bgColor: val('bgColor'), 
                textColor: val('textColor'),
                fontFamily: val('fontFamily'), 
                fontSize: val('fontSizeScale'), 
                hasStroke: $('textStroke').checked, 
                strokeColor: val('strokeColor'),
                strokeWidth: val('strokeWidth'), 
                hasBorder: $('canvasBorder').checked, 
                borderColor: val('borderColor'), 
                borderWidth: val('borderWidth')
            }));
        } catch (e) {
            console.warn('저장 실패:', e);
        }
    }, 1000);
}

// ===== 폰트 로드 개선 =====
async function ensureFontLoaded(fontFamily, fontWeight = '700') {
    const fontName = fontFamily.match(/'([^']+)'/)?.[1] || fontFamily.split(',')[0].trim();
    
    console.log(`폰트 로딩 시작: ${fontName} (weight: ${fontWeight})`);
    
    try {
        // 다양한 크기로 폰트 로드 시도
        const loadPromises = [
            document.fonts.load(`${fontWeight} 16px "${fontName}"`),
            document.fonts.load(`${fontWeight} 24px "${fontName}"`),
            document.fonts.load(`${fontWeight} 48px "${fontName}"`),
            document.fonts.load(`${fontWeight} 72px "${fontName}"`),
            document.fonts.load(`${fontWeight} 96px "${fontName}"`),
            document.fonts.load(`${fontWeight} 120px "${fontName}"`)
        ];
        
        await Promise.all(loadPromises);
        
        // 폰트가 실제로 로드되었는지 확인
        const testText = '블로그썸네일생성기';
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 각 글자별로 폰트가 제대로 적용되는지 테스트
        for (const char of testText) {
            ctx.font = `${fontWeight} 48px "${fontName}"`;
            const width = ctx.measureText(char).width;
            
            // 폴백 폰트로 렌더링되는지 확인
            ctx.font = `${fontWeight} 48px sans-serif`;
            const fallbackWidth = ctx.measureText(char).width;
            
            if (Math.abs(width - fallbackWidth) < 0.1) {
                console.warn(`⚠️ 글자 '${char}'가 폴백 폰트로 렌더링될 수 있음 (${fontName})`);
            }
        }
        
        console.log(`✓ 폰트 로드 완료: ${fontName} ${fontWeight}`);
        
        // 폰트 완전히 로드될 때까지 추가 대기
        await document.fonts.ready;
        await new Promise(r => setTimeout(r, 100));
    } catch (e) {
        console.warn(`Font loading failed:`, e);
        // 실패 시 더 긴 대기 시간
        await new Promise(r => setTimeout(r, 500));
    }
}
