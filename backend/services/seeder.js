const Product = require('../models/Product');

const sampleProducts = [
  // Smartphones
  {
    name: 'Samsung Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'Smartphones',
    description: 'Featuring an integrated S Pen, dynamic 6.8-inch AMOLED display, and a 200MP camera system, the Galaxy S24 Ultra sets the standard for flagship smartphones.',
    price: 1299.99,
    image: 'https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?auto=format&fit=crop&q=80&w=400',
    stock: 12,
  },
  {
    name: 'OnePlus 12 5G',
    brand: 'OnePlus',
    category: 'Smartphones',
    description: 'Combining the Snapdragon 8 Gen 3 processor with advanced Hasselblad cameras and 100W SuperVOOC flash charging.',
    price: 799.99,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=400',
    stock: 18,
  },
  {
    name: 'Google Pixel 8 Pro',
    brand: 'Google Pixel',
    category: 'Smartphones',
    description: 'The all-pro phone engineered by Google. Features a polished aluminum frame, the custom Tensor G3 processor, and state-of-the-art AI-driven photography.',
    price: 999.00,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=400',
    stock: 15,
  },

  // Laptops
  {
    name: 'ASUS ROG Zephyrus G14',
    brand: 'ASUS',
    category: 'Laptops',
    description: 'Powerful gaming laptop with AMD Ryzen 9, NVIDIA RTX 4070, and a stunning 120Hz ROG Nebula Display packaged in an ultra-portable 14-inch chassis.',
    price: 1599.99,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=400',
    stock: 8,
  },
  {
    name: 'HP Spectre x360 2-in-1',
    brand: 'HP',
    category: 'Laptops',
    description: 'Convertible touchscreen laptop with an Intel Core Ultra processor, OLED screen, and stunning gem-cut chassis, offering stellar performance and flexibility.',
    price: 1399.00,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=400',
    stock: 10,
  },
  {
    name: 'Dell XPS 15 OLED',
    brand: 'Dell',
    category: 'Laptops',
    description: 'Stunning 15.6-inch infinity-edge OLED display paired with Intel Core i9, and high-performance studio graphics. Ideal for creatives and engineers.',
    price: 1899.99,
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400',
    stock: 7,
  },
  {
    name: 'Lenovo ThinkPad X1 Carbon Gen 11',
    brand: 'Lenovo',
    category: 'Laptops',
    description: 'The ultimate business ultrabook. Lightweight carbon-fiber casing, legendary keyboard ergonomics, robust security features, and stellar battery efficiency.',
    price: 1699.99,
    image: 'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?auto=format&fit=crop&q=80&w=400',
    stock: 14,
  },

  // Audio
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    brand: 'Sony',
    category: 'Audio',
    description: 'Industry-leading noise canceling headphones with custom HD Noise Canceling Processor QN1, premium audio quality, and crystal clear call microphones.',
    price: 399.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400',
    stock: 25,
  },
  {
    name: 'Apple AirPods Pro 2nd Gen',
    brand: 'Apple',
    category: 'Audio',
    description: 'In-ear wireless earbuds featuring high-fidelity sound, adaptive audio, spatial acoustics, custom H2 processing chip, and USB-C MagSafe charging case.',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1588449668365-d15e397f6787?auto=format&fit=crop&q=80&w=400',
    stock: 30,
  },
  {
    name: 'JBL Flip 6 Waterproof Speaker',
    brand: 'JBL',
    category: 'Audio',
    description: 'IP67 waterproof and dustproof portable Bluetooth speaker delivering powerful JBL Original Pro Sound with a 2-way speaker system.',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=400',
    stock: 20,
  },

  // Accessories
  {
    name: 'Keychron K2 Mechanical Keyboard',
    brand: 'Keyboard',
    category: 'Accessories',
    description: 'Compact 75% layout wireless mechanical keyboard with Gateron switches, dual macOS/Windows support, and customizable RGB backlighting.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=400',
    stock: 22,
  },
  {
    name: 'Logitech MX Master 3S Mouse',
    brand: 'Mouse',
    category: 'Accessories',
    description: 'Ergonomic performance mouse featuring an 8K DPI track-on-glass sensor, MagSpeed electromagnetic scroll wheel, and silent click switches.',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=400',
    stock: 28,
  },
  {
    name: 'Anker 737 Power Bank (PowerCore 24K)',
    brand: 'Power Bank',
    category: 'Accessories',
    description: 'Ultra-high-capacity power bank equipped with 140W fast-charging capabilities, digital smart display, and 24,000mAh battery reserve.',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1609592424083-d5d11db4c1a8?auto=format&fit=crop&q=80&w=400',
    stock: 15,
  },
  {
    name: 'Anker Nano 30W USB-C Charger',
    brand: 'Charger',
    category: 'Accessories',
    description: 'Ultra-compact high-speed wall charger equipped with GaN technology, capable of charging smartphones and tablets up to 3x faster.',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&q=80&w=400',
    stock: 50,
  },
];

const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      console.log('Database empty. Seeding TechNova default products...');
      await Product.insertMany(sampleProducts);
      console.log('Successfully seeded 14 electronics products.');
    }
  } catch (err) {
    console.error('Failed to seed default products:', err.message);
  }
};

module.exports = seedProducts;
module.exports.sampleProducts = sampleProducts;
