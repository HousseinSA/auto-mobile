import { ServiceRequest } from "@/lib/types/ServiceTypes"
import { connectDB } from "../connection"
import { getUserDetails } from "../users/userQueries"
import { Binary, ObjectId } from "mongodb"

export async function addService(
  serviceData: ServiceRequest,
  fileBuffer?: Buffer
) {
  try {
    const database = await connectDB()
    const servicesCollection = database.collection("services")

    const userDetails = await getUserDetails(serviceData.userName)
    const currentTime = new Date()

    // Convert file buffer to Binary if provided
    const stockFile = fileBuffer
      ? {
          name: serviceData.stockFile?.name,
          data: new Binary(fileBuffer),
        }
      : serviceData.stockFile

    const completeService = {
      ...serviceData,
      clientName: userDetails.fullName,
      phoneNumber: userDetails.phoneNumber,
      status: "EN ATTENTE",
      createdAt: currentTime,
      updatedAt: currentTime,
      stockFile,
    }

    const result = await servicesCollection.insertOne(completeService)

    if (!result.acknowledged) {
      throw new Error("Failed to insert service")
    }

    return {
      success: true,
      message: "Service ajouté avec succès",
      service: {
        _id: result.insertedId,
        ...completeService,
      },
    }
  } catch (error) {
    console.error("Add service error:", error)
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

export async function getUserServices(userName: string) {
  const database = await connectDB()
  const servicesCollection = database.collection("services")

  return await servicesCollection
    .find({ userName })
    .sort({ createdAt: -1 })
    .toArray()
}

export async function getAllServices() {
  const database = await connectDB()
  const servicesCollection = database.collection("services")

  return await servicesCollection.find({}).sort({ createdAt: -1 }).toArray()
}

// Add a new function to get file data
export async function getServiceFile(serviceId: string) {
  const database = await connectDB()
  const servicesCollection = database.collection("services")

  const service = await servicesCollection.findOne({
    _id: new ObjectId(serviceId),
  })
  if (!service || !service.stockFile?.data) {
    throw new Error("File not found")
  }

  return {
    name: service.stockFile.name,
    data: service.stockFile.data.buffer,
  }
}
