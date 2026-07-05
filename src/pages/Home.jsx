import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getCategories, getApprovedReviews, getHomepageConfig } from '../lib/supabase'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { toast } from 'react-hot-toast'
import QuickViewModal from '../components/QuickViewModal'

// ── Product card (vertical layout — used in New Arrivals + Flash Sale) ──────────
function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const inWish = isInWishlist(product.id)
  const discount = product.originalPrice && product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const handleAddToCart = () => {
    const sizes = Array.isArray(product.sizes)
      ? product.sizes
      : (product.sizes ? String(product.sizes).split(',').map(s => s.trim()) : ['Free Size'])
    addToCart(product, sizes[0] || 'Free Size', null, true)
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <div className="ul-product">
      <div className="ul-product-heading">
        <span className="ul-product-price">₹{product.price}</span>
        {discount > 0 && <span className="ul-product-discount-tag">{discount}% Off</span>}
      </div>
      <div className="ul-product-img">
        <Link to={`/product/${product.id}`} style={{ display: 'block' }}>
          <img src={product.image} alt={product.name} />
        </Link>
        <div className="ul-product-actions">
          <button onClick={handleAddToCart}><i className="flaticon-shopping-bag"></i></button>
          <button onClick={() => product.onQuickView(product)}><i className="flaticon-hide"></i></button>
          <button
            onClick={() => inWish ? removeFromWishlist(product.id) : addToWishlist(product)}
            style={{ color: inWish ? '#e74c3c' : '' }}
          ><i className="flaticon-heart"></i></button>
        </div>
      </div>
      <div className="ul-product-txt">
        <h4 className="ul-product-title"><Link to={`/product/${product.id}`}>{product.name}</Link></h4>
        <h5 className="ul-product-category"><Link to={`/shop?category=${product.category}`}>{product.category}</Link></h5>
      </div>
    </div>
  )
}

// ── Horizontal product card (used in Most Selling section) ───────────────────────
function ProductCardHorizontal({ product }) {
  const navigate = useNavigate ? undefined : undefined
  return (
    <div className="ul-product-horizontal">
      <div className="ul-product-horizontal-img">
        <div>
          <img src={product.image} alt={product.name} />
        </div>
      </div>
      <div className="ul-product-horizontal-txt">
        <span className="ul-product-price">₹{product.price}</span>
        <h4 className="ul-product-title"><Link to={`/product/${product.id}`}>{product.name}</Link></h4>
        <h5 className="ul-product-category"><Link to={`/shop?category=${product.category}`}>{product.category}</Link></h5>
        <div className="ul-product-rating">
          {[1,2,3,4,5].map(i => (
            <span key={i} className="star"><i className="flaticon-star"></i></span>
          ))}
        </div>
      </div>
    </div>
  )
}

import { useNavigate } from 'react-router-dom'

// Static category data matching the HTML exactly
const CATEGORIES = [
  { name: 'Necklaces & Pendants', image: '/assets/img/category/category-1.png', slug: 'Necklaces' },
  { name: 'Earrings',             image: '/assets/img/category/category-2.png', slug: 'Earrings'  },
  { name: 'Rings',                image: '/assets/img/category/category-3.png', slug: 'Rings'     },
  { name: 'Bracelets & Bangles',  image: '/assets/img/category/category-4.png', slug: 'Bracelets' },
  { name: 'Hand Chains',          image: '/assets/img/category/category-5.png', slug: 'Bracelets' },
  { name: 'Anklets',              image: '/assets/img/category/category-6.png', slug: 'Anklets'   },
  { name: 'Watches',              image: '/assets/img/category/category-7.png', slug: 'Watches'   },
  { name: 'Accessories',          image: '/assets/img/category/category-8.png', slug: 'Accessories'},
  { name: 'Stationery',           image: '/assets/img/category/category-9.png', slug: 'Stationery'},
]

