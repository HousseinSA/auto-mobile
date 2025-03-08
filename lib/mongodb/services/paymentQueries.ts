import { Binary, ObjectId } from "mongodb"
import { connectDB } from "../connection"
import { AggregationStage, PaymentDocument } from "@/lib/types/MongoTypes"
export async function submitPayment(
  serviceId: string,
  details: { 
    method: string    
    amount: number  
    proof: {
      file: {
        name: string
        data: Buffer
        uploadedAt: Date
      }
    }
  }
) {
  const db = await connectDB()
  const paymentsCollection = db.collection("payments")

  const payment = {
    serviceId: new ObjectId(serviceId),
    method: details.method,
    amount: details.amount,
    status: "PENDING",
    proof: details.proof,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const result = await paymentsCollection.insertOne(payment)
  return { ...payment, _id: result.insertedId }
}

export async function uploadProof(
  serviceId: string,
  fileBuffer: Buffer,
  fileName: string
) {
  const db = await connectDB()
  const paymentsCollection = db.collection("payments")

  const proof = {
    file: {
      name: fileName,
      data: new Binary(fileBuffer),
      uploadedAt: new Date(),
    },
  }

  // Update only payment document
  await paymentsCollection.updateOne(
    { serviceId: new ObjectId(serviceId) },
    {
      $set: {
        proof: proof,
        updatedAt: new Date(),
      },
    }
  )

  return proof
}

export async function verifyPayment(serviceId: string, adminId: string) {
  const db = await connectDB()
  const paymentsCollection = db.collection("payments")
  const servicesCollection = db.collection("services")

  try {
    const objectId = new ObjectId(serviceId)

    const payment = await paymentsCollection.findOne({ serviceId: objectId })
    if (!payment) {
      throw new Error("Payment not found for this service")
    }

    // Update payment document
    const paymentResult = await paymentsCollection.updateOne(
      { serviceId: objectId },
      {
        $set: {
          status: "VERIFIED",
          verifiedBy: adminId,
          updatedAt: new Date(),
        },
      }
    )

    // Update service document
    const serviceResult = await servicesCollection.updateOne(
      { _id: objectId },
      {
        $set: {
          "payment.status": "VERIFIED",
          "payment.verifiedBy": adminId,
          "payment.updatedAt": new Date(),
        },
      }
    )

    if (
      paymentResult.modifiedCount === 0 &&
      serviceResult.modifiedCount === 0
    ) {
      throw new Error("No modifications made")
    }

    return true
  } catch (error) {
    console.error("Verification error:", error)
    throw error
  }
}

export async function deletePaymentByServiceId(serviceId: string) {
  const db = await connectDB()
  const paymentsCollection = db.collection("payments")

  return await paymentsCollection.deleteOne({ 
    serviceId: new ObjectId(serviceId) 
  })
}

export async function getPayments(username?: string) {
  const db = await connectDB()
  const paymentsCollection = db.collection<PaymentDocument>("payments")

  const pipeline: AggregationStage[] = [
    {
      $lookup: {
        from: "services",
        localField: "serviceId",
        foreignField: "_id",
        as: "service",
      },
    },
    { $unwind: "$service" },
    {
      $project: {
        _id: 1,
        serviceId: 1,
        method: 1,
        amount: 1,
        status: 1,
        proof: 1,
        createdAt: 1,
        updatedAt: 1,
        verifiedBy: 1,
        service: {
          _id: 1,
          clientName: 1,
          phoneNumber:1,
          ecuType: 1,
          fuelType: 1,
          generation: 1,
          ecuNumber: 1,
          totalPrice: 1,
          serviceOptions: 1,
          status: 1, 
        },
      },
    },
  ]

  if (username) {
    pipeline.unshift({
      $match: {
        "service.userName": username.toLowerCase()
      }
    })
  }

  return await paymentsCollection.aggregate(pipeline).toArray()
}

export async function getAdminPaymentDetails() {
  const db = await connectDB()
  const settingsCollection = db.collection("settings")

  const settings = await settingsCollection.findOne({ type: "payment_details" })
  return {
    paypal: settings?.paypal || "",
    bankily: settings?.bankily || "",
    masarvi: settings?.masarvi || "",
    sedad: settings?.sedad || "",
  }
}
