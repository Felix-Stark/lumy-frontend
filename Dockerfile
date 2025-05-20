# Build stage
FROM node:lts-alpine AS builder

WORKDIR /app

# Install dependencies only (faster caching)
COPY package*.json ./
RUN npm ci

# Copy the rest of the app
COPY . .

RUN npm run build

# Serve with Caddy
FROM caddy:alpine

# Copy the built Vue app
COPY --from=builder /app/dist /srv

# Copy the Caddyfile config
COPY Caddyfile /etc/caddy/Caddyfile

EXPOSE 3000
