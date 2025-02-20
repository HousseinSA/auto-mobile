import { NextResponse } from "next/server"
import { getUserFiles } from "@/lib/mongodb"

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const username = String(params.username)
    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      )
    }

    const files = await getUserFiles(username)

    if (!files?.length) {
      return NextResponse.json(
        { error: "Aucun fichier trouvé" },
        { status: 404 }
      )
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
