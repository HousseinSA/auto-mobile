import { NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb/connection"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const serviceId = request.nextUrl.pathname.split("/").pop()
    if (!serviceId) {
      return Response.json({ error: "Service ID required" }, { status: 400 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const database = await connectDB()
    const servicesCollection = database.collection("services")

    const result = await servicesCollection.updateOne(
      { _id: new ObjectId(serviceId) },
      {
        $set: {
          modifiedFile: {
            name: file.name,
            data: buffer.toString('base64'),
            uploadedAt: new Date()
          }
        }
      }
    )

    if (result.modifiedCount === 0) {
      return Response.json({ error: "Service not found" }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Upload error:", error)
    return Response.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}