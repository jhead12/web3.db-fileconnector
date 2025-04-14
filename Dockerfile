# syntax=docker/dockerfile:1

# Build stage
FROM node:18.18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

# Copy application files
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18.18-alpine AS production

# Set working directory
WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Set environment variables
ENV NODE_ENV=production

# Expose the application port
EXPOSE 7008

# Command to run the application
CMD ["npm", "start"]