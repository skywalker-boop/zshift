FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production || npm install --production
COPY . .
CMD ["node", "index.js"]
