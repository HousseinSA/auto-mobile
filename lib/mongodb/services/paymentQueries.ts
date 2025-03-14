import { Binary, ObjectId } from "mongodb";
import { connectDB } from "../connection";
import { PaymentRepository } from "../repositories/PaymentRepository";
import { compressImage, isImage } from "@/lib/utils/fileCompression";

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
  const paymentRepo = new PaymentRepository(db);

  try {
    // Compress file if it's an image
    const compressedFileData = isImage(details.proof.file.name)
      ? await compressImage(details.proof.file.data)
      : details.proof.file.data;

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
          size: compressedFileData.length,
          mimeType: isImage(details.proof.file.name)
            ? "image/jpeg"
            : "application/octet-stream",
        },
      },
    };

    return await paymentRepo.create(payment);
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
  const db = await connectDB();
  const paymentRepo = new PaymentRepository(db);

  try {
    const compressedFileData = isImage(fileName)
      ? await compressImage(fileBuffer)
      : fileBuffer;

    const proof = {
      file: {
        name: fileName,
        data: new Binary(compressedFileData),
        uploadedAt: new Date(),
        size: compressedFileData.length,
        mimeType: isImage(fileName) ? "image/jpeg" : "application/octet-stream",
      },
    };

    return await paymentRepo.updateProof(new ObjectId(paymentId), proof);
  } catch (error) {
    console.error("Upload proof error:", error);
    throw new Error("Failed to upload proof");
  }
}

export async function getPayments(username?: string) {
  const db = await connectDB();
  const paymentRepo = new PaymentRepository(db);

  try {
    return await paymentRepo.findWithServices(username);
  } catch (error) {
    console.error("Payment fetch error:", error);
    throw error;
  }
}

export async function verifyPayment(paymentId: string) {
  const db = await connectDB();
  const paymentRepo = new PaymentRepository(db);

  try {
    return await paymentRepo.verify(new ObjectId(paymentId));
  } catch (error) {
    console.error("Verify payment error:", error);
    throw error;
  }
}

export async function rejectPayment(paymentId: string) {
  const db = await connectDB();
  const paymentRepo = new PaymentRepository(db);

  try {
    return await paymentRepo.reject(new ObjectId(paymentId));
  } catch (error) {
    console.error("Reject payment error:", error);
    throw error;
  }
}

export async function deletePaymentByServiceId(serviceId: string) {
  const db = await connectDB();
  const paymentRepo = new PaymentRepository(db);

  try {
    return await paymentRepo.deleteByServiceId(new ObjectId(serviceId));
  } catch (error) {
    console.error("Delete payment error:", error);
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
  const paymentRepo = new PaymentRepository(db);

  try {
    await paymentRepo.createIndexes();
  } catch (error) {
    console.error("Failed to create indexes:", error);
    throw error;
  }
}
