# Testory — 요구사항 (Requirements)

`discovery/` 에서 확정한 방향을 추적 가능한 요구사항으로 정리한 문서.

## 한 줄 정의

> 7개 질문에 답하면 8종의 "전생 영혼동물" 중 하나를 일러스트 카드로 받아 카톡/인스타에 공유하는, 서버 없는 정적 웹앱.

## 문서

- [`functional.md`](./functional.md) — 기능 요구사항 (FR) · 화면/플로우/동작
- [`non-functional.md`](./non-functional.md) — 비기능 요구사항 (NFR) · 성능/호스팅/호환성/개인정보
- [`scope.md`](./scope.md) — MVP 범위 / 비범위(Out of scope) / 백로그

## 요구사항 ID 규칙

| 접두 | 의미 |
|---|---|
| `FR-#` | 기능 요구사항 (Functional Requirement) |
| `NFR-#` | 비기능 요구사항 (Non-Functional Requirement) |
| `우선순위` | `MUST` (MVP 필수) / `SHOULD` (있으면 좋음) / `COULD` (백로그) |

## 근거가 되는 확정 사항 (from discovery)

- 프로젝트명 **Testory**, 첫 테스트 = 전생 영혼동물 (8유형 / 3축 / 7문항)
- 결과 분석 = 정해진 분기, **클라이언트 점수 로직**, 서버/비용 0
- 결과 = 일러스트 카드 + 희귀도(%), 카톡/인스타 공유가 핵심 바이럴 후크
- 점수 로직은 전수 검증 완료 (동점 0건 / 8유형 도달 / 희귀도 합 100%) — `discovery/test-design.md` 참조
