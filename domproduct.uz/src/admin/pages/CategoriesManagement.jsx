import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { categories } from '../../data/categories';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';

const CategoriesManagement = () => {
    const { t } = useTranslation();
    const [categoriesList, setCategoriesList] = useState(categories);
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingCategory, setDeletingCategory] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        icon: '',
        description: ''
    });

    const openModal = (category = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                name: category.name,
                slug: category.slug,
                icon: category.icon,
                description: category.description || ''
            });
        } else {
            setEditingCategory(null);
            setFormData({
                name: '',
                slug: '',
                icon: '',
                description: ''
            });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingCategory(null);
    };

    const generateSlug = (name) => {
        return name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const categoryData = {
            ...formData,
            id: editingCategory ? editingCategory.id : Date.now(),
            slug: formData.slug || generateSlug(formData.name)
        };

        if (editingCategory) {
            setCategoriesList(categoriesList.map(c => 
                c.id === editingCategory.id ? { ...c, ...categoryData } : c
            ));
        } else {
            setCategoriesList([...categoriesList, categoryData]);
        }

        closeModal();
    };

    const deleteCategory = (category) => {
        setDeletingCategory(category);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        setCategoriesList(categoriesList.filter(c => c.id !== deletingCategory.id));
        setShowDeleteModal(false);
        setDeletingCategory(null);
    };

    const cancelDelete = () => {
        setShowDeleteModal(false);
        setDeletingCategory(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Auto-generate slug from name
        if (name === 'name' && !editingCategory) {
            setFormData(prev => ({
                ...prev,
                name: value,
                slug: generateSlug(value)
            }));
        }
    };

    return (
        <div className="admin-categories">
            <div className="admin-page-header">
                <h1>{t('categories_management')}</h1>
                <button 
                    className="admin-btn admin-btn-primary"
                    onClick={() => openModal()}
                >
                    <i className="fas fa-plus"></i>
                    {t('add_category')}
                </button>
            </div>

            {/* Categories Grid */}
            <div className="admin-categories-grid">
                {categoriesList.map(category => (
                    <div key={category.id} className="admin-category-card">
                        <div className="admin-category-icon">
                            <i className={category.icon}></i>
                        </div>
                        <div className="admin-category-info">
                            <h3>{category.name}</h3>
                            <p className="admin-category-slug">{category.slug}</p>
                            {category.description && (
                                <p className="admin-category-description">{category.description}</p>
                            )}
                        </div>
                        <div className="admin-category-actions">
                            <button
                                className="admin-btn admin-btn-sm admin-btn-secondary"
                                onClick={() => openModal(category)}
                            >
                                <i className="fas fa-edit"></i>
                            </button>
                            <button
                                className="admin-btn admin-btn-sm admin-btn-danger"
                                onClick={() => deleteCategory(category)}
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="admin-modal-overlay" onClick={closeModal}>
                    <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="admin-modal-header">
                            <h2>{editingCategory ? t('edit_category') : t('add_category')}</h2>
                            <button className="admin-modal-close" onClick={closeModal}>
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="admin-form-group">
                                <label>{t('category_name')}</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>{t('category_slug')}</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="admin-form-group">
                                <label>{t('category_icon')}</label>
                                <input
                                    type="text"
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleInputChange}
                                    placeholder="fas fa-laptop"
                                    required
                                />
                                <small>{t('icon_help_text')}</small>
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
                            <div className="admin-form-actions">
                                <button type="button" className="admin-btn admin-btn-secondary" onClick={closeModal}>
                                    <i className="fas fa-times"></i>
                                    {t('cancel')}
                                </button>
                                <button type="submit" className="admin-btn admin-btn-primary">
                                    <i className={`fas ${editingCategory ? 'fa-save' : 'fa-plus'}`}></i>
                                    {editingCategory ? t('update') : t('add')}
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
                title={t('confirm_delete_category')}
                message={t('delete_category_message')}
                itemName={deletingCategory?.name}
            />
        </div>
    );
};

export default CategoriesManagement;
