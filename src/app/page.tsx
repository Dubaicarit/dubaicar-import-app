import Link from 'next/link'

export default function Page(){
  return (
    <div className="grid gap-4">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-2">Benvenuto</h2>
        <p className="text-sm text-gray-600">Crea un nuovo veicolo o apri l'elenco per iniziare.</p>
        <div className="mt-4 flex gap-3">
          <Link className="px-3 py-2 rounded-lg border bg-gray-50 hover:bg-gray-100" href="/vehicles/new">+ Nuovo veicolo</Link>
          <Link className="px-3 py-2 rounded-lg border bg-gray-50 hover:bg-gray-100" href="/vehicles">Vai ai veicoli</Link>
        </div>
      </div>
    </div>
  )
}
