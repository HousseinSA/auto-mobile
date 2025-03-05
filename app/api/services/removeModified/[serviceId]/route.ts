import { connectDB } from "@/lib/mongodb/connection"
import { ObjectId } from "mongodb"
import { NextRequest } from "next/server"

export async function DELETE(
  request: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  try {
    const db = await connectDB()
    const { serviceId } = params

    const result = await db.collection("services").updateOne(
      { _id: new ObjectId(serviceId) },
      {
        $unset: { modifiedFile: "" },
      }
    )

    if (!result.modifiedCount) {
      return Response.json({ error: "Service not found" }, { status: 404 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Remove modified file error:", error)
    return Response.json(
      { error: "Failed to remove modified file" },
      { status: 500 }
    )
  }
}
