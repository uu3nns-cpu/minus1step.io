# 🎨 스타일 가이드 - Before & After

## 📐 간격 시스템 비교

### Before (불규칙)
```css
padding: 1rem;
margin-bottom: 1rem;
padding: 0.75rem;
gap: 0.5rem;
padding: 1.2rem;
/* 일관성 없는 값들 */
```

### After (체계적)
```css
--space-xs: 0.5rem;   /* 8px  - 아주 작은 간격 */
--space-sm: 0.75rem;  /* 12px - 작은 간격 */
--space-md: 1rem;     /* 16px - 기본 간격 */
--space-lg: 1.5rem;   /* 24px - 큰 간격 */
--space-xl: 2rem;     /* 32px - 아주 큰 간격 */

/* 사용 예시 */
padding: var(--space-lg);
margin-bottom: var(--space-md);
gap: var(--space-sm);
```

## 🔤 타이포그래피 비교

### Before
```css
font-size: 1.8rem;  /* h1 */
font-size: 1.1rem;  /* h2 */
font-size: 0.95rem; /* body */
font-size: 0.8rem;  /* small */
/* 일관성 없는 크기 */
```

### After
```css
--font-xs: 0.75rem;   /* 12px - 작은 텍스트 */
--font-sm: 0.875rem;  /* 14px - 부가 정보 */
--font-md: 1rem;      /* 16px - 본문 */
--font-lg: 1.125rem;  /* 18px - 강조 */
--font-xl: 1.5rem;    /* 24px - 소제목 */
--font-2xl: 2rem;     /* 32px - 제목 */

/* 사용 예시 */
h1 { font-size: var(--font-2xl); }
h2 { font-size: var(--font-xl); }
p { font-size: var(--font-md); }
```

## 🎨 색상 시스템 비교

### Before
```css
background: rgba(255, 255, 255, 0.15);
background: rgba(255, 255, 255, 0.1);
background: rgba(255, 255, 255, 0.25);
/* 하드코딩된 투명도 */
```

### After
```css
--glass-bg: rgba(255, 255, 255, 0.15);
--glass-border: rgba(255, 255, 255, 0.2);
--glass-hover: rgba(255, 255, 255, 0.25);

--text-white: #ffffff;
--text-light: rgba(255, 255, 255, 0.9);
--text-hint: rgba(255, 255, 255, 0.7);

/* 사용 예시 */
background: var(--glass-bg);
border: 1px solid var(--glass-border);
color: var(--text-light);
```

## 📦 컴포넌트 스타일 비교

### 버튼 스타일

#### Before
```css
.action-button {
    border-radius: 12px;
    font-size: 1rem;
    padding: 0.75rem 1.25rem;
    transition: all 0.3s ease;
}

.action-button:hover {
    transform: translateY(-2px);
}
```

#### After
```css
.action-button {
    border-radius: var(--radius-md);
    font-size: var(--font-md);
    padding: var(--space-md) var(--space-lg);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

/* Ripple 효과 추가 */
.action-button::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
}

.action-button:hover::before {
    width: 300px;
    height: 300px;
}

.action-button:hover {
    transform: translateY(-2px);
}
```

### 탭 스타일

#### Before
```html
<button class="tab-button">기본 설정</button>
```

```css
.tab-button {
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.1);
}
```

#### After
```html
<button class="tab-button" role="tab" aria-selected="true">
    ⚙️ 기본 설정
</button>
```

```css
.tab-button {
    padding: var(--space-md);
    background: var(--glass-bg);
    transition: all 0.3s ease;
}

.tab-button:hover {
    background: var(--glass-hover);
    transform: translateY(-1px);
}

.tab-button.active {
    background: var(--glass-hover);
    border-color: var(--text-white);
    box-shadow: 0 4px 12px rgba(255, 255, 255, 0.2);
}
```

## 🎭 섹션 제목 비교

### Before
```html
<h2 class="section-title">미리보기</h2>
<label class="label">비율 선택</label>
<label class="label">스타일 프리셋</label>
```

### After
```html
<h2 class="section-title">🎨 미리보기</h2>
<label class="label">📐 비율 선택</label>
<label class="label">🎭 스타일 프리셋</label>
```

**개선 효과:**
- 시각적 힌트 제공
- 섹션 구분 명확화
- 사용자 경험 향상

