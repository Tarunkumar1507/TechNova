# Build stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package configurations
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy source code
COPY . .

# Set Environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Expose server port
EXPOSE 5000

# Start command
CMD ["npm", "start"]
