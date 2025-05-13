# syntax=docker/dockerfile:1

ARG NODE_VERSION=22.13.1
FROM node:${NODE_VERSION}-slim AS base

# Uncomment if you need build tools for native modules
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package.json (package-lock.json might not exist)
COPY --link ./server/ceramic-mcp/package.json ./

RUN --mount=type=cache,target=/root/.npm \
    npm install --omit=dev

COPY --link ./server/ceramic-mcp/ .
# install curl
RUN apt-get update && apt-get install -y curl

# install dpkg
RUN apt-get update && apt-get install -y dpkg
# install gzip
RUN apt-get update && apt-get install -y gzip
# install ceramic
# install rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
# install tar
RUN apt-get update && apt-get install -y tar
ENV PATH="/root/.cargo/bin:${PATH}"
# install ceramic
RUN curl -sSfL https://sh.rustup.rs | sh -s -- -y       
RUN --mount=type=cache,target=/root/.npm \
    npm run install -v || true

RUN curl -LO https://github.com/ceramicnetwork/rust-ceramic/releases/latest/download/ceramic-one_x86_64-unknown-linux-gnu.tar.gz
RUN tar -xzf ceramic-one_x86_64-unknown-linux-gnu.tar.gz || rm ceramic-one_x86_64-unknown-linux-gnu.tar.gz

# install ceramic
RUN dpkg -i ceramic-one.deb


# Build Next.js client (if needed for production)
RUN ceramic daemon --network=telnet --memory ./ceramic-mcp/ceramic-state --port 7008 


# No build script in package.json, so we skip this step

RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"

USER appuser

EXPOSE 7008

CMD ["npm", "start"]
