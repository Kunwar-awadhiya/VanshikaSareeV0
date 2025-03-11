import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

// Get admin dashboard stats
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("elegance")

    // Get total products
    const totalProducts = await db.collection("products").countDocuments()

    // Get total orders
    const totalOrders = await db.collection("orders").countDocuments()

    // Get total revenue
    const orders = await db.collection("orders").find({}).toArray()
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)

    // Get total users
    const totalUsers = await db.collection("users").countDocuments()

    // Get low stock products
    const lowStockProducts = await db
      .collection("products")
      .find({
        $or: [
          { "Quantity.S": { $lt: 5, $gt: 0 } },
          { "Quantity.M": { $lt: 5, $gt: 0 } },
          { "Quantity.L": { $lt: 5, $gt: 0 } },
          { "Quantity.XL": { $lt: 5, $gt: 0 } },
          { "Quantity.Free Size": { $lt: 5, $gt: 0 } },
        ],
      })
      .toArray()

    // Get recent orders
    const recentOrders = await db.collection("orders").find({}).sort({ createdAt: -1 }).limit(5).toArray()

    // Get sales by category
    const products = await db.collection("products").find({}).toArray()
    const categorySales: Record<string, number> = {}

    for (const order of orders) {
      for (const item of order.items) {
        const product = products.find((p) => p.productid === item.productId)
        if (product) {
          const category = product.Category
          categorySales[category] = (categorySales[category] || 0) + item.price * item.quantity
        }
      }
    }

    // Get monthly sales data
    const monthlySales: Record<string, number> = {}

    for (const order of orders) {
      const date = new Date(order.createdAt)
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      monthlySales[monthYear] = (monthlySales[monthYear] || 0) + order.total
    }

    return NextResponse.json({
      totalProducts,
      totalOrders,
      totalRevenue,
      totalUsers,
      lowStockProducts,
      recentOrders,
      categorySales,
      monthlySales,
    })
  } catch (error) {
    console.error("Error getting stats:", error)
    return NextResponse.json({ error: "Failed to get stats" }, { status: 500 })
  }
}

