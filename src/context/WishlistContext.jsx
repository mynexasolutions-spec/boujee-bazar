import { createContext, useContext, useEffect, useState } from 'react'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('bb_wishlist') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('bb_wishlist', JSON.stringify(wishlistItems))
  }, [wishlistItems])

  function addToWishlist(product) {
    setWishlistItems(prev => prev.some(i => i.id === product.id) ? prev : [...prev, product])
  }

  function removeFromWishlist(productId) {
    setWishlistItems(prev => prev.filter(i => i.id !== productId))
  }

  function toggleWishlist(product) {
    setWishlistItems(prev => {
      const exists = prev.some(i => i.id === product.id)
      return exists ? prev.filter(i => i.id !== product.id) : [...prev, product]
    })
  }

  function isInWishlist(productId) {
    return wishlistItems.some(i => i.id === productId)
  }

  function clearWishlist() {
    setWishlistItems([])
  }

  const wishlistCount = wishlistItems.length

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, clearWishlist, wishlistCount }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  return useContext(WishlistContext)
}
