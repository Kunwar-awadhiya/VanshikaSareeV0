export interface Wishlist {
  _id?: string
  userId: string
  items: WishlistItem[]
  updatedAt: Date
}

export interface WishlistItem {
  productId: string
  name: string
  price: number
  image: string
  addedAt: Date
}

