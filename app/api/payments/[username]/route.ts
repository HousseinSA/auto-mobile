import { NextRequest, NextResponse } from "next/server";
import { getPayments } from "@/lib/mongodb/services/paymentQueries";

export async function GET(req: NextRequest) {
  try {
    const username = req.nextUrl.pathname.split("/").pop();
    if (!username) {
      return NextResponse.json(
        { error: "Username not provided" },
        { status: 400 }
      );
    }

    const payments = await getPayments(username);
    return NextResponse.json({ payments });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Error loading payments" },
      { status: 500 }
    );
  }
}
