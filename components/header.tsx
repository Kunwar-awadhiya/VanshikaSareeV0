/*

"use client"

import { useState } from "react"
import Link from "next/link"
import { User, Heart, ShoppingBag, Menu, X } from "lucide-react"
import { usePathname } from "next/navigation"
import NavBar from "./navbar"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          <button className="p-2 md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

      
          <div className="hidden md:block md:w-1/4"></div>

       
          <div className="flex items-center justify-center md:w-1/2">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-semibold tracking-wider text-center">ELEGANCE</span>
            </Link>
          </div>

        
          <div className="flex items-center justify-end space-x-4 md:w-1/4">
            <Link href="/account" className="p-1 transition-colors hover:text-primary">
              <User size={20} />
              <span className="sr-only">Account</span>
            </Link>
            <Link href="/wishlist" className="p-1 transition-colors hover:text-primary">
              <Heart size={20} />
              <span className="sr-only">Wishlist</span>
            </Link>
            <Link href="/cart" className="p-1 transition-colors hover:text-primary">
              <ShoppingBag size={20} />
              <span className="sr-only">Cart</span>
            </Link>
          </div>
        </div>

      
        <div className="hidden md:block">
          <NavBar />
        </div>
      </div>

     
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col pt-20 bg-white md:hidden">
          <div className="container px-4 py-6 mx-auto">
            <NavBar mobile={true} />
          </div>
        </div>
      )}
    </header>
  )
}

*/



"use client";

import { useState } from "react";
import Link from "next/link";
import { User, Heart, ShoppingBag, Menu, X, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import NavBar from "./navbar"
import axios from "axios";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();


  /*
  const handleLogout = async () => {
    try {
      await axios.post("/api/logout"); // Backend API call to clear session
      router.push("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  */
  const handleLogout = async () => {
    try {
  //    const response = await axios.post("/api/logout");
      const response = await axios.post("/api/auth/logout")
  
      if (response.data.success) {
        // Remove session cookie from client-side (optional, since server clears it)
        document.cookie = "sessionId=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
  
        // Redirect to login page
        router.push("/login");
      } else {
        console.error("Logout failed:", response.data.error);
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile menu button */}
          <button
            className="p-2 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Left space for desktop */}
          <div className="hidden md:block md:w-1/4"></div>

          {/* Logo */}
          <div className="flex items-center justify-center md:w-1/2">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-semibold tracking-wider text-center">
                ELEGANCE
              </span>
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center justify-end space-x-4 md:w-1/4">

          {/** 
            <Link href="/account" className="p-1 transition-colors hover:text-primary">
              <User size={20} />
              <span className="sr-only">Account</span>
            </Link>
            */}

            <Link href="/wishlist" className="p-1 transition-colors hover:text-primary">
              <Heart size={20} />
              <span className="sr-only">Wishlist</span>
            </Link>
            <Link href="/cart" className="p-1 transition-colors hover:text-primary">
              <ShoppingBag size={20} />
              <span className="sr-only">Cart</span>
            </Link>

            {/* Logout Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center justify-center w-8 h-8 overflow-hidden bg-gray-200 rounded-full hover:bg-gray-300"
              >
                <User size={18} />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-40">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="hidden md:block">
          <NavBar />
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col pt-20 bg-white md:hidden">
          <div className="container px-4 py-6 mx-auto">
            <NavBar mobile={true} />
          </div>
        </div>
      )}
    </header>
  );
}

