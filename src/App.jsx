import { useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Auth from './pages/Auth'
import Checkout from './pages/Checkout'
import Wishlist from './pages/Wishlist'
import Admin from './pages/Admin'
import MyOrders from './pages/MyOrders'
import ResetPassword from './pages/ResetPassword'

function App() {
  const location = useLocation()
  const isAdmin = location.pathname === '/admin'

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    // Signal to the inline main.js that page is ready for re-init
    setTimeout(() => window.dispatchEvent(new Event('bb:page-ready')), 100)
  }, [location.pathname, location.search])

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdmin && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
    </div>
  )
}

export default App
