import { ServiceRequest } from "@/types/ServiceTypes"
import { connectDB } from "../connection"
import { getUserDetails } from "../users/userQueries"

export async function addService(serviceData: ServiceRequest) {
  const database = await connectDB()
  const servicesCollection = database.collection("services")

  const userDetails = await getUserDetails(serviceData.userName)
  const currentTime = new Date()

  const completeService = {
    ...serviceData,
    clientName: userDetails.fullName,
    phoneNumber: userDetails.phoneNumber,
    status: "EN ATTENTE",
    createdAt: currentTime,
    updatedAt: currentTime,
  }

  const result = await servicesCollection.insertOne(completeService)

  return {
    success: true,
    message: "Service ajouté avec succès",
    service: {
      _id: result.insertedId,
      ...completeService,
    },
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