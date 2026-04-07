FROM node:18-alpine

WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the rest of the app
COPY src/ ./src/

EXPOSE 3000

CMD ["node", "src/app.js"]
