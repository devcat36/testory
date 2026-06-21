# Testory — 배포 (홈랩 3노드 HA)

기존 홈랩 HA 런북(`example.albireo.me` 검증본)을 그대로 따르되, **Spring Boot → Next.js 정적**,
**도메인 `*.albireo.me` → `testory.turtlelab.cc`** 두 가지만 다르다.

## 파이프라인

GitHub `devcat36/testory` → Jenkins(`testory`, buildx **linux/amd64,linux/arm64**) →
Gitea `gitea.albireo.me/crux/testory:latest` → 3노드 컨테이너(`8090:8080`) →
NPM LE 인증서(노드별) → Cloudflare proxied multi-A(zone `turtlelab.cc`) →
`devcat36/ActionsHA-test` 페일오버.

## ⚠️ 선결 블로커 — Cloudflare 토큰 (turtlelab.cc)

현재 홈랩 CF 토큰(`~/.cf-token`)은 **`albireo.me` / `sendbag.cc` 존만** 접근 가능.
`turtlelab.cc` 는 토큰 범위 밖이라 **3곳이 막힌다**:

1. NPM Let's Encrypt **DNS-01 challenge** (`testory.turtlelab.cc` 인증서) — 없으면 Cloudflare 525.
2. **A 레코드** 3개 생성 (노드 IP).
3. **ActionsHA-test** 의 DNS 자동 갱신(헬스 기반 페일오버).

### 필요한 것 (사용자 조치)

`turtlelab.cc` 존에 대해 **DNS:Edit + Zone:Read** 권한을 가진 Cloudflare API 토큰.
(기존 토큰의 범위를 turtlelab.cc까지 넓히거나, 새 토큰 발급. 새 토큰이면 NPM DNS-01 +
ActionsHA-test 시크릿에도 반영 필요.) 토큰 + `turtlelab.cc` zone id 확보되면 아래 5~8 진행.

## 단계

1. **Repo**: `devcat36/testory` (Dockerfile 멀티스테이지: `node:22` 빌드 @ `$BUILDPLATFORM` →
   `nginx:alpine` 런타임, `EXPOSE 8080`, `/healthcheck`). Jenkinsfile = buildx 멀티아치 push.
   빌드는 정적 산출물이라 amd64에서 1회만 → arm64 에뮬레이션 빌드 없음(Jetson 안전).
2. **Jenkins job** `testory`: multibranch, cred `gitea_albireo`, GitHubSCMSource `devcat36/testory`.
   CSRF 크럼 + `/job/testory/build` → `/job/testory/job/main/build`.
3. **노드별 배포** `gitea.albireo.me/crux/testory:latest`, `-p 8090:8080 --restart unless-stopped -m 256m`:
   - main: Portainer API (`/api/endpoints/3/docker/...`, `X-API-Key`)
   - pg(arm64): `docker -H tcp://127.0.0.1:2375 run`
   - us-east: `ssh root` + `docker network connect reverse-proxy testory`
4. **NPM proxy host**/노드 (`POST /api/nginx/proxy-hosts`): `testory.turtlelab.cc` → host-IP:8090 (main/pg) /
   container:8080 (us-east). us-east `:81` 방화벽 → SSH 터널 `-L 18081:127.0.0.1:81`.
5. **TLS (필수)**: 노드별 NPM `POST /api/nginx/certificates` provider letsencrypt, meta =
   `{dns_challenge:true, dns_provider:"cloudflare", dns_provider_credentials:"dns_cloudflare_api_token = <turtlelab.cc 토큰>", propagation_seconds:30}` →
   proxy host PUT `certificate_id` + `ssl_forced:true`. **3노드 순차** (공유 `_acme-challenge` TXT).
6. **Cloudflare**: `turtlelab.cc` 존에 `testory` A 레코드 3개(노드 IP), proxied, ttl 1.
7. **ActionsHA-test**: `ha-monitor-config.json` 에 서비스 추가
   `{name:"testory", hostname:"testory.turtlelab.cc", scheme:"https", healthcheck_path:"/healthcheck",
   servers:["kr-sw-1","kr-pg-1","us-east-1"], cloudflare:{update_dns:true, zone_id:"<turtlelab.cc>", proxied:true, ttl:120}}`.
8. **검증**: 노드별 `curl -k --resolve testory.turtlelab.cc:443:<ip>`; 공개 `https://testory.turtlelab.cc/`;
   페일오버 = 컨테이너 1개 정지 + HA Monitor `workflow_dispatch` → DNS 3→2, 복구 → 3.

## 상태

- [x] 1. 앱 구현 + Dockerfile/Jenkinsfile + repo 로컬 구성
- [ ] 2. GitHub repo 푸시 + Jenkins 빌드 검증
- [ ] 3~4. 노드 배포 + NPM
- [ ] 5~7. **TLS·DNS·HA (turtlelab.cc 토큰 필요)**
- [ ] 8. 검증
