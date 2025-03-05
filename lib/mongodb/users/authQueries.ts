import { connectDB } from "../connection"
import {
  PasswordUpdateInput,
} from "./types"
import { findUserByEmailOrUsername } from "./userQueries"

export async function verifyUserPassword(identifier: string, password: string) {
  try {
    const user = await findUserByEmailOrUsername(identifier)
    if (!user) {
      throw new Error("Identifiant ou mot de passe incorrect")
    }
    if (user.password !== password) {
      throw new Error("Identifiant ou mot de passe incorrect")
    }
    return user
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes("connect ECONNREFUSED") ||
        error.message.includes("getaddrinfo") ||
        error.message.includes("network")
      ) {
        throw new Error(
          "Problème de connexion Internet. Veuillez réessayer plus tard."
        )
      }

      // For authentication errors, return generic message
      if (error.message.includes("Identifiant")) {
        throw error
      }
    }

    // For any other unexpected errors
    throw new Error("Une erreur est survenue. Veuillez réessayer plus tard.")
  }
}

export async function updateUserPassword(
  username: string,
  { currentPassword, newPassword }: PasswordUpdateInput
) {
  const database = await connectDB()
  const usersCollection = database.collection("users")

  const user = await findUserByEmailOrUsername(username)
  if (!user) {
    return { success: false, message: "Utilisateur non trouvé" }
  }

  if (user.password !== currentPassword) {
    return { success: false, message: "Mot de passe actuel incorrect" }
  }

  await usersCollection.updateOne(
    { username },
    { $set: { password: newPassword } }
  )

  return { success: true, message: "Mot de passe mis à jour avec succès" }
}
