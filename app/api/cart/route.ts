
import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

// Get cart
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("elegance")

    let cart = await db.collection("carts").findOne({ userId: user._id })

    if (!cart) {
      // Create empty cart if it doesn't exist
      cart = {
        userId: user._id,
        items: [],
        updatedAt: new Date(),
      }

      await db.collection("carts").insertOne(cart)
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.error("Error getting cart:", error)
    return NextResponse.json({ error: "Failed to get cart" }, { status: 500 })
  }
}

// Add item to cart
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId, size, quantity } = await request.json()

    if (!productId || !size || !quantity) {
      return NextResponse.json({ error: "Product ID, size, and quantity are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("elegance")

    // Get product details
    const product = await db.collection("products").findOne({ productid: productId })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if size is available
    if (!product.Quantity[size]) {
      return NextResponse.json({ error: "Size not available" }, { status: 400 })
    }

    // Check if quantity is available
    if (product.Quantity[size] < quantity) {
      return NextResponse.json({ error: "Not enough stock available" }, { status: 400 })
    }

    // Get or create cart
    let cart = await db.collection("carts").findOne({ userId: user._id })

    if (!cart) {
      cart = {
        userId: user._id,
        items: [],
        updatedAt: new Date(),
      }

      await db.collection("carts").insertOne(cart)
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex((item: any) => item.productId === productId && item.size === size)

    if (existingItemIndex > -1) {
      // Update existing item
      const newQuantity = cart.items[existingItemIndex].quantity + quantity

      // Check if new quantity is available
      if (product.Quantity[size] < newQuantity) {
        return NextResponse.json({ error: "Not enough stock available" }, { status: 400 })
      }

      cart.items[existingItemIndex].quantity = newQuantity
    } else {
      // Add new item
      cart.items.push({
        productId,
        name: product.Name,
        price: product.Price,
        size,
        quantity,
        image: product.image,
        maxQuantity: product.Quantity[size],
      })
    }

    // Update cart
    await db.collection("carts").updateOne(
      { userId: user._id },
      {
        $set: {
          items: cart.items,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json(cart)
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}

// Update cart item
export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { productId, size, quantity } = await request.json()

    if (!productId || !size || quantity === undefined) {
      return NextResponse.json({ error: "Product ID, size, and quantity are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("elegance")

    // Get cart
    const cart = await db.collection("carts").findOne({ userId: user._id })

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex((item: any) => item.productId === productId && item.size === size)

    if (itemIndex === -1) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 })
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or negative
      cart.items.splice(itemIndex, 1)
    } else {
      // Get product to check available quantity
      const product = await db.collection("products").findOne({ productid: productId })

      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }

      // Check if quantity is available
      if (product.Quantity[size] < quantity) {
        return NextResponse.json({ error: "Not enough stock available" }, { status: 400 })
      }

      // Update quantity
      cart.items[itemIndex].quantity = quantity
      cart.items[itemIndex].maxQuantity = product.Quantity[size]
    }

    // Update cart
    await db.collection("carts").updateOne(
      { userId: user._id },
      {
        $set: {
          items: cart.items,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json(cart)
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}







