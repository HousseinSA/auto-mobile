import { NextResponse } from "next/server"
import { getAllServices } from "@/lib/mongodb/mongodb"

export async function GET() {
  try {
    const services = await getAllServices()

    return NextResponse.json({
      success: true,
      services,
    })
  } catch (error) {
    console.error("Fetch all services error:", error)
    return NextResponse.json(
      { status: 500 }
    )
  }
}
