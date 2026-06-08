# ==========================================
# Stage 1: Build the application assets
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies based on the lockfile for repeatable builds
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application files
COPY . .

# Compile the production bundle
RUN npm run build

# ==========================================
# Stage 2: Serve using high-performance Nginx
# ==========================================
FROM nginx:1.25-alpine

# Copy our custom Nginx structure configured for port 3000 and SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the static production build from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose the mandatory container gateway port
EXPOSE 3000

# Start server node
CMD ["nginx", "-g", "daemon off;"]
