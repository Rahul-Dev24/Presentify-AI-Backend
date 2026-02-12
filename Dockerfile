# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder
WORKDIR /app

# Install build essentials and openssl for Prisma
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install
RUN npx prisma generate

COPY . .

# ---------- Stage 2: Production ----------
FROM node:20-alpine
WORKDIR /app

# Install runtime dependencies: 
# openssl (for Prisma), ffmpeg & python3 (for video tools)
RUN apk add --no-cache openssl ffmpeg python3

# Copy everything from builder
COPY --from=builder /app ./

EXPOSE 8080

CMD ["node", "index.js"]