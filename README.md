# RasaRasa - Aplikasi Food Delivery Full-Stack

Ini adalah proyek aplikasi food delivery lengkap yang dibangun dari awal, mencakup backend API, tiga aplikasi web frontend (Konsumen, Penjual, Admin), dan satu aplikasi mobile (Driver).

## Fitur Utama

#### 1. Aplikasi Konsumen (`rasarasa_frontend`)
* Melihat daftar restoran.
* Melihat menu dari restoran spesifik.
* Keranjang belanja fungsional (tambah, ubah jumlah, hapus).
* Proses checkout dan pembuatan pesanan.

#### 2. Dashboard Penjual (`rasarasa_seller_dashboard`)
* Login yang aman untuk penjual.
* Manajemen menu lengkap (Create, Read, Update, Delete).
* Melihat daftar pesanan yang masuk ke restorannya.

#### 3. Dashboard Admin (`rasarasa_admin_dashboard`)
* Login yang aman khusus untuk admin.
* Melihat dan mengawasi semua restoran yang terdaftar di platform.

#### 4. Aplikasi Driver (`rasarasa_driver_app`)
* Aplikasi mobile dibangun dengan React Native (via Expo).
* Login yang aman untuk driver.
* Melihat daftar pesanan yang tersedia untuk diantar.
* Menerima dan menyelesaikan pesanan.

## Teknologi yang Digunakan

* **Backend**: Node.js, Express.js, PostgreSQL, JWT (JSON Web Tokens)
* **Frontend (Web)**: React.js, Next.js, Tailwind CSS
* **Frontend (Mobile)**: React Native (Expo)
* **Database**: PostgreSQL
* **Alat Bantu**: pgAdmin 4, Postman

## Struktur Proyek
```
IMK Project/
├── rasarasa_backend/              # Server API (Node.js)
├── rasarasa_frontend/             # Aplikasi Web untuk Konsumen (Next.js)
├── rasarasa_seller_dashboard/     # Dashboard Web untuk Penjual (Next.js)
├── rasarasa_admin_dashboard/      # Dashboard Web untuk Admin (Next.js)
└── rasarasa_driver_app/           # Aplikasi Mobile untuk Driver (React Native)
```

## Cara Menjalankan Proyek

#### Prasyarat
* Node.js & NPM
* PostgreSQL
* Expo Go (di HP untuk aplikasi driver)

#### 1. Backend Setup
```bash
# Masuk ke direktori backend
cd rasarasa_backend

# Install dependensi
npm install

# Buat file .env dan isi sesuai kredensial database Anda
# Contoh .env:
# DB_USER=postgres
# DB_HOST=localhost
# DB_DATABASE=rasarasa_db
# DB_PASSWORD=password-anda
# DB_PORT=5432
# JWT_SECRET=kunci_rahasia_anda

# Jalankan server backend
node index.js
# Server akan berjalan di http://localhost:3001
```

#### 2. Frontend Setup (Lakukan untuk setiap aplikasi web)
```bash
# Buka terminal BARU, lalu masuk ke direktori frontend
cd rasarasa_frontend
# atau cd rasarasa_seller_dashboard, atau cd rasarasa_admin_dashboard

# Install dependensi
npm install

# Jalankan server development
npm run dev
# Aplikasi akan berjalan di http://localhost:3000, 3002, 3003
```

#### 3. Mobile App Setup
```bash
# Buka terminal BARU, lalu masuk ke direktori aplikasi mobile
cd rasarasa_driver_app

# Install dependensi
npm install

# Jalankan server Expo
npm start

# Scan QR code yang muncul dengan aplikasi Expo Go di HP Anda.
# PENTING: Jangan lupa ubah alamat IP di dalam kode aplikasi mobile.
```