## 📱 반응형 그리드 비교

### Before
```css
.preset-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0.5rem;
}

@media (max-width: 768px) {
    .preset-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

### After
```css
.preset-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
    gap: var(--space-sm);
}

/* 더 세밀한 반응형 */
@media (max-width: 768px) {
    .preset-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (max-width: 480px) {
    .preset-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}
```

**개선 효과:**
- 자동 반응형 (auto-fit)
- 더 세밀한 브레이크포인트
- 일관된 간격

## ♿ 접근성 개선

### Before
```html
<button onclick="changeRatio('1:1')">1:1</button>
<button onclick="applyPreset('modern')">모던</button>
```

### After
```html
<button onclick="changeRatio('1:1')" 
        aria-pressed="true" 
        aria-label="1:1 비율">
    1:1
</button>

<button onclick="applyPreset('modern')" 
        aria-label="모던 스타일" 
        aria-pressed="true">
    <div class="preset-preview-compact"></div>
    <span>모던</span>
</button>
```

**개선 효과:**
- 스크린 리더 지원
- 상태 정보 제공
- 키보드 네비게이션 개선

## 🎯 Focus 스타일 개선

### Before
```css
/* 기본 브라우저 outline */
```

### After
```css
*:focus-visible {
    outline: 3px solid rgba(255, 255, 255, 0.6);
    outline-offset: 2px;
}

.ratio-button:focus,
.tab-button:focus {
    outline: 3px solid rgba(255, 255, 255, 0.6);
    outline-offset: 2px;
}
```

**개선 효과:**
- 명확한 포커스 표시
- 키보드 사용자 친화적
- 접근성 향상

## 🎨 색상 팔레트 개선

### Before
```css
.color-swatch {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 10px;
    cursor: pointer;
    border: 2px solid rgba(255, 255, 255, 0.3);
}
```

### After
```css
.color-swatch {
    width: 100%;
    aspect-ratio: 1;
    border-radius: var(--radius-sm);
    cursor: pointer;
    border: 2px solid var(--glass-border);
    transition: all 0.3s ease;
    box-shadow: var(--shadow-sm);
}

.color-swatch:hover {
    transform: scale(1.15);
    border-color: var(--text-white);
    box-shadow: var(--shadow-md);
}

.color-swatch:focus {
    outline: 3px solid rgba(255, 255, 255, 0.8);
    outline-offset: 2px;
    transform: scale(1.15);
}
```

**개선 효과:**
- 부드러운 호버 효과
- 명확한 피드백
- 접근성 향상

## 📊 성능 최적화

### Before
```css
.button:hover {
    background: #5568d3;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}
```

### After
```css
.button:hover {
    transform: translateY(-2px); /* GPU 가속 */
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
}

/* will-change 추가 */
.action-button {
    will-change: transform;
}

/* prefers-reduced-motion 지원 */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```

**개선 효과:**
- GPU 가속 활용
- 부드러운 애니메이션
- 모션 감소 옵션 지원

## 🎯 주요 개선 요약

| 항목 | Before | After |
|------|--------|-------|
| **CSS 변수** | ❌ 없음 | ✅ 20+ 변수 |
| **타이포그래피** | 🟡 기본 | ✅ 6단계 시스템 |
| **간격** | 🟡 불규칙 | ✅ 5단계 시스템 |
| **접근성** | 🟡 부분 | ✅ 완벽 지원 |
| **애니메이션** | 🟡 기본 | ✅ Ripple 효과 |
| **반응형** | 🟡 2단계 | ✅ 4단계 |
| **성능** | 🟡 보통 | ✅ 최적화 |

## 💡 사용 팁

### 1. 간격 사용
```css
/* 좋음 ✅ */
padding: var(--space-md);
gap: var(--space-sm);

/* 나쁨 ❌ */
padding: 15px;
gap: 12px;
```

### 2. 폰트 크기
```css
/* 좋음 ✅ */
font-size: var(--font-lg);

/* 나쁨 ❌ */
font-size: 18px;
```

### 3. 색상
```css
/* 좋음 ✅ */
background: var(--glass-bg);
color: var(--text-light);

/* 나쁨 ❌ */
background: rgba(255, 255, 255, 0.15);
color: rgba(255, 255, 255, 0.9);
```

---

**이 가이드를 참고하여 일관된 디자인을 유지하세요!** 🎨
