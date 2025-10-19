import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./Products.css";
import { CartContext } from "../../context/CartContext";
import { WishlistContext } from "../../context/WishlistContext";
import { useNavigate, useLocation } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [viewImage, setViewImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedAvailability, setSelectedAvailability] = useState([]);
  const [price, setPrice] = useState(100000);
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [brandSearch, setBrandSearch] = useState("");
  const [showBrandFilter, setShowBrandFilter] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState("category");
  const [showSortModal, setShowSortModal] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  const { addToCart, updateQuantity, cartItems } = useContext(CartContext);
  const { wishlist, toggleWishlist, isWishlisted } =
    useContext(WishlistContext);

  const navigate = useNavigate();
  const location = useLocation();

  const getCategoryQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("category") || "";
  };

  const getSearchQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("search") || "";
  };

  const getFormattedCategory = () => {
    const category = decodeURIComponent(getCategoryQuery());
    const searchTerm = getSearchQuery();

    if (searchTerm) {
      return `Search Results for "${searchTerm}"`;
    }

    return category
      ? category.replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
      : "All Products";
  };

  const getCategorySubtitle = () => {
    const searchTerm = getSearchQuery();

    if (searchTerm) {
      return `Showing all products matching your search query`;
    }

    const category = decodeURIComponent(getCategoryQuery()).toLowerCase();
    switch (category) {
      case "smartphones":
        return "Explore the latest Android & iOS smartphones.";
      case "laptops":
        return "High-performance laptops for work and play.";
      case "accessories":
        return "Browse chargers, cables, and other essential gadgets.";
      case "smart tvs":
        return "Experience stunning visuals with our Smart TVs.";
      default:
        return "Browse our collection of top-quality electronics.";
    }
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/products/")
      .then((res) => {
        setProducts(res.data);
        const cats = [...new Set(res.data.map((p) => p.category))];
        const brnds = [...new Set(res.data.map((p) => p.brand))];
        setCategories(cats);
        setBrands(brnds);
      })
      .catch((err) => console.error("Error fetching products :", err));
  }, []);

  useEffect(() => {
    let result = products;
    const categoryFromURL = getCategoryQuery();
    const searchFromURL = getSearchQuery();

    // Apply search filter first if search query exists
    if (searchFromURL) {
      const searchLower = searchFromURL.toLowerCase();
      result = result.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower) ||
          p.brand?.toLowerCase().includes(searchLower) ||
          p.category?.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter from URL
    if (categoryFromURL) {
      result = result.filter(
        (p) => p.category?.toLowerCase() === categoryFromURL.toLowerCase()
      );
    }

    // Apply sidebar category filters
    if (selectedCategories.length) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Apply brand filters
    if (selectedBrands.length) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    // Apply rating filters
    if (selectedRatings.length) {
      result = result.filter((p) =>
        selectedRatings.some((r) => Math.floor(p.rating) >= r)
      );
    }

    // Apply availability filters
    if (selectedAvailability.length) {
      result = result.filter((p) => {
        if (selectedAvailability.includes("in") && p.stock > 0) return true;
        if (selectedAvailability.includes("out") && p.stock === 0) return true;
        return false;
      });
    }

    // Apply price filter
    if (price < 100000) {
      result = result.filter((p) => p.price <= price);
    }

    setFilteredProducts(result);
  }, [
    products,
    selectedCategories,
    selectedBrands,
    selectedRatings,
    selectedAvailability,
    price,
    location.search,
  ]);

  // Apply sorting whenever filteredProducts or sortBy changes
  useEffect(() => {
    let sortedProducts = [...filteredProducts];

    switch (sortBy) {
      case "popularity":
        sortedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "price-low-high":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sortedProducts.sort((a, b) => b.id - a.id);
        break;
      case "relevance":
      default:
        // Keep original order
        break;
    }

    setFilteredProducts(sortedProducts);
  }, [sortBy]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        window.brandDropdownRef &&
        !window.brandDropdownRef.contains(event.target)
      ) {
        setBrandDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getQuantity = (id) => {
    const item = cartItems.find((i) => i.id === id);
    return item ? item.quantity : 0;
  };

  const closeModal = () => setViewImage(null);

  const handleBuyNow = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (!existingItem) {
      addToCart(product);
    }
    navigate("/checkout");
  };

  const toggleSelection = (array, setter, value) => {
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={`full-${i}`} className="star full">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="star half">
          ★
        </span>
      );
    }

    while (stars.length < 5) {
      stars.push(
        <span key={`empty-${stars.length}`} className="star empty">
          ★
        </span>
      );
    }

    return stars;
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedRatings([]);
    setSelectedAvailability([]);
    setSelectedBrands([]);
    setPrice(100000);
    setBrandSearch("");
  };

  const applyFilters = () => {
    setShowMobileFilters(false);
  };

  const renderFilterContent = () => {
    switch (activeFilterTab) {
      case "category":
        return (
          <div className="filter-options-content">
            <h4>Category</h4>
            {categories.map((cat, idx) => (
              <div key={idx} className="filter-option-item">
                <input
                  type="checkbox"
                  id={`cat-${idx}`}
                  value={cat}
                  checked={selectedCategories.includes(cat)}
                  onChange={() =>
                    toggleSelection(
                      selectedCategories,
                      setSelectedCategories,
                      cat
                    )
                  }
                />
                <label htmlFor={`cat-${idx}`}>{cat}</label>
              </div>
            ))}
          </div>
        );
      case "brand":
        return (
          <div className="filter-options-content">
            <h4>Brand</h4>
            <input
              type="text"
              placeholder="Search Brand"
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value)}
              className="filter-search-input"
            />
            <div className="filter-options-list">
              {(brandSearch
                ? brands.filter((b) =>
                    b.toLowerCase().includes(brandSearch.toLowerCase())
                  )
                : brands
              ).map((brand, idx) => (
                <div key={idx} className="filter-option-item">
                  <input
                    type="checkbox"
                    id={`brand-${idx}`}
                    value={brand}
                    checked={selectedBrands.includes(brand)}
                    onChange={() =>
                      toggleSelection(selectedBrands, setSelectedBrands, brand)
                    }
                  />
                  <label htmlFor={`brand-${idx}`}>{brand}</label>
                </div>
              ))}
            </div>
          </div>
        );
      case "rating":
        return (
          <div className="filter-options-content">
            <h4>Customer Ratings</h4>
            {[4, 3, 2, 1].map((r) => (
              <div key={r} className="filter-option-item">
                <input
                  type="checkbox"
                  id={`rating-${r}`}
                  value={r}
                  checked={selectedRatings.includes(r)}
                  onChange={() =>
                    toggleSelection(selectedRatings, setSelectedRatings, r)
                  }
                />
                <label htmlFor={`rating-${r}`}>{r} ★ & above</label>
              </div>
            ))}
          </div>
        );
      case "availability":
        return (
          <div className="filter-options-content">
            <h4>Availability</h4>
            <div className="filter-option-item">
              <input
                type="checkbox"
                id="avail-in"
                value="in"
                checked={selectedAvailability.includes("in")}
                onChange={() =>
                  toggleSelection(
                    selectedAvailability,
                    setSelectedAvailability,
                    "in"
                  )
                }
              />
              <label htmlFor="avail-in">In Stock</label>
            </div>
            <div className="filter-option-item">
              <input
                type="checkbox"
                id="avail-out"
                value="out"
                checked={selectedAvailability.includes("out")}
                onChange={() =>
                  toggleSelection(
                    selectedAvailability,
                    setSelectedAvailability,
                    "out"
                  )
                }
              />
              <label htmlFor="avail-out">Out of Stock</label>
            </div>
          </div>
        );
      case "price":
        return (
          <div className="filter-options-content">
            <h4>Price Range</h4>
            <div className="price-filter-content">
              <p>Up to ₹{price.toLocaleString()}</p>
              <input
                type="range"
                min="0"
                max="100000"
                step="1000"
                value={price}
                onChange={(e) => setPrice(parseInt(e.target.value))}
                className="price-range-slider"
              />
              <div className="price-range-labels">
                <span>₹0</span>
                <span>₹1,00,000</span>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="products-page">
      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div className="mobile-filter-modal">
          <div className="mobile-filter-container">
            {/* Header */}
            <div className="mobile-filter-header">
              <button
                className="mobile-filter-close"
                onClick={() => setShowMobileFilters(false)}
              >
                ✕
              </button>
              <h3>Filters</h3>
              <button className="mobile-filter-clear" onClick={clearFilters}>
                Clear All
              </button>
            </div>

            {/* Content Area */}
            <div className="mobile-filter-content">
              {/* Left Sidebar - Filter Categories */}
              <div className="mobile-filter-sidebar">
                <div
                  className={`filter-tab ${
                    activeFilterTab === "category" ? "active" : ""
                  }`}
                  onClick={() => setActiveFilterTab("category")}
                >
                  <span>Category</span>
                  {selectedCategories.length > 0 && (
                    <span className="filter-count">
                      {selectedCategories.length}
                    </span>
                  )}
                </div>
                <div
                  className={`filter-tab ${
                    activeFilterTab === "brand" ? "active" : ""
                  }`}
                  onClick={() => setActiveFilterTab("brand")}
                >
                  <span>Brand</span>
                  {selectedBrands.length > 0 && (
                    <span className="filter-count">
                      {selectedBrands.length}
                    </span>
                  )}
                </div>
                <div
                  className={`filter-tab ${
                    activeFilterTab === "rating" ? "active" : ""
                  }`}
                  onClick={() => setActiveFilterTab("rating")}
                >
                  <span>Rating</span>
                  {selectedRatings.length > 0 && (
                    <span className="filter-count">
                      {selectedRatings.length}
                    </span>
                  )}
                </div>
                <div
                  className={`filter-tab ${
                    activeFilterTab === "availability" ? "active" : ""
                  }`}
                  onClick={() => setActiveFilterTab("availability")}
                >
                  <span>Availability</span>
                  {selectedAvailability.length > 0 && (
                    <span className="filter-count">
                      {selectedAvailability.length}
                    </span>
                  )}
                </div>
                <div
                  className={`filter-tab ${
                    activeFilterTab === "price" ? "active" : ""
                  }`}
                  onClick={() => setActiveFilterTab("price")}
                >
                  <span>Price</span>
                </div>
              </div>

              {/* Right Content - Filter Options */}
              <div className="mobile-filter-options">
                {renderFilterContent()}
              </div>
            </div>

            {/* Footer - Apply Button */}
            <div className="mobile-filter-footer">
              <button className="mobile-filter-apply" onClick={applyFilters}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Filter Sidebar */}
      {!getCategoryQuery() && (
        <div className="filter-sidebar">
          <h3>Filters</h3>

          {getSearchQuery() && (
            <div className="search-info">
              <p>
                🔍 Searching for: <strong>{getSearchQuery()}</strong>
              </p>
            </div>
          )}

          <div className="filter-section">
            <label>Category</label>
            {categories.map((cat, idx) => (
              <div key={idx}>
                <input
                  type="checkbox"
                  value={cat}
                  checked={selectedCategories.includes(cat)}
                  onChange={() =>
                    toggleSelection(
                      selectedCategories,
                      setSelectedCategories,
                      cat
                    )
                  }
                />
                <span>{cat}</span>
              </div>
            ))}
          </div>

          {/* // Inside Products.js (only brand filter section updated for brevity) */}

          <div
            className="filter-section brand-filter"
            ref={(ref) => (window.brandDropdownRef = ref)}
          >
            <div
              className="brand-header"
              onClick={() => setShowBrandFilter((prev) => !prev)}
            >
              <label>BRAND</label>
              <span
                className={`brand-toggle-icon ${
                  showBrandFilter ? "rotate" : ""
                }`}
              >
                ▾
              </span>
            </div>

            {showBrandFilter && (
              <div className="brand-dropdown">
                <input
                  type="text"
                  placeholder="Search Brand"
                  value={brandSearch}
                  onChange={(e) => {
                    setBrandSearch(e.target.value);
                    setBrandDropdownOpen(true); // Show all matching results as user types
                  }}
                  className="brand-search-input"
                />
                <div className="brand-checkboxes">
                  {(brandSearch
                    ? brands.filter((b) =>
                        b.toLowerCase().includes(brandSearch.toLowerCase())
                      )
                    : brands
                  )
                    .slice(0, brandDropdownOpen ? brands.length : 6)
                    .map((brand, idx) => (
                      <label key={idx} className="brand-checkbox-item">
                        <input
                          type="checkbox"
                          value={brand}
                          checked={selectedBrands.includes(brand)}
                          onChange={() =>
                            toggleSelection(
                              selectedBrands,
                              setSelectedBrands,
                              brand
                            )
                          }
                        />
                        {brand}
                      </label>
                    ))}
                </div>

                {brands.filter((b) =>
                  b.toLowerCase().includes(brandSearch.toLowerCase())
                ).length > 6 &&
                  !brandDropdownOpen && (
                    <span
                      className="brand-show-more"
                      onClick={() => setBrandDropdownOpen(true)}
                    >
                      {brands.length - 6} MORE
                    </span>
                  )}
              </div>
            )}
          </div>

          <div className="filter-section">
            <label>Rating</label>
            {[4, 3, 2, 1].map((r) => (
              <div key={r}>
                <input
                  type="checkbox"
                  value={r}
                  checked={selectedRatings.includes(r)}
                  onChange={() =>
                    toggleSelection(selectedRatings, setSelectedRatings, r)
                  }
                />
                <span>{r} stars & above</span>
              </div>
            ))}
          </div>

          <div className="filter-section">
            <label>Availability</label>
            <div>
              <input
                type="checkbox"
                value="in"
                checked={selectedAvailability.includes("in")}
                onChange={() =>
                  toggleSelection(
                    selectedAvailability,
                    setSelectedAvailability,
                    "in"
                  )
                }
              />
              <span>In Stock</span>
            </div>
            <div>
              <input
                type="checkbox"
                value="out"
                checked={selectedAvailability.includes("out")}
                onChange={() =>
                  toggleSelection(
                    selectedAvailability,
                    setSelectedAvailability,
                    "out"
                  )
                }
              />
              <span>Out of Stock</span>
            </div>
          </div>

          <div className="filter-section">
            <label>Price (Up to ₹{price})</label>
            <input
              type="range"
              min="0"
              max="100000"
              step="1000"
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value))}
            />
          </div>

          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear All Filters
          </button>
        </div>
      )}

      {/* Sort Modal */}
      {showSortModal && (
        <div className="sort-modal" onClick={() => setShowSortModal(false)}>
          <div
            className="sort-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sort-modal-header">
              <h3>SORT BY</h3>
              <button
                className="sort-modal-close"
                onClick={() => setShowSortModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="sort-options">
              <label className="sort-option">
                <input
                  type="radio"
                  name="sort"
                  value="relevance"
                  checked={sortBy === "relevance"}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setShowSortModal(false);
                  }}
                />
                <span>Relevance</span>
              </label>
              <label className="sort-option">
                <input
                  type="radio"
                  name="sort"
                  value="popularity"
                  checked={sortBy === "popularity"}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setShowSortModal(false);
                  }}
                />
                <span>Popularity</span>
              </label>
              <label className="sort-option">
                <input
                  type="radio"
                  name="sort"
                  value="price-low-high"
                  checked={sortBy === "price-low-high"}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setShowSortModal(false);
                  }}
                />
                <span>Price -- Low to High</span>
              </label>
              <label className="sort-option">
                <input
                  type="radio"
                  name="sort"
                  value="price-high-low"
                  checked={sortBy === "price-high-low"}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setShowSortModal(false);
                  }}
                />
                <span>Price -- High to Low</span>
              </label>
              <label className="sort-option">
                <input
                  type="radio"
                  name="sort"
                  value="newest"
                  checked={sortBy === "newest"}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setShowSortModal(false);
                  }}
                />
                <span>Newest First</span>
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="products-main">
        {/* Mobile Filter and Sort Buttons */}
        <div className="mobile-action-buttons">
          <button
            className="mobile-sort-btn"
            onClick={() => setShowSortModal(true)}
          >
            <span>↕</span> Sort
          </button>
          <button
            className="mobile-filter-btn"
            onClick={() => setShowMobileFilters(true)}
          >
            <span>🔍</span> Filters
          </button>
        </div>

        <div className="products-header">
          <h2 className="products-title">{getFormattedCategory()}</h2>
          <p className="products-subtitle">{getCategorySubtitle()}</p>
        </div>

        {viewImage && (
          <div className="modal" onClick={closeModal}>
            <img src={viewImage} alt="View Product" className="modal-image" />
          </div>
        )}

        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <p className="no-products">No products found.</p>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div
                  className="wishlist-btn"
                  onClick={() => toggleWishlist(product)}
                >
                  {isWishlisted(product.id) ? "❤️" : "🤍"}
                </div>
                <img
                  src={`http://localhost:8000${product.image}`}
                  alt={product.name}
                  className="product-image"
                  onClick={() =>
                    setViewImage(`http://localhost:8000${product.image}`)
                  }
                />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="description">{product.description}</p>
                  <p className="product-rating">
                    {product.rating.toFixed(1)} {renderStars(product.rating)}
                  </p>
                  <p className="price">
                    <span className="price-label">Price:</span> ₹{" "}
                    {product.price}
                  </p>
                  <div className="button-group">
                    {getQuantity(product.id) === 0 ? (
                      <div className="add-buy-row">
                        <button
                          className="add-to-cart-btn"
                          onClick={() => addToCart(product)}
                        >
                          Add to Cart
                        </button>
                        <button
                          className="buy-now-btn"
                          onClick={() => handleBuyNow(product)}
                        >
                          Buy Now
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="quantity-controls">
                          <button
                            onClick={() => updateQuantity(product.id, -1)}
                          >
                            -
                          </button>
                          <span>{getQuantity(product.id)}</span>
                          <button onClick={() => updateQuantity(product.id, 1)}>
                            +
                          </button>
                        </div>
                        <div className="add-buy-row">
                          <button
                            className="buy-now-btn"
                            onClick={() => handleBuyNow(product)}
                          >
                            Buy Now
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
