# ---------- Stage 1: Build ----------
FROM node:20-alpine AS builder

WORKDIR /app

# Install openssl for Prisma engines
RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies and generate client
RUN npm install
RUN npx prisma generate

# Copy remaining source
COPY . .

# ---------- Stage 2: Production ----------
FROM node:20-alpine

WORKDIR /app

# IMPORTANT: Prisma needs the openssl runtime library in the final image too
RUN apk add --no-cache openssl

# Copy only the necessary files from builder
# Explicitly copying node_modules ensures the .prisma folder comes with it
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/index.js ./index.js
# If you have other folders (like /src), copy them here too

EXPOSE 8080

CMD ["node", "index.js"]