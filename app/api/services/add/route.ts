import { NextRequest, NextResponse } from "next/server"
import { addService } from "@/lib/mongodb/mongodb"
import { ServiceRequest, FileData } from "@/lib/types/ServiceTypes"
import { Binary } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const serviceDataJson = formData.get("serviceData") as string
    const serviceData = JSON.parse(serviceDataJson) as ServiceRequest
    const file = formData.get("stockFile") as File | null

    if (
      !serviceData.fuelType ||
      !serviceData.ecuType ||
      !serviceData.ecuNumber ||
      !serviceData.userName
    ) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      )
    }

    // Handle file if present
    if (file) {
      try {
        const arrayBuffer = await file.arrayBuffer()
        const fileData: FileData = {
          name: file.name,
          data: new Binary(Buffer.from(arrayBuffer)),
        }
        serviceData.stockFile = fileData
      } catch (fileError) {
        console.error("File processing error:", fileError)
        return NextResponse.json(
          { error: "Erreur lors du traitement du fichier" },
          { status: 400 }
        )
      }
    }

    const result = await addService(serviceData)

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || "Erreur lors de l'ajout du service" },
        { status: 400 }
      )
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
    return NextResponse.json(
      {
        success: false,
        error: "Échec de l'ajout du service",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
