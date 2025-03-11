"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin/layout"
import ProductForm from "@/components/admin/product-form"

export default function EditProduct({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchProduct() {
      try {
        const response = await fetch(`/api/admin/products/${params.id}`)

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/login")
            return
          }
          throw new Error("Failed to fetch product")
        }

        const data = await response.json()
        setProduct(data)
      } catch (err) {
        setError("Error loading product")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id, router])

  const handleSubmit = async (productData: any) => {
    setSubmitting(true)
    setError("")

    try {
      const response = await fetch(`/api/admin/products/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update product")
      }

      router.push("/admin/products")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="w-16 h-16 border-t-4 border-primary border-solid rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    )
  }

  if (!product && !loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="p-4 text-red-800 bg-red-100 rounded-md">Product not found</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="mb-6 text-2xl font-bold">Edit Product</h1>

        {error && <div className="p-4 mb-6 text-red-800 bg-red-100 rounded-md">{error}</div>}

        <ProductForm initialData={product} onSubmit={handleSubmit} loading={submitting} />
      </div>
    </AdminLayout>
  )
}

