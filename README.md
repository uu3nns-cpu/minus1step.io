# 1:1 썸네일 생성기

블로그나 소셜 미디어용 1:1 비율 썸네일을 쉽게 만들 수 있는 웹 기반 도구입니다.

## 주요 기능

### 🎨 스타일 프리셋
- 12가지 프리셋 스타일 제공 (모던, 그라디언트, 미니멀, 볼드, 소프트, 오션, 선셋, 포레스트, 다크, 네온, 파스텔, 베리)
- 각 프리셋은 배경색과 글자색이 최적화되어 있음
- 그라디언트 배경 자동 적용

### 🎨 색상 커스터마이징
- **배경색 팔레트**: 16가지 추천 배경색 (클릭으로 빠른 선택)
- **글자색 팔레트**: 16가지 추천 글자색 (클릭으로 빠른 선택)
- **테두리 색상 팔레트**: 16가지 테두리 색상 (클릭으로 빠른 선택)
- 컬러 피커로 자유로운 색상 선택 가능 (80px 넓은 영역)
- HEX 코드 직접 입력 가능 (#000000 형식)
- 모든 팔레트 색상에 테두리 표시로 명확한 구분

### ✍️ 텍스트 커스터마이징
- 다양한 한글/영문 글꼴 지원 (14종)
- 글자 크기 조절 (50% ~ 150%)
- **글자 테두리 추가 기능**
  - 테두리 색상 선택
  - 테두리 두께 조절 (1px ~ 20px)
- 자동 줄바꿈 처리

### 💾 내보내기
- 1000x1000px PNG 이미지로 다운로드
- 고화질 출력

## 사용 방법

1. 브라우저에서 `thumbnail_generator_v2.html` 파일을 엽니다
2. **스타일 선택**:
   - 12가지 프리셋 중 하나를 클릭하거나
   - 색상 팔레트에서 원하는 색상을 클릭하거나
   - 컬러 피커로 자유롭게 선택하거나
   - HEX 코드를 직접 입력합니다
3. 썸네일에 표시할 텍스트를 입력합니다
4. 글꼴과 크기를 조절합니다 (50% ~ 150%)
5. 필요시 글자 테두리를 추가합니다:
   - "글자 테두리 추가" 체크박스 클릭
   - 테두리 색상 선택 (16가지 팔레트 또는 커스텀)
   - 테두리 두께 조절 (1px ~ 20px)
6. 미리보기를 확인하고 "다운로드" 버튼을 클릭합니다
7. 1000x1000px PNG 이미지가 다운로드됩니다

## 기술 스택

- HTML5 Canvas
- Vanilla JavaScript
- CSS3 (Grid, Flexbox)
- Google Fonts
- 반응형 디자인 (1400px max-width)

## 디자인 특징

- **넓은 컨트롤 패널**: 480px 너비로 최적화된 UI
- **직관적인 색상 선택**: 팔레트 클릭 한 번으로 즉시 적용
- **실시간 미리보기**: 모든 변경사항이 즉시 반영
- **감각적인 색상 팔레트**: 테두리와 호버 효과로 명확한 시각적 피드백

## Google Analytics & AdSense 설정

이 프로젝트는 Google Analytics와 Google AdSense가 포함되어 있습니다.

### Google Analytics

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-RWS3BEEQ84"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-RWS3BEEQ84');
</script>
```

**설정 방법:**
1. [Google Analytics](https://analytics.google.com/)에 접속
2. 속성 생성 후 측정 ID(G-XXXXXXXXXX) 복사
3. HTML의 `G-RWS3BEEQ84` 부분을 자신의 측정 ID로 변경

### Google AdSense

```html
<!-- Google AdSense -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9257454501555292"
     crossorigin="anonymous"></script>
```

**설정 방법:**
1. [Google AdSense](https://www.google.com/adsense/)에 가입 및 승인
2. 사이트 추가 후 게시자 ID(ca-pub-XXXXXXXXXXXXXXXX) 복사
3. HTML의 `ca-pub-9257454501555292` 부분을 자신의 게시자 ID로 변경

### 광고 단위 추가 (선택사항)

광고를 표시하려면 원하는 위치에 광고 단위 코드를 추가하세요:

```html
<!-- 예시: 페이지 상단 광고 -->
<ins class="adsbygoogle"
     style="display:block"
     data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
     data-ad-slot="1234567890"
     data-ad-format="auto"
     data-full-width-responsive="true"></ins>
<script>
     (adsbygoogle = window.adsbygoogle || []).push({});
</script>
```

## 버전 정보

### v2.0 (2024)
- 페이지 너비 확대 (1200px → 1400px)
- 컨트롤 패널 확대 (420px → 480px)
- 컬러 피커 영역 확대 (52px → 80px)
- 색상 팔레트 테두리 추가로 명확한 시각적 구분
- 호버 효과 강화 (그림자 효과 추가)
- 색상 팔레트 오버플로우 문제 해결
- 반응형 디자인 최적화

### v1.0
- 기본 썸네일 생성 기능
- 12가지 프리셋 스타일
- 글자 테두리 기능
- 색상 팔레트 시스템

## 브라우저 호환성

- Chrome (권장)
- Firefox
- Safari
- Edge

## 라이선스

이 프로젝트는 개인 및 상업적 용도로 자유롭게 사용 가능합니다.

## 제작자

- 블로그: [minus1step.tistory.com](https://minus1step.tistory.com/)

## 개선 사항 제안

이슈나 개선 사항이 있으시면 블로그를 통해 연락해주세요!
