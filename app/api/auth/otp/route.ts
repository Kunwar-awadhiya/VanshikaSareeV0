
import { NextResponse } from "next/server"
import clientPromise from "@/lib/db"
// In a real app, you would use a proper email service like SendGrid, Mailgun, etc.
// import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    const client = await clientPromise
    const db = client.db("elegance")

    // Store OTP in database with expiration (15 minutes)
    await db.collection("otps").updateOne(
      { email },
      {
        $set: {
          otp,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        },
      },
      { upsert: true },
    )

    // In a real application, send the OTP via email
    // await sendEmail({
    //   to: email,
    //   subject: 'Your OTP for Elegance',
    //   text: `Your OTP is: ${otp}. It will expire in 15 minutes.`
    // });

    // For demo purposes, we'll return the OTP in the response
    // In production, you would NOT do this
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
    const { email, otp } = await request.json()

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

    // OTP is valid, create or update user
    await db.collection("users").updateOne(
      { email },
      {
        $set: {
          email,
          emailVerified: true,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true },
    )

    // Delete the used OTP
    await db.collection("otps").deleteOne({ _id: otpRecord._id })

    return NextResponse.json({
      message: "Email verified successfully",
    })
  } catch (error) {
    console.error("Error verifying OTP:", error)
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 })
  }
}
