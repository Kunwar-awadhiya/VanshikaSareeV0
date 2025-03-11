"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin/layout"
import ProductForm from "@/components/admin/product-form"

export default function NewProduct() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (productData: any) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create product")
      }

      router.push("/admin/products")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold">Add New Product</h1>

        {error && <div className="p-4 mb-6 text-red-800 bg-red-100 rounded-md">{error}</div>}

        <ProductForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </AdminLayout>
  )
}

