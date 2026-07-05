import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'
import { insertOrder, getCoupons, getStoreSettings } from '../lib/supabase'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, cartTotal, clearCart } = useCart()
  const { user } = useAuth()

  const [form, setForm] = useState({ name: '', email: user?.email || '', phone: '', address: '', city: '', state: '', pincode: '' })
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [coupons, setCoupons] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(false)
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    Promise.all([getCoupons(), getStoreSettings()]).then(([c, s]) => {
      setCoupons(c || [])
      setSettings(s)
    })
  }, [])

  useEffect(() => {
    if (user?.email) setForm(f => ({ ...f, email: user.email }))
  }, [user])

  const shippingFee = settings?.shipping_fee != null ? settings.shipping_fee : (cartTotal >= 999 ? 0 : 99)
  const discount = appliedCoupon ? (appliedCoupon.discount_type === 'percent' ? Math.round(cartTotal * appliedCoupon.discount_value / 100) : appliedCoupon.discount_value) : 0
  const grandTotal = cartTotal + shippingFee - discount

  const applyCoupon = () => {
    const c = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase() && c.active)
    if (!c) { toast.error('Invalid or expired coupon'); return }
    if (c.min_order && cartTotal < c.min_order) { toast.error(`Minimum order ₹${c.min_order} required`); return }
    setAppliedCoupon(c)
    toast.success(`Coupon "${c.code}" applied! You saved ₹${c.discount_type === 'percent' ? Math.round(cartTotal * c.discount_value / 100) : c.discount_value}`)
  }

  const handleInput = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handlePlaceOrder = async () => {
    const { name, email, phone, address, city, state, pincode } = form
    if (!name || !email || !phone || !address || !city || !state || !pincode) {
      toast.error('Please fill in all delivery details')
      return
    }
    if (items.length === 0) { toast.error('Your cart is empty'); return }

    setPlacing(true)
    try {
      const orderData = {
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        shipping_address: `${address}, ${city}, ${state} - ${pincode}`,
        items: items.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, size: i.size, color: i.color, image: i.image })),
        subtotal: cartTotal,
        shipping_fee: shippingFee,
        discount,
        coupon_code: appliedCoupon?.code || null,
        total: grandTotal,
        payment_method: 'COD',
        payment_status: 'Pending',
        status: 'Pending',
        user_id: user?.id || null
      }
      await insertOrder(orderData)
      clearCart()
      toast.success('Order placed successfully! We will confirm shortly.')
      navigate('/', { replace: true })
    } catch (e) {
      console.error(e)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setPlacing(false)
    }
  }

  if (items.length === 0) return (
    <main>
      <div className="ul-container">
        <div style={{ textAlign: 'center', padding: '120px 0' }}>
          <i className="flaticon-shopping-bag" style={{ fontSize: '64px', color: '#ddd', display: 'block', marginBottom: '16px' }}></i>
          <h3 style={{ marginBottom: '16px' }}>Your cart is empty</h3>
          <Link to="/shop" className="ul-btn">Shop Now <i className="flaticon-up-right-arrow"></i></Link>
        </div>
      </div>
    </main>
  )

  return (
    <main>
      <div className="ul-container">
        <div className="ul-breadcrumb">
          <h2 className="ul-breadcrumb-title">Checkout</h2>
          <div className="ul-breadcrumb-nav">
            <Link to="/"><i className="flaticon-home"></i> Home</Link>
            <i className="flaticon-arrow-point-to-right"></i>
            <span className="current-page">Checkout</span>
          </div>
        </div>
      </div>

      <div className="ul-container">
        <div className="ul-inner-container" style={{ paddingBottom: '60px' }}>
          <div className="row ul-bs-row">
            {/* DELIVERY FORM */}
            <div className="col-lg-7 col-md-7">
              <h3 style={{ fontWeight: 800, marginBottom: '24px' }}>Delivery Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[['name','Full Name','text'],['email','Email Address','email'],['phone','Phone Number','tel'],['address','Street Address','text'],['city','City','text'],['state','State','text'],['pincode','PIN Code','text']].map(([field, label, type]) => (
                  <div key={field} style={{ gridColumn: field === 'address' ? '1/-1' : undefined }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</label>
                    <input name={field} type={type} value={form[field]} onChange={handleInput} placeholder={label}
                      style={{ width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div style={{ marginTop: '32px' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '12px' }}>Coupon Code</h4>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <input value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="Enter coupon code"
                    style={{ flex: 1, padding: '12px 16px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
                  <button onClick={applyCoupon} className="ul-btn">Apply</button>
                </div>
                {appliedCoupon && (
                  <div style={{ marginTop: '8px', color: '#27ae60', fontSize: '13px', fontWeight: 700 }}>
                    ✓ Coupon "{appliedCoupon.code}" applied — saved ₹{discount}
                    <button onClick={() => { setAppliedCoupon(null); setCouponCode('') }} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', marginLeft: '8px' }}>Remove</button>
                  </div>
                )}
              </div>

              {/* Payment */}
              <div style={{ marginTop: '32px' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '12px' }}>Payment Method</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '2px solid #222', borderRadius: '8px', background: '#f8f5f0' }}>
                  <i className="flaticon-delivery-truck" style={{ fontSize: '24px' }}></i>
                  <div>
                    <div style={{ fontWeight: 700 }}>Cash on Delivery (COD)</div>
                    <div style={{ fontSize: '12px', color: '#888', marginTop: '2px' }}>Pay when your order arrives</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="col-lg-5 col-md-5">
              <div style={{ background: '#f8f5f0', borderRadius: '16px', padding: '28px', position: 'sticky', top: '100px' }}>
                <h3 style={{ fontWeight: 800, marginBottom: '24px' }}>Order Summary</h3>

                <div style={{ maxHeight: '320px', overflowY: 'auto', marginBottom: '20px' }}>
                  {items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'center' }}>
                      <img src={item.image} alt={item.name} style={{ width: '60px', height: '75px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '13px', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</div>
                        <div style={{ fontSize: '11px', color: '#888' }}>{item.size}{item.color && item.color !== 'Standard' ? ` · ${item.color}` : ''}</div>
                        <div style={{ fontSize: '13px', marginTop: '4px' }}>₹{item.price} × {item.qty}</div>
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '14px', flexShrink: 0 }}>₹{item.price * item.qty}</div>
                    </div>
                  ))}
                </div>

                <div style={{ borderTop: '1px solid #ddd', paddingTop: '16px' }}>
                  {[['Subtotal', `₹${cartTotal}`], ['Shipping', shippingFee === 0 ? 'FREE' : `₹${shippingFee}`], discount > 0 && ['Discount', `-₹${discount}`]].filter(Boolean).map(([label, value]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px' }}>
                      <span style={{ color: '#666' }}>{label}</span>
                      <span style={{ color: label === 'Discount' ? '#27ae60' : '#222', fontWeight: label === 'Discount' ? 700 : 400 }}>{value}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #222', paddingTop: '16px', marginTop: '8px' }}>
                    <span style={{ fontSize: '18px', fontWeight: 800 }}>Total</span>
                    <span style={{ fontSize: '22px', fontWeight: 800 }}>₹{grandTotal}</span>
                  </div>
                </div>

                <button onClick={handlePlaceOrder} disabled={placing}
                  style={{ width: '100%', marginTop: '24px', padding: '16px', background: '#222', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 800, fontSize: '16px', cursor: placing ? 'not-allowed' : 'pointer', opacity: placing ? 0.7 : 1 }}>
                  {placing ? 'Placing Order...' : 'Place Order (COD)'}
                </button>

                <p style={{ textAlign: 'center', fontSize: '12px', color: '#888', marginTop: '12px' }}>
                  <i className="flaticon-padlock"></i> Secure checkout · No payment info stored
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
