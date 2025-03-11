import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

// Get user orders
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("elegance")

    const orders = await db.collection("orders").find({ userId: user._id }).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error getting orders:", error)
    return NextResponse.json({ error: "Failed to get orders" }, { status: 500 })
  }
}

