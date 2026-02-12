# -------- Stage 1: Builder --------
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy prisma schema separately
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy remaining source code
COPY . .

# -------- Stage 2: Production --------
FROM node:20-alpine

WORKDIR /app

# Copy node_modules (including generated .prisma client)
COPY --from=builder /app/node_modules ./node_modules

# Copy app source
COPY --from=builder /app ./

EXPOSE 8080

CMD ["node", "index.js"]