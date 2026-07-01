import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import './index.css'
import './quick-view.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <App />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    borderRadius: '12px',
                    background: '#000000',
                    color: '#ffffff',
                    border: '1px solid #D7994E',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.88rem',
                  },
                  success: {
                    style: {
                      borderColor: '#D7994E',
                    },
                    iconTheme: {
                      primary: '#ffffff',
                      secondary: '#D7994E',
                    },
                  },
                  error: {
                    style: {
                      borderColor: '#D7994E',
                    },
                    iconTheme: {
                      primary: '#ffffff',
                      secondary: '#D7994E',
                    },
                  },
                }}
              />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
)
