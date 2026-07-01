import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { toast } from 'react-hot-toast'

const COLOR_MAP = {
  gold: '#c8961e', silver: '#aaa', 'rose gold': '#b76e79',
  black: '#111', white: '#f5f5f5', blue: '#3b82f6',
  red: '#ef4444', green: '#22c55e', brown: '#92400e',
  pink: '#ec4899', purple: '#a855f7'
}

function colorStyle(c) {
  const key = c.replace(/\s*\(\#[0-9a-fA-F]+\)/g, '').trim().toLowerCase()
  const hex = c.match(/#([0-9a-fA-F]{3,6})/)
  if (hex) return { background: `#${hex[1]}` }
  return { background: COLOR_MAP[key] || '#ccc' }
}

export default function QuickViewModal({ product, isOpen, onClose }) {
  const { addToCart } = useCart()
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [qty, setQty] = useState(1)

  useEffect(() => {
    if (product) {
      const sizes = Array.isArray(product.sizes) ? product.sizes.filter(Boolean) : (product.sizes ? String(product.sizes).split(',').map(s => s.trim()).filter(Boolean) : [])
      const colors = Array.isArray(product.colors) ? product.colors.filter(Boolean) : (product.colors ? String(product.colors).split(',').map(c => c.trim()).filter(Boolean) : [])
      setSelectedSize(sizes[0] || '')
      setSelectedColor(colors[0] || '')
      setQty(1)
    }
  }, [product])

  if (!isOpen || !product) return null

  const handleBackdropClick = (e) => {
    if (e.target.classList.contains('quick-view-backdrop')) {
      onClose()
    }
  }

  const handleAddToCart = () => {
    const size = selectedSize || 'Free Size'
    const color = selectedColor || 'Standard'
    for (let i = 0; i < qty; i++) addToCart({ ...product }, size, color, i > 0)
    toast.success(`${product.name} added to cart!`)
    onClose()
  }

  const sizes = Array.isArray(product.sizes) ? product.sizes.filter(Boolean) : (product.sizes ? String(product.sizes).split(',').map(s => s.trim()).filter(Boolean) : [])
  const colors = Array.isArray(product.colors) ? product.colors.filter(Boolean) : (product.colors ? String(product.colors).split(',').map(c => c.trim()).filter(Boolean) : [])

  // 174.99 -> format to actual price
  // The design has image on left, info on right, qty and add to cart at bottom.

  const displayImage = (selectedColor && product.color_images && product.color_images[selectedColor]) || product.image

  return (
    <div className="quick-view-backdrop" onClick={handleBackdropClick}>
      <div className="quick-view-modal">
        <button className="quick-view-close" onClick={onClose}>
          <i className="flaticon-close"></i>
        </button>
        <div className="row ul-bs-row">
          <div className="col-md-6 quick-view-img-col">
            <img src={displayImage} alt={product.name} className="quick-view-main-img" />
          </div>
          <div className="col-md-6 quick-view-info-col">
            <h5 className="quick-view-brand">{product.brand || product.category}</h5>
            <h2 className="quick-view-title">{product.name}</h2>
            <div className="quick-view-price-row">
              <span className="quick-view-price">₹{product.price}</span>
              {product.originalPrice > product.price && (
                <span className="quick-view-original-price">₹{product.originalPrice}</span>
              )}
            </div>

            <div className="quick-view-desc">
              <p>{product.description || 'No description available for this product.'}</p>
            </div>

            {colors.length > 0 && (
              <div className="quick-view-section">
                <h6>Color : </h6>
                <div className="quick-view-options colors">
                  {colors.map(c => (
                    <button
                      key={c}
                      className={`color-btn ${selectedColor === c ? 'active' : ''}`}
                      style={colorStyle(c)}
                      title={c.replace(/\s*\(\#[0-9a-fA-F]+\)/g, '').trim()}
                      onClick={() => setSelectedColor(c)}
                    ></button>
                  ))}
                </div>
              </div>
            )}

            {sizes.length > 0 && (
              <div className="quick-view-section">
                <h6>Size : </h6>
                <div className="quick-view-options sizes">
                  {sizes.map(s => (
                    <button
                      key={s}
                      className={`size-btn ${selectedSize === s ? 'active' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="quick-view-action-row">
              <div className="quick-view-qty">
                <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                <span>{qty}</span>
                <button onClick={() => setQty(qty + 1)}>+</button>
              </div>
              <button className="ul-btn quick-view-add-cart" onClick={handleAddToCart}>
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
