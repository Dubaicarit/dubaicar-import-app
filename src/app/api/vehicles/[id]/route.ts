import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const data = await prisma.vehicle.findUnique({ where: { id: params.id }, include: { costs: true, market: true } })
  if (!data) return new NextResponse('Not found', { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json()
  const v = body

  // Upsert vehicle
  await prisma.vehicle.update({
    where: { id: params.id },
    data: {
      make: v.make, model: v.model, trim: v.trim || null,
      year: v.year? Number(v.year) : null,
      month: v.month? Number(v.month) : null,
      engine: v.engine || null, fuel: v.fuel || null, euro: v.euro || null,
      transmission: v.transmission || null, drive: v.drive || null,
      km: v.km? Number(v.km) : null, origin: v.origin || null,
      vin: v.vin || null, options: v.options || null, notes: v.notes || null,
    }
  })

  // Replace costs
  await prisma.cost.deleteMany({ where: { vehicleId: params.id } })
  if (Array.isArray(v.costs) && v.costs.length){
    await prisma.cost.createMany({ data: v.costs.map((c:any)=> ({
      vehicleId: params.id, label: String(c.label||'Voce'), amount: Number(c.amount||0), note: c.note||null
    }))})
  }

  // Upsert market
  if (v.market){
    await prisma.market.upsert({
      where: { vehicleId: params.id },
      update: {
        eurotaxBase: v.market.eurotaxBase!=null ? Number(v.market.eurotaxBase) : null,
        eurotaxKm:   v.market.eurotaxKm!=null ? Number(v.market.eurotaxKm) : null,
        minIT:       v.market.minIT!=null ? Number(v.market.minIT) : null,
        avgIT:       v.market.avgIT!=null ? Number(v.market.avgIT) : null,
        target:      v.market.target!=null ? Number(v.market.target) : null,
        minLink:     v.market.minLink || null,
        otherLinks:  v.market.otherLinks || null,
      },
      create: {
        vehicleId: params.id,
        eurotaxBase: v.market.eurotaxBase!=null ? Number(v.market.eurotaxBase) : null,
        eurotaxKm:   v.market.eurotaxKm!=null ? Number(v.market.eurotaxKm) : null,
        minIT:       v.market.minIT!=null ? Number(v.market.minIT) : null,
        avgIT:       v.market.avgIT!=null ? Number(v.market.avgIT) : null,
        target:      v.market.target!=null ? Number(v.market.target) : null,
        minLink:     v.market.minLink || null,
        otherLinks:  v.market.otherLinks || null,
      }
    })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await prisma.vehicle.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
