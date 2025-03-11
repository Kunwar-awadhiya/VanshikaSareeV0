import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="container px-4 py-12 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase">About Us</h3>
            <p className="text-sm text-gray-600">
              Elegance offers premium quality ethnic wear for women, crafted with love and attention to detail.
            </p>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-primary">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/collection" className="text-gray-600 hover:text-primary">
                  New Collection
                </Link>
              </li>
              <li>
                <Link href="/sale" className="text-gray-600 hover:text-primary">
                  Sale
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-primary">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase">Newsletter</h3>
            <p className="mb-4 text-sm text-gray-600">
              Subscribe to receive updates, access to exclusive deals, and more.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-primary"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-r-md hover:bg-primary/90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="pt-8 mt-8 text-sm text-center text-gray-600 border-t border-gray-100">
          <p>&copy; {new Date().getFullYear()} Elegance. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

