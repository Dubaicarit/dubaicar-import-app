import Link from 'next/link'
import { prisma } from '@/lib/prisma'

// ❗️Disattiva prerender/static export per questa pagina: esegui a runtime
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function VehiclesPage() {
  try {
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
  } catch (e) {
    // Fallback elegante se il DB non è raggiungibile in build/preview
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Veicoli</h2>
        <p className="text-sm text-amber-700">
          Database non raggiungibile in questo momento. Riprova ad aprire la pagina tra qualche secondo
          oppure verifica la variabile <code>DATABASE_URL</code> su Vercel.
        </p>
      </div>
    )
  }
}
