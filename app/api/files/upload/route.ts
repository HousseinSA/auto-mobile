import { NextResponse } from "next/server"
import { uploadFile } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const userName = formData.get("userName") as string

    if (!file || !userName) {
      return NextResponse.json(
        { error: "File and username are required" },
        { status: 400 }
      )
    }

    const result = await uploadFile({
      fileName: file.name,
      fileType: file.type,
      userName,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        message: "File uploaded successfully",
        success: true,
        result: result.result,
      },
      { status: 201 }
    )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    )
  }
}
