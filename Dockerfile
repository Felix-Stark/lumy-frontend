# Build stage
FROM node:lts-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Serve with Caddy
FROM caddy:alpine

# Copy the built Vue app
COPY --from=builder /app/dist /srv

# Copy the Caddyfile config
COPY Caddyfile /etc/caddy/Caddyfile
