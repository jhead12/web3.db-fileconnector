# Running the Project with Docker

To run this project using Docker, follow the steps below:

## Prerequisites

Ensure you have the following installed:

- Docker version 20.10 or later
- Docker Compose version 1.29 or later

## Environment Variables

Set the following environment variables in a `.env` file or export them in your shell:

- `POSTGRES_USER`: Database username (default: `user`)
- `POSTGRES_PASSWORD`: Database password (default: `password`)

## Build and Run Instructions

1. Clone the repository and navigate to the project directory.

   ```bash
   git clone https://github.com/your-repo/project.git
   cd project
   ```

2. Build and start the services using Docker Compose:

   ```bash
   docker-compose up --build
   ```

3. Access the application at `http://localhost:7008`.

## Exposed Ports

- `app`: 7008
- `db`: Not exposed externally

## Notes

- Ensure the `Dockerfile` and `docker-compose.yml` are correctly configured for your environment.
- For additional configuration, refer to the [documentation](#documentation-community).