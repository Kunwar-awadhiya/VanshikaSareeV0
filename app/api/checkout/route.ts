import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import clientPromise from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { shippingAddress, paymentMethod } = await request.json()

    if (!shippingAddress || !paymentMethod) {
      return NextResponse.json({ error: "Shipping address and payment method are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("elegance")

    // Get cart
    const cart = await db.collection("carts").findOne({ userId: user._id })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Validate cart items and calculate totals
    let subtotal = 0
    const orderItems = []

    for (const item of cart.items) {
      // Get product to check availability
      const product = await db.collection("products").findOne({ productid: item.productId })

      if (!product) {
        return NextResponse.json({ error: `Product ${item.name} not found` }, { status: 400 })
      }

      // Check if size is available
      if (!product.Quantity[item.size]) {
        return NextResponse.json({ error: `Size ${item.size} for ${item.name} is not available` }, { status: 400 })
      }

      // Check if quantity is available
      if (product.Quantity[item.size] < item.quantity) {
        return NextResponse.json({ error: `Not enough stock for ${item.name} in size ${item.size}` }, { status: 400 })
      }

      // Add to order items
      orderItems.push({
        productId: item.productId,
        name: item.name,
        price: item.price,
        size: item.size,
        quantity: item.quantity,
        image: item.image,
      })

      // Calculate subtotal
      subtotal += item.price * item.quantity

      // Update product quantity
      const newQuantity = product.Quantity[item.size] - item.quantity
      product.Quantity[item.size] = newQuantity

      await db.collection("products").updateOne({ productid: item.productId }, { $set: { Quantity: product.Quantity } })
    }

    // Calculate shipping, tax, and total
    const shippingCost = subtotal > 1000 ? 0 : 100 // Free shipping over ₹1000
    const tax = Math.round(subtotal * 0.18) // 18% GST
    const total = subtotal + shippingCost + tax

    // Create order
    const order = {
      orderId: randomUUID(),
      userId: user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: "paid", // Assuming payment is successful
      orderStatus: "processing",
      subtotal,
      shippingCost,
      tax,
      total,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.collection("orders").insertOne(order)

    // Clear cart
    await db.collection("carts").updateOne({ userId: user._id }, { $set: { items: [], updatedAt: new Date() } })

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

