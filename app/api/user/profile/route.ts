import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

// Get user profile
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Remove sensitive information
    const { _id, ...profile } = user

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error getting profile:", error)
    return NextResponse.json({ error: "Failed to get profile" }, { status: 500 })
  }
}

// Update user profile
export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, phone } = await request.json()

    const client = await clientPromise
    const db = client.db("elegance")

    // Update user
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          name,
          phone,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        name,
        phone,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

