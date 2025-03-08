import { NextResponse } from 'next/server'
import { submitPayment } from '@/lib/mongodb/services/paymentQueries'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const serviceId = formData.get("serviceId") as string
    const method = formData.get("method") as string
    const amount = Number(formData.get("amount"))
    const proofFile = formData.get("proof") as File

    if (!serviceId || !method || !amount || !proofFile) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const bytes = await proofFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const payment = await submitPayment(serviceId, {
      method,
      amount,
      proof: {
        file: {
          name: proofFile.name,
          data: buffer,
          uploadedAt: new Date()
        }
      }
    })
    
    return NextResponse.json({ payment })
  } catch (error) {
    console.error("Payment submission error:", error)
    return NextResponse.json(
      { error: 'Erreur lors de la soumission du paiement' },
      { status: 500 }
    )
  }
}