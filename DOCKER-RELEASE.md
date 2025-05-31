# Docker Release Documentation

## Overview

The web3.db-fileconnector supports multiple Docker deployment strategies:

1. **Full Stack** - Complete application with client and server
2. **Client Only** - Next.js frontend application
3. **Server Only** - Backend API and database connector
4. **Development** - With PostgreSQL database

## Docker Images

### 1. Main Application (Full Stack)

```bash
docker build -t web3db-fileconnector:latest .
docker run -p 3000:3000 web3db-fileconnector:latest
```

### 2. Client Only (Next.js)

```bash
docker build -f client/Dockerfile -t web3db-client:latest .
docker run -p 3000:3000 web3db-client:latest
```

### 3. Server Only (API)

```bash
docker build -f server/Dockerfile -t web3db-server:latest .
docker run -p 8080:8080 web3db-server:latest
```

## Docker Compose

### Production Deployment

```bash
docker-compose up -d
```

### Development with Database

```bash
docker-compose -f setup.compose.yaml up -d
```

## Pre-built Images

### Docker Hub

- `orbisdb/fileconnector:latest` - Full application
- `orbisdb/fileconnector:client` - Client only
- `orbisdb/fileconnector:server` - Server only

### GitHub Container Registry

- `ghcr.io/jhead12/web3db-fileconnector:latest`

## Environment Variables

### Required

- `DATABASE_URL` - PostgreSQL connection string
- `CERAMIC_API_URL` - Ceramic node endpoint

### Optional

- `PORT` - Application port (default: 3000)
- `LOG_LEVEL` - Logging level (debug, info, warn, error)
- `NODE_ENV` - Environment (development, production)

## Health Checks

All Docker images include health checks:

- **Full Stack**: `http://localhost:3000/health`
- **Client**: `http://localhost:3000`
- **Server**: `http://localhost:8080/health`

## Security

### Non-root Execution

All containers run as non-root users:

- Main app: `web3db` user (uid: 1001)
- Client: `nextjs` user (uid: 1001)
- Server: `web3db` user (uid: 1001)

### Signal Handling

Uses `dumb-init` for proper signal handling and zombie reaping.

## Multi-platform Support

Images are built for:

- `linux/amd64` (x86_64)
- `linux/arm64` (Apple Silicon, ARM servers)

## Release Process

### Automated Release

```bash
npm run publish:docker
```

### Manual Release

```bash
# Build multi-platform
docker buildx build --platform linux/amd64,linux/arm64 -t orbisdb-fileconnector:v1.8.1 .

# Push to registry
docker push orbisdb-fileconnector:v1.8.1
docker push orbisdb-fileconnector:latest
```

## Troubleshooting

### Permission Issues

Ensure database permissions are configured:

```bash
docker exec -it <container> psql -U postgres -d ceramic -f fix-postgres-permissions.sql
```

### Volume Mounts

For persistent data:

```bash
docker run -v /host/data:/app/data web3db-fileconnector:latest
```

### Logs

View container logs:

```bash
docker logs <container_name>
```
