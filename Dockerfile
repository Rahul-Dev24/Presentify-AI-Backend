FROM node:20.19.0

RUN apt-get update && \
    apt-get install -y yt-dlp ffmpeg && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

# Copy prisma folder BEFORE generate
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy remaining files
COPY . .

ENV PORT=10000
EXPOSE 10000

CMD ["npm", "start"]