/* eslint-disable @typescript-eslint/no-unused-vars */
import { connectDB } from "../connection"
import { PasswordUpdateInput } from "./types"
import { findUserByEmailOrUsername } from "./userQueries"

export async function verifyUserPassword(identifier: string, password: string) {
  try {
    const user = await findUserByEmailOrUsername(identifier)
    if (!user) {
      throw new Error("Identifiant introuvable")
    }
    if (user.password !== password) {
      throw new Error("Mot de passe incorrect")
    }
    return user
  } catch (error) {
    throw new Error(
      "Problème de connexion Internet. Veuillez réessayer plus tard."
    )
  }
}

export async function updateUserPassword(username: string, { currentPassword, newPassword }: PasswordUpdateInput) {
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