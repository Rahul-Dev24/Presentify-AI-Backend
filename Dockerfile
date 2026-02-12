FROM node:20.19.0

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y yt-dlp ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Copy everything
COPY . .

# Install dependencies (important: NOT production-only)
RUN npm install

# Generate Prisma Client explicitly
RUN npx prisma generate --schema=./prisma/schema.prisma

ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

CMD ["node", "index.js"]