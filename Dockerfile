FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# VITE_API_BASE_URL is baked into the JS bundle at build time (Vite limitation).
# Set it here as a build arg so EasyPanel can override it without changing source.
ARG VITE_API_BASE_URL=https://portfloio-4-improvements.e4xqua.easypanel.host
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ── Runtime stage ────────────────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

COPY --from=builder /app/dist ./dist

EXPOSE 3000
ENV HOST=0.0.0.0
ENV PORT=3000

CMD ["node", "dist/server/index.mjs"]
