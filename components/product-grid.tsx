"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingBag } from "lucide-react"
import { useRouter } from "next/navigation"

interface Product {
  productid: string
  Name: string
  Collection?: string
  Price: number
  image: string
  Category: string
  Description?: {
    Collection?: string
  }
}

interface ProductGridProps {
  products?: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const router = useRouter()
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [addingToWishlist, setAddingToWishlist] = useState<string | null>(null)

  // Use mock data if no products are provided
  const displayProducts = products || [
    {
      productid: "1",
      Name: "Floral Embroidered Saree",
      Collection: "Summer Collection",
      Price: 4999,
      image: "/placeholder.svg?height=600&width=450",
      Category: "saree",
    },
    {
      productid: "2",
      Name: "Printed Cotton Kurti",
      Collection: "Casual Wear",
      Price: 1499,
      image: "/placeholder.svg?height=600&width=450",
      Category: "kurti",
    },
    {
      productid: "3",
      Name: "Designer Party Gown",
      Collection: "Evening Wear",
      Price: 6999,
      image: "/placeholder.svg?height=600&width=450",
      Category: "gowns",
    },
    {
      productid: "4",
      Name: "Embellished Kurta Set",
      Collection: "Festive Collection",
      Price: 3999,
      image: "/placeholder.svg?height=600&width=450",
      Category: "kurta-sets",
    },
    {
      productid: "5",
      Name: "Banarasi Silk Saree",
      Collection: "Wedding Collection",
      Price: 8999,
      image: "/placeholder.svg?height=600&width=450",
      Category: "saree",
    },
    {
      productid: "6",
      Name: "Anarkali Kurti",
      Collection: "Ethnic Wear",
      Price: 2499,
      image: "/placeholder.svg?height=600&width=450",
      Category: "kurti",
    },
    {
      productid: "7",
      Name: "Sequined Evening Gown",
      Collection: "Party Wear",
      Price: 5999,
      image: "/placeholder.svg?height=600&width=450",
      Category: "gowns",
    },
    {
      productid: "8",
      Name: "Embroidered Kurta Palazzo Set",
      Collection: "Summer Collection",
      Price: 4499,
      image: "/placeholder.svg?height=600&width=450",
      Category: "kurta-sets",
    },
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getCollection = (product: Product) => {
    return product.Collection || product.Description?.Collection || ""
  }

  const addToWishlist = async (productId: string) => {
    setAddingToWishlist(productId)

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId }),
      })

      if (!response.ok) {
        const data = await response.json()
        if (response.status === 401) {
          // User is not logged in, redirect to login
          router.push("/login")
          return
        }
        throw new Error(data.error || "Failed to add to wishlist")
      }

      // Show success message
      alert("Product added to wishlist")
    } catch (error) {
      console.error("Error adding to wishlist:", error)
      alert(error instanceof Error ? error.message : "Failed to add to wishlist")
    } finally {
      setAddingToWishlist(null)
    }
  }

  const addToCart = async (productId: string) => {
    setAddingToCart(productId)

    try {
      // For simplicity, we're adding with default size and quantity
      // In a real app, you'd want to select these before adding
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
        const data = await response.json()
        if (response.status === 401) {
          // User is not logged in, redirect to login
          router.push("/login")
          return
        }
        throw new Error(data.error || "Failed to add to cart")
      }

      // Show success message
      alert("Product added to cart")
    } catch (error) {
      console.error("Error adding to cart:", error)
      alert(error instanceof Error ? error.message : "Failed to add to cart")
    } finally {
      setAddingToCart(null)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {displayProducts.map((product) => (
        <div
          key={product.productid}
          className="group"
          onMouseEnter={() => setHoveredProduct(product.productid)}
          onMouseLeave={() => setHoveredProduct(null)}
        >
          <div className="relative overflow-hidden">
            <Link href={`/product/${product.productid}`}>
              <div className="relative w-full overflow-hidden aspect-[3/4]">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.Name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </Link>

            {/* Tag (can be used for "Sale" or "New" tags) */}
            <div className="absolute top-2 left-2 px-2 py-1 text-xs font-medium bg-white">New</div>

            {/* Action buttons that appear on hover */}
            <div
              className={`absolute bottom-4 right-4 flex space-x-2 transition-opacity duration-300 ${
                hoveredProduct === product.productid ? "opacity-100" : "opacity-0"
              }`}
            >
              <button
                className="p-2 text-gray-800 transition-colors bg-white rounded-full hover:text-primary disabled:bg-gray-200 disabled:text-gray-400"
                aria-label="Add to wishlist"
                onClick={() => addToWishlist(product.productid)}
                disabled={addingToWishlist === product.productid}
              >
                <Heart size={18} />
              </button>
              <button
                className="p-2 text-gray-800 transition-colors bg-white rounded-full hover:text-primary disabled:bg-gray-200 disabled:text-gray-400"
                aria-label="Add to cart"
                onClick={() => addToCart(product.productid)}
                disabled={addingToCart === product.productid}
              >
                <ShoppingBag size={18} />
              </button>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <h3 className="font-medium">
              <Link href={`/product/${product.productid}`} className="hover:text-primary">
                {product.Name}
              </Link>
            </h3>
            <p className="text-sm text-gray-500">{getCollection(product)}</p>
            <p className="font-medium">{formatPrice(product.Price)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

