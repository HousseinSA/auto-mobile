import { NextRequest, NextResponse } from "next/server"
import { addService } from "@/lib/mongodb/mongodb"
import { ServiceRequest } from "@/lib/types/ServiceTypes"

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ServiceRequest

    if (!body.fuelType || !body.ecuType || !body.ecuNumber || !body.userName) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      )
    }
    const result = await addService(body)

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        success: true,
        message: "Service ajouté avec succès",
        service: result.service,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Add service error:", error)
    return new Response(
      JSON.stringify({
        success: false,
        error: "Échec de l'ajout du service",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
