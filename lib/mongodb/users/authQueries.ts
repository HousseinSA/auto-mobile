import { connectDB } from "../connection"
import { PasswordUpdateInput } from "./types"
import { findUserByEmailOrUsername } from "./userQueries"

export async function verifyUserPassword(identifier: string, password: string) {
  const db = await connectDB()
  const user = await db.collection("users").findOne({
    $or: [
      { username: identifier.toLowerCase() },
      { email: identifier.toLowerCase() },
    ],
  })

  if (!user) {
    throw new Error("Identifiant ou mot de passe incorrect")
  }

  // Direct password comparison since bcrypt is not used
  if (user.password !== password) {
    throw new Error("Identifiant ou mot de passe incorrect")
  }

  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role || ("USER" as "ADMIN" | "USER"),
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
