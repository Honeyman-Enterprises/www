# Honeyman React - Development Dockerfile
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Default command - can be overridden in docker-compose
CMD ["npm", "run", "dev"]
