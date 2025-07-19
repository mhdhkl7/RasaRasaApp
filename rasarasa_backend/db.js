// Mengimpor library dotenv untuk membaca file .env
require('dotenv').config();

// Mengimpor library 'pg'
const { Pool } = require('pg');

// Membuat instance koneksi baru dengan mengambil kredensial dari file .env
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Coba koneksi ke database saat aplikasi pertama kali berjalan
pool.connect((err) => {
  if (err) {
    console.error('Koneksi ke database gagal!', err.stack);
  } else {
    console.log('✅ Berhasil terhubung ke database PostgreSQL.');
  }
});

// Ekspor 'pool' agar bisa digunakan di file lain
module.exports = pool;