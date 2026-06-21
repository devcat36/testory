# syntax=docker/dockerfile:1

# ---- Build stage (runs on the builder's native arch only) ----
# The build output (Next.js static export) is platform-independent, so we pin the
# build to $BUILDPLATFORM (amd64 on the Jenkins builder). This avoids running
# Node/SWC/resvg under arm64 QEMU emulation for the Jetson target image.
FROM --platform=$BUILDPLATFORM node:22-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json ./
RUN npm install --no-audit --no-fund

COPY . .
# build = generate OG cards (satori + resvg) then `next build` (output: export) -> /app/out
RUN npm run build

# ---- Runtime stage (true multi-arch: just serves the static files) ----
FROM nginx:alpine AS runtime
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthcheck >/dev/null 2>&1 || exit 1
CMD ["nginx", "-g", "daemon off;"]