// Static reviews matching the HTML
const STATIC_REVIEWS = [
  { id: 1, name: 'Esther Howard',    role: 'Web Designer',            rating: 4, image: '/assets/img/reviews/review-author-1.png', review: 'Absolutely love my new necklace! The quality is amazing and it arrived so fast. Will definitely shop again.' },
  { id: 2, name: 'Wade Warren',      role: 'Marketing Coordinator',   rating: 4, image: '/assets/img/reviews/review-author-2.png', review: 'The earrings are gorgeous! Exactly as pictured. Great packaging and super quick delivery.' },
  { id: 3, name: 'Priya Mehta',      role: 'Nursing Assistant',       rating: 5, image: '/assets/img/reviews/review-author-3.png', review: 'I ordered the bracelet set and I am obsessed! The quality is premium. 10/10 recommend Boujee Bazar.' },
  { id: 4, name: 'John Doe',         role: 'Medical Assistant',       rating: 4, image: '/assets/img/reviews/review-author-4.png', review: 'Got a ring for my girlfriend and she loved it! Perfect fit and beautiful packaging.' },
  { id: 5, name: 'Leslie Alexander', role: 'Fashion Blogger',         rating: 5, image: '/assets/img/reviews/review-author-2.png', review: 'The Boujee Bazar collection is truly stunning. I get compliments every time I wear my anklet!' },
]

const FAQ_ITEMS = [
  { q: 'How do I place an order on Boujee Bazar?', a: 'Simply browse our collections, add items to your cart, and proceed to checkout. We accept Cash on Delivery across India.' },
  { q: 'Do you have restock notifications?',       a: 'Yes! Sign up for our newsletter or contact us at support@boujeebazar.in to be notified when a sold-out item is restocked.' },
  { q: 'How do I care for my jewellery?',          a: 'Keep jewellery away from water, perfumes, and harsh chemicals. Store in the provided pouch when not in use. Clean gently with a soft cloth.' },
  { q: 'How do I know what size ring to order?',   a: 'Most of our rings are adjustable. For fixed-size rings, we provide a size guide on the product page. You can also contact us for help.' },
  { q: 'What is your return/exchange policy?',     a: 'We offer easy 7-day returns for unused items in original packaging. Contact us at support@boujeebazar.in or +91 7980781793.' },
  { q: 'How long does delivery take?',             a: 'Standard delivery takes 5-7 business days. Express options may be available at checkout depending on your location.' },
]

