# 🎬 KDrama TOPIK — 클로드코드 작업 브리핑

> **프로젝트:** kdrama-topik  
> **GitHub:** https://github.com/kudora96/kdrama-topik  
> **Firebase Studio:** https://studio.firebase.google.com/kdrama-topik-97927302  
> **현재 상태:** S001 프로토타입만 작동 중  
> **목표:** E01-C01 기반 프로덕션 구조로 전환

---

## 📋 작업 순서 (4단계)

| 순서 | 작업 | 상태 |
|------|------|------|
| **STEP 1** | 폴더 구조 재설계 | ⬜ |
| **STEP 2** | 시작 페이지 (v6) → 실제 코드 전환 | ⬜ |
| **STEP 3** | subtitles.json 생성 (SRT → JSON) | ⬜ |
| **STEP 4** | E01-C01 학습 화면 (영상+자막+퀴즈) | ⬜ |

---

## STEP 1: 폴더 구조 재설계

### 현재 구조 (S001 전용)
```
kdrama-topik/
├── public/
│   ├── index.html          ← S001 하드코딩 (3558줄, videoId: srN85EUD1kI)
│   ├── manifest.json
│   └── sw.js
├── data/
│   ├── subtitles.json      ← S001 전용 (ko+ne 103문장)
│   ├── explanations.json   ← S001 전용
│   └── quiz.json           ← S001 전용
├── audio/
│   ├── kr/                 ← S001 TTS (S01E01_001_kr.mp3...)
│   ├── ne/
│   ├── jamo/
│   └── quiz/S001/
├── images/quiz/S001/
└── .idx/
```

### 목표 구조 (멀티 클립)
```
kdrama-topik/
├── index.html              ← 시작 페이지 (랜딩+대시보드)
├── learn.html              ← 학습 화면 (클립 ID 파라미터로 동적 로딩)
│
├── data/
│   ├── dramas.json         ← 드라마 카탈로그 (CLOY, 추후 추가)
│   ├── cloy/               ← 사랑의 불시착 데이터
│   │   ├── episodes.json   ← 에피소드/클립 목록 + YouTube ID
│   │   ├── E01-C01.json    ← 자막 + 설명 + 퀴즈 통합
│   │   ├── E01-C02.json
│   │   └── ...
│   └── S001/               ← 기존 프로토타입 데이터 보존
│       ├── subtitles.json
│       ├── explanations.json
│       └── quiz.json
│
├── audio/                  ← 기존 S001 오디오 유지 (추후 클립별로 재구성)
│   ├── kr/
│   ├── ne/
│   ├── jamo/
│   └── quiz/S001/
│
├── shared/                 ← 공통 리소스
│   ├── style.css           ← 공통 CSS (다크/라이트 테마)
│   ├── app.js              ← 공통 JS (테마, 네비게이션, 구독 로직)
│   └── components.js       ← 재사용 UI 컴포넌트
│
├── S001/                   ← 기존 프로토타입 (독립 작동 유지)
│   └── index.html          ← 기존 public/index.html 이동
│
├── images/quiz/S001/
├── manifest.json
└── sw.js
```

### 작업 내용
1. `public/index.html` → `S001/index.html`로 이동 (기존 프로토타입 보존)
2. `data/` 내 S001 파일들 → `data/S001/`로 이동
3. `data/cloy/` 폴더 생성
4. `shared/` 폴더 생성
5. 새 `index.html` 생성 (STEP 2)
6. 새 `learn.html` 생성 (STEP 4)
7. `data/dramas.json` 생성
8. `data/cloy/episodes.json` 생성 (249클립 YouTube ID 매핑)

### S001 경로 호환성
S001/index.html 내부의 data 로딩 경로 수정 필요:
- 기존: `../data/subtitles.json`
- 변경: `../data/S001/subtitles.json`

---

## STEP 2: 시작 페이지 → 실제 코드 전환

프로토타입 HTML (v6)을 실제 프로덕션 코드로 전환.

### 핵심 파일
- `index.html` — 메인 진입점
- `shared/style.css` — 다크/라이트 테마 CSS 변수
- `shared/app.js` — 테마 토글, 첫방문/재방문 분기, 구독 모달

### 포함 기능
- **첫 방문:** 풀 랜딩 페이지 (WHY 섹션, 비교표, 가격, User Journey)
- **재방문:** 대시보드 (이어하기 카드, 학습 통계, 드라마 목록)
- **다크/라이트 모드** 토글
- **PRO 구독** 바텀 시트
- **드라마 카탈로그** → 에피소드 → 클립 목록 네비게이션
- **클립 클릭** → `learn.html?clip=E01-C01` 로 이동

### Brand Identity (기획서 PDF p13)
- **다크 기본:** `#0e1018`
- **컬러:** Teal `#00cec9` + Purple `#6c5ce7`
- **폰트:** Bebas Neue (헤드라인) + Sora (본문) + Space Mono (뱃지)
- **그라데이션:** `linear-gradient(135deg, #00cec9, #6c5ce7)`

