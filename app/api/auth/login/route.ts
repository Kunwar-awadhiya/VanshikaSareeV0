import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import clientPromise from "@/lib/db"
import { createSession } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password, otp } = await request.json()

    // Check if this is an OTP login or password login
    if (otp) {
      // OTP login flow
      if (!email || !otp) {
        return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 })
      }

      const client = await clientPromise
      const db = client.db("elegance")

      // Find the OTP record
      const otpRecord = await db.collection("otps").findOne({
        email,
        otp,
        expiresAt: { $gt: new Date() },
      })

      if (!otpRecord) {
        return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 })
      }

      // Find or create user
      let user = await db.collection("users").findOne({ email })

      if (!user) {
        // Create new user
        const result = await db.collection("users").insertOne({
          email,
          emailVerified: true,
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        })

        user = await db.collection("users").findOne({ _id: result.insertedId })
      } else {
        // Update existing user
        await db.collection("users").updateOne(
          { _id: user._id },
          {
            $set: {
              emailVerified: true,
              updatedAt: new Date(),
            },
          },
        )
      }

      // Delete the used OTP
      await db.collection("otps").deleteOne({ _id: otpRecord._id })

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
    } else {
      // Password login flow
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
      }

      const client = await clientPromise
      const db = client.db("elegance")

      // Find user
      const user = await db.collection("users").findOne({ email })

      if (!user || !user.password) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 400 })
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password)

      if (!isPasswordValid) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 400 })
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
    }
  } catch (error) {
    console.error("Error logging in:", error)
    return NextResponse.json({ error: "Failed to log in" }, { status: 500 })
  }
}

