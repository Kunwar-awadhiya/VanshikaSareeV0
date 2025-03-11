import Link from "next/link"
import Image from "next/image"

const categories = [
  {
    id: 1,
    name: "Sarees",
    image: "/placeholder.svg?height=400&width=300",
    link: "/category/saree",
  },
  {
    id: 2,
    name: "Kurtis",
    image: "/placeholder.svg?height=400&width=300",
    link: "/category/kurti",
  },
  {
    id: 3,
    name: "Gowns",
    image: "/placeholder.svg?height=400&width=300",
    link: "/category/gowns",
  },
  {
    id: 4,
    name: "Kurta Sets",
    image: "/placeholder.svg?height=400&width=300",
    link: "/category/kurta-sets",
  },
]

export default function FeaturedCategories() {
  return (
    <section className="container px-4 py-12 mx-auto">
      <h2 className="mb-8 text-2xl font-medium text-center">Shop by Category</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map((category) => (
          <Link key={category.id} href={category.link} className="relative overflow-hidden group">
            <div className="relative w-full overflow-hidden aspect-[3/4]">
              <Image
                src={category.image || "/placeholder.svg"}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 transition-opacity bg-black/20 group-hover:bg-black/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-xl font-medium text-white">{category.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

