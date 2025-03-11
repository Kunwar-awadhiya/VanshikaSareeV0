import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import clientPromise from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

// Get all products (admin)
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("elegance")

    const products = await db.collection("products").find({}).sort({ Name: 1 }).toArray()

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error getting products:", error)
    return NextResponse.json({ error: "Failed to get products" }, { status: 500 })
  }
}

// Add new product (admin)
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const productData = await request.json()

    // Validate required fields
    const requiredFields = ["Name", "Category", "Price", "Quantity", "Description"]
    for (const field of requiredFields) {
      if (!productData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    const client = await clientPromise
    const db = client.db("elegance")

    // Create new product
    const newProduct = {
      productid: randomUUID(),
      image: productData.image || "/placeholder.svg?height=600&width=450",
      Name: productData.Name,
      Category: productData.Category,
      Price: productData.Price,
      Tags: productData.Tags || [],
      Quantity: productData.Quantity,
      Description: productData.Description,
    }

    await db.collection("products").insertOne(newProduct)

    return NextResponse.json(newProduct)
  } catch (error) {
    console.error("Error adding product:", error)
    return NextResponse.json({ error: "Failed to add product" }, { status: 500 })
  }
}

