# Use a specific Node.js version that matches your requirements
FROM node:18.18-alpine AS base

# Set the working directory
WORKDIR /client

# Copy package files and install dependencies
COPY package*.json ./

# Install Python and other build dependencies
RUN apk add --no-cache python3 make g++ \
    && npm ci \
    && apk del python3 make g++

# Copy the rest of your application code
COPY . .

# Command to run your application
CMD ["node", "app.js"]
