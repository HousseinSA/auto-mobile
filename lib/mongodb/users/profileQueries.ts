import { connectDB } from "../connection";
import { UserUpdateInput } from "./types";

export async function updateUserProfile(
  username: string,
  data: UserUpdateInput
) {
  const database = await connectDB();
  const usersCollection = database.collection("users");
  const servicesCollection = database.collection("services");

  // Email check remains the same
  if (data.email) {
    const existingEmail = await usersCollection.findOne({
      email: data.email,
      username: { $ne: username },
    });
    if (existingEmail) {
      return {
        success: false,
        message: "Cette adresse email est déjà utilisée",
      };
    }
  }

  const updateData: Record<string, string> = {};
  if (data.fullName) updateData.fullName = data.fullName;
  if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber;
  if (data.email) updateData.email = data.email;

  // Update user profile
  const result = await usersCollection.updateOne(
    { username },
    { $set: updateData }
  );

  if (result.matchedCount === 0) {
    return { success: false, message: "Utilisateur non trouvé" };
  }

  // If fullName was updated, sync it with clientName in services
  if (data.fullName) {
    await servicesCollection.updateMany(
      { userName: username }, // Find all services for this user
      { $set: { clientName: data.fullName } } // Update clientName to match new fullName
    );
  }

  return {
    success: true,
    message: "Profil mis à jour avec succès",
  };
}

export async function deleteUser(username: string) {
  const database = await connectDB();
  const usersCollection = database.collection("users");
  const servicesCollection = database.collection("services");

  await servicesCollection.deleteMany({ userName: username });
  const result = await usersCollection.deleteOne({ username });

  if (result.deletedCount === 0) {
    return { success: false, message: "Utilisateur non trouvé" };
  }

  return { success: true, message: "Compte supprimé avec succès" };
}
