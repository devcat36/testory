# Testory — 배포 (홈랩 3노드 HA)

기존 홈랩 HA 런북(`example.albireo.me` 검증본)을 그대로 따르되, **Spring Boot → Next.js 정적**,
**도메인 `*.albireo.me` → `testory.turtlelab.cc`** 두 가지만 다르다.

## 파이프라인

GitHub `devcat36/testory` → Jenkins(`testory`, buildx **linux/amd64,linux/arm64**) →
Gitea `gitea.albireo.me/crux/testory:latest` → 3노드 컨테이너(`8090:8080`) →
NPM LE 인증서(노드별) → Cloudflare proxied multi-A(zone `turtlelab.cc`) →
`devcat36/ActionsHA-test` 페일오버.

## ✅ Cloudflare 토큰 / 존 (해소됨)

2026-06-21 DNS 마이그레이션 완료 → `turtlelab.cc` 가 CF 계정에 active(zone id
`cee8e89531703ce65df258d21fda9677`). 기존 토큰(`~/.cf-token`)이 계정 스코프라
**자동으로 turtlelab.cc 포함** (DNS:Edit 확인됨 — NPM DNS-01 발급 성공). ActionsHA-test의
CF 시크릿 토큰도 동일 토큰이라 turtlelab.cc DNS 갱신 정상 동작.

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

## 상태 — ✅ 배포 완료 (2026-06-21)

- [x] 1. 앱 구현 + Dockerfile/Jenkinsfile + repo
- [x] 2. GitHub `devcat36/testory` 푸시 + Jenkins job `testory` 빌드 #2 SUCCESS → `gitea.albireo.me/crux/testory:latest` (amd64+arm64)
- [x] 3. 3노드 컨테이너 `testory` (`8091:8080`, `-m 256m`): main(Portainer)/pg(2375)/us-east(ssh+reverse-proxy net)
- [x] 4. NPM 프록시 호스트: main #23(`172.30.1.201:8091`) / pg #5(`172.30.2.201:8091`) / us-east #5(`testory:8080`)
- [x] 5. LE 인증서(DNS-01): main cert#11 / pg cert#8 / us-east cert#7, `ssl_forced` + http2
- [x] 6. Cloudflare 3× proxied A 레코드 (zone turtlelab.cc): 14.33.128.209 / 121.138.251.147 / 172.245.111.245
- [x] 7. ActionsHA-test `ha-monitor-config.json` 에 `testory` 서비스 추가
- [x] 8. 검증: `https://testory.turtlelab.cc/` 200 · 페일오버(pg 정지→DNS 3→2, 복구→3) 확인

**Live: https://testory.turtlelab.cc**

### 포트/식별자 요약
| 노드 | 배포 | host:container | NPM host | LE cert |
|---|---|---|---|---|
| main (kr-sw-1, amd64) | Portainer ep3 | 8091:8080 | #23 → 172.30.1.201:8091 | #11 |
| pg (kr-pg-1, arm64) | docker 2375 | 8091:8080 | #5 → 172.30.2.201:8091 | #8 |
| us-east (us-east-1, amd64) | ssh root | 8091:8080 + reverse-proxy | #5 → testory:8080 | #7 |
