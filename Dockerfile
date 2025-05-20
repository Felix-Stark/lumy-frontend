# Build stage
FROM node:lts-alpine AS builder
WORKDIR /app

# Accept build-time environment variable
ARG VITE_SLACK_CLIENT_ID
ENV VITE_SLACK_CLIENT_ID=$VITE_SLACK_CLIENT_ID

COPY package*.json ./
RUN npm ci
COPY . .

# Ensure Vite sees the env variable
RUN echo "VITE_SLACK_CLIENT_ID=$VITE_SLACK_CLIENT_ID" > .env.production

RUN npm run build

# Serve with Caddy
FROM caddy:alpine

COPY --from=builder /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 3000
