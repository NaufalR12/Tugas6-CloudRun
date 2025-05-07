FROM node:20-alpine

WORKDIR /app

# Salin hanya file yang dibutuhkan untuk install awal
COPY package*.json ./

# Install di dalam container Linux (penting agar bcrypt dibangun dengan benar)
RUN npm install

# Salin semua file proyek ke dalam container
COPY . .

EXPOSE 5000

# Jalankan aplikasi
CMD ["npm", "start"]

