import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getProducts, getApprovedReviews, insertReview } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  const [product, setProduct] = useState(null)
  const [related, setRelated] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [qty, setQty] = useState(1)
  const [reviewRating, setReviewRating] = useState(0)
  const [reviewHover, setReviewHover] = useState(0)
  const [reviewName, setReviewName] = useState('')
  const [reviewEmail, setReviewEmail] = useState('')
  const [reviewText, setReviewText] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  const inWish = product ? isInWishlist(product.id) : false

  useEffect(() => {
    setLoading(true)
    Promise.all([getProducts(), getApprovedReviews()])
      .then(([prods, revs]) => {
        const found = prods?.find(p => String(p.id) === String(id))
        if (!found) { setLoading(false); return }
        setProduct(found)
        setRelated((prods || []).filter(p => p.category === found.category && p.id !== found.id).slice(0, 4))
        setReviews((revs || []).filter(r => String(r.product_id) === String(id)))
        const sizes = Array.isArray(found.sizes) ? found.sizes.filter(Boolean) : (found.sizes ? String(found.sizes).split(',').map(s => s.trim()).filter(Boolean) : [])
        setSelectedSize(sizes[0] || '')
        const colors = Array.isArray(found.colors) ? found.colors.filter(Boolean) : (found.colors ? String(found.colors).split(',').map(c => c.trim()).filter(Boolean) : [])
        setSelectedColor(colors[0] || '')
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (loading) return
    const t = setTimeout(() => window.dispatchEvent(new Event('bb:page-ready')), 100)
    return () => clearTimeout(t)
  }, [loading])

  const handleAddToCart = () => {
    if (!product) return
    const size = selectedSize || 'Free Size'
    const color = selectedColor || 'Standard'
    for (let i = 0; i < qty; i++) addToCart({ ...product }, size, color, i > 0)
    toast.success(`${product.name} added to cart!`)
  }

  const handleBuyNow = () => { handleAddToCart(); navigate('/checkout') }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!reviewRating) { toast.error('Please select a star rating'); return }
    if (!reviewName.trim()) { toast.error('Please enter your name'); return }
    if (!reviewText.trim()) { toast.error('Please write a review'); return }
    setSubmittingReview(true)
    try {
      await insertReview({ product_id: product.id, customer_name: reviewName.trim(), email: reviewEmail.trim(), rating: reviewRating, review: reviewText.trim() })
      toast.success('Review submitted! It will appear after approval.')
      setReviewName(''); setReviewEmail(''); setReviewText(''); setReviewRating(0)
    } catch (err) {
      toast.error('Failed to submit review. Please try again.')
    } finally {
      setSubmittingReview(false)
    }
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '120px 0', color: '#999' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid #eee', borderTopColor: '#222', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }}></div>
      Loading...
    </div>
  )

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '120px 0' }}>
      <h2>Product not found</h2>
      <Link to="/shop" className="ul-btn" style={{ marginTop: '20px', display: 'inline-block' }}>Back to Shop</Link>
    </div>
  )

  const images = product.images && Array.isArray(product.images) && product.images.length > 0 ? product.images : [product.image].filter(Boolean)
  const sizes = Array.isArray(product.sizes) ? product.sizes.filter(Boolean) : (product.sizes ? String(product.sizes).split(',').map(s => s.trim()).filter(Boolean) : [])
  const colors = Array.isArray(product.colors) ? product.colors.filter(Boolean) : (product.colors ? String(product.colors).split(',').map(c => c.trim()).filter(Boolean) : [])
  const discount = product.originalPrice && product.price ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : null
  const avgRating = reviews.length > 0 ? Math.round(reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length) : null

  const COLOR_MAP = { gold: '#c8961e', silver: '#aaa', 'rose gold': '#b76e79', black: '#111', white: '#f5f5f5', blue: '#3b82f6', red: '#ef4444', green: '#22c55e', brown: '#92400e', pink: '#ec4899', purple: '#a855f7' }
  function colorStyle(c) {
    const key = c.replace(/\s*\(#[0-9a-fA-F]+\)/g, '').trim().toLowerCase()
    const hex = c.match(/#([0-9a-fA-F]{3,6})/)
    if (hex) return { background: `#${hex[1]}` }
    return { background: COLOR_MAP[key] || '#ccc' }
  }

  return (
    <>
      {/* BREADCRUMB */}
      <div className="ul-container">
        <div className="ul-breadcrumb">
          <h2 className="ul-breadcrumb-title">Shop Details</h2>
          <div className="ul-breadcrumb-nav">
            <Link to="/"><i className="flaticon-home"></i> Home</Link>
            <i className="flaticon-arrow-point-to-right"></i>
            <Link to="/shop">Shop</Link>
            <i className="flaticon-arrow-point-to-right"></i>
            <span className="current-page">Shop Details</span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="ul-inner-page-container">
        <div className="ul-product-details">

          {/* TOP: image + info */}
          <div className="ul-product-details-top">
            <div className="row ul-bs-row row-cols-lg-2 row-cols-1 align-items-center">

              {/* IMAGE SLIDER */}
              <div className="col">
                <div className="ul-product-details-img">
                  <div className="ul-product-details-img-slider swiper">
                    <div className="swiper-wrapper">
                      {images.map((img, i) => (
                        <div key={i} className="swiper-slide">
                          <img src={img} alt={product.name} />
                        </div>
                      ))}
                      {images.length === 1 && (
                        <div className="swiper-slide"><img src={images[0]} alt={product.name} /></div>
                      )}
                    </div>
                    <div className="ul-product-details-img-slider-nav" id="ul-product-details-img-slider-nav">
                      <button className="prev"><i className="flaticon-left-arrow"></i></button>
                      <button className="next"><i className="flaticon-arrow-point-to-right"></i></button>
                    </div>
                  </div>
                </div>
              </div>

              {/* PRODUCT INFO */}
              <div className="col">
                <div className="ul-product-details-txt">
                  <div className="ul-product-details-rating">
                    <span className="rating">
                      {[1,2,3,4,5].map(i => <i key={i} className={avgRating && i <= avgRating ? 'flaticon-star' : 'flaticon-star-3'}></i>)}
                    </span>
                    <span className="review-number">({reviews.length} Customer Review{reviews.length !== 1 ? 's' : ''})</span>
                  </div>

                  <span className="ul-product-details-price">
                    {String.fromCharCode(0x20B9)}{product.price}
                    {product.originalPrice && <del style={{ fontSize: '16px', marginLeft: '12px', color: '#999', fontWeight: 400 }}>{String.fromCharCode(0x20B9)}{product.originalPrice}</del>}
                    {discount > 0 && <span className="ul-product-discount-tag" style={{ marginLeft: '10px', fontSize: '13px' }}>{discount}% Off</span>}
                  </span>

                  <h3 className="ul-product-details-title">{product.name}</h3>

                  {product.description && <p className="ul-product-details-descr">{product.description}</p>}

                  <div className="ul-product-details-options">
                    {sizes.length > 0 && (
                      <div className="ul-product-details-option ul-product-details-sizes">
                        <span className="title">Size</span>
                        <form className="variants">
                          {sizes.map((s, i) => (
                            <label key={s} htmlFor={`pd-size-${i}`}>
                              <input type="radio" name="product-size" id={`pd-size-${i}`} checked={selectedSize === s} onChange={() => setSelectedSize(s)} hidden />
                              <span className="size-btn">{s}</span>
                            </label>
                          ))}
                        </form>
                      </div>
                    )}

                    {colors.length > 0 && (
                      <div className="ul-product-details-option ul-product-details-colors">
                        <span className="title">Color</span>
                        <form className="variants">
                          {colors.map((c, i) => (
                            <label key={c} htmlFor={`pd-color-${i}`} title={c.replace(/\s*\(#[0-9a-fA-F]+\)/g, '').trim()}>
                              <input type="radio" name="product-color" id={`pd-color-${i}`} checked={selectedColor === c} onChange={() => setSelectedColor(c)} hidden />
                              <span className="color-btn" style={colorStyle(c)}></span>
                            </label>
                          ))}
                        </form>
                      </div>
                    )}

                    <div className="ul-product-details-option ul-product-details-quantity">
                      <span className="title">Quantity</span>
                      <form className="ul-product-quantity-wrapper">
                        <input type="number" className="ul-product-quantity" value={qty} min="1" readOnly />
                        <div className="btns">
                          <button type="button" className="quantityIncreaseButton" onClick={() => setQty(q => q + 1)}><i className="flaticon-plus"></i></button>
                          <button type="button" className="quantityDecreaseButton" onClick={() => setQty(q => Math.max(1, q - 1))}><i className="flaticon-minus-sign"></i></button>
                        </div>
                      </form>
                    </div>
                  </div>

                  <div className="ul-product-details-actions">
                    <div className="left">
                      <button className="add-to-cart" onClick={handleAddToCart}>
                        Add to Cart <span className="icon"><i className="flaticon-cart"></i></span>
                      </button>
                      <button className="add-to-wishlist" onClick={() => inWish ? removeFromWishlist(product.id) : addToWishlist(product)} style={inWish ? { color: '#e74c3c' } : {}}>
                        <span className="icon"><i className="flaticon-heart"></i></span> {inWish ? 'In Wishlist' : 'Add to wishlist'}
                      </button>
                    </div>
                    <div className="share-options">
                      <button onClick={handleBuyNow} style={{ background: '#c8961e', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM: description + reviews */}
          <div className="ul-product-details-bottom">
            <div className="ul-product-details-long-descr-wrapper">
              <h3 className="ul-product-details-inner-title">Item Description</h3>
              <p>{product.description || 'No description available for this product.'}</p>
              {product.long_details && <><br /><p>{product.long_details}</p></>}
              <br />
              <p>
                <strong>Brand:</strong> {product.brand || 'Boujee Bazar'}&nbsp;&nbsp;
                <strong>Category:</strong> {product.category}&nbsp;&nbsp;
                {product.material && <><strong>Material:</strong> {product.material}&nbsp;&nbsp;</>}
                <strong>SKU:</strong> {product.sku || product.id}
              </p>
            </div>

            <div className="ul-product-details-reviews">
              <h3 className="ul-product-details-inner-title">{String(reviews.length).padStart(2, '0')} Reviews</h3>
              {reviews.length === 0 ? (
                <p style={{ color: '#999', marginBottom: '24px' }}>No reviews yet. Be the first to review this product!</p>
              ) : reviews.map((r, i) => (
                <div key={r.id || i} className="ul-product-details-review">
                  <div className="ul-product-details-review-reviewer-img">
                    <img src={`/assets/img/reviews/review-author-${(i % 4) + 1}.png`} alt="Reviewer" />
                  </div>
                  <div className="ul-product-details-review-txt">
                    <div className="header">
                      <div className="left">
                        <h4 className="reviewer-name">{r.customer_name || r.name || 'Anonymous'}</h4>
                        <h5 className="review-date">{r.created_at ? new Date(r.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</h5>
                      </div>
                      <div className="right">
                        <div className="rating">
                          {[1,2,3,4,5].map(star => <i key={star} className={star <= (r.rating || 0) ? 'flaticon-star' : 'flaticon-star-3'}></i>)}
                        </div>
                      </div>
                    </div>
                    <p>{r.review}</p>
                    <button className="ul-product-details-review-reply-btn">Reply</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="ul-product-details-review-form-wrapper">
              <h3 className="ul-product-details-inner-title">Write A Review</h3>
              <span className="note">Your email address will not be published.</span>

              <form className="ul-product-details-review-form" onSubmit={handleReviewSubmit}>
                <div className="form-group rating-field-wrapper">
                  <span className="title">Rate this product? *</span>
                  <div className="rating-field">
                    {[1,2,3,4,5].map(star => (
                      <button key={star} type="button" onClick={() => setReviewRating(star)} onMouseEnter={() => setReviewHover(star)} onMouseLeave={() => setReviewHover(0)}>
                        <i className={(reviewHover || reviewRating) >= star ? 'flaticon-star' : 'flaticon-star-3'}></i>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="row row-cols-2 row-cols-xxs-1 ul-bs-row">
                  <div className="form-group">
                    <input type="text" name="review-name" placeholder="Your Name" value={reviewName} onChange={e => setReviewName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <input type="email" name="review-email" placeholder="Your Email" value={reviewEmail} onChange={e => setReviewEmail(e.target.value)} />
                  </div>
                  <div className="form-group col-12">
                    <textarea name="review-message" placeholder="Your Review" value={reviewText} onChange={e => setReviewText(e.target.value)} required></textarea>
                  </div>
                </div>
                <div className="form-group">
                  <button type="submit" disabled={submittingReview}>
                    {submittingReview ? 'Posting...' : 'Post Review'} <span><i className="flaticon-up-right-arrow"></i></span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <div className="ul-inner-page-container" style={{ paddingTop: 0 }}>
          <div style={{ marginBottom: '32px' }}>
            <span className="ul-section-sub-title">You may also like</span>
            <h2 className="ul-section-title">Related Products</h2>
          </div>
          <div className="row ul-bs-row row-cols-lg-4 row-cols-sm-2 row-cols-2">
            {related.map(p => {
              const relDiscount = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : null
              return (
                <div key={p.id} className="col">
                  <div className="ul-product">
                    <div className="ul-product-heading">
                      <span className="ul-product-price">{String.fromCharCode(0x20B9)}{p.price}</span>
                      {relDiscount > 0 && <span className="ul-product-discount-tag">{relDiscount}% Off</span>}
                    </div>
                    <div className="ul-product-img">
                      <img src={p.image} alt={p.name} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover' }} />
                      <div className="ul-product-actions">
                        <button onClick={() => { addToCart(p, 'Free Size', 'Standard', true); toast.success('Added to cart!') }}><i className="flaticon-shopping-bag"></i></button>
                        <Link to={`/product/${p.id}`}><i className="flaticon-eye"></i></Link>
                        <button onClick={() => addToWishlist(p)}><i className="flaticon-heart"></i></button>
                      </div>
                    </div>
                    <div className="ul-product-txt">
                      <h4 className="ul-product-title"><Link to={`/product/${p.id}`}>{p.name}</Link></h4>
                      <h5 className="ul-product-category">{p.category}</h5>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}
