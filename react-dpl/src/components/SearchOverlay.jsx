import React, { useState, useEffect, useRef } from 'react';

const SearchOverlay = ({ onClose, onSearch }) => {
    const [query, setQuery] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        // Komponent ochilganda inputga fokus qilish
        inputRef.current?.focus();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    return (
        <div className="search-overlay">
            <div className="search-overlay-content">
                <button className="close-btn" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Mahsulotlarni qidiring..."
                        className="search-input-overlay"
                    />
                    <button type="submit" className="search-btn-overlay">
                        <i className="fas fa-search"></i>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SearchOverlay;
