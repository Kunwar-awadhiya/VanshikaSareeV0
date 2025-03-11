"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import AdminLayout from "@/components/admin/layout"

interface Product {
  productid: string
  Name: string
  Category: string
  Price: number
  image: string
  Quantity: Record<string, number>
}

export default function AdminProducts() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/admin/products")

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login")
            return
          }
          throw new Error("Failed to fetch products")
        }

        const data = await response.json()
        setProducts(data)
      } catch (err) {
        setError("Error loading products")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [router])

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete product")
      }

      // Remove product from state
      setProducts(products.filter((product) => product.productid !== productId))
    } catch (err) {
      alert("Error deleting product")
      console.error(err)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getTotalStock = (quantities: Record<string, number>) => {
    return Object.values(quantities).reduce((sum, qty) => sum + qty, 0)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.Category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="p-4 text-red-500">{error}</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col items-start justify-between mb-6 md:flex-row md:items-center">
          <h1 className="mb-4 text-2xl font-bold md:mb-0">Products</h1>

          <div className="flex flex-col w-full gap-4 md:flex-row md:w-auto">
            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 border border-gray-300 rounded-md md:w-64 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Link
              href="/admin/products/new"
              className="flex items-center justify-center px-4 py-2 text-white bg-primary rounded-md hover:bg-primary/90"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Product
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.productid} className="border-b">
                  <td className="p-4">
                    <div className="relative w-16 h-16 overflow-hidden rounded-md">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.Name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-4">{product.Name}</td>
                  <td className="p-4">{product.Category}</td>
                  <td className="p-4">{formatPrice(product.Price)}</td>
                  <td className="p-4">{getTotalStock(product.Quantity)}</td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/products/edit/${product.productid}`}
                        className="p-2 text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.productid)}
                        className="p-2 text-red-600 bg-red-100 rounded-md hover:bg-red-200"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

