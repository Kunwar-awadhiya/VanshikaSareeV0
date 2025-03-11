"use client"

import { useState } from "react"
import { ShoppingBag } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  image: string
  sizes?: string[]
  quantity?: { [key: string]: number }
}

export default function AddToCartButton({ product }: { product: Product }) {
  const [loading, setLoading] = useState(false)

  const addToCart = async () => {
    setLoading(true)

    // In a real app, you would add the product to the cart
    // This could be in localStorage, a context, or an API call

    setTimeout(() => {
      setLoading(false)
      alert(`Added ${product.name} to cart`)
    }, 600)
  }

  return (
    <button
      onClick={addToCart}
      disabled={loading}
      className="flex items-center justify-center flex-1 gap-2 px-6 py-3 font-medium text-white transition-colors bg-primary hover:bg-primary/90 disabled:bg-primary/70"
    >
      {loading ? (
        "Adding..."
      ) : (
        <>
          <ShoppingBag size={18} />
          Add to Cart
        </>
      )}
    </button>
  )
}

