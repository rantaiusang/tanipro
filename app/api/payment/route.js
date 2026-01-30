import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    console.log("API Terima:", body)

    if (body.action === 'create') {
      return NextResponse.json({ success: true, paymentId: "MOCK_" + Date.now() })
    }
    
    if (body.action === 'complete') {
      // Simulasi verifikasi sukses
      return NextResponse.json({ success: true, verified: true })
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
