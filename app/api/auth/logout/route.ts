import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { destroySession } from "@/lib/auth"

export async function POST() {
  try {
    const cookieStore = cookies()
    const sessionId = cookieStore.get("sessionId")?.value

    if (sessionId) {
      await destroySession(sessionId)
    }

    // Clear the session cookie
    cookies().set({
      name: "sessionId",
      value: "",
      httpOnly: true,
      path: "/",
      expires: new Date(0),
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error logging out:", error)
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 })
  }
}

