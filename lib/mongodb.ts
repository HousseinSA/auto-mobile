import { MongoClient, Db } from "mongodb"
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

export async function createUser({
  username,
  password,
  fullName,
  phoneNumber,
}: {
  username: string
  password: string
  fullName: string
  phoneNumber: string
}) {
  const database = await connectDB()
  const usersCollection = database.collection("users")

  const existingUser = await usersCollection.findOne({ username })
  if (existingUser) {
    return {
      success: false,
      message: `L'utilisateur "${username}" existe déjà. Veuillez choisir un autre nom.`,
    }
  }

  const result = await usersCollection.insertOne({
    username,
    password,
    fullName,
    phoneNumber,
    createdAt: new Date(),
  })

  return {
    success: true,
    message: `Votre compte a été créé avec succès.`,
    result,
  }
}

export async function findUserByName(username: string) {
  const database = await connectDB()
  const usersCollection = database.collection("users")

  const user = await usersCollection.findOne({ username })
  return user
}

export async function verifyUserPassword(username: string, password: string) {
  const user = await findUserByName(username)
  if (!user) {
    throw new Error("Nom d'utilisateur introuvable")
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
    { projection: { fullName: 1, phoneNumber: 1, _id: 0 } }
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

  const result = await servicesCollection.insertOne({
    ...serviceData,
    clientName: userDetails.fullName,
    phoneNumber: userDetails.phoneNumber,
    status: "PENDING",
    createdAt: new Date(),
  })

  return {
    success: true,
    message: "Service ajouté avec succès",
    result,
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
  data: { fullName?: string; phoneNumber?: string; newUsername?: string }
) {
  const database = await connectDB()
  const usersCollection = database.collection("users")

  // If username is being updated, check if new username already exists
  if (data.newUsername) {
    const existingUser = await usersCollection.findOne({
      username: data.newUsername,
    })
    if (existingUser) {
      return {
        success: false,
        message: "Ce nom d'utilisateur est déjà pris",
      }
    }
  }

  const updateData: any = {}
  if (data.fullName) updateData.fullName = data.fullName
  if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber
  if (data.newUsername) updateData.username = data.newUsername

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

  const user = await findUserByName(username)
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
