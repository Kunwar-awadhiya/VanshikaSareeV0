import { notFound } from "next/navigation"
import ProductGrid from "@/components/product-grid"
import clientPromise from "@/lib/db"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

// Get products by category
async function getProductsByCategory(category: string) {
  try {
    const client = await clientPromise
    const db = client.db("elegance")

    const products = await db.collection("products").find({ Category: category }).toArray()

    return products
  } catch (error) {
    console.error("Error fetching products by category:", error)
    return []
  }
}

// Get category name for display
function getCategoryDisplayName(slug: string) {
  const categoryMap: Record<string, string> = {
    saree: "Sarees",
    kurti: "Kurtis",
    gowns: "Gowns",
    "kurta-sets": "Kurta Sets",
    "plus-size": "Plus Size Collection",
  }

  return categoryMap[slug] || slug.charAt(0).toUpperCase() + slug.slice(1)
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  // Convert URL slug to category name used in database
  const categorySlug = params.slug
  let categoryName = categorySlug

  // Map URL slugs to database category names
  if (categorySlug === "kurta-sets") {
    categoryName = "kurta set"
  } else if (categorySlug === "plus-size") {
    categoryName = "plus size kurti"
  }

  const products = await getProductsByCategory(categoryName)

  if (products.length === 0) {
    notFound()
  }

  const displayName = getCategoryDisplayName(categorySlug)

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-semibold text-center">{displayName}</h1>

      <div className="mb-8">
        <p className="text-center text-gray-600">Discover our beautiful collection of {displayName.toLowerCase()}</p>
      </div>

      <ProductGrid products={products} />
    </div>
  )
}

