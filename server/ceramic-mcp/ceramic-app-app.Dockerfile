# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-slim AS base

# Uncomment if you need build tools for native modules
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --link package.json package-lock.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

COPY --link . .

RUN --mount=type=cache,target=/root/.npm \
    npm run build

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

USER appuser

EXPOSE 7008

CMD ["npm", "start"]
