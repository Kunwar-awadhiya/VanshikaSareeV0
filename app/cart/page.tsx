"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Trash2, Minus, Plus, Heart } from "lucide-react"

interface CartItem {
  productId: string
  name: string
  price: number
  size: string
  quantity: number
  image: string
  maxQuantity: number
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [updatingItem, setUpdatingItem] = useState<string | null>(null)
  const [movingToWishlist, setMovingToWishlist] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCart() {
      try {
        const response = await fetch("/api/cart")

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login")
            return
          }
          throw new Error("Failed to fetch cart")
        }

        const data = await response.json()
        setCartItems(data.items || [])
      } catch (err) {
        setError("Error loading cart")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [router])

  const updateQuantity = async (productId: string, size: string, newQuantity: number) => {
    const itemKey = `${productId}-${size}`
    setUpdatingItem(itemKey)

    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId, size, quantity: newQuantity }),
      })

      if (!response.ok) {
        throw new Error("Failed to update cart")
      }

      const data = await response.json()
      setCartItems(data.items || [])
    } catch (err) {
      console.error("Error updating cart:", err)
      alert("Failed to update cart")
    } finally {
      setUpdatingItem(null)
    }
  }

  const removeFromCart = async (productId: string, size: string) => {
    // Set quantity to 0 to remove item
    await updateQuantity(productId, size, 0)
  }

  const moveToWishlist = async (productId: string, size: string) => {
    const itemKey = `${productId}-${size}`
    setMovingToWishlist(itemKey)

    try {
      // Add to wishlist
      const wishlistResponse = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      })

      if (!wishlistResponse.ok) {
        throw new Error("Failed to add to wishlist")
      }

      // Remove from cart
      await removeFromCart(productId, size)

      alert("Item moved to wishlist")
    } catch (err) {
      console.error("Error moving to wishlist:", err)
      alert("Failed to move item to wishlist")
    } finally {
      setMovingToWishlist(null)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const calculateShipping = (subtotal: number) => {
    return subtotal > 1000 ? 0 : 100 // Free shipping over ₹1000
  }

  const calculateTax = (subtotal: number) => {
    return Math.round(subtotal * 0.18) // 18% GST
  }

  const calculateTotal = (subtotal: number, shipping: number, tax: number) => {
    return subtotal + shipping + tax
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty")
      return
    }

    router.push("/checkout")
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-2xl font-semibold">Shopping Cart</h1>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-2xl font-semibold">Shopping Cart</h1>
        <div className="p-4 text-red-700 bg-red-100 rounded-md">{error}</div>
      </div>
    )
  }

  const subtotal = calculateSubtotal()
  const shipping = calculateShipping(subtotal)
  const tax = calculateTax(subtotal)
  const total = calculateTotal(subtotal, shipping, tax)

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-2xl font-semibold">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="p-8 text-center">
          <p className="mb-4 text-gray-500">Your cart is empty</p>
          <Link href="/collection" className="px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
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
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Quantity
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                    >
                      Total
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
                  {cartItems.map((item) => {
                    const itemKey = `${item.productId}-${item.size}`
                    return (
                      <tr key={itemKey}>
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
                              <div className="text-sm text-gray-500">Size: {item.size}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatPrice(item.price)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item.productId, item.size, Math.max(1, item.quantity - 1))}
                              disabled={updatingItem === itemKey || item.quantity <= 1}
                              className="p-1 text-gray-500 border rounded-md hover:bg-gray-100 disabled:opacity-50"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-10 mx-2 text-center">{item.quantity}</span>
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.size, Math.min(item.maxQuantity, item.quantity + 1))
                              }
                              disabled={updatingItem === itemKey || item.quantity >= item.maxQuantity}
                              className="p-1 text-gray-500 border rounded-md hover:bg-gray-100 disabled:opacity-50"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => moveToWishlist(item.productId, item.size)}
                              disabled={movingToWishlist === itemKey}
                              className="p-2 text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 disabled:opacity-50"
                            >
                              <Heart size={18} />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.productId, item.size)}
                              disabled={updatingItem === itemKey}
                              className="p-2 text-red-600 bg-red-100 rounded-full hover:bg-red-200 disabled:opacity-50"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="p-6 bg-white border rounded-lg">
              <h2 className="mb-4 text-lg font-medium">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (18% GST)</span>
                  <span>{formatPrice(tax)}</span>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-lg font-medium">Total</span>
                    <span className="text-lg font-medium">{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full px-4 py-2 mt-6 text-white bg-primary rounded-md hover:bg-primary/90"
              >
                Proceed to Checkout
              </button>

              <div className="mt-4 text-center">
                <Link href="/collection" className="text-sm text-primary hover:underline">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

