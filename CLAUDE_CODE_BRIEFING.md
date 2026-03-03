# 🎬 KDrama TOPIK — 클로드코드 작업 브리핑

> **프로젝트:** kdrama-topik
> **GitHub:** https://github.com/kudora96/kdrama-topik
> **Firebase Studio:** https://studio.firebase.google.com/kdrama-topik-97927302
> **현재 상태:** E01-C01 완료, E01-C02 작업 중 (11번 자막부터)
> **최종 업데이트:** 2026-03-02

---

## 📋 프로젝트 현황

| 항목 | 상태 |
|------|------|
| 폴더 구조 재설계 | ✅ 완료 |
| 시작 페이지 (index.html) | ✅ 완료 |
| learn.html 학습 화면 | ✅ 완료 |
| E01-C01 자막+설명+음성 | ✅ 완료 (39개) |
| E01-C02 자막+설명+음성 | 🔄 진행 중 (1~10번 완료, 11번부터 계속) |
| E01-C03 ~ C08 JSON | ✅ 생성됨 (설명 미작성) |

---

## 📁 현재 폴더 구조

```
kdrama-topik/
├── index.html                    ← 메인 페이지 (드라마/에피소드 선택)
├── learn.html                    ← 학습 페이지 (자막 재생 + 설명)
├── kdrama_home_v6.html           ← 홈 v6 버전
│
├── data/
│   └── cloy/
│       ├── episodes.json         ← 에피소드 메타 정보
│       ├── E01-C01.json          ← ✅ 완료
│       ├── E01-C02.json          ← 🔄 작업 중
│       ├── E01-C03.json ~ E01-C08.json  ← 빈 설명
│       └── ...
│
├── audio/
│   ├── kr/                       ← 한국어 설명 TTS
│   │   ├── E01-C01/ (39개)
│   │   └── E01-C02/ (10개)
│   ├── np/                       ← 네팔어 설명 TTS (⚠️ ne 아님!)
│   │   ├── E01-C01/ (39개)
│   │   └── E01-C02/ (10개)
│   ├── quiz/
│   └── jamo/
│
├── shared/
├── S001/                         ← 기존 프로토타입 보존
├── CLAUDE_CODE_BRIEFING.md       ← 이 파일
├── CLOY_Master_Map.md            ← 249클립 YouTube URL 매핑
├── AUDIO_RULES.md                ← 오디오 파일/폴더 규칙
└── ...
```

---

## 🔊 오디오 파일 규칙 (필독!)

> 상세 내용은 `AUDIO_RULES.md` 참고. 아래는 핵심 요약.

### 네팔어 코드: "np"로 통일

| 항목 | 올바른 값 | 잘못된 값 |
|------|-----------|-----------|
| 폴더 | audio/**np**/ | audio/~~ne~~/ |
| JSON 키 | "**np**", "audio_**np**" | "~~ne~~", "audio_~~ne~~" |
| 파일명 | _**np**.mp3 | _~~ne~~.mp3 |

### 오디오 경로 조합 (learn.html)
```javascript
var path = 'audio/' + lang + '/' + CLIP_ID + '/' + audioFile;
// audio/kr/E01-C02/E01-C02_01_kr.mp3
// audio/np/E01-C02/E01-C02_01_np.mp3
```

### 오디오 재생 코드 규칙
- `new Audio()`와 `.play()`는 반드시 **try-catch + .catch()** 로 감쌀 것
- 오디오 에러가 유튜브 플레이어 등 다른 기능을 차단하면 안 됨
- 2026-03-02에 line 1007 수정 완료됨

---

## 📝 JSON 구조

```json
{
  "clip_id": "E01-C02",
  "drama": "cloy",
  "episode": 1,
  "clip_num": 2,
  "youtube_id": "rCz4CFwZy6w",    ← ⚠️ 반드시 채울 것!
  "title": "",
  "subtitles": [
    { "id": 1, "start": 0.0, "end": 3.5, "ko": "한국어", "ne": "नेपाली" }
  ],
  "explanations": [
    {
      "sub_id": 1,
      "kr": "한국어 설명",
      "np": "नेपाली व्याख्या",
      "audio_kr": "E01-C02_01_kr.mp3",
      "audio_np": "E01-C02_01_np.mp3"
    }
  ],
  "quiz": []
}
```

---

## ✅ 새 클립 작업 시 필수 체크리스트

### 시작 전
- [ ] `youtube_id` 채웠는가 (CLOY_Master_Map.md에서 복사)
- [ ] `audio/kr/{클립ID}/` 폴더 존재하는가
- [ ] `audio/np/{클립ID}/` 폴더 존재하는가 (ne 아님!)
- [ ] 폴더 비어있으면 `.gitkeep` 넣었는가

### 배포 전 (커밋 & 푸시 전)
- [ ] JSON의 youtube_id 확인
- [ ] audio/kr/ 에 kr mp3 파일 확인
- [ ] audio/np/ 에 np mp3 파일 확인
- [ ] learn.html 캐시 버전 업데이트 (`?v=YYYYMMDD`)
- [ ] 오디오 재생 코드에 try-catch 있는지 확인
- [ ] 사이트에서 Ctrl+Shift+R 후 영상 + 음성 테스트

---

## 🔄 캐시 방지

```javascript
fetch('data/' + DRAMA + '/' + CLIP_ID + '.json?v=20260302b')
fetch('data/' + DRAMA + '/episodes.json?v=20260302b')
```
- 현재 버전: `?v=20260302b`
- JSON 수정할 때마다 버전 올릴 것 (같은 날이면 a, b, c 추가)

---

## ⚠️ 과거 사고 기록 (같은 실수 반복 금지)

| # | 사고 | 원인 | 교훈 |
|---|------|------|------|
| 1 | ne→np 폴더 rename 시 파일 소실 | git rename 중 중첩 폴더 오류 | 폴더 변경 전 백업, 변경 후 파일 수 확인 |
| 2 | 빈 오디오 폴더 → 유튜브도 안 나옴 | 오디오 에러가 이후 코드 차단 | try-catch 필수, 폴더는 미리 생성 |
| 3 | youtube_id 누락 → 영상 안 나옴 | JSON에 빈 문자열 | Master Map에서 반드시 복사 |
| 4 | .play() 에러 전파 | try-catch 없음 | .play().catch() 패턴 사용 |

---

## 🎯 현재 작업

**E01-C02 자막 설명 작업 중**
- 총 54개 자막 (빈 자막 4개 제외)
- 1~10번: KR/NP 완료 + JSON 반영 + 음성 완료
- 11번부터: Claude 대화창에서 텍스트 생성 중
- 텍스트 완성 → ElevenLabs 음성 변환 → audio 폴더에 저장 → JSON 반영 → 커밋/푸시

---

## 📌 주의사항

1. **S001 보존** — 기존 프로토타입 깨지면 안 됨
2. **GitHub Pages 호환** — 서버 없이 정적 파일만 사용
3. **모바일 최적화** — 네팔 저사양 스마트폰이 주 타겟
4. **네팔어 코드는 np** — ne 절대 사용 금지
5. **오디오 코드는 try-catch 필수** — 파일 없어도 다른 기능 막으면 안 됨
