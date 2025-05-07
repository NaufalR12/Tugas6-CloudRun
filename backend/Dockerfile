FROM node:20-alpine

# Install dependencies needed to compile bcrypt
RUN apk update && apk add --no-cache \
    build-base \
    python3 \
    && rm -rf /var/cache/apk/*

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application
COPY . .

EXPOSE 5000

CMD ["npm", "index.js"]
