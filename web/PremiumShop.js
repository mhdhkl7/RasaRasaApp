// Data produk (simulasi JSON lokal)
const products = [
    { id: 1, name: "Produk 1", price: 100000, category: "Elektronik" },
    { id: 2, name: "Produk 2", price: 200000, category: "Fashion" },
    { id: 3, name: "Produk 3", price: 150000, category: "Olahraga" },
  ];
  
  let cart = [];
  let isLoggedIn = false;
  
  // Menampilkan produk berdasarkan kategori
  function renderProducts(filter = null) {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = ''; // Reset tampilan produk
  
    // Filter produk berdasarkan kategori (jika ada)
    const filteredProducts = filter 
      ? products.filter(product => product.category === filter)
      : products;
  
    // Tampilkan produk
    filteredProducts.forEach(product => {
      const productCard = document.createElement('div');
      productCard.className = 'product-card';
      productCard.innerHTML = `
        <img src="https://via.placeholder.com/150" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>Rp${product.price.toLocaleString()}</p>
        <button onclick="addToCart(${product.id})">Tambah ke Keranjang</button>
      `;
      productGrid.appendChild(productCard);
    });
  }
  
  // Menambah produk ke keranjang
  function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
  
    const cartItem = cart.find(item => item.id === id);
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    renderCart();
  }
  
  // Menampilkan keranjang
  function renderCart() {
    const cartItemsDiv = document.getElementById("cart-items");
    cartItemsDiv.innerHTML = '';
  
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = "<p>Keranjang kosong.</p>";
    } else {
      cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
          <p>${item.name} x ${item.quantity} - Rp${(item.price * item.quantity).toLocaleString()}</p>
          <button onclick="removeFromCart(${item.id})">Hapus</button>
        `;
        cartItemsDiv.appendChild(cartItem);
      });
    }
  
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    document.getElementById("cart-total").textContent = `Total: Rp${total.toLocaleString()}`;
  }
  
  // Hapus produk dari keranjang
  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
  }
  
  // Simulasi checkout
  function checkout() {
    if (!isLoggedIn) {
      alert("Silakan login untuk melanjutkan checkout!");
      return;
    }
  
    if (cart.length === 0) {
      alert("Keranjang kosong!");
      return;
    }
  
    alert("Pembayaran berhasil! Terima kasih atas pembelian Anda!");
    cart = [];
    renderCart();
  }
  
  // Login/logout simulasi
  function toggleLogin() {
    isLoggedIn = !isLoggedIn;
    const accountSection = document.getElementById("account");
    accountSection.innerHTML = isLoggedIn
      ? "<p>Selamat datang! Anda sudah login.</p><button onclick='toggleLogin()'>Logout</button>"
      : `<h2>Masuk atau Daftar</h2>
          <form>
            <label for="username">Username</label>
            <input type="text" id="username" placeholder="Masukkan username">
            <label for="password">Password</label>
            <input type="password" id="password" placeholder="Masukkan password">
            <button type="button" onclick="toggleLogin()">Login</button>
          </form>`;
  }
  
  // Scroll ke bagian tertentu
  function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
  }
  
  // Render awal
  renderProducts();
  toggleLogin();
  