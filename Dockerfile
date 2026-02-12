# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install ALL dependencies (including prisma)
RUN npm install

# Copy prisma folder
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy remaining source
COPY . .

# ---------- Stage 2: Production ----------
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 8080

CMD ["node", "index.js"]