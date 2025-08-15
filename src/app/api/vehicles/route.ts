import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const data = await prisma.vehicle.findMany({ include: { costs: true, market: true }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { vehicle } = body
  const created = await prisma.vehicle.create({ data: {
    make: vehicle.make, model: vehicle.model, trim: vehicle.trim || null,
    year: vehicle.year? Number(vehicle.year) : null,
    month: vehicle.month? Number(vehicle.month) : null,
    engine: vehicle.engine || null, fuel: vehicle.fuel || null, euro: vehicle.euro || null,
    transmission: vehicle.transmission || null, drive: vehicle.drive || null,
    km: vehicle.km? Number(vehicle.km) : null, origin: vehicle.origin || null,
    vin: vehicle.vin || null, options: vehicle.options || null, notes: vehicle.notes || null,
  }})
  return NextResponse.json({ id: created.id })
}
