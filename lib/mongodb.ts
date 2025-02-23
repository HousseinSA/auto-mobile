import { MongoClient, Db } from "mongodb"
import { ServiceRequest,  } from "@/types/ServiceTypes"

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
export async function addService(serviceData:ServiceRequest )  {
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
