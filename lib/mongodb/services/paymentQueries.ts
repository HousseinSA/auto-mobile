import { Binary, ObjectId } from "mongodb";
import { connectDB } from "../connection";
import { PaymentDocument } from "@/lib/types/MongoTypes";
import sharp from "sharp";

async function compressFileForStorage(
  fileBuffer: Buffer,
  fileName: string
): Promise<Buffer> {
  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(fileName);

  if (isImage) {
    try {
      return await sharp(fileBuffer)
        .jpeg({ quality: 60, progressive: true }) // Lower quality, progressive loading
        .resize(1200, 1200, {
          // Max dimensions
          fit: "inside",
          withoutEnlargement: true,
        })
        .toBuffer();
    } catch (error) {
      console.error("Image compression error:", error);
      return fileBuffer; // Return original if compression fails
    }
  }

  return fileBuffer; // Return original for non-image files
}

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
    userName: string;
  }
) {
  const db = await connectDB();
  const paymentsCollection = db.collection("payments");

  try {
    // Compress file before storing
    const compressedFileData = await compressFileForStorage(
      details.proof.file.data,
      details.proof.file.name
    );

    const payment = {
      serviceId: new ObjectId(serviceId),
      method: details.method,
      amount: details.amount,
      status: "PENDING",
      userName: details.userName.toLowerCase(),
      createdAt: new Date(),
      updatedAt: new Date(),
      proof: {
        file: {
          name: details.proof.file.name,
          data: new Binary(compressedFileData),
          uploadedAt: new Date(),
        },
      },
    };

    const result = await paymentsCollection.insertOne(payment);
    return {
      ...payment,
      _id: result.insertedId,
    };
  } catch (error) {
    console.error("Submit payment error:", error);
    throw new Error("Failed to submit payment");
  }
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
  const servicesCollection = db.collection("services");

  try {
    // 1. Fetch payments with minimal fields
    const query = username ? { userName: username.toLowerCase() } : {};
    const payments = await paymentsCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    if (payments.length === 0) return [];

    // 2. Get service IDs and fetch services in bulk
    const serviceIds = Array.from(
      new Set(payments.map((p) => p.serviceId))
    ).map((id) => new ObjectId(id));

    const services = await servicesCollection
      .find({ _id: { $in: serviceIds } })
      .project({
        _id: 1,
        clientName: 1,
        phoneNumber: 1,
        totalPrice: 1,
        createdAt: 1,
        status: 1,
        ecuType: 1,
        generation: 1,
        serviceOptions: 1,
      })
      .toArray();

    // 3. Create efficient lookup map
    const serviceMap = new Map(services.map((s) => [s._id.toString(), s]));

    // 4. Combine data efficiently
    return payments
      .map((payment) => {
        const service = serviceMap.get(payment.serviceId.toString());
        return {
          _id: payment._id,
          serviceId: payment.serviceId,
          userName: payment.userName,
          method: payment.method,
          amount: payment.amount,
          status: payment.status,
          proof: payment.proof,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt,
          verifiedBy: payment.verifiedBy,
          service: service || null,
        };
      })
      .filter((p) => p.service !== null);
  } catch (error) {
    console.error("Payment fetch error:", error);
    throw error;
  }
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

export async function createPaymentIndexes() {
  const db = await connectDB();

  try {
    await Promise.all([
      // Compound index for payments
      db
        .collection("payments")
        .createIndex({ userName: 1, createdAt: -1 }, { background: true }),
      // Index for service lookups
      db
        .collection("payments")
        .createIndex({ serviceId: 1 }, { background: true }),
      // Status index
      db
        .collection("payments")
        .createIndex({ status: 1 }, { background: true }),
    ]);
  } catch (error) {
    console.error("Failed to create indexes:", error);
    throw error;
  }
}
