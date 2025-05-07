# Install dependencies needed to compile bcrypt
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including bcrypt)
RUN npm install

# Copy the rest of your app
COPY . .

EXPOSE 5000

CMD ["npm", "index.js"]