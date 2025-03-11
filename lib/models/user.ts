export interface User {
  _id?: string
  email: string
  name?: string
  phone?: string
  emailVerified: boolean
  role: "user" | "admin"
  addresses?: Address[]
  createdAt: Date
  updatedAt: Date
}

export interface Address {
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

