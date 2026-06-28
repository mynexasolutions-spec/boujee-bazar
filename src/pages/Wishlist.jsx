import { Link } from 'react-router-dom'
import { useWishlist } from '../context/WishlistContext'
import { useCart } from '../context/CartContext'
import { toast } from 'react-hot-toast'

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()

  const handleMoveToCart = (item) => {
    const sizes = Array.isArray(item.sizes) ? item.sizes : (item.sizes ? String(item.sizes).split(',').map(s => s.trim()) : ['Free Size'])
    addToCart(item, sizes[0] || 'Free Size', null, true)
    removeFromWishlist(item.id)
    toast.success(`${item.name} moved to cart!`)
  }

  return (
    <main>
      <div className="ul-container">
        <div className="ul-breadcrumb">
          <h2 className="ul-breadcrumb-title">Wishlist</h2>
          <div className="ul-breadcrumb-nav">
            <Link to="/"><i className="flaticon-home"></i> Home</Link>
            <i className="flaticon-arrow-point-to-right"></i>
            <span className="current-page">Wishlist</span>
          </div>
        </div>
      </div>

      <div className="ul-container">
        <div className="ul-inner-container" style={{ paddingBottom: '60px' }}>
          {wishlistItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <i className="flaticon-heart" style={{ fontSize: '64px', color: '#ddd', display: 'block', marginBottom: '16px' }}></i>
              <h3 style={{ marginBottom: '8px' }}>Your wishlist is empty</h3>
              <p style={{ color: '#888', marginBottom: '24px' }}>Save items you love to your wishlist</p>
              <Link to="/shop" className="ul-btn">Start Shopping <i className="flaticon-up-right-arrow"></i></Link>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h3 style={{ fontWeight: 800 }}>My Wishlist ({wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'})</h3>
              </div>
              <div className="row ul-bs-row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-2">
                {wishlistItems.map(item => {
                  const discount = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : null
                  return (
                    <div key={item.id} className="col">
                      <div className="ul-product" style={{ position: 'relative' }}>
                        <div className="ul-product-heading">
                          <span className="ul-product-price">₹{item.price}</span>
                          {discount > 0 && <span className="ul-product-discount-tag">{discount}% Off</span>}
                        </div>
                        <div className="ul-product-img">
                          <img src={item.image} alt={item.name} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover' }} />
                          <div className="ul-product-actions">
                            <button onClick={() => handleMoveToCart(item)}><i className="flaticon-shopping-bag"></i></button>
                            <Link to={`/product/${item.id}`}><i className="flaticon-eye"></i></Link>
                          </div>
                        </div>
                        <div className="ul-product-txt">
                          <h4 className="ul-product-title"><Link to={`/product/${item.id}`}>{item.name}</Link></h4>
                          <h5 className="ul-product-category">{item.category}</h5>
                        </div>
                        <button onClick={() => removeFromWishlist(item.id)}
                          style={{ position: 'absolute', top: '40px', right: '8px', background: '#fff', border: '1px solid #eee', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e74c3c', fontSize: '14px', zIndex: 2 }}>
                          ×
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
