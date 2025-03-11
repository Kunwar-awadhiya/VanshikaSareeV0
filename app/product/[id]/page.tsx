import Image from "next/image"
import { notFound } from "next/navigation"
import AddToCartButton from "@/components/add-to-cart-button"
import WishlistButton from "@/components/wishlist-button"

// In a real app, this would fetch from your database
async function getProduct(id: string) {
  // Mock product data
  const products = [
    {
      id: "1",
      name: "Floral Embroidered Saree",
      collection: "Summer Collection",
      price: 4999,
      image: "/placeholder.svg?height=600&width=450",
      category: "saree",
      description: {
        color: "Pink",
        collection: "Summer Collection",
        material: "Silk",
        work: "Embroidery",
        occasion: ["Wedding", "Party"],
        wash_care: "Dry clean only",
        length: 5.5,
        blouse: 0.8,
        pattern: "Floral",
      },
      sizes: ["Free Size"],
      quantity: { "Free Size": 10 },
    },
    // More products would be here
  ]

  const product = products.find((p) => p.id === id)
  return product
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Product Images */}
        <div className="relative overflow-hidden aspect-square">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" priority />
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold">{product.name}</h1>
            <p className="mt-1 text-sm text-gray-500">{product.collection}</p>
          </div>

          <div>
            <p className="text-2xl font-semibold">{formatPrice(product.price)}</p>
            <p className="mt-1 text-sm text-gray-500">Including all taxes</p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <h2 className="mb-2 text-sm font-medium">Size</h2>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button key={size} className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:border-primary">
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <AddToCartButton product={product} />
            <WishlistButton product={product} />
          </div>

          <div className="pt-6 border-t border-gray-200">
            <h2 className="mb-4 text-lg font-medium">Product Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium">Color</p>
                <p>{product.description.color}</p>
              </div>
              <div>
                <p className="font-medium">Material</p>
                <p>{product.description.material}</p>
              </div>
              <div>
                <p className="font-medium">Work</p>
                <p>{product.description.work}</p>
              </div>
              <div>
                <p className="font-medium">Pattern</p>
                <p>{product.description.pattern}</p>
              </div>
              <div>
                <p className="font-medium">Occasion</p>
                <p>{product.description.occasion.join(", ")}</p>
              </div>
              <div>
                <p className="font-medium">Wash Care</p>
                <p>{product.description.wash_care}</p>
              </div>
              {product.description.length && (
                <div>
                  <p className="font-medium">Length</p>
                  <p>{product.description.length} meters</p>
                </div>
              )}
              {product.description.blouse && (
                <div>
                  <p className="font-medium">Blouse</p>
                  <p>{product.description.blouse} meters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

