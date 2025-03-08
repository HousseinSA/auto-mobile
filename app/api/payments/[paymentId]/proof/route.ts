import { NextRequest, NextResponse } from "next/server"
import { uploadProof } from "@/lib/mongodb/services/paymentQueries"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get paymentId from URL path
    const paymentId = req.nextUrl.pathname.split("/")[3]
    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID not provided" },
        { status: 400 }
      )
    }

    const formData = await req.formData()
    const file = formData.get("proof") as File
    
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      )
    }

    // Verify file is actually a File object
    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Invalid file format" },
        { status: 400 }
      )
    }

    try {
      const arrayBuffer = await file.arrayBuffer()
      if (!arrayBuffer) {
        throw new Error("Failed to read file data")
      }

      const fileBuffer = Buffer.from(arrayBuffer)
      
      const proof = await uploadProof(
        paymentId,
        fileBuffer,
        file.name
      )

      return NextResponse.json({ 
        success: true,
        proof 
      })
    } catch (error) {
      console.error("Upload proof error:", error)
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Failed to update proof" },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Route error:", error)
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    )
  }
}