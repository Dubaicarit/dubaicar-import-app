import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function VehiclesPage(){
  const vehicles = await prisma.vehicle.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border bg-white p-4 md:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Veicoli</h2>
          <Link href="/vehicles/new" className="px-3 py-2 rounded-lg border bg-gray-50 hover:bg-gray-100">+ Nuovo</Link>
        </div>
        {vehicles.length === 0 && <p className="text-sm text-gray-600">Nessun veicolo.</p>}
        <ul className="divide-y">
          {vehicles.map(v => (
            <li key={v.id} className="py-3 flex items-center justify-between">
              <div className="text-sm">
                <div className="font-medium">{v.make} {v.model} {v.trim || ''}</div>
                <div className="text-gray-600">{v.year || ''} · {v.km || 0} km · {v.origin || ''}</div>
              </div>
              <Link href={`/vehicles/${v.id}`} className="text-blue-600 hover:underline">Apri</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
