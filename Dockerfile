# ---------- Stage 1: Builder ----------
FROM node:20.19.0 AS builder

WORKDIR /app

# Install system deps needed for build/runtime
RUN apt-get update && \
    apt-get install -y yt-dlp ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Copy package files first (better caching)
COPY package*.json ./

# Install ALL dependencies (not production-only)
RUN npm install

# Copy prisma schema before generate
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy remaining project files
COPY . .

# ---------- Stage 2: Runtime ----------
FROM node:20.19.0

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y yt-dlp ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Copy everything from builder
COPY --from=builder /app ./

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

CMD ["npm", "start"]