# Build stage
FROM node:lts-alpine AS builder
WORKDIR /app

# Accept build-time environment variables
ARG VITE_SLACK_CLIENT_ID
ARG VITE_SLACK_REDIRECT_URI
ARG VITE_API_URL

ENV VITE_SLACK_CLIENT_ID=$VITE_SLACK_CLIENT_ID
ENV VITE_SLACK_REDIRECT_URI=$VITE_SLACK_REDIRECT_URI
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci
COPY . .

# Ensure Vite sees the env variables
RUN echo "VITE_SLACK_CLIENT_ID=$VITE_SLACK_CLIENT_ID" > .env.production && \
    echo "VITE_SLACK_REDIRECT_URI=$VITE_SLACK_REDIRECT_URI" >> .env.production && \
    echo "VITE_API_URL=$VITE_API_URL" >> .env.production

RUN npm run build

# Serve with Caddy
FROM caddy:alpine

COPY --from=builder /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 3000
