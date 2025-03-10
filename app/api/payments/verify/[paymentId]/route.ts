import { NextRequest, NextResponse } from "next/server";
import {
  verifyPayment,
  rejectPayment,
} from "@/lib/mongodb/services/paymentQueries";

export async function PUT(req: NextRequest) {
  try {
    const paymentId = req.nextUrl.pathname.split("/")[4];
    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID not provided" },
        { status: 400 }
      );
    }

    const { status } = await req.json();

    if (status === "VERIFIED") {
      await verifyPayment(paymentId);
      return NextResponse.json({ message: "Paiement vérifié avec succès" });
    } else if (status === "FAILED") {
      await rejectPayment(paymentId);
      return NextResponse.json({ message: "Paiement rejeté avec succès" });
    }

    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  } catch (error) {
    console.error("Status update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Update failed" },
      { status: 500 }
    );
  }
}
