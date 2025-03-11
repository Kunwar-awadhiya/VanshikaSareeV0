import HeroSlider from "@/components/hero-slider"
import ProductGrid from "@/components/product-grid"
import FeaturedCategories from "@/components/featured-categories"

export default function Home() {
  return (
    <div className="space-y-12">
      <HeroSlider />
      <FeaturedCategories />
      <section className="container px-4 py-8 mx-auto">
        <h2 className="mb-8 text-2xl font-medium text-center">New Arrivals</h2>
        <ProductGrid />
      </section>
      <section className="container px-4 py-8 mx-auto">
        <h2 className="mb-8 text-2xl font-medium text-center">Bestsellers</h2>
        <ProductGrid />
      </section>
    </div>
  )
}

