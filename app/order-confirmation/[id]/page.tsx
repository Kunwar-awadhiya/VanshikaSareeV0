"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Truck, Package, Clock } from "lucide-react"

interface OrderDetails {
  orderId: string
  items: Array<{
    productId: string
    name: string
    price: number
    size: string
    quantity: number
    image: string
  }>
  shippingAddress: {
    name: string
    phone: string
    street: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  paymentMethod: string
  paymentStatus: string
  orderStatus: string
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  createdAt: string
}

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/user/orders/${params.id}`)
        
        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login")
            return
          }
          throw new Error("Failed to fetch order details")
        }
        
        const data = await response.json()
        setOrder(data)
      } catch (err) {
        setError("Error loading order details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchOrder()
  }, [params.id, router])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container px-4 py-8 mx-auto">
        <div className="p-4 text-red-700 bg-red-100 rounded-md">
          {error || "Order not found"}
        </div>
        <div className="mt-4 text-center">
          <Link href="/" className="text-primary hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="max-w-3xl mx-auto">
        <div className="p-6 mb-8 text-center bg-white border rounded-lg">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="mb-2 text-2xl font-bold">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your order. Your order has been received and is being processed.
          </p>
          <p className="mt-4 font-medium">
            Order ID: <span className="font-bold">{order.orderId}</span>
          </p>
          <p className="text-sm text-gray-600">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="p-6 mb-8 bg-white border rounded-lg">
          <h2 className="mb-4 text-lg font-medium">Order Status</h2>
          
          <div className="relative">
            <div className="absolute top-0 left-5 h-full w-0.5 bg-gray-200"></div>
            
            <div className="relative flex items-start mb-6">
              <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-green-100 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div className="ml-4">
                <h3 className="text-md font-medium">Order Placed</h3>
                <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
              </div>
            </div>
            
            <div className="relative flex items-start mb-6">
              <div className={`flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full ${
                order.orderStatus === 'processing' || order.orderStatus === 'shipped' || order.orderStatus === 'delivered'
                  ? 'bg-green-100'
                  : 'bg-gray-100'
              }`}>
                <Package className={`w-5 h-5 ${
                  order.orderStatus === 'processing' || order.orderStatus === 'shipped' || order.orderStatus === 'delivered'
                    ? 'text-green-500'
                    : 'text-gray-400'
                }`} />
              </div>
              <div className="ml-4">
                <h3 className="text-md font-medium">Processing</h3>
                <p className="text-sm text-gray-600">Your order is being prepared</p>
              </div>
            </div>
            
            <div className="relative flex items-start mb-6">
              <div className={`flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full ${
                order.orderStatus === 'shipped' || order.orderStatus === 'delivered'
                  ? 'bg-green-100'
                  : 'bg-gray-100'
              }`}>
                <Truck className={`w-5 h-5 ${
                  order.orderStatus === 'shipped' || order.orderStatus === 'delivered'
                    ? 'text-green-500'
                    : 'text-gray-400'
                }`} />
              </div>
              <div className="ml-4">
                <h3 className="text-md font-medium">Shipped</h3>
                <p className="text-sm text-gray-600">Your order is on the way</p>
              </div>
            </div>
            
            <div className="relative flex items-start">
              <div className={`flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full ${
                order.orderStatus === 'delivered'
                  ? 'bg-green-100'
                  : 'bg-gray-100'
              }`}>
                <Clock className={`w-5 h-5 ${
                  order.orderStatus === 'delivered'
                    ? 'text-green-500'
                    : 'text-gray-400'
                }`} />
              </div>
              <div className="ml-4">
                <h3 className="text-md font-medium">Delivered</h3>
                <p className="text-sm text-gray-600">Estimated delivery in 3-5 business days</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="p-6 bg-white border rounded-lg">
            <h2 className="mb-4 text-lg font-medium">Shipping Address</h2>
            <p className="font-medium">{order.shippingAddress.name}</p>
            <p className="text-gray-600">{order.shippingAddress.phone}</p>
            <p className="text-gray-600">{order.shippingAddress.street}</p>
            <p className="text-gray-600">
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
            </p>
            <p className="text-gray-600">{order.shippingAddress.country}</p>
          </div>
          
          <div className="p-6 bg-white border rounded-lg">
            <h2 className="mb-4 text-lg font-medium">Payment Information</h2>
            <p>
              <span className="font-medium">Method:</span>{" "}
              {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment"}
            </p\

