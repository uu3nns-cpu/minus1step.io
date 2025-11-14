// ===== 색상 관리 =====
function setupColorInput(colorId, textId) {
    const c = $(colorId), t = $(textId);
    c.addEventListener('input', async (e) => { 
        t.value = e.target.value; 
        await generateThumbnail();
        debouncedSave();
    });
    t.addEventListener('input', async (e) => { 
        if (/^#[0-9A-F]{6}$/i.test(e.target.value)) { 
            c.value = e.target.value; 
            await generateThumbnail(); 
            debouncedSave();
        } 
    });
}

function createColorPalette(paletteId, targetColorId, targetTextId, colors) {
    const palette = $(paletteId);
    colors.forEach(color => {
        const s = document.createElement('div');
        s.className = 'color-swatch';
        s.style.background = color;
        s.onclick = async () => { 
            setVal(targetColorId, color); 
            setVal(targetTextId, color); 
            await generateThumbnail(); 
            debouncedSave();
        };
        palette.appendChild(s);
    });
}

function initColorPalettes() {
    createColorPalette('bgPalette', 'bgColor', 'bgColorText', colorPalettes.background);
    createColorPalette('textPalette', 'textColor', 'textColorText', colorPalettes.text);
    createColorPalette('strokePalette', 'strokeColor', 'strokeColorText', colorPalettes.stroke);
    createColorPalette('borderPalette', 'borderColor', 'borderColorText', colorPalettes.border);
}
