import { Link } from 'react-router-dom'

const VALUES = [
  { icon: 'flaticon-medal',         title: 'Quality First',       text: 'Every product is inspected before it reaches you. We only stock items we would proudly wear ourselves.' },
  { icon: 'flaticon-padlock',       title: 'Transparent Pricing', text: 'No hidden charges. No surprise fees. What you see is what you pay — honest and straightforward.' },
  { icon: 'flaticon-delivery-truck',title: 'Fast Delivery',       text: 'We know you can\'t wait. We ship fast and track every order carefully so it reaches you safely.' },
  { icon: 'flaticon-return',        title: 'Easy Returns',        text: 'Not happy? No problem. Our hassle-free 7-day return policy means you can shop with full confidence.' },
  { icon: 'flaticon-heart',         title: 'Customer Love',       text: 'Our customers are the heart of everything we do. Your satisfaction drives every decision we make.' },
  { icon: 'flaticon-star',          title: 'Curated Selection',   text: 'Our team hand-picks every piece, ensuring each item meets our standard for beauty and craftsmanship.' },
]

const STATS = [
  { number: '5,000+', label: 'Happy Customers' },
  { number: '500+',   label: 'Products Curated' },
  { number: '4.9★',   label: 'Average Rating'  },
  { number: '7-Day',  label: 'Return Policy'   },
]

