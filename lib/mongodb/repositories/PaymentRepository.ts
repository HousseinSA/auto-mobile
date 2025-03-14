import { Collection, Db, ObjectId } from "mongodb";
import { PaymentDocument, PaymentProof } from "@/lib/types/MongoTypes";

export class PaymentRepository {
  private collection: Collection<PaymentDocument>;
  private servicesCollection: Collection;

  constructor(db: Db) {
    this.collection = db.collection<PaymentDocument>("payments");
    this.servicesCollection = db.collection("services");
  }

  async create(payment: Omit<PaymentDocument, "_id">) {
    const result = await this.collection.insertOne(payment as PaymentDocument);
    return {
      ...payment,
      _id: result.insertedId,
    };
  }

  async findWithServices(username?: string) {
    try {
      const query = username ? { userName: username.toLowerCase() } : {};
      const payments = await this.collection
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

      if (payments.length === 0) return [];

      const serviceIds = Array.from(
        new Set(payments.map((p) => p.serviceId))
      ).map((id) => new ObjectId(id));

      const services = await this.servicesCollection
        .find({ _id: { $in: serviceIds } })
        .project({
          _id: 1,
          clientName: 1,
          phoneNumber: 1,
          totalPrice: 1,
          status: 1,
          ecuType: 1,
          generation: 1,
          serviceOptions: 1,
          modifiedFile: 1,
          createdAt: 1,
        })
        .toArray();

      const serviceMap = new Map(services.map((s) => [s._id.toString(), s]));

      return payments
        .map((payment) => ({
          ...payment,
          service: serviceMap.get(payment.serviceId.toString()) || null,
        }))
        .filter((p) => p.service);
    } catch (error) {
      console.error("Error in findWithServices:", error);
      throw error;
    }
  }

  async updateProof(paymentId: ObjectId, proof: PaymentProof) {
    const result = await this.collection.updateOne(
      { _id: paymentId },
      {
        $set: {
          proof,
          status: "PENDING",
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      throw new Error("Payment not found");
    }

    return result;
  }

  async verify(paymentId: ObjectId) {
    const payment = await this.collection
      .aggregate([
        { $match: { _id: paymentId } },
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

    const [paymentResult, serviceResult] = await Promise.all([
      this.collection.updateOne(
        { _id: paymentId },
        {
          $set: {
            status: "VERIFIED",
            updatedAt: new Date(),
          },
        }
      ),
      this.servicesCollection.updateOne(
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
  }

  async reject(paymentId: ObjectId) {
    const result = await this.collection.updateOne(
      { _id: paymentId },
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

  async deleteByServiceId(serviceId: ObjectId) {
    return this.collection.deleteOne({ serviceId });
  }

  async findById(paymentId: ObjectId) {
    return this.collection.findOne({ _id: paymentId });
  }
  async createIndexes() {
    try {
      await Promise.all([
        this.collection.createIndex(
          { userName: 1, createdAt: -1 },
          { background: true }
        ),

        this.collection.createIndex({ serviceId: 1 }, { background: true }),
        this.collection.createIndex({ status: 1 }, { background: true }),
      ]);
    } catch (error) {
      console.error("Error creating payment indexes:", error);
      throw error;
    }
  }
}
