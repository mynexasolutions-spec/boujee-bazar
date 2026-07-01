import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getProducts, getCategories } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { toast } from 'react-hot-toast'
import { RiseLoader } from 'react-spinners'
import QuickViewModal from '../components/QuickViewModal'

const PER_PAGE = 12

function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const inWish = isInWishlist(product.id)
  const discount = product.originalPrice && product.price

  const handleAddToCart = () => {
    const sizes = Array.isArray(product.sizes) ? product.sizes : (product.sizes ? String(product.sizes).split(',').map(s => s.trim()) : ['Free Size'])
    addToCart(product, sizes[0] || 'Free Size', null, true)
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <div className="ul-product">
      <div className="ul-product-heading">
        <span className="ul-product-price">&#8377;{product.price}</span>
        {discount > 0 && <span className="ul-product-discount-tag">{discount}% Off</span>}
      </div>
      <div className="ul-product-img">
        <Link to={`/product/${product.id}`} style={{ display: 'block' }}>
          <img src={product.image} alt={product.name} />
        </Link>
        <div className="ul-product-actions">
          <button onClick={handleAddToCart}><i className="flaticon-shopping-bag"></i></button>
          <button onClick={() => product.onQuickView(product)}><i className="flaticon-hide"></i></button>
          <button onClick={() => inWish ? removeFromWishlist(product.id) : addToWishlist(product)} style={inWish ? { color: '#e74c3c' } : {}}>
            <i className="flaticon-heart"></i>
          </button>
        </div>
      </div>
      <div className="ul-product-txt">
        <h4 className="ul-product-title"><Link to={`/product/${product.id}`}>{product.name}</Link></h4>
        <h5 className="ul-product-category"><Link to={`/shop?category=${product.category}`}>{product.category}</Link></h5>
      </div>
    </div>
  )
}

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [priceFilter, setPriceFilter] = useState([0, 10000])
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState(10000)
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '')
  const [colorFilter, setColorFilter] = useState('')
  const [sizeFilter, setSizeFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isFiltering, setIsFiltering] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)

  const categoryFilter = searchParams.get('category') || ''
  const tagFilter = searchParams.get('tag') || ''
  const searchFilter = searchParams.get('search') || ''

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([prods, cats]) => {
        setProducts(prods || [])
        setCategories(cats || [])
        if (prods && prods.length > 0) {
          const prices = prods.map(p => p.price).filter(Boolean)
          const mn = Math.min(...prices)
          const mx = Math.max(...prices)
          setMinPrice(mn); setMaxPrice(mx); setPriceFilter([mn, mx])
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { setCurrentPage(1) }, [categoryFilter, tagFilter, searchFilter, colorFilter, sizeFilter])

  useEffect(() => {
    // Skip if still loading initial data
    if (loading) return
    setIsFiltering(true)
    const timer = setTimeout(() => setIsFiltering(false), 400)
    return () => clearTimeout(timer)
  }, [categoryFilter, tagFilter, searchFilter, colorFilter, sizeFilter, priceFilter, loading])

  useEffect(() => {
    if (loading || !window.noUiSlider) return
    const slider = document.getElementById('ul-products-price-filter-slider')
    if (!slider || slider.noUiSlider) return
    try {
      const safeMax = maxPrice > minPrice ? maxPrice : minPrice + 1
      window.noUiSlider.create(slider, { start: [minPrice, safeMax], connect: true, range: { min: minPrice, max: safeMax } })
      slider.noUiSlider.on('update', (values) => {
        const lo = Math.round(values[0]); const hi = Math.round(values[1])
        setPriceFilter([lo, hi])
        const minEl = document.querySelector('.filtered-price.decreasing')
        const maxEl = document.querySelector('.filtered-price.increasing')
        if (minEl) minEl.textContent = '₹' + lo
        if (maxEl) maxEl.textContent = '₹' + hi
      })
    } catch(e) {
      console.error("Error creating slider:", e)
    }
  }, [loading, minPrice, maxPrice])

  const parseList = (val) => Array.isArray(val) ? val : (val ? String(val).split(',').map(x => x.trim()) : [])

  const allColors = [...new Set(products.flatMap(p =>
    parseList(p.colors).map(x => x.replace(/\s*\(#[0-9a-fA-F]+\)/g, '').trim()).filter(Boolean)
  ))].slice(0, 7)

  const allSizes = [...new Set(products.flatMap(p =>
    parseList(p.sizes).filter(Boolean)
  ))].slice(0, 6)

  const filteredProducts = products.filter(p => {
    if (categoryFilter && p.category !== categoryFilter) return false
    if (tagFilter && p.tag !== tagFilter) return false
    if (searchFilter && !p.name.toLowerCase().includes(searchFilter.toLowerCase())) return false
    if (p.price < priceFilter[0] || p.price > priceFilter[1]) return false
    if (colorFilter) {
      const pc = parseList(p.colors).map(c => c.replace(/\s*\(#[0-9a-fA-F]+\)/g, '').trim().toLowerCase())
      if (!pc.includes(colorFilter.toLowerCase())) return false
    }
    if (sizeFilter) {
      const ps = parseList(p.sizes).map(s => s.trim())
      if (!ps.includes(sizeFilter)) return false
    }
    return true
  })

  const totalPages = Math.ceil(filteredProducts.length / PER_PAGE)
  const pagedProducts = filteredProducts.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const setCategory = (name) => {
    const p = new URLSearchParams(searchParams)
    if (name) p.set('category', name); else p.delete('category')
    setSearchParams(p)
  }
  const setTag = (tag) => {
    const p = new URLSearchParams(searchParams)
    if (tag) p.set('tag', tag); else p.delete('tag')
    setSearchParams(p)
  }
  const clearAll = () => { setSearchParams({}); setSearchInput(''); setColorFilter(''); setSizeFilter('') }
  const handleSearch = (e) => {
    e.preventDefault()
    const p = new URLSearchParams(searchParams)
    if (searchInput.trim()) p.set('search', searchInput.trim()); else p.delete('search')
    setSearchParams(p)
  }

  const CATS = ['Necklaces', 'Earrings', 'Rings', 'Bracelets', 'Anklets', 'Watches', 'Accessories', 'Stationery']
  const catList = categories.length > 0 ? categories.map(c => c.name) : CATS
  const hasFilter = categoryFilter || tagFilter || searchFilter || colorFilter || sizeFilter

  return (
    <>
      <QuickViewModal 
        product={quickViewProduct} 
        isOpen={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />
      {/* BREADCRUMB */}
      <div className="ul-container">
        <div className="ul-breadcrumb">
          <h2 className="ul-breadcrumb-title">Shop Page</h2>
          <div className="ul-breadcrumb-nav">
            <Link to="/"><i className="flaticon-home"></i> Home</Link>
            <i className="flaticon-arrow-point-to-right"></i>
            <span className="current-page">Shop</span>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="ul-inner-page-container shop-full-width">
        <div className="ul-inner-products-wrapper">
          <div className="row ul-bs-row flex-column-reverse flex-md-row">

            {/* ── SIDEBAR ── */}
            <div className="col-lg-3 col-md-4">
              <div className="ul-products-sidebar">

                {/* Search */}
                <div className="ul-products-sidebar-widget ul-products-search">
                  <form onSubmit={handleSearch} className="ul-products-search-form">
                    <input type="text" id="ul-products-search-field" placeholder="Search Items"
                      value={searchInput} onChange={e => setSearchInput(e.target.value)} />
                    <button type="submit"><i className="flaticon-search-interface-symbol"></i></button>
                  </form>
                </div>

                {/* Price Filter */}
                <div className="ul-products-sidebar-widget ul-products-price-filter">
                  <h3 className="ul-products-sidebar-widget-title">Filter by price</h3>
                  <form className="ul-products-price-filter-form">
                    <div id="ul-products-price-filter-slider"></div>
                    <div className="ul-prices">
                      <div className="price-min">
                        <span className="price-label">Min:</span>
                        <span className="filtered-price decreasing">&#8377;{priceFilter[0]}</span>
                      </div>
                      <div className="price-max">
                        <span className="price-label">Max:</span>
                        <span className="filtered-price increasing">&#8377;{priceFilter[1]}</span>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Categories */}
                <div className="ul-products-sidebar-widget ul-products-categories">
                  <h3 className="ul-products-sidebar-widget-title">Categories</h3>
                  <div className="ul-products-categories-link">
                    <a href="#" onClick={e => { e.preventDefault(); setCategory('') }}
                      style={!categoryFilter ? { fontWeight: 700 } : {}}>
                      <span><i className="flaticon-arrow-point-to-right"></i> All Categories</span>
                    </a>
                    {catList.map(name => (
                      <a key={name} href="#" onClick={e => { e.preventDefault(); setCategory(name) }}
                        style={categoryFilter === name ? { fontWeight: 700 } : {}}>
                        <span><i className="flaticon-arrow-point-to-right"></i> {name}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Color Filter */}
                {allColors.length > 0 && (
                  <div className="ul-products-sidebar-widget ul-products-color-filter">
                    <h3 className="ul-products-sidebar-widget-title">Filter By Color</h3>
                    <div className="ul-products-color-filter-colors">
                      {allColors.map(color => {
                        const cnt = products.filter(p =>
                          parseList(p.colors).map(c => c.replace(/\s*\(#[0-9a-fA-F]+\)/g, '').trim().toLowerCase()).includes(color.toLowerCase())
                        ).length
                        const cls = color.toLowerCase().replace(/\s+/g, '-')
                        return (
                          <a key={color} href="#" className={cls + (colorFilter === color ? ' active' : '')}
                            onClick={e => { e.preventDefault(); setColorFilter(colorFilter === color ? '' : color) }}
                            style={colorFilter === color ? { fontWeight: 700 } : {}}>
                            <span className="left"><span className="color-prview"></span> {color}</span>
                            <span>{cnt}</span>
                          </a>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Product Status */}
                <div className="ul-products-sidebar-widget">
                  <h3 className="ul-products-sidebar-widget-title">Product Status</h3>
                  <div className="ul-products-categories-link">
                    {[['', 'In stock'], ['Sale', 'On Sale'], ['New', 'New Arrivals'], ['Best Seller', 'Best Sellers']].map(([val, label]) => (
                      <a key={label} href="#" onClick={e => { e.preventDefault(); setTag(val) }}
                        style={tagFilter === val ? { fontWeight: 700 } : {}}>
                        <span><i className="flaticon-arrow-point-to-right"></i> {label}</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Size Filter */}
                {allSizes.length > 0 && (
                  <div className="ul-products-sidebar-widget">
                    <h3 className="ul-products-sidebar-widget-title">Filter By Sizes</h3>
                    <div className="ul-products-color-filter-colors">
                      {allSizes.map(size => {
                        const cnt = products.filter(p => parseList(p.sizes).map(s => s.trim()).includes(size)).length
                        return (
                          <a key={size} href="#" onClick={e => { e.preventDefault(); setSizeFilter(sizeFilter === size ? '' : size) }}
                            style={sizeFilter === size ? { fontWeight: 700 } : {}}>
                            <span className="left">{size}</span>
                            <span>{cnt}</span>
                          </a>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Review Stars */}
                <div className="ul-products-sidebar-widget ul-products-rating-filter">
                  <h3 className="ul-products-sidebar-widget-title">Review Star</h3>
                  <div className="ul-products-rating-filter-ratings">
                    {[5, 4, 3, 2, 1].map(stars => (
                      <div key={stars} className="single-rating-wrapper">
                        <label htmlFor={`review-${stars}-star`} style={{ cursor: 'pointer' }}>
                          <span className="left">
                            <input type="checkbox" id={`review-${stars}-star`} hidden readOnly />
                            <span className="stars">
                              {Array.from({ length: stars }).map((_, i) => (
                                <span key={i}><i className="flaticon-star"></i></span>
                              ))}
                            </span>
                          </span>
                          <span className="right">{stars === 5 ? '5 Only' : `${stars} & up`}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* ── PRODUCTS GRID ── */}
            <div className="col-lg-9 col-md-8">

              {/* Active filter tags */}
              {hasFilter && (
                <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                  {categoryFilter && (
                    <span className="ul-product-discount-tag" style={{ cursor: 'pointer' }} onClick={() => setCategory('')}>
                      {categoryFilter} &times;
                    </span>
                  )}
                  {tagFilter && (
                    <span className="ul-product-discount-tag" style={{ cursor: 'pointer' }} onClick={() => setTag('')}>
                      {tagFilter} &times;
                    </span>
                  )}
                  {searchFilter && (
                    <span className="ul-product-discount-tag" style={{ cursor: 'pointer' }} onClick={() => {
                      const p = new URLSearchParams(searchParams); p.delete('search'); setSearchInput(''); setSearchParams(p)
                    }}>
                      Search: {searchFilter} &times;
                    </span>
                  )}
                  {colorFilter && (
                    <span className="ul-product-discount-tag" style={{ cursor: 'pointer' }} onClick={() => setColorFilter('')}>
                      {colorFilter} &times;
                    </span>
                  )}
                  {sizeFilter && (
                    <span className="ul-product-discount-tag" style={{ cursor: 'pointer' }} onClick={() => setSizeFilter('')}>
                      Size: {sizeFilter} &times;
                    </span>
                  )}
                  <button onClick={clearAll} className="ul-btn" style={{ padding: '4px 14px', fontSize: '12px' }}>Clear All</button>
                </div>
              )}

              {loading ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: '#999' }}>
                  <RiseLoader color="#D9974B" cssOverride={{ display: 'block', margin: '0 auto 16px' }} />
                  Loading products...
                </div>
              ) : isFiltering ? (
                <div style={{ textAlign: 'center', padding: '80px 0', color: '#999' }}>
                  <RiseLoader color="#D9974B" cssOverride={{ display: 'block', margin: '0 auto 16px' }} />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                  <p style={{ fontSize: '16px', color: '#666', marginBottom: '16px' }}>No products found.</p>
                  <button onClick={clearAll} className="ul-btn">Clear Filters</button>
                </div>
              ) : (
                <>
                  <div className="row ul-bs-row row-cols-lg-3 row-cols-2">
                    {pagedProducts.map(p => (
                      <div key={p.id} className="col">
                        <ProductCard product={{ ...p, onQuickView: setQuickViewProduct }} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="pagination-wrapper">
                      <button 
                        className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`} 
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        title="First Page"
                      >
                        <i className="flaticon-left-arrow" style={{marginRight: '-4px'}}></i>
                        <i className="flaticon-left-arrow"></i>
                      </button>
                      <button 
                        className={`page-btn ${currentPage === 1 ? 'disabled' : ''}`} 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        title="Previous Page"
                      >
                        <i className="flaticon-left-arrow"></i>
                      </button>

                      {(() => {
                        const pages = [];
                        const maxPagesToShow = 5;
                        
                        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
                        let endPage = startPage + maxPagesToShow - 1;

                        if (endPage > totalPages) {
                          endPage = totalPages;
                          startPage = Math.max(1, endPage - maxPagesToShow + 1);
                        }

                        if (startPage > 1) {
                          pages.push(<button key={1} className="page-btn" onClick={() => setCurrentPage(1)}>1</button>);
                          if (startPage > 2) {
                            pages.push(<span key="ellipsis-start" className="page-ellipsis">...</span>);
                          }
                        }

                        for (let i = startPage; i <= endPage; i++) {
                          pages.push(
                            <button 
                              key={i} 
                              className={`page-btn ${currentPage === i ? 'active' : ''}`}
                              onClick={() => setCurrentPage(i)}
                            >
                              {i}
                            </button>
                          );
                        }

                        if (endPage < totalPages) {
                          if (endPage < totalPages - 1) {
                            pages.push(<span key="ellipsis-end" className="page-ellipsis">...</span>);
                          }
                          pages.push(<button key={totalPages} className="page-btn" onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>);
                        }

                        return pages;
                      })()}

                      <button 
                        className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`} 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        title="Next Page"
                      >
                        <i className="flaticon-arrow-point-to-right"></i>
                      </button>
                      <button 
                        className={`page-btn ${currentPage === totalPages ? 'disabled' : ''}`} 
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        title="Last Page"
                      >
                        <i className="flaticon-arrow-point-to-right" style={{marginRight: '-4px'}}></i>
                        <i className="flaticon-arrow-point-to-right"></i>
                      </button>
                      
                      <div className="page-selector-container">
                        <span>Go to:</span>
                        <form className="page-input-form" onSubmit={(e) => {
                          e.preventDefault();
                          const val = parseInt(e.currentTarget.elements.pageInput.value, 10);
                          if (!isNaN(val) && val >= 1 && val <= totalPages) {
                            setCurrentPage(val);
                            e.currentTarget.elements.pageInput.value = '';
                          }
                        }}>
                          <input 
                            type="number" 
                            name="pageInput"
                            min="1" 
                            max={totalPages} 
                            className="page-input" 
                            placeholder={`e.g. ${totalPages}`}
                          />
                          <button type="submit" className="page-go-btn">Go</button>
                        </form>
                      </div>
                    </div>
                  )}

                  <p style={{ marginTop: '16px', color: '#888', fontSize: '13px' }}>
                    Showing {(currentPage - 1) * PER_PAGE + 1}&#8211;{Math.min(currentPage * PER_PAGE, filteredProducts.length)} of {filteredProducts.length} products
                  </p>
                </>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
