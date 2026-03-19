# KDrama TOPIK — 프로젝트 규칙

> GitHub Pages 정적 사이트. 서버 없음. 로컬 서버 절대 실행 금지.
> push = `git add -A && git commit && git push`

## 폴더 구조

```
kdrama-topik/
├── index.html                  ← 메인 (드라마/에피소드 선택)
├── learn.html                  ← 학습 (자막 재생 + 설명)
├── data/
│   ├── dramas.json
│   └── cloy/
│       ├── episodes.json       ← 에피소드 메타
│       └── E01-C01.json …      ← 클립별 자막+설명+퀴즈
├── audio/
│   ├── chars/                  ← 글자(음절) 발음 (288개)
│   ├── words_common/           ← 단어 발음 — 에피소드 공통 (124개)
│   ├── jamo/                   ← 자모 발음 (40개)
│   ├── kr/{클립ID}/            ← 한국어 설명 TTS
│   ├── np/{클립ID}/            ← 네팔어 설명 TTS (ne 아님!)
│   └── quiz/S001/              ← 퀴즈 오디오
├── tools/                      ← 오디오 제작 목록 등 유틸
└── shared/
```

## 오디오 네이밍 규칙

### chars/ — 글자(음절) 발음
- 파일명: 로마자 표기 + `.mp3`
- 예: `ga.mp3`, `geon.mp3`, `hyang.mp3`
- 예외: 한글 모음과 겹치는 이름은 `_char` 접미사 → `a_char.mp3`, `e_char.mp3`, `eo_char.mp3`, `in_char.mp3`, `ne_char.mp3`, `u_char.mp3`, `ui_char.mp3`, `wi_char.mp3`, `ye_char.mp3`, `yeo_char.mp3`
- **한 음절 단어(나, 다, 또, 왜 등)는 chars/ 파일 재사용 가능** — 별도 words_common 파일 불필요

### words_common/ — 단어 발음 (에피소드 공통)
- 파일명: 로마자 표기 + `.mp3`
- 예: `gangnyeokhada.mp3`, `dongsie.mp3`
- 여러 에피소드에서 공유하는 단어

### jamo/ — 자모 발음
- 파일명: 자모 이름 로마자 + `.mp3`
- 예: `giyeok.mp3`, `bieup.mp3`, `chieut.mp3`

### kr/, np/ — 자막 설명 TTS
- 경로: `audio/{kr|np}/{클립ID}/{클립ID}_{번호2자리}_{언어}.mp3`
- 예: `audio/kr/E01-C01/E01-C01_01_kr.mp3`
- 예: `audio/np/E01-C01/E01-C01_01_np.mp3`

### quiz/ — 퀴즈 오디오
- 경로: `audio/quiz/S001/L{번호}_{타입}.mp3`

## 네팔어 코드: "np" 통일 (ne 절대 금지)

| 항목 | 올바름 | 틀림 |
|------|--------|------|
| 폴더 | audio/**np**/ | audio/~~ne~~/ |
| JSON 키 | "np", "audio_np" | ~~"ne"~~, ~~"audio_ne"~~ |
| 파일명 | _**np**.mp3 | ~~_ne.mp3~~ |

## JSON 구조 (data/cloy/E##-C##.json)

```json
{
  "clip_id": "E01-C01",
  "drama": "cloy",
  "episode": 1,
  "clip_num": 1,
  "youtube_id": "필수! 비면 영상 안 나옴",
  "title": "",
  "subtitles": [
    { "id": 1, "start": 0.0, "end": 3.5, "ko": "한국어", "ne": "नेपाली" }
  ],
  "explanations": [
    {
      "sub_id": 1,
      "kr": "한국어 설명",
      "np": "नेपाली व्याख्या",
      "audio_kr": "E01-C01_01_kr.mp3",
      "audio_np": "E01-C01_01_np.mp3"
    }
  ]
}
```

## 오디오 재사용 규칙

1. 새 오디오 목록 만들 때, **먼저 기존 chars/와 words_common/ 확인**
2. 이미 있는 파일은 "재사용"으로 표시, 새로 만들 파일만 "새로" 표시
3. **한 음절 단어 = chars/ 재사용** (같은 발음이므로)
4. 다음절 단어 중 words_common/에 있으면 재사용

## 주의사항

- **로컬 서버 실행 금지** — GitHub Pages만 사용
- **S001/ 보존** — 기존 프로토타입 건드리지 않기
- **오디오 .play()는 try-catch + .catch() 필수** — 에러가 다른 기능 차단하면 안 됨
- **모바일 최적화** — 네팔 저사양 스마트폰이 주 타겟
- youtube_id 누락 시 영상 안 나옴 → CLOY_Master_Map.md에서 복사
- 캐시 방지: JSON/JS 로드 시 `?v=YYYYMMDD` 사용
