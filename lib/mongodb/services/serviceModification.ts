import { ObjectId } from "mongodb"
import { ServiceRequest } from "@/types/ServiceTypes"
import { connectDB } from "../connection"

export async function updateService(id: string, serviceData: Partial<ServiceRequest>) {
  const database = await connectDB()
  const servicesCollection = database.collection("services")

  const result = await servicesCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...serviceData, updatedAt: new Date() } }
  )

  if (result.matchedCount === 0) {
    return { success: false, message: "Service non trouvé" }
  }

  return { success: true, message: "Service mis à jour avec succès" }
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