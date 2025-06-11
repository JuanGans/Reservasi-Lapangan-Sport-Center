# Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json dan lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy semua file
COPY . .

# Build Next.js
RUN npm run build

# Jalankan aplikasi
EXPOSE 3000
CMD ["npm", "start"]
