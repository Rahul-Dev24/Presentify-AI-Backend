# Use exact Node version
FROM node:20.19.0

# Install yt-dlp + ffmpeg
RUN apt-get update && \
    apt-get install -y yt-dlp ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy remaining files
COPY . .

# Expose port
EXPOSE 10000

# Start server
CMD ["npm", "start"]