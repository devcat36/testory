# Testory 🔮

> 한 번의 테스트, 너의 이야기 — 7개 질문으로 알아보는 **나의 전생 영혼동물**.

8종의 신화 아키타입 동물(3개 이분 축, 2³=8) 중 하나를 일러스트 카드 + 희귀도로 보여주고
카톡/SNS에 공유하는, **서버 없는 정적 웹앱**.

- 컨셉/설계: [`discovery/`](./discovery)
- 요구사항: [`req/`](./req)
- 배포: [`deploy/README.md`](./deploy/README.md)

## 스택

- **Next.js 14 (App Router) 정적 export** (`output: 'export'`) — 100% 정적, 클라이언트 채점, 백엔드 0
- 결과 OG 카드 = 빌드 타임 생성 (satori + resvg, `scripts/gen-og.mjs`) → `public/og/<code>.png`
- 런타임 = `nginx:alpine` 정적 서빙 (`:8080`, `/healthcheck`)
- 배포 = 홈랩 3노드 HA (GitHub → Jenkins buildx 멀티아치 → Gitea → 노드별 컨테이너 → NPM LE → Cloudflare multi-A → ActionsHA-test)

## 구조

```
src/
  app/
    layout.js          # 메타데이터 / OG 기본값
    page.js            # 시작 화면
    quiz/page.js       # 7문항 퀴즈 (client, 클라이언트 채점)
    r/[code]/page.js   # 결과 카드 (8개 정적 생성 + per-code OG 메타)
    not-found.js
  components/ShareBar.js
  lib/{data,scoring,rarity}.js
  data/test-design.json  # 콘텐츠 SSOT (discovery에서 동기화)
scripts/gen-og.mjs       # 빌드 타임 OG PNG 생성
assets/fonts/            # Pretendard TTF (OG 렌더용)
```

## 로컬 개발

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # gen-og + next build -> out/
```

## 도메인

`https://testory.turtlelab.cc` (Cloudflare zone `turtlelab.cc`, 3노드 proxied multi-A)
