import { connectDB } from "../connection"
import { UserUpdateInput } from "./types"

export async function updateUserProfile(username: string, data: UserUpdateInput) {
  const database = await connectDB()
  const usersCollection = database.collection("users")
  const servicesCollection = database.collection("services")

  if (data.email) {
    const existingEmail = await usersCollection.findOne({
      email: data.email,
      username: { $ne: username },
    })
    if (existingEmail) {
      return {
        success: false,
        message: "Cette adresse email est déjà utilisée"
      }
    }
  }

  const updateData: Record<string, string> = {}
  if (data.fullName) updateData.fullName = data.fullName
  if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber
  if (data.newUsername) updateData.username = data.newUsername
  if (data.email) updateData.email = data.email

  const result = await usersCollection.updateOne(
    { username },
    { $set: updateData }
  )

  if (result.matchedCount === 0) {
    return { success: false, message: "Utilisateur non trouvé" }
  }

  if (data.newUsername) {
    await servicesCollection.updateMany(
      { userName: username },
      { $set: { userName: data.newUsername } }
    )
  }

  return { success: true, message: "Profil mis à jour avec succès" }
}

export async function deleteUser(username: string) {
  const database = await connectDB()
  const usersCollection = database.collection("users")
  const servicesCollection = database.collection("services")

  await servicesCollection.deleteMany({ userName: username })
  const result = await usersCollection.deleteOne({ username })

  if (result.deletedCount === 0) {
    return { success: false, message: "Utilisateur non trouvé" }
  }

  return { success: true, message: "Compte supprimé avec succès" }
}