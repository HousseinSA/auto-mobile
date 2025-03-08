/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server'
import { getAdminPaymentDetails } from '@/lib/mongodb/services/paymentQueries'

export async function GET() {
  try {
    const details = await getAdminPaymentDetails()
    return NextResponse.json(details)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur lors du chargement des détails' },
      { status: 500 }
    )
  }
}