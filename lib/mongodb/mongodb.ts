/* eslint-disable @typescript-eslint/no-unused-vars */
import { MongoClient, Db } from "mongodb"
import { ObjectId } from "mongodb"
import { ServiceRequest } from "@/types/ServiceTypes"

const uri = process.env.MONGODB_LINK
if (!uri) {
  throw new Error("MONGODB_LINK environment variable is not defined")
}
const client = new MongoClient(uri)
const dbName = "automobileDev"

let db: Db | undefined

async function connectDB() {
  if (!db) {
    await client.connect()
    db = client.db(dbName)
  }
  return db
}

export * from "./users/userQueries"
export * from "./users/authQueries"
export * from "./users/profileQueries"
export * from "./services/serviceQueries"
export * from "./services/serviceModification"
