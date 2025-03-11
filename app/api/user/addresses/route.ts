import { NextResponse } from "next/server"
import { randomUUID } from "crypto"
import clientPromise from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import type { Address } from "@/lib/models/user"

// Get user addresses
export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json(user.addresses || [])
  } catch (error) {
    console.error("Error getting addresses:", error)
    return NextResponse.json({ error: "Failed to get addresses" }, { status: 500 })
  }
}

// Add new address
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const addressData = await request.json()

    // Validate required fields
    const requiredFields = ["name", "phone", "street", "city", "state", "postalCode", "country"]
    for (const field of requiredFields) {
      if (!addressData[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    const client = await clientPromise
    const db = client.db("elegance")

    // Create new address
    const newAddress: Address = {
      id: randomUUID(),
      name: addressData.name,
      phone: addressData.phone,
      street: addressData.street,
      city: addressData.city,
      state: addressData.state,
      postalCode: addressData.postalCode,
      country: addressData.country,
      isDefault: addressData.isDefault || false,
    }

    // Get current addresses
    const addresses = user.addresses || []

    // If this is the first address or marked as default, update all others
    if (newAddress.isDefault || addresses.length === 0) {
      addresses.forEach((address) => {
        address.isDefault = false
      })

      // If it's the first address, make it default
      if (addresses.length === 0) {
        newAddress.isDefault = true
      }
    }

    // Add new address
    addresses.push(newAddress)

    // Update user
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          addresses,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json(newAddress)
  } catch (error) {
    console.error("Error adding address:", error)
    return NextResponse.json({ error: "Failed to add address" }, { status: 500 })
  }
}

// Update address
export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id, ...addressData } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("elegance")

    // Get current addresses
    const addresses = user.addresses || []

    // Find address to update
    const addressIndex = addresses.findIndex((addr) => addr.id === id)

    if (addressIndex === -1) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    // Update address
    const updatedAddress = {
      ...addresses[addressIndex],
      ...addressData,
    }

    addresses[addressIndex] = updatedAddress

    // If this address is marked as default, update all others
    if (updatedAddress.isDefault) {
      addresses.forEach((address, index) => {
        if (index !== addressIndex) {
          address.isDefault = false
        }
      })
    }

    // Update user
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          addresses,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json(updatedAddress)
  } catch (error) {
    console.error("Error updating address:", error)
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 })
  }
}

// Delete address
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("elegance")

    // Get current addresses
    const addresses = user.addresses || []

    // Find address to delete
    const addressIndex = addresses.findIndex((addr) => addr.id === id)

    if (addressIndex === -1) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    // Check if it's the default address
    const isDefault = addresses[addressIndex].isDefault

    // Remove address
    addresses.splice(addressIndex, 1)

    // If it was the default address and there are other addresses, make the first one default
    if (isDefault && addresses.length > 0) {
      addresses[0].isDefault = true
    }

    // Update user
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: {
          addresses,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting address:", error)
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 })
  }
}

