# Multi-stage build for minification
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json ./
COPY build.js ./

# Install dependencies
RUN npm install --only=dev

# Copy source files
COPY src/ ./src/

# Run the build process (minify CSS, JS, HTML)
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy minified files from builder stage
COPY --from=builder /app/dist/ /usr/share/nginx/html/

# Copy custom nginx configuration
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Add build info as environment variable
ARG BUILD_DATE
ARG VERSION=1.0.0
ENV BUILD_DATE=${BUILD_DATE}
ENV VERSION=${VERSION}

# Add labels for better container management
LABEL maintainer="SLAZero.net" \
      version="${VERSION}" \
      description="SLAZero.net - Minified production build" \
      build-date="${BUILD_DATE}"

# Expose port 80
EXPOSE 80

# Health check to ensure nginx is running
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
