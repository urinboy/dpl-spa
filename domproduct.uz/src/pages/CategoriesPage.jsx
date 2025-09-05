
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getMainCategories, getSubCategories, getCategoryTranslation } from '../data/categories';
import Meta from '../components/Meta';

function CategoriesPage() {
  const { t } = useTranslation();
  const [expandedCategory, setExpandedCategory] = useState(null);
  const mainCategories = getMainCategories();

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <div className="categories-page">
      <Meta title={t('all_categories')} />
      
      {/* Header Section */}
      <div className="categories-header">
        <div className="categories-header-content">
          <h1 className="categories-title">{t('all_categories')}</h1>
          <p className="categories-subtitle">{t('browse_categories_description')}</p>
        </div>
        <div className="categories-stats">
          <div className="stat-item">
            <span className="stat-number">{mainCategories.length}</span>
            {/* <span className="stat-label">{t('categories')}</span> */}
          </div>
        </div>
      </div>

      {/* Categories Container */}
      <div className="categories-container">
        {mainCategories.map(category => {
          const categoryTranslation = getCategoryTranslation(category, t('current_lang'));
          const subCategories = getSubCategories(category.id);
          const isExpanded = expandedCategory === category.id;

          return (
            <div key={category.id} className="modern-category-card">
              {/* Main Category Header */}
              <div className="category-header">
                <div className="category-main-section">
                  <div className="category-icon-wrapper">
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={categoryTranslation.name}
                        className="category-image"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `<span class="category-emoji-large">${category.icon}</span>`;
                        }}
                      />
                    ) : (
                      <span className="category-emoji-large">{category.icon}</span>
                    )}
                    <div className="category-icon-bg"></div>
                  </div>
                  
                  <div className="category-content">
                    <div className="category-text">
                      <h2 className="category-name">{categoryTranslation.name} ({subCategories.length})</h2>
                      <p className="category-description">{categoryTranslation.description}</p>
                    </div>
                    
                  </div>
                </div>

                <div className="category-actions">
                  <Link to={`/category/${category.slug}`} className="view-products-button">
                    <i className="fas fa-box"></i> {t('view_products')}
                  </Link>
                  {subCategories.length > 0 && (
                    <button 
                      className={`expand-button ${isExpanded ? 'expanded' : ''}`}
                      onClick={() => toggleCategory(category.id)}
                    >
                      <i className="fas fa-chevron-down"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Subcategories Section */}
              {subCategories.length > 0 && (
                <div className={`subcategories-section ${isExpanded ? 'expanded' : ''}`}>
                  {/* <div className="subcategories-header">
                    <h3 className="subcategories-title">
                      <i className="fas fa-list"></i>
                      {t('subcategories')}
                    </h3>
                  </div> */}
                  
                  <div className="subcategories-grid">
                    {subCategories.map(subCategory => {
                      const subCategoryTranslation = getCategoryTranslation(subCategory, t('current_lang'));
                      return (
                        <Link 
                          key={subCategory.id}
                          to={`/category/${subCategory.slug}`} 
                          className="subcategory-item"
                        >
                          <div className="subcategory-icon">
                            <span className="subcategory-emoji">{subCategory.icon}</span>
                          </div>
                          <div className="subcategory-content">
                            <h4 className="subcategory-name">{subCategoryTranslation.name}</h4>
                            <p className="subcategory-desc">{subCategoryTranslation.description}</p>
                          </div>
                          <div className="subcategory-arrow">
                            <i className="fas fa-chevron-right"></i>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CategoriesPage;
