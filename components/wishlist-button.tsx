"use client"

import { useState } from "react"
import { Heart } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  image: string
}

export default function WishlistButton({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false)
  const [inWishlist, setInWishlist] = useState(false)

  const toggleWishlist = async () => {
    setLoading(true)

    // In a real app, you would add/remove the product to/from the wishlist
    // This could be in localStorage, a context, or an API call

    setTimeout(() => {
      setInWishlist(!inWishlist)
      setLoading(false)
      alert(`${inWishlist ? "Removed from" : "Added to"} wishlist: ${product.name}`)
    }, 600)
  }

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={`flex items-center justify-center gap-2 px-6 py-3 font-medium transition-colors border ${
        inWishlist
          ? "border-primary text-primary hover:bg-primary/10"
          : "border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
      } disabled:opacity-70`}
    >
      <Heart size={18} fill={inWishlist ? "currentColor" : "none"} />
      {loading ? "Updating..." : "Wishlist"}
    </button>
  )
}

