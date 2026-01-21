# Build stage
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package.json bun.lock ./
RUN npm install -g bun && bun install --frozen-lockfile

COPY . .
RUN bun run build

# Production stage
FROM node:20-alpine
WORKDIR /usr/src/app

RUN apk add --no-cache postgresql-client && \
    npm install -g bun

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Copy built application
COPY --from=builder /usr/src/app/dist ./dist

# Copy src and tsconfig for seeding scripts (optional but useful)
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/tsconfig.json ./tsconfig.json

COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

ENTRYPOINT ["docker-entrypoint.sh"]e