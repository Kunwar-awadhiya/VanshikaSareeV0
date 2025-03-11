export interface Order {
  _id?: string
  orderId: string
  userId: string
  items: OrderItem[]
  shippingAddress: ShippingAddress
  paymentMethod: string
  paymentStatus: "pending" | "paid" | "failed"
  orderStatus: "processing" | "shipped" | "delivered" | "cancelled"
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  size: string
  quantity: number
  image: string
}

export interface ShippingAddress {
  name: string
  phone: string
  street: string
  city: string
  state: string
  postalCode: string
  country: string
}

