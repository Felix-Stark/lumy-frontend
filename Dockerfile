# Build Stage
FROM 23-alpine3.20 AS builder

# Update apk packages to ensure latest security patches and remove cache
RUN apk update && apk upgrade --no-cache && rm -rf /var/cache/apk/*

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Production Stage
FROM nginx:stable-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: Replace default NGINX config to handle SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
