// Data menu sederhana
const menuData = [
    { id: 1, name: "Nasi Goreng", price: 20000 },
    { id: 2, name: "Mie Ayam", price: 15000 },
    { id: 3, name: "Sate Ayam", price: 25000 }
  ];
  
  let cart = [];
  
  /* Fungsi untuk menambahkan item ke keranjang */
  function addToCart(id) {
    const item = menuData.find(menu => menu.id === id);
    if (!item) return;
    const cartItem = cart.find(ci => ci.id === id);
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }
    renderCart();
  }
  
  /* Render atau tampilkan keranjang belanja */
  function renderCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    cartItemsDiv.innerHTML = '';
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = '<p>Keranjang kosong</p>';
    } else {
      cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
          <p>${item.name} x ${item.quantity} - Rp${item.price * item.quantity}</p>
          <button onclick="removeFromCart(${item.id})">Hapus</button>
        `;
        cartItemsDiv.appendChild(itemDiv);
      });
    }
    updateTotal();
  }
  
  /* Update total harga di keranjang */
  function updateTotal() {
    const totalDiv = document.getElementById('cart-total');
    let total = 0;
    cart.forEach(item => total += item.price * item.quantity);
    totalDiv.innerHTML = `Total: Rp${total}`;
  }
  
  /* Hapus item dari keranjang */
  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    renderCart();
  }
  
  /* Fungsi checkout */
  function checkout() {
    if (cart.length === 0) {
      alert("Keranjang kosong!");
      return;
    }
    let total = 0;
    cart.forEach(item => total += item.price * item.quantity);
    alert(`Total pembayaran: Rp${total}. Terima kasih atas pesanan Anda!`);
    cart = [];
    renderCart();
  }
  
  /* Fungsi submit form kontak */
  function submitContact(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    alert(`Terima kasih, ${name}. Pesan Anda telah terkirim.`);
    event.target.reset();
  }
  