import Link from "next/link"

interface NavBarProps {
  mobile?: boolean
}

export default function NavBar({ mobile = false }: NavBarProps) {
  const navItems = [
    { name: "Collection", href: "/collection" },
    { name: "Saree", href: "/category/saree" },
    { name: "Kurti", href: "/category/kurti" },
    { name: "Plus Size", href: "/category/plus-size" },
    { name: "Gowns", href: "/category/gowns" },
    { name: "Kurta Sets", href: "/category/kurta-sets" },
    { name: "Sale", href: "/sale" },
    { name: "Last in Stock", href: "/last-in-stock" },
    { name: "Blog", href: "/blog" },
  ]

  return (
    <nav className={`${mobile ? "flex flex-col space-y-4" : "flex justify-center space-x-6"}`}>
      {navItems.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={`text-sm font-medium transition-colors hover:text-primary ${
            mobile ? "py-2 border-b border-gray-100" : "py-4"
          }`}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  )
}

