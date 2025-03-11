import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

// Get wishlist
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("elegance")

    let wishlist = await db.collection("wishlists").findOne({ userId: user._id })

    if (!wishlist) {
      // Create empty wishlist if it doesn't exist
      wishlist = {
        userId: user._id,
        items: [],
        updatedAt: new Date(),
      }

      await db.collection("wishlists").insertOne(wishlist)
    }

    return NextResponse.json(wishlist)
  } catch (error) {
    console.error("Error getting wishlist:", error)
    return NextResponse.json({ error: "Failed to get wishlist" }, { status: 500 })
  }
}

// Add item to wishlist
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("elegance")

    // Get product details
    const product = await db.collection("products").findOne({ productid: productId })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Get or create wishlist
    let wishlist = await db.collection("wishlists").findOne({ userId: user._id })

    if (!wishlist) {
      wishlist = {
        userId: user._id,
        items: [],
        updatedAt: new Date(),
      }

      await db.collection("wishlists").insertOne(wishlist)
    }

    // Check if item already exists in wishlist
    const existingItem = wishlist.items.find((item: any) => item.productId === productId)

    if (existingItem) {
      return NextResponse.json({ error: "Item already in wishlist" }, { status: 400 })
    }

    // Add new item
    wishlist.items.push({
      productId,
      name: product.Name,
      price: product.Price,
      image: product.image,
      addedAt: new Date(),
    })

    // Update wishlist
    await db.collection("wishlists").updateOne(
      { userId: user._id },
      {
        $set: {
          items: wishlist.items,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json(wishlist)
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 })
  }
}

// Remove item from wishlist
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("elegance")

    // Get wishlist
    const wishlist = await db.collection("wishlists").findOne({ userId: user._id })

    if (!wishlist) {
      return NextResponse.json({ error: "Wishlist not found" }, { status: 404 })
    }

    // Remove item from wishlist
    const updatedItems = wishlist.items.filter((item: any) => item.productId !== productId)

    // Update wishlist
    await db.collection("wishlists").updateOne(
      { userId: user._id },
      {
        $set: {
          items: updatedItems,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 })
  }
}

