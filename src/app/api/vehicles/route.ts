import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const data = await prisma.vehicle.findMany({ include: { costs: true, market: true }, orderBy: { createdAt: 'desc' } })
    return NextResponse.json(data)
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'DB error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const vehicle = body?.vehicle
    if (!vehicle?.make || !vehicle?.model) {
      return NextResponse.json({ error: 'Dati veicolo mancanti' }, { status: 400 })
    }

    const created = await prisma.vehicle.create({
      data: {
        make: String(vehicle.make),
        model: String(vehicle.model),
        trim: vehicle.trim || null,
        year: vehicle.year ? Number(vehicle.year) : null,
        month: vehicle.month ? Number(vehicle.month) : null,
        engine: vehicle.engine || null,
        fuel: vehicle.fuel || null,
        euro: vehicle.euro || null,
        transmission: vehicle.transmission || null,
        drive: vehicle.drive || null,
        km: vehicle.km ? Number(vehicle.km) : null,
        origin: vehicle.origin || null,
        vin: vehicle.vin || null,
        options: vehicle.options || null,
        notes: vehicle.notes || null,
      },
      select: { id: true }
    })

    return NextResponse.json({ id: created.id })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Errore salvataggio' }, { status: 500 })
  }
}
