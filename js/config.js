// ===== 데이터 및 설정 =====
const colorPalettes = {
    background: ['#667eea', '#f093fb', '#00c6ff', '#ff6b6b', '#11998e', '#ffeaa7', '#2c3e50', '#1a1a2e', '#ee0979', '#764ba2', '#0072ff', '#38ef7d', '#feca57', '#fab1a0', '#34495e', '#dfe6e9'],
    text: ['#ffffff', '#000000', '#333333', '#ffff00', '#00ff88', '#ff6b6b', '#667eea', '#2d3436', '#f5f5f5', '#1a1a1a', '#feca57', '#00c6ff', '#ee0979', '#38ef7d', '#fab1a0', '#764ba2'],
    stroke: ['#000000', '#ffffff', '#333333', '#ffff00', '#ff0000', '#00ff00', '#0000ff', '#ff6b6b', '#667eea', '#2c3e50', '#1a1a2e', '#764ba2', '#ee0979', '#38ef7d', '#fab1a0', '#feca57'],
    border: ['#ffffff', '#000000', '#667eea', '#f093fb', '#ff6b6b', '#feca57', '#00c6ff', '#38ef7d', '#764ba2', '#2c3e50', '#ffff00', '#00ff88', '#ee0979', '#fab1a0', '#1a1a2e', '#dfe6e9']
};

const presets = {
    modern: { bgColor: '#667eea', textColor: '#ffffff', gradient: true, gradientColor: '#764ba2', fontFamily: "'Noto Sans KR', sans-serif", fontWeight: '700' },
    gradient: { bgColor: '#f093fb', textColor: '#ffffff', gradient: true, gradientColor: '#f5576c', fontFamily: "'Gothic A1', sans-serif", fontWeight: '700' },
    minimal: { bgColor: '#ffffff', textColor: '#333333', gradient: false, fontFamily: "'Noto Sans KR', sans-serif", fontWeight: '500' },
    bold: { bgColor: '#000000', textColor: '#ffff00', gradient: false, fontFamily: "'Black Han Sans', sans-serif", fontWeight: '400' },
    ocean: { bgColor: '#00c6ff', textColor: '#ffffff', gradient: true, gradientColor: '#0072ff', fontFamily: "'Gothic A1', sans-serif", fontWeight: '700' },
    sunset: { bgColor: '#ff6b6b', textColor: '#ffffff', gradient: true, gradientColor: '#feca57', fontFamily: "'Jua', sans-serif", fontWeight: '400' },
    neon: { bgColor: '#000000', textColor: '#00ff88', gradient: false, fontFamily: "'Gugi', cursive", fontWeight: '400', textStroke: true, strokeColor: '#00ff88', strokeWidth: 3 },
    pastel: { bgColor: '#ffeaa7', textColor: '#2d3436', gradient: true, gradientColor: '#fab1a0', fontFamily: "'Hi Melody', cursive", fontWeight: '400' },
    vintage: { bgColor: '#d4a574', textColor: '#3e2723', gradient: false, fontFamily: "'Nanum Myeongjo', serif", fontWeight: '700', canvasBorder: true, borderColor: '#8d6e63', borderWidth: 30 },
    dark: { bgColor: '#1a1a2e', textColor: '#0f4c75', gradient: true, gradientColor: '#16213e', fontFamily: "'Gothic A1', sans-serif", fontWeight: '700', textStroke: true, strokeColor: '#ffffff', strokeWidth: 2 },
    nature: { bgColor: '#11998e', textColor: '#ffffff', gradient: true, gradientColor: '#38ef7d', fontFamily: "'Gothic A1', sans-serif", fontWeight: '700' },
    candy: { bgColor: '#ff6ec4', textColor: '#ffffff', gradient: true, gradientColor: '#7873f5', fontFamily: "'Cute Font', cursive", fontWeight: '400' }
};

const ratios = { 
    '1:1': [800, 800], 
    '9:16': [864, 1536], 
    '3:4': [864, 1152], 
    '4:3': [1152, 864], 
    '16:9': [1536, 864] 
};

// 감정표현 이모지 18종 (9종 추가)
const emojis = [
    '😀', '😊', '😍', '🥰', '😎', '🤩', '😭', '🤔', '😱', // 감정표현 9종
    '🤗', '🥳', '😅', '🤭', '😏', '🥺', '😤', '🤯', '😇', // 감정표현 추가 9종
    '✨', '🔥', '💡', '🎉', '❤️', '🚀', '🌟', '👍', '💯', 
    '🎯', '💬', '📚', '✅', '🔔', '🎨'
];

let currentPreset = 'modern';
let currentRatio = '1:1';
let saveTimer = null;
