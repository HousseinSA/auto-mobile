/* eslint-disable @typescript-eslint/no-unused-vars */
import { MongoClient, Db } from "mongodb"
import { ObjectId } from "mongodb"
import { ServiceRequest } from "@/types/ServiceTypes"

const uri = process.env.MONGODB_LINK
if (!uri) {
  throw new Error("MONGODB_LINK environment variable is not defined")
}
const client = new MongoClient(uri)
const dbName = "automobile"

let db: Db | undefined

async function connectDB() {
  if (!db) {
    await client.connect()
    db = client.db(dbName)
  }
  return db
}

// Update the createUser function
export async function createUser({
  username,
  password,
  fullName,
  phoneNumber,
  email,
}: {
  username: string
  password: string
  fullName: string
  phoneNumber: string
  email: string
}) {
  const database = await connectDB()
  const usersCollection = database.collection("users")

  // Check for existing user with case-insensitive search
  const existingUser = await usersCollection.findOne({
    $or: [
      { username: { $regex: `^${username}$`, $options: "i" } },
      { email: { $regex: `^${email}$`, $options: "i" } },
    ],
  })

  if (existingUser) {
    if (existingUser.username.toLowerCase() === username.toLowerCase()) {
      return {
        success: false,
        message: `Le nom d'utilisateur "${username}" est déjà utilisé.`,
      }
    }
    if (existingUser.email.toLowerCase() === email.toLowerCase()) {
      return {
        success: false,
        message: `L'email "${email}" est déjà utilisé.`,
      }
    }
  }

  // Store username in lowercase for consistency
  const result = await usersCollection.insertOne({
    username: username.toLowerCase(),
    password,
    fullName,
    phoneNumber,
    email: email.toLowerCase(),
    role: "user",
    createdAt: new Date(),
  })

  return {
    success: true,
    message: `Votre compte a été créé avec succès.`,
    result,
  }
}

// Add new function to find user by email or username
export async function findUserByEmailOrUsername(identifier: string) {
  const database = await connectDB()
  const collection = database.collection("users")

  // Case insensitive search for username or email
  const user = await collection.findOne({
    $or: [
      { username: { $regex: `^${identifier}$`, $options: "i" } },
      { email: { $regex: `^${identifier}$`, $options: "i" } },
    ],
  })

  return user
}

// Update verifyUserPassword function
export async function verifyUserPassword(identifier: string, password: string) {
  const user = await findUserByEmailOrUsername(identifier)
  if (!user) {
    throw new Error("Identifiant introuvable")
  }
  if (user.password !== password) {
    throw new Error("Mot de passe incorrect")
  }
  return user
}

// Add this new function to get user details
export async function getUserDetails(username: string) {
  const database = await connectDB()
  const usersCollection = database.collection("users")

  const user = await usersCollection.findOne(
    { username },
    { projection: { fullName: 1, phoneNumber: 1, email: 1, _id: 0 } }
  )

  if (!user) {
    throw new Error("Utilisateur non trouvé")
  }

  return user
}

// Update the addService function to include user details fetching
export async function addService(serviceData: ServiceRequest) {
  const database = await connectDB()
  const servicesCollection = database.collection("services")

  const userDetails = await getUserDetails(serviceData.userName)

  const CurrentTime = new Date()
  const completeService = {
    ...serviceData,
    clientName: userDetails.fullName,
    phoneNumber: userDetails.phoneNumber,
    status: "EN ATTENTE",
    createdAt: CurrentTime,
    updatedAt: CurrentTime,
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

  const services = await servicesCollection
    .find({ userName })
    .sort({ createdAt: -1 })
    .toArray()
  return services
}

export async function getAllServices() {
  const database = await connectDB()
  const servicesCollection = database.collection("services")

  const services = await servicesCollection
    .find({})
    .sort({ createdAt: -1 })
    .toArray()
  return services
}

// Add these functions after your existing functions
export async function updateUserProfile(
  username: string,
  data: {
    fullName?: string
    phoneNumber?: string
    newUsername?: string
    email?: string
  }
) {
  const database = await connectDB()
  const usersCollection = database.collection("users")

  // If username is being updated, check if new username already exists
  if (data.email) {
    const existingEmail = await usersCollection.findOne({
      email: data.email,
      username: { $ne: username }, // Don't match the current user
    })
    if (existingEmail) {
      return {
        success: false,
        message: "Cette nom d'utilisateur ou adresse email est déjà utilisée",
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData: any = {}
  if (data.fullName) updateData.fullName = data.fullName
  if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber
  if (data.newUsername) updateData.username = data.newUsername
  if (data.email) updateData.email = data.email

  const result = await usersCollection.updateOne(
    { username },
    { $set: updateData }
  )

  if (result.matchedCount === 0) {
    return {
      success: false,
      message: "Utilisateur non trouvé",
    }
  }

  // If username was updated, update all related services
  if (data.newUsername) {
    const servicesCollection = database.collection("services")
    await servicesCollection.updateMany(
      { userName: username },
      { $set: { userName: data.newUsername } }
    )
  }

  return {
    success: true,
    message: "Profil mis à jour avec succès",
  }
}

export async function updateUserPassword(
  username: string,
  {
    currentPassword,
    newPassword,
  }: { currentPassword: string; newPassword: string }
) {
  const database = await connectDB()
  const usersCollection = database.collection("users")

  const user = await findUserByEmailOrUsername(username)
  if (!user) {
    return {
      success: false,
      message: "Utilisateur non trouvé",
    }
  }

  if (user.password !== currentPassword) {
    return {
      success: false,
      message: "Mot de passe actuel incorrect",
    }
  }

  const result = await usersCollection.updateOne(
    { username },
    { $set: { password: newPassword } }
  )

  return {
    success: true,
    message: "Mot de passe mis à jour avec succès",
  }
}

export async function deleteUser(username: string) {
  const database = await connectDB()
  const usersCollection = database.collection("users")
  const servicesCollection = database.collection("services")

  // Delete user's services first
  await servicesCollection.deleteMany({ userName: username })

  // Then delete the user
  const result = await usersCollection.deleteOne({ username })

  if (result.deletedCount === 0) {
    return {
      success: false,
      message: "Utilisateur non trouvé",
    }
  }

  return {
    success: true,
    message: "Compte supprimé avec succès",
  }
}

export async function updateService(
  id: string,
  serviceData: Partial<ServiceRequest>
) {
  const database = await connectDB()
  const servicesCollection = database.collection("services")

  const result = await servicesCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: serviceData }
  )

  if (result.matchedCount === 0) {
    return {
      success: false,
      message: "Service non trouvé",
    }
  }

  return {
    success: true,
    message: "Service mis à jour avec succès",
  }
}

export async function deleteService(id: string) {
  const database = await connectDB()
  const servicesCollection = database.collection("services")

  const result = await servicesCollection.deleteOne({ _id: new ObjectId(id) })

  if (result.deletedCount === 0) {
    return {
      success: false,
      message: "Service non trouvé",
    }
  }

  return {
    success: true,
    message: "Service supprimé avec succès",
  }
}
