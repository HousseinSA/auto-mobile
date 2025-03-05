import { connectDB } from "@/lib/mongodb/connection"
import { ObjectId } from "mongodb"

export async function DELETE(
  request: Request,
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
      return new Response(JSON.stringify({ error: "Service not found" }), {
        status: 404,
      })
    }

    return new Response(JSON.stringify({ success: true }))
  } catch (error) {
    console.error("Remove modified file error:", error)
    return new Response(
      JSON.stringify({ error: "Failed to remove modified file" }),
      { status: 500 }
    )
  }
}
