
import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import { createSession } from "@/lib/auth"
import { cookies } from "next/headers"
import bcrypt from "bcryptjs"

// Step 1: Request OTP for signup
export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("elegance")

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })

    if (existingUser && existingUser.password) {
      return NextResponse.json({ error: "User already exists. Please login instead." }, { status: 400 })
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Store OTP in database with expiration (15 minutes)
    await db.collection("otps").updateOne(
      { email },
      {
        $set: {
          otp,
          type: "signup",
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        },
      },
      { upsert: true },
    )

    // In a real application, send the OTP via email
    // For demo purposes, we'll return the OTP in the response
    return NextResponse.json({
      message: "OTP sent successfully",
      otp, // Remove this in production
    })
  } catch (error) {
    console.error("Error generating OTP:", error)
    return NextResponse.json({ error: "Failed to generate OTP" }, { status: 500 })
  }
}


export async function PUT(request: Request) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("elegance")

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if user already exists
    let user = await db.collection("users").findOne({ email })

    if (user) {
      // Update existing user
      await db.collection("users").updateOne(
        { _id: user._id },
        {
          $set: {
            password: hashedPassword,
            name: name || user.name,
            emailVerified: true,
            updatedAt: new Date(),
          },
        },
      )

      user = await db.collection("users").findOne({ _id: user._id })
    } else {
      // Create new user
      const result = await db.collection("users").insertOne({
        email,
        password: hashedPassword,
        name: name || "",
        emailVerified: true,
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
      })

      user = await db.collection("users").findOne({ _id: result.insertedId })
    }

    // Create session
    const sessionId = await createSession(user._id)

    if (!sessionId) {
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }

    // Set session cookie
    cookies().set({
      name: "sessionId",
      value: sessionId,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: "lax",
    })

    return NextResponse.json({
      success: true,
      user: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Error creating account:", error)
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}
