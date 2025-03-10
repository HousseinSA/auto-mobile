import { NextRequest, NextResponse } from "next/server";
import { uploadProof } from "@/lib/mongodb/services/paymentQueries";

export async function PUT(req: NextRequest) {
  try {
    const paymentId = req.nextUrl.pathname.split("/")[4];
    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID not provided" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("proof") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    try {
      const proof = await uploadProof(paymentId, fileBuffer, file.name);
      return NextResponse.json({ success: true, proof });
    } catch (error) {
      console.error("Upload proof error:", error);
      return NextResponse.json(
        {
          error:
            error instanceof Error ? error.message : "Failed to update proof",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Route error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
