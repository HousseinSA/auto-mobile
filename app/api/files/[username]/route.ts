import { NextResponse } from "next/server"
import { getUserFiles } from "@/lib/mongodb"

// Update the handler signature to use NextRequest
export async function GET(
  request: Request,
  context: {
    params: {
      username: string
    }
  }
) {
  try {
    // Get username from params
    const username = String(context.params.username)

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      )
    }

    const files = await getUserFiles(username)

    if (!files?.length) {
      return NextResponse.json({ error: "No files found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      files,
    })
  } catch (error) {
    console.error("Fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    )
  }
}
