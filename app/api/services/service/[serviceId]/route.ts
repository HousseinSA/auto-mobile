/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextRequest, NextResponse } from "next/server"
import { deleteService, updateService } from "@/lib/mongodb"

export async function PUT(
  request: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  try {
    const body = await request.json()
    const { success, message } = await updateService(params.serviceId, body)

    if (!success) {
      return NextResponse.json({ error: message }, { status: 400 })
    }

    return NextResponse.json({ success, message })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur lors de la mise à jour du service" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  try {
    const { success, message } = await deleteService(params.serviceId)

    if (!success) {
      return NextResponse.json({ error: message }, { status: 400 })
    }

    return NextResponse.json({ success, message })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erreur lors de la suppression du service" },
      { status: 500 }
    )
  }
}
