# 🍱 RasaRasa App — Full-Stack Food Delivery System

RasaRasa adalah aplikasi food delivery multi-platform yang dikembangkan untuk mensimulasikan ekosistem layanan seperti GoFood atau GrabFood, namun dengan arsitektur yang sepenuhnya dikendalikan sendiri. Proyek ini mencakup backend API, tiga frontend web (untuk konsumen, penjual, dan admin), serta satu aplikasi mobile (untuk driver).

> Dibangun sebagai proyek eksploratif full-stack oleh mahasiswa semester 2, proyek ini menekankan kemampuan eksekusi lintas teknologi, dari setup database hingga deployment aplikasi mobile.

---

## 🚀 Fitur Utama

### 🧑‍🍳 Konsumen (`rasarasa_frontend`)
- Menelusuri daftar restoran
- Melihat dan memilih menu dari restoran
- Menambahkan, mengubah, dan menghapus item di keranjang
- Checkout dan pembuatan pesanan

### 🏪 Penjual (`rasarasa_seller_dashboard`)
- Login aman untuk penjual
- CRUD menu makanan
- Melihat daftar pesanan yang masuk

### 🛡️ Admin (`rasarasa_admin_dashboard`)
- Login khusus untuk admin
- Monitoring seluruh restoran dan transaksi

### 🛵 Driver (`rasarasa_driver_app`)
- Aplikasi mobile (React Native via Expo)
- Login untuk driver
- Melihat pesanan yang tersedia
- Menerima dan menyelesaikan pengantaran

---

## 🧰 Teknologi yang Digunakan

- **Backend**: Node.js, Express.js, PostgreSQL, JWT
- **Frontend Web**: React.js, Next.js, Tailwind CSS
- **Mobile App**: React Native (Expo)
- **Database Tools**: pgAdmin 4
- **Testing/API Debug**: Postman

---

## 🗂️ Struktur Proyek

```

rasarasa\_project/
├── rasarasa\_backend/              # REST API Backend
├── rasarasa\_frontend/             # Web App (Konsumen)
├── rasarasa\_seller\_dashboard/     # Web App (Penjual)
├── rasarasa\_admin\_dashboard/      # Web App (Admin)
└── rasarasa\_driver\_app/           # Mobile App (Driver)

````

---

## 🛠️ Cara Menjalankan Proyek

### 🔧 Prasyarat
- Node.js & npm
- PostgreSQL (terinstal lokal)
- Expo Go (untuk aplikasi mobile)

---

### 📦 1. Setup Backend

```bash
cd rasarasa_backend
npm install
````

Buat file `.env` dengan isi:

```
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=rasarasa_db
DB_PASSWORD=yourpassword
DB_PORT=5432
JWT_SECRET=your_secret_key
```

Lalu jalankan:

```bash
node index.js
# Server berjalan di http://localhost:3001
```

---

### 🌐 2. Setup Aplikasi Frontend Web

Ulangi langkah ini untuk masing-masing:

* `rasarasa_frontend`
* `rasarasa_seller_dashboard`
* `rasarasa_admin_dashboard`

```bash
cd nama_folder_anda
npm install
npm run dev
# Web berjalan di localhost:3000, 3002, 3003 (ubah port sesuai kebutuhan)
```

---

### 📱 3. Setup Aplikasi Mobile (Driver)

```bash
cd rasarasa_driver_app
npm install
npm start
```

* Buka aplikasi **Expo Go** di HP.
* Scan QR code dari terminal.
* Pastikan IP address di dalam kode React Native telah diubah agar cocok dengan IP lokal server backend.

---

## 📌 Status Proyek

**Versi:** 1.0 (Prototipe MVP)
**Status:** Masih dalam pengembangan aktif
**Dibuat oleh:** Muhammad Haikal Siregar (Universitas Satya Terra Bhinneka)

---

## ✨ Catatan Pribadi

Proyek ini adalah hasil dari inisiatif pribadi, dibangun dengan pendekatan eksploratif sambil belajar konsep full-stack modern secara langsung. Meskipun dibantu oleh alat seperti AI untuk dokumentasi dan debugging, seluruh eksekusi teknis dan penyesuaian arsitektur dilakukan sendiri — sebagai bentuk latihan mandiri untuk menjadi developer yang adaptif dan tangguh.
