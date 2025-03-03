import { ObjectId, Binary } from "mongodb"
import { ServiceRequest } from "@/types/ServiceTypes"
import { connectDB } from "../connection"
import { ServiceStatus } from "@/lib/types/ServiceTypes"

export async function updateService(
  id: string,
  serviceData: Partial<ServiceRequest>,
  fileBuffer?: Buffer
) {
  const database = await connectDB()
  const servicesCollection = database.collection("services")

  try {
    const existingService = await servicesCollection.findOne({
      _id: new ObjectId(id),
    })

    if (!existingService) {
      return { success: false, message: "Service non trouvé" }
    }

    let stockFile = existingService.stockFile
    if (fileBuffer) {
      stockFile = {
        name: serviceData.stockFile?.name,
        data: new Binary(fileBuffer),
      }
    } else if (serviceData.stockFile === null) {
      stockFile = null
    }

    const updateData = {
      ...serviceData,
      stockFile,
      updatedAt: new Date(),
    }

    const result = await servicesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    )

    if (result.matchedCount === 0) {
      return { success: false, message: "Service non trouvé" }
    }

    return { success: true, message: "Service mis à jour avec succès" }
  } catch (error) {
    console.error("Update error:", error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erreur lors de la mise à jour",
    }
  }
}
export async function deleteService(id: string) {
  const database = await connectDB()
  const servicesCollection = database.collection("services")

  const result = await servicesCollection.deleteOne({ _id: new ObjectId(id) })

  if (result.deletedCount === 0) {
    return { success: false, message: "Service non trouvé" }
  }

  return { success: true, message: "Service supprimé avec succès" }
}

export async function updateServiceStatus(id: string, status: ServiceStatus) {
  const database = await connectDB()
  const servicesCollection = database.collection("services")

  try {
    const result = await servicesCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return { success: false, message: "Service non trouvé" }
    }

    return { success: true, message: "Status mis à jour avec succès" }
  } catch (error) {
    console.error("Status update error:", error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erreur lors de la mise à jour du status",
    }
  }
}
