// Impor MongoClient dari library mongodb
const { MongoClient } = require('mongodb');

// Connection URI (alamat ke server MongoDB lokal Anda)
const uri = 'mongodb://localhost:27017';

// Buat instance client baru
const client = new MongoClient(uri);

// Buat fungsi async untuk menjalankan operasi
async function run() {
  try {
    // Hubungkan client ke server
    await client.connect();
    console.log("Berhasil terhubung ke MongoDB!");

    // Pilih database 'test' dan collection 'users'
    // Jika belum ada, akan dibuat secara otomatis saat data pertama masuk
    const database = client.db('test');
    const users = database.collection('users');

    // Contoh: Mencari satu dokumen di collection 'users'
    const user = await users.findOne({ name: "John Doe" });

    if (user) {
      console.log("Data ditemukan:", user);
    } else {
      console.log("Data tidak ditemukan. Coba masukkan data dulu.");
      // Contoh memasukkan data jika tidak ada
      await users.insertOne({ name: "John Doe", age: 30, city: "New York" });
      console.log("Satu data berhasil ditambahkan.");
    }

  } finally {
    // Pastikan client ditutup saat selesai atau jika ada error
    await client.close();
    console.log("Koneksi ditutup.");
  }
}

// Panggil fungsi run dan tangkap jika ada error
run().catch(console.dir);