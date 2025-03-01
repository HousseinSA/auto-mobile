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

  const existingUser = await findUserByEmailOrUsername(userData.username)
  if (existingUser) {
    if (existingUser.username.toLowerCase() === userData.username.toLowerCase()) {
      return {
        success: false,
        message: `Le nom d'utilisateur "${userData.username}" est déjà utilisé.`,
      }
    }
    if (existingUser.email.toLowerCase() === userData.email.toLowerCase()) {
      return {
        success: false,
        message: `L'email "${userData.email}" est déjà utilisé.`,
      }
    }
  }

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