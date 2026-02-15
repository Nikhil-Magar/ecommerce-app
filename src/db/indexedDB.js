// IndexedDB Database Manager for E-commerce App
const DB_NAME = 'EcommerceDB';
const DB_VERSION = 1;

class DatabaseManager {
  constructor() {
    this.db = null;
  }

  // Initialize Database
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Products Store
        if (!db.objectStoreNames.contains('products')) {
          const productStore = db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
          productStore.createIndex('name', 'name', { unique: false });
          productStore.createIndex('category', 'category', { unique: false });
          productStore.createIndex('status', 'status', { unique: false });
          productStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Users Store
        if (!db.objectStoreNames.contains('users')) {
          const userStore = db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
          userStore.createIndex('email', 'email', { unique: true });
          userStore.createIndex('role', 'role', { unique: false });
          userStore.createIndex('status', 'status', { unique: false });
        }

        // Orders Store
        if (!db.objectStoreNames.contains('orders')) {
          const orderStore = db.createObjectStore('orders', { keyPath: 'id', autoIncrement: true });
          orderStore.createIndex('userId', 'userId', { unique: false });
          orderStore.createIndex('status', 'status', { unique: false });
          orderStore.createIndex('createdAt', 'createdAt', { unique: false });
        }

        // Categories Store
        if (!db.objectStoreNames.contains('categories')) {
          const categoryStore = db.createObjectStore('categories', { keyPath: 'id', autoIncrement: true });
          categoryStore.createIndex('name', 'name', { unique: true });
        }

        // Settings Store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }

        // Analytics Store
        if (!db.objectStoreNames.contains('analytics')) {
          const analyticsStore = db.createObjectStore('analytics', { keyPath: 'id', autoIncrement: true });
          analyticsStore.createIndex('date', 'date', { unique: false });
          analyticsStore.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  // Generic CRUD Operations
  async add(storeName, data) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get(storeName, id) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll(storeName) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async update(storeName, data) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.put(data);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, id) {
    const transaction = this.db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getByIndex(storeName, indexName, value) {
    const transaction = this.db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const index = store.index(indexName);
    return new Promise((resolve, reject) => {
      const request = index.getAll(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async search(storeName, searchTerm, indexName = 'name') {
    const allItems = await this.getAll(storeName);
    return allItems.filter(item => 
      item[indexName]?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Seed Initial Data
  async seedInitialData() {
    try {
      // Check if data already exists
      const existingProducts = await this.getAll('products');
      if (existingProducts.length > 0) return;

      // Seed Categories
      const categories = [
        { name: 'Electronics', description: 'Electronic devices and accessories' },
        { name: 'Clothing', description: 'Fashion and apparel' },
        { name: 'Home & Garden', description: 'Home improvement and garden supplies' },
        { name: 'Books', description: 'Books and publications' },
        { name: 'Sports', description: 'Sports equipment and accessories' }
      ];

      for (const category of categories) {
        await this.add('categories', category);
      }

      // Seed Sample Products
      const products = [
        {
          name: 'Wireless Headphones',
          description: 'Premium noise-cancelling wireless headphones',
          price: 299.99,
          category: 'Electronics',
          stock: 50,
          image: 'https://via.placeholder.com/300x300?text=Headphones',
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          name: 'Smart Watch',
          description: 'Fitness tracking smartwatch with heart rate monitor',
          price: 199.99,
          category: 'Electronics',
          stock: 30,
          image: 'https://via.placeholder.com/300x300?text=Smart+Watch',
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          name: 'Running Shoes',
          description: 'Comfortable running shoes for all terrains',
          price: 89.99,
          category: 'Sports',
          stock: 100,
          image: 'https://via.placeholder.com/300x300?text=Running+Shoes',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ];

      for (const product of products) {
        await this.add('products', product);
      }

      // Seed Admin User
      await this.add('users', {
        email: 'admin@ecommerce.com',
        password: 'admin123', // In production, use proper hashing
        role: 'admin',
        name: 'Admin User',
        status: 'active',
        createdAt: new Date().toISOString()
      });

      // Seed Default Settings
      await this.add('settings', {
        key: 'site_name',
        value: 'My E-Commerce Store'
      });
      await this.add('settings', {
        key: 'currency',
        value: 'USD'
      });
      await this.add('settings', {
        key: 'tax_rate',
        value: 10
      });

      console.log('Initial data seeded successfully');
    } catch (error) {
      console.error('Error seeding data:', error);
    }
  }
}

const db = new DatabaseManager();
export default db;