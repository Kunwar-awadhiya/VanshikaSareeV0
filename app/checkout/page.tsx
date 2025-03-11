"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

interface CartItem {
  productId: string
  name: string
  price: number
  size: string
  quantity: number
  image: string
}

interface Address {
  id: string
  name: string
  phone: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [paymentMethod, setPaymentMethod] = useState<string>("cod")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [showAddAddress, setShowAddAddress] = useState(false)

  // New address form state
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  })

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch cart
        const cartResponse = await fetch("/api/cart")

        if (!cartResponse.ok) {
          if (cartResponse.status === 401) {
            router.push("/login")
            return
          }
          throw new Error("Failed to fetch cart")
        }

        const cartData = await cartResponse.json()

        if (!cartData.items || cartData.items.length === 0) {
          router.push("/cart")
          return
        }

        setCartItems(cartData.items || [])

        // Fetch addresses
        const addressResponse = await fetch("/api/user/addresses")

        if (!addressResponse.ok) {
          throw new Error("Failed to fetch addresses")
        }

        const addressData = await addressResponse.json()
        setAddresses(addressData || [])

        // Set default address if available
        const defaultAddress = addressData.find((addr: Address) => addr.isDefault)
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id)
        } else if (addressData.length > 0) {
          setSelectedAddressId(addressData[0].id)
        }
      } catch (err) {
        setError("Error loading checkout data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAddressId(e.target.value)
  }

  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value)
  }

  const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined

    setNewAddress({
      ...newAddress,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/user/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAddress),
      })

      if (!response.ok) {
        throw new Error("Failed to add address")
      }

      const data = await response.json()

      // Add new address to list and select it
      setAddresses([...addresses, data])
      setSelectedAddressId(data.id)

      // Reset form and hide it
      setNewAddress({
        name: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "India",
        isDefault: false,
      })
      setShowAddAddress(false)
    } catch (err) {
      console.error("Error adding address:", err)
      alert("Failed to add address")
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      alert("Please select a shipping address")
      return
    }

    if (!paymentMethod) {
      alert("Please select a payment method")
      return
    }

    setSubmitting(true)

    try {
      const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId)

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shippingAddress: selectedAddress,
          paymentMethod,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to place order")
      }

      const order = await response.json()

      // Redirect to order confirmation page
      router.push(`/order-confirmation/${order.orderId}`)
    } catch (err) {
      console.error("Error placing order:", err)
      setError(err instanceof Error ? err.message : "Failed to place order")
    } finally {
      setSubmitting(false)
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

  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-2xl font-semibold">Checkout</h1>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  const subtotal = calculateSubtotal()
  const shipping = calculateShipping(subtotal)
  const tax = calculateTax(subtotal)
  const total = calculateTotal(subtotal, shipping, tax)

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-2xl font-semibold">Checkout</h1>

      {error && <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-md">{error}</div>}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Shipping Address */}
          <div className="p-6 mb-6 bg-white border rounded-lg">
            <h2 className="mb-4 text-lg font-medium">Shipping Address</h2>

            {addresses.length > 0 ? (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div key={address.id} className="flex items-start p-4 border rounded-md">
                    <input
                      type="radio"
                      id={`address-${address.id}`}
                      name="address"
                      value={address.id}
                      checked={selectedAddressId === address.id}
                      onChange={handleAddressChange}
                      className="mt-1 mr-3"
                    />
                    <label htmlFor={`address-${address.id}`} className="flex-1 cursor-pointer">
                      <div className="font-medium">{address.name}</div>
                      <div className="text-sm text-gray-600">{address.phone}</div>
                      <div className="text-sm text-gray-600">
                        {address.street}, {address.city}, {address.state} - {address.postalCode}
                      </div>
                      <div className="text-sm text-gray-600">{address.country}</div>
                      {address.isDefault && (
                        <span className="inline-block px-2 py-1 mt-2 text-xs text-green-800 bg-green-100 rounded-full">
                          Default Address
                        </span>
                      )}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">No saved addresses found</div>
            )}

            {!showAddAddress ? (
              <button
                onClick={() => setShowAddAddress(true)}
                className="flex items-center mt-4 text-primary hover:underline"
              >
                + Add New Address
              </button>
            ) : (
              <div className="p-4 mt-4 border rounded-md">
                <h3 className="mb-4 text-md font-medium">Add New Address</h3>
                <form onSubmit={handleAddAddress} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={newAddress.name}
                        onChange={handleNewAddressChange}
                        required
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={newAddress.phone}
                        onChange={handleNewAddressChange}
                        required
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={newAddress.street}
                      onChange={handleNewAddressChange}
                      required
                      className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={newAddress.city}
                        onChange={handleNewAddressChange}
                        required
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State *
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={newAddress.state}
                        onChange={handleNewAddressChange}
                        required
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={newAddress.postalCode}
                        onChange={handleNewAddressChange}
                        required
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      />
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country *
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={newAddress.country}
                        onChange={handleNewAddressChange}
                        required
                        className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      >
                        <option value="India">India</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      checked={newAddress.isDefault}
                      onChange={handleNewAddressChange}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <label htmlFor="isDefault" className="block ml-2 text-sm text-gray-700">
                      Set as default address
                    </label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="p-6 mb-6 bg-white border rounded-lg">
            <h2 className="mb-4 text-lg font-medium">Payment Method</h2>

            <div className="space-y-4">
              <div className="flex items-start p-4 border rounded-md">
                <input
                  type="radio"
                  id="payment-cod"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={handlePaymentMethodChange}
                  className="mt-1 mr-3"
                />
                <label htmlFor="payment-cod" className="flex-1 cursor-pointer">
                  <div className="font-medium">Cash on Delivery</div>
                  <div className="text-sm text-gray-600">Pay when you receive your order</div>
                </label>
              </div>

              <div className="flex items-start p-4 border rounded-md">
                <input
                  type="radio"
                  id="payment-online"
                  name="payment"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={handlePaymentMethodChange}
                  className="mt-1 mr-3"
                />
                <label htmlFor="payment-online" className="flex-1 cursor-pointer">
                  <div className="font-medium">Online Payment</div>
                  <div className="text-sm text-gray-600">Pay now using credit/debit card, UPI, or net banking</div>
                </label>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6 bg-white border rounded-lg">
            <h2 className="mb-4 text-lg font-medium">Order Items</h2>

            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex items-center py-4 border-b">
                  <div className="relative flex-shrink-0 w-16 h-16">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-1 ml-4">
                    <Link href={`/product/${item.productId}`} className="font-medium hover:text-primary">
                      {item.name}
                    </Link>
                    <div className="text-sm text-gray-600">
                      Size: {item.size} | Quantity: {item.quantity}
                    </div>
                  </div>
                  <div className="font-medium">{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky p-6 bg-white border rounded-lg top-20">
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
              onClick={handlePlaceOrder}
              disabled={submitting || !selectedAddressId || !paymentMethod}
              className="w-full px-4 py-2 mt-6 text-white bg-primary rounded-md hover:bg-primary/90 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? "Processing..." : "Place Order"}
            </button>

            <div className="mt-4 text-center">
              <Link href="/cart" className="text-sm text-primary hover:underline">
                Return to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

