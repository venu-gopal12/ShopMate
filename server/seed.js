const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Category = require("./models/Category");
const Product = require("./models/Product");

dotenv.config();

const categories = [
  { name: "Electronics", description: "Latest gadgets and electronic devices" },
  { name: "Clothing", description: "Fashion and apparel for all occasions" },
  { name: "Books", description: "Wide selection of books and literature" },
  { name: "Home & Kitchen", description: "Everything for your home and kitchen" },
  { name: "Sports & Fitness", description: "Sports equipment and fitness gear" },
  { name: "Toys & Games", description: "Fun toys and games for all ages" }
];

const productsData = {
  "Electronics": [
    { name: "Wireless Headphones", description: "Premium noise-cancelling wireless headphones with 30-hour battery life", price: 199.99, stock: 50, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500" },
    { name: "Smart Watch", description: "Fitness tracker with heart rate monitor and GPS", price: 299.99, stock: 35, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
    { name: "Laptop Stand", description: "Ergonomic aluminum laptop stand for better posture", price: 49.99, stock: 100, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500" },
    { name: "USB-C Hub", description: "7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader", price: 39.99, stock: 75, image: "https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500" },
    { name: "Bluetooth Speaker", description: "Portable waterproof speaker with 360° sound", price: 79.99, stock: 60, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500" }
  ],
  "Clothing": [
    { name: "Cotton T-Shirt", description: "Comfortable 100% organic cotton t-shirt", price: 24.99, stock: 200, image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500" },
    { name: "Denim Jeans", description: "Classic fit denim jeans with stretch fabric", price: 59.99, stock: 150, image: "https://images.unsplash.com/photo-1542272454315-7f6d81b10b44?w=500" },
    { name: "Hoodie", description: "Warm fleece hoodie perfect for casual wear", price: 44.99, stock: 120, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500" },
    { name: "Running Shoes", description: "Lightweight breathable running shoes with cushioned sole", price: 89.99, stock: 80, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500" },
    { name: "Winter Jacket", description: "Waterproof insulated winter jacket", price: 129.99, stock: 60, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500" }
  ],
  "Books": [
    { name: "The Great Adventure", description: "Epic fantasy novel with dragons and magic", price: 14.99, stock: 100, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500" },
    { name: "Coding Mastery", description: "Complete guide to modern web development", price: 39.99, stock: 75, image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=500" },
    { name: "Healthy Cooking", description: "200+ delicious and nutritious recipes", price: 24.99, stock: 90, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500" },
    { name: "Mystery Detective", description: "Thrilling detective mystery novel", price: 12.99, stock: 110, image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500" },
    { name: "Science for Kids", description: "Fun science experiments for curious minds", price: 18.99, stock: 85, image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500" }
  ],
  "Home & Kitchen": [
    { name: "Coffee Maker", description: "Programmable drip coffee maker with thermal carafe", price: 79.99, stock: 45, image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=500" },
    { name: "Blender", description: "High-speed blender for smoothies and soups", price: 99.99, stock: 40, image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=500" },
    { name: "Cookware Set", description: "10-piece non-stick cookware set", price: 149.99, stock: 30, image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500" },
    { name: "Storage Containers", description: "BPA-free food storage container set of 20", price: 29.99, stock: 100, image: "https://images.unsplash.com/photo-1584985429926-08867327b1d6?w=500" },
    { name: "Vacuum Cleaner", description: "Cordless stick vacuum with HEPA filter", price: 249.99, stock: 25, image: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500" }
  ],
  "Sports & Fitness": [
    { name: "Yoga Mat", description: "Non-slip eco-friendly yoga mat with carrying strap", price: 34.99, stock: 150, image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500" },
    { name: "Dumbbell Set", description: "Adjustable dumbbell set 5-50 lbs", price: 199.99, stock: 40, image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500" },
    { name: "Resistance Bands", description: "Set of 5 resistance bands with different strengths", price: 24.99, stock: 120, image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500" },
    { name: "Jump Rope", description: "Speed jump rope with counter and adjustable length", price: 14.99, stock: 200, image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500" },
    { name: "Foam Roller", description: "High-density foam roller for muscle recovery", price: 29.99, stock: 80, image: "https://images.unsplash.com/photo-1611016186353-5af1f6b1ffea?w=500" }
  ],
  "Toys & Games": [
    { name: "Building Blocks", description: "200-piece colorful building blocks set", price: 34.99, stock: 100, image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500" },
    { name: "Board Game Classic", description: "Family-friendly strategy board game", price: 29.99, stock: 75, image: "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=500" },
    { name: "Remote Control Car", description: "Fast RC car with rechargeable battery", price: 49.99, stock: 60, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500" },
    { name: "Puzzle Set", description: "1000-piece jigsaw puzzle with beautiful scenery", price: 19.99, stock: 90, image: "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500" },
    { name: "Stuffed Animal", description: "Soft and cuddly teddy bear plush toy", price: 24.99, stock: 120, image: "https://images.unsplash.com/photo-1530325553241-4f6e7690cf36?w=500" }
  ]
};

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Insert categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Create category map for easy lookup
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Insert products
    let totalProducts = 0;
    for (const [categoryName, products] of Object.entries(productsData)) {
      const categoryId = categoryMap[categoryName];
      const productsWithCategory = products.map(p => ({
        ...p,
        category: categoryId
      }));
      await Product.insertMany(productsWithCategory);
      totalProducts += products.length;
      console.log(`✅ Added ${products.length} products to ${categoryName}`);
    }

    console.log(`\n🎉 Successfully seeded database!`);
    console.log(`📊 Total Categories: ${createdCategories.length}`);
    console.log(`📦 Total Products: ${totalProducts}`);

    mongoose.connection.close();
    console.log("\n👋 Database connection closed");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