export default function Home() {
  const [products, setProducts]     = useState([])
  const [reviews, setReviews]       = useState([])
  const [homepageConfig, setHomepageConfig] = useState(null)
  const [loading, setLoading]       = useState(true)
  const [sellFilter, setSellFilter] = useState('all')
  const [faqOpen, setFaqOpen]       = useState(null)
  const [countdown, setCountdown]   = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' })
  const [email, setEmail]           = useState('')
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const heroInitRef                 = useRef(false)

  // Load data
  useEffect(() => {
    Promise.all([getProducts(), getApprovedReviews(), getHomepageConfig()])
      .then(([prods, revs, config]) => {
        setProducts(prods || [])
        setReviews(revs?.length ? revs : STATIC_REVIEWS)
        setHomepageConfig(config || null)
      })
      .catch(() => setReviews(STATIC_REVIEWS))
      .finally(() => setLoading(false))
  }, [])

  // Flash sale countdown — target 3 days from now
  useEffect(() => {
    const target = new Date()
    target.setDate(target.getDate() + 3)
    target.setHours(23, 59, 59, 0)

    const tick = () => {
      const diff = target - Date.now()
      if (diff <= 0) return
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCountdown({
        days: String(d).padStart(2,'0'),
        hours: String(h).padStart(2,'0'),
        minutes: String(m).padStart(2,'0'),
        seconds: String(s).padStart(2,'0')
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  // Trigger global re-init after products render
  useEffect(() => {
    if (loading) return
    // Dispatch page-ready so index.html inline script reinitializes all swipers
    const t = setTimeout(() => {
      window.dispatchEvent(new Event('bb:page-ready'))
    }, 150)
    return () => clearTimeout(t)
  }, [loading])

  // Hero animation (ported from inline script in index.html)
  useEffect(() => {
    if (loading || heroInitRef.current) return
    heroInitRef.current = true

    const heroEl  = document.getElementById('hero')
    const ringEl  = document.getElementById('ring')
    const flowEl  = document.getElementById('flowTrack')
    const dotsEl  = document.getElementById('phaseDots')
    if (!heroEl || !ringEl || !flowEl || !dotsEl) return

    const defaultHeroProducts = [
      { image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80', label: 'Layered Necklace' },
      { image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=600&q=80', label: 'Crystal Earrings' },
      { image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=600&q=80', label: 'Stackable Rings' },
      { image: 'https://images.unsplash.com/photo-1573408301185-9519f94815f0?auto=format&fit=crop&w=600&q=80', label: 'Charm Bracelet' },
      { image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80', label: 'Pearl Studs' },
      { image: 'https://images.unsplash.com/photo-1631982690223-8aa4cf87b7f5?auto=format&fit=crop&w=600&q=80', label: 'Gold Bangle' },
    ]
    const heroProducts = (homepageConfig?.hero_cards?.length > 0)
      ? homepageConfig.hero_cards
      : ((homepageConfig?.hero_images?.length > 0)
        ? homepageConfig.hero_images.map((img, idx) => ({ image: typeof img === 'string' ? img : img.image, label: typeof img === 'string' ? `Collection #${idx + 1}` : img.label }))
        : defaultHeroProducts)

    const bannerConfig = {
      title: 'The Boujee <span>Bazar</span>',
      buttonText: 'Shop Collection',
      backgroundImage: homepageConfig?.hero_bg_banner || 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80'
    }
    const timing = { perProductFocus: 1000, rotationTotal: 4200, flowTravel: 3400 }

    const COUNT = heroProducts.length
    const STEP  = 360 / COUNT
    const fallbackGradients = [
      'linear-gradient(160deg,#e7ddd0,#cdbfa9)',
      'linear-gradient(160deg,#e3d9d4,#c8b3a8)',
      'linear-gradient(160deg,#ddd6cb,#bdae97)',
      'linear-gradient(160deg,#e1d8cf,#c4b39e)',
      'linear-gradient(160deg,#e6ded2,#cabfa6)',
      'linear-gradient(160deg,#ddd4cf,#c0aea3)',
    ]

    function cardInner(p, i) {
      return `<img src="${p.image}" alt="${p.label}" loading="eager"
                onerror="this.style.display='none';this.parentElement.style.background='${fallbackGradients[i % fallbackGradients.length]}';">
              <div class="tag">${p.label}</div>`
    }

    const flowInnerEl = document.createElement('div')
    flowInnerEl.className = 'flow-inner'
    flowEl.appendChild(flowInnerEl)

    heroProducts.forEach((p, i) => {
      const card = document.createElement('div')
      card.className = 'ring-card'
      card.style.setProperty('--rot', `${i * STEP}deg`)
      card.innerHTML = cardInner(p, i)
      ringEl.appendChild(card)

      const fcard = document.createElement('div')
      fcard.className = 'flow-card'
      fcard.innerHTML = cardInner(p, i)
      flowInnerEl.appendChild(fcard)

      const dot = document.createElement('span')
      dot.className = 'phase-dot'
      dotsEl.appendChild(dot)
    })

    // Duplicate for seamless loop
    heroProducts.forEach((p, i) => {
      const fcard = document.createElement('div')
      fcard.className = 'flow-card'
      fcard.setAttribute('aria-hidden', 'true')
      fcard.innerHTML = cardInner(p, i)
      flowInnerEl.appendChild(fcard)
    })

    const ringCards = Array.from(ringEl.querySelectorAll('.ring-card'))
    const dotEls    = Array.from(dotsEl.querySelectorAll('.phase-dot'))

    function updateRingVisuals(globalAngle) {
      ringCards.forEach((card, i) => {
        let eff = (i * STEP + globalAngle) % 360
        if (eff > 180) eff -= 360
        if (eff < -180) eff += 360
        const abs = Math.abs(eff)
        let scale, opacity, z, brightness
        if (abs < STEP / 2) {
          scale = 1.0; opacity = 1; z = 10; brightness = 1
          card.classList.add('is-front')
        } else if (abs < 180 - STEP) {
          const t = (abs - STEP/2) / (180 - STEP - STEP/2)
          scale = 0.8 - 0.2 * t; opacity = 0.65 - 0.45 * t
          z = Math.round(8 - t * 6); brightness = 0.9 - 0.2 * t
          card.classList.remove('is-front')
        } else {
          scale = 0.6; opacity = 0.2; z = 1; brightness = 0.7
          card.classList.remove('is-front')
        }
        card.style.setProperty('--scale', scale.toFixed(3))
        card.style.setProperty('--opacity', opacity.toFixed(3))
        card.style.setProperty('--z', z)
        card.style.setProperty('--brightness', brightness.toFixed(3))
      })
    }

    let angle = 0
    let rotateTimer = null

    function focusProduct(index) {
      angle = -index * STEP
      ringEl.style.setProperty('--angle', `${angle}deg`)
      updateRingVisuals(angle)
      dotEls.forEach((d, i) => d.classList.toggle('is-active', i === index))
    }

    function startRotation() {
      focusProduct(0)
      let step = 1
      rotateTimer = setInterval(() => {
        if (step >= COUNT) { clearInterval(rotateTimer); return }
        focusProduct(step % COUNT)
        step++
      }, timing.perProductFocus)
    }

    const MARQUEE_SPEED = 88
    let marqueeX = 0
    let marqueeRunning = false
    let marqueeLast = null
    let singleSetWidth = 0

    function computeSetWidth() {
      const cards = flowInnerEl.querySelectorAll('.flow-card')
      if (cards.length >= 2) {
        const r0 = cards[0].getBoundingClientRect()
        const r1 = cards[1].getBoundingClientRect()
        singleSetWidth = Math.abs(r1.left - r0.left) * COUNT
      }
    }

    function marqueeStep(ts) {
      if (!marqueeRunning) return
      if (marqueeLast === null) marqueeLast = ts
      const dt = (ts - marqueeLast) / 1000
      marqueeLast = ts
      marqueeX -= MARQUEE_SPEED * dt
      if (singleSetWidth && marqueeX <= -singleSetWidth) marqueeX += singleSetWidth
      flowInnerEl.style.transform = `translateX(${marqueeX}px)`
      requestAnimationFrame(marqueeStep)
    }

    function startMarquee() {
      computeSetWidth()
      marqueeRunning = true
      requestAnimationFrame(marqueeStep)
    }

    function startFlow() {
      clearInterval(rotateTimer)
      heroEl.classList.add('is-flowing')
      startMarquee()
      setTimeout(startBanner, timing.flowTravel)
    }

    function startBanner() {
      heroEl.classList.add('is-banner')
      const nav = document.querySelector('.ul-header')
      if (nav) nav.classList.add('is-revealed')
      setTimeout(() => {
        computeSetWidth()
        if (singleSetWidth) marqueeX = -(Math.abs(marqueeX) % singleSetWidth)
      }, 1600)
    }

    // Set banner content
    const bannerTitleEl = document.getElementById('bannerTitle')
    const bannerCtaEl   = document.getElementById('bannerCtaText')
    const bannerBgEl    = document.getElementById('bannerBg')
    if (bannerTitleEl) bannerTitleEl.innerHTML = bannerConfig.title
    if (bannerCtaEl)   bannerCtaEl.textContent  = bannerConfig.buttonText
    if (bannerBgEl)    bannerBgEl.style.backgroundImage = `url("${bannerConfig.backgroundImage}")`

    // Particles
    const particlesEl = document.getElementById('particles')
    if (particlesEl) {
      for (let i = 0; i < 16; i++) {
        const p = document.createElement('div')
        p.className = 'particle'
        const size = 2 + Math.random() * 4
        p.style.width = `${size}px`
        p.style.height = `${size}px`
        p.style.left = `${Math.random() * 100}%`
        p.style.top = `${60 + Math.random() * 40}%`
        p.style.setProperty('--driftX', `${Math.random() * 60 - 30}px`)
        p.style.animationDuration = `${6 + Math.random() * 8}s`
        p.style.animationDelay = `${Math.random() * 8}s`
        particlesEl.appendChild(p)
      }
    }

    // Start animation
    setTimeout(() => {
      document.getElementById('brandOverlay')?.classList.add('is-visible')
    }, 350)
    startRotation()
    setTimeout(startFlow, timing.rotationTotal)
  }, [loading, homepageConfig])

  // Dynamically update banner background when homepageConfig changes
  useEffect(() => {
    const bannerBgEl = document.getElementById('bannerBg')
    if (bannerBgEl && homepageConfig?.hero_bg_banner) {
      bannerBgEl.style.backgroundImage = `url("${homepageConfig.hero_bg_banner}")`
    }
  }, [homepageConfig])

  // Derived product lists
  const matchedFeatured = homepageConfig?.featured_product_ids?.length > 0
    ? products.filter(p => homepageConfig.featured_product_ids.includes(p.id))
    : []
  const newArrivals = matchedFeatured.length > 0 ? matchedFeatured : products.filter(p => p.tag === 'New')

  const matchedSale = homepageConfig?.sale_product_ids?.length > 0
    ? products.filter(p => homepageConfig.sale_product_ids.includes(p.id))
    : []
  const saleProducts = matchedSale.length > 0 ? matchedSale : products.filter(p => p.tag === 'Sale')
  const bestSellers    = products.filter(p => p.tag === 'Best Seller')
  // Large images (bb-001 to bb-006) — used in sliders
  const largeProducts  = products.filter(p => p.image && !p.image.includes('-sm-'))
  // Small images (bb-007 to bb-018) — used in Most Selling grid
  const smallProducts  = products.filter(p => p.image && p.image.includes('-sm-'))

  // Filter for Most Selling section
  const filterClass = (tag) => {
    if (tag === 'Best Seller') return 'best-selling'
    if (tag === 'Sale')        return 'on-selling'
    return 'top-rating'
  }
  const filteredSmall = sellFilter === 'all'
    ? smallProducts
    : smallProducts.filter(p => filterClass(p.tag) === sellFilter)

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    if (email) { toast.success('Subscribed successfully!'); setEmail('') }
  }

  return (
    <>
      <QuickViewModal 
        product={quickViewProduct} 
        isOpen={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
      />
      {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="hero" id="hero">
        <div className="brand-overlay" id="brandOverlay">
          <span className="brand-name">The Boujee Bazar</span>
          <span className="brand-sub">New Collection 2026</span>
        </div>
        <div className="ring-stage">
          <div className="ring" id="ring"></div>
        </div>
        <div className="flow-track" id="flowTrack"></div>
        <div className="banner" id="banner">
          <div className="banner-bg" id="bannerBg"></div>
          <div className="banner-shape banner-shape--a"></div>
          <div className="banner-shape banner-shape--b"></div>
          <div className="particles" id="particles"></div>
          <div className="banner-content">
            <h1 className="banner-title" id="bannerTitle"></h1>
            <button className="banner-cta" id="bannerCta" onClick={() => window.location.href = '/shop'}>
              <span id="bannerCtaText"></span>
            </button>
          </div>
        </div>
        <div className="phase-dots" id="phaseDots"></div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────────────────── */}
      <section className="ul-trust-bar swiper ul-trust-slider">
        <div className="swiper-wrapper ul-trust-wrapper">
          {[
            { img: '/assets/img/icons/1.png', label: 'Premium Quality' },
            { img: '/assets/img/icons/2.png', label: 'Skin-Friendly' },
            { img: '/assets/img/icons/3.png', label: 'Fast Delivery' },
            { img: '/assets/img/icons/4.png', label: 'Easy Returns' },
            { img: '/assets/img/icons/5.png', label: 'Secure Payments' },
          ].map((item, i) => (
            <div key={i} className="swiper-slide ul-trust-item">
              <div className="ul-trust-icon-box"><img src={item.img} alt={item.label} /></div>
              <div className="ul-trust-content"><h4 className="ul-trust-title">{item.label}</h4></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────────────── */}
      <div className="ul-container">
        <section className="ul-categories">
          <div className="ul-inner-containers">
            <div className="left" style={{ marginBottom: 35 }}>
              <span className="ul-section-sub-title">Browse </span>
              <h2 className="ul-section-title" style={{ color: 'black' }}>Shop by Category</h2>
            </div>
            <div className="ul-category-carousel-container">
              <button className="ul-category-nav prev" id="cat-scroll-left"><i className="flaticon-left-arrow"></i></button>
              <div className="ul-category-circle-wrapper" id="cat-scroll-wrapper">
                {CATEGORIES.map((cat, i) => (
                  <Link key={i} to={`/shop?category=${cat.slug}`} className="ul-category-circle-item">
                    <div className="ul-category-circle-img">
                      <img src={cat.image} alt={cat.name} />
                    </div>
                    <span className="ul-category-circle-txt">{cat.name}</span>
                  </Link>
                ))}
                <Link to="/shop?tag=Sale" className="ul-category-circle-item">
                  <div className="ul-category-circle-img sale-bg"><span>SALE</span></div>
                  <span className="ul-category-circle-txt">Sale</span>
                </Link>
              </div>
              <button className="ul-category-nav next" id="cat-scroll-right"><i className="flaticon-arrow-point-to-right"></i></button>
            </div>
          </div>
        </section>
      </div>

      {/* ── NEW ARRIVALS ─────────────────────────────────────────────────── */}
      <div className="ul-container">
        <section className="ul-products">
          <div className="ul-inner-container">
            <div className="ul-section-heading">
              <div className="left">
                <span className="ul-section-sub-title">Just Dropped </span>
                <h2 className="ul-section-title">New Arrivals</h2>
              </div>
              <div className="right">
                <Link to="/shop?tag=New" className="ul-btn" style={{ color: '#e0f2fe' }}>
                  More Collection <i className="flaticon-up-right-arrow"></i>
                </Link>
              </div>
            </div>

            <div className="row ul-bs-row">
              {/* Row 1 */}
              <div className="col-lg-3 col-md-4 col-12 now-only">
                <div className="ul-products-sub-banner">
                  <div className="ul-products-sub-banner-img">
                    <img src="/assets/img/banners/products-sub-banner-1.jpg" alt="Sub Banner" />
                  </div>
                  <div className="ul-products-sub-banner-txt">
                    <h3 className="ul-products-sub-banner-title">Trending Now Only This Weekend!</h3>
                    <Link to="/shop" className="ul-btn">Shop Now <i className="flaticon-up-right-arrow"></i></Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-8 col-12">
                <div className="swiper ul-products-slider-1">
                  <div className="swiper-wrapper">
                    {(largeProducts.length ? largeProducts : newArrivals).map(p => (
                      <div key={p.id} className="swiper-slide">
                        <ProductCard product={{ ...p, onQuickView: setQuickViewProduct }} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="ul-products-slider-nav ul-products-slider-1-nav">
                  <button className="prev"><i className="flaticon-left-arrow"></i></button>
                  <button className="next"><i className="flaticon-arrow-point-to-right"></i></button>
                </div>
              </div>

              {/* Row 2 */}
              <div className="col-lg-3 col-md-4 col-12 now-only">
                <div className="ul-products-sub-banner">
                  <div className="ul-products-sub-banner-img">
                    <img src="/assets/img/banners/products-sub-banner-2.jpg" alt="Sub Banner" />
                  </div>
                  <div className="ul-products-sub-banner-txt">
                    <h3 className="ul-products-sub-banner-title">Trending Now Only This Weekend!</h3>
                    <Link to="/shop" className="ul-btn">Shop Now <i className="flaticon-up-right-arrow"></i></Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-8 col-12">
                <div className="swiper ul-products-slider-2">
                  <div className="swiper-wrapper">
                    {/* Reverse or offset the second slider slightly so it doesn't look identical to the first if there are many products */}
                    {(largeProducts.length ? largeProducts.slice(2).concat(largeProducts.slice(0, 2)) : newArrivals.slice(2).concat(newArrivals.slice(0, 2))).map(p => (
                      <div key={`row2-${p.id}`} className="swiper-slide">
                        <ProductCard product={{ ...p, onQuickView: setQuickViewProduct }} />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="ul-products-slider-nav ul-products-slider-2-nav">
                  <button className="prev"><i className="flaticon-left-arrow"></i></button>
                  <button className="next"><i className="flaticon-arrow-point-to-right"></i></button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── SUB BANNERS ──────────────────────────────────────────────────── */}
      <div className="ul-container">
        <section className="ul-sub-banners">
          <div className="ul-inner-container up-to">
            <div className="row ul-bs-row row-cols-md-3 row-cols-sm-2 row-cols-1">
              <div className="col">
                <div className="ul-sub-banner">
                  <div className="ul-sub-banner-txt">
                    <div className="top">
                      <span className="ul-ad-sub-title">Trending Products</span>
                      <h3 className="ul-sub-banner-title">Women's collections</h3>
                      <p className="ul-sub-banner-descr">Up to 30% off selected styles</p>
                    </div>
                    <div className="bottom">
                      <Link to="/shop" className="ul-sub-banner-btn">Collection <i className="flaticon-up-right-arrow"></i></Link>
                    </div>
                  </div>
                  <div className="ul-sub-banner-img">
                    <img src="/assets/img/banners/sub-banner-1.png" alt="Sub Banner" />
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="ul-sub-banner ul-sub-banner--2">
                  <div className="ul-sub-banner-txt">
                    <div className="top">
                      <span className="ul-ad-sub-title">Trending Products</span>
                      <h3 className="ul-sub-banner-title">Jewellery Picks</h3>
                      <p className="ul-sub-banner-descr">Up to 25% off on necklaces</p>
                    </div>
                    <div className="bottom">
                      <Link to="/shop?category=Necklaces" className="ul-sub-banner-btn">Collection <i className="flaticon-up-right-arrow"></i></Link>
                    </div>
                  </div>
                  <div className="ul-sub-banner-img">
                    <img src="/assets/img/banners/sub-banner-2.png" alt="Sub Banner" />
                  </div>
                </div>
              </div>
              <div className="col">
                <div className="ul-sub-banner ul-sub-banner--3">
                  <div className="ul-sub-banner-txt">
                    <div className="top">
                      <span className="ul-ad-sub-title">Trending Products</span>
                      <h3 className="ul-sub-banner-title">Accessories & More</h3>
                      <p className="ul-sub-banner-descr">Up to 40% off accessories</p>
                    </div>
                    <div className="bottom">
                      <Link to="/shop?category=Accessories" className="ul-sub-banner-btn">Collection <i className="flaticon-up-right-arrow"></i></Link>
                    </div>
                  </div>
                  <div className="ul-sub-banner-img">
                    <img src="/assets/img/banners/sub-banner-3.png" alt="Sub Banner" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── FLASH SALE ───────────────────────────────────────────────────── */}
      <div className="overflow-hidden">
        <div className="ul-container">
          <div className="ul-flash-sale">
            <div className="ul-inner-container">
              <div className="ul-section-heading ul-flash-sale-heading">
                <div className="left">
                  <span className="ul-section-sub-title">New Collection</span>
                  <h2 className="ul-section-title">Trending Flash Sell</h2>
                </div>
                <div className="ul-flash-sale-countdown-wrapper">
                  <div className="ul-flash-sale-countdown">
                    <div className="days-wrapper">
                      <div className="days number">{countdown.days}</div>
                      <span className="txt">Days</span>
                    </div>
                    <div className="hours-wrapper">
                      <div className="hours number">{countdown.hours}</div>
                      <span className="txt">Hours</span>
                    </div>
                    <div className="minutes-wrapper">
                      <div className="minutes number">{countdown.minutes}</div>
                      <span className="txt">Min</span>
                    </div>
                    <div className="seconds-wrapper">
                      <div className="seconds number">{countdown.seconds}</div>
                      <span className="txt">Sec</span>
                    </div>
                  </div>
                </div>
                <Link to="/shop?tag=Sale" className="ul-btn">
                  View All Collection <i className="flaticon-up-right-arrow"></i>
                </Link>
              </div>

              <div className="ul-flash-sale-slider swiper">
                <div className="swiper-wrapper">
                  {(saleProducts.length ? saleProducts : largeProducts).map(p => (
                    <div key={p.id} className="swiper-slide">
                      <ProductCard product={{ ...p, onQuickView: setQuickViewProduct }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── AD SECTION ───────────────────────────────────────────────────── */}
      <div className="ul-container">
        <section className="ul-ad">
          <div className="ul-inner-container">
            <div className="ul-ad-content">
              <div className="ul-ad-txt">
                <span className="ul-ad-sub-title">Trending Products</span>
                <h2 className="ul-section-title">Get 30% Discount On All Jewellery!</h2>
                <div className="ul-ad-categories">
                  {['Necklaces','Earrings','Rings','Bracelets','Anklets'].map(c => (
                    <span key={c} className="category">
                      <span><i className="flaticon-check-mark"></i></span>{c}
                    </span>
                  ))}
                </div>
              </div>
              <div className="ul-ad-img">
                <img src="/assets/img/banners/ad-img.png" alt="Ad Image" />
              </div>
              <Link to="/shop?tag=Sale" className="ul-btn">
                Check Discount <i className="flaticon-up-right-arrow"></i>
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ── MOST SELLING ─────────────────────────────────────────────────── */}
      <div className="ul-container">
        <section className="ul-products ul-most-selling-products">
          <div className="ul-inner-container">
            <div className="ul-section-heading flex-lg-row flex-column text-md-start text-center">
              <div className="left">
                <span className="ul-section-sub-title">most selling items</span>
                <h2 className="ul-section-title">Top selling Categories This Week</h2>
              </div>
              <div className="right">
                <div className="ul-most-sell-filter-navs">
                  {[
                    { key: 'all',           label: 'All Products' },
                    { key: 'best-selling',  label: 'Best Selling' },
                    { key: 'on-selling',    label: 'On Selling' },
                    { key: 'top-rating',    label: 'Top Rating' },
                  ].map(f => (
                    <button
                      key={f.key}
                      type="button"
                      className={sellFilter === f.key ? 'mixitup-control-active' : ''}
                      onClick={() => setSellFilter(f.key)}
                    >{f.label}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="ul-bs-row row row-cols-xl-4 row-cols-lg-3 row-cols-sm-2 row-cols-2 ul-filter-products-wrapper">
              {filteredSmall.map(p => (
                <div key={p.id} className={`mix col ${filterClass(p.tag)}`}>
                  <ProductCardHorizontal product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── VIDEO SECTION ────────────────────────────────────────────────── */}
      <div className="ul-container">
        <div className="ul-video">
          <div>
            <img src="/assets/img/banners/video-banner.jpg" alt="Video Banner" className="ul-video-cover" />
          </div>
          <a
            href="https://youtu.be/cNOKQIw81SE?si=iwUyBvpTD3h8DpFK"
            data-fslightbox="video"
            className="ul-video-btn"
          ><i className="flaticon-play-button-arrowhead"></i></a>
        </div>
      </div>

      {/* ── REVIEWS ──────────────────────────────────────────────────────── */}
      <section className="ul-reviews overflow-hidden">
        <div className="ul-section-heading text-center justify-content-center">
          <div>
            <span className="ul-section-sub-title">Customer Reviews</span>
            <h2 className="ul-section-title">Product Reviews</h2>
            <p className="ul-reviews-heading-descr">
              Real customers, real love — see what people are saying about Boujee Bazar.
            </p>
          </div>
        </div>
        <div className="ul-reviews-slider swiper">
          <div className="swiper-wrapper">
            {reviews.map((rev, i) => {
              const rating = rev.rating || 4
              return (
                <div key={rev.id || i} className="swiper-slide">
                  <div className="ul-review">
                    <div className="ul-review-rating">
                      {[1,2,3,4,5].map(s => (
                        <i key={s} className={s <= rating ? 'flaticon-star' : 'flaticon-star-3'}></i>
                      ))}
                    </div>
                    <p className="ul-review-descr">{rev.review}</p>
                    <div className="ul-review-bottom">
                      <div className="ul-review-reviewer">
                        <div className="reviewer-image">
                          <img src={rev.image || `/assets/img/reviews/review-author-${(i % 4) + 1}.png`} alt={rev.name || rev.customer_name} />
                        </div>
                        <div>
                          <h3 className="reviewer-name">{rev.name || rev.customer_name}</h3>
                          <span className="reviewer-role">{rev.role || 'Verified Buyer'}</span>
                        </div>
                      </div>
                      <div className="ul-review-icon"><i className="flaticon-left"></i></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="ul-faq pb-120 pt-120">
        <div className="ul-container">
          <div className="ul-section-heading text-center justify-content-center">
            <div>
              <span className="ul-section-sub-title">Got Questions?</span>
              <h2 className="ul-section-title">Frequently Asked Questions</h2>
            </div>
          </div>
          <div className="ul-inner-page-container">
            <div className="ul-accordion">
              {FAQ_ITEMS.map((item, i) => (
                <div key={i} className={`ul-single-accordion-item${faqOpen === i ? ' open' : ''}`}>
                  <div className="ul-single-accordion-item__header" onClick={() => setFaqOpen(faqOpen === i ? null : i)} style={{ cursor: 'pointer' }}>
                    <div className="left">
                      <h3 className="ul-single-accordion-item__title">{item.q}</h3>
                    </div>
                    <span className="icon">
                      <i className={`flaticon-${faqOpen === i ? 'minus' : 'plus'}`}></i>
                    </span>
                  </div>
                  <div className="ul-single-accordion-item__body">
                    <p className="mb-0">{item.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ───────────────────────────────────────────────────── */}
      <div className="ul-container">
        <section className="ul-nwsltr-subs">
          <div className="ul-inner-container">
            <div className="ul-section-heading justify-content-center text-center">
              <div>
                <span className="ul-section-sub-title text-white">GET NEWSLETTER</span>
                <h2 className="ul-section-title text-white">Sign Up to Newsletter</h2>
              </div>
            </div>
            <div className="ul-nwsltr-subs-form-wrapper">
              <div className="icon"><i className="flaticon-airplane"></i></div>
              <form className="ul-nwsltr-subs-form" onSubmit={handleNewsletterSubmit}>
                <input
                  type="email"
                  placeholder="Enter Your Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <button type="submit">
                  Subscribe Now <i className="flaticon-up-right-arrow"></i>
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* ── INSTAGRAM GALLERY ────────────────────────────────────────────── */}
      <div className="ul-gallery overflow-hidden mx-auto">
        <div className="ul-gallery-slider swiper">
          <div className="swiper-wrapper">
            {[1,2,3,4,5,6,1,2,3,4,5,6].map((n, i) => (
              <div key={i} className="ul-gallery-item swiper-slide">
                <img src={`/assets/img/gallery/gallery-item-${n}.jpg`} alt="Gallery" />
                <div className="ul-gallery-item-btn-wrapper">
                  <a href={`/assets/img/gallery/gallery-item-${n}.jpg`} data-fslightbox="gallery">
                    <i className="flaticon-instagram"></i>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
