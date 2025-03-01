import { MongoClient, Db } from "mongodb"

const uri = process.env.MONGODB_LINK
if (!uri) {
  throw new Error("MONGODB_LINK environment variable is not defined")
}

const client = new MongoClient(uri)
const dbName = "automobile"

let db: Db | undefined

export async function connectDB() {
  if (!db) {
    await client.connect()
    db = client.db(dbName)
  }
  return db
}