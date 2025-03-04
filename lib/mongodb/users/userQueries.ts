import { connectDB } from "../connection"
import { UserCreateInput } from "./types"

export async function findUserByEmailOrUsername(identifier: string) {
  const database = await connectDB()
  const collection = database.collection("users")

  return await collection.findOne({
    $or: [
      { username: { $regex: `^${identifier}$`, $options: "i" } },
      { email: { $regex: `^${identifier}$`, $options: "i" } },
    ],
  })
}

export async function createUser(userData: UserCreateInput) {
  const database = await connectDB()
  const usersCollection = database.collection("users")

  // First, check for existing email
  const existingEmail = await usersCollection.findOne({
    email: { $regex: `^${userData.email}$`, $options: "i" },
  })

  if (existingEmail) {
    return {
      success: false,
      message: `L'email "${userData.email}" est déjà utilisé.`,
    }
  }

  // Then check for existing username
  const existingUsername = await usersCollection.findOne({
    username: { $regex: `^${userData.username}$`, $options: "i" },
  })

  if (existingUsername) {
    return {
      success: false,
      message: `Le nom d'utilisateur "${userData.username}" est déjà utilisé.`,
    }
  }

  // If no duplicates found, create the user
  const result = await usersCollection.insertOne({
    ...userData,
    username: userData.username.toLowerCase(),
    email: userData.email.toLowerCase(),
    createdAt: new Date(),
  })

  return {
    success: true,
    message: `Votre compte a été créé avec succès.`,
    result,
  }
}

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
