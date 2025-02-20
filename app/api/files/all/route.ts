import { NextResponse } from "next/server"
import { getAllFiles } from "@/lib/mongodb"

export async function GET() {
  try {
    const files = await getAllFiles()

    return NextResponse.json({
      success: true,
      files,
    })
  } catch (error) {
    console.error("Failed to fetch files:", error)
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    )
  }
}
