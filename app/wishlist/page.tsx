"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trash2, ShoppingBag } from "lucide-react"

interface WishlistItem {
  productId: string
  name: string
  price: number
  image: string
  addedAt: string
}

export default function WishlistPage() {
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [removingItem, setRemovingItem] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWishlist() {
      try {
        const response = await fetch("/api/wishlist")

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login")
            return
          }
          throw new Error("Failed to fetch wishlist")
        }

        const data = await response.json()
        setWishlistItems(data.items || [])
      } catch (err) {
        setError("Error loading wishlist")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [router])

  const removeFromWishlist = async (productId: string) => {
    setRemovingItem(productId)

    try {
      const response = await fetch(`/api/wishlist?productId=${productId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove item from wishlist")
      }

      // Remove item from state
      setWishlistItems(wishlistItems.filter((item) => item.productId !== productId))
    } catch (err) {
      console.error("Error removing from wishlist:", err)
      alert("Failed to remove item from wishlist")
    } finally {
      setRemovingItem(null)
    }
  }

  const moveToCart = async (productId: string) => {
    setAddingToCart(productId)

    try {
      // For simplicity, we're adding with default size and quantity
      const size = "Free Size" // Default size
      const quantity = 1 // Default quantity

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, size, quantity }),
      })

      if (!response.ok) {
        throw new Error("Failed to add item to cart")
      }

      // Remove from wishlist
      await removeFromWishlist(productId)

      alert("Item moved to cart")
    } catch (err) {
      console.error("Error moving to cart:", err)
      alert("Failed to move item to cart")
    } finally {
      setAddingToCart(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-2xl font-semibold">My Wishlist</h1>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-2xl font-semibold">My Wishlist</h1>
        <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-2xl font-semibold">My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div className="p-8 text-center">
          <p className="mb-4 text-gray-500">Your wishlist is empty</p>
          <Link href="/collection" className="px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden bg-white border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Product
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {wishlistItems.map((item) => (
                <tr key={item.productId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="relative flex-shrink-0 w-16 h-16">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="ml-4">
                        <Link
                          href={`/product/${item.productId}`}
                          className="text-sm font-medium text-gray-900 hover:text-primary"
                        >
                          {item.name}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatPrice(item.price)}</div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => moveToCart(item.productId)}
                        disabled={addingToCart === item.productId}
                        className="p-2 text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 disabled:opacity-50"
                      >
                        <ShoppingBag size={18} />
                      </button>
                      <button
                        onClick={() => removeFromWishlist(item.productId)}
                        disabled={removingItem === item.productId}
                        className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200 disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

