FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Next.js application
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Install gettext for envsubst
RUN apk add --no-cache gettext netcat-openbsd

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy built Next.js application
COPY --from=builder /app/out /usr/share/nginx/html

# Copy nginx template
COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template

# Copy start script
COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port 80
EXPOSE 80

# Use start script as entrypoint
CMD ["/start.sh"]