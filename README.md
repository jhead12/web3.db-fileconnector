## Running the Project with Docker

This project provides Dockerfiles for both the client (Next.js app) and server components, along with a `docker-compose.yml` for easy orchestration.

### Project-Specific Requirements
- **Node.js Versions:**
  - Client: Uses `node:20-alpine`
  - Server: Uses `node:22.13.1-slim` (set via `ARG NODE_VERSION=22.13.1`)
- **Dependencies:**
  - Both services install dependencies via `npm ci` or `npm install` as defined in their respective Dockerfiles.

### Environment Variables
- The Docker Compose file includes commented `env_file` lines for both services. If you have environment variables, place them in `.env` files in the respective `./client` and `./server` directories and uncomment the relevant lines in `docker-compose.yml`.
- Example environment files are present: `./.env`, `./.env.sample`, and `./client/config.env`.

### Build and Run Instructions
1. **(Optional) Configure Environment Variables:**
   - Copy `.env.sample` to `.env` and adjust as needed for your environment.
   - If you have service-specific environment variables, place them in `./client/.env` and/or `./server/.env`.
2. **Build and Start the Services:**
   ```sh
   docker compose up --build
   ```
   This will build and start both the client and server containers.

### Ports Exposed
- **Client (`js-client`):**
  - Exposes port **3000** (Next.js default)
  - Accessible at [http://localhost:3000](http://localhost:3000)
- **Server (`js-server`):**
  - Exposes port **7008**
  - Accessible at [http://localhost:7008](http://localhost:7008)

### Special Configuration
- Both containers run as non-root users for improved security.
- The client build uses a multi-stage Dockerfile for optimized image size.
- The server build prunes dev dependencies after build for a leaner production image.
- Both services are connected via a custom Docker network `appnet`.
- The client service depends on the server service and will wait for it to be available.

---

*For more details on contributing or advanced configuration, see the rest of this README and the `Contribute.md` file.*
