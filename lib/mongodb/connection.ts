import { MongoClient, Db, ChangeStream } from "mongodb"

const uri = process.env.MONGODB_LINK
if (!uri) {
  throw new Error("MONGODB_LINK environment variable is not defined")
}

const client = new MongoClient(uri)
const dbName = process.env.DB_NAME
let db: Db | undefined
let changeStream: ChangeStream | undefined

export async function connectDB() {
  if (!db) {
    await client.connect()
    db = client.db(dbName)

    // Initialize change stream
    const collection = db.collection("services")
    changeStream = collection.watch([], { fullDocument: "updateLookup" })

    // Handle changes
    changeStream.on("change", async (change) => {
      if (typeof window !== "undefined") {
        switch (change.operationType) {
          case "update":
          case "insert":
            window.dispatchEvent(
              new CustomEvent("service-update", {
                detail: {
                  type: change.operationType,
                  service: change.fullDocument,
                },
              })
            )
            break
          case "delete":
            window.dispatchEvent(
              new CustomEvent("service-delete", {
                detail: {
                  serviceId: change.documentKey._id,
                },
              })
            )
            break
        }
      }
    })
  }
  return db
}
