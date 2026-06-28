import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="ul-footer">
      <div className="ul-inner-container">
        <div className="ul-footer-top">
          <div className="ul-footer-top-widget">
            <h3 className="ul-footer-top-widget-title">Shop</h3>
            <div className="ul-footer-top-widget-links">
              <Link to="/shop?category=Jewelry">Jewelry</Link>
              <Link to="/shop?category=Watches">Watches</Link>
              <Link to="/shop?category=Accessories">Accessories</Link>
              <Link to="/shop?tag=New">New Arrivals</Link>
              <Link to="/shop?tag=Sale">Sale</Link>
            </div>
          </div>

          <div className="ul-footer-top-widget">
            <h3 className="ul-footer-top-widget-title">Categories</h3>
            <div className="ul-footer-top-widget-links">
              <Link to="/shop?category=Necklaces">Necklaces &amp; Pendants</Link>
              <Link to="/shop?category=Earrings">Earrings</Link>
              <Link to="/shop?category=Rings">Rings</Link>
              <Link to="/shop?category=Bracelets">Bracelets &amp; Bangles</Link>
              <Link to="/shop?category=Anklets">Anklets</Link>
            </div>
          </div>

          <div className="ul-footer-top-widget">
            <h3 className="ul-footer-top-widget-title">Help</h3>
            <div className="ul-footer-top-widget-links">
              <Link to="/contact">Contact Us</Link>
              <Link to="/about">About Us</Link>
              <Link to="/my-orders">Track Order</Link>
              <a href="#">FAQ</a>
              <a href="#">Refund Policy</a>
            </div>
          </div>

          <div className="ul-footer-top-widget">
            <h3 className="ul-footer-top-widget-title">Services</h3>
            <div className="ul-footer-top-widget-links">
              <a href="#">Quick Delivery</a>
              <a href="#">Easy Returns</a>
              <a href="#">Gift Cards</a>
              <a href="#">Secure Payments</a>
              <Link to="/auth">My Account</Link>
            </div>
          </div>

          <div className="ul-footer-top-widget">
            <h3 className="ul-footer-top-widget-title">Policies</h3>
            <div className="ul-footer-top-widget-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Shipping Policy</a>
              <a href="#">Return &amp; Exchange</a>
            </div>
          </div>

          <div className="ul-footer-top-widget">
            <h3 className="ul-footer-top-widget-title">Quick Links</h3>
            <div className="ul-footer-top-widget-links">
              <Link to="/">Home</Link>
              <Link to="/shop">Shop</Link>
              <Link to="/wishlist">Wishlist</Link>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>

        <div className="ul-footer-middle">
          <div className="ul-footer-middle-widget">
            <h3 className="ul-footer-middle-widget-title">Follow Us</h3>
            <div className="ul-footer-middle-widget-content">
              <div className="social-links">
                <a href="#"><i className="flaticon-facebook-app-symbol"></i></a>
                <a href="#"><i className="flaticon-instagram"></i></a>
                <a href="#"><i className="flaticon-youtube"></i></a>
                <a href="#"><i className="flaticon-twitter"></i></a>
              </div>
            </div>
          </div>

          <div className="ul-footer-middle-widget">
            <h3 className="ul-footer-middle-widget-title">Need help? Call now!</h3>
            <div className="ul-footer-middle-widget-content">
              <div className="contact-nums">
                <a href="tel:+917980781793">+91 7980781793</a>
              </div>
              <p style={{ color: '#a0a0a0', marginTop: '15px', marginBottom: 0 }}>
                171/C/1 Binay Singh Colony, Picnic Garden Road Kolkata 700039
              </p>
            </div>
          </div>

          <div className="ul-footer-middle-widget align-self-center">
            <Link to="/"><img src="/boujee-bazaar-logo.png" alt="Boujee Bazar" className="logo" style={{ height: '60px', width: 'auto', filter: 'brightness(0) invert(1)' }} /></Link>
          </div>
        </div>

        <div className="ul-footer-bottom">
          <p className="copyright-txt">Copyright {new Date().getFullYear()} © The Boujee Bazar. All Rights Reserved.</p>
          <img src="/assets/img/icons/payment-methods.png" alt="payment methods" />
        </div>
      </div>
    </footer>
  )
}
