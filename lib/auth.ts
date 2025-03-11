import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/db"
import type { User } from "@/lib/models/user"

export async function getSession() {
  const cookieStore = cookies()
  const sessionId = cookieStore.get("sessionId")?.value

  if (!sessionId) {
    return null
  }

  try {
    const client = await clientPromise
    const db = client.db("elegance")

    const session = await db.collection("sessions").findOne({ sessionId })

    if (!session) {
      return null
    }

    // Check if session is expired
    if (new Date(session.expiresAt) < new Date()) {
      await db.collection("sessions").deleteOne({ sessionId })
      return null
    }

    const user = await db.collection("users").findOne({ _id: session.userId })

    if (!user) {
      return null
    }

    return { user, sessionId }
  } catch (error) {
    console.error("Error getting session:", error)
    return null
  }
}

export async function createSession(userId: string) {
  const sessionId = crypto.randomUUID()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days from now

  try {
    const client = await clientPromise
    const db = client.db("elegance")

    await db.collection("sessions").insertOne({
      sessionId,
      userId,
      createdAt: new Date(),
      expiresAt,
    })

    return sessionId
  } catch (error) {
    console.error("Error creating session:", error)
    return null
  }
}

export async function destroySession(sessionId: string) {
  try {
    const client = await clientPromise
    const db = client.db("elegance")

    await db.collection("sessions").deleteOne({ sessionId })

    return true
  } catch (error) {
    console.error("Error destroying session:", error)
    return false
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession()

  if (!session) {
    return null
  }

  return session.user as User
}

export async function requireAuth(request: NextRequest) {
  const session = await getSession()

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return null
}

export async function requireAdmin(request: NextRequest) {
  const session = await getSession()

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (session.user.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return null
}

