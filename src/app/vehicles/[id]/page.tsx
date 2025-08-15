import { prisma } from '@/lib/prisma'
import VehicleEditor from './ui'

export default async function VehicleDetail({ params }: { params: { id: string } }){
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: params.id },
    include: { costs: true, market: true }
  })
  if (!vehicle) return <div className="rounded-2xl border bg-white p-6">Veicolo non trovato.</div>
  return <VehicleEditor initial={vehicle} />
}
