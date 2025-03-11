import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const limit = Number.parseInt(searchParams.get("limit") || "12")

    const client = await clientPromise
    const db = client.db("elegance")

    let query = {}
    if (category) {
      query = { Category: category }
    }

    const products = await db.collection("products").find(query).limit(limit).toArray()

    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