### 시작 페이지 핵심 메시지 (기획서 반영)
- 히어로: "교재를 버리고, 드라마를 켜세요"
- 수치: 6.5% 합격률 / ₩100만 비용 / $1.50 K▶T
- Old Way vs New Way 비교
- User Journey: Watch → Quiz → Speak → Review
- 경쟁 비교표: K▶T vs 기존앱 vs 오프라인
- 수익 모델: FREE / AD(보상형) / PRO 구독 ($1.50~$3.50/월)

### 프로토타입 파일 위치
v6 HTML 파일을 참조: (이 브리핑과 함께 제공)

---

## STEP 3: SRT → JSON 변환

### 입력
EP1, EP2 SRT 파일 (한국어 자막, 타임스탬프 포함)
- 위치: `K:\기타\kdrama-topik-plan\기획안02한국 취업을 꿈꾸는\사랑의불시착(디글)\`
- EP1 클립: E01-C01 ~ E01-C11 (각 클립별 SRT)
- EP2 클립: E02-C01 ~ E02-C15

### 출력 형식 (클립별 JSON)
```json
// data/cloy/E01-C01.json
{
  "clip_id": "E01-C01",
  "drama": "cloy",
  "episode": 1,
  "clip_num": 1,
  "youtube_id": "YvIJMGPzfro",
  "title": "현빈❤️손예진, 둘리커플 서사의 시작...",
  "subtitles": [
    {
      "id": 1,
      "start": 0.0,
      "end": 3.5,
      "ko": "여기가 어디야?",
      "ne": "यो कहाँ हो?"
    },
    ...
  ],
  "explanations": [],
  "quiz": []
}
```

### 변환 스크립트
Python 스크립트로 SRT 파싱 → JSON 생성
- SRT 타임스탬프 → 초(float) 변환
- 네팔어 번역은 빈칸 (추후 AI 번역 + 검수)
- explanations, quiz는 빈 배열 (추후 Claude API로 생성)

---

## STEP 4: E01-C01 학습 화면

### 핵심 파일
- `learn.html` — URL 파라미터로 클립 로딩 (`?clip=E01-C01`)

### 기능 (기존 S001 index.html 기반)
현재 S001/index.html의 핵심 기능을 재사용하되, 동적 데이터 로딩으로 변경:

1. **YouTube 플레이어** — `youtube_id`로 동적 로딩
2. **자막 동기화** — 시간 기반 ko/ne 자막 표시
3. **자막 인터랙션:**
   - 클릭 → 구간 반복 (속도 조절 1x/0.7x/0.5x)
   - 루프 모드 (일시정지 간격)
   - TTS 설명 (한국어/네팔어)
4. **쓰기 연습** — 한글 자모 분해 → 조합
5. **EPS-TOPIK 퀴즈** — 읽기 + 듣기
6. **자막 크기 조절**
7. **다크/라이트 모드**

### 데이터 로딩 방식
```javascript
// URL에서 클립 ID 추출
const clipId = new URLSearchParams(location.search).get('clip'); // 'E01-C01'
const drama = 'cloy'; // 추후 URL에서 추출

// JSON 로딩
const data = await fetch(`data/${drama}/${clipId}.json`).then(r => r.json());

// YouTube 플레이어 초기화
player = new YT.Player('player', { videoId: data.youtube_id });

// 자막 렌더링
data.subtitles.forEach(sub => { ... });
```

### 네비게이션
- ← 이전 클립 / 다음 클립 → 버튼
- 에피소드 목록으로 돌아가기
- 홈으로 돌아가기

---

## 참고 자료

### 249클립 YouTube URL 매핑
`cloy_naming_map.md` 파일에 전체 매핑 있음:
- E01-C01 ~ E16-C12
- 각 클립별 YouTube URL, 원본 파일명

### episodes.json 구조
```json
{
  "drama_id": "cloy",
  "title": "사랑의 불시착",
  "title_en": "Crash Landing on You",
  "year": 2019,
  "total_episodes": 16,
  "total_clips": 249,
  "episodes": [
    {
      "ep": 1,
      "clips": [
        {"id": "E01-C01", "vid": "YvIJMGPzfro", "title": "현빈❤️손예진..."},
        {"id": "E01-C02", "vid": "rCz4CFwZy6w", "title": "Ri Jeong-hyeok VS..."},
        ...
      ]
    },
    ...
  ]
}
```

### 기존 S001 index.html 핵심 구조
- 3558줄 단일 HTML
- YouTube IFrame API
- subtitles.json에서 시간 기반 자막 로딩
- explanations.json에서 문법 설명 로딩
- quiz.json에서 퀴즈 로딩
- Web Speech API TTS
- 자모 분해 쓰기 연습

---

## ⚠️ 주의사항

1. **S001 보존** — 기존 프로토타입이 깨지면 안 됨. 이동 후 경로만 수정.
2. **GitHub Pages 호환** — 서버 없이 정적 파일만 사용. SPA 라우터 X.
3. **모바일 최적화** — 네팔 저사양 스마트폰이 주 타겟. 경량화 필수.
4. **PWA 유지** — manifest.json, sw.js 경로 업데이트 필요.
5. **점진적 구축** — EP1-2만 자막 있음. 나머지는 빈 데이터로 준비.
