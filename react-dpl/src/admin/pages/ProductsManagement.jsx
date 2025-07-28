import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { allProducts } from '../../data/products';
import { categories } from '../../data/categories';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const ProductsManagement = () => {
    const { t } = useTranslation();
    const [products, setProducts] = useState(allProducts);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingProduct, setDeletingProduct] = useState(null);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image: '',
        category: '',
        description: '',
        inStock: true
    });

    // Filter products
    const filteredProducts = products.filter(product => {
        const matchesSearch = t(product.name).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price.toString(),
                image: product.image,
                category: product.category,
                description: product.description || '',
                inStock: product.inStock !== false
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                price: '',
                image: '',
                category: '',
                description: '',
                inStock: true
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingProduct(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const productData = {
            ...formData,
            price: parseFloat(formData.price),
            id: editingProduct ? editingProduct.id : Date.now()
        };

        if (editingProduct) {
            // Update existing product
            setProducts(products.map(p => 
                p.id === editingProduct.id ? { ...p, ...productData } : p
            ));
        } else {
            // Add new product
            setProducts([...products, productData]);
        }

        closeModal();
    };

    const deleteProduct = (product) => {
        setDeletingProduct(product);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setProducts(products.filter(p => p.id !== deletingProduct.id));
        setShowDeleteModal(false);
        setDeletingProduct(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeletingProduct(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    return (
        <div className="admin-products">
            <div className="admin-page-header">
                <h1>{t('products_management')}</h1>
                <button 
                    className="admin-btn admin-btn-primary"
                    onClick={() => openModal()}
                >
                    <i className="fas fa-plus"></i>
                    {t('add_product')}
                </button>
            </div>

            {/* Filters */}
            <div className="admin-filters">
                <div className="admin-search">
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder={t('search_products')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="admin-select"
                >
                    <option value="">{t('all_categories')}</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.slug}>
                            {t(`category_${category.slug}`)}
                        </option>
                    ))}
                </select>
            </div>

            {/* Products Table */}
            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>{t('image')}</th>
                            <th>{t('name')}</th>
                            <th>{t('category')}</th>
                            <th>{t('price')}</th>
                            <th>{t('status')}</th>
                            <th>{t('actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(product => (
                            <tr key={product.id}>
                                <td>
                                    <img 
                                        src={product.image} 
                                        alt={product.name}
                                        className="admin-product-image"
                                    />
                                </td>
                                <td>{t(product.name)}</td>
                                <td>
                                    {categories.find(c => c.slug === product.category)?.name || product.category}
                                </td>
                                <td>{product.price.toLocaleString('uz-UZ')} UZS</td>
                                <td>
                                    <span className={`admin-status-badge ${product.inStock !== false ? 'active' : 'inactive'}`}>
                                        {product.inStock !== false ? t('in_stock') : t('out_of_stock')}
                                    </span>
                                </td>
                                <td>
                                    <div className="admin-actions">
                                        <button
                                            className="admin-btn admin-btn-sm admin-btn-secondary"
                                            onClick={() => openModal(product)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="admin-btn admin-btn-sm admin-btn-danger"
                                            onClick={() => deleteProduct(product)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={closeModal}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>{editingProduct ? t('edit_product') : t('add_product')}</h2>
                            <button className="admin-modal-close" onClick={closeModal}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="admin-form-group">
                                <label>{t('product_name')}</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>{t('category')}</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">{t('select_category')}</option>
                                    {categories.map(category => (
                                        <option key={category.id} value={category.slug}>
                                            {t(`category_${category.slug}`)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="admin-form-group">
                                <label>{t('price')}</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>{t('image_url')}</label>
                                <input
                                    type="url"
                                    name="image"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>{t('description')}</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                ></textarea>
                            </div>
                            <div className="admin-form-group">
                                <label className="admin-checkbox-label">
                                    <input
                                        type="checkbox"
                                        name="inStock"
                                        checked={formData.inStock}
                                        onChange={handleInputChange}
                                    />
                                    {t('in_stock')}
                                </label>
                            </div>
                            <div className="admin-form-actions">
                                <button type="button" className="admin-btn admin-btn-secondary" onClick={closeModal}>
                                    <i className="fas fa-times"></i>
                                    {t('cancel')}
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary">
                                    <i className={`fas ${editingProduct ? 'fa-save' : 'fa-plus'}`}></i>
                                    {editingProduct ? t('update') : t('add')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onClose={cancelDelete}
                onConfirm={confirmDelete}
                title={t('confirm_delete_product')}
                message={t('delete_product_message')}
                itemName={deletingProduct?.name}
            />
        </div>
    );
};

export default ProductsManagement;
