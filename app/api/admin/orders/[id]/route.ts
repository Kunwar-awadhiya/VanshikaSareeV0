import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

// Get order by ID (admin)
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("elegance")

    const order = await db.collection("orders").findOne({ orderId: params.id })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error getting order:", error)
    return NextResponse.json({ error: "Failed to get order" }, { status: 500 })
  }
}

// Update order status (admin)
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { orderStatus, paymentStatus } = await request.json()

    const client = await clientPromise
    const db = client.db("elegance")

    // Check if order exists
    const existingOrder = await db.collection("orders").findOne({ orderId: params.id })

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Update order
    const updateData: any = { updatedAt: new Date() }

    if (orderStatus) {
      updateData.orderStatus = orderStatus
    }

    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus
    }

    await db.collection("orders").updateOne({ orderId: params.id }, { $set: updateData })

    const updatedOrder = await db.collection("orders").findOne({ orderId: params.id })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}

