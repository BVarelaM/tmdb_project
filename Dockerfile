# Image Node.js 
FROM node:20-alpine

# Dir in container
WORKDIR /app

# Copy dependences and archives
COPY package*.json ./

# 
RUN npm ci --only=production

# Copy the code
COPY . .

# Port
EXPOSE 3000

# command to init the app
CMD ["node", "./server.js"]