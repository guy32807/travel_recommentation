# Multi-stage build for production

# Build stage for client
FROM node:18-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

# Build stage for server
FROM node:18-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci
COPY server/ ./

# Final stage
FROM node:18-alpine
WORKDIR /app
COPY --from=server-build /app/server ./server
COPY --from=client-build /app/client/build ./client/build

# Set environment to production
ENV NODE_ENV=production

# Expose the port
EXPOSE 5002

# Start the server
CMD ["node", "server/server.js"]