export default function About() {
  return (
    <main>
      {/* BREADCRUMB */}
      <div className="ul-container">
        <div className="ul-breadcrumb">
          <h2 className="ul-breadcrumb-title">About Us</h2>
          <div className="ul-breadcrumb-nav">
            <Link to="/"><i className="flaticon-home"></i> Home</Link>
            <i className="flaticon-arrow-point-to-right"></i>
            <span className="current-page">About Us</span>
          </div>
        </div>
      </div>

      {/* COVER IMAGE */}
      <div className="ul-container">
        <div className="ul-about-cover-img">
          <img
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1800&q=80"
            alt="The Boujee Bazar — jewelry and accessories"
          />
        </div>
      </div>

      {/* STORY SECTION */}
      <div className="ul-container">
        <div className="ul-about">
          <div className="row ul-bs-row" style={{ alignItems: 'center' }}>
            <div className="col-lg-6 col-md-6">
              <div className="ul-about-img">
                <img
                  src="https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=80"
                  alt="Boujee Bazar jewelry collection"
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <span className="ul-section-sub-title">Our Story</span>
              <h2 className="ul-section-title">Born From a Love of Beautiful Things</h2>
              <p style={{ color: '#666', lineHeight: 2, marginBottom: '20px', fontSize: 'clamp(13px, 0.84vw, 15px)' }}>
                The Boujee Bazar was founded in Kolkata with a simple mission — to bring handpicked, beautifully crafted jewelry and accessories to people who appreciate the finer things in life, without the unnecessary markup.
              </p>
              <p style={{ color: '#666', lineHeight: 2, marginBottom: '32px', fontSize: 'clamp(13px, 0.84vw, 15px)' }}>
                Every piece in our collection is carefully curated for quality, style, and authenticity. From delicate necklaces to statement watches, we believe accessories are the punctuation marks of an outfit — and they deserve to be extraordinary.
              </p>
              <Link to="/shop" className="ul-btn">
                Explore Collection <i className="flaticon-up-right-arrow"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* STATS STRIP */}
      <div style={{ background: 'var(--ul-gradient, #f5f2ed)', padding: 'clamp(36px, 3.5vw, 60px) 0' }}>
        <div className="ul-container">
          <div className="row ul-bs-row row-cols-lg-4 row-cols-sm-2 row-cols-2" style={{ textAlign: 'center' }}>
            {STATS.map(s => (
              <div key={s.label} className="col">
                <div style={{ padding: 'clamp(16px, 1.5vw, 24px)' }}>
                  <div style={{ fontSize: 'clamp(28px, 3vw, 48px)', fontWeight: 900, color: '#1a1a1a', lineHeight: 1, marginBottom: '8px' }}>{s.number}</div>
                  <div style={{ fontSize: 'clamp(12px, 0.84vw, 14px)', color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WHAT WE DO SECTION */}
      <div className="ul-container">
        <div className="ul-about" style={{ borderBottom: 'none' }}>
          <div className="row ul-bs-row" style={{ alignItems: 'center' }}>
            <div className="col-lg-6 col-md-6 order-lg-2">
              <div className="ul-about-img">
                <img
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80"
                  alt="Boujee Bazar necklaces collection"
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 order-lg-1">
              <span className="ul-section-sub-title">What We Do</span>
              <h2 className="ul-section-title">Jewelry That Tells Your Story</h2>
              <p style={{ color: '#666', lineHeight: 2, marginBottom: '20px', fontSize: 'clamp(13px, 0.84vw, 15px)' }}>
                From delicate gold-plated necklaces to bold statement earrings, bold stackable rings, and elegant watches — our collection spans every mood, every occasion, every style.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                {['Handpicked jewelry & accessories', 'Premium quality at honest prices', 'Shipped across all of India', 'COD available on every order'].map(point => (
                  <div key={point} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f5e8c8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className="flaticon-check" style={{ fontSize: '12px', color: '#c8961e' }}></i>
                    </div>
                    <span style={{ fontSize: '14px', color: '#333', fontWeight: 500 }}>{point}</span>
                  </div>
                ))}
              </div>
              <Link to="/shop?tag=New" className="ul-btn">
                New Arrivals <i className="flaticon-up-right-arrow"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* VALUES GRID */}
      <div style={{ background: '#faf8f4', padding: 'clamp(50px, 5vw, 90px) 0' }}>
        <div className="ul-container">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(36px, 3.5vw, 56px)' }}>
            <span className="ul-section-sub-title">What We Stand For</span>
            <h2 className="ul-section-title">Our Values</h2>
          </div>
          <div className="row ul-bs-row row-cols-lg-3 row-cols-sm-2 row-cols-1">
            {VALUES.map(v => (
              <div key={v.title} className="col">
                <div style={{
                  background: '#fff',
                  border: '1.5px solid #ede8e0',
                  borderRadius: '20px',
                  padding: 'clamp(24px, 2.1vw, 36px) clamp(20px, 1.6vw, 28px)',
                  height: '100%',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #f5f0e8 0%, #ede4d0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
                    <i className={v.icon} style={{ fontSize: '24px', color: '#c8961e' }}></i>
                  </div>
                  <h4 style={{ fontWeight: 800, marginBottom: '10px', fontSize: 'clamp(14px, 1vw, 16px)' }}>{v.title}</h4>
                  <p style={{ color: '#666', fontSize: '13.5px', lineHeight: 1.8, margin: 0 }}>{v.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="ul-container">
        <div style={{ padding: 'clamp(40px, 4vw, 70px) 0 clamp(50px, 5vw, 90px)' }}>
          <div style={{
            background: '#1a1a1a',
            borderRadius: '28px',
            padding: 'clamp(40px, 5vw, 80px) clamp(24px, 4vw, 64px)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(200,150,30,0.08)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-60px', left: '-20px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(200,150,30,0.06)', pointerEvents: 'none' }} />
            <span className="ul-section-sub-title" style={{ color: '#f5d97e', position: 'relative' }}>Join Us</span>
            <h2 style={{ color: '#fff', fontSize: 'clamp(24px, 3vw, 44px)', fontWeight: 900, margin: '10px 0 18px', letterSpacing: '-0.02em', position: 'relative' }}>
              Join the Boujee Family
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'clamp(13px, 0.95vw, 16px)', maxWidth: '520px', margin: '0 auto 36px', lineHeight: 1.8, position: 'relative' }}>
              Thousands of happy customers across India trust The Boujee Bazar for their style needs. Find your next favourite piece today.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
              <Link to="/shop" className="ul-btn">
                Shop Now <i className="flaticon-up-right-arrow"></i>
              </Link>
              <Link to="/contact" style={{ padding: '14px 28px', border: '2px solid rgba(255,255,255,0.4)', color: '#fff', borderRadius: '8px', fontWeight: 700, textDecoration: 'none', fontSize: '14px', transition: 'border-color 0.2s' }}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

    </main>
  )
}
