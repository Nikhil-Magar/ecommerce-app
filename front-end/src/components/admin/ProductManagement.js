import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import db from '../../db/indexedDB';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
    status: 'active'
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      if (!db.db) await db.init();
      const data = await db.getAll('products');
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadCategories = async () => {
    try {
      if (!db.db) await db.init();
      const data = await db.getAll('categories');
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('❌ Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('❌ Please upload an image file');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, image: url }));
    setImagePreview(url);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        createdAt: editingProduct?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingProduct) {
        await db.update('products', { ...productData, id: editingProduct.id });
        alert('✅ Product updated successfully!');
      } else {
        await db.add('products', productData);
        alert('✅ Product added successfully!');
      }

      loadProducts();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving product:', error);
      alert('❌ Error saving product: ' + error.message);
    }
  };

  const handleEdit = (product, e) => {
    if (e) e.stopPropagation();
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image || '',
      status: product.status
    });
    setImagePreview(product.image || null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await db.delete('products', id);
        loadProducts();
        alert('✅ Product deleted successfully!');
      } catch (error) {
        alert('❌ Error deleting product');
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: '', stock: '', image: '', status: 'active' });
    setEditingProduct(null);
    setImagePreview(null);
  };

  const handleOpenModal = (e) => {
    if (e) e.stopPropagation();
    resetForm();
    setShowModal(true);
  };

  const handleCloseModal = (e) => {
    if (e) e.stopPropagation();
    setShowModal(false);
    resetForm();
  };

  const styles = {
    container: { padding: '2rem' },
    pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' },
    title: { margin: 0, color: '#2d3748', fontSize: '2rem' },
    btnPrimary: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: '600' },
    filters: { display: 'flex', gap: '1rem', marginBottom: '2rem' },
    searchInput: { flex: 1, padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' },
    filterSelect: { minWidth: '200px', padding: '0.75rem 1rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem' },
    productsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' },
    productCard: { background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', transition: 'transform 0.3s' },
    productImage: { width: '100%', height: '200px', objectFit: 'cover' },
    productInfo: { padding: '1.25rem' },
    productName: { margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.1rem' },
    productDesc: { margin: '0 0 1rem 0', color: '#718096', fontSize: '0.9rem' },
    productDetails: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.5rem', flexWrap: 'wrap' },
    price: { fontSize: '1.25rem', fontWeight: 700, color: '#667eea' },
    stock: { fontSize: '0.85rem', color: '#718096', background: '#f7fafc', padding: '0.25rem 0.75rem', borderRadius: '12px' },
    statusActive: { fontSize: '0.85rem', padding: '0.25rem 0.75rem', borderRadius: '12px', background: '#c6f6d5', color: '#22543d' },
    statusInactive: { fontSize: '0.85rem', padding: '0.25rem 0.75rem', borderRadius: '12px', background: '#fed7d7', color: '#742a2a' },
    productActions: { display: 'flex', gap: '0.5rem' },
    btnEdit: { flex: 1, background: '#667eea', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' },
    btnDelete: { flex: 1, background: '#f56565', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(102, 126, 234, 0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 999999, padding: '2rem', overflowY: 'auto' },
    modal: { position: 'relative', background: 'white', borderRadius: '16px', maxWidth: '650px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px rgba(0,0,0,0.3)', zIndex: 1000000 },
    modalHeader: { padding: '2rem 2rem 1.5rem', borderBottom: '2px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '16px 16px 0 0', color: 'white' },
    modalTitle: { margin: 0, fontSize: '1.75rem', color: 'white' },
    closeBtn: { background: 'rgba(255, 255, 255, 0.2)', border: 'none', fontSize: '2rem', cursor: 'pointer', color: 'white', padding: '0.5rem', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', lineHeight: 1 },
    form: { padding: '2rem' },
    formGroup: { marginBottom: '1.5rem' },
    label: { display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.95rem' },
    input: { width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box', fontFamily: 'inherit' },
    textarea: { width: '100%', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical', minHeight: '100px' },
    formRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' },
    uploadContainer: { border: '2px dashed #667eea', borderRadius: '12px', padding: '2rem', textAlign: 'center', background: '#f7fafc', cursor: 'pointer', transition: 'all 0.3s', marginBottom: '1rem' },
    uploadIcon: { fontSize: '3rem', marginBottom: '0.5rem' },
    uploadText: { margin: '0.5rem 0', color: '#667eea', fontWeight: 'bold' },
    uploadHint: { margin: 0, fontSize: '0.85rem', color: '#718096' },
    divider: { display: 'flex', alignItems: 'center', margin: '1rem 0', color: '#718096' },
    dividerLine: { flex: 1, height: '1px', background: '#e2e8f0' },
    dividerText: { padding: '0 1rem', fontSize: '0.85rem' },
    helpText: { color: '#718096', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' },
    previewContainer: { marginTop: '1rem', position: 'relative' },
    preview: { width: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px', background: '#f7fafc' },
    removeBtn: { position: 'absolute', top: '1rem', right: '1rem', background: '#f56565', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    formActions: { display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' },
    btnSecondary: { background: '#e2e8f0', color: '#2d3748', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.pageHeader}>
        <h1 style={styles.title}>Product Management</h1>
        <button style={styles.btnPrimary} onClick={handleOpenModal}>➕ Add Product</button>
      </div>

      <div style={styles.filters}>
        <input style={styles.searchInput} type="text" placeholder="🔍 Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <select style={styles.filterSelect} value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
        </select>
      </div>

      <div style={styles.productsGrid}>
        {filteredProducts.map(product => (
          <div key={product.id} style={styles.productCard}>
            <img style={styles.productImage} src={product.image || 'https://placehold.co/300x300/667eea/white?text=No+Image'} alt={product.name} />
            <div style={styles.productInfo}>
              <h3 style={styles.productName}>{product.name}</h3>
              <p style={styles.productDesc}>{product.description}</p>
              <div style={styles.productDetails}>
                <span style={styles.price}>${product.price}</span>
                <span style={styles.stock}>📦 {product.stock}</span>
                <span style={product.status === 'active' ? styles.statusActive : styles.statusInactive}>{product.status}</span>
              </div>
              <div style={styles.productActions}>
                <button style={styles.btnEdit} onClick={(e) => handleEdit(product, e)}>✏️ Edit</button>
                <button style={styles.btnDelete} onClick={() => handleDelete(product.id)}>🗑️ Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && <div style={{textAlign: 'center', padding: '3rem', color: '#718096'}}>No products found</div>}

      {showModal && ReactDOM.createPortal(
        <div style={styles.modalOverlay}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
              <button style={styles.closeBtn} onClick={handleCloseModal}>×</button>
            </div>
            <form style={styles.form} onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Product Name *</label>
                <input style={styles.input} type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g., Wireless Headphones" />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Description *</label>
                <textarea style={styles.textarea} name="description" value={formData.description} onChange={handleInputChange} required placeholder="Product description..." />
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>💰 Price *</label>
                  <input style={styles.input} type="number" name="price" step="0.01" value={formData.price} onChange={handleInputChange} required placeholder="0.00" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>📦 Stock *</label>
                  <input style={styles.input} type="number" name="stock" value={formData.stock} onChange={handleInputChange} required placeholder="0" />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>🏷️ Category *</label>
                  <select style={styles.input} name="category" value={formData.category} onChange={handleInputChange} required>
                    <option value="">Select Category</option>
                    {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                  </select>
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Status *</label>
                  <select style={styles.input} name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="active">✅ Active</option>
                    <option value="inactive">❌ Inactive</option>
                  </select>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>🖼️ Product Image</label>
                <div style={styles.uploadContainer}>
                  <input type="file" id="imageUpload" accept="image/*" onChange={handleImageUpload} style={{display: 'none'}} />
                  <label htmlFor="imageUpload" style={{cursor: 'pointer', display: 'block'}}>
                    <div style={styles.uploadIcon}>📸</div>
                    <p style={styles.uploadText}>Click to upload image</p>
                    <p style={styles.uploadHint}>or drag and drop (Max 5MB)</p>
                  </label>
                </div>

                <div style={styles.divider}>
                  <div style={styles.dividerLine}></div>
                  <span style={styles.dividerText}>OR</span>
                  <div style={styles.dividerLine}></div>
                </div>

                <input style={styles.input} type="url" value={formData.image.startsWith('data:') ? '' : formData.image} onChange={handleImageUrlChange} placeholder="https://example.com/image.jpg" />
                <small style={styles.helpText}>Or paste an image URL from the web</small>

                {imagePreview && (
                  <div style={styles.previewContainer}>
                    <img src={imagePreview} alt="Preview" style={styles.preview} />
                    <button type="button" onClick={handleRemoveImage} style={styles.removeBtn}>×</button>
                  </div>
                )}
              </div>

              <div style={styles.formActions}>
                <button type="button" style={styles.btnSecondary} onClick={handleCloseModal}>Cancel</button>
                <button type="submit" style={styles.btnPrimary}>{editingProduct ? '💾 Update Product' : '➕ Create Product'}</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ProductManagement;