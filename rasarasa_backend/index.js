// Mengimpor library yang dibutuhkan
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

// Membuat aplikasi express
const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Middleware untuk otentikasi (Penjaga Token)
const authenticateToken = (req, res, next) => {
  console.log('Middleware authenticateToken dijalankan...'); // Log 1
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token tidak valid.' });
    }
    console.log('Token berhasil diverifikasi untuk user:', user); // Log 2
    req.user = user;
    next();
  });
};

// Middleware baru yang memeriksa peran admin
const authenticateAdmin = (req, res, next) => {
  // Middleware ini dijalankan SETELAH authenticateToken
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Akses ditolak. Hanya untuk admin.' });
  }
  next();
};

// Middleware baru yang memeriksa peran driver
const authenticateDriver = (req, res, next) => {
  // Middleware ini dijalankan SETELAH authenticateToken
  if (req.user.role !== 'driver') {
    return res.status(403).json({ message: 'Akses ditolak. Hanya untuk driver.' });
  }
  next();
};

// --- ENDPOINT UTAMA ---
app.get('/', (req, res) => {
  res.send('🎉 Halo, server RasaRasa sudah berjalan!');
});

// --- ENDPOINT PUBLIK (UNTUK KONSUMEN) ---
app.get('/api/public/restaurants', async (req, res) => {
  try {
    const queryResult = await db.query('SELECT id, name, address, phone_number FROM sellers');
    res.status(200).json(queryResult.rows);
  } catch (error) {
    console.error('Error saat mengambil daftar restoran:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});
app.get('/api/public/restaurants/:id/menu', async (req, res) => {
  try {
    const { id } = req.params;
    const queryResult = await db.query('SELECT id, name, description, price, category, seller_id FROM menus WHERE seller_id = $1', [id]);
    if (queryResult.rows.length === 0) {
      const sellerCheck = await db.query('SELECT * FROM sellers WHERE id = $1', [id]);
      if (sellerCheck.rows.length === 0) {
        return res.status(404).json({ message: 'Restoran tidak ditemukan.' });
      }
    }
    res.status(200).json(queryResult.rows);
  } catch (error) {
    console.error('Error saat mengambil menu restoran:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// Endpoint untuk login penjual
app.post('/api/sellers/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    }
    const queryResult = await db.query('SELECT * FROM sellers WHERE email = $1', [email]);
    const seller = queryResult.rows[0];
    if (!seller) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }
    const isPasswordMatch = await bcrypt.compare(password, seller.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }
    // Pastikan baris ini menyertakan 'role'
    const payload = { id: seller.id, email: seller.email, name: seller.name, role: seller.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({
      message: 'Login berhasil!',
      token: token
    });
  } catch (error) {
    console.error('Error saat login:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// --- ENDPOINT MENU (TERPROTEKSI) ---
app.post('/api/menus', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || !price) {
        return res.status(400).json({ message: 'Nama dan harga menu wajib diisi.' });
    }
    const sellerId = req.user.id;
    const queryText = `
      INSERT INTO menus (seller_id, name, description, price, category)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [sellerId, name, description, price, category];
    const newMenu = await db.query(queryText, values);
    res.status(201).json({
      message: 'Menu baru berhasil ditambahkan!',
      menu: newMenu.rows[0]
    });
  } catch (error) {
    console.error('Error saat menambah menu:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});
app.get('/api/menus', authenticateToken, async (req, res) => {
  console.log('Endpoint GET /api/menus diakses...'); // Log 3
  try {
    const sellerId = req.user.id;
    const queryResult = await db.query('SELECT * FROM menus WHERE seller_id = $1 ORDER BY created_at DESC', [sellerId]);
    res.status(200).json(queryResult.rows);
  } catch (error) {
    console.error('Error saat mengambil menu:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});
app.put('/api/menus/:id', authenticateToken, async (req, res) => {
  try {
    const menuId = req.params.id;
    const sellerId = req.user.id;
    const { name, description, price, category } = req.body;
    const updateQuery = `
      UPDATE menus 
      SET name = $1, description = $2, price = $3, category = $4 
      WHERE id = $5 AND seller_id = $6 
      RETURNING *
    `;
    const result = await db.query(updateQuery, [name, description, price, category, menuId, sellerId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Menu tidak ditemukan atau Anda tidak punya hak akses.' });
    }
    res.status(200).json({ message: 'Menu berhasil diperbarui.', menu: result.rows[0] });
  } catch (error) {
    console.error('Error saat update menu:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});
app.delete('/api/menus/:id', authenticateToken, async (req, res) => {
  try {
    const menuId = req.params.id;
    const sellerId = req.user.id;
    const deleteQuery = 'DELETE FROM menus WHERE id = $1 AND seller_id = $2 RETURNING *';
    const result = await db.query(deleteQuery, [menuId, sellerId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Menu tidak ditemukan atau Anda tidak punya hak akses.' });
    }
    res.status(200).json({ message: 'Menu berhasil dihapus.' });
  } catch (error) {
    console.error('Error saat menghapus menu:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// --- ENDPOINT PESANAN (ORDERS) ---
app.post('/api/orders', async (req, res) => {
  const { seller_id, delivery_address, total_price, items } = req.body;
  const consumer_id = null;
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const orderQueryText = `
      INSERT INTO orders (consumer_id, seller_id, delivery_address, total_price)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    `;
    const orderValues = [consumer_id, seller_id, delivery_address, total_price];
    const newOrder = await client.query(orderQueryText, orderValues);
    const orderId = newOrder.rows[0].id;
    await Promise.all(
      items.map(item => {
        const itemQueryText = `
          INSERT INTO order_items (order_id, menu_id, quantity, price_at_order)
          VALUES ($1, $2, $3, $4)
        `;
        const itemValues = [orderId, item.id, item.quantity, item.price];
        return client.query(itemQueryText, itemValues);
      })
    );
    await client.query('COMMIT');
    res.status(201).json({ 
      message: 'Pesanan berhasil dibuat!',
      orderId: orderId 
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error saat membuat pesanan:', error);
    res.status(500).json({ message: 'Gagal membuat pesanan.' });
  } finally {
    client.release();
  }
});
app.get('/api/orders/my-restaurant', authenticateToken, async (req, res) => {
  try {
    const sellerId = req.user.id;
    const queryText = `
      SELECT id, delivery_address, total_price, status, created_at 
      FROM orders 
      WHERE seller_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await db.query(queryText, [sellerId]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error saat mengambil pesanan restoran:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// --- ENDPOINT ADMIN (TERPROTEKSI) ---

// Endpoint untuk admin mendapatkan daftar semua restoran
app.get('/api/admin/restaurants', authenticateToken, authenticateAdmin, async (req, res) => {
  try {
    const result = await db.query('SELECT id, name, email, role FROM sellers ORDER BY id');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error saat admin mengambil data restoran:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// --- ENDPOINT OTENTIKASI DRIVER ---

// Endpoint untuk mendaftarkan driver baru
app.post('/api/drivers/register', async (req, res) => {
  try {
    const { name, email, password, phoneNumber } = req.body;
    if (!name || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: 'Semua kolom wajib diisi.' });
    }
    const existingDriver = await db.query('SELECT * FROM drivers WHERE email = $1', [email]);
    if (existingDriver.rows.length > 0) {
      return res.status(409).json({ message: 'Email sudah terdaftar.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const queryText = `
      INSERT INTO drivers (name, email, password, phone_number)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, email
    `;
    const values = [name, email, hashedPassword, phoneNumber];
    const newDriver = await db.query(queryText, values);
    res.status(201).json({ message: 'Registrasi driver berhasil!', driver: newDriver.rows[0] });
  } catch (error) {
    console.error('Error saat registrasi driver:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// Endpoint untuk login driver
app.post('/api/drivers/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email dan password wajib diisi.' });
    }
    const queryResult = await db.query('SELECT * FROM drivers WHERE email = $1', [email]);
    const driver = queryResult.rows[0];
    if (!driver) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }
    const isPasswordMatch = await bcrypt.compare(password, driver.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Email atau password salah.' });
    }
    const payload = { id: driver.id, email: driver.email, name: driver.name, role: 'driver' };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: 'Login berhasil!', token: token });
  } catch (error) {
    console.error('Error saat login driver:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// [BARU] Endpoint untuk driver melihat pesanan yang tersedia
app.get('/api/driver/available-orders', authenticateToken, authenticateDriver, async (req, res) => {
  try {
    // Ambil semua pesanan yang statusnya 'pending'
    // Kita juga mengambil data restoran agar driver tahu harus ke mana
    const queryText = `
      SELECT o.id, o.delivery_address, o.total_price, s.name AS restaurant_name, s.address AS restaurant_address
      FROM orders AS o
      JOIN sellers AS s ON o.seller_id = s.id
      WHERE o.status = 'pending'
      ORDER BY o.created_at ASC
    `;
    const result = await db.query(queryText);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error saat mengambil pesanan tersedia:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// [BARU] Endpoint untuk driver mengambil/menerima pesanan
app.post('/api/driver/orders/:id/accept', authenticateToken, authenticateDriver, async (req, res) => {
  try {
    const orderId = req.params.id; // ID Pesanan dari URL
    const driverId = req.user.id;   // ID Driver dari token

    // Update status order menjadi 'delivering' dan set driver_id.
    // Klausa "WHERE status = 'pending'" penting untuk mencegah dua driver mengambil order yang sama.
    const queryText = `
      UPDATE orders 
      SET status = 'delivering', driver_id = $1 
      WHERE id = $2 AND status = 'pending'
      RETURNING id, status
    `;

    const result = await db.query(queryText, [driverId, orderId]);

    // Jika tidak ada baris yang ter-update, berarti order sudah diambil orang lain.
    if (result.rowCount === 0) {
      return res.status(409).json({ message: 'Pesanan ini sudah tidak tersedia atau sudah diambil.' });
    }

    res.status(200).json({ message: 'Pesanan berhasil diambil!', order: result.rows[0] });

  } catch (error) {
    console.error('Error saat menerima pesanan:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// [BARU] Endpoint untuk driver menyelesaikan pesanan
app.post('/api/driver/orders/:id/complete', authenticateToken, authenticateDriver, async (req, res) => {
  try {
    const orderId = req.params.id;
    const driverId = req.user.id;

    // Update status order menjadi 'completed'.
    // Pastikan hanya driver yang bersangkutan yang bisa menyelesaikan order ini.
    const queryText = `
      UPDATE orders 
      SET status = 'completed'
      WHERE id = $1 AND driver_id = $2 AND status = 'delivering'
      RETURNING id, status
    `;

    const result = await db.query(queryText, [orderId, driverId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Pesanan tidak ditemukan atau status tidak sesuai.' });
    }

    res.status(200).json({ message: 'Pesanan telah diselesaikan!', order: result.rows[0] });

  } catch (error) {
    console.error('Error saat menyelesaikan pesanan:', error);
    res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
});

// --- Menjalankan Server ---
app.listen(PORT, () => {
  console.log(`🖥️  Server backend berjalan di http://localhost:${PORT}`);
  // Log untuk debug JWT Secret
  console.log('JWT Secret Key yang terbaca:', process.env.JWT_SECRET);
});