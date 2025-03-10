import { Binary, ObjectId } from "mongodb";
import { connectDB } from "../connection";
import { AggregationStage, PaymentDocument } from "@/lib/types/MongoTypes";
export async function submitPayment(
  serviceId: string,
  details: {
    method: string;
    amount: number;
    proof: {
      file: {
        name: string;
        data: Buffer;
        uploadedAt: Date;
      };
    };
  }
) {
  const db = await connectDB();
  const paymentsCollection = db.collection("payments");

  const payment = {
    serviceId: new ObjectId(serviceId),
    method: details.method,
    amount: details.amount,
    status: "PENDING",
    proof: details.proof,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await paymentsCollection.insertOne(payment);
  return { ...payment, _id: result.insertedId };
}

export async function uploadProof(
  paymentId: string,
  fileBuffer: Buffer,
  fileName: string
) {
  if (!fileBuffer || !Buffer.isBuffer(fileBuffer)) {
    throw new Error("Invalid file buffer provided");
  }

  const db = await connectDB();
  const paymentsCollection = db.collection("payments");

  // First check if payment exists
  const payment = await paymentsCollection.findOne({
    _id: new ObjectId(paymentId),
  });

  if (!payment) {
    throw new Error("Payment not found");
  }

  const proof = {
    file: {
      name: fileName,
      data: new Binary(fileBuffer),
      uploadedAt: new Date(),
    },
  };

  const result = await paymentsCollection.updateOne(
    { _id: new ObjectId(paymentId) },
    {
      $set: {
        proof,
        status: "PENDING",
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    throw new Error("Failed to update payment");
  }

  return proof;
}

export async function verifyPayment(paymentId: string) {
  const db = await connectDB();
  const paymentsCollection = db.collection<PaymentDocument>("payments");
  const servicesCollection = db.collection("services");

  try {
    // Get payment with service information
    const payment = await paymentsCollection
      .aggregate([
        {
          $match: { _id: new ObjectId(paymentId) },
        },
        {
          $lookup: {
            from: "services",
            localField: "serviceId",
            foreignField: "_id",
            as: "service",
          },
        },
        { $unwind: "$service" },
      ])
      .next();

    if (!payment) {
      throw new Error("Payment not found");
    }

    if (!payment.service.modifiedFile) {
      throw new Error(
        "Le fichier modifié doit être téléchargé avant de vérifier le paiement."
      );
    }

    // Use Promise.all to perform both updates atomically
    const [paymentResult, serviceResult] = await Promise.all([
      // Update payment status
      paymentsCollection.updateOne(
        { _id: new ObjectId(paymentId) },
        {
          $set: {
            status: "VERIFIED",
            updatedAt: new Date(),
          },
        }
      ),

      // Update service status
      servicesCollection.updateOne(
        { _id: payment.serviceId },
        {
          $set: {
            status: "TERMINÉ",
            updatedAt: new Date(),
          },
        }
      ),
    ]);

    if (!paymentResult.modifiedCount || !serviceResult.modifiedCount) {
      throw new Error("Failed to update payment or service status");
    }

    return { paymentResult, serviceResult };
  } catch (error) {
    console.error("verifyPayment error:", error);
    throw error;
  }
}

export async function rejectPayment(paymentId: string) {
  const db = await connectDB();
  const paymentsCollection = db.collection<PaymentDocument>("payments");

  const result = await paymentsCollection.updateOne(
    { _id: new ObjectId(paymentId) },
    {
      $set: {
        status: "FAILED",
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    throw new Error("Payment not found");
  }

  return result;
}
export async function deletePaymentByServiceId(serviceId: string) {
  const db = await connectDB();
  const paymentsCollection = db.collection("payments");

  return await paymentsCollection.deleteOne({
    serviceId: new ObjectId(serviceId),
  });
}

export async function getPayments(username?: string) {
  const db = await connectDB();
  const paymentsCollection = db.collection<PaymentDocument>("payments");

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
      // @ts-expect-error fix
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
          phoneNumber: 1,
          ecuType: 1,
          fuelType: 1,
          generation: 1,
          ecuNumber: 1,
          totalPrice: 1,
          serviceOptions: 1,
          status: 1,
          modifiedFile: 1,
          createdAt: 1,
        },
      },
    },
  ];

  if (username) {
    pipeline.unshift({
      $match: {
        "service.clientName": username.toLowerCase(),
      },
    });
  }

  return await paymentsCollection.aggregate(pipeline).toArray();
}
export async function getAdminPaymentDetails() {
  const db = await connectDB();
  const settingsCollection = db.collection("settings");

  const settings = await settingsCollection.findOne({
    type: "payment_details",
  });
  return {
    paypal: settings?.paypal || "",
    bankily: settings?.bankily || "",
    masarvi: settings?.masarvi || "",
    sedad: settings?.sedad || "",
  };
}
