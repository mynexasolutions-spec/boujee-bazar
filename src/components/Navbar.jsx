import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useWishlist } from '../context/WishlistContext'
import { X, Trash2, Minus, Plus, Lock } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { getStoreSettings } from '../lib/supabase'

export default function Navbar() {
  const navigate = useNavigate()
  const { items, removeFromCart, updateQty, cartCount, cartTotal, cartOpen, setCartOpen } = useCart()
  const { user, isAdmin, signOut } = useAuth()
  const { wishlistCount } = useWishlist()
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [dbSettings, setDbSettings] = useState({ shipping_threshold: 1499, shipping_flat_rate: 99 })
  const sidebarRef = useRef(null)

  useEffect(() => {
    const q = searchParams.get('search') || ''
    setSearchQuery(q)
  }, [searchParams])

  useEffect(() => {
    getStoreSettings().then(s => { if (s) setDbSettings(s) }).catch(() => {})
  }, [])

  // All global init (sticky, sidebar, Splide, Swiper) is handled
  // by the inline script in index.html via the bb:page-ready event.
  // Nothing needed here.

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut()
      toast.success('Logged out successfully!')
      navigate('/')
    } catch (err) {
      toast.error('Logout failed: ' + err.message)
    }
  }

  return (
    <>
      {/* SIDEBAR */}
      <div className="ul-sidebar d-lg-none" ref={sidebarRef}>
        <div className="ul-sidebar-header">
          <div className="ul-sidebar-header-logo">
            <Link to="/"><img src="/boujee-bazaar-logo.png" alt="Boujee Bazar" className="logo" style={{ height: '50px', width: 'auto' }} /></Link>
          </div>
          <button className="ul-sidebar-closer"><i className="flaticon-close"></i></button>
        </div>
        <div className="ul-sidebar-header-nav-wrapper d-block d-lg-none">
          <nav style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Link to="/" style={{ fontWeight: 700, color: '#222', textDecoration: 'none' }}>Home</Link>
            <Link to="/shop" style={{ fontWeight: 700, color: '#222', textDecoration: 'none' }}>Shop</Link>
            <Link to="/about" style={{ fontWeight: 700, color: '#222', textDecoration: 'none' }}>About Us</Link>
            <Link to="/contact" style={{ fontWeight: 700, color: '#222', textDecoration: 'none' }}>Contact Us</Link>
            <Link to="/wishlist" style={{ fontWeight: 700, color: '#222', textDecoration: 'none' }}>Wishlist {wishlistCount > 0 ? `(${wishlistCount})` : ''}</Link>
            {user ? (
              <>
                <Link to="/my-orders" style={{ fontWeight: 700, color: '#222', textDecoration: 'none' }}>My Orders</Link>
                {isAdmin && <Link to="/admin" style={{ fontWeight: 700, color: '#c8961e', textDecoration: 'none' }}>Admin Panel</Link>}
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', fontWeight: 700, color: '#c0392b', cursor: 'pointer', textAlign: 'left', padding: 0 }}>Logout</button>
              </>
            ) : (
              <Link to="/auth" style={{ fontWeight: 700, color: '#222', textDecoration: 'none' }}>Login / Register</Link>
            )}
          </nav>
        </div>
        <div className="ul-sidebar-footer">
          <span className="ul-sidebar-footer-title">Follow us</span>
          <div className="ul-sidebar-footer-social">
            <a href="#"><i className="flaticon-facebook-app-symbol"></i></a>
            <a href="#"><i className="flaticon-instagram"></i></a>
            <a href="#"><i className="flaticon-youtube"></i></a>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="ul-header">
        <div className="ul-header-top">
          <div className="ul-header-top-slider splide" id="header-top-splide">
            <div className="splide__track">
              <ul className="splide__list">
                {['Free shipping on orders above ₹1499', 'New arrivals every week', 'Premium quality guaranteed', 'Easy returns & exchanges', 'Secure payments'].map((msg, i) => (
                  <li key={i} className="splide__slide">
                    <p className="ul-header-top-slider-item"><i className="flaticon-sparkle"></i> {msg}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="ul-header-bottom">
          <div className="ul-container">
            <div className="ul-header-bottom-wrapper">
              <div className="header-bottom-left">
                <div className="logo-container">
                  <Link to="/" className="d-inline-block" style={{ background: '#fff', borderRadius: '10px', padding: '4px 12px', display: 'inline-flex', alignItems: 'center' }}>
                    <img src="/boujee-bazaar-logo.png" alt="Boujee Bazar" className="logo" style={{ height: '46px', width: 'auto' }} />
                  </Link>
                </div>
              </div>

              <div className="ul-header-nav-wrapper">
                <div className="to-go-to-sidebar-in-mobile">
                  <nav className="ul-header-nav">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/about">About Us</NavLink>
                    <div className="has-sub-menu has-mega-menu">
                      <NavLink to="/shop" style={{ cursor: 'pointer' }}>Shop <i className="flaticon-down"></i></NavLink>
                      <div className="ul-header-submenu ul-header-megamenu">
                        <div className="single-col">
                          <span className="single-col-title">📿 Jewelry</span>
                          <ul>
                            <li><Link to="/shop?category=Necklaces">Necklaces &amp; Pendants</Link></li>
                            <li><Link to="/shop?category=Earrings">Earrings</Link></li>
                            <li><Link to="/shop?category=Rings">Rings</Link></li>
                            <li><Link to="/shop?category=Bracelets">Bracelets &amp; Bangles</Link></li>
                            <li><Link to="/shop?category=Anklets">Anklets</Link></li>
                          </ul>
                        </div>
                        <div className="single-col">
                          <span className="single-col-title">⌚ Watches</span>
                          <ul><li><Link to="/shop?category=Watches">All Watches</Link></li></ul>
                        </div>
                        <div className="single-col">
                          <span className="single-col-title">✨ Accessories</span>
                          <ul>
                            <li><Link to="/shop?category=Accessories">Hair Accessories</Link></li>
                            <li><Link to="/shop?category=Lifestyle">Lifestyle &amp; Accessories</Link></li>
                          </ul>
                        </div>
                        <div className="single-col">
                          <span className="single-col-title">🔥 Highlights</span>
                          <ul>
                            <li><Link to="/shop?tag=New">New Arrivals</Link></li>
                            <li><Link to="/shop?tag=Best Seller">Best Sellers</Link></li>
                            <li><Link to="/shop?tag=Sale">Sale</Link></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <NavLink to="/contact">Contact Us</NavLink>
                  </nav>
                </div>
              </div>

              <div className="ul-header-search-form-wrapper flex-grow-1 flex-shrink-0">
                <form onSubmit={handleSearchSubmit} className="ul-header-search-form">
                  <div className="ul-header-search-form-right">
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search Here"
                    />
                    <button type="submit">
                      <span className="icon"><i className="flaticon-search-interface-symbol"></i></span>
                    </button>
                  </div>
                </form>
                <button className="ul-header-mobile-search-closer d-xxl-none"><i className="flaticon-close"></i></button>
              </div>

              <div className="ul-header-actions">
                <button className="ul-header-mobile-search-opener d-xxl-none">
                  <i className="flaticon-search-interface-symbol"></i>
                </button>
                {user ? (
                  <div className="d-flex align-items-center gap-2">
                    {isAdmin && <Link to="/admin" title="Admin Panel"><i className="flaticon-settings"></i></Link>}
                    <Link to="/my-orders" title="My Orders"><i className="flaticon-user"></i></Link>
                    <button onClick={handleLogout} title="Logout" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                      <i className="flaticon-logout"></i>
                    </button>
                  </div>
                ) : (
                  <Link to="/auth" title="Login"><i className="flaticon-user"></i></Link>
                )}
                <Link to="/wishlist" title="Wishlist" style={{ position: 'relative' }}>
                  <i className="flaticon-heart"></i>
                  {wishlistCount > 0 && (
                    <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#c8961e', color: '#fff', borderRadius: '50%', fontSize: '10px', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{wishlistCount}</span>
                  )}
                </Link>
                <button onClick={() => setCartOpen(true)} title="Cart" style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
                  <i className="flaticon-shopping-bag"></i>
                  {cartCount > 0 && (
                    <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#c8961e', color: '#fff', borderRadius: '50%', fontSize: '10px', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{cartCount}</span>
                  )}
                </button>
              </div>

              <div className="d-inline-flex d-lg-none">
                <button className="ul-header-sidebar-opener"><i className="flaticon-hamburger"></i></button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* CART DRAWER */}
      <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${cartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
        <div onClick={() => setCartOpen(false)} className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)' }} />
        <div className={`absolute top-0 right-0 bottom-0 w-full flex flex-col transition-transform duration-300 transform ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ maxWidth: '420px', background: '#fff', borderLeft: '1px solid #e5e5e5', boxShadow: '-4px 0 30px rgba(0,0,0,0.12)' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e5e5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '15px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Your Cart ({cartCount})</span>
            <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}><X size={20} /></button>
          </div>

          <div style={{ flexGrow: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {items.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', padding: '40px 0' }}>
                <i className="flaticon-shopping-bag" style={{ fontSize: '48px', color: '#ccc', marginBottom: '16px' }}></i>
                <p style={{ fontWeight: 700, marginBottom: '16px' }}>Your cart is empty</p>
                <Link to="/shop" onClick={() => setCartOpen(false)} className="ul-btn">Shop Now</Link>
              </div>
            ) : items.map(item => (
              <div key={`${item.id}-${item.size}-${item.color}`} style={{ display: 'flex', gap: '12px', padding: '12px', border: '1px solid #f0f0f0', borderRadius: '12px' }}>
                <Link to={`/product/${item.id}`} onClick={() => setCartOpen(false)} style={{ flexShrink: 0 }}>
                  <img src={item.image} alt={item.name} style={{ width: '64px', height: '80px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #eee' }} />
                </Link>
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0 }}>{item.name}</h4>
                      <span style={{ fontSize: '14px', fontWeight: 800, whiteSpace: 'nowrap' }}>₹{item.price * item.qty}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '10px', background: '#222', color: '#fff', padding: '2px 8px', borderRadius: '20px', fontWeight: 700 }}>Size: {item.size}</span>
                      {item.color && <span style={{ fontSize: '10px', background: '#f0f0f0', color: '#222', padding: '2px 8px', borderRadius: '20px', fontWeight: 700 }}>Color: {item.color}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid #e5e5e5', borderRadius: '8px', padding: '2px 8px' }}>
                      <button onClick={() => updateQty(item.id, item.size, item.color, item.qty - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}><Minus size={12} /></button>
                      <span style={{ fontSize: '13px', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.size, item.color, item.qty + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}><Plus size={12} /></button>
                    </div>
                    <button onClick={() => removeFromCart(item.id, item.size, item.color)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', padding: '4px' }}><Trash2 size={16} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {items.length > 0 && (
            <div style={{ padding: '20px 24px', borderTop: '1px solid #e5e5e5' }}>
              {cartTotal >= dbSettings.shipping_threshold ? (
                <p style={{ fontSize: '12px', color: '#27ae60', fontWeight: 700, marginBottom: '12px', textAlign: 'center' }}>🎉 You qualify for FREE shipping!</p>
              ) : (
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '12px', textAlign: 'center' }}>
                  Add <strong>₹{dbSettings.shipping_threshold - cartTotal}</strong> more for free shipping
                </p>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontWeight: 800 }}>
                <span>Total</span>
                <span>₹{cartTotal}</span>
              </div>
              <Link
                to="/checkout"
                onClick={(e) => {
                  setCartOpen(false)
                  if (!user) {
                    e.preventDefault()
                    toast.error('Please login to checkout')
                    navigate('/auth?redirect=/checkout')
                  }
                }}
                className="ul-btn"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', textAlign: 'center' }}
              >
                <Lock size={14} /> Secure Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
