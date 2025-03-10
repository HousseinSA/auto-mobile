import { NextResponse } from "next/server";
import { getPayments } from "@/lib/mongodb/services/paymentQueries";

export async function GET() {
  try {
    const payments = await getPayments();
    return NextResponse.json({ payments }); // Wrap payments in an object
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement des paiements" },
      { status: 500 }
    );
  }
}
