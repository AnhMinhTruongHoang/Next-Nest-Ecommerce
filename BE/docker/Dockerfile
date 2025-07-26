# Base image
FROM node:16-alpine

# Create app directory
WORKDIR /base/backend-nest

# Copy package files
COPY package*.json ./

# Install app dependencies
RUN npm install

# Install NestJS CLI
RUN npm i -g @nestjs/cli@10.0.3

# Copy source code
COPY . .

# Build project (tạo thư mục dist)
RUN npm run build

# Start server
CMD ["node", "dist/main.js"]
