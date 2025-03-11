export interface Cart {
  _id?: string
  userId: string
  items: CartItem[]
  updatedAt: Date
}

export interface CartItem {
  productId: string
  name: string
  price: number
  size: string
  quantity: number
  image: string
  maxQuantity: number // Available stock
}

